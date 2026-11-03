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
  upsertTaskHistoryForDate,
  buildTaskAuditReport,
  normalizeDailyTasks,
  toggleTaskAuditDay,
  isTaskEffectivelyCompleted,
} from './tasks-utils.ts';
import {
  MORNING_ADHKAR,
  EVENING_ADHKAR,
  PRAYER_ADHKAR,
  SLEEP_ADHKAR,
} from '../data/adhkarData.ts';
import { DEFAULT_DAILY_TASKS } from '../data/defaultTasks.ts';
import { generateSingleFileHtml } from './single-file-generator.ts';
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

test('toggleSubtask does NOT mark parent completed on single portion; parent marks completed ONLY when all portions are checked', () => {
  const tasks = createMockTasks();

  // Complete Fajr subtask only (1 of 2) -> parent remains incomplete (completed: false)
  const step1 = toggleSubtask(tasks, 't-1', 'fajr');
  const t1Step1 = step1.find((t) => t.id === 't-1')!;
  assert.equal(t1Step1.subtasks?.find((s) => s.id === 'fajr')?.completed, true);
  assert.equal(t1Step1.subtasks?.find((s) => s.id === 'dhuhr')?.completed, false);
  assert.equal(t1Step1.completed, false, 'Parent should remain false when only Fajr is checked');
  assert.equal(isTaskEffectivelyCompleted(t1Step1), false);

  // Clicking toggleTask on partially completed task marks ALL subtasks completed (100%)
  const allMarked = toggleTask(step1, 't-1');
  const t1All = allMarked.find((t) => t.id === 't-1')!;
  assert.equal(t1All.completed, true);
  assert.equal(isTaskEffectivelyCompleted(t1All), true);
  assert.ok(t1All.subtasks?.every((s) => s.completed), 'toggleTask should complete remaining subtasks');

  // Uncheck Fajr when Dhuhr is still checked -> reverts to false (not 100%)
  const step2 = toggleSubtask(allMarked, 't-1', 'fajr');
  const t1Step2 = step2.find((t) => t.id === 't-1')!;
  assert.equal(t1Step2.completed, false, 'Parent must revert to incomplete when any subtask is unchecked');
  assert.equal(isTaskEffectivelyCompleted(t1Step2), false);

  // Uncheck Dhuhr as well -> all subtasks unchecked, parent remains false
  const step3 = toggleSubtask(step2, 't-1', 'dhuhr');
  const t1Step3 = step3.find((t) => t.id === 't-1')!;
  assert.equal(t1Step3.completed, false);
  assert.equal(isTaskEffectivelyCompleted(t1Step3), false);
});

test('checking any prayer in 5 Daily Prayers or 12 Rawatib displays partial percentage and amber dot, and all prayers turns green', () => {
  const todayStr = '2026-10-31';
  let tasks = structuredClone(DEFAULT_DAILY_TASKS);
  let history = upsertTaskHistoryForDate({}, todayStr, tasks);

  // Initially 0 prayers checked -> audit dot for today is Missed (status: 'missed')
  const initialReport = buildTaskAuditReport(tasks, history, 'week', 'all', todayStr);
  const fardRow0 = initialReport.rows.find((r) => r.task.id === 'task-fard-prayers')!;
  const rawatibRow0 = initialReport.rows.find((r) => r.task.id === 'task-rawatib')!;
  assert.equal(fardRow0.dots[6].status, 'missed');
  assert.equal(fardRow0.dots[6].completed, false);
  assert.equal(rawatibRow0.dots[6].status, 'missed');
  assert.equal(rawatibRow0.dots[6].completed, false);

  // Check Fajr in 5 Daily Obligatory Prayers (1/5 = 20%) and 2 before Fajr in 12 Sunnah Rawatib (2/12 = 17%)
  tasks = toggleSubtask(tasks, 'task-fard-prayers', 'fajr');
  tasks = toggleSubtask(tasks, 'task-rawatib', 'rawatib-fajr');
  history = upsertTaskHistoryForDate(history, todayStr, tasks);

  const afterSubtaskReport = buildTaskAuditReport(tasks, history, 'week', 'all', todayStr);
  const fardRow1 = afterSubtaskReport.rows.find((r) => r.task.id === 'task-fard-prayers')!;
  const rawatibRow1 = afterSubtaskReport.rows.find((r) => r.task.id === 'task-rawatib')!;
  assert.equal(fardRow1.dots[6].status, 'partial', 'Today audit dot for 1/5 Fard Prayers must be partial (amber)');
  assert.equal(fardRow1.dots[6].percent, 20);
  assert.equal(fardRow1.dots[6].completed, false);
  assert.equal(rawatibRow1.dots[6].status, 'partial', 'Today audit dot for 2/12 Rawatib must be partial (amber)');
  assert.equal(rawatibRow1.dots[6].completed, false);

  // Check remaining 4 Fard prayers -> 5/5 = 100%
  tasks = toggleSubtask(tasks, 'task-fard-prayers', 'dhuhr');
  tasks = toggleSubtask(tasks, 'task-fard-prayers', 'asr');
  tasks = toggleSubtask(tasks, 'task-fard-prayers', 'maghrib');
  tasks = toggleSubtask(tasks, 'task-fard-prayers', 'isha');
  history = upsertTaskHistoryForDate(history, todayStr, tasks);

  const fullReport = buildTaskAuditReport(tasks, history, 'week', 'all', todayStr);
  const fardRowFull = fullReport.rows.find((r) => r.task.id === 'task-fard-prayers')!;
  assert.equal(fardRowFull.dots[6].status, 'completed', 'Today audit dot for 5/5 Fard Prayers must turn Green');
  assert.equal(fardRowFull.dots[6].percent, 100);
  assert.equal(fardRowFull.dots[6].completed, true);

  // Test manual Day pill override (e.g. toggling yesterday 2026-10-30 to Completed, and toggling today to Missed)
  const overrideYesterday = toggleTaskAuditDay(history, tasks, 'task-fard-prayers', '2026-10-30', todayStr);
  history = overrideYesterday.nextHistory;
  tasks = overrideYesterday.nextTasks;
  assert.equal(overrideYesterday.nextCompleted, true);

  const reportAfterYesterdayOverride = buildTaskAuditReport(tasks, history, 'week', 'all', todayStr);
  const fardRow2 = reportAfterYesterdayOverride.rows.find((r) => r.task.id === 'task-fard-prayers')!;
  assert.equal(fardRow2.dots[5].status, 'completed', 'Yesterday dot should be manually overridden to Completed');
  assert.equal(fardRow2.completedDays, 2);

  // Toggling today pill manually to Missed
  const overrideTodayOff = toggleTaskAuditDay(history, tasks, 'task-fard-prayers', todayStr, todayStr);
  history = overrideTodayOff.nextHistory;
  tasks = overrideTodayOff.nextTasks;
  assert.equal(overrideTodayOff.nextCompleted, false);
  const reportAfterTodayOff = buildTaskAuditReport(tasks, history, 'week', 'all', todayStr);
  const fardRow3 = reportAfterTodayOff.rows.find((r) => r.task.id === 'task-fard-prayers')!;
  assert.equal(fardRow3.dots[6].status, 'missed', 'Today dot should be manually overridden to Missed');
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

test('buildTaskAuditReport computes weekly (7d) and monthly (30d) itemized ratios, status dots, filters, and summary notes', () => {
  const tasks = createMockTasks(); // t-2 is completed today, t-1 and t-3 are false
  let history = {};
  history = upsertTaskHistoryForDate(history, '2026-10-27', [
    {
      ...tasks[0],
      completed: true,
      subtasks: [
        { id: 'fajr', label: 'Fajr', completed: true },
        { id: 'dhuhr', label: 'Dhuhr', completed: true },
      ],
    },
    { ...tasks[1], completed: true },
    { ...tasks[2], completed: false },
  ]);
  history = upsertTaskHistoryForDate(history, '2026-10-28', [
    { ...tasks[0], completed: false },
    { ...tasks[1], completed: true },
    { ...tasks[2], completed: false },
  ]);
  history = upsertTaskHistoryForDate(history, '2026-10-29', tasks);

  const weekReport = buildTaskAuditReport(tasks, history, 'week', 'all', '2026-10-29');
  assert.equal(weekReport.totalDays, 7);
  assert.equal(weekReport.rows.length, 3);
  assert.equal(weekReport.rows[0].dots.length, 7);

  // t-2 was completed on Oct 27, Oct 28, Oct 29 => 3/7 days
  const t2Row = weekReport.rows.find((r) => r.task.id === 't-2')!;
  assert.equal(t2Row.completedDays, 3);
  assert.equal(t2Row.ratioLabel, '3/7 days');

  // t-3 was completed 0/7 days
  const t3Row = weekReport.rows.find((r) => r.task.id === 't-3')!;
  assert.equal(t3Row.completedDays, 0);
  assert.equal(t3Row.ratioLabel, '0/7 days');

  // Most completed should be t-2, most skipped should be t-3
  assert.equal(weekReport.mostCompletedTask?.task.id, 't-2');
  assert.equal(weekReport.mostSkippedTask?.task.id, 't-3');

  // Test 'completed' filter chip (t-1 has 1/7, t-2 has 3/7, t-3 has 0/7)
  const completedReport = buildTaskAuditReport(tasks, history, 'week', 'completed', '2026-10-29');
  assert.equal(completedReport.filteredRows.length, 2);

  // Test 'month' period (30 dots)
  const monthReport = buildTaskAuditReport(tasks, history, 'month', 'all', '2026-10-29');
  assert.equal(monthReport.totalDays, 30);
  assert.equal(monthReport.rows[0].dots.length, 30);
  assert.equal(
    monthReport.rows.find((r) => r.task.id === 't-2')?.ratioLabel,
    '3/30 days'
  );
});

test('EVENING_ADHKAR and all adhkar datasets have 100% unabridged Arabic, English, and Malayalam translations with zero ellipses (...)', () => {
  assert.equal(EVENING_ADHKAR.length, 24);
  assert.equal(MORNING_ADHKAR.length, 25);

  const allCollections = [
    ...EVENING_ADHKAR,
    ...MORNING_ADHKAR,
    ...PRAYER_ADHKAR,
    ...SLEEP_ADHKAR,
  ];

  for (const item of allCollections) {
    assert.ok(item.arabic && item.arabic.trim().length > 0, `Missing arabic in ${item.id}`);
    assert.ok(item.translation && item.translation.trim().length > 0, `Missing English translation in ${item.id}`);
    assert.ok(
      item.malayalamTranslation && item.malayalamTranslation.trim().length > 0,
      `Missing Malayalam translation in ${item.id}`
    );
    assert.equal(
      item.translation.includes('...'),
      false,
      `Truncated ellipsis found in English translation of ${item.id}: ${item.translation}`
    );
    assert.equal(
      item.malayalamTranslation.includes('...'),
      false,
      `Truncated ellipsis found in Malayalam translation of ${item.id}: ${item.malayalamTranslation}`
    );
    if (item.transliteration) {
      assert.equal(
        item.transliteration.includes('...'),
        false,
        `Truncated ellipsis found in transliteration of ${item.id}`
      );
    }
    if (item.title) {
      assert.equal(
        item.title.includes('...'),
        false,
        `Truncated ellipsis found in title of ${item.id}: ${item.title}`
      );
    }
  }
});

test('generateSingleFileHtml outputs complete standalone HTML containing all 11 tasks, Weekly & Monthly Task Audit, filter chips, and unabridged Evening Adhkar', () => {
  const html = generateSingleFileHtml();
  assert.ok(html.startsWith('<!DOCTYPE html>'));
  assert.ok(html.includes('data-tab="tasks"'));
  assert.ok(html.includes('0/11'));
  assert.ok(html.includes('Weekly &amp; Monthly Task Audit'));
  assert.ok(html.includes('ടാസ്‌ക് പുരോഗതി'));
  assert.ok(html.includes('This Week (ഈ ആഴ്ച)'));
  assert.ok(html.includes('This Month (ഈ മാസം)'));
  assert.ok(html.includes('All (എല്ലാം)'));
  assert.ok(html.includes('Completed (പൂർത്തിയായവ)'));
  assert.ok(html.includes('Missed (നഷ്ടപ്പെട്ടവ)'));
  assert.ok(html.includes('ഏറ്റവും കൃത്യമായി ചെയ്തത്:'));
  assert.ok(html.includes('ശ്രദ്ധിക്കേണ്ട ടാസ്ക്:'));

  // Verify all 11 default tasks are embedded
  assert.equal(DEFAULT_DAILY_TASKS.length, 11);
  for (const task of DEFAULT_DAILY_TASKS) {
    assert.ok(html.includes(task.id), `Missing task ID ${task.id} in single-file HTML`);
    assert.ok(html.includes(task.title), `Missing task title ${task.title} in single-file HTML`);
    assert.ok(html.includes(task.malayalamTitle), `Missing task Malayalam title ${task.malayalamTitle} in single-file HTML`);
  }

  // Verify zero "..." inside the embedded ADHKAR_DATA JSON
  const match = html.match(/window\.ADHKAR_DATA\s*=\s*(\{[\s\S]*?\});\s*<\/script>/);
  assert.ok(match && match[1], 'Embedded window.ADHKAR_DATA JSON must exist');
  assert.equal(match[1].includes('...'), false, 'Embedded window.ADHKAR_DATA must not contain any "..." ellipses');
});

test('normalizeDailyTasks and calculateTasksProgress safely handle legacy { date, tasks } objects and non-arrays without throwing', () => {
  const mockTasks = createMockTasks();
  const wrappedPayload = { date: '2026-10-31', tasks: mockTasks };

  const normalized = normalizeDailyTasks(wrappedPayload, DEFAULT_DAILY_TASKS);
  assert.equal(normalized.length, 3);
  assert.equal(normalized[1].id, 't-2');

  const statsFromWrapped = calculateTasksProgress(wrappedPayload);
  assert.equal(statsFromWrapped.total, 3);
  assert.equal(statsFromWrapped.completed, 1);
  assert.equal(statsFromWrapped.percent, 33);

  const statsFromInvalid = calculateTasksProgress({ invalid: true });
  assert.deepEqual(statsFromInvalid, {
    completed: 0,
    total: 0,
    percent: 0,
    isAllDone: false,
  });

  const fallbackFromNull = normalizeDailyTasks(null, DEFAULT_DAILY_TASKS);
  assert.equal(fallbackFromNull.length, 11);
});


