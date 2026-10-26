/**
 * Pure functions for calculating and maintaining daily adhkar streaks,
 * including weekly streak freeze grace tokens and time-based recommendations.
 */

export interface StreakData {
  currentStreak: number;
  bestStreak: number;
  lastCompletedDate: string | null; // YYYY-MM-DD
  freezeTokens: number; // 0 or 1 free token per week
  lastFreezeReplenishedDate: string | null; // YYYY-MM-DD
  usedFreezeDates: string[]; // YYYY-MM-DD dates protected by freeze
}

export interface StreakStatus {
  effectiveStreak: number;
  completedToday: boolean;
  isAtRisk: boolean; // Yesterday completed, waiting for today
  freezeAvailable: boolean;
  freezeUsedToday: boolean;
  canUseFreeze: boolean;
}

/**
 * Calculates number of calendar days between two YYYY-MM-DD dates.
 * dateStr2 - dateStr1 in whole days.
 */
export function getDaysDifference(dateStr1: string, dateStr2: string): number {
  if (!dateStr1 || !dateStr2) return 0;
  const [y1, m1, d1] = dateStr1.split('-').map(Number);
  const [y2, m2, d2] = dateStr2.split('-').map(Number);

  const utc1 = Date.UTC(y1, m1 - 1, d1);
  const utc2 = Date.UTC(y2, m2 - 1, d2);

  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.round((utc2 - utc1) / MS_PER_DAY);
}

/**
 * Determines whether the user is eligible for a weekly streak freeze token replenishment.
 * Users receive 1 free freeze token every 7 days (max 1 token held).
 */
export function shouldReplenishFreezeToken(
  lastReplenishedDate: string | null,
  todayDateStr: string
): boolean {
  if (!lastReplenishedDate) return true;
  const diffDays = getDaysDifference(lastReplenishedDate, todayDateStr);
  return diffDays >= 7;
}

/**
 * Replenishes weekly freeze token if eligible. Max cap is 1 token.
 */
export function checkAndReplenishFreeze(
  streakData: StreakData,
  todayDateStr: string
): StreakData {
  if (streakData.freezeTokens >= 1) {
    return streakData;
  }

  if (shouldReplenishFreezeToken(streakData.lastFreezeReplenishedDate, todayDateStr)) {
    return {
      ...streakData,
      freezeTokens: 1,
      lastFreezeReplenishedDate: todayDateStr,
    };
  }

  return streakData;
}

/**
 * Determines current active streak status when app loads or day changes.
 * Incorporates streak freeze grace period: if user missed exactly 1 day (diff === 2)
 * and has a freeze token, the streak is protected or eligible for protection.
 */
export function getCurrentStreakStatus(
  streakData: StreakData,
  todayDateStr: string
): StreakStatus {
  const { currentStreak, lastCompletedDate, freezeTokens, usedFreezeDates = [] } = streakData;

  if (!lastCompletedDate || currentStreak <= 0) {
    return {
      effectiveStreak: 0,
      completedToday: false,
      isAtRisk: false,
      freezeAvailable: freezeTokens > 0,
      freezeUsedToday: false,
      canUseFreeze: false,
    };
  }

  const diffDays = getDaysDifference(lastCompletedDate, todayDateStr);

  if (diffDays === 0) {
    // Already completed today!
    return {
      effectiveStreak: currentStreak,
      completedToday: true,
      isAtRisk: false,
      freezeAvailable: freezeTokens > 0,
      freezeUsedToday: usedFreezeDates.includes(todayDateStr),
      canUseFreeze: false,
    };
  } else if (diffDays === 1) {
    // Completed yesterday, streak is alive and waiting for today's remembrance!
    return {
      effectiveStreak: currentStreak,
      completedToday: false,
      isAtRisk: true,
      freezeAvailable: freezeTokens > 0,
      freezeUsedToday: false,
      canUseFreeze: false,
    };
  } else if (diffDays === 2) {
    // Missed yesterday! Check if yesterday was already covered by freeze token
    // Yesterday's date
    const [y, m, d] = todayDateStr.split('-').map(Number);
    const yesterdayDate = new Date(Date.UTC(y, m - 1, d - 1));
    const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

    const yesterdayWasFrozen = usedFreezeDates.includes(yesterdayStr);

    if (yesterdayWasFrozen) {
      // Freeze was applied to yesterday: streak is alive and at risk for today!
      return {
        effectiveStreak: currentStreak,
        completedToday: false,
        isAtRisk: true,
        freezeAvailable: freezeTokens > 0,
        freezeUsedToday: false,
        canUseFreeze: false,
      };
    } else if (freezeTokens > 0) {
      // Can apply freeze token to save yesterday!
      return {
        effectiveStreak: currentStreak,
        completedToday: false,
        isAtRisk: true,
        freezeAvailable: true,
        freezeUsedToday: false,
        canUseFreeze: true,
      };
    } else {
      // Missed yesterday with no freeze token: streak reset
      return {
        effectiveStreak: 0,
        completedToday: false,
        isAtRisk: false,
        freezeAvailable: false,
        freezeUsedToday: false,
        canUseFreeze: false,
      };
    }
  } else {
    // Gap > 2 days: streak reset
    return {
      effectiveStreak: 0,
      completedToday: false,
      isAtRisk: false,
      freezeAvailable: freezeTokens > 0,
      freezeUsedToday: false,
      canUseFreeze: false,
    };
  }
}

/**
 * Consumes 1 streak freeze token to protect a missed day (e.g., yesterday).
 */
export function useStreakFreeze(
  streakData: StreakData,
  missedDateStr: string
): StreakData {
  if (streakData.freezeTokens <= 0) {
    return streakData;
  }

  const used = streakData.usedFreezeDates || [];
  if (used.includes(missedDateStr)) {
    return streakData;
  }

  return {
    ...streakData,
    freezeTokens: streakData.freezeTokens - 1,
    usedFreezeDates: [...used, missedDateStr],
  };
}

/**
 * Updates streak when user completes any adhkar category today.
 * If user missed yesterday but used a freeze or has a freeze token available,
 * it safely protects the streak and advances it by +1.
 */
export function calculateStreakOnCompletion(
  streakData: StreakData,
  todayDateStr: string
): { updatedStreakData: StreakData; isNewStreakDay: boolean; freezeUsed: boolean } {
  const { lastCompletedDate, currentStreak, bestStreak, freezeTokens, usedFreezeDates = [] } = streakData;

  // Already completed today
  if (lastCompletedDate === todayDateStr) {
    return {
      updatedStreakData: streakData,
      isNewStreakDay: false,
      freezeUsed: false,
    };
  }

  let newStreak = 1;
  let newFreezeTokens = freezeTokens;
  let newUsedDates = [...usedFreezeDates];
  let freezeUsed = false;

  if (lastCompletedDate) {
    const diffDays = getDaysDifference(lastCompletedDate, todayDateStr);

    if (diffDays === 1) {
      // Consecutive day!
      newStreak = currentStreak + 1;
    } else if (diffDays === 2) {
      // Missed yesterday
      const [y, m, d] = todayDateStr.split('-').map(Number);
      const yesterdayDate = new Date(Date.UTC(y, m - 1, d - 1));
      const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

      if (usedFreezeDates.includes(yesterdayStr)) {
        // Already protected by freeze
        newStreak = currentStreak + 1;
      } else if (freezeTokens > 0) {
        // Automatically consume freeze token to rescue streak!
        newFreezeTokens = freezeTokens - 1;
        newUsedDates.push(yesterdayStr);
        freezeUsed = true;
        newStreak = currentStreak + 1;
      } else {
        // No freeze available, start at 1
        newStreak = 1;
      }
    } else {
      // Gap > 2 days
      newStreak = 1;
    }
  }

  const newBestStreak = Math.max(bestStreak, newStreak);

  return {
    updatedStreakData: {
      ...streakData,
      currentStreak: newStreak,
      bestStreak: newBestStreak,
      lastCompletedDate: todayDateStr,
      freezeTokens: newFreezeTokens,
      usedFreezeDates: newUsedDates,
    },
    isNewStreakDay: true,
    freezeUsed,
  };
}

export type TimePeriodKey = 'fajr_morning' | 'dhuhr_afternoon' | 'asr_evening' | 'isha_night';

export interface TimeBasedRecommendation {
  periodKey: TimePeriodKey;
  targetTab: 'morning' | 'evening' | 'prayer' | 'sleep' | 'tasks';
  title: string;
  arabicTitle: string;
  malayalamTitle: string;
  description: string;
  iconName: 'sun' | 'sunrise' | 'sunset' | 'moon';
  recommendedTasks: string[];
}

/**
 * Returns the recommended Adhkar and devotional tasks based on the current hour of the day.
 */
export function getTimeBasedRecommendation(hour: number = new Date().getHours()): TimeBasedRecommendation {
  if (hour >= 4 && hour < 12) {
    return {
      periodKey: 'fajr_morning',
      targetTab: 'morning',
      title: 'Morning Adhkar & Duha Prayer',
      arabicTitle: 'أذكار الصباح وصلاة الضحى',
      malayalamTitle: 'പ്രഭാത ദിക്റുകളും ളുഹാ നമസ്കാരവും',
      description: 'Start your morning in Allah’s protection and seek blessings for the day.',
      iconName: 'sunrise',
      recommendedTasks: [
        'Complete 23 authentic Morning Adhkar',
        'Ayat al-Kursi & 3 Quls',
        '2-4 Rakat Salat al-Duha',
      ],
    };
  } else if (hour >= 12 && hour < 16) {
    return {
      periodKey: 'dhuhr_afternoon',
      targetTab: 'prayer',
      title: 'After-Prayer Adhkar & Sunnah',
      arabicTitle: 'أذكار بعد الصلوات المكتوبة',
      malayalamTitle: 'ഫർള് നമസ്കാര ശേഷമുള്ള ദിക്റുകൾ',
      description: 'Recite 33x SubhanAllah, Alhamdulillah, Allahu Akbar following prayer.',
      iconName: 'sun',
      recommendedTasks: [
        'Astaghfirullah (3x) & Allahumma Antas Salam',
        'Tasbih, Tahmid & Takbir (33x each)',
        'Ayat al-Kursi after prayer',
      ],
    };
  } else if (hour >= 16 && hour < 20) {
    return {
      periodKey: 'asr_evening',
      targetTab: 'evening',
      title: 'Evening Adhkar & Protection',
      arabicTitle: 'أذكار المساء والحفظ',
      malayalamTitle: 'വൈകുന്നേരത്തെ ദിക്റുകൾ',
      description: 'Fortify your heart and home before sunset with the evening remembrances.',
      iconName: 'sunset',
      recommendedTasks: [
        'Complete 23 authentic Evening Adhkar',
        'Sayyidul Istighfar',
        'Bismillahi-lladhi la yadurru...',
      ],
    };
  } else {
    return {
      periodKey: 'isha_night',
      targetTab: 'sleep',
      title: 'Night, Sleep Adhkar & Surah Al-Mulk',
      arabicTitle: 'أذكار النوم وسورة الملك والوتر',
      malayalamTitle: 'ഉറങ്ങുന്നതിനു മുമ്പുള്ള ദിക്റുകൾ',
      description: 'Recite Surah Al-Mulk, Ayat al-Kursi, and sleep duas with peaceful wudu.',
      iconName: 'moon',
      recommendedTasks: [
        'Surah Al-Mulk for protection from punishment',
        'Sleep Adhkar & Ayat al-Kursi',
        'Witr Prayer before sleep',
      ],
    };
  }
}
