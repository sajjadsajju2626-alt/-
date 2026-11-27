import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getJannahHouseProgress,
  isTaskExemptedInMode,
  isRawatibSubtaskWaivedInMode,
  computeProtectedStreak,
} from './safar-rawatib-utils.ts';

test('getJannahHouseProgress maps 0, 2, 6, 8, 10, 12 rakahs to progressive stages 0..5', () => {
  assert.deepEqual(getJannahHouseProgress(0), { rakahs: 0, stage: 0, fillPercent: 0, isComplete: false });
  assert.deepEqual(getJannahHouseProgress(2), { rakahs: 2, stage: 1, fillPercent: 17, isComplete: false });
  assert.deepEqual(getJannahHouseProgress(6), { rakahs: 6, stage: 2, fillPercent: 50, isComplete: false });
  assert.deepEqual(getJannahHouseProgress(8), { rakahs: 8, stage: 3, fillPercent: 67, isComplete: false });
  assert.deepEqual(getJannahHouseProgress(10), { rakahs: 10, stage: 4, fillPercent: 83, isComplete: false });
  assert.deepEqual(getJannahHouseProgress(12), { rakahs: 12, stage: 5, fillPercent: 100, isComplete: true });
});

test('Safar mode waives non-Fajr Rawatib subtasks while keeping 2 before Fajr active', () => {
  assert.equal(isRawatibSubtaskWaivedInMode('rawatib-fajr', 'safar'), false);
  assert.equal(isRawatibSubtaskWaivedInMode('rawatib-dhuhr-pre', 'safar'), true);
  assert.equal(isRawatibSubtaskWaivedInMode('rawatib-dhuhr-post', 'safar'), true);
  assert.equal(isRawatibSubtaskWaivedInMode('rawatib-maghrib', 'safar'), true);
  assert.equal(isRawatibSubtaskWaivedInMode('rawatib-isha', 'safar'), true);
  assert.equal(isRawatibSubtaskWaivedInMode('rawatib-dhuhr-pre', 'normal'), false);
});

test('Udhr mode exempts prayer tasks while keeping Daily Adhkar & Istighfar active', () => {
  assert.equal(isTaskExemptedInMode('task-fard-prayers', 'udhr'), true);
  assert.equal(isTaskExemptedInMode('task-rawatib', 'udhr'), true);
  assert.equal(isTaskExemptedInMode('task-duha', 'udhr'), true);
  assert.equal(isTaskExemptedInMode('task-qiyam-witr', 'udhr'), true);
  assert.equal(isTaskExemptedInMode('task-morning-adhkar', 'udhr'), false);
  assert.equal(isTaskExemptedInMode('task-evening-adhkar', 'udhr'), false);
  assert.equal(isTaskExemptedInMode('task-istighfar', 'udhr'), false);
  assert.equal(isTaskExemptedInMode('task-fard-prayers', 'safar'), false);
  assert.equal(isTaskExemptedInMode('task-fard-prayers', 'normal'), false);
});

test('computeProtectedStreak preserves streak across multiple Safar/Udhr protected days', () => {
  const ts = {
    '2026-11-22': 1,
    '2026-11-23': 1,
    '2026-11-24': 1,
  };
  const protectedDates: Record<string, 'safar' | 'udhr'> = {
    '2026-11-25': 'safar',
    '2026-11-26': 'safar',
    '2026-11-27': 'udhr',
  };

  const res = computeProtectedStreak('2026-11-27', ts, protectedDates);
  assert.equal(res.streakCount, 3);
  assert.deepEqual(res.protectedDatesUsed, ['2026-11-27', '2026-11-26', '2026-11-25']);
  assert.deepEqual(res.usedFreezeDates, []);
});
