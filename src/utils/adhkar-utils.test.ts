import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCategoryProgress,
  incrementDhikr,
  getRecommendedTabByHour,
  getTodayDateString,
  shouldResetDaily,
  filterDhikrItems,
} from './adhkar-utils.ts';
import { DhikrItem } from '../types/adhkar.ts';

const mockItems: DhikrItem[] = [
  {
    id: 'dhikr-1',
    category: 'morning',
    arabic: 'بِسْمِ اللَّهِ',
    transliteration: 'Bismillah',
    translation: 'In the name of Allah',
    target: 3,
    source: 'Tirmidhi',
  },
  {
    id: 'dhikr-2',
    category: 'morning',
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'SubhanAllah',
    translation: 'Glory is to Allah',
    target: 100,
    source: 'Muslim',
  },
  {
    id: 'dhikr-3',
    category: 'morning',
    arabic: 'أَسْتَغْفِرُ اللَّهَ',
    transliteration: 'Astaghfirullah',
    translation: 'I seek forgiveness',
    target: 1,
    source: 'Bukhari',
  },
];

test('calculateCategoryProgress calculates percentages and status correctly', () => {
  // Empty or 0 counts
  const resEmpty = calculateCategoryProgress(mockItems, {});
  assert.equal(resEmpty.completed, 0);
  assert.equal(resEmpty.total, 3);
  assert.equal(resEmpty.percent, 0);
  assert.equal(resEmpty.isAllDone, false);

  // Partial completed
  const resPartial = calculateCategoryProgress(mockItems, {
    'dhikr-1': 3, // completed (target 3)
    'dhikr-2': 50, // not completed (target 100)
    'dhikr-3': 0,
  });
  assert.equal(resPartial.completed, 1);
  assert.equal(resPartial.percent, 33);
  assert.equal(resPartial.isAllDone, false);

  // All completed
  const resAll = calculateCategoryProgress(mockItems, {
    'dhikr-1': 3,
    'dhikr-2': 100,
    'dhikr-3': 1,
  });
  assert.equal(resAll.completed, 3);
  assert.equal(resAll.percent, 100);
  assert.equal(resAll.isAllDone, true);
});

test('incrementDhikr handles incrementing and target clamping', () => {
  // 0 -> 1
  const step1 = incrementDhikr(0, 3);
  assert.equal(step1.newCount, 1);
  assert.equal(step1.justCompleted, false);

  // 2 -> 3 (just completed)
  const step3 = incrementDhikr(2, 3);
  assert.equal(step3.newCount, 3);
  assert.equal(step3.justCompleted, true);

  // 3 -> 3 (clamped)
  const stepClamped = incrementDhikr(3, 3);
  assert.equal(stepClamped.newCount, 3);
  assert.equal(stepClamped.justCompleted, false);
});

test('getRecommendedTabByHour routes based on time of day', () => {
  assert.equal(getRecommendedTabByHour(6).tab, 'morning');
  assert.equal(getRecommendedTabByHour(11).tab, 'morning');
  assert.equal(getRecommendedTabByHour(14).tab, 'evening');
  assert.equal(getRecommendedTabByHour(21).tab, 'evening');
});

test('getTodayDateString formats consistently YYYY-MM-DD', () => {
  const d = new Date(2026, 9, 24); // month is 0-indexed: 9 = October
  assert.equal(getTodayDateString(d), '2026-10-24');
});

test('shouldResetDaily detects new day correctly', () => {
  assert.equal(shouldResetDaily('2026-10-23', '2026-10-24'), true);
  assert.equal(shouldResetDaily('2026-10-24', '2026-10-24'), false);
  assert.equal(shouldResetDaily(null, '2026-10-24'), false);
});

test('filterDhikrItems filters by search text and status', () => {
  const counts = { 'dhikr-1': 3, 'dhikr-2': 10, 'dhikr-3': 0 };

  // Search by transliteration
  const filtered1 = filterDhikrItems(mockItems, counts, 'Subhan');
  assert.equal(filtered1.length, 1);
  assert.equal(filtered1[0].id, 'dhikr-2');

  // Filter completed only
  const completedOnly = filterDhikrItems(mockItems, counts, '', 'completed');
  assert.equal(completedOnly.length, 1);
  assert.equal(completedOnly[0].id, 'dhikr-1');

  // Filter incomplete only
  const incompleteOnly = filterDhikrItems(mockItems, counts, '', 'incomplete');
  assert.equal(incompleteOnly.length, 2);
});

test('Shaykh Ibn Uthaymeen 23 Adhkar items are complete with English, Malayalam, and references', async () => {
  const { MORNING_ADHKAR, EVENING_ADHKAR } = await import('../data/adhkarData.ts');

  // Verify morning has all 23 numbered items
  for (let num = 1; num <= 23; num++) {
    const morningItem = MORNING_ADHKAR.find((it) => it.uthaymeenNumber === num);
    assert.ok(morningItem, `Morning item #${num} must exist`);
    assert.ok(morningItem.arabic && morningItem.arabic.length > 0, `Morning item #${num} missing Arabic`);
    assert.ok(morningItem.translation && morningItem.translation.length > 0, `Morning item #${num} missing English`);
    assert.ok(morningItem.malayalamTranslation && morningItem.malayalamTranslation.length > 0, `Morning item #${num} missing Malayalam`);
    assert.ok(morningItem.source && morningItem.source.length > 0, `Morning item #${num} missing source reference`);
    assert.ok(morningItem.malayalamVirtue && morningItem.malayalamVirtue.length > 0, `Morning item #${num} missing Malayalam virtue`);

    const eveningItem = EVENING_ADHKAR.find((it) => it.uthaymeenNumber === num);
    assert.ok(eveningItem, `Evening item #${num} must exist`);
    assert.ok(eveningItem.arabic && eveningItem.arabic.length > 0, `Evening item #${num} missing Arabic`);
    assert.ok(eveningItem.translation && eveningItem.translation.length > 0, `Evening item #${num} missing English`);
    assert.ok(eveningItem.malayalamTranslation && eveningItem.malayalamTranslation.length > 0, `Evening item #${num} missing Malayalam`);
    assert.ok(eveningItem.source && eveningItem.source.length > 0, `Evening item #${num} missing source reference`);
    assert.ok(eveningItem.malayalamVirtue && eveningItem.malayalamVirtue.length > 0, `Evening item #${num} missing Malayalam virtue`);
  }
});

