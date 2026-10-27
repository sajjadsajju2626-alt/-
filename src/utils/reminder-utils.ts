/**
 * Utilities for calculating reminder schedules and managing browser notifications.
 */

export interface ParsedTime {
  hours: number;
  minutes: number;
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
 * If the time is later today, returns ms until today's time.
 * If the time has already passed today, returns ms until tomorrow's time.
 */
export function getMsUntilNextTime(timeStr: string, fromDate: Date): number {
  const { hours, minutes } = parseTimeString(timeStr);

  const targetDate = new Date(fromDate.getTime());
  targetDate.setHours(hours, minutes, 0, 0);

  // If already passed today, advance to tomorrow
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
 * Checks if a reminder is due within a mobile catch-up grace window (default 180 minutes)
 * on the same calendar day. Mobile browsers suspend background setInterval timers when
 * the phone screen is locked or the tab is backgrounded; this ensures reminders still fire
 * as soon as the user unlocks their phone or returns to the tab.
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

export interface InAppNotificationEvent {
  id: string;
  title: string;
  body: string;
  arabicSubtitle?: string;
  malayalamSubtitle?: string;
  targetTab?: 'morning' | 'evening' | 'prayer' | 'sleep' | 'tasks' | 'tasbih' | 'progress';
  actionLabel?: string;
  channel: 'service-worker' | 'notification-api' | 'in-app-fallback';
  timestamp: number;
  onClick?: () => void;
}

type InAppNotificationListener = (event: InAppNotificationEvent) => void;
const inAppListeners = new Set<InAppNotificationListener>();

/**
 * Subscribes UI components (e.g., MobileReminderBanner in App.tsx) to receive
 * unblockable in-app notifications whenever any reminder or test notification fires.
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
 * Registers /sw.js for mobile browser notifications (ServiceWorkerRegistration.showNotification).
 * Safe to call multiple times; returns null if Service Workers are unsupported.
 */
export async function registerAdhkarServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    if (cachedSwRegistration) {
      return cachedSwRegistration;
    }
    const existing = await navigator.serviceWorker.getRegistration('/');
    if (existing) {
      cachedSwRegistration = existing;
      return existing;
    }
    const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    cachedSwRegistration = reg;
    return reg;
  } catch {
    return null;
  }
}

/**
 * Safely inspects current Notification permission status.
 */
export function getNotificationPermissionStatus(): NotificationPermission | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  try {
    return Notification.permission;
  } catch {
    return 'unsupported';
  }
}

/**
 * Returns full mobile browser notification diagnostics so the UI can explain
 * how notifications are delivered (Service Worker Push + Unblockable In-App Alert).
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

  let deliveryModeLabel = 'Mobile In-App Banner + Spiritual Audio Chime (Unblockable)';
  if (permission === 'granted' && serviceWorkerSupported) {
    deliveryModeLabel = 'Service Worker Push + In-App Audio Alert';
  } else if (permission === 'granted') {
    deliveryModeLabel = 'Browser Push + In-App Audio Alert';
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
 * Requests Notification permission from the browser using both modern Promise syntax
 * and legacy WebKit/Safari callback syntax so mobile browsers never fail or hang.
 * Also pre-registers the Service Worker for Android/iOS mobile notification support.
 */
export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  // Pre-warm Service Worker registration in parallel
  registerAdhkarServiceWorker().catch(() => {});

  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }

  try {
    if (Notification.permission === 'granted') {
      return 'granted';
    }

    // Handle both Promise-based and legacy callback-based Notification.requestPermission
    const permissionResult = await new Promise<NotificationPermission>((resolve) => {
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

    return permissionResult;
  } catch {
    return getNotificationPermissionStatus();
  }
}

export interface AdhkarNotificationOptions {
  arabicSubtitle?: string;
  malayalamSubtitle?: string;
  targetTab?: 'morning' | 'evening' | 'prayer' | 'sleep' | 'tasks' | 'tasbih' | 'progress';
  actionLabel?: string;
  tag?: string;
}

/**
 * Dispatches a mobile-safe Adhkar notification that NEVER gets blocked by mobile browsers:
 * 1. Primary OS path: Uses `ServiceWorkerRegistration.showNotification()` (required on Android Chrome,
 *    Samsung Internet, Firefox Mobile, and iOS Home Screen PWAs where `new Notification()` is illegal).
 * 2. Secondary OS path: Falls back to `new Notification()` inside a `try/catch` for desktop browsers
 *    when Service Worker is unavailable.
 * 3. Guaranteed Mobile Fallback: Always emits an unblockable In-App Notification Banner + Audio Chime
 *    + Haptic Vibration event so the user receives the reminder even if OS notifications are blocked,
 *    denied, inside an embedded WebView/iframe, or on non-standalone iOS Safari.
 */
export async function dispatchMobileSafeNotification(
  title: string,
  body: string,
  onClick?: () => void,
  options?: AdhkarNotificationOptions
): Promise<'service-worker' | 'notification-api' | 'in-app-fallback'> {
  let channel: 'service-worker' | 'notification-api' | 'in-app-fallback' = 'in-app-fallback';
  const perm = getNotificationPermissionStatus();
  const tag = options?.tag || 'daily-adhkar-reminder';
  const targetTab = options?.targetTab || 'morning';

  if (perm === 'granted') {
    // 1. Try ServiceWorkerRegistration.showNotification() first (mandatory on mobile browsers)
    try {
      const reg = await registerAdhkarServiceWorker();
      if (reg && typeof reg.showNotification === 'function') {
        await reg.showNotification(title, {
          body,
          icon: '/icon.svg',
          badge: '/icon.svg',
          tag,
          vibrate: [180, 80, 180],
          data: { tab: targetTab, url: `/?tab=${targetTab}` },
        } as NotificationOptions);
        channel = 'service-worker';
      } else if (
        typeof navigator !== 'undefined' &&
        'serviceWorker' in navigator &&
        navigator.serviceWorker.controller
      ) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SHOW_NOTIFICATION',
          title,
          body,
          tag,
          targetTab,
        });
        channel = 'service-worker';
      }
    } catch {
      // Service Worker notification failed; try desktop Notification constructor next
    }

    // 2. If Service Worker didn't handle it, safely try `new Notification` inside try/catch
    // (Mobile Chrome throws TypeError: Illegal constructor here, which we catch gracefully)
    if (channel === 'in-app-fallback' && typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const notification = new Notification(title, {
          body,
          icon: '/icon.svg',
          badge: '/icon.svg',
          tag,
        });

        if (onClick) {
          notification.onclick = () => {
            window.focus();
            onClick();
            notification.close();
          };
        }
        channel = 'notification-api';
      } catch {
        // Caught mobile browser `Illegal constructor` or restriction -> handled by in-app fallback below
        channel = 'in-app-fallback';
      }
    }
  }

  // 3. Always emit unblockable In-App Mobile Reminder Banner + Audio/Haptic event
  emitInAppNotification({
    id: `${tag}-${Date.now()}`,
    title,
    body,
    arabicSubtitle: options?.arabicSubtitle || 'تذكير الأذكار اليومية',
    malayalamSubtitle: options?.malayalamSubtitle || 'ദിക്റുകൾ ചൊല്ലാനുള്ള സമയം',
    targetTab,
    actionLabel: options?.actionLabel,
    channel,
    timestamp: Date.now(),
    onClick,
  });

  return channel;
}

/**
 * Backward-compatible synchronous/fire-and-forget notification helper.
 * Routes through `dispatchMobileSafeNotification` so it never gets blocked on mobile browsers.
 */
export function sendAdhkarNotification(
  title: string,
  body: string,
  onClick?: () => void,
  options?: AdhkarNotificationOptions
): null {
  void dispatchMobileSafeNotification(title, body, onClick, options);
  return null;
}

