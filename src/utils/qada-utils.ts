export type QadaPrayerKey = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
export type QadaItemKey = QadaPrayerKey | 'fasting';

export interface QadaPrayerCounts {
  fajr: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
}

export interface QadaHistoryDay {
  prayers: number;
  fasting: number;
  mudd: number;
}

export interface QadaState {
  configured: boolean;
  remaining: QadaPrayerCounts & { fasting: number };
  initial: QadaPrayerCounts & { fasting: number };
  muddRemaining: number;
  muddInitial: number;
  muddGramsPerUnit: 600 | 650;
  dailyPace: number;
  cycleDeductionEnabled: boolean;
  cycleDaysPerMonth: number;
  history: Record<string, QadaHistoryDay>;
  updatedAt: string | null;
}

export interface QadaAutoCalcInput {
  inputMode: 'duration' | 'dates';
  years?: number;
  months?: number;
  days?: number;
  startDate?: string;
  endDate?: string;
  cycleDeductionEnabled: boolean;
  cycleDaysPerMonth?: number;
  missedFasts?: number;
  delayedFasts?: number;
  yearsDelayed?: number;
  muddGramsPerUnit?: 600 | 650;
}

export interface QadaAutoCalcResult {
  rawDays: number;
  deductedPrayerDays: number;
  netPrayerDays: number;
  totalPrayers: number;
  netFasts: number;
  totalMudds: number;
  riceGrams: number;
  riceKg: number;
}

export const QADA_PRAYER_KEYS: QadaPrayerKey[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

export function createDefaultQadaState(): QadaState {
  return {
    configured: false,
    remaining: { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0, fasting: 0 },
    initial: { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0, fasting: 0 },
    muddRemaining: 0,
    muddInitial: 0,
    muddGramsPerUnit: 650,
    dailyPace: 5,
    cycleDeductionEnabled: false,
    cycleDaysPerMonth: 7,
    history: {},
    updatedAt: null,
  };
}

export function clampNonNegativeInt(val: unknown, max = 1000000): number {
  const n = Math.floor(Number(val));
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(n, max);
}

export function calculateRawDaysFromInput(input: Pick<QadaAutoCalcInput, 'inputMode' | 'years' | 'months' | 'days' | 'startDate' | 'endDate'>): number {
  if (input.inputMode === 'dates') {
    if (!input.startDate || !input.endDate) return 0;
    const start = new Date(input.startDate + 'T00:00:00');
    const end = new Date(input.endDate + 'T00:00:00');
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
    const diffMs = end.getTime() - start.getTime();
    if (diffMs < 0) return 0;
    return Math.floor(diffMs / 86400000) + 1;
  }
  const years = clampNonNegativeInt(input.years ?? 0, 100);
  const months = clampNonNegativeInt(input.months ?? 0, 1200);
  const days = clampNonNegativeInt(input.days ?? 0, 36500);
  return years * 365 + months * 30 + days;
}

export function calculateQadaAndMudd(input: QadaAutoCalcInput): QadaAutoCalcResult {
  const rawDays = calculateRawDaysFromInput(input);
  const cycleDaysPerMonth = Math.max(1, Math.min(15, clampNonNegativeInt(input.cycleDaysPerMonth ?? 7, 15) || 7));

  let deductedPrayerDays = 0;
  if (input.cycleDeductionEnabled && rawDays > 0) {
    deductedPrayerDays = Math.min(rawDays, Math.round((rawDays / 30) * cycleDaysPerMonth));
  }

  const netPrayerDays = Math.max(0, rawDays - deductedPrayerDays);
  const totalPrayers = netPrayerDays * 5;

  // Missed fasts: if user explicitly enters missedFasts, use it directly (with optional cycle exemption if they didn't already deduct? No, fasting during menstruation STILL requires Qada in Shafi'i fiqh — only prayers are exempted from Qada! However, if the user specifies missedFasts directly, keep exact count.)
  // Wait: In Islamic fiqh (including Shafi'i), prayers missed during menstruation are EXEMPTED (no Qada), whereas missed Ramadan fasts during menstruation DO require Qada. So female cycle deduction deducts exempted prayers, while missed fasts count stays accurate (and auto-estimates ~cycleDaysPerMonth per missed Ramadan year if user left missedFasts blank and enabled cycle toggle, or 0 if not entered).
  const explicitFasts = input.missedFasts !== undefined && input.missedFasts !== null
    ? clampNonNegativeInt(input.missedFasts, 10000)
    : 0;

  const delayedFasts = clampNonNegativeInt(input.delayedFasts ?? 0, 10000);
  const yearsDelayed = clampNonNegativeInt(input.yearsDelayed ?? 0, 100);
  const totalMudds = delayedFasts * yearsDelayed;

  const gramsPerMudd: 600 | 650 = input.muddGramsPerUnit === 600 ? 600 : 650;
  const riceGrams = totalMudds * gramsPerMudd;
  const riceKg = Number((riceGrams / 1000).toFixed(2));

  return {
    rawDays,
    deductedPrayerDays,
    netPrayerDays,
    totalPrayers,
    netFasts: explicitFasts,
    totalMudds,
    riceGrams,
    riceKg,
  };
}

export function formatMuddWeight(mudds: number, gramsPerUnit: 600 | 650 = 650): { grams: number; kg: string; display: string } {
  const safeMudds = clampNonNegativeInt(mudds);
  const grams = safeMudds * (gramsPerUnit === 600 ? 600 : 650);
  const kgNum = grams / 1000;
  const kg = kgNum % 1 === 0 ? kgNum.toFixed(1) : kgNum.toFixed(2).replace(/0$/, '');
  const display = grams >= 1000
    ? `${kg} kg (${grams.toLocaleString('en-US')} g)`
    : `${grams} g`;
  return { grams, kg, display };
}

export function getTotalRemainingPrayers(state: QadaState): number {
  return QADA_PRAYER_KEYS.reduce((sum, key) => sum + clampNonNegativeInt(state.remaining[key]), 0);
}

export function getTotalInitialPrayers(state: QadaState): number {
  return QADA_PRAYER_KEYS.reduce((sum, key) => sum + Math.max(clampNonNegativeInt(state.initial[key]), clampNonNegativeInt(state.remaining[key])), 0);
}

export function getEstimatedCompletionMalayalam(totalRemainingPrayers: number, dailyPace: number): {
  daysNeeded: number;
  label: string;
} {
  const remaining = clampNonNegativeInt(totalRemainingPrayers);
  const pace = Math.max(1, clampNonNegativeInt(dailyPace, 50) || 5);

  if (remaining === 0) {
    return {
      daysNeeded: 0,
      label: 'അൽഹംദുലില്ലാഹ്! എല്ലാ ഖളാഅ് നമസ്കാരങ്ങളും പൂർത്തിയായി!',
    };
  }

  const daysNeeded = Math.ceil(remaining / pace);
  let durationText = '';
  if (daysNeeded < 30) {
    durationText = `${daysNeeded} ദിവസം`;
  } else if (daysNeeded < 365) {
    const months = Math.max(1, Math.round((daysNeeded / 30) * 10) / 10);
    const monthsDisplay = Number.isInteger(months) ? String(months) : months.toFixed(1);
    durationText = `${monthsDisplay} മാസം`;
  } else {
    const years = Math.floor(daysNeeded / 365);
    const remMonths = Math.round((daysNeeded % 365) / 30);
    if (remMonths === 0) {
      durationText = `${years} വർഷം`;
    } else if (remMonths === 12) {
      durationText = `${years + 1} വർഷം`;
    } else {
      durationText = `${years} വർഷം ${remMonths} മാസം`;
    }
  }

  return {
    daysNeeded,
    label: `ദിവസവും ${pace} ഖളാഅ് വീതം നമസ്കരിച്ചാൽ ${durationText} കൊണ്ട് പൂർത്തിയാക്കാം`,
  };
}

export function applyQadaDelta(
  state: QadaState,
  itemKey: QadaItemKey | 'mudd',
  delta: -1 | 1,
  todayStr: string
): { nextState: QadaState; changed: boolean; milestoneReached: 'all_complete' | 'item_complete' | 'batch_milestone' | null } {
  const next: QadaState = {
    ...state,
    remaining: { ...state.remaining },
    initial: { ...state.initial },
    history: { ...state.history },
  };

  const todayEntry: QadaHistoryDay = next.history[todayStr]
    ? { ...next.history[todayStr] }
    : { prayers: 0, fasting: 0, mudd: 0 };

  let changed = false;
  let milestoneReached: 'all_complete' | 'item_complete' | 'batch_milestone' | null = null;

  if (itemKey === 'mudd') {
    const prev = clampNonNegativeInt(next.muddRemaining);
    const updated = Math.max(0, prev + delta);
    if (updated === prev) return { nextState: state, changed: false, milestoneReached: null };
    changed = true;
    next.muddRemaining = updated;
    if (updated > next.muddInitial) next.muddInitial = updated;
    if (delta === -1) {
      todayEntry.mudd += 1;
      if (updated === 0 && prev > 0) milestoneReached = 'item_complete';
      else if (todayEntry.mudd > 0 && todayEntry.mudd % 5 === 0) milestoneReached = 'batch_milestone';
    } else {
      todayEntry.mudd = Math.max(0, todayEntry.mudd - 1);
    }
  } else {
    const prev = clampNonNegativeInt(next.remaining[itemKey]);
    const prevAllPrayers = getTotalRemainingPrayers(next);
    const updated = Math.max(0, prev + delta);
    if (updated === prev) return { nextState: state, changed: false, milestoneReached: null };
    changed = true;
    next.remaining[itemKey] = updated;
    if (updated > next.initial[itemKey]) next.initial[itemKey] = updated;
    if (delta === -1) {
      if (itemKey === 'fasting') {
        todayEntry.fasting += 1;
        if (updated === 0 && prev > 0) milestoneReached = 'item_complete';
      } else {
        todayEntry.prayers += 1;
        const newAllPrayers = getTotalRemainingPrayers(next);
        if (newAllPrayers === 0 && prevAllPrayers > 0) {
          milestoneReached = 'all_complete';
        } else if (updated === 0 && prev > 0) {
          milestoneReached = 'item_complete';
        } else if (todayEntry.prayers > 0 && todayEntry.prayers % 5 === 0) {
          milestoneReached = 'batch_milestone';
        }
      }
    } else {
      if (itemKey === 'fasting') {
        todayEntry.fasting = Math.max(0, todayEntry.fasting - 1);
      } else {
        todayEntry.prayers = Math.max(0, todayEntry.prayers - 1);
      }
    }
  }

  next.history[todayStr] = todayEntry;
  next.configured = true;
  next.updatedAt = new Date().toISOString();
  return { nextState: next, changed, milestoneReached };
}
