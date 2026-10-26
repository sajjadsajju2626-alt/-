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
import { StreakCompletionModal } from './components/StreakCompletionModal.tsx';
import { TimeRecommendationBanner } from './components/TimeRecommendationBanner.tsx';
import { HandsFreeAutoplayBar } from './components/HandsFreeAutoplayBar.tsx';
import { ExportSingleFileModal } from './components/ExportSingleFileModal.tsx';
import { PWAInstallModal } from './components/PWAInstallModal.tsx';
import { PWAInstallBanner } from './components/PWAInstallBanner.tsx';
import { ShareModal } from './components/ShareModal.tsx';
import { usePWAInstall } from './utils/usePWAInstall.ts';
import { Search, RotateCcw, CheckCheck, Star, Sun, Moon, Languages, Headphones } from 'lucide-react';
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
  checkAndReplenishFreeze,
  useStreakFreeze,
} from './utils/streak-utils.ts';
import { PronunciationManager, AudioPlaybackState } from './utils/pronunciation.ts';
import {
  toggleFavoriteId,
  isItemFavorite,
  getFavoriteDhikrItems,
} from './utils/favorites-utils.ts';
import { DailyTasksTracker } from './components/DailyTasksTracker.tsx';
import { DailyTask, TaskCategory } from './types/tasks.ts';
import { DEFAULT_DAILY_TASKS } from './data/defaultTasks.ts';
import {
  calculateTasksProgress,
  shouldResetTasksDate,
  addCustomTask,
  completeAllTasks,
} from './utils/tasks-utils.ts';

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
  autoScrollNext: true,
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
      if (tabParam && ['morning', 'evening', 'prayer', 'sleep', 'tasbih', 'favorites', 'tasks'].includes(tabParam)) {
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
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Animated Streak Completion Celebration Modal State
  const [isStreakCelebrationOpen, setIsStreakCelebrationOpen] = useState(false);
  const [celebrationDetails, setCelebrationDetails] = useState({
    previousStreak: 0,
    newStreak: 0,
    categoryName: '',
    freezeTokens: 1,
    freezeUsed: false,
  });

  // Hands-Free Audio Recite-Along ("Autoplay All") State
  const [isAutoplayActive, setIsAutoplayActive] = useState(false);
  const [autoplayIndex, setAutoplayIndex] = useState(0);
  const [autoplayPauseSeconds, setAutoplayPauseSeconds] = useState(3);
  const [isAutoplayWaitingPause, setIsAutoplayWaitingPause] = useState(false);

  // In-app PWA install hook
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  // Daily Streak Data: { currentStreak, bestStreak, lastCompletedDate, freezeTokens, lastFreezeReplenishedDate, usedFreezeDates }
  const [streakData, setStreakData] = useState<StreakData>(() => {
    const todayStr = getTodayDateString(new Date());
    const initialData: StreakData = {
      currentStreak: 0,
      bestStreak: 0,
      lastCompletedDate: null,
      freezeTokens: 1,
      lastFreezeReplenishedDate: todayStr,
      usedFreezeDates: [],
    };

    try {
      const saved = localStorage.getItem('adhkar_streak_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        const merged: StreakData = {
          currentStreak: parsed.currentStreak || 0,
          bestStreak: parsed.bestStreak || 0,
          lastCompletedDate: parsed.lastCompletedDate || null,
          freezeTokens: typeof parsed.freezeTokens === 'number' ? parsed.freezeTokens : 1,
          lastFreezeReplenishedDate: parsed.lastFreezeReplenishedDate || todayStr,
          usedFreezeDates: Array.isArray(parsed.usedFreezeDates) ? parsed.usedFreezeDates : [],
        };
        return checkAndReplenishFreeze(merged, todayStr);
      }
      return initialData;
    } catch {
      return initialData;
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

  // Daily Tasks state & auto-reset at day boundary
  const [tasks, setTasks] = useState<DailyTask[]>(() => {
    try {
      const today = getTodayDateString(new Date());
      const savedDate = localStorage.getItem('adhkar_tasks_date');
      const savedTasks = localStorage.getItem('adhkar_daily_tasks');
      if (shouldResetTasksDate(savedDate, today)) {
        localStorage.setItem('adhkar_tasks_date', today);
        return DEFAULT_DAILY_TASKS;
      }
      return savedTasks ? JSON.parse(savedTasks) : DEFAULT_DAILY_TASKS;
    } catch {
      return DEFAULT_DAILY_TASKS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('adhkar_daily_tasks', JSON.stringify(tasks));
      localStorage.setItem('adhkar_tasks_date', getTodayDateString(new Date()));
    } catch {
      // ignore
    }
  }, [tasks]);

  const taskStats = useMemo(() => calculateTasksProgress(tasks), [tasks]);

  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const willComplete = !t.completed;
        const updatedSubtasks = t.subtasks?.map((st) => ({
          ...st,
          completed: willComplete,
        }));
        return {
          ...t,
          completed: willComplete,
          subtasks: updatedSubtasks,
          completedAt: willComplete ? new Date().toISOString() : undefined,
        };
      })
    );
    if (settings.soundEnabled) playTapSound();
    if (settings.vibrateEnabled) triggerHaptic('tap');
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId || !t.subtasks) return t;
        const newSubtasks = t.subtasks.map((st) =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        const allDone = newSubtasks.every((st) => st.completed);
        return {
          ...t,
          subtasks: newSubtasks,
          completed: allDone,
          completedAt: allDone ? new Date().toISOString() : undefined,
        };
      })
    );
    if (settings.soundEnabled) playTapSound();
    if (settings.vibrateEnabled) triggerHaptic('tap');
  };

  const handleAddTask = (data: {
    title: string;
    category: TaskCategory;
    description?: string;
    arabicTitle?: string;
    malayalamTitle?: string;
  }) => {
    setTasks((prev) => addCustomTask(prev, data));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleResetTasks = () => {
    setTasks((prev) =>
      prev.map((t) => ({
        ...t,
        completed: false,
        subtasks: t.subtasks?.map((st) => ({ ...st, completed: false })),
        completedAt: undefined,
      }))
    );
  };

  const handleCompleteAllTasks = () => {
    setTasks((prev) => completeAllTasks(prev));
    if (settings.soundEnabled) playCompletionSound();
    if (settings.vibrateEnabled) triggerHaptic('complete');
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

  // Determine current active streak status (effective streak count, completed today, at risk, freeze status)
  const streakStatus = useMemo(() => {
    return getCurrentStreakStatus(streakData, todayDateStr);
  }, [streakData, todayDateStr]);

  // Overall progress across all adhkar categories + daily devotional tasks (0-100%)
  const overallDailyProgress = useMemo(() => {
    const totalTarget =
      morningProgress.total +
      eveningProgress.total +
      prayerProgress.total +
      sleepProgress.total +
      taskStats.total;
    const totalDone =
      morningProgress.completed +
      eveningProgress.completed +
      prayerProgress.completed +
      sleepProgress.completed +
      taskStats.completed;
    return totalTarget > 0 ? Math.round((totalDone / totalTarget) * 100) : 0;
  }, [morningProgress, eveningProgress, prayerProgress, sleepProgress, taskStats]);

  const activeCategoryConfig = CATEGORIES_CONFIG.find((c) => c.key === currentTab) || CATEGORIES_CONFIG[0];

  // When any category is completed today, update and persist streak, and trigger animated celebration
  useEffect(() => {
    if (anyCategoryCompletedToday) {
      setStreakData((prev) => {
        const res = calculateStreakOnCompletion(prev, todayDateStr);

        if (res.isNewStreakDay || prev.lastCompletedDate !== todayDateStr) {
          try {
            localStorage.setItem('adhkar_streak_data', JSON.stringify(res.updatedStreakData));
          } catch {
            // ignore
          }

          // Trigger Animated Streak Completion celebration if not yet shown today
          const celebratedKey = `adhkar_celebrated_${todayDateStr}`;
          const alreadyCelebrated = localStorage.getItem(celebratedKey);
          if (!alreadyCelebrated) {
            localStorage.setItem(celebratedKey, 'true');
            setCelebrationDetails({
              previousStreak: prev.currentStreak,
              newStreak: res.updatedStreakData.currentStreak,
              categoryName: activeCategoryConfig.label,
              freezeTokens: res.updatedStreakData.freezeTokens,
              freezeUsed: res.freezeUsed,
            });
            setIsStreakCelebrationOpen(true);
          }

          return res.updatedStreakData;
        }
        return prev;
      });
    }
  }, [anyCategoryCompletedToday, todayDateStr, activeCategoryConfig.label]);

  // Use Streak Freeze token manually if user missed yesterday
  const handleUseStreakFreeze = () => {
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = getTodayDateString(yesterdayDate);

    const updated = useStreakFreeze(streakData, yesterdayStr);
    setStreakData(updated);
    try {
      localStorage.setItem('adhkar_streak_data', JSON.stringify(updated));
    } catch {
      // ignore
    }
    if (settings.vibrateEnabled) triggerHaptic('complete');
  };

  const favoritesProgress = useMemo(() => {
    const favItems = getFavoriteDhikrItems(ALL_ADHKAR_ITEMS, favorites);
    return calculateCategoryProgress(favItems, counts);
  }, [favorites, counts]);

  const activeProgress =
    currentTab === 'favorites'
      ? favoritesProgress
      : currentTab === 'tasks'
      ? {
          completed: taskStats.completed,
          total: taskStats.total,
          percent: taskStats.percent,
          isAllDone: taskStats.percent === 100 && taskStats.total > 0,
        }
      : currentTab !== 'tasbih'
      ? categoryProgressMap[currentTab as AdhkarCategory]
      : { completed: 0, total: 0, percent: 0, isAllDone: false };

  // Current playing item in Autoplay All mode
  const currentAutoplayItem =
    isAutoplayActive && activeItems[autoplayIndex] ? activeItems[autoplayIndex] : null;

  // Track global audio playback status
  const [playbackState, setPlaybackState] = useState<AudioPlaybackState>(PronunciationManager.getState());

  useEffect(() => {
    const unsubscribe = PronunciationManager.subscribe((state) => {
      setPlaybackState(state);
    });
    return () => unsubscribe();
  }, []);

  // Stop autoplay if changing tabs
  const handleSelectTab = (tab: TabKey) => {
    if (isAutoplayActive) {
      stopAutoplay();
    }
    setCurrentTab(tab);
    setSearchQuery('');
  };

  // Start Autoplay All recitation
  const startAutoplayAll = () => {
    if (activeItems.length === 0) return;
    setIsAutoplayActive(true);
    setAutoplayIndex(0);
    setIsAutoplayWaitingPause(false);

    const firstItem = activeItems[0];
    PronunciationManager.play({
      id: firstItem.id,
      arabicText: firstItem.arabic,
      isQuranic: !!firstItem.isQuranic,
      audioUrl: firstItem.audioUrl,
      audioUrls: firstItem.audioUrls,
      reciterTitle: firstItem.reciter,
    });

    const el = document.getElementById(`adhkar-card-${firstItem.id}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Stop Autoplay All recitation
  const stopAutoplay = () => {
    setIsAutoplayActive(false);
    setIsAutoplayWaitingPause(false);
    PronunciationManager.stop();
  };

  const handleAutoplayTogglePlayPause = () => {
    if (!isAutoplayActive) return;
    const state = PronunciationManager.getState();
    if (state.status === 'playing') {
      PronunciationManager.pause();
    } else if (state.status === 'paused') {
      PronunciationManager.resume();
    } else if (currentAutoplayItem) {
      PronunciationManager.play({
        id: currentAutoplayItem.id,
        arabicText: currentAutoplayItem.arabic,
        isQuranic: !!currentAutoplayItem.isQuranic,
        audioUrl: currentAutoplayItem.audioUrl,
        audioUrls: currentAutoplayItem.audioUrls,
        reciterTitle: currentAutoplayItem.reciter,
      });
    }
  };

  const handleAutoplayNext = () => {
    if (!isAutoplayActive) return;
    const nextIdx = autoplayIndex + 1;
    if (nextIdx < activeItems.length) {
      setAutoplayIndex(nextIdx);
      setIsAutoplayWaitingPause(false);
      const nextItem = activeItems[nextIdx];
      PronunciationManager.play({
        id: nextItem.id,
        arabicText: nextItem.arabic,
        isQuranic: !!nextItem.isQuranic,
        audioUrl: nextItem.audioUrl,
        audioUrls: nextItem.audioUrls,
        reciterTitle: nextItem.reciter,
      });
      const el = document.getElementById(`adhkar-card-${nextItem.id}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      stopAutoplay();
    }
  };

  const handleAutoplayPrev = () => {
    if (!isAutoplayActive) return;
    const prevIdx = autoplayIndex - 1;
    if (prevIdx >= 0) {
      setAutoplayIndex(prevIdx);
      setIsAutoplayWaitingPause(false);
      const prevItem = activeItems[prevIdx];
      PronunciationManager.play({
        id: prevItem.id,
        arabicText: prevItem.arabic,
        isQuranic: !!prevItem.isQuranic,
        audioUrl: prevItem.audioUrl,
        audioUrls: prevItem.audioUrls,
        reciterTitle: prevItem.reciter,
      });
      const el = document.getElementById(`adhkar-card-${prevItem.id}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Wire PronunciationManager onEnd to advance sequentially with user-configured pauses
  useEffect(() => {
    const unsubscribe = PronunciationManager.onEnd((endedId) => {
      if (!isAutoplayActive) return;

      // Auto-increment the count for this recited item
      setCounts((prev) => {
        const item = activeItems.find((it) => it.id === endedId);
        if (!item) return prev;
        const currentCount = prev[endedId] || 0;
        const newCount = Math.min(item.target, currentCount + 1);
        return { ...prev, [endedId]: newCount };
      });

      // Pause before next supplication
      setIsAutoplayWaitingPause(true);
      const nextIdx = autoplayIndex + 1;

      if (nextIdx < activeItems.length) {
        setTimeout(() => {
          if (!isAutoplayActive) return;
          setAutoplayIndex(nextIdx);
          setIsAutoplayWaitingPause(false);
          const nextItem = activeItems[nextIdx];
          PronunciationManager.play({
            id: nextItem.id,
            arabicText: nextItem.arabic,
            isQuranic: !!nextItem.isQuranic,
            audioUrl: nextItem.audioUrl,
            audioUrls: nextItem.audioUrls,
            reciterTitle: nextItem.reciter,
          });
          const el = document.getElementById(`adhkar-card-${nextItem.id}`);
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, autoplayPauseSeconds * 1000);
      } else {
        setTimeout(() => {
          stopAutoplay();
        }, 1000);
      }
    });

    return () => unsubscribe();
  }, [isAutoplayActive, autoplayIndex, activeItems, autoplayPauseSeconds]);

  // Handler: Increment count for a dhikr (with gentle haptic and one-tap auto-advance)
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

      // Haptic feedback on each count (gentle vibration so users can look away while reciting)
      if (settings.vibrateEnabled) {
        if (justCompleted) {
          triggerHaptic('complete');
        } else {
          triggerHaptic('tap');
        }
      }

      // One-Tap "Next": Once a card reaches its target (e.g., 3/3), gently auto-scroll down to the next item
      if (justCompleted && settings.autoScrollNext) {
        const currentIndex = filteredItems.findIndex((it) => it.id === id);
        if (currentIndex >= 0 && currentIndex < filteredItems.length - 1) {
          const nextIncomplete =
            filteredItems
              .slice(currentIndex + 1)
              .find((it) => (counts[it.id] || 0) < it.target) || filteredItems[currentIndex + 1];

          if (nextIncomplete) {
            setTimeout(() => {
              const el = document.getElementById(`adhkar-card-${nextIncomplete.id}`);
              el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
          }
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
          : 'bg-slate-100 text-slate-950'
      }`}
    >
      {/* PWA In-App Install Prompt Banner */}
      <PWAInstallBanner
        isInstalled={isInstalled}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
      />

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
        isInstalled={isInstalled}
        onOpenStreak={() => setIsStreakModalOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onResetActiveTab={handleResetCurrentTab}
        onOpenExportSingleFile={() => setIsExportModalOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        onOpenShare={() => setIsShareModalOpen(true)}
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
        tasksProgress={{ completed: taskStats.completed, total: taskStats.total }}
      />

      {/* Main Content Area */}
      <main className="container flex-1 max-w-xl mx-auto px-4 py-4 w-full">
        {currentTab === 'tasbih' ? (
          <TasbihCounter
            soundEnabled={settings.soundEnabled}
            vibrateEnabled={settings.vibrateEnabled}
            theme={settings.theme}
          />
        ) : currentTab === 'tasks' ? (
          <DailyTasksTracker
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onToggleSubtask={handleToggleSubtask}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onResetTasks={handleResetTasks}
            onCompleteAllTasks={handleCompleteAllTasks}
            soundEnabled={settings.soundEnabled}
            vibrateEnabled={settings.vibrateEnabled}
            theme={settings.theme}
          />
        ) : (
          <div>
            {/* Time-Based Recommended Adhkar Banner with 0-100% Visual Progress Bar */}
            <TimeRecommendationBanner
              currentTab={currentTab}
              onSelectTab={handleSelectTab}
              categoryProgress={categoryProgressMap}
              overallProgressPercent={overallDailyProgress}
              onStartAutoplayAll={
                activeItems.length > 0 ? (isAutoplayActive ? stopAutoplay : startAutoplayAll) : undefined
              }
              isAutoplayActive={isAutoplayActive}
              theme={settings.theme}
            />

            {/* Shaykh Ibn Uthaymeen Booklet Reference Banner */}
            {(currentTab === 'morning' || currentTab === 'evening') && (
              <div
                className={`mb-3 px-3 py-2 rounded-xl text-xs flex items-center justify-between border shadow-xs ${
                  isDark
                    ? 'bg-amber-950/30 border-amber-900/50 text-amber-200'
                    : 'bg-amber-100/90 border-amber-300 text-amber-950'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-black text-[10px] tracking-wider uppercase px-2 py-0.5 rounded bg-amber-800 text-white shadow-xs">
                    Authentic Booklet
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-amber-950 dark:text-amber-200">
                    All 23 Duas from Shaykh Ibn Uthaymeen (Arabic, Malayalam & English)
                  </span>
                </div>
                <span className="text-xs font-black hidden sm:inline font-arabic text-amber-950 dark:text-amber-200">
                  الأذكار صباحاً ومساءً
                </span>
              </div>
            )}

            {/* Search, Autoplay All & Quick Filters */}
            <div className="flex flex-col gap-2.5 mb-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                {/* Search input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search in Arabic, English, or മലയാളം..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm border focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors font-medium ${
                      isDark
                        ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500'
                        : 'bg-white border-slate-300 text-slate-950 placeholder-slate-600 shadow-xs'
                    }`}
                  />
                </div>

                {/* Autoplay All Recite-Along Mode Trigger */}
                {activeItems.length > 0 && (
                  <button
                    onClick={isAutoplayActive ? stopAutoplay : startAutoplayAll}
                    aria-label={isAutoplayActive ? 'Stop recite-along mode' : 'Start Autoplay All recite-along mode'}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs ${
                      isAutoplayActive
                        ? 'bg-amber-500 text-slate-950 font-black animate-pulse'
                        : 'bg-emerald-800/15 hover:bg-emerald-800/25 text-emerald-950 dark:text-emerald-200 border border-emerald-600/40 font-bold'
                    }`}
                  >
                    <Headphones className="w-3.5 h-3.5" />
                    <span>{isAutoplayActive ? 'Stop Recite-Along' : 'Autoplay All'}</span>
                  </button>
                )}

                {/* Status Filter Badges */}
                <div className="flex items-center gap-1 self-end sm:self-auto">
                  <button
                    onClick={() => setFilterMode('all')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                      filterMode === 'all'
                        ? 'bg-teal-800 border-teal-800 text-white shadow-xs'
                        : isDark
                        ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                        : 'bg-slate-200 border-slate-300 text-slate-950 hover:bg-slate-300'
                    }`}
                  >
                    All ({activeItems.length})
                  </button>
                  <button
                    onClick={() => setFilterMode('incomplete')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                      filterMode === 'incomplete'
                        ? 'bg-teal-800 border-teal-800 text-white shadow-xs'
                        : isDark
                        ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                        : 'bg-slate-200 border-slate-300 text-slate-950 hover:bg-slate-300'
                    }`}
                  >
                    Remaining ({activeProgress.total - activeProgress.completed})
                  </button>
                  <button
                    onClick={() => setFilterMode('completed')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                      filterMode === 'completed'
                        ? 'bg-teal-800 border-teal-800 text-white shadow-xs'
                        : isDark
                        ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                        : 'bg-slate-200 border-slate-300 text-slate-950 hover:bg-slate-300'
                    }`}
                  >
                    Done ({activeProgress.completed})
                  </button>
                </div>
              </div>

              {/* Translation Language Quick Switcher */}
              <div className="flex items-center justify-between px-1 text-xs">
                <span className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-300 text-[11px]">
                  <Languages className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
                  <span>Translation Language:</span>
                </span>
                <div className="inline-flex items-center rounded-lg p-0.5 border border-slate-300 dark:border-slate-800 bg-slate-200/90 dark:bg-slate-900">
                  <button
                    onClick={() =>
                      setSettings((s) => ({ ...s, translationLanguage: 'both' }))
                    }
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                      (settings.translationLanguage || 'both') === 'both'
                        ? 'bg-teal-800 text-white font-black shadow-xs'
                        : 'text-slate-900 dark:text-slate-400 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    Both (<span className="font-malayalam">രണ്ടും</span>)
                  </button>
                  <button
                    onClick={() =>
                      setSettings((s) => ({ ...s, translationLanguage: 'ml' }))
                    }
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-colors cursor-pointer font-malayalam ${
                      settings.translationLanguage === 'ml'
                        ? 'bg-teal-800 text-white font-black shadow-xs'
                        : 'text-slate-900 dark:text-slate-400 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    മലയാളം
                  </button>
                  <button
                    onClick={() =>
                      setSettings((s) => ({ ...s, translationLanguage: 'en' }))
                    }
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                      settings.translationLanguage === 'en'
                        ? 'bg-teal-800 text-white font-black shadow-xs'
                        : 'text-slate-900 dark:text-slate-400 hover:text-black dark:hover:text-white'
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
                onGoToNextTab={(next) => handleSelectTab(next)}
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
                onShare={() => setIsShareModalOpen(true)}
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
                      onClick={() => handleSelectTab('morning')}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-teal-700 text-white hover:bg-teal-600 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Sun className="w-3.5 h-3.5 text-amber-300" />
                      <span>Explore Morning Adhkar</span>
                    </button>
                    <button
                      onClick={() => handleSelectTab('evening')}
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
                    isAutoplayCurrentItem={isAutoplayActive && currentAutoplayItem?.id === item.id}
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

      {/* Hands-Free Audio Recite-Along Floating / Sticky Control Bar */}
      <HandsFreeAutoplayBar
        isActive={isAutoplayActive}
        currentIndex={autoplayIndex}
        totalItems={activeItems.length}
        currentItem={currentAutoplayItem}
        isPlaying={playbackState.status === 'playing'}
        isPaused={playbackState.status === 'paused'}
        isWaitingPause={isAutoplayWaitingPause}
        pauseSeconds={autoplayPauseSeconds}
        onSetPauseSeconds={setAutoplayPauseSeconds}
        onTogglePlayPause={handleAutoplayTogglePlayPause}
        onNext={handleAutoplayNext}
        onPrevious={handleAutoplayPrev}
        onStop={stopAutoplay}
        theme={settings.theme}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        onOpenExportSingleFile={() => setIsExportModalOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
      />

      {/* Daily Streak Modal */}
      <StreakModal
        isOpen={isStreakModalOpen}
        onClose={() => setIsStreakModalOpen(false)}
        currentStreak={streakStatus.effectiveStreak}
        bestStreak={streakData.bestStreak}
        completedToday={streakStatus.completedToday}
        categoryProgress={categoryProgressMap}
        freezeTokens={streakData.freezeTokens}
        canUseFreeze={streakStatus.canUseFreeze}
        onUseFreeze={handleUseStreakFreeze}
      />

      {/* Animated Daily Streak Completion Modal */}
      <StreakCompletionModal
        isOpen={isStreakCelebrationOpen}
        onClose={() => setIsStreakCelebrationOpen(false)}
        previousStreak={celebrationDetails.previousStreak}
        newStreak={celebrationDetails.newStreak}
        categoryName={celebrationDetails.categoryName}
        freezeTokens={celebrationDetails.freezeTokens}
        freezeUsed={celebrationDetails.freezeUsed}
        onShare={() => setIsShareModalOpen(true)}
      />

      {/* Standalone Single File Exporter Modal */}
      <ExportSingleFileModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      {/* PWA In-App Add to Home Screen Modal */}
      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        isInstallable={isInstallable}
        isIOS={isIOS}
        onNativeInstall={install}
      />

      {/* App Sharing Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        activeTab={currentTab}
        activeCategoryName={activeCategoryConfig.label}
      />
    </div>
  );
}
