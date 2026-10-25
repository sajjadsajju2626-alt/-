/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  TabKey,
  AdhkarCategory,
  AppSettings,
  ProgressSummary,
  TranslationLanguage,
} from './types/adhkar.ts';
import {
  MORNING_ADHKAR,
  EVENING_ADHKAR,
  PRAYER_ADHKAR,
  SLEEP_ADHKAR,
  ALL_ADHKAR_ITEMS,
  CATEGORIES_CONFIG,
} from './data/adhkarData.ts';
import {
  calculateCategoryProgress,
  incrementDhikr,
  getRecommendedTabByHour,
  getTodayDateString,
  shouldResetDaily,
  filterDhikrItems,
} from './utils/adhkar-utils.ts';
import { playTapSound, playCompletionSound, triggerHaptic } from './utils/audio.ts';
import { Header } from './components/Header.tsx';
import { TabBar } from './components/TabBar.tsx';
import { DhikrCard } from './components/DhikrCard.tsx';
import { TasbihCounter } from './components/TasbihCounter.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';
import { CompletionBanner } from './components/CompletionBanner.tsx';
import { StreakModal } from './components/StreakModal.tsx';
import { ExportSingleFileModal } from './components/ExportSingleFileModal.tsx';
import { Search, RotateCcw, CheckCheck, Star, Sun, Moon, Languages } from 'lucide-react';
import {
  isReminderDue,
  sendAdhkarNotification,
  getNotificationPermissionStatus,
  formatTimeDisplay,
} from './utils/reminder-utils.ts';
import {
  StreakData,
  calculateStreakOnCompletion,
  getCurrentStreakStatus,
} from './utils/streak-utils.ts';
import {
  toggleFavoriteId,
  isItemFavorite,
  getFavoriteDhikrItems,
} from './utils/favorites-utils.ts';

const DEFAULT_SETTINGS: AppSettings = {
  arabicFontSize: 'large',
  showTransliteration: true,
  showTranslation: true,
  translationLanguage: 'both',
  showVirtues: true,
  soundEnabled: true,
  vibrateEnabled: true,
  theme: 'emerald',
  cardTapToCount: false,
  autoScrollNext: false,
  remindersEnabled: false,
  morningReminderTime: '06:00',
  eveningReminderTime: '17:30',
};

export default function App() {
  // Determine initial recommended tab by time of day
  const [currentTab, setCurrentTab] = useState<TabKey>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab') as TabKey | null;
      if (tabParam && ['morning', 'evening', 'prayer', 'sleep', 'tasbih'].includes(tabParam)) {
        return tabParam;
      }
    }
    const currentHour = new Date().getHours();
    return getRecommendedTabByHour(currentHour).tab;
  });

  // Settings
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('adhkar_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Daily Streak Data: { currentStreak, bestStreak, lastCompletedDate }
  const [streakData, setStreakData] = useState<StreakData>(() => {
    try {
      const saved = localStorage.getItem('adhkar_streak_data');
      if (saved) {
        return JSON.parse(saved);
      }
      return { currentStreak: 0, bestStreak: 0, lastCompletedDate: null };
    } catch {
      return { currentStreak: 0, bestStreak: 0, lastCompletedDate: null };
    }
  });

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'incomplete' | 'completed'>('all');

  // Adhkar Counts map: { [dhikrId: string]: number }
  const [counts, setCounts] = useState<Record<string, number>>(() => {
    try {
      const todayStr = getTodayDateString(new Date());
      const savedDate = localStorage.getItem('adhkar_last_date');
      const savedCounts = localStorage.getItem('adhkar_counts');

      if (shouldResetDaily(savedDate, todayStr)) {
        // New calendar day: reset daily adhkar counts
        localStorage.setItem('adhkar_last_date', todayStr);
        localStorage.setItem('adhkar_counts', '{}');
        return {};
      }

      localStorage.setItem('adhkar_last_date', todayStr);
      return savedCounts ? JSON.parse(savedCounts) : {};
    } catch {
      return {};
    }
  });

  // Persist counts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('adhkar_counts', JSON.stringify(counts));
    } catch {
      // storage quota or private browsing
    }
  }, [counts]);

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem('adhkar_settings', JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  // Daily Adhkar Reminders Scheduler
  useEffect(() => {
    if (!settings.remindersEnabled) return;

    const checkReminders = () => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const todayStr = getTodayDateString(now);

      // Check Morning reminder
      if (isReminderDue(settings.morningReminderTime, currentHours, currentMinutes)) {
        const lastMorningNotif = localStorage.getItem('adhkar_last_morning_notif_date');
        if (lastMorningNotif !== todayStr) {
          sendAdhkarNotification(
            '☀️ Morning Adhkar Time • أذكار الصباح',
            'Start your morning with blessings and divine protection. Tap to begin your morning remembrances.',
            () => setCurrentTab('morning')
          );
          localStorage.setItem('adhkar_last_morning_notif_date', todayStr);
        }
      }

      // Check Evening reminder
      if (isReminderDue(settings.eveningReminderTime, currentHours, currentMinutes)) {
        const lastEveningNotif = localStorage.getItem('adhkar_last_evening_notif_date');
        if (lastEveningNotif !== todayStr) {
          sendAdhkarNotification(
            '🌙 Evening Adhkar Time • أذكار المساء',
            'Evening has arrived. Bring peace to your heart with the evening remembrances.',
            () => setCurrentTab('evening')
          );
          localStorage.setItem('adhkar_last_evening_notif_date', todayStr);
        }
      }
    };

    // Check immediately and every 30 seconds
    checkReminders();
    const interval = setInterval(checkReminders, 30000);
    return () => clearInterval(interval);
  }, [settings.remindersEnabled, settings.morningReminderTime, settings.eveningReminderTime]);

  // Favorites state: IDs of starred adhkar items
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('adhkar_favorites');
      return saved ? JSON.parse(saved) : ['m-1', 'm-3', 'm-7'];
    } catch {
      return ['m-1', 'm-3', 'm-7'];
    }
  });

  // Persist favorites
  useEffect(() => {
    try {
      localStorage.setItem('adhkar_favorites', JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => toggleFavoriteId(prev, id));
    if (settings.vibrateEnabled) triggerHaptic('tap');
  };

  // Get active items list based on active tab
  const activeItems = useMemo(() => {
    switch (currentTab) {
      case 'morning':
        return MORNING_ADHKAR;
      case 'evening':
        return EVENING_ADHKAR;
      case 'prayer':
        return PRAYER_ADHKAR;
      case 'sleep':
        return SLEEP_ADHKAR;
      case 'favorites':
        return getFavoriteDhikrItems(ALL_ADHKAR_ITEMS, favorites);
      default:
        return [];
    }
  }, [currentTab, favorites]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return filterDhikrItems(activeItems, counts, searchQuery, filterMode);
  }, [activeItems, counts, searchQuery, filterMode]);

  // Calculate progress for each category
  const morningProgress = useMemo(
    () => calculateCategoryProgress(MORNING_ADHKAR, counts),
    [counts]
  );
  const eveningProgress = useMemo(
    () => calculateCategoryProgress(EVENING_ADHKAR, counts),
    [counts]
  );
  const prayerProgress = useMemo(
    () => calculateCategoryProgress(PRAYER_ADHKAR, counts),
    [counts]
  );
  const sleepProgress = useMemo(
    () => calculateCategoryProgress(SLEEP_ADHKAR, counts),
    [counts]
  );

  const categoryProgressMap: Record<AdhkarCategory, ProgressSummary> = {
    morning: morningProgress,
    evening: eveningProgress,
    prayer: prayerProgress,
    sleep: sleepProgress,
  };

  // Determine if at least one Adhkar category is completely done today
  const anyCategoryCompletedToday =
    (morningProgress.total > 0 && morningProgress.completed === morningProgress.total) ||
    (eveningProgress.total > 0 && eveningProgress.completed === eveningProgress.total) ||
    (prayerProgress.total > 0 && prayerProgress.completed === prayerProgress.total) ||
    (sleepProgress.total > 0 && sleepProgress.completed === sleepProgress.total);

  const todayDateStr = getTodayDateString(new Date());

  // Determine current active streak status (effective streak count, completed today, at risk)
  const streakStatus = useMemo(() => {
    return getCurrentStreakStatus(
      streakData.lastCompletedDate,
      streakData.currentStreak,
      todayDateStr
    );
  }, [streakData, todayDateStr]);

  // When any category is completed today, update and persist streak
  useEffect(() => {
    if (anyCategoryCompletedToday) {
      setStreakData((prev) => {
        const res = calculateStreakOnCompletion(
          prev.lastCompletedDate,
          prev.currentStreak,
          todayDateStr,
          prev.bestStreak
        );

        if (res.isNewStreakDay || prev.lastCompletedDate !== todayDateStr) {
          const updated: StreakData = {
            currentStreak: res.newStreak,
            bestStreak: res.newBestStreak,
            lastCompletedDate: todayDateStr,
          };
          try {
            localStorage.setItem('adhkar_streak_data', JSON.stringify(updated));
          } catch {
            // ignore
          }
          return updated;
        }
        return prev;
      });
    }
  }, [anyCategoryCompletedToday, todayDateStr]);

  const favoritesProgress = useMemo(() => {
    const favItems = getFavoriteDhikrItems(ALL_ADHKAR_ITEMS, favorites);
    return calculateCategoryProgress(favItems, counts);
  }, [favorites, counts]);

  const activeProgress =
    currentTab === 'favorites'
      ? favoritesProgress
      : currentTab !== 'tasbih'
      ? categoryProgressMap[currentTab as AdhkarCategory]
      : { completed: 0, total: 0, percent: 0, isAllDone: false };

  const activeCategoryConfig = CATEGORIES_CONFIG.find((c) => c.key === currentTab) || CATEGORIES_CONFIG[0];

  // Handler: Increment count for a dhikr
  const handleIncrement = (id: string) => {
    const item = activeItems.find((it) => it.id === id);
    if (!item) return;

    const currentCount = counts[id] || 0;
    const { newCount, justCompleted } = incrementDhikr(currentCount, item.target);

    if (newCount !== currentCount) {
      setCounts((prev) => ({ ...prev, [id]: newCount }));

      if (settings.soundEnabled) {
        if (justCompleted) {
          playCompletionSound();
        } else {
          playTapSound();
        }
      }

      if (settings.vibrateEnabled) {
        if (justCompleted) {
          triggerHaptic('complete');
        } else {
          triggerHaptic('tap');
        }
      }
    }
  };

  // Handler: Reset a single item
  const handleResetItem = (id: string) => {
    setCounts((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    if (settings.vibrateEnabled) triggerHaptic('reset');
  };

  // Handler: Reset current tab
  const handleResetCurrentTab = () => {
    if (currentTab === 'tasbih') return;
    const itemsToReset = activeItems;
    if (itemsToReset.length === 0) return;

    if (window.confirm(`Reset all counters for ${activeCategoryConfig.label} Adhkar?`)) {
      setCounts((prev) => {
        const next = { ...prev };
        itemsToReset.forEach((item) => {
          delete next[item.id];
        });
        return next;
      });
      if (settings.vibrateEnabled) triggerHaptic('reset');
    }
  };

  // Handler: Complete all for current tab (quick helper for testing / completion)
  const handleCompleteAllCurrentTab = () => {
    if (currentTab === 'tasbih') return;
    setCounts((prev) => {
      const next = { ...prev };
      activeItems.forEach((item) => {
        next[item.id] = item.target;
      });
      return next;
    });
    if (settings.soundEnabled) playCompletionSound();
    if (settings.vibrateEnabled) triggerHaptic('complete');
  };

  const isDark = settings.theme === 'dark' || settings.theme === 'midnight';

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        settings.theme === 'midnight'
          ? 'bg-black text-slate-100'
          : settings.theme === 'dark'
          ? 'bg-slate-950 text-slate-100'
          : 'bg-slate-100 text-slate-800'
      }`}
    >
      {/* Top Header */}
      <Header
        activeTab={currentTab}
        activeCategoryName={activeCategoryConfig.label}
        arabicCategoryName={activeCategoryConfig.arabicLabel}
        progress={activeProgress}
        timeHint={activeCategoryConfig.timeHint}
        soundEnabled={settings.soundEnabled}
        onToggleSound={() =>
          setSettings((s) => ({ ...s, soundEnabled: !s.soundEnabled }))
        }
        theme={settings.theme}
        onToggleTheme={() =>
          setSettings((s) => ({
            ...s,
            theme: s.theme === 'emerald' ? 'dark' : 'emerald',
          }))
        }
        remindersEnabled={settings.remindersEnabled}
        currentStreak={streakStatus.effectiveStreak}
        completedToday={streakStatus.completedToday}
        onOpenStreak={() => setIsStreakModalOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onResetActiveTab={handleResetCurrentTab}
        onOpenExportSingleFile={() => setIsExportModalOpen(true)}
      />

      {/* Navigation Tab Bar */}
      <TabBar
        activeTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          setSearchQuery('');
        }}
        categoryProgress={categoryProgressMap}
        favoritesCount={favorites.length}
      />

      {/* Main Content Area */}
      <main className="container flex-1 max-w-xl mx-auto px-4 py-4 w-full">
        {currentTab === 'tasbih' ? (
          <TasbihCounter
            soundEnabled={settings.soundEnabled}
            vibrateEnabled={settings.vibrateEnabled}
            theme={settings.theme}
          />
        ) : (
          <div>
            {/* Shaykh Ibn Uthaymeen Booklet Reference Banner */}
            {(currentTab === 'morning' || currentTab === 'evening') && (
              <div
                className={`mb-3 px-3 py-2 rounded-xl text-xs flex items-center justify-between border ${
                  isDark
                    ? 'bg-amber-950/30 border-amber-900/50 text-amber-200'
                    : 'bg-amber-50/90 border-amber-200 text-amber-950'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[10px] tracking-wider uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300">
                    Authentic Booklet
                  </span>
                  <span className="text-[11px] sm:text-xs font-medium">
                    All 23 Duas from Shaykh Ibn Uthaymeen (Arabic, Malayalam & English)
                  </span>
                </div>
                <span className="text-[11px] opacity-80 hidden sm:inline font-arabic">
                  الأذكار صباحاً ومساءً
                </span>
              </div>
            )}

            {/* Search and Quick Filters */}
            <div className="flex flex-col gap-2.5 mb-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                {/* Search input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search in Arabic, English, or മലയാളം..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm border focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                      isDark
                        ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500'
                        : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-xs'
                    }`}
                  />
                </div>

                {/* Status Filter Badges */}
                <div className="flex items-center gap-1 self-end sm:self-auto">
                  <button
                    onClick={() => setFilterMode('all')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      filterMode === 'all'
                        ? 'bg-teal-700 text-white font-semibold'
                        : isDark
                        ? 'bg-slate-800 text-slate-400 hover:text-white'
                        : 'bg-slate-200/80 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    All ({activeItems.length})
                  </button>
                  <button
                    onClick={() => setFilterMode('incomplete')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      filterMode === 'incomplete'
                        ? 'bg-teal-700 text-white font-semibold'
                        : isDark
                        ? 'bg-slate-800 text-slate-400 hover:text-white'
                        : 'bg-slate-200/80 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    Remaining ({activeProgress.total - activeProgress.completed})
                  </button>
                  <button
                    onClick={() => setFilterMode('completed')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      filterMode === 'completed'
                        ? 'bg-teal-700 text-white font-semibold'
                        : isDark
                        ? 'bg-slate-800 text-slate-400 hover:text-white'
                        : 'bg-slate-200/80 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    Done ({activeProgress.completed})
                  </button>
                </div>
              </div>

              {/* Translation Language Quick Switcher */}
              <div className="flex items-center justify-between px-1 text-xs">
                <span className="flex items-center gap-1.5 font-medium text-slate-500 dark:text-slate-400 text-[11px]">
                  <Languages className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Translation Language:</span>
                </span>
                <div className="inline-flex items-center rounded-lg p-0.5 border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900">
                  <button
                    onClick={() =>
                      setSettings((s) => ({ ...s, translationLanguage: 'both' }))
                    }
                    className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                      (settings.translationLanguage || 'both') === 'both'
                        ? 'bg-teal-700 text-white font-semibold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Both (<span className="font-malayalam">രണ്ടും</span>)
                  </button>
                  <button
                    onClick={() =>
                      setSettings((s) => ({ ...s, translationLanguage: 'ml' }))
                    }
                    className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer font-malayalam ${
                      settings.translationLanguage === 'ml'
                        ? 'bg-teal-700 text-white font-semibold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    മലയാളം
                  </button>
                  <button
                    onClick={() =>
                      setSettings((s) => ({ ...s, translationLanguage: 'en' }))
                    }
                    className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                      settings.translationLanguage === 'en'
                        ? 'bg-teal-700 text-white font-semibold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>
            </div>

            {/* Completion Banner if all completed in this category */}
            {activeProgress.isAllDone && activeProgress.total > 0 && (
              <CompletionBanner
                categoryLabel={activeCategoryConfig.label}
                onGoToNextTab={(next) => setCurrentTab(next)}
                nextTabLabel={
                  currentTab === 'morning'
                    ? 'Evening Adhkar'
                    : currentTab === 'evening'
                    ? 'After Prayer Adhkar'
                    : 'Digital Tasbih'
                }
                nextTabKey={
                  currentTab === 'morning'
                    ? 'evening'
                    : currentTab === 'evening'
                    ? 'prayer'
                    : 'tasbih'
                }
              />
            )}

            {/* Adhkar List Container (id="list" matching prototype) */}
            <div id="list">
              {currentTab === 'favorites' && favorites.length === 0 ? (
                <div
                  className={`text-center py-12 px-6 rounded-3xl border ${
                    isDark
                      ? 'bg-slate-900 border-slate-800 text-slate-300'
                      : 'bg-white border-amber-200/80 text-slate-700 shadow-sm'
                  }`}
                >
                  <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center mx-auto mb-3 text-amber-500">
                    <Star className="w-8 h-8 fill-amber-400" />
                  </div>
                  <h3 className="text-base font-bold mb-1">No Favorite Adhkar Yet</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4 leading-relaxed">
                    Tap the star icon on any dhikr card in Morning, Evening, Prayer, or Sleep tabs to pin your most beloved supplications here for fast daily access.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <button
                      onClick={() => setCurrentTab('morning')}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-teal-700 text-white hover:bg-teal-600 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Sun className="w-3.5 h-3.5 text-amber-300" />
                      <span>Explore Morning Adhkar</span>
                    </button>
                    <button
                      onClick={() => setCurrentTab('evening')}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-teal-800 text-white hover:bg-teal-700 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Moon className="w-3.5 h-3.5 text-teal-300" />
                      <span>Explore Evening Adhkar</span>
                    </button>
                  </div>
                </div>
              ) : filteredItems.length === 0 ? (
                <div
                  className={`text-center py-12 rounded-2xl border ${
                    isDark
                      ? 'bg-slate-900 border-slate-800 text-slate-400'
                      : 'bg-white border-slate-200 text-slate-500'
                  }`}
                >
                  <p className="text-sm font-medium">No adhkar found</p>
                  <p className="text-xs mt-1 text-slate-400">
                    Try adjusting your search query or filters
                  </p>
                </div>
              ) : (
                filteredItems.map((item) => (
                  <DhikrCard
                    key={item.id}
                    item={item}
                    count={counts[item.id] || 0}
                    onIncrement={handleIncrement}
                    onResetItem={handleResetItem}
                    isFavorite={isItemFavorite(favorites, item.id)}
                    onToggleFavorite={handleToggleFavorite}
                    showCategoryBadge={currentTab === 'favorites'}
                    settings={settings}
                    theme={settings.theme}
                  />
                ))
              )}
            </div>

            {/* Bottom Actions: Reset Counters & Mark All */}
            <div className="mt-4 pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-2">
              <button
                className="reset-btn w-full sm:flex-1 py-3 px-4 bg-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                onClick={handleResetCurrentTab}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Counters
              </button>

              <button
                className="w-full sm:flex-1 py-3 px-4 bg-teal-800/10 hover:bg-teal-800/20 text-teal-800 dark:text-teal-300 border border-teal-600/30 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                onClick={handleCompleteAllCurrentTab}
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Complete All ({activeCategoryConfig.label})
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        onOpenExportSingleFile={() => setIsExportModalOpen(true)}
      />

      {/* Daily Streak Modal */}
      <StreakModal
        isOpen={isStreakModalOpen}
        onClose={() => setIsStreakModalOpen(false)}
        currentStreak={streakStatus.effectiveStreak}
        bestStreak={streakData.bestStreak}
        completedToday={streakStatus.completedToday}
        categoryProgress={categoryProgressMap}
      />

      {/* Standalone Single File Exporter Modal */}
      <ExportSingleFileModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}
