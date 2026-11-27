export type TravelMode = 'normal' | 'safar' | 'udhr';

export const PRAYER_TASK_IDS = [
  'task-fard-prayers',
  'task-5-prayers',
  'task-rawatib',
  'task-12-rawatib',
  'task-duha',
  'task-qiyam-witr',
] as const;

export const RAWATIB_TASK_IDS = ['task-rawatib', 'task-12-rawatib'] as const;

export interface JannahHouseProgress {
  rakahs: number;
  stage: 0 | 1 | 2 | 3 | 4 | 5;
  fillPercent: number;
  isComplete: boolean;
}

/**
 * Maps completed Rawatib rak'ahs (0..12) to the 5 visual House in Jannah stages
 * corresponding to milestones 2, 6, 8, 10, and 12 rak'ahs.
 */
export function getJannahHouseProgress(completedRakahs: number): JannahHouseProgress {
  const rakahs = Math.max(0, Math.min(12, Math.floor(Number(completedRakahs) || 0)));
  let stage: 0 | 1 | 2 | 3 | 4 | 5 = 0;
  if (rakahs >= 12) stage = 5;
  else if (rakahs >= 10) stage = 4;
  else if (rakahs >= 8) stage = 3;
  else if (rakahs >= 6) stage = 2;
  else if (rakahs >= 2) stage = 1;

  return {
    rakahs,
    stage,
    fillPercent: Math.round((rakahs / 12) * 100),
    isComplete: rakahs >= 12,
  };
}

export function isPrayerTaskId(taskId: string): boolean {
  return (PRAYER_TASK_IDS as readonly string[]).includes(taskId);
}

export function isRawatibTaskId(taskId: string): boolean {
  return (RAWATIB_TASK_IDS as readonly string[]).includes(taskId);
}

export function isTaskExemptedInMode(taskId: string, mode: TravelMode): boolean {
  return mode === 'udhr' && isPrayerTaskId(taskId);
}

export function isRawatibSubtaskWaivedInMode(subtaskId: string, mode: TravelMode): boolean {
  if (mode === 'udhr') return true;
  if (mode === 'safar') {
    return subtaskId !== 'rawatib-fajr';
  }
  return false;
}

/**
 * Calculates consecutive streak days where protected Safar/Udhr mode dates
 * bridge gaps without breaking the streak or consuming the normal 1-day freeze.
 */
export function computeProtectedStreak(
  todayStr: string,
  completionTimestamps: Record<string, number>,
  protectedModeDates: Record<string, 'safar' | 'udhr'>
): { streakCount: number; usedFreezeDates: string[]; protectedDatesUsed: string[] } {
  const parseDate = (ds: string): Date => {
    const [y, m, d] = ds.split('-').map(Number);
    return new Date(y, m - 1, d);
  };
  const fmt = (dt: Date): string =>
    `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;

  let streakCount = 0;
  let freezeRemaining = 1;
  const usedFreezeDates: string[] = [];
  const protectedDatesUsed: string[] = [];

  const cursor = parseDate(todayStr);
  const todayKey = fmt(cursor);

  if (completionTimestamps[todayKey]) {
    streakCount++;
    cursor.setDate(cursor.getDate() - 1);
  } else if (protectedModeDates[todayKey]) {
    protectedDatesUsed.push(todayKey);
    cursor.setDate(cursor.getDate() - 1);
  } else {
    cursor.setDate(cursor.getDate() - 1);
    const yesterdayKey = fmt(cursor);
    if (!completionTimestamps[yesterdayKey] && !protectedModeDates[yesterdayKey]) {
      const twoDaysAgo = new Date(cursor);
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 1);
      const twoDaysAgoKey = fmt(twoDaysAgo);
      if (freezeRemaining > 0 && (completionTimestamps[twoDaysAgoKey] || protectedModeDates[twoDaysAgoKey])) {
        freezeRemaining--;
        usedFreezeDates.push(yesterdayKey);
        cursor.setDate(cursor.getDate() - 1);
      }
    }
  }

  for (let step = 0; step < 365; step++) {
    const ds = fmt(cursor);
    if (completionTimestamps[ds]) {
      streakCount++;
      cursor.setDate(cursor.getDate() - 1);
    } else if (protectedModeDates[ds]) {
      protectedDatesUsed.push(ds);
      cursor.setDate(cursor.getDate() - 1);
    } else if (freezeRemaining > 0) {
      const prevDay = new Date(cursor);
      prevDay.setDate(prevDay.getDate() - 1);
      const prevKey = fmt(prevDay);
      if (completionTimestamps[prevKey] || protectedModeDates[prevKey]) {
        freezeRemaining--;
        usedFreezeDates.push(ds);
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    } else {
      break;
    }
  }

  return { streakCount, usedFreezeDates, protectedDatesUsed };
}
