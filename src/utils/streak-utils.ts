/**
 * Pure functions for calculating and maintaining daily adhkar streaks.
 */

export interface StreakData {
  currentStreak: number;
  bestStreak: number;
  lastCompletedDate: string | null; // YYYY-MM-DD
}

export interface StreakStatus {
  effectiveStreak: number;
  completedToday: boolean;
  isAtRisk: boolean; // Yesterday completed, waiting for today
}

/**
 * Calculates number of calendar days between two YYYY-MM-DD dates.
 * dateStr2 - dateStr1 in whole days.
 */
export function getDaysDifference(dateStr1: string, dateStr2: string): number {
  const [y1, m1, d1] = dateStr1.split('-').map(Number);
  const [y2, m2, d2] = dateStr2.split('-').map(Number);

  const utc1 = Date.UTC(y1, m1 - 1, d1);
  const utc2 = Date.UTC(y2, m2 - 1, d2);

  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.round((utc2 - utc1) / MS_PER_DAY);
}

/**
 * Determines current active streak status when app loads or day changes.
 */
export function getCurrentStreakStatus(
  lastCompletedDate: string | null,
  savedStreak: number,
  todayDateStr: string
): StreakStatus {
  if (!lastCompletedDate || savedStreak <= 0) {
    return { effectiveStreak: 0, completedToday: false, isAtRisk: false };
  }

  const diffDays = getDaysDifference(lastCompletedDate, todayDateStr);

  if (diffDays === 0) {
    // Already completed today!
    return { effectiveStreak: savedStreak, completedToday: true, isAtRisk: false };
  } else if (diffDays === 1) {
    // Completed yesterday, streak is alive and waiting for today's remembrance!
    return { effectiveStreak: savedStreak, completedToday: false, isAtRisk: true };
  } else {
    // Missed 2 or more days, streak reset
    return { effectiveStreak: 0, completedToday: false, isAtRisk: false };
  }
}

/**
 * Updates streak when user completes any adhkar category today.
 */
export function calculateStreakOnCompletion(
  lastCompletedDate: string | null,
  currentStreak: number,
  todayDateStr: string,
  bestStreak: number = 0
): { newStreak: number; newBestStreak: number; isNewStreakDay: boolean } {
  // Already recorded today?
  if (lastCompletedDate === todayDateStr) {
    return {
      newStreak: Math.max(1, currentStreak),
      newBestStreak: Math.max(bestStreak, currentStreak),
      isNewStreakDay: false,
    };
  }

  let newStreak = 1;

  if (lastCompletedDate) {
    const diffDays = getDaysDifference(lastCompletedDate, todayDateStr);
    if (diffDays === 1) {
      // Consecutive day!
      newStreak = currentStreak + 1;
    } else {
      // Gap > 1 day: starts fresh at 1
      newStreak = 1;
    }
  }

  const newBestStreak = Math.max(bestStreak, newStreak);

  return {
    newStreak,
    newBestStreak,
    isNewStreakDay: true,
  };
}
