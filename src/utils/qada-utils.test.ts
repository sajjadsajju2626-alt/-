import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyQadaDelta,
  calculateQadaAndMudd,
  calculateRawDaysFromInput,
  createDefaultQadaState,
  formatMuddWeight,
  getEstimatedCompletionMalayalam,
  getTotalRemainingPrayers,
} from './qada-utils';

test('calculateRawDaysFromInput handles duration (years/months/days) and date ranges', () => {
  assert.equal(
    calculateRawDaysFromInput({ inputMode: 'duration', years: 1, months: 2, days: 5 }),
    365 + 60 + 5
  );
  assert.equal(
    calculateRawDaysFromInput({ inputMode: 'dates', startDate: '2026-01-01', endDate: '2026-01-10' }),
    10
  );
  // Reversed dates yield 0 safely
  assert.equal(
    calculateRawDaysFromInput({ inputMode: 'dates', startDate: '2026-01-10', endDate: '2026-01-01' }),
    0
  );
});

test('calculateQadaAndMudd computes female cycle deduction and Shafi Mudd rice weight accurately', () => {
  const withoutCycle = calculateQadaAndMudd({
    inputMode: 'duration',
    years: 1,
    months: 0,
    days: 0,
    cycleDeductionEnabled: false,
    missedFasts: 15,
    delayedFasts: 10,
    yearsDelayed: 2,
    muddGramsPerUnit: 650,
  });

  assert.equal(withoutCycle.rawDays, 365);
  assert.equal(withoutCycle.deductedPrayerDays, 0);
  assert.equal(withoutCycle.netPrayerDays, 365);
  assert.equal(withoutCycle.totalPrayers, 1825);
  assert.equal(withoutCycle.netFasts, 15);
  assert.equal(withoutCycle.totalMudds, 20);
  assert.equal(withoutCycle.riceGrams, 13000);
  assert.equal(withoutCycle.riceKg, 13);

  const withCycle = calculateQadaAndMudd({
    inputMode: 'duration',
    years: 1,
    months: 0,
    days: 0,
    cycleDeductionEnabled: true,
    cycleDaysPerMonth: 7,
    missedFasts: 7,
    delayedFasts: 5,
    yearsDelayed: 3,
    muddGramsPerUnit: 600,
  });

  // 365 / 30 * 7 = 85.166 -> rounded 85 days deducted -> 280 net prayer days
  assert.equal(withCycle.deductedPrayerDays, 85);
  assert.equal(withCycle.netPrayerDays, 280);
  assert.equal(withCycle.totalPrayers, 1400);
  assert.equal(withCycle.totalMudds, 15);
  assert.equal(withCycle.riceGrams, 9000);
  assert.equal(withCycle.riceKg, 9);
});

test('formatMuddWeight formats grams and kilograms cleanly', () => {
  assert.equal(formatMuddWeight(1, 650).display, '650 g');
  assert.equal(formatMuddWeight(2, 650).display, '1.3 kg (1,300 g)');
  assert.equal(formatMuddWeight(20, 650).display, '13.0 kg (13,000 g)');
  assert.equal(formatMuddWeight(10, 600).display, '6.0 kg (6,000 g)');
});

test('getEstimatedCompletionMalayalam generates natural Malayalam completion forecasts', () => {
  const daysCase = getEstimatedCompletionMalayalam(50, 5);
  assert.equal(daysCase.daysNeeded, 10);
  assert.equal(daysCase.label, 'ദിവസവും 5 ഖളാഅ് വീതം നമസ്കരിച്ചാൽ 10 ദിവസം കൊണ്ട് പൂർത്തിയാക്കാം');

  const monthsCase = getEstimatedCompletionMalayalam(450, 5);
  assert.equal(monthsCase.daysNeeded, 90);
  assert.equal(monthsCase.label, 'ദിവസവും 5 ഖളാഅ് വീതം നമസ്കരിച്ചാൽ 3 മാസം കൊണ്ട് പൂർത്തിയാക്കാം');

  const yearsCase = getEstimatedCompletionMalayalam(2000, 5);
  assert.equal(yearsCase.daysNeeded, 400);
  assert.ok(yearsCase.label.includes('1 വർഷം 1 മാസം'));

  const doneCase = getEstimatedCompletionMalayalam(0, 5);
  assert.equal(doneCase.daysNeeded, 0);
  assert.ok(doneCase.label.includes('പൂർത്തിയായി'));
});

test('applyQadaDelta handles -1 completion, +1 undo, zero floor, history tracking, and milestones', () => {
  const base = createDefaultQadaState();
  base.configured = true;
  base.remaining = { fajr: 5, dhuhr: 0, asr: 0, maghrib: 0, isha: 0, fasting: 2 };
  base.initial = { fajr: 5, dhuhr: 0, asr: 0, maghrib: 0, isha: 0, fasting: 2 };
  base.muddRemaining = 1;
  base.muddInitial = 1;

  // Decrementing a 0-count item does nothing
  const noOp = applyQadaDelta(base, 'dhuhr', -1, '2026-11-26');
  assert.equal(noOp.changed, false);

  // Decrement Fajr 1 -> 4
  const step1 = applyQadaDelta(base, 'fajr', -1, '2026-11-26');
  assert.equal(step1.changed, true);
  assert.equal(step1.nextState.remaining.fajr, 4);
  assert.equal(step1.nextState.history['2026-11-26'].prayers, 1);
  assert.equal(step1.milestoneReached, null);

  // Undo Fajr -> back to 5
  const undo = applyQadaDelta(step1.nextState, 'fajr', 1, '2026-11-26');
  assert.equal(undo.nextState.remaining.fajr, 5);
  assert.equal(undo.nextState.history['2026-11-26'].prayers, 0);

  // Complete all 5 Fajr -> triggers all_complete on the 5th tap
  let cur = base;
  let lastMilestone: string | null = null;
  for (let i = 0; i < 5; i++) {
    const res = applyQadaDelta(cur, 'fajr', -1, '2026-11-26');
    cur = res.nextState;
    lastMilestone = res.milestoneReached;
  }
  assert.equal(getTotalRemainingPrayers(cur), 0);
  assert.equal(lastMilestone, 'all_complete');

  // Complete last Mudd -> triggers item_complete
  const muddRes = applyQadaDelta(cur, 'mudd', -1, '2026-11-26');
  assert.equal(muddRes.nextState.muddRemaining, 0);
  assert.equal(muddRes.milestoneReached, 'item_complete');
});
