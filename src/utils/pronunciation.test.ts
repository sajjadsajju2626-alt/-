import test from 'node:test';
import assert from 'node:assert/strict';
import {
  prepareArabicSpeechText,
  getPronunciationSpeechRate,
  selectBestArabicVoice,
  PronunciationManager,
} from './pronunciation.ts';

test('prepareArabicSpeechText strips parenthesized Arabic verse numbers and formats clean recitation text', () => {
  const inputWithArabicNums =
    'الم (١) ذَٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ هُدًى لِّلْمُتَّقِينَ (٢)';
  const cleaned = prepareArabicSpeechText(inputWithArabicNums);

  assert.equal(cleaned, 'الم ذَٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ هُدًى لِّلْمُتَّقِينَ');
  assert.ok(!cleaned.includes('١'));
  assert.ok(!cleaned.includes('٢'));
  assert.ok(cleaned.includes('لِّلْمُتَّقِينَ')); // verifies tashkeel is preserved
});

test('prepareArabicSpeechText strips English verse numbers in parentheses and newlines', () => {
  const inputWithNumbers = 'آمَنَ الرَّسُولُ (285)\nلَا يُكَلِّفُ اللَّهُ نَفْسًا (286)';
  const cleaned = prepareArabicSpeechText(inputWithNumbers);

  assert.equal(cleaned, 'آمَنَ الرَّسُولُ لَا يُكَلِّفُ اللَّهُ نَفْسًا');
  assert.ok(!cleaned.includes('285'));
  assert.ok(!cleaned.includes('286'));
});

test('prepareArabicSpeechText handles empty or null strings safely', () => {
  assert.equal(prepareArabicSpeechText(''), '');
  assert.equal(prepareArabicSpeechText('   \n  '), '');
});

test('getPronunciationSpeechRate returns expected speed factors', () => {
  assert.equal(getPronunciationSpeechRate('0.75x'), 0.75);
  assert.equal(getPronunciationSpeechRate('1.0x'), 0.95);
  assert.equal(getPronunciationSpeechRate('1.25x'), 1.25);
});

test('selectBestArabicVoice selects Saudi Arabic ar-SA first', () => {
  const mockVoices = [
    { lang: 'en-US', name: 'Samantha' },
    { lang: 'ar-EG', name: 'Salma' },
    { lang: 'ar-SA', name: 'Maged' },
    { lang: 'fr-FR', name: 'Thomas' },
  ];

  const best = selectBestArabicVoice(mockVoices);
  assert.ok(best);
  assert.equal(best.lang, 'ar-SA');
  assert.equal(best.name, 'Maged');
});

test('selectBestArabicVoice falls back to any Arabic voice when ar-SA is not present', () => {
  const mockVoices = [
    { lang: 'en-US', name: 'Samantha' },
    { lang: 'ar-EG', name: 'Salma' },
    { lang: 'es-ES', name: 'Monica' },
  ];

  const best = selectBestArabicVoice(mockVoices);
  assert.ok(best);
  assert.equal(best.lang, 'ar-EG');
});

test('selectBestArabicVoice returns null when no Arabic voices are available', () => {
  const mockVoices = [
    { lang: 'en-US', name: 'Samantha' },
    { lang: 'es-ES', name: 'Monica' },
  ];

  const best = selectBestArabicVoice(mockVoices);
  assert.equal(best, null);
  assert.equal(selectBestArabicVoice([]), null);
});

test('PronunciationManager singleton handles subscription and stop correctly', () => {
  let latestId: string | null = 'unset';
  const unsubscribe = PronunciationManager.subscribe((state) => {
    latestId = state.playingId;
  });

  assert.equal(PronunciationManager.getState().playingId, null);
  PronunciationManager.stop();
  assert.equal(latestId, null);

  unsubscribe();
});
