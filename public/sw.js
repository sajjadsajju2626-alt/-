/* eslint-disable no-restricted-globals */
/**
 * Lightweight Service Worker (sw.js) for Daily Adhkar
 * - Precision Millisecond Delay (setTimeout) for Morning (Fajr) and Evening (Asr) Adhkar
 * - High-Frequency 1,000ms (1-second) interval fallback with hasRun_HH_mm deduplication
 * - Instant clearTimeout & rescheduling whenever SYNC_REMINDER_SCHEDULE is received
 * - Uses self.registration.showNotification()
 */

const SW_VERSION = 'adhkar-sw-v3';
const SCHEDULE_CACHE_NAME = 'adhkar-sw-schedule-cache-v1';
const SCHEDULE_CACHE_KEY = '/__adhkar_sw_schedule__.json';

let scheduleState = {
  remindersEnabled: true,
  morningReminderTime: '06:00', // Morning (Fajr)
  eveningReminderTime: '17:30', // Evening (Asr)
  goalReminderEnabled: false,
  dailyGoalReminderTime: '20:00',
  morningCompleted: false,
  eveningCompleted: false,
  goalCompleted: false,
  overallDailyProgress: 0,
  lastFiredMorningDate: '',
  lastFiredEveningDate: '',
  lastFiredGoalDate: '',
};

let checkIntervalId = null;
let morningTimeoutId = null;
let eveningTimeoutId = null;
let goalTimeoutId = null;
const hasRunMinuteFlags = new Set();

function getTodayDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseTimeString(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') {
    return { hours: 0, minutes: 0 };
  }
  const parts = timeStr.split(':');
  const hours = parseInt(parts[0] || '0', 10);
  const minutes = parseInt(parts[1] || '0', 10);
  return {
    hours: isNaN(hours) ? 0 : Math.min(23, Math.max(0, hours)),
    minutes: isNaN(minutes) ? 0 : Math.min(59, Math.max(0, minutes)),
  };
}

function getMsUntilNextTime(timeStr, fromDate) {
  const { hours, minutes } = parseTimeString(timeStr);
  const targetDate = new Date(fromDate.getTime());
  targetDate.setHours(hours, minutes, 0, 0);
  if (targetDate.getTime() <= fromDate.getTime()) {
    targetDate.setDate(targetDate.getDate() + 1);
  }
  return targetDate.getTime() - fromDate.getTime();
}

function buildMinuteFlag(period, dateStr, timeStr) {
  const { hours, minutes } = parseTimeString(timeStr);
  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  return `hasRun_${period}_${dateStr}_${hh}_${mm}`;
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

async function displayServiceWorkerNotification(payload) {
  if (!self.registration || typeof self.registration.showNotification !== 'function') {
    return false;
  }

  const title = payload.title || 'Daily Adhkar';
  const options = {
    body: payload.body || 'രാവിലെത്തെ ദിക്റുകൾ ചൊല്ലാൻ സമയമായി 🌅',
    icon: payload.icon || 'icon.png',
    badge: payload.badge || 'icon.png',
    tag: payload.tag || 'daily-adhkar-reminder',
    renotify: true,
    vibrate: [180, 80, 180],
    data: {
      tab: payload.targetTab || 'morning',
      period: payload.period || 'morning',
      isCatchUp: Boolean(payload.isCatchUp),
      url: payload.url || `/?tab=${encodeURIComponent(payload.targetTab || 'morning')}`,
    },
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
  const flagKey = buildMinuteFlag(period, todayStr, timeStr);

  if (hasRunMinuteFlags.has(flagKey)) {
    return;
  }
  hasRunMinuteFlags.add(flagKey);

  if (period === 'morning') {
    scheduleState.lastFiredMorningDate = todayStr;
    await saveScheduleToCache(scheduleState);
    const notifPayload = {
      period: 'morning',
      isCatchUp: false,
      dateStr: todayStr,
      timeStr,
      title: 'Daily Adhkar — Morning (Fajr)',
      body: 'രാവിലെത്തെ ദിക്റുകൾ ചൊല്ലാൻ സമയമായി 🌅',
      arabicSubtitle: 'أَذْكَارُ الصَّبَاحِ (الفجر)',
      malayalamSubtitle: 'പ്രഭാത ദിക്റുകൾ (ഫജ്റ്) • Morning Adhkar',
      targetTab: 'morning',
      tag: `sw-morning-adhkar-${todayStr}-${timeStr}`,
      icon: 'icon.png',
    };
    await displayServiceWorkerNotification(notifPayload);
    await broadcastReminderToClients(notifPayload);
  } else if (period === 'evening') {
    scheduleState.lastFiredEveningDate = todayStr;
    await saveScheduleToCache(scheduleState);
    const notifPayload = {
      period: 'evening',
      isCatchUp: false,
      dateStr: todayStr,
      timeStr,
      title: 'Daily Adhkar — Evening (Asr)',
      body: 'വൈകുന്നേരത്തെ ദിക്റുകൾ ചൊല്ലാൻ സമയമായി 🌙',
      arabicSubtitle: 'أَذْكَارُ الْمَسَاءِ (العصر)',
      malayalamSubtitle: 'സായാഹ്ന ദിക്റുകൾ (അസർ) • Evening Adhkar',
      targetTab: 'evening',
      tag: `sw-evening-adhkar-${todayStr}-${timeStr}`,
      icon: 'icon.png',
    };
    await displayServiceWorkerNotification(notifPayload);
    await broadcastReminderToClients(notifPayload);
  } else if (period === 'goal') {
    scheduleState.lastFiredGoalDate = todayStr;
    await saveScheduleToCache(scheduleState);
    const notifPayload = {
      period: 'goal',
      isCatchUp: false,
      dateStr: todayStr,
      timeStr,
      title: 'Daily Adhkar — Goal Reminder',
      body: 'ഇന്നത്തെ ദിക്റുകളും ലക്ഷ്യങ്ങളും പൂർത്തിയാക്കാൻ സമയമായി 🎯',
      arabicSubtitle: 'تَذْكِيرُ الْأَهْدَافِ الْيَوْمِيَّةِ',
      malayalamSubtitle: 'ഇന്നത്തെ ലക്ഷ്യം പൂർത്തിയാക്കാം',
      targetTab: 'morning',
      tag: `sw-goal-adhkar-${todayStr}-${timeStr}`,
      icon: 'icon.png',
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
  if (goalTimeoutId !== null) {
    clearTimeout(goalTimeoutId);
    goalTimeoutId = null;
  }
}

function armPrecisionTimeouts() {
  clearPrecisionTimeouts();

  if (scheduleState.remindersEnabled) {
    const morningTime = scheduleState.morningReminderTime || '06:00';
    const msMorning = getMsUntilNextTime(morningTime, new Date());
    morningTimeoutId = setTimeout(async () => {
      await firePeriodNotification('morning', morningTime);
      armPrecisionTimeouts();
    }, msMorning);

    const eveningTime = scheduleState.eveningReminderTime || '17:30';
    const msEvening = getMsUntilNextTime(eveningTime, new Date());
    eveningTimeoutId = setTimeout(async () => {
      await firePeriodNotification('evening', eveningTime);
      armPrecisionTimeouts();
    }, msEvening);
  }

  if (scheduleState.goalReminderEnabled) {
    const goalTime = scheduleState.dailyGoalReminderTime || '20:00';
    const msGoal = getMsUntilNextTime(goalTime, new Date());
    goalTimeoutId = setTimeout(async () => {
      await firePeriodNotification('goal', goalTime);
      armPrecisionTimeouts();
    }, msGoal);
  }
}

function checkEverySecond() {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();

  if (scheduleState.remindersEnabled) {
    const morningParsed = parseTimeString(scheduleState.morningReminderTime || '06:00');
    if (h === morningParsed.hours && m === morningParsed.minutes && s === 0) {
      firePeriodNotification('morning', scheduleState.morningReminderTime || '06:00').catch(() => {});
    }

    const eveningParsed = parseTimeString(scheduleState.eveningReminderTime || '17:30');
    if (h === eveningParsed.hours && m === eveningParsed.minutes && s === 0) {
      firePeriodNotification('evening', scheduleState.eveningReminderTime || '17:30').catch(() => {});
    }
  }

  if (scheduleState.goalReminderEnabled) {
    const goalParsed = parseTimeString(scheduleState.dailyGoalReminderTime || '20:00');
    if (h === goalParsed.hours && m === goalParsed.minutes && s === 0) {
      firePeriodNotification('goal', scheduleState.dailyGoalReminderTime || '20:00').catch(() => {});
    }
  }
}

function ensureBackgroundCheckLoop() {
  if (checkIntervalId !== null) {
    clearInterval(checkIntervalId);
  }
  checkIntervalId = setInterval(checkEverySecond, 1000);
}

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      await self.clients.claim();
      await loadScheduleFromCache();
      armPrecisionTimeouts();
      ensureBackgroundCheckLoop();
    })()
  );
});

self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || typeof data !== 'object') return;

  if (data.type === 'SYNC_REMINDER_SCHEDULE') {
    event.waitUntil(
      (async () => {
        await loadScheduleFromCache();
        const incoming = data.schedule || {};
        if (
          incoming.morningReminderTime &&
          incoming.morningReminderTime !== scheduleState.morningReminderTime
        ) {
          hasRunMinuteFlags.clear();
        }
        if (
          incoming.eveningReminderTime &&
          incoming.eveningReminderTime !== scheduleState.eveningReminderTime
        ) {
          hasRunMinuteFlags.clear();
        }
        scheduleState = {
          ...scheduleState,
          ...incoming,
        };
        await saveScheduleToCache(scheduleState);
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

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetTab = (event.notification.data && event.notification.data.tab) || 'morning';
  const targetUrl = `/?tab=${encodeURIComponent(targetTab)}`;

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ('focus' in client) {
            client.postMessage({
              type: 'ADHKAR_NOTIFICATION_CLICK',
              tab: targetTab,
            });
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
        return undefined;
      })
  );
});
