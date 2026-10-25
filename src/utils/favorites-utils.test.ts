import test from 'node:test';
import assert from 'node:assert/strict';
import {
  toggleFavoriteId,
  isItemFavorite,
  getFavoriteDhikrItems,
} from './favorites-utils.ts';
import { DhikrItem } from '../types/adhkar.ts';

const mockPool: DhikrItem[] = [
  {
    id: 'm-1',
    category: 'morning',
    arabic: 'بِسْمِ اللَّهِ',
    transliteration: 'Bismillah',
    translation: 'In the name of Allah',
    target: 3,
    source: 'Quran',
  },
  {
    id: 'm-2',
    category: 'morning',
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'Subhanallah',
    translation: 'Glory be to Allah',
    target: 100,
    source: 'Muslim',
  },
  {
    id: 'e-1',
    category: 'evening',
    arabic: 'أَمْسَيْنَا',
    transliteration: 'Amsayna',
    translation: 'We reached evening',
    target: 1,
    source: 'Muslim',
  },
];

test('toggleFavoriteId adds and removes IDs cleanly', () => {
  // Add to empty list
  const step1 = toggleFavoriteId([], 'm-1');
  assert.deepEqual(step1, ['m-1']);

  // Add another
  const step2 = toggleFavoriteId(step1, 'e-1');
  assert.deepEqual(step2, ['m-1', 'e-1']);

  // Remove first
  const step3 = toggleFavoriteId(step2, 'm-1');
  assert.deepEqual(step3, ['e-1']);
});

test('isItemFavorite detects membership correctly', () => {
  const favs = ['m-1', 'p-3'];
  assert.equal(isItemFavorite(favs, 'm-1'), true);
  assert.equal(isItemFavorite(favs, 'p-3'), true);
  assert.equal(isItemFavorite(favs, 'm-2'), false);
  assert.equal(isItemFavorite(favs, 'unknown'), false);
});

test('getFavoriteDhikrItems returns matching items from pool', () => {
  const favs = ['m-1', 'e-1'];
  const matched = getFavoriteDhikrItems(mockPool, favs);
  assert.equal(matched.length, 2);
  assert.equal(matched[0].id, 'm-1');
  assert.equal(matched[1].id, 'e-1');

  // Empty favorites
  const emptyMatched = getFavoriteDhikrItems(mockPool, []);
  assert.equal(emptyMatched.length, 0);
});
