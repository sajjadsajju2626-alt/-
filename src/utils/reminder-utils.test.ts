import test from 'node:test';
import assert from 'node:assert/strict';
import {
  withTimeout,
  parseTimeString,
  getMsUntilNextTime,
  isReminderDue,
  isExactSecondReminderDue,
  buildMinuteRunFlagKey,
  formatMsUntilNextTrigger,
  getNextMinuteTimeString,
  isReminderDueWithinWindow,
  formatTimeDisplay,
  evaluateMissedAdhkarCatchUp,
  subscribeToInAppNotifications,
  dispatchMobileSafeNotification,
  triggerLocalInAppReminder,
  LOCAL_ADHKAR_REMINDER_MESSAGES,
  InAppNotificationEvent,
} from './reminder-utils.ts';

test('withTimeout resolves fast promises and rejects hanging promises (e.g. missing sw.js)', async () => {
  const fastResult = await withTimeout(Promise.resolve('ok'), 100);
  assert.equal(fastResult, 'ok');

  const neverResolves = new Promise<string>(() => {
    // simulates navigator.serviceWorker.ready hanging when sw.js is missing
  });
  await assert.rejects(
    () => withTimeout(neverResolves, 50, 'SW timed out'),
    /SW timed out/
  );
});

test('parseTimeString handles valid and invalid inputs gracefully', () => {
  assert.deepEqual(parseTimeString('06:30'), { hours: 6, minutes: 30 });
  assert.deepEqual(parseTimeString('17:45'), { hours: 17, minutes: 45 });
  assert.deepEqual(parseTimeString('00:00'), { hours: 0, minutes: 0 });
  assert.deepEqual(parseTimeString('23:59'), { hours: 23, minutes: 59 });

  assert.deepEqual(parseTimeString('25:70'), { hours: 23, minutes: 59 });
  assert.deepEqual(parseTimeString('invalid'), { hours: 0, minutes: 0 });
});

test('getMsUntilNextTime calculates exact milliseconds until :00 seconds of target time today or tomorrow', () => {
  const now1 = new Date(2026, 9, 24, 10, 0, 0, 0);
  const ms1 = getMsUntilNextTime('10:30', now1);
  assert.equal(ms1, 30 * 60 * 1000);

  // Mid-minute with milliseconds: 10:29:45.250 -> 10:30:00.000 is exactly 14,750 ms
  const nowMidMinute = new Date(2026, 9, 24, 10, 29, 45, 250);
  assert.equal(getMsUntilNextTime('10:30', nowMidMinute), 14750);

  const now2 = new Date(2026, 9, 24, 21, 0, 0, 0);
  const ms2 = getMsUntilNextTime('06:00', now2);
  assert.equal(ms2, 9 * 60 * 60 * 1000);

  const now3 = new Date(2026, 9, 24, 10, 0, 0, 0);
  const ms3 = getMsUntilNextTime('10:00', now3);
  assert.equal(ms3, 24 * 60 * 60 * 1000);
});

test('isExactSecondReminderDue triggers only at :00 seconds of target hour and minute', () => {
  assert.equal(isExactSecondReminderDue('10:30', 10, 30, 0), true);
  assert.equal(isExactSecondReminderDue('10:30', 10, 30, 1), false);
  assert.equal(isExactSecondReminderDue('10:30', 10, 29, 59), false);
  assert.equal(isExactSecondReminderDue('05:30', 5, 30, 0), true);
});

test('buildMinuteRunFlagKey, formatMsUntilNextTrigger, and getNextMinuteTimeString work accurately', () => {
  assert.equal(buildMinuteRunFlagKey('10:30'), 'hasRun_10_30');
  assert.equal(
    buildMinuteRunFlagKey('10:30', 'morning', '2026-10-27'),
    'hasRun_morning_2026-10-27_10_30'
  );
  assert.equal(formatMsUntilNextTrigger(45000), '45s');
  assert.equal(formatMsUntilNextTrigger(125000), '2m 05s');
  assert.equal(formatMsUntilNextTrigger(3665000), '1h 01m 05s');

  const sampleNow = new Date(2026, 9, 24, 10, 29, 42, 0);
  assert.equal(getNextMinuteTimeString(sampleNow), '10:30');
});

test('isReminderDue detects exact match correctly', () => {
  assert.equal(isReminderDue('06:00', 6, 0), true);
  assert.equal(isReminderDue('17:30', 17, 30), true);
  assert.equal(isReminderDue('17:30', 17, 31), false);
  assert.equal(isReminderDue('06:00', 7, 0), false);
});

test('isReminderDueWithinWindow supports mobile background timer catch-up', () => {
  assert.equal(isReminderDueWithinWindow('06:00', 6, 0, 180), true);
  assert.equal(isReminderDueWithinWindow('06:00', 6, 25, 180), true);
  assert.equal(isReminderDueWithinWindow('06:00', 9, 0, 180), true);
  assert.equal(isReminderDueWithinWindow('06:00', 9, 1, 180), false);
  assert.equal(isReminderDueWithinWindow('06:00', 5, 59, 180), false);
});

test('formatTimeDisplay formats 24h to 12h AM/PM properly', () => {
  assert.equal(formatTimeDisplay('06:00'), '6:00 AM');
  assert.equal(formatTimeDisplay('12:00'), '12:00 PM');
  assert.equal(formatTimeDisplay('17:30'), '5:30 PM');
  assert.equal(formatTimeDisplay('00:15'), '12:15 AM');
});

test('evaluateMissedAdhkarCatchUp detects missed Morning (Fajr) and Evening (Asr) Adhkar on app reopen', () => {
  const morningCatchUp = evaluateMissedAdhkarCatchUp({
    remindersEnabled: true,
    morningReminderTime: '06:00',
    eveningReminderTime: '17:30',
    morningProgressPercent: 20,
    eveningProgressPercent: 0,
    currentHours: 8,
    currentMinutes: 15,
    todayStr: '2026-10-27',
    lastMorningNotifDate: null,
    lastEveningNotifDate: null,
    isAppReopen: true,
  });

  assert.ok(morningCatchUp);
  assert.equal(morningCatchUp.period, 'morning');
  assert.equal(morningCatchUp.isCatchUp, true);
  assert.equal(morningCatchUp.minutesLate, 135);
  assert.equal(morningCatchUp.targetTab, 'morning');
  assert.ok(morningCatchUp.title.includes('Morning (Fajr)'));

  const eveningCatchUp = evaluateMissedAdhkarCatchUp({
    remindersEnabled: true,
    morningReminderTime: '06:00',
    eveningReminderTime: '17:30',
    morningProgressPercent: 100,
    eveningProgressPercent: 0,
    currentHours: 19,
    currentMinutes: 0,
    todayStr: '2026-10-27',
    lastMorningNotifDate: '2026-10-27',
    lastEveningNotifDate: null,
    isAppReopen: true,
  });

  assert.ok(eveningCatchUp);
  assert.equal(eveningCatchUp.period, 'evening');
  assert.equal(eveningCatchUp.isCatchUp, true);
  assert.equal(eveningCatchUp.minutesLate, 90);
  assert.equal(eveningCatchUp.targetTab, 'evening');
  assert.ok(eveningCatchUp.title.includes('Evening (Asr)'));
});

test('Dual-Trigger Step 3: delivers instant In-App Toast ("നോട്ടിഫിക്കേഷൻ അയച്ചു!") when WebView blocks system notifications', async () => {
  const receivedEvents: InAppNotificationEvent[] = [];
  const unsubscribe = subscribeToInAppNotifications((ev) => {
    receivedEvents.push(ev);
  });

  try {
    const channel = await dispatchMobileSafeNotification(
      'Daily Adhkar',
      LOCAL_ADHKAR_REMINDER_MESSAGES.morning,
      undefined,
      {
        arabicSubtitle: 'أَذْكَارُ الصَّبَاحِ',
        malayalamSubtitle: 'രാവിലെത്തെ ദിക്റുകൾ ചൊല്ലാൻ സമയമായി 🌅',
        targetTab: 'morning',
        tag: 'unit-test-reminder',
        icon: 'icon.png',
      }
    );

    assert.equal(channel, 'in-app-fallback');
    assert.ok(receivedEvents.length >= 1);
    const finalEvent = receivedEvents[receivedEvents.length - 1];
    assert.equal(finalEvent.title, 'Daily Adhkar');
    assert.equal(finalEvent.body, 'രാവിലെത്തെ ദിക്റുകൾ ചൊല്ലാൻ സമയമായി 🌅');
    assert.ok(finalEvent.debugToastText.includes('നോട്ടിഫിക്കേഷൻ അയച്ചു!'));
    assert.equal(finalEvent.channel, 'in-app-fallback');
  } finally {
    unsubscribe();
  }
});

test('Dual-Trigger Step 1: uses navigator.serviceWorker.ready.then(reg => reg.showNotification(...)) when SW responds within 500ms', async () => {
  const swNotifications: Array<{ title: string; options?: NotificationOptions }> = [];
  let nativeConstructed = false;

  const origWindow = (globalThis as Record<string, unknown>).window;
  const origNavigator = (globalThis as Record<string, unknown>).navigator;
  const origNotification = (globalThis as Record<string, unknown>).Notification;

  class MockNotification {
    static permission: NotificationPermission = 'granted';
    constructor() {
      nativeConstructed = true;
    }
  }

  const mockSwReg = {
    active: {},
    async showNotification(title: string, options?: NotificationOptions) {
      swNotifications.push({ title, options });
    },
  };

  (globalThis as Record<string, unknown>).window = { Notification: MockNotification };
  (globalThis as Record<string, unknown>).Notification = MockNotification;
  Object.defineProperty(globalThis, 'navigator', {
    value: {
      userAgent: 'Mozilla/5.0 (Linux; Android 14)',
      serviceWorker: {
        ready: Promise.resolve(mockSwReg),
        async getRegistration() {
          return mockSwReg;
        },
        async register() {
          return mockSwReg;
        },
      },
    },
    configurable: true,
  });

  try {
    const channel = await triggerLocalInAppReminder();
    assert.equal(channel, 'service-worker');
    assert.equal(nativeConstructed, false);
    assert.equal(swNotifications.length, 1);
    assert.equal(swNotifications[0].title, 'Daily Adhkar');
    assert.equal(
      swNotifications[0].options?.body,
      'രാവിലെത്തെ ദിക്റുകൾ ചൊല്ലാൻ സമയമായി 🌅'
    );
  } finally {
    (globalThis as Record<string, unknown>).window = origWindow;
    (globalThis as Record<string, unknown>).Notification = origNotification;
    Object.defineProperty(globalThis, 'navigator', {
      value: origNavigator,
      configurable: true,
    });
  }
});

test('Dual-Trigger Step 2: falls back to native new Notification("Daily Adhkar", { ... }) if sw.js is missing or takes > 500ms', async () => {
  const nativeNotifications: Array<{ title: string; options?: NotificationOptions }> = [];

  const origWindow = (globalThis as Record<string, unknown>).window;
  const origNavigator = (globalThis as Record<string, unknown>).navigator;
  const origNotification = (globalThis as Record<string, unknown>).Notification;

  class MockNotification {
    static permission: NotificationPermission = 'granted';
    onclick: (() => void) | null = null;
    constructor(title: string, options?: NotificationOptions) {
      nativeNotifications.push({ title, options });
    }
    close() {}
  }

  // Simulate missing sw.js where navigator.serviceWorker.ready never resolves
  const hangingPromise = new Promise(() => {});

  (globalThis as Record<string, unknown>).window = { Notification: MockNotification };
  (globalThis as Record<string, unknown>).Notification = MockNotification;
  Object.defineProperty(globalThis, 'navigator', {
    value: {
      userAgent: 'Mozilla/5.0',
      serviceWorker: {
        ready: hangingPromise,
        getRegistration: () => hangingPromise,
        register: () => hangingPromise,
      },
    },
    configurable: true,
  });

  try {
    const startMs = Date.now();
    const channel = await dispatchMobileSafeNotification(
      'Daily Adhkar',
      LOCAL_ADHKAR_REMINDER_MESSAGES.morning
    );
    const elapsedMs = Date.now() - startMs;

    assert.equal(channel, 'notification-api');
    assert.ok(elapsedMs < 1200, `Expected fallback after ~500ms, took ${elapsedMs}ms`);
    assert.equal(nativeNotifications.length, 1);
    assert.equal(nativeNotifications[0].title, 'Daily Adhkar');
    assert.equal(
      nativeNotifications[0].options?.body,
      'രാവിലെത്തെ ദിക്റുകൾ ചൊല്ലാൻ സമയമായി 🌅'
    );
  } finally {
    (globalThis as Record<string, unknown>).window = origWindow;
    (globalThis as Record<string, unknown>).Notification = origNotification;
    Object.defineProperty(globalThis, 'navigator', {
      value: origNavigator,
      configurable: true,
    });
  }
});
