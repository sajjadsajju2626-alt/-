import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { AdhkarCategory, ProgressSummary } from '../types/adhkar.ts';
import { ProgressHistoryMap } from '../utils/progress-history-utils.ts';

interface StreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStreak: number;
  bestStreak: number;
  completedToday: boolean;
  categoryProgress: Record<AdhkarCategory, ProgressSummary>;
  progressHistory?: ProgressHistoryMap;
  usedFreezeDates?: string[];
  freezeTokens?: number;
  canUseFreeze?: boolean;
  onUseFreeze?: () => void;
  onSelectCategory?: (category: AdhkarCategory) => void;
}

const WEEKDAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;

function formatLocalYYYYMMDD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export const StreakModal: React.FC<StreakModalProps> = ({
  isOpen,
  onClose,
  currentStreak,
  bestStreak,
  categoryProgress,
  progressHistory = {},
  usedFreezeDates = [],
  onSelectCategory,
}) => {
  // Support Android hardware back-button (History API popstate) and Escape key dismissal
  useEffect(() => {
    if (!isOpen) return;

    let pushedHistory = false;
    try {
      window.history.pushState({ modal: 'streak' }, '');
      pushedHistory = true;
    } catch {
      // ignore
    }

    const handlePopState = () => {
      onClose();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
      if (pushedHistory && window.history.state?.modal === 'streak') {
        try {
          window.history.back();
        } catch {
          // ignore
        }
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const pillars: Array<{
    key: AdhkarCategory;
    label: string;
    subLabel: string;
    arabic: string;
  }> = [
    {
      key: 'morning',
      label: 'Morning • പ്രഭാതം',
      subLabel: 'പ്രഭാത ദിക്റുകൾ',
      arabic: 'أذكار الصباح',
    },
    {
      key: 'evening',
      label: 'Evening • പ്രദോഷം',
      subLabel: 'പ്രദോഷ ദിക്റുകൾ',
      arabic: 'أذكار المساء',
    },
    {
      key: 'prayer',
      label: 'After Prayer • നമസ്കാരം',
      subLabel: 'നമസ്കാര ശേഷമുള്ള ദിക്റുകൾ',
      arabic: 'أذكار بعد الصلاة',
    },
    {
      key: 'sleep',
      label: 'Sleep • ഉറക്കം',
      subLabel: 'ഉറങ്ങുന്ന നേരത്തെ ദിക്റുകൾ',
      arabic: 'أذكار النوم',
    },
  ];

  const completedPillarsCount = pillars.filter((p) => {
    const prog = categoryProgress[p.key];
    return prog && prog.total > 0 && prog.completed === prog.total;
  }).length;

  const allFourDoneToday = completedPillarsCount === 4;

  // Build 7-day week row (Su..Sa of current week)
  const now = new Date();
  const todayIdx = now.getDay(); // 0 (Su) .. 6 (Sa)

  // Read completion timestamps from localStorage if available
  let completionTimestamps: Record<string, number> = {};
  try {
    const rawTs = localStorage.getItem('adhkar_completion_timestamps');
    if (rawTs) completionTimestamps = JSON.parse(rawTs) || {};
  } catch {
    completionTimestamps = {};
  }

  const weekDays = WEEKDAY_LABELS.map((dayLabel, idx) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (todayIdx - idx));
    const dateStr = formatLocalYYYYMMDD(d);

    if (idx === todayIdx) {
      return {
        dayLabel,
        dateStr,
        status: allFourDoneToday ? ('completed' as const) : ('today' as const),
        isToday: true,
      };
    }

    if (idx > todayIdx) {
      return {
        dayLabel,
        dateStr,
        status: 'future' as const,
        isToday: false,
      };
    }

    // Past day in current week (idx < todayIdx)
    const histRec = progressHistory[dateStr];
    const wasAllFourDone =
      Boolean(completionTimestamps[dateStr]) ||
      Boolean(
        histRec &&
          histRec.morningPercent === 100 &&
          histRec.eveningPercent === 100 &&
          histRec.prayerPercent === 100 &&
          histRec.sleepPercent === 100
      );

    return {
      dayLabel,
      dateStr,
      status: wasAllFourDone ? ('completed' as const) : ('missed' as const),
      isToday: false,
    };
  });

  const hasMissedDayInWeek =
    weekDays.some((d) => d.status === 'missed') || usedFreezeDates.length > 0;

  const effectiveDisplayStreak = allFourDoneToday
    ? Math.max(1, currentStreak)
    : currentStreak;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/65 backdrop-blur-xs p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="streak-modal-title"
      data-testid="streak-modal"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl border border-emerald-500/30 dark:border-slate-800 space-y-4 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close Icon */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close streak modal"
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. Centerpiece Visuals: Animated Flame SVG + Glowing Particle Accents + Large Streak Number + Subtitle */}
        <div className="text-center pt-1 pb-1">
          <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
            {/* Soft radial glow behind flame */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-orange-500/30 via-amber-400/25 to-yellow-300/10 blur-xl pointer-events-none" />

            {/* Glowing Particle Accents */}
            <span
              className="streak-particle absolute top-2 left-3 w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]"
              style={{ animationDelay: '0s' }}
            />
            <span
              className="streak-particle absolute top-4 right-3 w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_8px_#fb923c]"
              style={{ animationDelay: '0.5s' }}
            />
            <span
              className="streak-particle absolute bottom-4 left-2 w-2 h-2 rounded-full bg-yellow-300 shadow-[0_0_8px_#fde047]"
              style={{ animationDelay: '1.1s' }}
            />
            <span
              className="streak-particle absolute bottom-5 right-2 w-2.5 h-2.5 rounded-full bg-amber-300 shadow-[0_0_8px_#fcd34d]"
              style={{ animationDelay: '0.8s' }}
            />

            {/* Large Vibrant Orange Flame SVG */}
            <svg
              className="streak-flame-svg w-20 h-20 overflow-visible"
              viewBox="0 0 120 135"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="duolingoFlameOuter" x1="60" y1="6" x2="60" y2="128" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FF9800" />
                  <stop offset="55%" stopColor="#FF6D00" />
                  <stop offset="100%" stopColor="#E65100" />
                </linearGradient>
                <linearGradient id="duolingoFlameInner" x1="60" y1="36" x2="60" y2="122" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FFF176" />
                  <stop offset="60%" stopColor="#FFB300" />
                  <stop offset="100%" stopColor="#FF8F00" />
                </linearGradient>
              </defs>
              <path
                d="M64.5 8C64.5 8 106 42.5 106 82C106 108.5 85.4 128 60 128C34.6 128 14 108.5 14 82C14 59.5 29.5 41.2 41.5 29.5C40.2 42 46.8 50.5 52 54C49.5 34.5 56.5 18.5 64.5 8Z"
                fill="url(#duolingoFlameOuter)"
              />
              <path
                d="M61.5 42C61.5 42 86 63.5 86 87.5C86 104.5 74.4 118 60 118C45.6 118 34 104.5 34 87.5C34 73.5 44 62 52.5 54.5C52.5 63.5 57.5 68 61 70.5C59 58 60 48.5 61.5 42Z"
                fill="url(#duolingoFlameInner)"
              />
              <ellipse cx="60" cy="101" rx="13" ry="15" fill="#FFFDE7" fillOpacity="0.9" />
            </svg>
          </div>

          {/* Large Rounded Bold Orange Streak Number */}
          <div
            id="streak-modal-title"
            data-testid="streak-modal-number"
            className="text-5xl sm:text-6xl font-black tracking-tight text-orange-500 dark:text-orange-400 leading-none mt-1"
          >
            {effectiveDisplayStreak}
          </div>

          {/* Subtitle */}
          <p
            data-testid="streak-modal-subtitle"
            className="text-sm sm:text-base font-extrabold text-slate-700 dark:text-slate-200 font-malayalam mt-1.5"
          >
            day streak / തുടർച്ചയായ ദിവസങ്ങൾ
          </p>

          {bestStreak > 0 && (
            <p className="text-[11px] font-bold text-amber-700 dark:text-amber-300 mt-0.5">
              🏆 Best Record: {Math.max(bestStreak, effectiveDisplayStreak)} days
            </p>
          )}
        </div>

        {/* 2. 7-Day Week Row (Su, Mo, Tu, We, Th, Fr, Sa) & Freeze Banner */}
        <div
          data-testid="streak-week-card"
          className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 space-y-3"
        >
          <div
            data-testid="streak-week-row"
            className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center"
          >
            {weekDays.map((day) => {
              return (
                <div
                  key={day.dayLabel}
                  data-testid={`streak-day-col-${day.dayLabel}`}
                  data-status={day.status}
                  className="flex flex-col items-center gap-1.5"
                >
                  <span
                    className={`text-xs font-extrabold ${
                      day.isToday
                        ? 'text-orange-600 dark:text-amber-300'
                        : day.status === 'missed'
                        ? 'text-cyan-700 dark:text-cyan-300'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {day.dayLabel}
                  </span>

                  {/* Circular Day Badge */}
                  {day.status === 'completed' && (
                    <div
                      data-testid={`streak-day-badge-${day.dayLabel}`}
                      title={`${day.dayLabel} (${day.dateStr}): Completed ✓`}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-b from-orange-400 to-orange-600 text-white font-black text-sm flex items-center justify-center shadow-md shadow-orange-500/35 border border-orange-300"
                    >
                      ✓
                    </div>
                  )}

                  {day.status === 'today' && (
                    <div
                      data-testid={`streak-day-badge-${day.dayLabel}`}
                      title={`Today (${day.dateStr}): ${completedPillarsCount}/4 Pillars Completed`}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-amber-400 dark:border-cyan-400 bg-amber-500/15 dark:bg-cyan-500/15 text-amber-800 dark:text-cyan-200 font-extrabold text-[11px] flex items-center justify-center shadow-[0_0_12px_rgba(251,191,36,0.5)] ring-2 ring-amber-400/30 dark:ring-cyan-400/30"
                    >
                      {completedPillarsCount}/4
                    </div>
                  )}

                  {day.status === 'missed' && (
                    <div
                      data-testid={`streak-day-badge-${day.dayLabel}`}
                      title={`${day.dayLabel} (${day.dateStr}): Streak Freeze Protected ❄️`}
                      className="streak-freeze-badge w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-cyan-100/80 dark:bg-cyan-950/80 border-2 border-cyan-400 text-cyan-700 dark:text-cyan-200 text-sm flex items-center justify-center"
                    >
                      ❄️
                    </div>
                  )}

                  {day.status === 'future' && (
                    <div
                      data-testid={`streak-day-badge-${day.dayLabel}`}
                      title={`${day.dayLabel} (${day.dateStr}): Upcoming`}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-100/40 dark:bg-slate-800/40 text-slate-400 dark:text-slate-600 text-xs flex items-center justify-center"
                    >
                      •
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Icy Info Banner if a past day in the week was missed */}
          {hasMissedDayInWeek && (
            <div
              data-testid="streak-freeze-banner"
              className="px-3 py-2 rounded-xl bg-cyan-50/90 dark:bg-cyan-950/60 border border-cyan-400/70 dark:border-cyan-500/50 text-cyan-900 dark:text-cyan-200 text-xs font-extrabold font-malayalam flex items-center justify-center gap-1.5 shadow-[0_0_10px_rgba(0,229,255,0.2)]"
            >
              <span>❄️ Streak Freeze / വിട്ടുപോയ ദിവസം സംരക്ഷിച്ചു</span>
            </div>
          )}
        </div>

        {/* 3. 4-Pillar Daily Qualification Checklist */}
        <div
          data-testid="streak-pillars-checklist"
          className="space-y-2"
        >
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 font-malayalam">
              Today’s 4 Required Adhkar Pillars ({completedPillarsCount}/4)
            </span>
            <span className="text-[11px] font-bold text-[#0d5c3a] dark:text-emerald-400 font-malayalam">
              {allFourDoneToday ? '✓ യോഗ്യത നേടി!' : '4 വിഭാഗവും പൂർത്തിയാക്കുക'}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            {pillars.map((pillar) => {
              const prog = categoryProgress[pillar.key] || {
                completed: 0,
                total: 0,
                percent: 0,
                isAllDone: false,
              };
              const isDone = prog.total > 0 && prog.completed === prog.total;

              return (
                <button
                  key={pillar.key}
                  type="button"
                  data-testid={`streak-pillar-${pillar.key}`}
                  onClick={() => {
                    if (onSelectCategory) {
                      onClose();
                      onSelectCategory(pillar.key);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all border cursor-pointer active:scale-99 ${
                    isDone
                      ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-emerald-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                        isDone
                          ? 'bg-orange-500 text-white shadow-2xs'
                          : 'border-2 border-slate-400 dark:border-slate-500 text-slate-400'
                      }`}
                    >
                      {isDone ? '✓' : '○'}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-extrabold font-malayalam truncate">
                        {pillar.label}
                      </div>
                      <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 font-malayalam truncate">
                        {pillar.subLabel}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`font-mono text-xs font-extrabold px-2 py-0.5 rounded-lg ${
                        isDone
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {prog.completed}/{prog.total}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Bottom Emerald Green "തുടരുക / Continue" Button */}
        <div className="pt-1">
          <button
            type="button"
            id="closeStreakModalBtn"
            data-testid="streak-continue-btn"
            onClick={onClose}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#0d5c3a] via-[#115e59] to-[#064e3b] hover:from-[#064e3b] hover:to-[#0d5c3a] text-white font-extrabold text-sm shadow-lg shadow-emerald-900/25 transition-all cursor-pointer active:scale-98 font-malayalam"
          >
            തുടരുക / Continue
          </button>
        </div>
      </div>
    </div>
  );
};
