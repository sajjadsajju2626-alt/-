export type AdhkarCategory = 'morning' | 'evening' | 'prayer' | 'sleep';

export type TabKey = AdhkarCategory | 'tasbih' | 'favorites';

export type TranslationLanguage = 'en' | 'ml' | 'both';

export interface DhikrItem {
  id: string;
  category: AdhkarCategory;
  arabic: string;
  transliteration: string;
  translation: string;
  malayalamTranslation?: string;
  target: number;
  source: string;
  virtue?: string;
  malayalamVirtue?: string;
  repeatNote?: string;
  uthaymeenNumber?: number;
}

export type ThemeMode = 'emerald' | 'dark' | 'midnight';

export type FontSize = 'medium' | 'large' | 'xlarge';

export interface AppSettings {
  arabicFontSize: FontSize;
  showTransliteration: boolean;
  showTranslation: boolean;
  translationLanguage: TranslationLanguage;
  showVirtues: boolean;
  soundEnabled: boolean;
  vibrateEnabled: boolean;
  theme: ThemeMode;
  cardTapToCount: boolean;
  autoScrollNext: boolean;
  remindersEnabled: boolean;
  morningReminderTime: string; // HH:mm format, e.g. "06:00"
  eveningReminderTime: string; // HH:mm format, e.g. "17:30"
}

export interface ProgressSummary {
  completed: number;
  total: number;
  percent: number;
  isAllDone: boolean;
}
