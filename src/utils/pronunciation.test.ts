import test from 'node:test';
import assert from 'node:assert/strict';
import {
  prepareArabicSpeechText,
  getPronunciationSpeechRate,
  selectBestArabicVoice,
  getVoiceStyleProfile,
  getCurrentAudio,
  VOICE_STYLE_PROFILES,
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

test('getPronunciationSpeechRate returns expected speed factors by voice style', () => {
  assert.equal(getPronunciationSpeechRate('0.75x', 'natural_dua'), 0.75);
  assert.equal(getPronunciationSpeechRate('1.0x', 'natural_dua'), 0.95);
  assert.equal(getPronunciationSpeechRate('1.25x', 'natural_dua'), 1.25);

  assert.equal(getPronunciationSpeechRate('0.75x', 'quranic_tajweed'), 0.75);
  assert.equal(getPronunciationSpeechRate('1.0x', 'quranic_tajweed'), 0.88);
  assert.equal(getPronunciationSpeechRate('1.25x', 'quranic_tajweed'), 1.25);
});

test('getVoiceStyleProfile strictly segregates Quranic Tajweed vs Natural Humble Dua voice', () => {
  const quranicProfile = getVoiceStyleProfile(true);
  assert.equal(quranicProfile.style, 'quranic_tajweed');
  assert.equal(quranicProfile.pitch, 0.98);
  assert.equal(quranicProfile.baseRate, 0.88);
  assert.ok(quranicProfile.description.includes('Tajweed/Murattal'));

  const duaProfile = getVoiceStyleProfile(false);
  assert.equal(duaProfile.style, 'natural_dua');
  assert.equal(duaProfile.pitch, 1.0); // Natural conversational pitch, not theatrical broadcast
  assert.equal(duaProfile.baseRate, 0.95);
  assert.equal(duaProfile.volume, 0.92);
  assert.ok(duaProfile.description.includes('Natural, humble, calm, and conversational'));
});

test('selectBestArabicVoice selects Saudi Arabic male voice first', () => {
  const mockVoices = [
    { lang: 'en-US', name: 'Samantha' },
    { lang: 'ar-EG', name: 'Salma' },
    { lang: 'ar-SA', name: 'Maged' },
    { lang: 'fr-FR', name: 'Thomas' },
  ];

  const best = selectBestArabicVoice(mockVoices, 'natural_dua');
  assert.ok(best);
  assert.equal(best.lang, 'ar-SA');
  assert.equal(best.name, 'Maged');
});

test('selectBestArabicVoice prioritizes Natural/Online Arabic male voice for natural_dua when available', () => {
  const mockVoices = [
    { lang: 'ar-SA', name: 'Classic Broadcast Male' },
    { lang: 'ar-SA', name: 'Microsoft Hamed Online (Natural) - Arabic' },
  ];

  const best = selectBestArabicVoice(mockVoices, 'natural_dua');
  assert.ok(best);
  assert.equal(best.name, 'Microsoft Hamed Online (Natural) - Arabic');
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

test('PronunciationManager singleton handles subscription, exclusive switching, and stop correctly', () => {
  const states: { playingId: string | null; status: string; voiceStyle: string }[] = [];
  const unsubscribe = PronunciationManager.subscribe((state) => {
    states.push({
      playingId: state.playingId,
      status: state.status,
      voiceStyle: state.voiceStyle,
    });
  });

  assert.equal(PronunciationManager.getState().playingId, null);
  assert.equal(getCurrentAudio(), null);

  // Stop resets state cleanly
  PronunciationManager.stop();
  assert.equal(PronunciationManager.getState().playingId, null);
  assert.equal(PronunciationManager.getState().status, 'idle');
  assert.equal(getCurrentAudio(), null);

  unsubscribe();
});
