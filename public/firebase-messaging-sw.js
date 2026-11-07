/* eslint-disable no-restricted-globals */
/**
 * Firebase Messaging & Background Push & Persistent Reminder Service Worker
 * (firebase-messaging-sw.js)
 * - Maximum Priority Background Push & Notification Handling
 * - Persistent Background Alarm / Sync Loop (IndexedDB + 1,000ms Interval + Precision Timeout)
 * - Fires Morning, Evening, Sleep, and Goal reminders even when app is minimized / screen is off
 * - Full 12-hour/24-hour parsing (Evening 2:17 PM -> 14:17) and once-per-day deduplication
 * - Wakes up Android / background workers even after swipe away from recent apps
 */

const SW_VERSION = 'mudawama-sw-v1.0.2';
const DB_NAME = 'mudawama_reminders_db';
const STORE_NAME = 'reminder_schedule';
const SCHEDULE_KEY = 'current_schedule';
const SCHEDULE_CACHE_NAME = 'adhkar-sw-schedule-cache-v1';
const SCHEDULE_CACHE_KEY = '/__adhkar_sw_schedule__.json';

let scheduleState = {
  remindersEnabled: true,
  morningReminderTime: '06:00',
  eveningReminderTime: '17:30',
  sleepReminderTime: '22:00',
  goalReminderEnabled: false,
  dailyGoalReminderTime: '20:00',
  morningCompleted: false,
  eveningCompleted: false,
  sleepCompleted: false,
  goalCompleted: false,
  overallDailyProgress: 0,
  lastFiredMorningDate: '',
  lastFiredEveningDate: '',
  lastFiredSleepDate: '',
  lastFiredGoalDate: '',
};

let checkIntervalId = null;
let morningTimeoutId = null;
let eveningTimeoutId = null;
let sleepTimeoutId = null;
let goalTimeoutId = null;
const hasRunMinuteFlags = new Set();

function getTodayDateString(date) {
  const d = date || new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function normalizeTo24HourTime(timeStr, periodHint) {
  if (!timeStr || typeof timeStr !== 'string') {
    if (periodHint === 'morning') return '06:00';
    if (periodHint === 'evening') return '17:30';
    if (periodHint === 'sleep') return '22:00';
    if (periodHint === 'goal') return '20:00';
    return '00:00';
  }
  const trimmed = timeStr.trim();
  const isPM = /pm|വൈകുന്നേരം|രാത്രി/i.test(trimmed);
  const isAM = /am|രാവിലെ|പ്രഭാതം/i.test(trimmed);

  const match = trimmed.match(/(\d{1,2})[:.](\d{1,2})/);
  if (!match) {
    if (periodHint === 'morning') return '06:00';
    if (periodHint === 'evening') return '17:30';
    if (periodHint === 'sleep') return '22:00';
    if (periodHint === 'goal') return '20:00';
    return '00:00';
  }

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);

  if (isNaN(hours) || isNaN(minutes)) {
    if (periodHint === 'morning') return '06:00';
    if (periodHint === 'evening') return '17:30';
    if (periodHint === 'sleep') return '22:00';
    if (periodHint === 'goal') return '20:00';
    return '00:00';
  }

  if (isPM) {
    if (hours < 12) hours += 12;
  } else if (isAM) {
    if (hours === 12) hours = 0;
  } else if (periodHint === 'evening') {
    // If entered in Evening context without AM/PM and hours is 1..11 (e.g. 2:17 or 5:30),
    // normalize to afternoon/evening PM time (2:17 -> 14:17, 5:30 -> 17:30)
    if (hours > 0 && hours < 12) {
      hours += 12;
    }
  } else if (periodHint === 'sleep') {
    // If entered in Sleep context without AM/PM and hours is 7..11 (e.g. 10:00),
    // normalize to night PM time (10:00 -> 22:00)
    if (hours >= 7 && hours < 12) {
      hours += 12;
    }
  }

  const safeHours = Math.min(23, Math.max(0, hours));
  const safeMinutes = Math.min(59, Math.max(0, minutes));
  return `${String(safeHours).padStart(2, '0')}:${String(safeMinutes).padStart(2, '0')}`;
}

function parseTimeString(timeStr, periodHint) {
  const normalized = normalizeTo24HourTime(timeStr, periodHint);
  const parts = normalized.split(':');
  const hours = parseInt(parts[0] || '0', 10);
  const minutes = parseInt(parts[1] || '0', 10);
  return {
    hours: isNaN(hours) ? 0 : Math.min(23, Math.max(0, hours)),
    minutes: isNaN(minutes) ? 0 : Math.min(59, Math.max(0, minutes)),
  };
}

function getMsUntilNextTime(timeStr, fromDate, periodHint) {
  const { hours, minutes } = parseTimeString(timeStr, periodHint);
  const targetDate = new Date(fromDate.getTime());
  targetDate.setHours(hours, minutes, 0, 0);
  if (targetDate.getTime() <= fromDate.getTime()) {
    targetDate.setDate(targetDate.getDate() + 1);
  }
  return targetDate.getTime() - fromDate.getTime();
}

function buildMinuteFlag(period, dateStr, timeStr, periodHint) {
  const { hours, minutes } = parseTimeString(timeStr, periodHint);
  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  return `hasRun_${period}_${dateStr}_${hh}_${mm}`;
}

function openDB() {
  if (typeof indexedDB === 'undefined') return Promise.resolve(null);
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function loadScheduleFromIndexedDB() {
  try {
    const db = await openDB();
    if (!db) return null;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(SCHEDULE_KEY);
        req.onsuccess = () => {
          db.close();
          if (req.result && typeof req.result === 'object') {
            scheduleState = { ...scheduleState, ...req.result };
            resolve(scheduleState);
          } else {
            resolve(null);
          }
        };
        req.onerror = () => {
          db.close();
          resolve(null);
        };
      } catch {
        db.close();
        resolve(null);
      }
    });
  } catch {
    return null;
  }
}

async function saveScheduleToIndexedDB(state) {
  try {
    const db = await openDB();
    if (!db) return false;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.put(state, SCHEDULE_KEY);
        tx.oncomplete = () => {
          db.close();
          resolve(true);
        };
        tx.onerror = () => {
          db.close();
          resolve(false);
        };
      } catch {
        db.close();
        resolve(false);
      }
    });
  } catch {
    return false;
  }
}

async function saveScheduleToCache(state) {
  try {
    if (typeof caches === 'undefined') return;
    const cache = await caches.open(SCHEDULE_CACHE_NAME);
    const response = new Response(JSON.stringify(state), {
      headers: { 'Content-Type': 'application/json' },
    });
    await cache.put(SCHEDULE_CACHE_KEY, response);
  } catch {
    // Ignore storage errors
  }
}

async function loadScheduleFromCache() {
  try {
    if (typeof caches === 'undefined') return null;
    const cache = await caches.open(SCHEDULE_CACHE_NAME);
    const res = await cache.match(SCHEDULE_CACHE_KEY);
    if (!res) return null;
    const data = await res.json();
    if (data && typeof data === 'object') {
      scheduleState = { ...scheduleState, ...data };
      return scheduleState;
    }
  } catch {
    // Ignore cache read errors
  }
  return null;
}

async function persistSchedule(state) {
  await Promise.all([
    saveScheduleToIndexedDB(state),
    saveScheduleToCache(state),
  ]);
}

async function restoreSchedule() {
  const fromDB = await loadScheduleFromIndexedDB();
  if (fromDB) return fromDB;
  return await loadScheduleFromCache();
}

async function displayServiceWorkerNotification(payload) {
  if (!self.registration || typeof self.registration.showNotification !== 'function') {
    return false;
  }

  const title = payload.title || 'മുദാവമ • Mudawamah';
  const options = {
    body: payload.body || 'ദിക്റുകൾ ചൊല്ലാനുള്ള സമയമായി',
    icon: payload.icon || './icon.png',
    badge: payload.badge || './badge.png',
    tag: payload.tag || 'adhkar-scheduled',
    renotify: true,
    requireInteraction: true,
    vibrate: [200, 100, 200],
    silent: false,
    timestamp: Date.now(),
    data: {
      url: payload.url || `./?tab=${encodeURIComponent(payload.targetTab || 'morning')}`,
      tab: payload.targetTab || 'morning',
      period: payload.period || 'morning',
      time: Date.now(),
      ...payload.data,
    },
    actions: [
      { action: 'open', title: 'തുറക്കുക (Open)' },
    ],
  };

  try {
    await self.registration.showNotification(title, options);
    return true;
  } catch {
    return false;
  }
}

async function broadcastReminderToClients(eventPayload) {
  try {
    const clientList = await self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true,
    });
    for (const client of clientList) {
      client.postMessage({
        type: 'SW_REMINDER_FIRED',
        ...eventPayload,
      });
    }
  } catch {
    // Ignore client broadcast errors
  }
}

async function firePeriodNotification(period, timeStr) {
  const now = new Date();
  const todayStr = getTodayDateString(now);
  const flagKey = buildMinuteFlag(period, todayStr, timeStr, period);

  if (hasRunMinuteFlags.has(flagKey)) {
    return;
  }
  hasRunMinuteFlags.add(flagKey);

  if (!scheduleState.lastNotified || typeof scheduleState.lastNotified !== 'object') {
    scheduleState.lastNotified = { morning: '', evening: '', sleep: '', goal: '' };
  }

  if (period === 'morning') {
    if (scheduleState.lastFiredMorningDate === todayStr || scheduleState.lastNotified.morning === todayStr) return;
    scheduleState.lastFiredMorningDate = todayStr;
    scheduleState.lastNotified.morning = todayStr;
    await persistSchedule(scheduleState);

    const notifPayload = {
      period: 'morning',
      title: 'പ്രഭാത ദിക്റുകൾ • Morning Adhkar',
      body: 'സുബ്ഹിക്കു ശേഷമുള്ള ദിക്റുകൾ ചൊല്ലാൻ സമയമായി.',
      arabicSubtitle: 'أَذْكَارُ الصَّبَاحِ (الفجر)',
      malayalamSubtitle: 'പ്രഭാത ദിക്റുകൾ • Morning Adhkar',
      targetTab: 'morning',
      tag: 'adhkar-scheduled',
      icon: './icon.png',
      badge: './badge.png',
    };
    await displayServiceWorkerNotification(notifPayload);
    await broadcastReminderToClients(notifPayload);
  } else if (period === 'evening') {
    if (scheduleState.lastFiredEveningDate === todayStr || scheduleState.lastNotified.evening === todayStr) return;
    scheduleState.lastFiredEveningDate = todayStr;
    scheduleState.lastNotified.evening = todayStr;
    await persistSchedule(scheduleState);

    const notifPayload = {
      period: 'evening',
      title: 'പ്രദോഷ ദിക്റുകൾ • Evening Adhkar',
      body: 'അസ്വർ/മഗ്രിബിന് ശേഷമുള്ള ദിക്റുകൾ ചൊല്ലാൻ സമയമായി.',
      arabicSubtitle: 'أَذْكَارُ الْمَسَاءِ (العصر)',
      malayalamSubtitle: 'പ്രദോഷ ദിക്റുകൾ • Evening Adhkar',
      targetTab: 'evening',
      tag: 'adhkar-scheduled',
      icon: './icon.png',
      badge: './badge.png',
    };
    await displayServiceWorkerNotification(notifPayload);
    await broadcastReminderToClients(notifPayload);
  } else if (period === 'sleep') {
    if (scheduleState.lastFiredSleepDate === todayStr || scheduleState.lastNotified.sleep === todayStr) return;
    scheduleState.lastFiredSleepDate = todayStr;
    scheduleState.lastNotified.sleep = todayStr;
    await persistSchedule(scheduleState);

    const notifPayload = {
      period: 'sleep',
      title: 'ഉറങ്ങുന്ന നേരത്തെ ദിക്റുകൾ • Sleep Adhkar',
      body: 'ഉറങ്ങുന്നതിന് മുൻപുള്ള ദിക്റുകളും ദുആകളും ചൊല്ലാം.',
      arabicSubtitle: 'أَذْكَارُ النَّوْمِ',
      malayalamSubtitle: 'ഉറങ്ങുന്ന നേരത്തെ ദിക്റുകൾ • Sleep Adhkar',
      targetTab: 'sleep',
      tag: 'adhkar-scheduled',
      icon: './icon.png',
      badge: './badge.png',
    };
    await displayServiceWorkerNotification(notifPayload);
    await broadcastReminderToClients(notifPayload);
  } else if (period === 'goal') {
    if (scheduleState.lastFiredGoalDate === todayStr || scheduleState.lastNotified.goal === todayStr) return;
    if (scheduleState.goalCompleted) return;
    scheduleState.lastFiredGoalDate = todayStr;
    scheduleState.lastNotified.goal = todayStr;
    await persistSchedule(scheduleState);

    const notifPayload = {
      period: 'goal',
      title: 'Daily Adhkar — Goal Reminder',
      body: 'ഇന്നത്തെ ദിക്റുകളും ലക്ഷ്യങ്ങളും പൂർത്തിയാക്കാൻ സമയമായി 🎯',
      arabicSubtitle: 'تَذْكِيرُ الْأَهْدَافِ الْيَوْمِيَّةِ',
      malayalamSubtitle: 'ഇന്നത്തെ ലക്ഷ്യം പൂർത്തിയാക്കാം',
      targetTab: 'morning',
      tag: 'adhkar-scheduled',
      icon: './icon.png',
      badge: './badge.png',
    };
    await displayServiceWorkerNotification(notifPayload);
    await broadcastReminderToClients(notifPayload);
  }
}

function clearPrecisionTimeouts() {
  if (morningTimeoutId !== null) {
    clearTimeout(morningTimeoutId);
    morningTimeoutId = null;
  }
  if (eveningTimeoutId !== null) {
    clearTimeout(eveningTimeoutId);
    eveningTimeoutId = null;
  }
  if (sleepTimeoutId !== null) {
    clearTimeout(sleepTimeoutId);
    sleepTimeoutId = null;
  }
  if (goalTimeoutId !== null) {
    clearTimeout(goalTimeoutId);
    goalTimeoutId = null;
  }
}

function armPrecisionTimeouts() {
  clearPrecisionTimeouts();

  if (scheduleState.remindersEnabled) {
    // Morning (Fajr)
    const morningTime = normalizeTo24HourTime(scheduleState.morningReminderTime || '06:00', 'morning');
    const msMorning = getMsUntilNextTime(morningTime, new Date(), 'morning');
    morningTimeoutId = setTimeout(async () => {
      await firePeriodNotification('morning', morningTime);
      armPrecisionTimeouts();
    }, msMorning);

    // Evening (Asr)
    const eveningTime = normalizeTo24HourTime(scheduleState.eveningReminderTime || '17:30', 'evening');
    const msEvening = getMsUntilNextTime(eveningTime, new Date(), 'evening');
    eveningTimeoutId = setTimeout(async () => {
      await firePeriodNotification('evening', eveningTime);
      armPrecisionTimeouts();
    }, msEvening);

    // Sleep (Night)
    const sleepTime = normalizeTo24HourTime(scheduleState.sleepReminderTime || '22:00', 'sleep');
    const msSleep = getMsUntilNextTime(sleepTime, new Date(), 'sleep');
    sleepTimeoutId = setTimeout(async () => {
      await firePeriodNotification('sleep', sleepTime);
      armPrecisionTimeouts();
    }, msSleep);
  }

  if (scheduleState.goalReminderEnabled) {
    const goalTime = normalizeTo24HourTime(scheduleState.dailyGoalReminderTime || '20:00', 'goal');
    const msGoal = getMsUntilNextTime(goalTime, new Date(), 'goal');
    goalTimeoutId = setTimeout(async () => {
      await firePeriodNotification('goal', goalTime);
      armPrecisionTimeouts();
    }, msGoal);
  }
}

function checkScheduledAlarms() {
  const currentTime = new Date().toTimeString().slice(0, 5);
  const rem = scheduleState.adhkar_reminders || {};
  const isEnabled = typeof rem.enabled === 'boolean' ? rem.enabled : Boolean(scheduleState.remindersEnabled);

  if (isEnabled) {
    const morningTarget = normalizeTo24HourTime(rem.morning || scheduleState.morningReminderTime || '06:00', 'morning');
    if (currentTime === morningTarget) {
      firePeriodNotification('morning', morningTarget).catch(() => {});
    }

    const eveningTarget = normalizeTo24HourTime(rem.evening || scheduleState.eveningReminderTime || '17:30', 'evening');
    if (currentTime === eveningTarget) {
      firePeriodNotification('evening', eveningTarget).catch(() => {});
    }

    const sleepTarget = normalizeTo24HourTime(rem.sleep || scheduleState.sleepReminderTime || '22:00', 'sleep');
    if (currentTime === sleepTarget) {
      firePeriodNotification('sleep', sleepTarget).catch(() => {});
    }
  }

  if (scheduleState.goalReminderEnabled || rem.goalEnabled) {
    const goalTarget = normalizeTo24HourTime(rem.goal || scheduleState.dailyGoalReminderTime || '20:00', 'goal');
    if (currentTime === goalTarget) {
      firePeriodNotification('goal', goalTarget).catch(() => {});
    }
  }
}

function ensureBackgroundCheckLoop() {
  if (checkIntervalId !== null) {
    clearInterval(checkIntervalId);
  }
  checkScheduledAlarms();
  checkIntervalId = setInterval(checkScheduledAlarms, 15000);
}

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      await self.clients.claim();
      await restoreSchedule();
      armPrecisionTimeouts();
      ensureBackgroundCheckLoop();
    })()
  );
});

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'adhkar-scheduled-check' || event.tag === 'mudawama-reminder-sync') {
    event.waitUntil(
      (async () => {
        await restoreSchedule();
        checkScheduledAlarms();
      })()
    );
  }
});

self.addEventListener('push', function(event) {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data = { notification: { title: 'മുദാവമ • Mudawamah', body: event.data.text() } };
    }
  }

  const title = data.notification?.title || data.data?.title || 'മുദാവമ • Mudawamah';
  const body = data.notification?.body || data.data?.body || 'ദിക്റുകൾ ചൊല്ലാനുള്ള സമയമായി';
  const clickUrl = data.notification?.click_action || data.data?.url || './';

  const options = {
    body: body,
    icon: './icon.png',
    badge: './badge.png',
    tag: 'mudawama-reminder',
    renotify: true,
    requireInteraction: true,
    vibrate: [200, 100, 200],
    silent: false,
    timestamp: Date.now(),
    data: {
      url: clickUrl,
      time: Date.now(),
      ...data,
    },
    actions: [
      { action: 'open', title: 'തുറക്കുക (Open)' },
    ],
  };

  const broadcastPromise = self.clients
    .matchAll({ type: 'window', includeUncontrolled: true })
    .then(function(clientList) {
      clientList.forEach(function(client) {
        client.postMessage({
          type: 'FCM_FOREGROUND_PUSH',
          title: title,
          body: body,
          data: data,
        });
      });
    })
    .catch(function() {});

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(title, options),
      broadcastPromise,
    ])
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const targetTab = (event.notification.data && event.notification.data.tab) || 'morning';
  const clickUrl = (event.notification.data && event.notification.data.url) || `./?tab=${encodeURIComponent(targetTab)}`;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if ('focus' in client) {
          client.postMessage({
            type: 'ADHKAR_NOTIFICATION_CLICK',
            data: event.notification.data,
            tab: targetTab,
          });
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(clickUrl);
      }
    })
  );
});

self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || typeof data !== 'object') return;

  if (data.type === 'SYNC_REMINDER_SCHEDULE' || data.type === 'UPDATE_ADHKAR_REMINDERS') {
    event.waitUntil(
      (async () => {
        await restoreSchedule();
        const incoming = data.schedule || {};
        const incomingRem = data.adhkar_reminders || incoming.adhkar_reminders || {};
        const incomingLastNotified = data.lastNotified || incoming.lastNotified || {};

        const nextMorning = normalizeTo24HourTime(incomingRem.morning || incoming.morningReminderTime || scheduleState.morningReminderTime, 'morning');
        const nextEvening = normalizeTo24HourTime(incomingRem.evening || incoming.eveningReminderTime || scheduleState.eveningReminderTime, 'evening');
        const nextSleep = normalizeTo24HourTime(incomingRem.sleep || incoming.sleepReminderTime || scheduleState.sleepReminderTime || '22:00', 'sleep');
        const nextGoal = normalizeTo24HourTime(incomingRem.goal || incoming.dailyGoalReminderTime || scheduleState.dailyGoalReminderTime || '20:00', 'goal');

        if (nextMorning !== scheduleState.morningReminderTime) {
          hasRunMinuteFlags.clear();
          scheduleState.lastFiredMorningDate = '';
        }
        if (nextEvening !== scheduleState.eveningReminderTime) {
          hasRunMinuteFlags.clear();
          scheduleState.lastFiredEveningDate = '';
        }
        if (nextSleep !== scheduleState.sleepReminderTime) {
          hasRunMinuteFlags.clear();
          scheduleState.lastFiredSleepDate = '';
        }
        if (nextGoal !== scheduleState.dailyGoalReminderTime) {
          hasRunMinuteFlags.clear();
          scheduleState.lastFiredGoalDate = '';
        }

        scheduleState = {
          ...scheduleState,
          ...incoming,
          morningReminderTime: nextMorning,
          eveningReminderTime: nextEvening,
          sleepReminderTime: nextSleep,
          dailyGoalReminderTime: nextGoal,
          adhkar_reminders: {
            morning: nextMorning,
            evening: nextEvening,
            sleep: nextSleep,
            goal: nextGoal,
            enabled: typeof incomingRem.enabled === 'boolean' ? incomingRem.enabled : Boolean(incoming.remindersEnabled),
            goalEnabled: typeof incomingRem.goalEnabled === 'boolean' ? incomingRem.goalEnabled : Boolean(incoming.goalReminderEnabled),
          },
          lastNotified: {
            ...(scheduleState.lastNotified || {}),
            ...incomingLastNotified,
          },
        };

        await persistSchedule(scheduleState);
        armPrecisionTimeouts();
        ensureBackgroundCheckLoop();
      })()
    );
    return;
  }

  if (data.type === 'SHOW_NOTIFICATION') {
    event.waitUntil(displayServiceWorkerNotification(data));
  }
});
