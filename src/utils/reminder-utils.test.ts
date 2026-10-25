import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseTimeString,
  getMsUntilNextTime,
  isReminderDue,
  formatTimeDisplay,
} from './reminder-utils.ts';

test('parseTimeString handles valid and invalid inputs gracefully', () => {
  assert.deepEqual(parseTimeString('06:30'), { hours: 6, minutes: 30 });
  assert.deepEqual(parseTimeString('17:45'), { hours: 17, minutes: 45 });
  assert.deepEqual(parseTimeString('00:00'), { hours: 0, minutes: 0 });
  assert.deepEqual(parseTimeString('23:59'), { hours: 23, minutes: 59 });

  // clamping invalid numbers
  assert.deepEqual(parseTimeString('25:70'), { hours: 23, minutes: 59 });
  assert.deepEqual(parseTimeString('invalid'), { hours: 0, minutes: 0 });
});

test('getMsUntilNextTime calculates time until today or tomorrow correctly', () => {
  // Scenario 1: Target is later today (now is 10:00, target is 10:30)
  const now1 = new Date(2026, 9, 24, 10, 0, 0, 0);
  const ms1 = getMsUntilNextTime('10:30', now1);
  assert.equal(ms1, 30 * 60 * 1000); // exactly 30 minutes in ms

  // Scenario 2: Target is earlier today (now is 21:00, target is 06:00 tomorrow)
  const now2 = new Date(2026, 9, 24, 21, 0, 0, 0);
  const ms2 = getMsUntilNextTime('06:00', now2);
  // From 21:00 to 24:00 is 3h, from 00:00 to 06:00 is 6h -> total 9 hours
  assert.equal(ms2, 9 * 60 * 60 * 1000);

  // Scenario 3: Target is exact same minute (now is 10:00:00, target is 10:00 -> rolls to tomorrow 24 hours)
  const now3 = new Date(2026, 9, 24, 10, 0, 0, 0);
  const ms3 = getMsUntilNextTime('10:00', now3);
  assert.equal(ms3, 24 * 60 * 60 * 1000);
});

test('isReminderDue detects exact match correctly', () => {
  assert.equal(isReminderDue('06:00', 6, 0), true);
  assert.equal(isReminderDue('17:30', 17, 30), true);
  assert.equal(isReminderDue('17:30', 17, 31), false);
  assert.equal(isReminderDue('06:00', 7, 0), false);
});

test('formatTimeDisplay formats 24h to 12h AM/PM properly', () => {
  assert.equal(formatTimeDisplay('06:00'), '6:00 AM');
  assert.equal(formatTimeDisplay('12:00'), '12:00 PM');
  assert.equal(formatTimeDisplay('17:30'), '5:30 PM');
  assert.equal(formatTimeDisplay('00:15'), '12:15 AM');
});
