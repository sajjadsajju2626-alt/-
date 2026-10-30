/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
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
import { playTapSound, playCompletionSound, playReminderChime, triggerHaptic } from './utils/audio.ts';
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
import { MobileReminderBanner } from './components/MobileReminderBanner.tsx';
import { usePWAInstall } from './utils/usePWAInstall.ts';
import { Search, RotateCcw, CheckCheck, Star, Sun, Moon, Languages, Headphones } from 'lucide-react';
import {
  evaluateMissedAdhkarCatchUp,
  syncScheduleWithServiceWorker,
  dispatchMobileSafeNotification,
  registerAdhkarServiceWorker,
  requestNotificationPermission,
  subscribeToInAppNotifications,
  emitInAppNotification,
  InAppNotificationEvent,
  getMsUntilNextTime,
  isExactSecondReminderDue,
  buildMinuteRunFlagKey,
  LOCAL_ADHKAR_REMINDER_MESSAGES,
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
  upsertTaskHistoryForDate,
} from './utils/tasks-utils.ts';
import {
  SectionCompletionFireOverlay,
  SectionCompletionEvent,
} from './components/SectionCompletionFireOverlay.tsx';
import { AllCompletedFireworksModal } from './components/AllCompletedFireworksModal.tsx';
import { ProgressAnalyticsSection } from './components/ProgressAnalyticsSection.tsx';
import {
  ProgressHistoryMap,
  buildDailyProgressRecord,
  upsertDailyProgressHistory,
  isAllFourAdhkarCompleted,
} from './utils/progress-history-utils.ts';

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
  morningReminderTime: '05:30',
  eveningReminderTime: '17:30',
  sleepReminderTime: '22:00',
  goalReminderEnabled: false,
  dailyGoalReminderTime: '20:00',
};

export default function App() {
  // Determine initial recommended tab by time of day
  const [currentTab, setCurrentTab] = useState<TabKey>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab') as TabKey | null;
      if (tabParam && ['morning', 'evening', 'prayer', 'sleep', 'tasbih', 'favorites', 'tasks', 'progress'].includes(tabParam)) {
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

  // Section Completion Fire Overlay & All Completed Massive Fireworks Modal State
  const [sectionFireEvent, setSectionFireEvent] = useState<SectionCompletionEvent | null>(null);
  const [isAllCompletedFireworksOpen, setIsAllCompletedFireworksOpen] = useState(false);

  // Weekly & Monthly Progress History State (indexed by YYYY-MM-DD in localStorage)
  const [progressHistory, setProgressHistory] = useState<ProgressHistoryMap>(() => {
    try {
      const saved = localStorage.getItem('adhkar_progress_history');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
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

  // Persist settings and sync morning_time, evening_time, sleep_time for iCalendar (.ics) alarm export
  useEffect(() => {
    try {
      localStorage.setItem('adhkar_settings', JSON.stringify(settings));
      localStorage.setItem('morning_time', settings.morningReminderTime || '05:30');
      localStorage.setItem('evening_time', settings.eveningReminderTime || '17:30');
      localStorage.setItem('sleep_time', settings.sleepReminderTime || '22:00');
    } catch {
      // ignore
    }
  }, [settings]);



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
        // Archive previous day's task completions into adhkar_tasks_history before resetting
        if (savedDate && savedTasks) {
          try {
            const parsedPrevTasks = JSON.parse(savedTasks) as DailyTask[];
            const existingHistoryRaw = localStorage.getItem('adhkar_tasks_history');
            const existingHistory = existingHistoryRaw ? JSON.parse(existingHistoryRaw) : {};
            const archived = upsertTaskHistoryForDate(existingHistory, savedDate, parsedPrevTasks);
            localStorage.setItem('adhkar_tasks_history', JSON.stringify(archived));
          } catch {
            // ignore archive error
          }
        }
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

  // Active unblockable mobile reminder banner state
  const [activeMobileNotification, setActiveMobileNotification] =
    useState<InAppNotificationEvent | null>(null);

  // Register Service Worker (/sw.js) for background Morning (Fajr) & Evening (Asr) notifications
  useEffect(() => {
    registerAdhkarServiceWorker().catch(() => {});

    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      const handleSwMessage = (event: MessageEvent) => {
        if (!event.data || typeof event.data !== 'object') return;

        if (event.data.type === 'ADHKAR_NOTIFICATION_CLICK' && event.data.tab) {
          setCurrentTab(event.data.tab as TabKey);
        }

        if (event.data.type === 'SW_REMINDER_FIRED') {
          const { period, dateStr, title, body, arabicSubtitle, malayalamSubtitle, targetTab, isCatchUp } =
            event.data;
          if (period === 'morning' && dateStr) {
            localStorage.setItem('adhkar_last_morning_notif_date', dateStr);
          } else if (period === 'evening' && dateStr) {
            localStorage.setItem('adhkar_last_evening_notif_date', dateStr);
          }
          emitInAppNotification({
            id: `sw-${period || 'morning'}-${Date.now()}`,
            title: title || 'Daily Adhkar',
            body: body || 'രാവിലെത്തെ ദിക്റുകൾ ചൊല്ലാൻ സമയമായി 🌅',
            debugToastText: 'നോട്ടിഫിക്കേഷൻ അയച്ചു! ✓',
            debugReason: 'Delivered via Service Worker (sw.js)',
            arabicSubtitle,
            malayalamSubtitle,
            targetTab: (targetTab || 'morning') as TabKey,
            actionLabel:
              targetTab === 'evening'
                ? 'Recite Evening (Asr) Adhkar'
                : 'Recite Morning (Fajr) Adhkar',
            channel: 'service-worker',
            isCatchUp: Boolean(isCatchUp),
            period: period || 'morning',
            timestamp: Date.now(),
            onClick: () => setCurrentTab((targetTab || 'morning') as TabKey),
            onOpenSettings: () => setIsSettingsOpen(true),
          });
        }
      };
      navigator.serviceWorker.addEventListener('message', handleSwMessage);
      return () => navigator.serviceWorker.removeEventListener('message', handleSwMessage);
    }
    return undefined;
  }, []);

  const lastPlayedNotifIdRef = useRef<string>('');

  // Subscribe to unblockable in-app notification events (triggered by Bell icon, SW, catch-up checks, & test button)
  useEffect(() => {
    const unsubscribe = subscribeToInAppNotifications((notifEvent) => {
      setActiveMobileNotification(notifEvent);
      if (lastPlayedNotifIdRef.current !== notifEvent.id) {
        lastPlayedNotifIdRef.current = notifEvent.id;
        if (settings.soundEnabled) {
          playReminderChime();
        }
        if (settings.vibrateEnabled) {
          triggerHaptic('reminder');
        }
      }
    });
    return () => unsubscribe();
  }, [settings.soundEnabled, settings.vibrateEnabled]);

  // Handler when the user taps the Bell icon in the Header:
  // Triggers Dual-Trigger Notification immediately with instant 'നോട്ടിഫിക്കേഷൻ അയച്ചു!' toast
  const handleTriggerBellNotification = () => {
    if (!settings.remindersEnabled) {
      setSettings((s) => ({ ...s, remindersEnabled: true }));
    }
    // Fire permission request in parallel without blocking the instant toast
    requestNotificationPermission(1500).catch(() => {});

    const isEveningHour = new Date().getHours() >= 15;
    void dispatchMobileSafeNotification(
      'Daily Adhkar',
      isEveningHour
        ? 'വൈകുന്നേരത്തെ ദിക്റുകൾ ചൊല്ലാൻ സമയമായി 🌙'
        : 'രാവിലെത്തെ ദിക്റുകൾ ചൊല്ലാൻ സമയമായി 🌅',
      () => setCurrentTab(isEveningHour ? 'evening' : 'morning'),
      {
        arabicSubtitle: isEveningHour
          ? 'أَذْكَارُ الْمَسَاءِ (العصر)'
          : 'أَذْكَارُ الصَّبَاحِ (الفجر)',
        malayalamSubtitle: isEveningHour
          ? 'സായാഹ്ന ദിക്റുകൾ • Evening Adhkar'
          : 'പ്രഭാത ദിക്റുകൾ • Morning Adhkar',
        targetTab: isEveningHour ? 'evening' : 'morning',
        actionLabel: isEveningHour ? 'Open Evening Adhkar' : 'Open Morning Adhkar',
        tag: 'bell-tap-notification',
        icon: 'icon.png',
        onOpenSettings: () => setIsSettingsOpen(true),
      }
    );
  };

  // Track minute run flags (e.g. "hasRun_10_30") and previous reminder times for instant rescheduling
  const hasRunMinuteFlagsRef = useRef<Set<string>>(new Set());
  const prevReminderTimesRef = useRef<{
    morning: string;
    evening: string;
    goal: string;
  }>({
    morning: settings.morningReminderTime,
    evening: settings.eveningReminderTime,
    goal: settings.dailyGoalReminderTime || '20:00',
  });

  // Precision Notification Scheduling Engine (Exact :00s setTimeout + 1,000ms setInterval Fallback + Reopen Catch-Up)
  useEffect(() => {
    const todayStr = getTodayDateString(new Date());
    const goalTimeStr = settings.dailyGoalReminderTime || '20:00';

    // Detect if the user changed any reminder time (via input or quick preset pill)
    const prevTimes = prevReminderTimesRef.current;
    if (prevTimes.morning !== settings.morningReminderTime) {
      localStorage.removeItem('adhkar_last_morning_notif_date');
      hasRunMinuteFlagsRef.current.delete(buildMinuteRunFlagKey(settings.morningReminderTime));
      hasRunMinuteFlagsRef.current.delete(
        buildMinuteRunFlagKey(settings.morningReminderTime, 'morning', todayStr)
      );
      prevTimes.morning = settings.morningReminderTime;
    }
    if (prevTimes.evening !== settings.eveningReminderTime) {
      localStorage.removeItem('adhkar_last_evening_notif_date');
      hasRunMinuteFlagsRef.current.delete(buildMinuteRunFlagKey(settings.eveningReminderTime));
      hasRunMinuteFlagsRef.current.delete(
        buildMinuteRunFlagKey(settings.eveningReminderTime, 'evening', todayStr)
      );
      prevTimes.evening = settings.eveningReminderTime;
    }
    if (prevTimes.goal !== goalTimeStr) {
      localStorage.removeItem('adhkar_last_goal_notif_date');
      hasRunMinuteFlagsRef.current.delete(buildMinuteRunFlagKey(goalTimeStr));
      hasRunMinuteFlagsRef.current.delete(
        buildMinuteRunFlagKey(goalTimeStr, 'goal', todayStr)
      );
      prevTimes.goal = goalTimeStr;
    }

    const lastMorningNotif = localStorage.getItem('adhkar_last_morning_notif_date') || '';
    const lastEveningNotif = localStorage.getItem('adhkar_last_evening_notif_date') || '';
    const lastGoalNotif = localStorage.getItem('adhkar_last_goal_notif_date') || '';

    // 1. Sync schedule state with lightweight Service Worker (/sw.js)
    void syncScheduleWithServiceWorker({
      remindersEnabled: settings.remindersEnabled,
      morningReminderTime: settings.morningReminderTime,
      eveningReminderTime: settings.eveningReminderTime,
      goalReminderEnabled: settings.goalReminderEnabled,
      dailyGoalReminderTime: goalTimeStr,
      morningCompleted: morningProgress.percent >= 100,
      eveningCompleted: eveningProgress.percent >= 100,
      goalCompleted: overallDailyProgress >= 100,
      overallDailyProgress,
      lastFiredMorningDate: lastMorningNotif === todayStr ? todayStr : '',
      lastFiredEveningDate: lastEveningNotif === todayStr ? todayStr : '',
      lastFiredGoalDate: lastGoalNotif === todayStr ? todayStr : '',
    });

    if (!settings.remindersEnabled && !settings.goalReminderEnabled) return;

    // Helper that fires a scheduled reminder once per target minute (gated by hasRun_HH_mm)
    const fireExactScheduledReminder = (
      period: 'morning' | 'evening' | 'goal',
      targetTimeStr: string
    ) => {
      const now = new Date();
      const currentTodayStr = getTodayDateString(now);
      const shortMinuteFlag = buildMinuteRunFlagKey(targetTimeStr); // e.g. "hasRun_10_30"
      const scopedMinuteFlag = buildMinuteRunFlagKey(targetTimeStr, period, currentTodayStr);

      if (
        hasRunMinuteFlagsRef.current.has(scopedMinuteFlag) ||
        hasRunMinuteFlagsRef.current.has(`${period}_${shortMinuteFlag}_${currentTodayStr}`)
      ) {
        return;
      }

      if (period === 'goal' && overallDailyProgress >= 100) {
        return;
      }

      // Mark run flags so setTimeout and 1,000ms setInterval never double-fire in the same minute
      hasRunMinuteFlagsRef.current.add(shortMinuteFlag);
      hasRunMinuteFlagsRef.current.add(scopedMinuteFlag);
      hasRunMinuteFlagsRef.current.add(`${period}_${shortMinuteFlag}_${currentTodayStr}`);

      if (period === 'morning') {
        localStorage.setItem('adhkar_last_morning_notif_date', currentTodayStr);
      } else if (period === 'evening') {
        localStorage.setItem('adhkar_last_evening_notif_date', currentTodayStr);
      } else {
        localStorage.setItem('adhkar_last_goal_notif_date', currentTodayStr);
      }

      // Sync updated lastFired date to Service Worker so it doesn't duplicate
      void syncScheduleWithServiceWorker({
        remindersEnabled: settings.remindersEnabled,
        morningReminderTime: settings.morningReminderTime,
        eveningReminderTime: settings.eveningReminderTime,
        goalReminderEnabled: settings.goalReminderEnabled,
        dailyGoalReminderTime: goalTimeStr,
        morningCompleted: morningProgress.percent >= 100,
        eveningCompleted: eveningProgress.percent >= 100,
        goalCompleted: overallDailyProgress >= 100,
        overallDailyProgress,
        lastFiredMorningDate: localStorage.getItem('adhkar_last_morning_notif_date') || '',
        lastFiredEveningDate: localStorage.getItem('adhkar_last_evening_notif_date') || '',
        lastFiredGoalDate: localStorage.getItem('adhkar_last_goal_notif_date') || '',
      });

      if (period === 'morning') {
        void dispatchMobileSafeNotification(
          'Daily Adhkar — Morning (Fajr)',
          LOCAL_ADHKAR_REMINDER_MESSAGES.morning,
          () => setCurrentTab('morning'),
          {
            arabicSubtitle: 'أَذْكَارُ الصَّبَاحِ (الفجر)',
            malayalamSubtitle: 'പ്രഭാത ദിക്റുകൾ (ഫജ്റ്) • Morning Adhkar',
            targetTab: 'morning',
            actionLabel: 'Recite Morning (Fajr) Adhkar',
            tag: `morning-adhkar-${currentTodayStr}-${targetTimeStr}`,
            icon: 'icon.png',
            isCatchUp: false,
            minutesLate: 0,
            period: 'morning',
          }
        );
      } else if (period === 'evening') {
        void dispatchMobileSafeNotification(
          'Daily Adhkar — Evening (Asr)',
          LOCAL_ADHKAR_REMINDER_MESSAGES.evening,
          () => setCurrentTab('evening'),
          {
            arabicSubtitle: 'أَذْكَارُ الْمَسَاءِ (العصر)',
            malayalamSubtitle: 'സായാഹ്ന ദിക്റുകൾ (അസർ) • Evening Adhkar',
            targetTab: 'evening',
            actionLabel: 'Recite Evening (Asr) Adhkar',
            tag: `evening-adhkar-${currentTodayStr}-${targetTimeStr}`,
            icon: 'icon.png',
            isCatchUp: false,
            minutesLate: 0,
            period: 'evening',
          }
        );
      } else {
        void dispatchMobileSafeNotification(
          'Daily Adhkar — Goal Reminder',
          `${LOCAL_ADHKAR_REMINDER_MESSAGES.goal} (${overallDailyProgress}% complete)`,
          () => setCurrentTab('morning'),
          {
            arabicSubtitle: 'تَذْكِيرُ الْأَهْدَافِ الْيَوْمِيَّةِ',
            malayalamSubtitle: `ഇന്നത്തെ ലക്ഷ്യം പൂർത്തിയാക്കാം (${overallDailyProgress}%)`,
            targetTab: 'morning',
            actionLabel: 'Continue Daily Goals',
            tag: `goal-adhkar-${currentTodayStr}-${targetTimeStr}`,
            icon: 'icon.png',
            isCatchUp: false,
            minutesLate: 0,
            period: 'goal',
          }
        );
      }
    };

    // 2. Precision Millisecond Delay (setTimeout) for exact :00 second execution
    let morningTimeoutId: ReturnType<typeof setTimeout> | null = null;
    let eveningTimeoutId: ReturnType<typeof setTimeout> | null = null;
    let goalTimeoutId: ReturnType<typeof setTimeout> | null = null;

    const armMorningPrecisionTimeout = (referenceNow: Date) => {
      if (morningTimeoutId !== null) clearTimeout(morningTimeoutId);
      if (!settings.remindersEnabled) return;
      const delayMs = getMsUntilNextTime(settings.morningReminderTime, referenceNow);
      morningTimeoutId = setTimeout(() => {
        fireExactScheduledReminder('morning', settings.morningReminderTime);
        // Immediately reset timer for the same time tomorrow
        armMorningPrecisionTimeout(new Date(Date.now() + 1500));
      }, delayMs);
    };

    const armEveningPrecisionTimeout = (referenceNow: Date) => {
      if (eveningTimeoutId !== null) clearTimeout(eveningTimeoutId);
      if (!settings.remindersEnabled) return;
      const delayMs = getMsUntilNextTime(settings.eveningReminderTime, referenceNow);
      eveningTimeoutId = setTimeout(() => {
        fireExactScheduledReminder('evening', settings.eveningReminderTime);
        // Immediately reset timer for the same time tomorrow
        armEveningPrecisionTimeout(new Date(Date.now() + 1500));
      }, delayMs);
    };

    const armGoalPrecisionTimeout = (referenceNow: Date) => {
      if (goalTimeoutId !== null) clearTimeout(goalTimeoutId);
      if (!settings.goalReminderEnabled) return;
      const delayMs = getMsUntilNextTime(goalTimeStr, referenceNow);
      goalTimeoutId = setTimeout(() => {
        fireExactScheduledReminder('goal', goalTimeStr);
        // Immediately reset timer for the same time tomorrow
        armGoalPrecisionTimeout(new Date(Date.now() + 1500));
      }, delayMs);
    };

    const initialNow = new Date();
    armMorningPrecisionTimeout(initialNow);
    armEveningPrecisionTimeout(initialNow);
    armGoalPrecisionTimeout(initialNow);

    // 3. High-Frequency Background Fallback (setInterval every 1,000 ms)
    const oneSecondInterval = setInterval(() => {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();
      const s = now.getSeconds();

      if (settings.remindersEnabled) {
        if (isExactSecondReminderDue(settings.morningReminderTime, h, m, s)) {
          fireExactScheduledReminder('morning', settings.morningReminderTime);
        }
        if (isExactSecondReminderDue(settings.eveningReminderTime, h, m, s)) {
          fireExactScheduledReminder('evening', settings.eveningReminderTime);
        }
      }

      if (settings.goalReminderEnabled) {
        if (isExactSecondReminderDue(goalTimeStr, h, m, s)) {
          fireExactScheduledReminder('goal', goalTimeStr);
        }
      }
    }, 1000);

    // 4. Automated Reopen Catch-Up Check (when app is reopened after screen-off and period was missed by >= 1 min)
    const checkMissedCatchUpOnReopen = () => {
      const now = new Date();
      const currentTodayStr = getTodayDateString(now);
      const catchUpResult = evaluateMissedAdhkarCatchUp({
        remindersEnabled: settings.remindersEnabled,
        morningReminderTime: settings.morningReminderTime,
        eveningReminderTime: settings.eveningReminderTime,
        goalReminderEnabled: settings.goalReminderEnabled,
        dailyGoalReminderTime: goalTimeStr,
        morningProgressPercent: morningProgress.percent,
        eveningProgressPercent: eveningProgress.percent,
        overallDailyProgress,
        currentHours: now.getHours(),
        currentMinutes: now.getMinutes(),
        todayStr: currentTodayStr,
        lastMorningNotifDate: localStorage.getItem('adhkar_last_morning_notif_date'),
        lastEveningNotifDate: localStorage.getItem('adhkar_last_evening_notif_date'),
        lastGoalNotifDate: localStorage.getItem('adhkar_last_goal_notif_date'),
        isAppReopen: true,
      });

      // Only fire catch-up if the scheduled minute is strictly in the past (minutesLate >= 1)
      // Exact :00 second triggers are handled by the precision setTimeout + 1,000ms setInterval
      if (!catchUpResult || catchUpResult.minutesLate < 1) return;

      if (catchUpResult.period === 'morning') {
        localStorage.setItem('adhkar_last_morning_notif_date', currentTodayStr);
      } else if (catchUpResult.period === 'evening') {
        localStorage.setItem('adhkar_last_evening_notif_date', currentTodayStr);
      } else if (catchUpResult.period === 'goal') {
        localStorage.setItem('adhkar_last_goal_notif_date', currentTodayStr);
      }

      void syncScheduleWithServiceWorker({
        remindersEnabled: settings.remindersEnabled,
        morningReminderTime: settings.morningReminderTime,
        eveningReminderTime: settings.eveningReminderTime,
        goalReminderEnabled: settings.goalReminderEnabled,
        dailyGoalReminderTime: goalTimeStr,
        morningCompleted: morningProgress.percent >= 100,
        eveningCompleted: eveningProgress.percent >= 100,
        goalCompleted: overallDailyProgress >= 100,
        overallDailyProgress,
        lastFiredMorningDate: localStorage.getItem('adhkar_last_morning_notif_date') || '',
        lastFiredEveningDate: localStorage.getItem('adhkar_last_evening_notif_date') || '',
        lastFiredGoalDate: localStorage.getItem('adhkar_last_goal_notif_date') || '',
      });

      void dispatchMobileSafeNotification(
        catchUpResult.title,
        catchUpResult.body,
        () => setCurrentTab(catchUpResult.targetTab),
        {
          arabicSubtitle: catchUpResult.arabicSubtitle,
          malayalamSubtitle: catchUpResult.malayalamSubtitle,
          targetTab: catchUpResult.targetTab,
          actionLabel: catchUpResult.actionLabel,
          tag: catchUpResult.tag,
          icon: 'icon.png',
          isCatchUp: catchUpResult.isCatchUp,
          minutesLate: catchUpResult.minutesLate,
          period: catchUpResult.period,
        }
      );
    };

    const handleAppReopen = () => {
      if (typeof document === 'undefined' || document.visibilityState === 'visible') {
        // Re-arm precision timeouts on wake from sleep and check missed periods
        const wakeNow = new Date();
        armMorningPrecisionTimeout(wakeNow);
        armEveningPrecisionTimeout(wakeNow);
        armGoalPrecisionTimeout(wakeNow);
        checkMissedCatchUpOnReopen();
      }
    };

    document.addEventListener('visibilitychange', handleAppReopen);
    window.addEventListener('focus', handleAppReopen);
    window.addEventListener('pageshow', handleAppReopen);

    return () => {
      if (morningTimeoutId !== null) clearTimeout(morningTimeoutId);
      if (eveningTimeoutId !== null) clearTimeout(eveningTimeoutId);
      if (goalTimeoutId !== null) clearTimeout(goalTimeoutId);
      clearInterval(oneSecondInterval);
      document.removeEventListener('visibilitychange', handleAppReopen);
      window.removeEventListener('focus', handleAppReopen);
      window.removeEventListener('pageshow', handleAppReopen);
    };
  }, [
    settings.remindersEnabled,
    settings.morningReminderTime,
    settings.eveningReminderTime,
    settings.goalReminderEnabled,
    settings.dailyGoalReminderTime,
    morningProgress.percent,
    eveningProgress.percent,
    overallDailyProgress,
  ]);

  const activeCategoryConfig =
    CATEGORIES_CONFIG.find((c) => c.key === currentTab) ||
    (currentTab === 'tasks'
      ? { key: 'morning', label: 'Daily Sunnah Tasks', arabicLabel: 'السنن والمهام اليومية', timeHint: 'Daily Sunnah & Devotional Checklist' }
      : currentTab === 'favorites'
      ? { key: 'morning', label: 'Favorite Adhkar', arabicLabel: 'الأذكار المفضلة', timeHint: 'Your Starred Supplications' }
      : currentTab === 'progress'
      ? { key: 'morning', label: 'Progress Analytics', arabicLabel: 'إحصائيات التقدم', timeHint: 'Weekly & Monthly Adhkar History' }
      : CATEGORIES_CONFIG[0]);

  // Calculate total recitations performed today across all items + completed tasks
  const totalRecitationsToday = useMemo(() => {
    const dhikrSum = (Object.values(counts) as number[]).reduce((acc, c) => acc + (Number(c) || 0), 0);
    let tasbihTotal = 0;
    try {
      tasbihTotal = Number(localStorage.getItem('tasbih_total') || '0') || 0;
    } catch {
      tasbihTotal = 0;
    }
    return dhikrSum + taskStats.completed + tasbihTotal;
  }, [counts, taskStats.completed]);

  // Update and persist daily progress history in localStorage (adhkar_progress_history)
  useEffect(() => {
    let tasbihCount = 0;
    try {
      tasbihCount = Number(localStorage.getItem('tasbih_count') || '0') || 0;
    } catch {
      tasbihCount = 0;
    }

    setProgressHistory((prev) => {
      const record = buildDailyProgressRecord({
        date: todayDateStr,
        morningPercent: morningProgress.percent,
        eveningPercent: eveningProgress.percent,
        prayerPercent: prayerProgress.percent,
        sleepPercent: sleepProgress.percent,
        tasksPercent: taskStats.percent,
        tasbihCount,
        overallPercent: overallDailyProgress,
        counts,
        completedTasksCount: taskStats.completed,
      });
      const updated = upsertDailyProgressHistory(prev, record);
      try {
        localStorage.setItem('adhkar_progress_history', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, [
    todayDateStr,
    morningProgress.percent,
    eveningProgress.percent,
    prayerProgress.percent,
    sleepProgress.percent,
    taskStats.percent,
    taskStats.completed,
    overallDailyProgress,
    counts,
  ]);

  // Section Completion Fire (🔥) & All-4-Tabs Massive Fireworks Celebration (🎆🔥)
  useEffect(() => {
    const sectionCelebratedStorageKey = `adhkar_section_celebrated_${todayDateStr}`;
    let celebratedMap: Record<string, boolean> = {};
    try {
      const raw = localStorage.getItem(sectionCelebratedStorageKey);
      celebratedMap = raw ? JSON.parse(raw) : {};
    } catch {
      celebratedMap = {};
    }

    const favItems = getFavoriteDhikrItems(ALL_ADHKAR_ITEMS, favorites);
    const favProg = calculateCategoryProgress(favItems, counts);

    const sectionsToCheck: Array<{
      key: string;
      label: string;
      completed: number;
      total: number;
      isDone: boolean;
    }> = [
      {
        key: 'morning',
        label: 'Morning Adhkar',
        completed: morningProgress.completed,
        total: morningProgress.total,
        isDone: morningProgress.isAllDone && morningProgress.total > 0,
      },
      {
        key: 'evening',
        label: 'Evening Adhkar',
        completed: eveningProgress.completed,
        total: eveningProgress.total,
        isDone: eveningProgress.isAllDone && eveningProgress.total > 0,
      },
      {
        key: 'prayer',
        label: 'After Prayer Adhkar',
        completed: prayerProgress.completed,
        total: prayerProgress.total,
        isDone: prayerProgress.isAllDone && prayerProgress.total > 0,
      },
      {
        key: 'sleep',
        label: 'Before Sleep Adhkar',
        completed: sleepProgress.completed,
        total: sleepProgress.total,
        isDone: sleepProgress.isAllDone && sleepProgress.total > 0,
      },
      {
        key: 'tasks',
        label: 'Daily Sunnah Tasks',
        completed: taskStats.completed,
        total: taskStats.total,
        isDone: taskStats.percent === 100 && taskStats.total > 0,
      },
      {
        key: 'favorites',
        label: 'Favorite Adhkar',
        completed: favProg.completed,
        total: favProg.total,
        isDone: favProg.isAllDone && favProg.total > 0,
      },
    ];

    let mapChanged = false;
    let newlyCompletedSection: SectionCompletionEvent | null = null;

    for (const sec of sectionsToCheck) {
      if (sec.isDone && !celebratedMap[sec.key]) {
        celebratedMap[sec.key] = true;
        mapChanged = true;
        // Prefer showing the overlay for the currently active tab if multiple complete at once
        if (!newlyCompletedSection || sec.key === currentTab) {
          newlyCompletedSection = {
            sectionKey: sec.key,
            sectionLabel: sec.label,
            completedCount: sec.completed,
            totalCount: sec.total,
          };
        }
      } else if (!sec.isDone && celebratedMap[sec.key]) {
        delete celebratedMap[sec.key];
        mapChanged = true;
      }
    }

    if (mapChanged) {
      try {
        localStorage.setItem(sectionCelebratedStorageKey, JSON.stringify(celebratedMap));
      } catch {
        // ignore
      }
    }

    if (newlyCompletedSection) {
      setSectionFireEvent(newlyCompletedSection);
    }

    // Check 'All Completed' Massive Fireworks Celebration when all 4 daily Adhkar tabs reach 100%
    const allFourDone = isAllFourAdhkarCompleted(categoryProgressMap);
    const allCelebratedKey = `adhkar_all_celebrated_${todayDateStr}`;
    const alreadyAllCelebrated = localStorage.getItem(allCelebratedKey) === 'true';

    if (allFourDone && !alreadyAllCelebrated) {
      try {
        localStorage.setItem(allCelebratedKey, 'true');
      } catch {
        // ignore
      }
      setIsAllCompletedFireworksOpen(true);
    } else if (!allFourDone && alreadyAllCelebrated) {
      try {
        localStorage.removeItem(allCelebratedKey);
      } catch {
        // ignore
      }
    }
  }, [
    todayDateStr,
    currentTab,
    morningProgress,
    eveningProgress,
    prayerProgress,
    sleepProgress,
    taskStats,
    favorites,
    counts,
  ]);

  // When any category is completed today, update and persist streak
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

          // Streak updated; individual section completion is celebrated via SectionCompletionFireOverlay,
          // and full-screen fireworks celebration triggers when all 4 sections are completed.
          localStorage.setItem(`adhkar_celebrated_${todayDateStr}`, 'true');
          setCelebrationDetails({
            previousStreak: prev.currentStreak,
            newStreak: res.updatedStreakData.currentStreak,
            categoryName: activeCategoryConfig.label,
            freezeTokens: res.updatedStreakData.freezeTokens,
            freezeUsed: res.freezeUsed,
          });

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
      : currentTab !== 'tasbih' && currentTab !== 'progress'
      ? categoryProgressMap[currentTab as AdhkarCategory]
      : { completed: 0, total: 0, percent: 0, isAllDone: false };

  // Current playing item in Autoplay All mode
  const currentAutoplayItem =
    isAutoplayActive && activeItems[autoplayIndex] ? activeItems[autoplayIndex] : null;

  // Track autoplay pause timer ref to prevent overlapping audio playback
  const autoplayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearAutoplayTimer = () => {
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  };

  // Track global audio playback status
  const [playbackState, setPlaybackState] = useState<AudioPlaybackState>(PronunciationManager.getState());

  useEffect(() => {
    const unsubscribe = PronunciationManager.subscribe((state) => {
      setPlaybackState(state);
    });
    return () => unsubscribe();
  }, []);

  // If the user manually plays a different card while Autoplay is waiting on pause, sync or cancel the timer
  useEffect(() => {
    if (!isAutoplayActive || !playbackState.playingId) return;
    const matchedIdx = activeItems.findIndex((it) => it.id === playbackState.playingId);
    if (matchedIdx >= 0 && matchedIdx !== autoplayIndex) {
      clearAutoplayTimer();
      setAutoplayIndex(matchedIdx);
      setIsAutoplayWaitingPause(false);
    }
  }, [playbackState.playingId, isAutoplayActive, activeItems, autoplayIndex]);

  // Stop autoplay if changing tabs
  const handleSelectTab = (tab: TabKey) => {
    if (isAutoplayActive) {
      stopAutoplay();
    } else {
      PronunciationManager.stop();
    }
    setCurrentTab(tab);
    setSearchQuery('');
  };

  // Start Autoplay All recitation
  const startAutoplayAll = () => {
    if (activeItems.length === 0) return;
    clearAutoplayTimer();
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
    clearAutoplayTimer();
    setIsAutoplayActive(false);
    setIsAutoplayWaitingPause(false);
    PronunciationManager.stop();
  };

  const handleAutoplayTogglePlayPause = () => {
    if (!isAutoplayActive) return;
    const state = PronunciationManager.getState();
    if (state.status === 'playing' || state.status === 'buffering') {
      PronunciationManager.pause();
    } else if (state.status === 'paused') {
      PronunciationManager.resume();
    } else if (currentAutoplayItem) {
      clearAutoplayTimer();
      setIsAutoplayWaitingPause(false);
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
    clearAutoplayTimer();
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
    clearAutoplayTimer();
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

      // Clear any previous timer and pause before next supplication
      clearAutoplayTimer();
      setIsAutoplayWaitingPause(true);
      const nextIdx = autoplayIndex + 1;

      if (nextIdx < activeItems.length) {
        autoplayTimerRef.current = setTimeout(() => {
          autoplayTimerRef.current = null;
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
        autoplayTimerRef.current = setTimeout(() => {
          autoplayTimerRef.current = null;
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

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.classList.toggle('daylight-mode', !isDark);
  }, [isDark]);

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        settings.theme === 'midnight'
          ? 'dark bg-black text-slate-100'
          : settings.theme === 'dark'
          ? 'dark bg-slate-950 text-slate-100'
          : 'daylight-mode bg-slate-100 text-black'
      }`}
    >
      {/* Unblockable Mobile Reminder Banner + Audio Chime Alert */}
      <MobileReminderBanner
        notification={activeMobileNotification}
        onDismiss={() => setActiveMobileNotification(null)}
        onSelectTab={(tab) => {
          setIsSettingsOpen(false);
          handleSelectTab(tab);
        }}
        theme={settings.theme}
      />

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
        onTriggerBellNotification={handleTriggerBellNotification}
        onResetActiveTab={handleResetCurrentTab}
        onOpenExportSingleFile={() => setIsExportModalOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        onOpenShare={() => setIsShareModalOpen(true)}
      />

      {/* Navigation Tab Bar */}
      <TabBar
        activeTab={currentTab}
        onTabChange={handleSelectTab}
        categoryProgress={categoryProgressMap}
        favoritesCount={favorites.length}
        favoritesCompletedCount={favoritesProgress.completed}
        tasksProgress={{ completed: taskStats.completed, total: taskStats.total }}
      />

      {/* Section Completion Fire Overlay (🔥 പൂർത്തിയായി!) */}
      <SectionCompletionFireOverlay
        event={sectionFireEvent}
        onDismiss={() => setSectionFireEvent(null)}
        soundEnabled={settings.soundEnabled}
        vibrateEnabled={settings.vibrateEnabled}
      />

      {/* Main Content Area */}
      <main className="container flex-1 max-w-xl mx-auto px-4 py-4 w-full">
        {currentTab === 'progress' ? (
          <ProgressAnalyticsSection
            history={progressHistory}
            isDark={isDark}
            todayStr={todayDateStr}
            currentStreak={streakStatus.effectiveStreak}
            bestStreak={streakData.bestStreak}
          />
        ) : currentTab === 'tasbih' ? (
          <div className="space-y-6">
            <TasbihCounter
              soundEnabled={settings.soundEnabled}
              vibrateEnabled={settings.vibrateEnabled}
              theme={settings.theme}
            />
            <ProgressAnalyticsSection
              history={progressHistory}
              isDark={isDark}
              todayStr={todayDateStr}
              currentStreak={streakStatus.effectiveStreak}
              bestStreak={streakData.bestStreak}
            />
          </div>
        ) : currentTab === 'tasks' ? (
          <div className="space-y-6">
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
          </div>
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
                    : 'bg-amber-100 border-amber-500 text-black'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-black text-[10px] tracking-wider uppercase px-2 py-0.5 rounded bg-amber-900 text-white shadow-xs">
                    Authentic Booklet
                  </span>
                  <span className={`text-[11px] sm:text-xs font-extrabold ${isDark ? 'text-amber-200' : 'text-black'}`}>
                    All 23 Duas from Shaykh Ibn Uthaymeen (Arabic, Malayalam &amp; English)
                  </span>
                </div>
                <span className={`text-xs font-black hidden sm:inline font-arabic ${isDark ? 'text-amber-200' : 'text-black'}`}>
                  الأذكار صباحاً ومساءً
                </span>
              </div>
            )}

            {/* Hisn al-Muslim Sleep Adhkar Reference Banner */}
            {currentTab === 'sleep' && (
              <div
                data-testid="hisn-sleep-banner"
                className={`mb-3 px-3 py-2.5 rounded-xl text-xs flex flex-wrap items-center justify-between gap-2 border shadow-xs ${
                  isDark
                    ? 'bg-amber-950/30 border-amber-900/50 text-amber-200'
                    : 'bg-amber-100 border-amber-600 text-black'
                }`}
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-black text-[10px] tracking-wider uppercase px-2 py-0.5 rounded bg-amber-900 text-white shadow-xs">
                    Hisn al-Muslim Ch. 28
                  </span>
                  <span className={`text-[11px] sm:text-xs font-extrabold font-malayalam ${isDark ? 'text-amber-200' : 'text-black'}`}>
                    ഉറങ്ങാൻ നേരമുള്ള ദിക്റുകൾ • All {SLEEP_ADHKAR.length} Authentic Bedtime Adhkar &amp; Surahs (#99–#111)
                  </span>
                </div>
                <span className={`text-sm font-black font-arabic ${isDark ? 'text-amber-200' : 'text-black'}`}>
                  حصن المسلم — أذكار النوم
                </span>
              </div>
            )}

            {/* Search, Autoplay All & Quick Filters */}
            <div className="flex flex-col gap-2.5 mb-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                {/* Search input */}
                <div className="relative flex-1">
                  <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-800'}`} />
                  <input
                    type="text"
                    placeholder="Search in Arabic, English, or മലയാളം..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm border focus:outline-none focus:ring-2 focus:ring-teal-600 transition-colors ${
                      isDark
                        ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500 font-medium'
                        : 'bg-white border-slate-400 text-black placeholder-slate-700 font-bold shadow-xs'
                    }`}
                  />
                </div>

                {/* Autoplay All Recite-Along Mode Trigger */}
                {activeItems.length > 0 && (
                  <button
                    onClick={isAutoplayActive ? stopAutoplay : startAutoplayAll}
                    aria-label={isAutoplayActive ? 'Stop recite-along mode' : 'Start Autoplay All recite-along mode'}
                    className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs ${
                      isAutoplayActive
                        ? 'bg-amber-500 text-black font-black animate-pulse'
                        : isDark
                        ? 'bg-emerald-800/15 hover:bg-emerald-800/25 text-emerald-200 border border-emerald-600/40 font-bold'
                        : 'bg-emerald-100 hover:bg-emerald-200 text-black border-2 border-emerald-700 font-extrabold'
                    }`}
                  >
                    <Headphones className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>{isAutoplayActive ? 'Stop Recite-Along' : 'Autoplay All'}</span>
                  </button>
                )}

                {/* Status Filter Badges */}
                <div className="flex items-center gap-1 self-end sm:self-auto">
                  <button
                    onClick={() => setFilterMode('all')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-extrabold transition-colors cursor-pointer border ${
                      filterMode === 'all'
                        ? 'bg-teal-900 border-teal-900 text-white shadow-xs'
                        : isDark
                        ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white font-bold'
                        : 'bg-white border-slate-400 text-black hover:bg-slate-200 font-extrabold shadow-2xs'
                    }`}
                  >
                    All ({activeItems.length})
                  </button>
                  <button
                    onClick={() => setFilterMode('incomplete')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-extrabold transition-colors cursor-pointer border ${
                      filterMode === 'incomplete'
                        ? 'bg-teal-900 border-teal-900 text-white shadow-xs'
                        : isDark
                        ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white font-bold'
                        : 'bg-white border-slate-400 text-black hover:bg-slate-200 font-extrabold shadow-2xs'
                    }`}
                  >
                    Remaining ({activeProgress.total - activeProgress.completed})
                  </button>
                  <button
                    onClick={() => setFilterMode('completed')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-extrabold transition-colors cursor-pointer border ${
                      filterMode === 'completed'
                        ? 'bg-teal-900 border-teal-900 text-white shadow-xs'
                        : isDark
                        ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white font-bold'
                        : 'bg-white border-slate-400 text-black hover:bg-slate-200 font-extrabold shadow-2xs'
                    }`}
                  >
                    Done ({activeProgress.completed})
                  </button>
                </div>
              </div>

              {/* Translation Language Quick Switcher */}
              <div className="flex items-center justify-between px-1 text-xs">
                <span className={`flex items-center gap-1.5 font-extrabold text-[11px] ${isDark ? 'text-slate-300' : 'text-black'}`}>
                  <Languages className={`w-3.5 h-3.5 ${isDark ? 'text-teal-400' : 'text-teal-900 stroke-[2.5]'}`} />
                  <span>Translation Language:</span>
                </span>
                <div className={`inline-flex items-center rounded-lg p-0.5 border ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-400 bg-white shadow-2xs'}`}>
                  <button
                    onClick={() =>
                      setSettings((s) => ({ ...s, translationLanguage: 'both' }))
                    }
                    className={`px-2.5 py-0.5 rounded-md text-[11px] font-extrabold transition-colors cursor-pointer ${
                      (settings.translationLanguage || 'both') === 'both'
                        ? 'bg-teal-900 text-white font-black shadow-xs'
                        : isDark
                        ? 'text-slate-400 hover:text-white font-bold'
                        : 'text-black hover:bg-slate-200 font-extrabold'
                    }`}
                  >
                    Both (<span className="font-malayalam font-black">രണ്ടും</span>)
                  </button>
                  <button
                    onClick={() =>
                      setSettings((s) => ({ ...s, translationLanguage: 'ml' }))
                    }
                    className={`px-2.5 py-0.5 rounded-md text-[11px] font-extrabold transition-colors cursor-pointer font-malayalam ${
                      settings.translationLanguage === 'ml'
                        ? 'bg-teal-900 text-white font-black shadow-xs'
                        : isDark
                        ? 'text-slate-400 hover:text-white font-bold'
                        : 'text-black hover:bg-slate-200 font-extrabold'
                    }`}
                  >
                    മലയാളം
                  </button>
                  <button
                    onClick={() =>
                      setSettings((s) => ({ ...s, translationLanguage: 'en' }))
                    }
                    className={`px-2.5 py-0.5 rounded-md text-[11px] font-extrabold transition-colors cursor-pointer ${
                      settings.translationLanguage === 'en'
                        ? 'bg-teal-900 text-white font-black shadow-xs'
                        : isDark
                        ? 'text-slate-400 hover:text-white font-bold'
                        : 'text-black hover:bg-slate-200 font-extrabold'
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
            <div className={`mt-4 pt-2 border-t flex flex-col sm:flex-row items-center gap-2 ${isDark ? 'border-slate-800' : 'border-slate-300'}`}>
              <button
                className={`reset-btn w-full sm:flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer border ${
                  isDark
                    ? 'bg-transparent text-slate-400 hover:text-slate-200 border-slate-700 font-semibold'
                    : 'bg-white hover:bg-slate-200 text-black border-2 border-slate-400 font-extrabold shadow-xs'
                }`}
                onClick={handleResetCurrentTab}
              >
                <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
                Reset Counters
              </button>

              <button
                data-testid="complete-all-current-tab-btn"
                className={`w-full sm:flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer border ${
                  isDark
                    ? 'bg-teal-800/10 hover:bg-teal-800/20 text-teal-300 border-teal-600/30 font-semibold'
                    : 'bg-teal-100 hover:bg-teal-200 text-black border-2 border-teal-700 font-extrabold shadow-xs'
                }`}
                onClick={handleCompleteAllCurrentTab}
              >
                <CheckCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                Complete All ({activeCategoryConfig.label})
              </button>
            </div>

            {/* Dedicated Weekly and Monthly Progress Tracking Section on Dashboard */}
            <div className="mt-6">
              <ProgressAnalyticsSection
                history={progressHistory}
                isDark={isDark}
                todayStr={todayDateStr}
                currentStreak={streakStatus.effectiveStreak}
                bestStreak={streakData.bestStreak}
              />
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
        isPlaying={playbackState.status === 'playing' || playbackState.status === 'buffering'}
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

      {/* Animated Daily Streak Completion Modal (only show if full-screen All Completed Fireworks isn't active) */}
      <StreakCompletionModal
        isOpen={isStreakCelebrationOpen && !isAllCompletedFireworksOpen}
        onClose={() => setIsStreakCelebrationOpen(false)}
        previousStreak={celebrationDetails.previousStreak}
        newStreak={celebrationDetails.newStreak}
        categoryName={celebrationDetails.categoryName}
        freezeTokens={celebrationDetails.freezeTokens}
        freezeUsed={celebrationDetails.freezeUsed}
        onShare={() => setIsShareModalOpen(true)}
      />

      {/* 'All Completed' Massive Fireworks Celebration Modal (🎆🔥) */}
      <AllCompletedFireworksModal
        isOpen={isAllCompletedFireworksOpen}
        onDismiss={() => setIsAllCompletedFireworksOpen(false)}
        streakCount={Math.max(1, streakStatus.effectiveStreak)}
        bestStreak={Math.max(1, streakData.bestStreak)}
        totalRecitationsToday={totalRecitationsToday}
        completedSectionsCount={
          [
            morningProgress.isAllDone,
            eveningProgress.isAllDone,
            prayerProgress.isAllDone,
            sleepProgress.isAllDone,
            taskStats.percent === 100 && taskStats.total > 0,
          ].filter(Boolean).length
        }
        soundEnabled={settings.soundEnabled}
        vibrateEnabled={settings.vibrateEnabled}
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
