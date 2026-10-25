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
 * Formats a 24-hour "HH:mm" string into 12-hour "h:mm AM/PM" for display.
 */
export function formatTimeDisplay(timeStr: string): string {
  const { hours, minutes } = parseTimeString(timeStr);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  const displayMin = String(minutes).padStart(2, '0');
  return `${displayHour}:${displayMin} ${period}`;
}

/**
 * Safely inspects current Notification permission status.
 */
export function getNotificationPermissionStatus(): NotificationPermission | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

/**
 * Requests Notification permission from the browser.
 */
export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch {
    return 'denied';
  }
}

/**
 * Dispatches an authentic Adhkar notification if permission is granted.
 */
export function sendAdhkarNotification(
  title: string,
  body: string,
  onClick?: () => void
): Notification | null {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return null;
  }

  if (Notification.permission !== 'granted') {
    return null;
  }

  try {
    const notification = new Notification(title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'daily-adhkar-reminder',
    });

    if (onClick) {
      notification.onclick = () => {
        window.focus();
        onClick();
        notification.close();
      };
    }

    return notification;
  } catch {
    return null;
  }
}
