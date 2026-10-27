export type TranslationLanguage = 'en' | 'ml' | 'both';

export interface VisibleTranslations {
  en?: string;
  ml?: string;
  hasEn: boolean;
  hasMl: boolean;
}

/**
 * Resolves visible translations based on the selected language preference.
 */
export function getVisibleTranslations(
  item: { translation: string; malayalamTranslation?: string; malayalam?: string },
  lang: TranslationLanguage
): VisibleTranslations {
  const mlText = item.malayalamTranslation || item.malayalam;
  if (lang === 'ml') {
    return {
      en: undefined,
      ml: mlText || item.translation,
      hasEn: false,
      hasMl: true,
    };
  }

  if (lang === 'en') {
    return {
      en: item.translation,
      ml: undefined,
      hasEn: true,
      hasMl: false,
    };
  }

  // 'both'
  return {
    en: item.translation,
    ml: mlText,
    hasEn: Boolean(item.translation),
    hasMl: Boolean(mlText),
  };
}

export interface VisibleVirtues {
  en?: string;
  ml?: string;
  hasEn: boolean;
  hasMl: boolean;
}

/**
 * Resolves visible Hadith virtues based on the selected language preference.
 */
export function getVisibleVirtues(
  item: { virtue?: string; malayalamVirtue?: string },
  lang: TranslationLanguage
): VisibleVirtues {
  const hasEn = Boolean(item.virtue && item.virtue.trim().length > 0);
  const hasMl = Boolean(item.malayalamVirtue && item.malayalamVirtue.trim().length > 0);

  if (lang === 'ml') {
    return {
      en: undefined,
      ml: hasMl ? item.malayalamVirtue : item.virtue,
      hasEn: false,
      hasMl: hasMl || hasEn,
    };
  }

  if (lang === 'en') {
    return {
      en: item.virtue,
      ml: undefined,
      hasEn,
      hasMl: false,
    };
  }

  // 'both'
  return {
    en: item.virtue,
    ml: item.malayalamVirtue,
    hasEn,
    hasMl,
  };
}

/**
 * Formatted human-readable label for language options.
 */
export function formatLanguageLabel(lang: TranslationLanguage): string {
  switch (lang) {
    case 'en':
      return 'English';
    case 'ml':
      return 'മലയാളം';
    case 'both':
      return 'Both (രണ്ടും)';
  }
}

/**
 * Strips terminal Malayalam chillu letters or viramas for flexible root word stem matching.
 * e.g., 'പരമകാരുണികൻ' -> 'പരമകാരുണിക'
 */
function normalizeMalayalamStem(text: string): string {
  return text.replace(/[\u0D7A-\u0D7F\u0D4D]$/u, '');
}

/**
 * Multi-lingual query matcher supporting Malayalam, English, Arabic, and Transliteration.
 */
export function matchesQuery(
  item: {
    title?: string;
    arabic: string;
    transliteration: string;
    translation: string;
    malayalam?: string;
    malayalamTranslation?: string;
    virtue?: string;
    malayalamVirtue?: string;
    source?: string;
  },
  searchQuery: string
): boolean {
  const query = searchQuery.trim().toLowerCase();
  if (!query) return true;

  if (item.title) {
    const titleLower = item.title.toLowerCase();
    if (titleLower.includes(query)) return true;
    const stemQuery = normalizeMalayalamStem(query);
    if (stemQuery.length >= 3 && titleLower.includes(stemQuery)) return true;
  }

  if (item.arabic.includes(query)) return true;
  if (item.transliteration.toLowerCase().includes(query)) return true;
  if (item.translation.toLowerCase().includes(query)) return true;

  const mlTranslation = item.malayalamTranslation || item.malayalam;
  if (mlTranslation) {
    const mlLower = mlTranslation.toLowerCase();
    if (mlLower.includes(query)) return true;

    // Check with Malayalam chillu stem normalization
    const stemQuery = normalizeMalayalamStem(query);
    if (stemQuery.length >= 3 && mlLower.includes(stemQuery)) return true;
  }

  if (item.virtue && item.virtue.toLowerCase().includes(query)) return true;

  if (item.malayalamVirtue) {
    const mlVirtueLower = item.malayalamVirtue.toLowerCase();
    if (mlVirtueLower.includes(query)) return true;

    const stemQuery = normalizeMalayalamStem(query);
    if (stemQuery.length >= 3 && mlVirtueLower.includes(stemQuery)) return true;
  }

  if (item.source && item.source.toLowerCase().includes(query)) return true;

  return false;
}
