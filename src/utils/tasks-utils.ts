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
