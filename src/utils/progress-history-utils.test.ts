import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateTotalRecitationsForDay,
  buildDailyProgressRecord,
  upsertDailyProgressHistory,
  getHeatmapIntensityLevel,
  getLast7DaysWeeklySummary,
  getMonthlyCalendarGrid,
  getOverallProgressStats,
  isAllFourAdhkarCompleted,
  ProgressHistoryMap,
} from './progress-history-utils.ts';

test('calculateTotalRecitationsForDay sums adhkar counts, tasbih count, and completed tasks', () => {
  const counts = { 'm-1': 3, 'm-2': 10, 'e-1': 1 };
  assert.equal(calculateTotalRecitationsForDay(counts, 33, 5), 52);
});

test('buildDailyProgressRecord builds accurate section breakdown and overall percent', () => {
  const rec = buildDailyProgressRecord({
    date: '2026-10-27',
    morningPercent: 100,
    eveningPercent: 100,
    prayerPercent: 100,
    sleepPercent: 100,
    tasksPercent: 50,
    tasbihCount: 66,
    overallPercent: 90,
    counts: { 'm-1': 3, 's-1': 1 },
    completedTasksCount: 5,
  });

  assert.equal(rec.date, '2026-10-27');
  assert.equal(rec.overallPercent, 100);
  assert.equal(rec.completedSectionsCount, 4);
  assert.equal(rec.totalRecitations, 75);
  assert.equal(rec.sections.morning, 100);
  assert.equal(rec.sections.tasbih, 66);
});

test('getHeatmapIntensityLevel maps 0% to 0 and 100% to 4', () => {
  assert.equal(getHeatmapIntensityLevel(0), 0);
  assert.equal(getHeatmapIntensityLevel(20), 1);
  assert.equal(getHeatmapIntensityLevel(50), 2);
  assert.equal(getHeatmapIntensityLevel(85), 3);
  assert.equal(getHeatmapIntensityLevel(100), 4);
});

test('getLast7DaysWeeklySummary returns 7 days ending on today with accurate weekly average', () => {
  let history: ProgressHistoryMap = {};
  history = upsertDailyProgressHistory(
    history,
    buildDailyProgressRecord({
      date: '2026-10-27',
      morningPercent: 100,
      eveningPercent: 100,
      prayerPercent: 100,
      sleepPercent: 100,
      tasksPercent: 100,
      tasbihCount: 33,
      overallPercent: 100,
      counts: { a: 10 },
      completedTasksCount: 11,
    })
  );
  history = upsertDailyProgressHistory(
    history,
    buildDailyProgressRecord({
      date: '2026-10-26',
      morningPercent: 40,
      eveningPercent: 40,
      prayerPercent: 40,
      sleepPercent: 40,
      tasksPercent: 40,
      tasbihCount: 10,
      overallPercent: 40,
      counts: { a: 5 },
      completedTasksCount: 4,
    })
  );

  const summary = getLast7DaysWeeklySummary(history, '2026-10-27');
  assert.equal(summary.days.length, 7);
  assert.equal(summary.days[6].date, '2026-10-27');
  assert.equal(summary.days[6].isToday, true);
  assert.equal(summary.days[6].isComplete, true);
  assert.equal(summary.weeklyAverage, 20); // (100 + 40) / 7 = 20
  assert.equal(summary.completedDaysInWeek, 2);
});

test('getMonthlyCalendarGrid builds month cells with accurate intensity levels', () => {
  const history: ProgressHistoryMap = {
    '2026-10-01': buildDailyProgressRecord({
      date: '2026-10-01',
      morningPercent: 100,
      eveningPercent: 100,
      prayerPercent: 100,
      sleepPercent: 100,
      tasksPercent: 100,
      tasbihCount: 33,
      overallPercent: 100,
      counts: { a: 25 },
      completedTasksCount: 11,
    }),
  };

  const grid = getMonthlyCalendarGrid(history, 2026, 9, '2026-10-27'); // Oct 2026 (month=9)
  assert.equal(grid.daysInMonth, 31);
  assert.equal(grid.cells.length, 31);
  assert.equal(grid.cells[0].intensityLevel, 4);
  assert.equal(grid.cells[1].intensityLevel, 0);
  assert.equal(grid.activeDaysInMonth, 1);
});

test('getOverallProgressStats aggregates total recitations and active days', () => {
  const history: ProgressHistoryMap = {
    '2026-10-26': buildDailyProgressRecord({
      date: '2026-10-26',
      morningPercent: 50,
      eveningPercent: 0,
      prayerPercent: 0,
      sleepPercent: 0,
      tasksPercent: 0,
      tasbihCount: 10,
      overallPercent: 20,
      counts: { m1: 15 },
      completedTasksCount: 0,
    }),
    '2026-10-27': buildDailyProgressRecord({
      date: '2026-10-27',
      morningPercent: 100,
      eveningPercent: 100,
      prayerPercent: 100,
      sleepPercent: 100,
      tasksPercent: 100,
      tasbihCount: 33,
      overallPercent: 100,
      counts: { m1: 50 },
      completedTasksCount: 11,
    }),
  };

  const stats = getOverallProgressStats(history, 3, 5);
  assert.equal(stats.totalRecitations, 25 + 94);
  assert.equal(stats.activeDays, 2);
  assert.equal(stats.currentStreak, 3);
  assert.equal(stats.bestStreak, 5);
});

test('isAllFourAdhkarCompleted detects when all four adhkar tabs reach 100%', () => {
  assert.equal(
    isAllFourAdhkarCompleted({
      morning: { completed: 25, total: 25, percent: 100, isAllDone: true },
      evening: { completed: 24, total: 24, percent: 100, isAllDone: true },
      prayer: { completed: 7, total: 7, percent: 100, isAllDone: true },
      sleep: { completed: 3, total: 3, percent: 100, isAllDone: true },
    }),
    true
  );

  assert.equal(
    isAllFourAdhkarCompleted({
      morning: { completed: 25, total: 25, percent: 100, isAllDone: true },
      evening: { completed: 24, total: 24, percent: 100, isAllDone: true },
      prayer: { completed: 7, total: 7, percent: 100, isAllDone: true },
      sleep: { completed: 2, total: 3, percent: 67, isAllDone: false },
    }),
    false
  );
});
