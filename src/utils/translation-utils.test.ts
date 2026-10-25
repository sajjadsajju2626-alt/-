import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getVisibleTranslations,
  getVisibleVirtues,
  formatLanguageLabel,
  matchesQuery,
  TranslationLanguage,
} from './translation-utils.ts';

test('getVisibleTranslations returns Malayalam only when lang is ml', () => {
  const item = {
    translation: 'In the name of Allah, the Most Gracious, the Most Merciful.',
    malayalamTranslation: 'പരമകാരുണികനും കരുണാനിധിയുമായ അല്ലാഹുവിന്റെ നാമത്തിൽ.',
  };

  const res = getVisibleTranslations(item, 'ml');
  assert.equal(res.hasEn, false);
  assert.equal(res.hasMl, true);
  assert.equal(res.en, undefined);
  assert.equal(res.ml, 'പരമകാരുണികനും കരുണാനിധിയുമായ അല്ലാഹുവിന്റെ നാമത്തിൽ.');
});

test('getVisibleTranslations falls back to English if Malayalam is missing when lang is ml', () => {
  const item = {
    translation: 'Glory be to Allah.',
  };

  const res = getVisibleTranslations(item, 'ml');
  assert.equal(res.ml, 'Glory be to Allah.');
});

test('getVisibleTranslations returns English only when lang is en', () => {
  const item = {
    translation: 'In the name of Allah, the Most Gracious, the Most Merciful.',
    malayalamTranslation: 'പരമകാരുണികനും കരുണാനിധിയുമായ അല്ലാഹുവിന്റെ നാമത്തിൽ.',
  };

  const res = getVisibleTranslations(item, 'en');
  assert.equal(res.hasEn, true);
  assert.equal(res.hasMl, false);
  assert.equal(res.en, 'In the name of Allah, the Most Gracious, the Most Merciful.');
  assert.equal(res.ml, undefined);
});

test('getVisibleTranslations returns both when lang is both', () => {
  const item = {
    translation: 'In the name of Allah, the Most Gracious, the Most Merciful.',
    malayalamTranslation: 'പരമകാരുണികനും കരുണാനിധിയുമായ അല്ലാഹുവിന്റെ നാമത്തിൽ.',
  };

  const res = getVisibleTranslations(item, 'both');
  assert.equal(res.hasEn, true);
  assert.equal(res.hasMl, true);
  assert.equal(res.en, 'In the name of Allah, the Most Gracious, the Most Merciful.');
  assert.equal(res.ml, 'പരമകാരുണികനും കരുണാനിധിയുമായ അല്ലാഹുവിന്റെ നാമത്തിൽ.');
});

test('formatLanguageLabel formats labels properly', () => {
  assert.equal(formatLanguageLabel('en'), 'English');
  assert.equal(formatLanguageLabel('ml'), 'മലയാളം');
  assert.equal(formatLanguageLabel('both'), 'Both (രണ്ടും)');
});

test('matchesQuery correctly finds Malayalam text', () => {
  const item = {
    arabic: 'بِسْمِ اللَّهِ',
    transliteration: 'Bismillah',
    translation: 'In the name of Allah',
    malayalamTranslation: 'പരമകാരുണികനും കരുണാനിധിയുമായ അല്ലാഹുവിന്റെ നാമത്തിൽ.',
    source: 'Quran',
  };

  assert.equal(matchesQuery(item, 'പരമകാരുണികൻ'), true);
  assert.equal(matchesQuery(item, 'അല്ലാഹു'), true);
  assert.equal(matchesQuery(item, 'Bismillah'), true);
  assert.equal(matchesQuery(item, 'name of Allah'), true);
  assert.equal(matchesQuery(item, 'nonexistent word'), false);
});

test('getVisibleVirtues returns Malayalam virtue when lang is ml', () => {
  const item = {
    virtue: 'Reciting it provides divine guidance.',
    malayalamVirtue: 'ഇത് പാരായണം ചെയ്യുന്നത് സന്മാർഗ്ഗദർശനം നൽകുന്നു.',
  };

  const res = getVisibleVirtues(item, 'ml');
  assert.equal(res.hasEn, false);
  assert.equal(res.hasMl, true);
  assert.equal(res.en, undefined);
  assert.equal(res.ml, 'ഇത് പാരായണം ചെയ്യുന്നത് സന്മാർഗ്ഗദർശനം നൽകുന്നു.');
});

test('getVisibleVirtues falls back to English virtue if Malayalam virtue missing when lang is ml', () => {
  const item = {
    virtue: 'Protection from harm.',
  };

  const res = getVisibleVirtues(item, 'ml');
  assert.equal(res.hasMl, true);
  assert.equal(res.ml, 'Protection from harm.');
});

test('getVisibleVirtues returns English virtue only when lang is en', () => {
  const item = {
    virtue: 'Shielded from jinn until evening.',
    malayalamVirtue: 'വൈകുന്നേരം വരെ ജിന്നുകളിൽ നിന്ന് കാവൽ ലഭിക്കുന്നു.',
  };

  const res = getVisibleVirtues(item, 'en');
  assert.equal(res.hasEn, true);
  assert.equal(res.hasMl, false);
  assert.equal(res.en, 'Shielded from jinn until evening.');
  assert.equal(res.ml, undefined);
});

test('getVisibleVirtues returns both when lang is both', () => {
  const item = {
    virtue: 'Shielded from jinn until evening.',
    malayalamVirtue: 'വൈകുന്നേരം വരെ ജിന്നുകളിൽ നിന്ന് കാവൽ ലഭിക്കുന്നു.',
  };

  const res = getVisibleVirtues(item, 'both');
  assert.equal(res.hasEn, true);
  assert.equal(res.hasMl, true);
  assert.equal(res.en, 'Shielded from jinn until evening.');
  assert.equal(res.ml, 'വൈകുന്നേരം വരെ ജിന്നുകളിൽ നിന്ന് കാവൽ ലഭിക്കുന്നു.');
});

test('matchesQuery searches inside Hadith virtue and Malayalam virtue', () => {
  const item = {
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي',
    transliteration: 'Allahumma Anta Rabbi',
    translation: 'O Allah You are my Lord',
    virtue: 'Chief of Prayers for Forgiveness and entering Paradise.',
    malayalamVirtue: 'സയ്യിദുൽ ഇസ്തിഗ്ഫാർ പാപമോചന പ്രാർത്ഥന സ്വർഗ്ഗാവകാശി',
  };

  assert.equal(matchesQuery(item, 'Chief of Prayers'), true);
  assert.equal(matchesQuery(item, 'Paradise'), true);
  assert.equal(matchesQuery(item, 'സ്വർഗ്ഗാവകാശി'), true);
  assert.equal(matchesQuery(item, 'ഇസ്തിഗ്ഫാർ'), true);
});
