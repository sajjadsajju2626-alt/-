import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SHARED_APP_URL,
  buildFadheelathCardData,
  wrapTextLines,
} from './fadheelath-card.ts';
import { MORNING_ADHKAR, EVENING_ADHKAR } from '../data/adhkarData.ts';

test('buildFadheelathCardData builds complete 9:16 Fadheelath card metadata and link-only caption', () => {
  const sampleItem = MORNING_ADHKAR[0];
  const data = buildFadheelathCardData(sampleItem);

  assert.equal(data.topTitle, 'മുദാവമ (Mudaawama) • Daily Adhkar');
  assert.equal(data.topArabicTitle, 'أذكار الصباح والمساء');
  assert.ok(data.categorySubtitle.includes('Morning Adhkar'));
  assert.equal(data.arabicText, sampleItem.arabic.trim());
  assert.ok(data.malayalamMeaning.length > 10, 'Malayalam meaning must be non-empty');
  assert.equal(data.virtueHeader, 'ഹദീസിലെ ശ്രേഷ്ഠത (Virtue / Fadheelath)');
  assert.ok(data.virtueText.length > 5, 'Virtue text must be non-empty');
  assert.ok(data.hadithRef.length > 3, 'Hadith reference text must be non-empty');
  assert.equal(
    data.ctaLabel,
    '📲 ഈ ആപ്പ് ഫോണിൽ ലഭിക്കാൻ താഴെ കാണുന്ന ലിങ്കിൽ ക്ലിക്ക് ചെയ്യുക'
  );
  assert.equal(data.ctaUrl, SHARED_APP_URL);
  assert.equal(
    data.ctaUrl,
    'https://ais-pre-vnltcvivdjsnkrcxvjxrzx-323150098264.asia-east1.run.app/'
  );
  assert.equal(
    data.shareCaption,
    'https://ais-pre-vnltcvivdjsnkrcxvjxrzx-323150098264.asia-east1.run.app/',
    'Share caption must contain ONLY the raw URL without any accompanying text'
  );
});

test('buildFadheelathCardData works for Evening Adhkar items and preserves authentic references', () => {
  const eveningItem = EVENING_ADHKAR[0];
  const data = buildFadheelathCardData(eveningItem);

  assert.ok(data.categorySubtitle.includes('Evening Adhkar'));
  assert.equal(/uthaymeen/i.test(data.hadithRef), false);
  assert.equal(
    data.shareCaption,
    'https://ais-pre-vnltcvivdjsnkrcxvjxrzx-323150098264.asia-east1.run.app/'
  );
});

test('wrapTextLines wraps text cleanly within maxWidth', () => {
  const measureWidth = (str: string) => str.length * 10;
  const text = 'അല്ലാഹു അല്ലാതെ ആരാധനക്കർഹനായി മറ്റൊരു ദൈവവുമില്ല അവൻ ഏകനാണ്';
  const lines = wrapTextLines(text, 220, measureWidth);

  assert.ok(lines.length >= 2, 'Should wrap into multiple lines');
  for (const line of lines) {
    assert.ok(measureWidth(line) <= 220 || !line.includes(' '), `Line "${line}" should respect maxWidth`);
  }
});
