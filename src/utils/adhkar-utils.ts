import { AdhkarCategory, DhikrItem, ProgressSummary } from '../types/adhkar.ts';
import { matchesQuery } from './translation-utils.ts';

export interface AdhkarCategoryLocationInfo {
  category: AdhkarCategory;
  icon: string;
  label: string;
  shortLabel: string;
  malayalamLabel: string;
  arabicLabel: string;
  itemPosition: number;
  totalInCategory: number;
  badgeText: string;
  locationText: string;
}

const CATEGORY_LOCATION_META: Record<
  AdhkarCategory,
  {
    icon: string;
    label: string;
    shortLabel: string;
    malayalamLabel: string;
    arabicLabel: string;
  }
> = {
  morning: {
    icon: '☀️',
    label: 'Morning Adhkar',
    shortLabel: 'Morning',
    malayalamLabel: 'പ്രഭാത ദിക്റുകൾ',
    arabicLabel: 'أذكار الصباح',
  },
  evening: {
    icon: '🌙',
    label: 'Evening Adhkar',
    shortLabel: 'Evening',
    malayalamLabel: 'വൈകുന്നേരത്തെ ദിക്റുകൾ',
    arabicLabel: 'أذكار المساء',
  },
  prayer: {
    icon: '✨',
    label: 'After Prayer Adhkar',
    shortLabel: 'After Prayer',
    malayalamLabel: 'നമസ്കാര ശേഷമുള്ള ദിക്റുകൾ',
    arabicLabel: 'أذكار بعد الصلاة',
  },
  sleep: {
    icon: '🌌',
    label: 'Before Sleep Adhkar',
    shortLabel: 'Before Sleep',
    malayalamLabel: 'ഉറങ്ങാൻ നേരമുള്ള ദിക്റുകൾ',
    arabicLabel: 'أذكار النوم',
  },
};

/**
 * Resolves full category location details (icon, English/Malayalam/Arabic labels, and item position)
 * to display below each search result item so the user knows where the found Zikr is located.
 */
export function getAdhkarCategoryLocation(
  item: DhikrItem,
  allItems: DhikrItem[] = []
): AdhkarCategoryLocationInfo {
  const meta = CATEGORY_LOCATION_META[item.category] || CATEGORY_LOCATION_META.morning;
  const sameCategoryItems = allItems.filter((it) => it.category === item.category);
  const indexInCategory = sameCategoryItems.findIndex((it) => it.id === item.id);
  const itemPosition =
    item.itemNumber ?? (indexInCategory >= 0 ? indexInCategory + 1 : 1);
  const totalInCategory = sameCategoryItems.length;

  const positionSuffix =
    totalInCategory > 0 ? `#${itemPosition} of ${totalInCategory}` : `#${itemPosition}`;

  return {
    category: item.category,
    icon: meta.icon,
    label: meta.label,
    shortLabel: meta.shortLabel,
    malayalamLabel: meta.malayalamLabel,
    arabicLabel: meta.arabicLabel,
    itemPosition,
    totalInCategory,
    badgeText: `${meta.icon} ${meta.label} • ${meta.malayalamLabel}`,
    locationText: `Located in: ${meta.label} (${positionSuffix})`,
  };
}

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

/**
 * Searches across Adhkar items:
 * - When searchQuery is empty, returns filtered items for the active category/tab.
 * - When searchQuery is non-empty, searches across all Adhkar categories (when not restricted to Favorites),
 *   prioritizing matches from the currently active category first so the user can locate any Zikr
 *   and see its exact category location below each result.
 */
export function searchAdhkarWithCategories(
  activeItems: DhikrItem[],
  allItems: DhikrItem[],
  counts: Record<string, number>,
  searchQuery: string,
  filterMode: 'all' | 'incomplete' | 'completed' = 'all',
  activeTab?: string
): DhikrItem[] {
  const trimmed = searchQuery.trim();
  if (!trimmed) {
    return filterDhikrItems(activeItems, counts, '', filterMode);
  }

  const pool =
    activeTab === 'favorites' || allItems.length === 0 ? activeItems : allItems;

  const matched = filterDhikrItems(pool, counts, trimmed, filterMode);

  if (activeTab && ['morning', 'evening', 'prayer', 'sleep'].includes(activeTab)) {
    return [...matched].sort((a, b) => {
      const aInActive = a.category === activeTab ? 0 : 1;
      const bInActive = b.category === activeTab ? 0 : 1;
      return aInActive - bInActive;
    });
  }

  return matched;
}

