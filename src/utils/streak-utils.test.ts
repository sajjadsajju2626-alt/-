import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  getDaysDifference,
  shouldReplenishFreezeToken,
  checkAndReplenishFreeze,
  getCurrentStreakStatus,
  useStreakFreeze,
  calculateStreakOnCompletion,
  getTimeBasedRecommendation,
} from './streak-utils.ts';
import type { StreakData } from './streak-utils.ts';

describe('Streak & Freeze Utilities', () => {
  it('correctly calculates difference in whole calendar days', () => {
    assert.equal(getDaysDifference('2026-10-25', '2026-10-25'), 0);
    assert.equal(getDaysDifference('2026-10-24', '2026-10-25'), 1);
    assert.equal(getDaysDifference('2026-10-20', '2026-10-25'), 5);
    assert.equal(getDaysDifference('2026-09-30', '2026-10-01'), 1);
  });

  it('determines weekly freeze replenishment eligibility (1 per 7 days)', () => {
    // No prior replenishment
    assert.equal(shouldReplenishFreezeToken(null, '2026-10-25'), true);
    // 3 days ago: not yet
    assert.equal(shouldReplenishFreezeToken('2026-10-22', '2026-10-25'), false);
    // 7 days ago: yes!
    assert.equal(shouldReplenishFreezeToken('2026-10-18', '2026-10-25'), true);
    // 10 days ago: yes!
    assert.equal(shouldReplenishFreezeToken('2026-10-15', '2026-10-25'), true);
  });

  it('replenishes freeze token to 1 when eligible without exceeding cap', () => {
    const data: StreakData = {
      currentStreak: 5,
      bestStreak: 7,
      lastCompletedDate: '2026-10-24',
      freezeTokens: 0,
      lastFreezeReplenishedDate: '2026-10-10',
      usedFreezeDates: [],
    };

    const replenished = checkAndReplenishFreeze(data, '2026-10-25');
    assert.equal(replenished.freezeTokens, 1);
    assert.equal(replenished.lastFreezeReplenishedDate, '2026-10-25');

    // If already has 1 token, does not increment past 1
    const alreadyFull = checkAndReplenishFreeze(replenished, '2026-10-25');
    assert.equal(alreadyFull.freezeTokens, 1);
  });

  it('maintains active streak status on same-day or consecutive day', () => {
    const activeData: StreakData = {
      currentStreak: 4,
      bestStreak: 10,
      lastCompletedDate: '2026-10-25',
      freezeTokens: 1,
      lastFreezeReplenishedDate: '2026-10-20',
      usedFreezeDates: [],
    };

    // Checked today (diff 0)
    const statusToday = getCurrentStreakStatus(activeData, '2026-10-25');
    assert.equal(statusToday.effectiveStreak, 4);
    assert.equal(statusToday.completedToday, true);
    assert.equal(statusToday.isAtRisk, false);

    // Checked next morning (diff 1)
    const statusTomorrow = getCurrentStreakStatus(activeData, '2026-10-26');
    assert.equal(statusTomorrow.effectiveStreak, 4);
    assert.equal(statusTomorrow.completedToday, false);
    assert.equal(statusTomorrow.isAtRisk, true);
  });

  it('protects streak with freeze token when user missed exactly 1 day', () => {
    // Last completed Oct 24, today is Oct 26 (missed Oct 25)
    const dataWithFreeze: StreakData = {
      currentStreak: 8,
      bestStreak: 12,
      lastCompletedDate: '2026-10-24',
      freezeTokens: 1,
      lastFreezeReplenishedDate: '2026-10-18',
      usedFreezeDates: [],
    };

    const status = getCurrentStreakStatus(dataWithFreeze, '2026-10-26');
    assert.equal(status.effectiveStreak, 8);
    assert.equal(status.isAtRisk, true);
    assert.equal(status.canUseFreeze, true);

    // When completing today, automatically utilizes freeze token to preserve and increment streak!
    const result = calculateStreakOnCompletion(dataWithFreeze, '2026-10-26');
    assert.equal(result.isNewStreakDay, true);
    assert.equal(result.freezeUsed, true);
    assert.equal(result.updatedStreakData.currentStreak, 9); // streak continued!
    assert.equal(result.updatedStreakData.freezeTokens, 0); // consumed 1 token
    assert.ok(result.updatedStreakData.usedFreezeDates.includes('2026-10-25'));
  });

  it('resets streak if gap is greater than 1 day and no freeze exists', () => {
    const dataNoFreeze: StreakData = {
      currentStreak: 5,
      bestStreak: 10,
      lastCompletedDate: '2026-10-22',
      freezeTokens: 0,
      lastFreezeReplenishedDate: '2026-10-20',
      usedFreezeDates: [],
    };

    const status = getCurrentStreakStatus(dataNoFreeze, '2026-10-25');
    assert.equal(status.effectiveStreak, 0);

    const completion = calculateStreakOnCompletion(dataNoFreeze, '2026-10-25');
    assert.equal(completion.updatedStreakData.currentStreak, 1); // starts fresh at 1
  });

  it('returns appropriate time-based recommendations based on hour', () => {
    const morning = getTimeBasedRecommendation(7);
    assert.equal(morning.targetTab, 'morning');
    assert.equal(morning.iconName, 'sunrise');

    const afternoon = getTimeBasedRecommendation(13);
    assert.equal(afternoon.targetTab, 'prayer');
    assert.equal(afternoon.iconName, 'sun');

    const evening = getTimeBasedRecommendation(17);
    assert.equal(evening.targetTab, 'evening');
    assert.equal(evening.iconName, 'sunset');

    const night = getTimeBasedRecommendation(22);
    assert.equal(night.targetTab, 'sleep');
    assert.equal(night.iconName, 'moon');
  });
});
