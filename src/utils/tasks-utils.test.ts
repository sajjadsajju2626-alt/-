import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateTasksProgress,
  toggleTask,
  toggleSubtask,
  addCustomTask,
  deleteTask,
  resetDailyTasks,
  completeAllTasks,
  syncAdhkarWithTasks,
  filterDailyTasks,
  shouldResetTasksDate,
} from './tasks-utils.ts';
import type { DailyTask } from '../types/tasks.ts';

const createMockTasks = (): DailyTask[] => [
  {
    id: 't-1',
    title: '5 Fard Prayers',
    arabicTitle: 'الصلوات الخمس',
    malayalamTitle: '5 ഫർള് നമസ്കാരങ്ങൾ',
    category: 'prayer',
    completed: false,
    subtasks: [
      { id: 'fajr', label: 'Fajr', completed: false },
      { id: 'dhuhr', label: 'Dhuhr', completed: false },
    ],
  },
  {
    id: 't-2',
    title: 'Morning Adhkar',
    arabicTitle: 'أذكار الصباح',
    malayalamTitle: 'പ്രഭാത ദിക്റുകൾ',
    category: 'dhikr',
    completed: true,
  },
  {
    id: 't-3',
    title: 'Duha Prayer',
    arabicTitle: 'صلاة الضحى',
    malayalamTitle: 'ദ്വുഹാ നമസ്കാരം',
    category: 'sunnah',
    completed: false,
  },
];

test('calculateTasksProgress handles zero, partial, and 100% completion', () => {
  const emptyRes = calculateTasksProgress([]);
  assert.equal(emptyRes.total, 0);
  assert.equal(emptyRes.completed, 0);
  assert.equal(emptyRes.percent, 0);
  assert.equal(emptyRes.isAllDone, false);

  const partialTasks = createMockTasks();
  const partialRes = calculateTasksProgress(partialTasks);
  assert.equal(partialRes.total, 3);
  assert.equal(partialRes.completed, 1);
  assert.equal(partialRes.percent, 33);
  assert.equal(partialRes.isAllDone, false);

  const allTasks = completeAllTasks(partialTasks);
  const allRes = calculateTasksProgress(allTasks);
  assert.equal(allRes.total, 3);
  assert.equal(allRes.completed, 3);
  assert.equal(allRes.percent, 100);
  assert.equal(allRes.isAllDone, true);
});

test('toggleTask toggles boolean status and cascades to all subtasks', () => {
  const tasks = createMockTasks();

  // Toggle t-1 (which has subtasks) to completed
  const toggledOn = toggleTask(tasks, 't-1');
  const t1 = toggledOn.find((t) => t.id === 't-1')!;
  assert.equal(t1.completed, true);
  assert.ok(t1.completedAt);
  assert.ok(t1.subtasks?.every((st) => st.completed));

  // Toggle t-1 back to false
  const toggledOff = toggleTask(toggledOn, 't-1');
  const t1Off = toggledOff.find((t) => t.id === 't-1')!;
  assert.equal(t1Off.completed, false);
  assert.ok(t1Off.subtasks?.every((st) => !st.completed));
});

test('toggleSubtask updates subtask and sets parent completed only when all subtasks complete', () => {
  const tasks = createMockTasks();

  // Complete Fajr subtask only
  const step1 = toggleSubtask(tasks, 't-1', 'fajr');
  const t1Step1 = step1.find((t) => t.id === 't-1')!;
  assert.equal(t1Step1.subtasks?.find((s) => s.id === 'fajr')?.completed, true);
  assert.equal(t1Step1.subtasks?.find((s) => s.id === 'dhuhr')?.completed, false);
  assert.equal(t1Step1.completed, false, 'Parent should remain false until all subtasks complete');

  // Complete Dhuhr subtask as well
  const step2 = toggleSubtask(step1, 't-1', 'dhuhr');
  const t1Step2 = step2.find((t) => t.id === 't-1')!;
  assert.equal(t1Step2.completed, true, 'Parent should automatically mark complete when all subtasks done');

  // Uncheck Fajr
  const step3 = toggleSubtask(step2, 't-1', 'fajr');
  const t1Step3 = step3.find((t) => t.id === 't-1')!;
  assert.equal(t1Step3.completed, false, 'Parent should revert to incomplete when one subtask is undone');
});

test('addCustomTask and deleteTask manage user tasks correctly', () => {
  const tasks = createMockTasks();
  assert.equal(tasks.length, 3);

  const withNew = addCustomTask(tasks, {
    title: 'Attend Islamic lecture',
    category: 'custom',
    malayalamTitle: 'മതപ്രഭാഷണം കേൾക്കൽ',
  });
  assert.equal(withNew.length, 4);
  const added = withNew[3];
  assert.equal(added.title, 'Attend Islamic lecture');
  assert.equal(added.malayalamTitle, 'മതപ്രഭാഷണം കേൾക്കൽ');
  assert.equal(added.isCustom, true);
  assert.equal(added.completed, false);

  // Ignoring empty title
  const noChange = addCustomTask(withNew, { title: '   ' });
  assert.equal(noChange.length, 4);

  // Delete task
  const afterDelete = deleteTask(withNew, added.id);
  assert.equal(afterDelete.length, 3);
  assert.equal(afterDelete.some((t) => t.id === added.id), false);
});

test('resetDailyTasks clears completions while preserving tasks and subtasks structure', () => {
  const tasks = completeAllTasks(createMockTasks());
  assert.ok(tasks.every((t) => t.completed));

  const reset = resetDailyTasks(tasks);
  assert.equal(reset.length, 3);
  assert.ok(reset.every((t) => !t.completed));
  assert.ok(reset[0].subtasks?.every((st) => !st.completed));
});

test('syncAdhkarWithTasks links morning and evening adhkar completion', () => {
  const tasks: DailyTask[] = [
    {
      id: 'task-morning-adhkar',
      title: 'Morning Adhkar',
      arabicTitle: 'أذكار الصباح',
      malayalamTitle: 'പ്രഭാത ദിക്റുകൾ',
      category: 'dhikr',
      completed: false,
    },
    {
      id: 'task-evening-adhkar',
      title: 'Evening Adhkar',
      arabicTitle: 'أذكار المساء',
      malayalamTitle: 'സായാഹ്ന ദിക്റുകൾ',
      category: 'dhikr',
      completed: false,
    },
  ];

  const synced1 = syncAdhkarWithTasks(tasks, true, false);
  assert.equal(synced1.find((t) => t.id === 'task-morning-adhkar')?.completed, true);
  assert.equal(synced1.find((t) => t.id === 'task-evening-adhkar')?.completed, false);

  const synced2 = syncAdhkarWithTasks(synced1, true, true);
  assert.equal(synced2.find((t) => t.id === 'task-evening-adhkar')?.completed, true);
});

test('filterDailyTasks filters by status, category, and search query', () => {
  const tasks = createMockTasks();

  const incompleteOnly = filterDailyTasks(tasks, 'incomplete', 'all', '');
  assert.equal(incompleteOnly.length, 2);

  const completedOnly = filterDailyTasks(tasks, 'completed', 'all', '');
  assert.equal(completedOnly.length, 1);

  const prayerOnly = filterDailyTasks(tasks, 'all', 'prayer', '');
  assert.equal(prayerOnly.length, 1);
  assert.equal(prayerOnly[0].category, 'prayer');

  const searchFajr = filterDailyTasks(tasks, 'all', 'all', 'fard');
  assert.equal(searchFajr.length, 1);

  const searchMalayalam = filterDailyTasks(tasks, 'all', 'all', 'ഫർള്');
  assert.equal(searchMalayalam.length, 1);
});

test('shouldResetTasksDate detects calendar date boundaries', () => {
  assert.equal(shouldResetTasksDate(null, '2026-10-25'), true);
  assert.equal(shouldResetTasksDate(undefined, '2026-10-25'), true);
  assert.equal(shouldResetTasksDate('2026-10-24', '2026-10-25'), true);
  assert.equal(shouldResetTasksDate('2026-10-25', '2026-10-25'), false);
});
