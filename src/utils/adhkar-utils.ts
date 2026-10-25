import { DhikrItem, ProgressSummary } from '../types/adhkar.ts';
import { matchesQuery } from './translation-utils.ts';

/**
 * Calculates progress for a given list of adhkar items against user's counts.
 */
export function calculateCategoryProgress(
  items: DhikrItem[],
  counts: Record<string, number>
): ProgressSummary {
  if (!items || items.length === 0) {
    return { completed: 0, total: 0, percent: 100, isAllDone: true };
  }

  let completed = 0;
  for (const item of items) {
    const count = counts[item.id] || 0;
    if (count >= item.target) {
      completed++;
    }
  }

  const percent = Math.round((completed / items.length) * 100);
  const isAllDone = completed === items.length;

  return {
    completed,
    total: items.length,
    percent,
    isAllDone,
  };
}

/**
 * Increments count for a dhikr, clamping at target.
 */
export function incrementDhikr(
  currentCount: number,
  target: number
): { newCount: number; justCompleted: boolean } {
  const safeCurrent = Math.max(0, currentCount);
  if (safeCurrent >= target) {
    return { newCount: target, justCompleted: false };
  }

  const newCount = safeCurrent + 1;
  const justCompleted = newCount === target;
  return { newCount, justCompleted };
}

/**
 * Determines recommended tab ('morning' or 'evening') and greeting based on local time.
 */
export function getRecommendedTabByHour(hour: number): {
  tab: 'morning' | 'evening';
  greeting: string;
  timeLabel: string;
} {
  // Morning: 3:00 AM (Fajr time) to 12:00 PM (Dhuhr)
  // Afternoon/Evening: 12:00 PM to 3:00 AM
  if (hour >= 3 && hour < 12) {
    return {
      tab: 'morning',
      greeting: 'Good Morning • صَبَاح الخَيْر',
      timeLabel: 'Morning Adhkar Time',
    };
  } else if (hour >= 12 && hour < 17) {
    return {
      tab: 'evening',
      greeting: 'Good Afternoon • مَسَاء الخَيْر',
      timeLabel: 'Evening Adhkar Time (Post-Asr)',
    };
  } else {
    return {
      tab: 'evening',
      greeting: 'Good Evening • مَسَاء الخَيْر',
      timeLabel: 'Evening Adhkar Time',
    };
  }
}

/**
 * Formats a Date object to YYYY-MM-DD for daily tracking.
 */
export function getTodayDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Checks if saved data is from an earlier day and needs reset.
 */
export function shouldResetDaily(lastDateStr: string | null, currentDateStr: string): boolean {
  if (!lastDateStr) return false;
  return lastDateStr !== currentDateStr;
}

/**
 * Filters adhkar list based on search term (arabic, english/malayalam translation, transliteration) and status.
 */
export function filterDhikrItems(
  items: DhikrItem[],
  counts: Record<string, number>,
  searchQuery: string,
  filterMode: 'all' | 'incomplete' | 'completed' = 'all'
): DhikrItem[] {
  return items.filter((item) => {
    const count = counts[item.id] || 0;
    const isCompleted = count >= item.target;

    if (filterMode === 'incomplete' && isCompleted) return false;
    if (filterMode === 'completed' && !isCompleted) return false;

    return matchesQuery(item, searchQuery);
  });
}
