/**
 * Utilities for calculating reminder schedules, Dual-Trigger Notifications
 * (500ms Service Worker race -> native `new Notification()` fallback -> guaranteed
 * animated In-App Toast/Banner + gentle sound), and instant debug feedback
 * ('നോട്ടിഫിക്കേഷൻ അയച്ചു!').
 * Never leaves promises pending if sw.js is missing from the local directory.
 */

export interface ParsedTime {
  hours: number;
  minutes: number;
}

/**
 * Races any promise against a strict timeout in milliseconds so missing files (like sw.js)
 * or unresponsive WebView APIs never leave promises pending.
 */
export function withTimeout<T>(promise: Promise<T>, timeoutMs = 500, timeoutReason = 'timeout'): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(timeoutReason));
    }, timeoutMs);

    promise
      .then((val) => {
        clearTimeout(timer);
        resolve(val);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

/**
 * Parses "HH:mm" time string into hours and minutes numbers.
 * Defaults to 00:00 if invalid.
 */
export function parseTimeString(timeStr: string): ParsedTime {
  if (!timeStr || typeof timeStr !== 'string') {
    return { hours: 0, minutes: 0 };
  }
  const parts = timeStr.split(':');
  const hours = parseInt(parts[0] || '0', 10);
  const minutes = parseInt(parts[1] || '0', 10);

  const safeHours = isNaN(hours) ? 0 : Math.min(23, Math.max(0, hours));
  const safeMinutes = isNaN(minutes) ? 0 : Math.min(59, Math.max(0, minutes));

  return { hours: safeHours, minutes: safeMinutes };
}

/**
 * Calculates milliseconds from `fromDate` until the next occurrence of `timeStr` (HH:mm).
 */
export function getMsUntilNextTime(timeStr: string, fromDate: Date): number {
  const { hours, minutes } = parseTimeString(timeStr);

  const targetDate = new Date(fromDate.getTime());
  targetDate.setHours(hours, minutes, 0, 0);

  if (targetDate.getTime() <= fromDate.getTime()) {
    targetDate.setDate(targetDate.getDate() + 1);
  }

  return targetDate.getTime() - fromDate.getTime();
}

/**
 * Checks if a reminder configured for targetTimeStr matches the given hour and minute.
 */
export function isReminderDue(
  targetTimeStr: string,
  currentHours: number,
  currentMinutes: number
): boolean {
  const { hours, minutes } = parseTimeString(targetTimeStr);
  return hours === currentHours && minutes === currentMinutes;
}

/**
 * High-Frequency 1-Second Interval Check:
 * Returns true at the exact :00 second of the target HH:mm time
 * (now.getHours() === targetH && now.getMinutes() === targetM && now.getSeconds() === 0).
 */
export function isExactSecondReminderDue(
  targetTimeStr: string,
  currentHours: number,
  currentMinutes: number,
  currentSeconds: number
): boolean {
  const { hours, minutes } = parseTimeString(targetTimeStr);
  return hours === currentHours && minutes === currentMinutes && currentSeconds === 0;
}

/**
 * Generates a unique per-minute run flag key (e.g. "hasRun_10_30" or "hasRun_morning_2026-10-27_10_30")
 * so that the precision setTimeout and the 1,000ms setInterval fire once at :00 seconds
 * and never repeat within that same minute.
 */
export function buildMinuteRunFlagKey(
  targetTimeStr: string,
  period?: 'morning' | 'evening' | 'goal',
  dateStr?: string
): string {
  const { hours, minutes } = parseTimeString(targetTimeStr);
  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  if (period && dateStr) {
    return `hasRun_${period}_${dateStr}_${hh}_${mm}`;
  }
  return `hasRun_${hh}_${mm}`;
}

/**
 * Formats milliseconds until the next scheduled trigger as a human-readable countdown
 * (e.g. "12m 34s" or "2h 15m 08s") for live UI feedback.
 */
export function formatMsUntilNextTrigger(ms: number): string {
  const safeMs = Math.max(0, ms);
  const totalSeconds = Math.ceil(safeMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
  }
  return `${seconds}s`;
}

/**
 * Returns the "HH:mm" string for the very next minute from `fromDate`
 * so users can test the automatic :00 second trigger with a single tap.
 */
export function getNextMinuteTimeString(fromDate: Date = new Date()): string {
  const next = new Date(fromDate.getTime() + 60 * 1000);
  const hh = String(next.getHours()).padStart(2, '0');
  const mm = String(next.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

/**
 * Checks if a reminder is due within a mobile catch-up grace window (default 180 minutes)
 * on the same calendar day.
 */
export function isReminderDueWithinWindow(
  targetTimeStr: string,
  currentHours: number,
  currentMinutes: number,
  windowMinutes = 180
): boolean {
  const { hours, minutes } = parseTimeString(targetTimeStr);
  const targetTotalMinutes = hours * 60 + minutes;
  const currentTotalMinutes = currentHours * 60 + currentMinutes;
  const diff = currentTotalMinutes - targetTotalMinutes;
  return diff >= 0 && diff <= Math.max(0, windowMinutes);
}

/**
 * Formats a 24-hour "HH:mm" string into 12-hour "h:mm AM/PM" for display.
 */
export function formatTimeDisplay(timeStr: string): string {
  const { hours, minutes } = parseTimeString(timeStr);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  const displayMin = String(minutes).padStart(2, '0');
  return `${displayHour}:${displayMin} ${period}`;
}

export const LOCAL_ADHKAR_REMINDER_MESSAGES = {
  morning: 'രാവിലെത്തെ ദിക്റുകൾ ചൊല്ലാൻ സമയമായി 🌅',
  evening: 'വൈകുന്നേരത്തെ ദിക്റുകൾ ചൊല്ലാൻ സമയമായി 🌙',
  goal: 'ഇന്നത്തെ ദിക്റുകളും ലക്ഷ്യങ്ങളും പൂർത്തിയാക്കാൻ സമയമായി 🎯',
} as const;

export interface MissedAdhkarCheckInput {
  remindersEnabled: boolean;
  morningReminderTime: string;
  eveningReminderTime: string;
  goalReminderEnabled?: boolean;
  dailyGoalReminderTime?: string;
  morningProgressPercent: number;
  eveningProgressPercent: number;
  overallDailyProgress?: number;
  currentHours: number;
  currentMinutes: number;
  todayStr: string;
  lastMorningNotifDate: string | null;
  lastEveningNotifDate: string | null;
  lastGoalNotifDate?: string | null;
  isAppReopen?: boolean;
}

export interface MissedAdhkarCatchUpResult {
  period: 'morning' | 'evening' | 'goal';
  isCatchUp: boolean;
  minutesLate: number;
  title: string;
  body: string;
  arabicSubtitle: string;
  malayalamSubtitle: string;
  targetTab: 'morning' | 'evening';
  actionLabel: string;
  tag: string;
}

/**
 * Pure automated fallback evaluator that runs whenever the app is reopened.
 * If a scheduled Morning (Fajr) or Evening (Asr) Adhkar period was missed
 * while the screen was off, returns an immediate catch-up alert descriptor.
 */
export function evaluateMissedAdhkarCatchUp(
  input: MissedAdhkarCheckInput
): MissedAdhkarCatchUpResult | null {
  const currentTotalMinutes = input.currentHours * 60 + input.currentMinutes;
  const morningParsed = parseTimeString(input.morningReminderTime || '06:00');
  const eveningParsed = parseTimeString(input.eveningReminderTime || '17:30');
  const morningTargetMinutes = morningParsed.hours * 60 + morningParsed.minutes;
  const eveningTargetMinutes = eveningParsed.hours * 60 + eveningParsed.minutes;

  if (input.remindersEnabled) {
    // 1. Morning (Fajr) Adhkar period: active from morningReminderTime until eveningReminderTime
    if (
      input.morningProgressPercent < 100 &&
      input.lastMorningNotifDate !== input.todayStr &&
      currentTotalMinutes >= morningTargetMinutes &&
      currentTotalMinutes < eveningTargetMinutes
    ) {
      const minutesLate = Math.max(0, currentTotalMinutes - morningTargetMinutes);
      const isCatchUp = minutesLate > 0 || Boolean(input.isAppReopen);

      return {
        period: 'morning',
        isCatchUp,
        minutesLate,
        title: isCatchUp
          ? '🌅 Missed Morning (Fajr) Adhkar • Catch-Up Alert'
          : 'Daily Adhkar — Morning (Fajr)',
        body: isCatchUp
          ? `${LOCAL_ADHKAR_REMINDER_MESSAGES.morning} • Scheduled Fajr Adhkar (${formatTimeDisplay(
              input.morningReminderTime
            )}) was missed while screen was off.`
          : LOCAL_ADHKAR_REMINDER_MESSAGES.morning,
        arabicSubtitle: 'أَذْكَارُ الصَّبَاحِ (الفجر)',
        malayalamSubtitle: isCatchUp
          ? 'പ്രഭാത ദിക്റുകൾ (ഫജ്റ്) • Screen-Off Catch-Up'
          : 'പ്രഭാത ദിക്റുകൾ (ഫജ്റ്) • Morning Adhkar',
        targetTab: 'morning',
        actionLabel: 'Recite Morning (Fajr) Adhkar',
        tag: `morning-adhkar-${input.todayStr}`,
      };
    }

    // 2. Evening (Asr) Adhkar period: active from eveningReminderTime until midnight (23:59)
    if (
      input.eveningProgressPercent < 100 &&
      input.lastEveningNotifDate !== input.todayStr &&
      currentTotalMinutes >= eveningTargetMinutes
    ) {
      const minutesLate = Math.max(0, currentTotalMinutes - eveningTargetMinutes);
      const isCatchUp = minutesLate > 0 || Boolean(input.isAppReopen);

      return {
        period: 'evening',
        isCatchUp,
        minutesLate,
        title: isCatchUp
          ? '🌙 Missed Evening (Asr) Adhkar • Catch-Up Alert'
          : 'Daily Adhkar — Evening (Asr)',
        body: isCatchUp
          ? `${LOCAL_ADHKAR_REMINDER_MESSAGES.evening} • Scheduled Asr Adhkar (${formatTimeDisplay(
              input.eveningReminderTime
            )}) was missed while screen was off.`
          : LOCAL_ADHKAR_REMINDER_MESSAGES.evening,
        arabicSubtitle: 'أَذْكَارُ الْمَسَاءِ (العصر)',
        malayalamSubtitle: isCatchUp
          ? 'സായാഹ്ന ദിക്റുകൾ (അസർ) • Screen-Off Catch-Up'
          : 'സായാഹ്ന ദിക്റുകൾ (അസർ) • Evening Adhkar',
        targetTab: 'evening',
        actionLabel: 'Recite Evening (Asr) Adhkar',
        tag: `evening-adhkar-${input.todayStr}`,
      };
    }
  }

  // 3. Daily Goal period: active from dailyGoalReminderTime until midnight
  if (input.goalReminderEnabled) {
    const goalParsed = parseTimeString(input.dailyGoalReminderTime || '20:00');
    const goalTargetMinutes = goalParsed.hours * 60 + goalParsed.minutes;
    const progress = input.overallDailyProgress ?? 0;

    if (
      progress < 100 &&
      input.lastGoalNotifDate !== input.todayStr &&
      currentTotalMinutes >= goalTargetMinutes
    ) {
      const minutesLate = Math.max(0, currentTotalMinutes - goalTargetMinutes);
      const isCatchUp = minutesLate > 0 || Boolean(input.isAppReopen);

      return {
        period: 'goal',
        isCatchUp,
        minutesLate,
        title: isCatchUp
          ? '🎯 Missed Daily Adhkar Goal • Catch-Up Alert'
          : 'Daily Adhkar — Goal Reminder',
        body: `${LOCAL_ADHKAR_REMINDER_MESSAGES.goal} (${progress}% complete)`,
        arabicSubtitle: 'تَذْكِيرُ الْأَهْدَافِ الْيَوْمِيَّةِ',
        malayalamSubtitle: `ഇന്നത്തെ ലക്ഷ്യം പൂർത്തിയാക്കാം (${progress}%)`,
        targetTab: 'morning',
        actionLabel: 'Continue Daily Goals',
        tag: `goal-adhkar-${input.todayStr}`,
      };
    }
  }

  return null;
}

export interface MobileNotificationDiagnostics {
  permission: NotificationPermission | 'unsupported';
  serviceWorkerSupported: boolean;
  serviceWorkerActive: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isStandalonePWA: boolean;
  isEmbeddedIframe: boolean;
  deliveryModeLabel: string;
}

export type NotificationDeliveryChannel =
  | 'service-worker'
  | 'notification-api'
  | 'in-app-fallback';

export interface InAppNotificationEvent {
  id: string;
  title: string;
  body: string;
  debugToastText: string;
  debugReason?: string;
  arabicSubtitle?: string;
  malayalamSubtitle?: string;
  targetTab?:
    | 'morning'
    | 'evening'
    | 'prayer'
    | 'sleep'
    | 'tasks'
    | 'tasbih'
    | 'progress'
    | 'favorites';
  actionLabel?: string;
  channel: NotificationDeliveryChannel;
  isCatchUp?: boolean;
  minutesLate?: number;
  period?: 'morning' | 'evening' | 'goal';
  timestamp: number;
  onClick?: () => void;
  onOpenSettings?: () => void;
}

type InAppNotificationListener = (event: InAppNotificationEvent) => void;
const inAppListeners = new Set<InAppNotificationListener>();

/**
 * Subscribes UI components (e.g., MobileReminderBanner in App.tsx) to receive
 * unblockable in-app notifications and instant debug toast messages whenever
 * any notification or bell tap fires.
 */
export function subscribeToInAppNotifications(listener: InAppNotificationListener): () => void {
  inAppListeners.add(listener);
  return () => {
    inAppListeners.delete(listener);
  };
}

export function emitInAppNotification(event: InAppNotificationEvent): void {
  inAppListeners.forEach((listener) => {
    try {
      listener(event);
    } catch {
      // ignore listener errors
    }
  });
}

let cachedSwRegistration: ServiceWorkerRegistration | null = null;

/**
 * Registers /sw.js with a strict 500ms timeout so missing sw.js files or
 * restricted WebViews NEVER leave promises pending.
 */
export async function registerAdhkarServiceWorker(
  timeoutMs = 500
): Promise<ServiceWorkerRegistration | null> {
  if (
    typeof window === 'undefined' ||
    typeof navigator === 'undefined' ||
    !('serviceWorker' in navigator)
  ) {
    return null;
  }

  try {
    if (cachedSwRegistration) {
      return cachedSwRegistration;
    }

    const regPromise = (async () => {
      if (typeof navigator.serviceWorker.getRegistration === 'function') {
        const existing = await navigator.serviceWorker.getRegistration('/');
        if (existing) {
          cachedSwRegistration = existing;
          return existing;
        }
      }
      if (typeof navigator.serviceWorker.register === 'function') {
        const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
        cachedSwRegistration = reg;
        return reg;
      }
      return null;
    })();

    return await withTimeout(regPromise, timeoutMs, 'SW registration timed out after 500ms');
  } catch {
    return null;
  }
}

/**
 * Resolves an active ServiceWorkerRegistration within 500ms:
 * Directly attempts `navigator.serviceWorker.ready` (or `registerAdhkarServiceWorker` if ready is absent)
 * raced against a strict 500ms timeout so it never hangs if sw.js is missing.
 */
export async function getReadyServiceWorkerWithin500ms(
  timeoutMs = 500
): Promise<ServiceWorkerRegistration | null> {
  if (
    typeof window === 'undefined' ||
    typeof navigator === 'undefined' ||
    !('serviceWorker' in navigator)
  ) {
    return null;
  }

  try {
    // Kick off registration in the background (non-blocking) if not yet registered
    if (typeof navigator.serviceWorker.register === 'function') {
      withTimeout(
        navigator.serviceWorker.register('/sw.js', { scope: '/' }),
        timeoutMs,
        'SW register timeout'
      )
        .then((reg) => {
          cachedSwRegistration = reg;
        })
        .catch(() => {});
    }

    const swReadyPromise = navigator.serviceWorker.ready
      ? navigator.serviceWorker.ready.then((reg) => {
          cachedSwRegistration = reg;
          return reg;
        })
      : typeof navigator.serviceWorker.getRegistration === 'function'
      ? navigator.serviceWorker.getRegistration('/').then((reg) => reg || null)
      : Promise.resolve(null);

    return await withTimeout(
      swReadyPromise,
      timeoutMs,
      'Service Worker ready timed out after 500ms'
    );
  } catch {
    return null;
  }
}

export interface SwReminderSchedulePayload {
  remindersEnabled: boolean;
  morningReminderTime: string;
  eveningReminderTime: string;
  goalReminderEnabled: boolean;
  dailyGoalReminderTime: string;
  morningCompleted: boolean;
  eveningCompleted: boolean;
  goalCompleted: boolean;
  overallDailyProgress: number;
  lastFiredMorningDate?: string;
  lastFiredEveningDate?: string;
  lastFiredGoalDate?: string;
}

/**
 * Synchronizes the user's Morning (Fajr) and Evening (Asr) Adhkar schedule with sw.js.
 * Wrapped in a 500ms timeout so it never hangs if sw.js is missing.
 */
export async function syncScheduleWithServiceWorker(
  schedule: SwReminderSchedulePayload,
  evaluateImmediately = false
): Promise<boolean> {
  try {
    const reg = await getReadyServiceWorkerWithin500ms(500);
    const targetWorker =
      reg?.active ||
      reg?.waiting ||
      reg?.installing ||
      (typeof navigator !== 'undefined' && 'serviceWorker' in navigator
        ? navigator.serviceWorker.controller
        : null);

    if (targetWorker && typeof targetWorker.postMessage === 'function') {
      targetWorker.postMessage({
        type: 'SYNC_REMINDER_SCHEDULE',
        schedule,
        evaluateImmediately,
      });
      return true;
    }
  } catch {
    // Ignore SW sync errors
  }
  return false;
}

/**
 * Safely inspects current Notification permission status.
 */
export function getNotificationPermissionStatus(): NotificationPermission | 'unsupported' {
  if (typeof globalThis === 'undefined' || !('Notification' in globalThis)) {
    return 'unsupported';
  }
  try {
    return Notification.permission;
  } catch {
    return 'unsupported';
  }
}

/**
 * Returns full Service Worker & mobile browser notification diagnostics.
 */
export function getMobileNotificationDiagnostics(): MobileNotificationDiagnostics {
  const permission = getNotificationPermissionStatus();
  const serviceWorkerSupported =
    typeof navigator !== 'undefined' && 'serviceWorker' in navigator;
  const serviceWorkerActive = Boolean(
    cachedSwRegistration?.active ||
      (typeof navigator !== 'undefined' &&
        'serviceWorker' in navigator &&
        navigator.serviceWorker.controller)
  );

  const ua = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : '';
  const isIOS = /iphone|ipad|ipod/.test(ua);
  const isAndroid = /android/.test(ua);
  const isStandalonePWA =
    typeof window !== 'undefined' &&
    ((typeof window.matchMedia === 'function' &&
      window.matchMedia('(display-mode: standalone)').matches) ||
      (window.navigator as unknown as { standalone?: boolean })?.standalone === true);

  let isEmbeddedIframe = false;
  if (typeof window !== 'undefined') {
    try {
      isEmbeddedIframe = window.self !== window.top;
    } catch {
      isEmbeddedIframe = true;
    }
  }

  let deliveryModeLabel = 'Dual-Trigger (SW 500ms -> Native Notification -> In-App Alert)';
  if (permission === 'granted' && serviceWorkerSupported) {
    deliveryModeLabel = 'SW showNotification (500ms) + Native & In-App Fallback';
  } else if (permission === 'granted') {
    deliveryModeLabel = 'Native Notification + In-App Alert';
  }

  return {
    permission,
    serviceWorkerSupported,
    serviceWorkerActive,
    isIOS,
    isAndroid,
    isStandalonePWA,
    isEmbeddedIframe,
    deliveryModeLabel,
  };
}

/**
 * Requests Notification permission from the browser with a safe timeout so
 * mobile WebViews that ignore requestPermission() never hang.
 */
export async function requestNotificationPermission(
  timeoutMs = 1500
): Promise<NotificationPermission | 'unsupported'> {
  registerAdhkarServiceWorker(500).catch(() => {});

  if (typeof globalThis === 'undefined' || !('Notification' in globalThis)) {
    return 'unsupported';
  }

  try {
    if (Notification.permission === 'granted') {
      return 'granted';
    }

    const permissionPromise = new Promise<NotificationPermission>((resolve) => {
      let settled = false;
      const finish = (val: NotificationPermission) => {
        if (!settled) {
          settled = true;
          resolve(val);
        }
      };

      try {
        const maybePromise = Notification.requestPermission((cbPerm) => {
          finish(cbPerm);
        });
        if (maybePromise && typeof maybePromise.then === 'function') {
          maybePromise.then(finish).catch(() => finish(Notification.permission || 'default'));
        }
      } catch {
        finish(Notification.permission || 'default');
      }
    });

    return await withTimeout(permissionPromise, timeoutMs, 'Permission prompt timed out');
  } catch {
    return getNotificationPermissionStatus();
  }
}

export interface AdhkarNotificationOptions {
  arabicSubtitle?: string;
  malayalamSubtitle?: string;
  targetTab?:
    | 'morning'
    | 'evening'
    | 'prayer'
    | 'sleep'
    | 'tasks'
    | 'tasbih'
    | 'progress'
    | 'favorites';
  actionLabel?: string;
  tag?: string;
  icon?: string;
  isCatchUp?: boolean;
  minutesLate?: number;
  period?: 'morning' | 'evening' | 'goal';
  onOpenSettings?: () => void;
}

/**
 * Foolproof Dual-Trigger Notification Method:
 * 1. Emits an instant visible In-App Toast/Banner ('നോട്ടിഫിക്കേഷൻ അയച്ചു!') + gentle chime
 *    immediately so the user gets 0ms visual & audio feedback even if OS permissions or sw.js hang.
 * 2. Attempts `navigator.serviceWorker.ready.then(reg => reg.showNotification(...))` with a strict
 *    500ms timeout (`withTimeout(..., 500)`).
 * 3. If Service Worker registration fails, is unsupported, sw.js is missing, or takes > 500ms,
 *    immediately falls back to the native `new Notification('Daily Adhkar', { ... })` constructor.
 * 4. Updates the visible debug toast with the exact delivery channel or fallback reason.
 */
export async function dispatchMobileSafeNotification(
  title = 'Daily Adhkar',
  body: string = LOCAL_ADHKAR_REMINDER_MESSAGES.morning,
  onClick?: () => void,
  options?: AdhkarNotificationOptions
): Promise<NotificationDeliveryChannel> {
  const tag = options?.tag || 'daily-adhkar-reminder';
  const targetTab = options?.targetTab || 'morning';
  const icon = options?.icon || 'icon.png';
  const eventId = `${tag}-${Date.now()}`;

  // Step 0: Emit instant visible feedback toast/banner & gentle sound immediately (0ms delay)
  emitInAppNotification({
    id: eventId,
    title,
    body,
    debugToastText: 'നോട്ടിഫിക്കേഷൻ അയച്ചു! (Notification Sent!)',
    debugReason: 'Delivering reminder alert...',
    arabicSubtitle: options?.arabicSubtitle || 'تذكير الأذكار اليومية',
    malayalamSubtitle: options?.malayalamSubtitle || 'ദിക്റുകൾ ചൊല്ലാനുള്ള സമയം',
    targetTab,
    actionLabel: options?.actionLabel,
    channel: 'in-app-fallback',
    isCatchUp: options?.isCatchUp,
    minutesLate: options?.minutesLate,
    period: options?.period,
    timestamp: Date.now(),
    onClick,
    onOpenSettings: options?.onOpenSettings,
  });

  let channel: NotificationDeliveryChannel = 'in-app-fallback';
  let debugReason = '';
  const perm = getNotificationPermissionStatus();

  if (perm === 'granted') {
    // Step 1: Attempt navigator.serviceWorker.ready.then(reg => reg.showNotification(...))
    // with a strict 500ms timeout so a missing sw.js never leaves the promise pending.
    try {
      const swDeliveryPromise = (async () => {
        const reg = await getReadyServiceWorkerWithin500ms(500);
        if (reg && typeof reg.showNotification === 'function') {
          await reg.showNotification(title, {
            body,
            icon,
            badge: icon,
            tag,
            vibrate: [180, 80, 180],
            data: {
              tab: targetTab,
              period: options?.period || 'morning',
              isCatchUp: Boolean(options?.isCatchUp),
              url: `/?tab=${targetTab}`,
            },
          } as NotificationOptions);
          return true;
        }
        throw new Error('Service Worker showNotification unavailable');
      })();

      const swSuccess = await withTimeout(
        swDeliveryPromise,
        500,
        'Service Worker took >500ms or sw.js missing'
      );
      if (swSuccess) {
        channel = 'service-worker';
        debugReason = 'Delivered via Service Worker (reg.showNotification)';
      }
    } catch (swErr) {
      const swErrorMsg = swErr instanceof Error ? swErr.message : 'SW unavailable';
      debugReason = `SW fallback (${swErrorMsg})`;
    }

    // Step 2: If Service Worker failed, is unsupported, or took > 500ms,
    // immediately fall back to native `new Notification('Daily Adhkar', { ... })`
    if (channel === 'in-app-fallback' && typeof globalThis !== 'undefined' && 'Notification' in globalThis) {
      try {
        const notification = new Notification(title, {
          body,
          icon,
          tag,
        });

        if (onClick && typeof window !== 'undefined') {
          notification.onclick = () => {
            window.focus();
            onClick();
            notification.close();
          };
        }
        channel = 'notification-api';
        debugReason = 'Delivered via Native new Notification() fallback';
      } catch (nativeErr) {
        const errMsg =
          nativeErr instanceof Error ? nativeErr.message : 'System notification blocked by WebView';
        channel = 'in-app-fallback';
        debugReason = `In-App Alert Active (${errMsg})`;
      }
    }
  } else if (perm === 'denied') {
    debugReason = 'In-App Alert Active (Browser OS permission is set to Denied)';
  } else if (perm === 'unsupported') {
    debugReason = 'In-App Alert Active (WebView blocks system Notification API)';
  } else {
    debugReason = 'In-App Alert Active (System Notification permission not yet granted)';
  }

  // Step 3: Update the visible In-App Toast/Banner with final delivery channel & debug status
  emitInAppNotification({
    id: eventId,
    title,
    body,
    debugToastText: 'നോട്ടിഫിക്കേഷൻ അയച്ചു! ✓',
    debugReason,
    arabicSubtitle: options?.arabicSubtitle || 'تذكير الأذكار اليومية',
    malayalamSubtitle: options?.malayalamSubtitle || 'ദിക്റുകൾ ചൊല്ലാനുള്ള സമയം',
    targetTab,
    actionLabel: options?.actionLabel,
    channel,
    isCatchUp: options?.isCatchUp,
    minutesLate: options?.minutesLate,
    period: options?.period,
    timestamp: Date.now(),
    onClick,
    onOpenSettings: options?.onOpenSettings,
  });

  return channel;
}

/**
 * Convenience helper for the Dual-Trigger Notification with default
 * "Daily Adhkar" title, Malayalam morning reminder text, and "icon.png".
 */
export function triggerLocalInAppReminder(
  body: string = LOCAL_ADHKAR_REMINDER_MESSAGES.morning,
  onClick?: () => void,
  options?: AdhkarNotificationOptions
): Promise<NotificationDeliveryChannel> {
  return dispatchMobileSafeNotification('Daily Adhkar', body, onClick, {
    icon: 'icon.png',
    ...options,
  });
}

/**
 * Backward-compatible synchronous/fire-and-forget notification helper.
 */
export function sendAdhkarNotification(
  title = 'Daily Adhkar',
  body: string = LOCAL_ADHKAR_REMINDER_MESSAGES.morning,
  onClick?: () => void,
  options?: AdhkarNotificationOptions
): null {
  void dispatchMobileSafeNotification(title, body, onClick, options);
  return null;
}
