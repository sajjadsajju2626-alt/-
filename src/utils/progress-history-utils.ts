import { AdhkarCategory, ProgressSummary } from '../types/adhkar.ts';

export interface SectionBreakdown {
  morning: number; // 0 - 100%
  evening: number; // 0 - 100%
  prayer: number; // 0 - 100%
  sleep: number; // 0 - 100%
  tasks: number; // 0 - 100%
  tasbih: number; // daily tasbih count
}

export interface DailyProgressRecord {
  date: string; // YYYY-MM-DD
  overallPercent: number; // 0 - 100%
  totalRecitations: number;
  completedSectionsCount: number;
  sections: SectionBreakdown;
  updatedAt: string;
}

export type ProgressHistoryMap = Record<string, DailyProgressRecord>;

export interface WeeklyDayItem {
  date: string;
  dayLabel: string; // Mon, Tue, Wed, Thu, Fri, Sat, Sun
  dayNumber: number;
  shortDate: string;
  percent: number;
  isToday: boolean;
  isComplete: boolean;
  totalRecitations: number;
  sections: SectionBreakdown;
}

export interface WeeklyTrackerSummary {
  days: WeeklyDayItem[];
  weeklyAverage: number;
  completedDaysInWeek: number;
}

export interface MonthlyCalendarCell {
  date: string;
  dayOfMonth: number;
  percent: number;
  totalRecitations: number;
  isToday: boolean;
  isFuture: boolean;
  intensityLevel: 0 | 1 | 2 | 3 | 4;
  sections: SectionBreakdown;
}

export interface MonthlyCalendarSummary {
  year: number;
  month: number; // 0-indexed (0 = Jan)
  monthLabel: string;
  daysInMonth: number;
  firstDayOffset: number; // Monday-first offset (0 = Mon ... 6 = Sun)
  cells: MonthlyCalendarCell[];
  monthlyAverage: number;
  activeDaysInMonth: number;
}

export interface OverallSummaryStats {
  totalRecitations: number;
  activeDays: number;
  bestStreak: number;
  currentStreak: number;
}

const DAY_LABELS_SUN_FIRST = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const EMPTY_SECTIONS: SectionBreakdown = {
  morning: 0,
  evening: 0,
  prayer: 0,
  sleep: 0,
  tasks: 0,
  tasbih: 0,
};

/**
 * Formats a Date object as YYYY-MM-DD in local time.
 */
export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Parses a YYYY-MM-DD string into a local Date at noon to avoid DST boundary shifts.
 */
export function parseDateKey(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map((n) => parseInt(n, 10));
  return new Date(y, (m || 1) - 1, d || 1, 12, 0, 0);
}

/**
 * Calculates total recitations performed today across adhkar cards, tasbih counter, and completed tasks.
 */
export function calculateTotalRecitationsForDay(
  counts: Record<string, number>,
  tasbihCount: number,
  completedTasksCount: number
): number {
  const adhkarSum = Object.values(counts).reduce(
    (sum, val) => sum + (typeof val === 'number' && val > 0 ? val : 0),
    0
  );
  const safeTasbih = Math.max(0, tasbihCount || 0);
  const safeTasks = Math.max(0, completedTasksCount || 0);
  return adhkarSum + safeTasbih + safeTasks;
}

/**
 * Builds a structured DailyProgressRecord for a given date.
 */
export function buildDailyProgressRecord(params: {
  date: string;
  morningPercent: number;
  eveningPercent: number;
  prayerPercent: number;
  sleepPercent: number;
  tasksPercent: number;
  tasbihCount: number;
  overallPercent: number;
  counts: Record<string, number>;
  completedTasksCount: number;
}): DailyProgressRecord {
  const sections: SectionBreakdown = {
    morning: Math.min(100, Math.max(0, Math.round(params.morningPercent))),
    evening: Math.min(100, Math.max(0, Math.round(params.eveningPercent))),
    prayer: Math.min(100, Math.max(0, Math.round(params.prayerPercent))),
    sleep: Math.min(100, Math.max(0, Math.round(params.sleepPercent))),
    tasks: Math.min(100, Math.max(0, Math.round(params.tasksPercent))),
    tasbih: Math.max(0, Math.round(params.tasbihCount)),
  };

  const completedSectionsCount = [
    sections.morning === 100,
    sections.evening === 100,
    sections.prayer === 100,
    sections.sleep === 100,
    sections.tasks === 100,
  ].filter(Boolean).length;

  const totalRecitations = calculateTotalRecitationsForDay(
    params.counts,
    params.tasbihCount,
    params.completedTasksCount
  );

  // Compute overall percentage across the 4 primary adhkar sections + tasks if not explicitly higher
  const fourAdhkarAvg = Math.round(
    (sections.morning + sections.evening + sections.prayer + sections.sleep) / 4
  );
  const computedOverall = Math.max(
    Math.min(100, Math.max(0, Math.round(params.overallPercent))),
    fourAdhkarAvg
  );

  return {
    date: params.date,
    overallPercent: computedOverall,
    totalRecitations,
    completedSectionsCount,
    sections,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Upserts a daily progress record into the history map immutably.
 */
export function upsertDailyProgressHistory(
  history: ProgressHistoryMap,
  record: DailyProgressRecord
): ProgressHistoryMap {
  return {
    ...history,
    [record.date]: record,
  };
}

/**
 * Maps a percentage (0-100) to a discrete heatmap intensity level (0 to 4).
 * 0 = 0% (dark teal)
 * 1 = 1-34%
 * 2 = 35-69%
 * 3 = 70-99%
 * 4 = 100% (bright emerald green)
 */
export function getHeatmapIntensityLevel(percent: number): 0 | 1 | 2 | 3 | 4 {
  if (percent <= 0) return 0;
  if (percent < 35) return 1;
  if (percent < 70) return 2;
  if (percent < 100) return 3;
  return 4;
}

/**
 * Returns the last 7 days ending on todayDateStr (or ordered Mon-Sun for the current 7-day window)
 * with completion percentages and weekly average.
 */
export function getLast7DaysWeeklySummary(
  history: ProgressHistoryMap,
  todayDateStr: string
): WeeklyTrackerSummary {
  const today = parseDateKey(todayDateStr);
  const days: WeeklyDayItem[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = formatDateKey(d);
    const rec = history[key];
    const percent = rec ? rec.overallPercent : 0;
    const dayLabel = DAY_LABELS_SUN_FIRST[d.getDay()];
    const shortMonth = MONTH_NAMES[d.getMonth()].slice(0, 3);

    days.push({
      date: key,
      dayLabel,
      dayNumber: d.getDate(),
      shortDate: `${shortMonth} ${d.getDate()}`,
      percent,
      isToday: key === todayDateStr,
      isComplete: percent >= 100,
      totalRecitations: rec ? rec.totalRecitations : 0,
      sections: rec ? rec.sections : { ...EMPTY_SECTIONS },
    });
  }

  const sumPercent = days.reduce((acc, item) => acc + item.percent, 0);
  const weeklyAverage = Math.round(sumPercent / 7);
  const completedDaysInWeek = days.filter((d) => d.percent > 0).length;

  return {
    days,
    weeklyAverage,
    completedDaysInWeek,
  };
}

/**
 * Generates a compact monthly calendar heatmap grid for a given year and month (0-indexed).
 */
export function getMonthlyCalendarGrid(
  history: ProgressHistoryMap,
  year: number,
  month: number,
  todayDateStr: string
): MonthlyCalendarSummary {
  const firstOfMonth = new Date(year, month, 1, 12, 0, 0);
  const daysInMonth = new Date(year, month + 1, 0, 12, 0, 0).getDate();
  // Convert Sunday-first (0..6) to Monday-first (0 = Mon ... 6 = Sun)
  const firstDayOffset = (firstOfMonth.getDay() + 6) % 7;

  const cells: MonthlyCalendarCell[] = [];
  let sumPercent = 0;
  let trackedDaysCount = 0;
  let activeDaysInMonth = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day, 12, 0, 0);
    const key = formatDateKey(d);
    const rec = history[key];
    const percent = rec ? rec.overallPercent : 0;
    const isToday = key === todayDateStr;
    const isFuture = key > todayDateStr;

    if (!isFuture) {
      sumPercent += percent;
      trackedDaysCount++;
    }
    if (percent > 0 || (rec && rec.totalRecitations > 0)) {
      activeDaysInMonth++;
    }

    cells.push({
      date: key,
      dayOfMonth: day,
      percent,
      totalRecitations: rec ? rec.totalRecitations : 0,
      isToday,
      isFuture,
      intensityLevel: getHeatmapIntensityLevel(percent),
      sections: rec ? rec.sections : { ...EMPTY_SECTIONS },
    });
  }

  const monthlyAverage =
    trackedDaysCount > 0 ? Math.round(sumPercent / trackedDaysCount) : 0;

  return {
    year,
    month,
    monthLabel: `${MONTH_NAMES[month]} ${year}`,
    daysInMonth,
    firstDayOffset,
    cells,
    monthlyAverage,
    activeDaysInMonth,
  };
}

/**
 * Computes overall summary statistics across all recorded days in history.
 */
export function getOverallProgressStats(
  history: ProgressHistoryMap,
  currentStreak: number,
  bestStreak: number
): OverallSummaryStats {
  const records = Object.values(history);
  const totalRecitations = records.reduce(
    (sum, r) => sum + (r.totalRecitations || 0),
    0
  );
  const activeDays = records.filter(
    (r) => r.overallPercent > 0 || r.totalRecitations > 0
  ).length;

  return {
    totalRecitations,
    activeDays,
    bestStreak: Math.max(bestStreak, currentStreak),
    currentStreak,
  };
}

/**
 * Checks whether all four main daily Adhkar categories (Morning, Evening, Prayer, Sleep) are 100% completed.
 */
export function isAllFourAdhkarCompleted(
  categoryProgress: Record<AdhkarCategory, ProgressSummary>
): boolean {
  return (
    categoryProgress.morning.total > 0 &&
    categoryProgress.morning.isAllDone &&
    categoryProgress.evening.total > 0 &&
    categoryProgress.evening.isAllDone &&
    categoryProgress.prayer.total > 0 &&
    categoryProgress.prayer.isAllDone &&
    categoryProgress.sleep.total > 0 &&
    categoryProgress.sleep.isAllDone
  );
}
