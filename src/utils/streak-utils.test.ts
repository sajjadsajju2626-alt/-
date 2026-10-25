import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getDaysDifference,
  getCurrentStreakStatus,
  calculateStreakOnCompletion,
} from './streak-utils.ts';

test('getDaysDifference calculates day intervals accurately', () => {
  assert.equal(getDaysDifference('2026-10-24', '2026-10-24'), 0);
  assert.equal(getDaysDifference('2026-10-23', '2026-10-24'), 1);
  assert.equal(getDaysDifference('2026-10-20', '2026-10-24'), 4);
  // Month boundary
  assert.equal(getDaysDifference('2026-09-30', '2026-10-01'), 1);
});

test('getCurrentStreakStatus handles today, yesterday, and missed days', () => {
  // Scenario 1: No previous data
  const s0 = getCurrentStreakStatus(null, 0, '2026-10-24');
  assert.equal(s0.effectiveStreak, 0);
  assert.equal(s0.completedToday, false);
  assert.equal(s0.isAtRisk, false);

  // Scenario 2: Completed today
  const sToday = getCurrentStreakStatus('2026-10-24', 5, '2026-10-24');
  assert.equal(sToday.effectiveStreak, 5);
  assert.equal(sToday.completedToday, true);
  assert.equal(sToday.isAtRisk, false);

  // Scenario 3: Completed yesterday (streak preserved, waiting for today)
  const sYest = getCurrentStreakStatus('2026-10-23', 5, '2026-10-24');
  assert.equal(sYest.effectiveStreak, 5);
  assert.equal(sYest.completedToday, false);
  assert.equal(sYest.isAtRisk, true);

  // Scenario 4: Missed 2 days (streak broken)
  const sBroken = getCurrentStreakStatus('2026-10-22', 5, '2026-10-24');
  assert.equal(sBroken.effectiveStreak, 0);
  assert.equal(sBroken.completedToday, false);
  assert.equal(sBroken.isAtRisk, false);
});

test('calculateStreakOnCompletion increments on consecutive days and resets after gap', () => {
  // First ever day completed
  const firstDay = calculateStreakOnCompletion(null, 0, '2026-10-24', 0);
  assert.equal(firstDay.newStreak, 1);
  assert.equal(firstDay.newBestStreak, 1);
  assert.equal(firstDay.isNewStreakDay, true);

  // Consecutive day (yesterday was day 1, today completes -> day 2)
  const day2 = calculateStreakOnCompletion('2026-10-23', 1, '2026-10-24', 1);
  assert.equal(day2.newStreak, 2);
  assert.equal(day2.newBestStreak, 2);
  assert.equal(day2.isNewStreakDay, true);

  // Multiple completions on the same day (idempotent, does not double-count)
  const sameDay = calculateStreakOnCompletion('2026-10-24', 2, '2026-10-24', 2);
  assert.equal(sameDay.newStreak, 2);
  assert.equal(sameDay.newBestStreak, 2);
  assert.equal(sameDay.isNewStreakDay, false);

  // Completion after a 3-day gap -> restarts streak at 1, keeps old best
  const restart = calculateStreakOnCompletion('2026-10-20', 5, '2026-10-24', 5);
  assert.equal(restart.newStreak, 1);
  assert.equal(restart.newBestStreak, 5); // old best retained
  assert.equal(restart.isNewStreakDay, true);
});
