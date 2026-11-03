import type { DailyTask, TaskFilterStatus } from '../types/tasks.ts';

/**
 * Safely normalizes any raw tasks value (array, legacy { date, tasks } object, or invalid value)
 * into a guaranteed DailyTask[] array so array methods (.filter, .map) never throw TypeError.
 */
export function normalizeDailyTasks(
  raw: unknown,
  fallback: DailyTask[] = []
): DailyTask[] {
  if (Array.isArray(raw)) {
    return raw.filter(
      (item): item is DailyTask =>
        Boolean(item && typeof item === 'object' && typeof (item as DailyTask).id === 'string')
    );
  }
  if (
    raw &&
    typeof raw === 'object' &&
    Array.isArray((raw as { tasks?: unknown }).tasks)
  ) {
    const extracted = (raw as { tasks: unknown[] }).tasks.filter(
      (item): item is DailyTask =>
        Boolean(item && typeof item === 'object' && typeof (item as DailyTask).id === 'string')
    );
    return extracted.length > 0 ? extracted : fallback;
  }
  return fallback;
}

export const RAWATIB_RAKAHS: Record<string, number> = {
  'rawatib-fajr': 2,
  'rawatib-dhuhr-pre': 4,
  'rawatib-dhuhr-post': 2,
  'rawatib-maghrib': 2,
  'rawatib-isha': 2,
};

/**
 * Calculates live portion stats, percentage, and completion for any daily task
 * (e.g. 5 Daily Obligatory Prayers, 12 Sunnah Rawatib Prayers, or standard tasks).
 */
export function getTaskPortionStats(task: DailyTask | null | undefined): {
  hasPortions: boolean;
  completedPortions: number;
  totalPortions: number;
  percent: number;
  unit: string;
  isComplete: boolean;
  isPartial: boolean;
} {
  if (!task || typeof task !== 'object') {
    return {
      hasPortions: false,
      completedPortions: 0,
      totalPortions: 0,
      percent: 0,
      unit: '',
      isComplete: false,
      isPartial: false,
    };
  }

  if (task.id === 'task-fard-prayers') {
    const subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
    const totalPortions = 5;
    const completedPortions = subtasks.filter((s) => s.completed).length;
    const percent = Math.round((completedPortions / totalPortions) * 100);
    const isComplete = completedPortions === 5;
    const isPartial = completedPortions > 0 && completedPortions < 5;
    return {
      hasPortions: true,
      completedPortions,
      totalPortions,
      percent,
      unit: 'prayers',
      isComplete,
      isPartial,
    };
  }

  if (task.id === 'task-rawatib') {
    const subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
    const totalPortions = 12;
    let completedPortions = 0;
    for (const st of subtasks) {
      if (st.completed) {
        completedPortions += RAWATIB_RAKAHS[st.id] ?? 2;
      }
    }
    const percent = Math.min(100, Math.round((completedPortions / totalPortions) * 100));
    const isComplete = completedPortions >= 12;
    const isPartial = completedPortions > 0 && completedPortions < 12;
    return {
      hasPortions: true,
      completedPortions,
      totalPortions,
      percent,
      unit: "rak'ahs",
      isComplete,
      isPartial,
    };
  }

  if (Array.isArray(task.subtasks) && task.subtasks.length > 0) {
    const totalPortions = task.subtasks.length;
    const completedPortions = task.subtasks.filter((s) => s.completed).length;
    const percent = Math.round((completedPortions / totalPortions) * 100);
    const isComplete = completedPortions === totalPortions;
    const isPartial = completedPortions > 0 && completedPortions < totalPortions;
    return {
      hasPortions: true,
      completedPortions,
      totalPortions,
      percent,
      unit: 'steps',
      isComplete,
      isPartial,
    };
  }

  const isComplete = Boolean(task.completed);
  return {
    hasPortions: false,
    completedPortions: isComplete ? 1 : 0,
    totalPortions: 1,
    percent: isComplete ? 100 : 0,
    unit: 'tasks',
    isComplete,
    isPartial: false,
  };
}

/**
 * Returns true if a task has achieved 100% completion (all portions done for multi-portion tasks).
 */
export function isTaskEffectivelyCompleted(task: DailyTask | null | undefined): boolean {
  return getTaskPortionStats(task).isComplete;
}

/**
 * Calculates completion statistics for daily tasks.
 * Multi-portion tasks count as completed ONLY if all portions are done (100%).
 */
export function calculateTasksProgress(tasks: DailyTask[] | unknown): {
  completed: number;
  total: number;
  percent: number;
  isAllDone: boolean;
} {
  const safeTasks = normalizeDailyTasks(tasks);
  const total = safeTasks.length;
  if (total === 0) {
    return { completed: 0, total: 0, percent: 0, isAllDone: false };
  }

  const completed = safeTasks.filter((t) => getTaskPortionStats(t).isComplete).length;
  const percent = Math.round((completed / total) * 100);
  const isAllDone = completed === total && total > 0;

  return { completed, total, percent, isAllDone };
}

/**
 * Toggles a main task completion status.
 * If the task has subtasks:
 * - If not 100% complete, clicking marks all subtasks & parent as completed (100%).
 * - If already 100% complete, clicking unchecks all subtasks & parent (0%).
 */
export function toggleTask(tasks: DailyTask[], taskId: string): DailyTask[] {
  const safeTasks = normalizeDailyTasks(tasks);
  return safeTasks.map((task) => {
    if (task.id !== taskId) return task;

    const stats = getTaskPortionStats(task);
    const nextCompleted = !stats.isComplete;
    const nowIso = nextCompleted ? new Date().toISOString() : undefined;

    const nextSubtasks = task.subtasks
      ? task.subtasks.map((st) => ({ ...st, completed: nextCompleted }))
      : undefined;

    return {
      ...task,
      completed: nextCompleted,
      completedAt: nowIso,
      subtasks: nextSubtasks,
    };
  });
}

/**
 * Toggles an individual subtask within a parent task (e.g., Fajr in 5 Fard Prayers or 2 before Fajr in 12 Rawatib).
 * Sets task.completed = true ONLY if all portions are complete (5/5 for Fard, 12/12 for Rawatib).
 */
export function toggleSubtask(
  tasks: DailyTask[],
  taskId: string,
  subtaskId: string
): DailyTask[] {
  const safeTasks = normalizeDailyTasks(tasks);
  return safeTasks.map((task) => {
    if (task.id !== taskId || !task.subtasks) return task;

    const updatedSubtasks = task.subtasks.map((st) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );

    const stats = getTaskPortionStats({ ...task, subtasks: updatedSubtasks });

    return {
      ...task,
      subtasks: updatedSubtasks,
      completed: stats.isComplete,
      completedAt: stats.isComplete ? new Date().toISOString() : undefined,
    };
  });
}

/**
 * Adds a new custom task to the task list.
 */
export function addCustomTask(
  tasks: DailyTask[],
  data: {
    title: string;
    arabicTitle?: string;
    malayalamTitle?: string;
    category?: DailyTask['category'];
    description?: string;
    malayalamDescription?: string;
  }
): DailyTask[] {
  const safeTasks = normalizeDailyTasks(tasks);
  const trimmedTitle = data.title.trim();
  if (!trimmedTitle) return safeTasks;

  const newTask: DailyTask = {
    id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: trimmedTitle,
    arabicTitle: data.arabicTitle?.trim() || trimmedTitle,
    malayalamTitle: data.malayalamTitle?.trim() || trimmedTitle,
    category: data.category || 'custom',
    description: data.description?.trim(),
    malayalamDescription: data.malayalamDescription?.trim(),
    isCustom: true,
    completed: false,
  };

  return [...safeTasks, newTask];
}

/**
 * Deletes a task from the list (primarily custom tasks).
 */
export function deleteTask(tasks: DailyTask[], taskId: string): DailyTask[] {
  return normalizeDailyTasks(tasks).filter((t) => t.id !== taskId);
}

/**
 * Resets all task and subtask completions for a new day.
 */
export function resetDailyTasks(tasks: DailyTask[]): DailyTask[] {
  return normalizeDailyTasks(tasks).map((task) => ({
    ...task,
    completed: false,
    completedAt: undefined,
    subtasks: task.subtasks
      ? task.subtasks.map((st) => ({ ...st, completed: false }))
      : undefined,
  }));
}

/**
 * Marks all tasks and their subtasks as completed.
 */
export function completeAllTasks(tasks: DailyTask[]): DailyTask[] {
  const nowIso = new Date().toISOString();
  return normalizeDailyTasks(tasks).map((task) => ({
    ...task,
    completed: true,
    completedAt: nowIso,
    subtasks: task.subtasks
      ? task.subtasks.map((st) => ({ ...st, completed: true }))
      : undefined,
  }));
}

/**
 * Synchronizes morning and evening adhkar completion with daily tasks.
 */
export function syncAdhkarWithTasks(
  tasks: DailyTask[],
  isMorningComplete: boolean,
  isEveningComplete: boolean
): DailyTask[] {
  const safeTasks = normalizeDailyTasks(tasks);
  let changed = false;

  const nextTasks = safeTasks.map((task) => {
    if (task.id === 'task-morning-adhkar') {
      if (task.completed !== isMorningComplete) {
        changed = true;
        return {
          ...task,
          completed: isMorningComplete,
          completedAt: isMorningComplete ? new Date().toISOString() : undefined,
        };
      }
    } else if (task.id === 'task-evening-adhkar') {
      if (task.completed !== isEveningComplete) {
        changed = true;
        return {
          ...task,
          completed: isEveningComplete,
          completedAt: isEveningComplete ? new Date().toISOString() : undefined,
        };
      }
    }
    return task;
  });

  return changed ? nextTasks : safeTasks;
}

/**
 * Filters tasks based on status, category, and search query.
 */
export function filterDailyTasks(
  tasks: DailyTask[],
  filterStatus: TaskFilterStatus,
  categoryFilter: string,
  searchQuery: string
): DailyTask[] {
  let filtered = normalizeDailyTasks(tasks);

  // Filter by status
  if (filterStatus === 'incomplete') {
    filtered = filtered.filter((t) => !t.completed);
  } else if (filterStatus === 'completed') {
    filtered = filtered.filter((t) => t.completed);
  }

  // Filter by category
  if (categoryFilter && categoryFilter !== 'all') {
    filtered = filtered.filter((t) => t.category === categoryFilter);
  }

  // Filter by search query
  const q = searchQuery.trim().toLowerCase();
  if (q) {
    filtered = filtered.filter((t) => {
      return (
        t.title.toLowerCase().includes(q) ||
        t.arabicTitle.toLowerCase().includes(q) ||
        t.malayalamTitle.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.malayalamDescription && t.malayalamDescription.toLowerCase().includes(q)) ||
        (t.virtue && t.virtue.toLowerCase().includes(q)) ||
        (t.source && t.source.toLowerCase().includes(q))
      );
    });
  }

  return filtered;
}

/**
 * Checks if a stored date string differs from today's date.
 */
export function shouldResetTasksDate(
  lastDate: string | null | undefined,
  todayDate: string
): boolean {
  if (!lastDate) return true;
  return lastDate !== todayDate;
}

export type TaskHistoryMap = Record<string, Record<string, boolean>>;
export type TaskAuditPeriod = 'week' | 'month';
export type TaskAuditFilter = 'all' | 'completed' | 'missed';

export interface TaskAuditDayDot {
  date: string; // YYYY-MM-DD
  shortLabel: string; // e.g. "Oct 29"
  dayOfWeek: string; // Sun, Mon, Tue...
  completed: boolean; // true ONLY if 100% complete
  status: 'completed' | 'partial' | 'missed'; // 'completed' (100%), 'partial' (1-99%), 'missed' (0%)
  percent: number; // 0 to 100
  completedPortions: number;
  totalPortions: number;
  isToday: boolean;
}

export interface TaskAuditRow {
  task: DailyTask;
  completedDays: number;
  partialDays: number;
  totalDays: number; // 7 for week, 30 for month
  missedDays: number;
  completionPercent: number; // Proportional percentage based on total portions or days
  ratioLabel: string; // e.g. "28/35 prayers", "60/84 rak'ahs", or "5/7 days"
  totalPortionsCompleted: number;
  totalPortionsPossible: number;
  unit: string;
  hasPortions: boolean;
  dots: TaskAuditDayDot[];
  isCompletedFilterMatch: boolean;
  isMissedFilterMatch: boolean;
}

export interface TaskAuditReport {
  period: TaskAuditPeriod;
  totalDays: number;
  rows: TaskAuditRow[];
  filteredRows: TaskAuditRow[];
  mostCompletedTask: TaskAuditRow | null;
  mostSkippedTask: TaskAuditRow | null;
  mostCompletedSummaryText: string;
  mostSkippedSummaryText: string;
  counts: {
    all: number;
    completed: number;
    missed: number;
  };
}

const SHORT_DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const SHORT_MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function formatLocalDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseLocalDateKey(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map((n) => parseInt(n, 10));
  return new Date(y || 2026, (m || 1) - 1, d || 1, 12, 0, 0);
}

/**
 * Updates the per-day task completion map for a specific date (YYYY-MM-DD).
 */
export function upsertTaskHistoryForDate(
  history: TaskHistoryMap,
  dateStr: string,
  tasks: DailyTask[]
): TaskHistoryMap {
  const safeTasks = normalizeDailyTasks(tasks);
  const existingEntry = history?.[dateStr] as
    | (Record<string, unknown> & { completedTaskIds?: string[] })
    | undefined;
  const dayRecord: Record<string, unknown> =
    existingEntry && typeof existingEntry === 'object' ? { ...existingEntry } : {};
  const completedIds = new Set<string>(
    Array.isArray(existingEntry?.completedTaskIds) ? existingEntry.completedTaskIds : []
  );

  for (const task of safeTasks) {
    const stats = getTaskPortionStats(task);
    const done = stats.isComplete;
    dayRecord[task.id] = done;
    if (stats.hasPortions) {
      dayRecord[`${task.id}_portion`] = stats.completedPortions;
      dayRecord[`${task.id}_percent`] = stats.percent;
      dayRecord[`${task.id}_total`] = stats.totalPortions;
    }
    if (done) {
      completedIds.add(task.id);
    } else {
      completedIds.delete(task.id);
    }
  }
  dayRecord.completedTaskIds = Array.from(completedIds);

  return {
    ...(history || {}),
    [dateStr]: dayRecord as Record<string, boolean>,
  };
}

/**
 * Manually toggles a task's completion status on a specific date (YYYY-MM-DD) when the user clicks
 * a Day pill (e.g. SUN, MON, ..., SAT) in the Weekly/Monthly Task Audit.
 * Also syncs today's tasks list if the toggled date is todayStr.
 */
export function toggleTaskAuditDay(
  history: TaskHistoryMap,
  tasks: DailyTask[],
  taskId: string,
  dateStr: string,
  todayStr: string
): {
  nextHistory: TaskHistoryMap;
  nextTasks: DailyTask[];
  nextCompleted: boolean;
} {
  const safeTasks = normalizeDailyTasks(tasks);
  const safeHistory = history && typeof history === 'object' ? { ...history } : {};
  const existingDay = (safeHistory[dateStr] || {}) as Record<string, unknown> & {
    completedTaskIds?: string[];
  };

  const isToday = dateStr === todayStr;
  const targetTask = safeTasks.find((t) => t.id === taskId);
  const statsTemplate = targetTask
    ? getTaskPortionStats(targetTask)
    : { hasPortions: false, totalPortions: 1, unit: 'days' };

  let currentPercent = 0;
  if (isToday && targetTask) {
    currentPercent = getTaskPortionStats(targetTask).percent;
  } else if (existingDay[`${taskId}_percent`] !== undefined) {
    currentPercent = Number(existingDay[`${taskId}_percent`]);
  } else if (existingDay[taskId] === true) {
    currentPercent = 100;
  } else if (
    Array.isArray(existingDay.completedTaskIds) &&
    existingDay.completedTaskIds.includes(taskId)
  ) {
    currentPercent = 100;
  }

  // If already 100% complete, toggle to 0% (Missed). If 0% or partial (1-99%), toggle to 100% (Completed).
  const nextCompleted = currentPercent < 100;

  const completedIds = new Set<string>(
    Array.isArray(existingDay.completedTaskIds) ? existingDay.completedTaskIds : []
  );
  if (nextCompleted) {
    completedIds.add(taskId);
  } else {
    completedIds.delete(taskId);
  }

  const updatedDay: Record<string, unknown> = {
    ...existingDay,
    [taskId]: nextCompleted,
    completedTaskIds: Array.from(completedIds),
  };

  if (statsTemplate.hasPortions) {
    updatedDay[`${taskId}_portion`] = nextCompleted ? statsTemplate.totalPortions : 0;
    updatedDay[`${taskId}_percent`] = nextCompleted ? 100 : 0;
    updatedDay[`${taskId}_total`] = statsTemplate.totalPortions;
  }

  let nextTasks = safeTasks;
  if (isToday) {
    nextTasks = safeTasks.map((t) => {
      if (t.id !== taskId) return t;
      return {
        ...t,
        completed: nextCompleted,
        completedAt: nextCompleted ? new Date().toISOString() : undefined,
        subtasks: t.subtasks
          ? t.subtasks.map((st) => ({ ...st, completed: nextCompleted }))
          : undefined,
      };
    });
  }

  const nextHistory: TaskHistoryMap = {
    ...safeHistory,
    [dateStr]: updatedDay as Record<string, boolean>,
  };

  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem('adhkar_tasks_history', JSON.stringify(nextHistory));
      if (isToday) {
        localStorage.setItem('adhkar_daily_tasks', JSON.stringify(nextTasks));
        localStorage.setItem('adhkar_tasks_date', todayStr);
      }
    } catch {
      // ignore storage errors
    }
  }

  return { nextHistory, nextTasks, nextCompleted };
}

/**
 * Dynamically loads and merges task completion history from localStorage
 * (`adhkar_tasks_history`, `adhkar_daily_tasks`, and `adhkar_progress_history`).
 */
export function loadAndSyncTaskHistory(
  todayStr: string,
  currentTasks: DailyTask[]
): TaskHistoryMap {
  const safeCurrentTasks = normalizeDailyTasks(currentTasks);
  let history: TaskHistoryMap = {};

  if (typeof localStorage !== 'undefined') {
    try {
      const rawHistory = localStorage.getItem('adhkar_tasks_history');
      if (rawHistory) {
        const parsed = JSON.parse(rawHistory);
        if (parsed && typeof parsed === 'object') {
          history = parsed as TaskHistoryMap;
        }
      }
    } catch {
      // ignore parse errors
    }

    // Backfill from existing `adhkar_progress_history` if any prior dates recorded task/adhkar progress
    try {
      const rawProgressHistory = localStorage.getItem('adhkar_progress_history');
      if (rawProgressHistory) {
        const parsedProgress = JSON.parse(rawProgressHistory) as Record<
          string,
          {
            sections?: {
              morning?: number;
              evening?: number;
              tasks?: number;
            };
          }
        >;

        for (const [dateKey, record] of Object.entries(parsedProgress)) {
          if (dateKey === todayStr || history[dateKey]) continue;
          const sections = record?.sections;
          if (!sections) continue;

          const inferredDay: Record<string, boolean> = {};
          const tasksPct = Number(sections.tasks || 0);
          const countToMark = Math.round((tasksPct / 100) * safeCurrentTasks.length);

          safeCurrentTasks.forEach((t, idx) => {
            if (t.id === 'task-morning-adhkar' && Number(sections.morning || 0) >= 100) {
              inferredDay[t.id] = true;
            } else if (t.id === 'task-evening-adhkar' && Number(sections.evening || 0) >= 100) {
              inferredDay[t.id] = true;
            } else {
              inferredDay[t.id] = idx < countToMark;
            }
          });

          history[dateKey] = inferredDay;
        }
      }
    } catch {
      // ignore backfill errors
    }
  }

  const synced = upsertTaskHistoryForDate(history, todayStr, safeCurrentTasks);

  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem('adhkar_tasks_history', JSON.stringify(synced));
    } catch {
      // ignore storage quota errors
    }
  }

  return synced;
}

/**
 * Builds the itemized Weekly (7 days) or Monthly (30 days) Task Audit Report
 * with per-task completion ratios, 7/30 mini status dots, filter counts, and
 * Malayalam summary notes for Most Completed and Most Skipped tasks.
 */
export function buildTaskAuditReport(
  tasks: DailyTask[],
  history: TaskHistoryMap,
  period: TaskAuditPeriod,
  filter: TaskAuditFilter,
  todayStr: string
): TaskAuditReport {
  const safeTasks = normalizeDailyTasks(tasks);
  const safeHistory = history && typeof history === 'object' ? history : {};
  const totalDays = period === 'week' ? 7 : 30;
  const endDate = parseLocalDateKey(todayStr);

  // Build chronological dates ending on todayStr
  const dateItems: { dateStr: string; shortLabel: string; dayOfWeek: string; isToday: boolean }[] = [];
  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(endDate);
    d.setDate(endDate.getDate() - i);
    const dStr = formatLocalDateKey(d);
    const dayOfWeek = SHORT_DAY_NAMES[d.getDay()];
    const shortLabel = `${SHORT_MONTH_NAMES[d.getMonth()]} ${d.getDate()}`;
    dateItems.push({
      dateStr: dStr,
      shortLabel,
      dayOfWeek,
      isToday: i === 0,
    });
  }

  const rows: TaskAuditRow[] = safeTasks.map((task) => {
    const todayStats = getTaskPortionStats(task);
    const hasPortions = todayStats.hasPortions;
    const unit = todayStats.unit;
    const singleDayPortions = hasPortions ? todayStats.totalPortions : 1;

    const dots: TaskAuditDayDot[] = dateItems.map((item) => {
      let percent = 0;
      let completedPortions = 0;
      const totalPortions = singleDayPortions;

      if (item.isToday) {
        percent = todayStats.percent;
        completedPortions = hasPortions
          ? todayStats.completedPortions
          : todayStats.isComplete
          ? 1
          : 0;
      } else {
        const dayEntry = safeHistory[item.dateStr] as Record<string, unknown> | undefined;
        if (dayEntry) {
          if (hasPortions && typeof dayEntry[`${task.id}_portion`] === 'number') {
            completedPortions = Number(dayEntry[`${task.id}_portion`]);
            percent =
              typeof dayEntry[`${task.id}_percent`] === 'number'
                ? Number(dayEntry[`${task.id}_percent`])
                : totalPortions > 0
                ? Math.min(100, Math.round((completedPortions / totalPortions) * 100))
                : 0;
          } else if (
            dayEntry[task.id] === true ||
            (Array.isArray(dayEntry.completedTaskIds) &&
              dayEntry.completedTaskIds.includes(task.id))
          ) {
            completedPortions = totalPortions;
            percent = 100;
          } else {
            completedPortions = 0;
            percent = 0;
          }
        }
      }

      const completed = percent === 100;
      const status: 'completed' | 'partial' | 'missed' =
        percent === 100 ? 'completed' : percent > 0 ? 'partial' : 'missed';

      return {
        date: item.dateStr,
        shortLabel: item.shortLabel,
        dayOfWeek: item.dayOfWeek,
        completed,
        status,
        percent,
        completedPortions,
        totalPortions,
        isToday: item.isToday,
      };
    });

    const completedDays = dots.filter((d) => d.status === 'completed').length;
    const partialDays = dots.filter((d) => d.status === 'partial').length;
    const missedDays = dots.filter((d) => d.status === 'missed').length;

    let completionPercent: number;
    let ratioLabel: string;
    let totalPortionsCompleted: number;
    let totalPortionsPossible: number;

    if (hasPortions) {
      totalPortionsCompleted = dots.reduce((acc, d) => acc + d.completedPortions, 0);
      totalPortionsPossible = totalDays * singleDayPortions;
      completionPercent =
        totalPortionsPossible > 0
          ? Math.round((totalPortionsCompleted / totalPortionsPossible) * 100)
          : 0;
      ratioLabel = `${totalPortionsCompleted}/${totalPortionsPossible} ${unit}`;
    } else {
      totalPortionsCompleted = completedDays;
      totalPortionsPossible = totalDays;
      completionPercent = Math.round((completedDays / totalDays) * 100);
      ratioLabel = `${completedDays}/${totalDays} days`;
    }

    // A task matches "Completed (പൂർത്തിയായവ)" if completed on at least 1 day or partially done
    const isCompletedFilterMatch = Boolean(
      completedDays > 0 || partialDays > 0 || todayStats.percent > 0
    );
    // A task matches "Missed (നഷ്ടപ്പെട്ടവ)" if missed or partially missed on any day
    const isMissedFilterMatch = Boolean(
      missedDays > 0 || partialDays > 0 || todayStats.percent < 100
    );

    return {
      task,
      completedDays,
      partialDays,
      totalDays,
      missedDays,
      completionPercent,
      ratioLabel,
      totalPortionsCompleted,
      totalPortionsPossible,
      unit,
      hasPortions,
      dots,
      isCompletedFilterMatch,
      isMissedFilterMatch,
    };
  });

  // Determine Most Completed Task and Most Skipped Task based on completionPercent
  let mostCompletedTask: TaskAuditRow | null = null;
  let mostSkippedTask: TaskAuditRow | null = null;

  if (rows.length > 0) {
    const sortedByMostCompleted = [...rows].sort((a, b) => {
      if (b.completionPercent !== a.completionPercent) {
        return b.completionPercent - a.completionPercent;
      }
      if (b.completedDays !== a.completedDays) {
        return b.completedDays - a.completedDays;
      }
      return 0;
    });
    mostCompletedTask = sortedByMostCompleted[0];

    const sortedByMostSkipped = [...rows].sort((a, b) => {
      if (a.completionPercent !== b.completionPercent) {
        return a.completionPercent - b.completionPercent;
      }
      if (a.completedDays !== b.completedDays) {
        return a.completedDays - b.completedDays;
      }
      return 0;
    });

    mostSkippedTask =
      sortedByMostSkipped.find((r) => r.task.id !== mostCompletedTask?.task.id) ||
      sortedByMostSkipped[0];
  }

  const mostCompletedSummaryText = mostCompletedTask
    ? `${mostCompletedTask.task.malayalamTitle || mostCompletedTask.task.title} (${mostCompletedTask.task.title} • ${mostCompletedTask.ratioLabel})`
    : '—';

  const mostSkippedSummaryText = mostSkippedTask
    ? `${mostSkippedTask.task.malayalamTitle || mostSkippedTask.task.title} (${mostSkippedTask.task.title} • ${mostSkippedTask.ratioLabel})`
    : '—';

  const filteredRows =
    filter === 'completed'
      ? rows.filter((r) => r.isCompletedFilterMatch)
      : filter === 'missed'
      ? rows.filter((r) => r.isMissedFilterMatch)
      : rows;

  return {
    period,
    totalDays,
    rows,
    filteredRows,
    mostCompletedTask,
    mostSkippedTask,
    mostCompletedSummaryText,
    mostSkippedSummaryText,
    counts: {
      all: rows.length,
      completed: rows.filter((r) => r.isCompletedFilterMatch).length,
      missed: rows.filter((r) => r.isMissedFilterMatch).length,
    },
  };
}

