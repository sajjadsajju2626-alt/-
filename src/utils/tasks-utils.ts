import type { DailyTask, TaskFilterStatus } from '../types/tasks.ts';

/**
 * Calculates completion statistics for daily tasks.
 */
export function calculateTasksProgress(tasks: DailyTask[]): {
  completed: number;
  total: number;
  percent: number;
  isAllDone: boolean;
} {
  const total = tasks.length;
  if (total === 0) {
    return { completed: 0, total: 0, percent: 0, isAllDone: false };
  }

  const completed = tasks.filter((t) => t.completed).length;
  const percent = Math.round((completed / total) * 100);
  const isAllDone = completed === total && total > 0;

  return { completed, total, percent, isAllDone };
}

/**
 * Toggles a main task completion status.
 * If the task has subtasks, toggling the parent sets all subtasks accordingly.
 */
export function toggleTask(tasks: DailyTask[], taskId: string): DailyTask[] {
  return tasks.map((task) => {
    if (task.id !== taskId) return task;

    const nextCompleted = !task.completed;
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
 * Toggles an individual subtask within a parent task (e.g., Fajr in 5 Fard Prayers).
 * Updates parent completed status: true if all subtasks are complete, false otherwise.
 */
export function toggleSubtask(
  tasks: DailyTask[],
  taskId: string,
  subtaskId: string
): DailyTask[] {
  return tasks.map((task) => {
    if (task.id !== taskId || !task.subtasks) return task;

    const updatedSubtasks = task.subtasks.map((st) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );

    const allSubtasksDone = updatedSubtasks.every((st) => st.completed);

    return {
      ...task,
      subtasks: updatedSubtasks,
      completed: allSubtasksDone,
      completedAt: allSubtasksDone ? new Date().toISOString() : undefined,
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
  const trimmedTitle = data.title.trim();
  if (!trimmedTitle) return tasks;

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

  return [...tasks, newTask];
}

/**
 * Deletes a task from the list (primarily custom tasks).
 */
export function deleteTask(tasks: DailyTask[], taskId: string): DailyTask[] {
  return tasks.filter((t) => t.id !== taskId);
}

/**
 * Resets all task and subtask completions for a new day.
 */
export function resetDailyTasks(tasks: DailyTask[]): DailyTask[] {
  return tasks.map((task) => ({
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
  return tasks.map((task) => ({
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
  let changed = false;

  const nextTasks = tasks.map((task) => {
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

  return changed ? nextTasks : tasks;
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
  let filtered = tasks;

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
  completed: boolean;
  isToday: boolean;
}

export interface TaskAuditRow {
  task: DailyTask;
  completedDays: number;
  totalDays: number; // 7 for week, 30 for month
  missedDays: number;
  completionPercent: number;
  ratioLabel: string; // e.g. "5/7 days" or "22/30 days"
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
  const dayRecord: Record<string, boolean> = { ...(history[dateStr] || {}) };
  for (const task of tasks) {
    dayRecord[task.id] = Boolean(task.completed);
  }
  return {
    ...history,
    [dateStr]: dayRecord,
  };
}

/**
 * Dynamically loads and merges task completion history from localStorage
 * (`adhkar_tasks_history`, `adhkar_daily_tasks`, and `adhkar_progress_history`).
 */
export function loadAndSyncTaskHistory(
  todayStr: string,
  currentTasks: DailyTask[]
): TaskHistoryMap {
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
          const countToMark = Math.round((tasksPct / 100) * currentTasks.length);

          currentTasks.forEach((t, idx) => {
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

  const synced = upsertTaskHistoryForDate(history, todayStr, currentTasks);

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

  const rows: TaskAuditRow[] = tasks.map((task) => {
    const dots: TaskAuditDayDot[] = dateItems.map((item) => {
      const completed = item.isToday
        ? Boolean(task.completed || history[item.dateStr]?.[task.id])
        : Boolean(history[item.dateStr]?.[task.id]);
      return {
        date: item.dateStr,
        shortLabel: item.shortLabel,
        dayOfWeek: item.dayOfWeek,
        completed,
        isToday: item.isToday,
      };
    });

    const completedDays = dots.filter((d) => d.completed).length;
    const missedDays = totalDays - completedDays;
    const completionPercent = Math.round((completedDays / totalDays) * 100);
    const ratioLabel = `${completedDays}/${totalDays} days`;

    // A task matches "Completed (പൂർത്തിയായവ)" if it was completed today or achieved on at least 1 day in the period
    const isCompletedFilterMatch = Boolean(task.completed || completedDays > 0);
    // A task matches "Missed (നഷ്ടപ്പെട്ടവ)" if it was missed on any day in the period or not completed today
    const isMissedFilterMatch = Boolean(!task.completed || missedDays > 0);

    return {
      task,
      completedDays,
      totalDays,
      missedDays,
      completionPercent,
      ratioLabel,
      dots,
      isCompletedFilterMatch,
      isMissedFilterMatch,
    };
  });

  // Determine Most Completed Task and Most Skipped Task
  let mostCompletedTask: TaskAuditRow | null = null;
  let mostSkippedTask: TaskAuditRow | null = null;

  if (rows.length > 0) {
    const sortedByMostCompleted = [...rows].sort((a, b) => {
      if (b.completedDays !== a.completedDays) {
        return b.completedDays - a.completedDays;
      }
      if (a.task.completed !== b.task.completed) {
        return a.task.completed ? -1 : 1;
      }
      return 0;
    });
    mostCompletedTask = sortedByMostCompleted[0];

    const sortedByMostSkipped = [...rows].sort((a, b) => {
      if (a.completedDays !== b.completedDays) {
        return a.completedDays - b.completedDays;
      }
      if (a.task.completed !== b.task.completed) {
        return a.task.completed ? 1 : -1;
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

