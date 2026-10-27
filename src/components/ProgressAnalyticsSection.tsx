import React, { useState } from 'react';
import { Flame, Calendar, TrendingUp, Award, CheckCircle2, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import {
  ProgressHistoryMap,
  getLast7DaysWeeklySummary,
  getMonthlyCalendarGrid,
  getOverallProgressStats,
  formatDateKey,
  parseDateKey,
} from '../utils/progress-history-utils.ts';

interface ProgressAnalyticsSectionProps {
  history: ProgressHistoryMap;
  isDark: boolean;
  todayStr?: string;
  currentStreak?: number;
  bestStreak?: number;
}

export const ProgressAnalyticsSection: React.FC<ProgressAnalyticsSectionProps> = ({
  history,
  isDark,
  todayStr = formatDateKey(new Date()),
  currentStreak = 0,
  bestStreak = 0,
}) => {
  const baseDate = parseDateKey(todayStr);
  const [viewYear, setViewYear] = useState<number>(baseDate.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(baseDate.getMonth());
  const [selectedDateKey, setSelectedDateKey] = useState<string>(todayStr);

  const summaryStats = getOverallProgressStats(history, currentStreak, bestStreak);
  const weeklySummary = getLast7DaysWeeklySummary(history, todayStr);
  const monthlySummary = getMonthlyCalendarGrid(history, viewYear, viewMonth, todayStr);

  const monthNamesMl = [
    'ജനുവരി', 'ഫെബ്രുവരി', 'മാർച്ച്', 'ഏപ്രിൽ', 'മേയ്', 'ജൂൺ',
    'ജൂലൈ', 'ഓഗസ്റ്റ്', 'സെപ്റ്റംബർ', 'ഒക്ടോബർ', 'നവംബർ', 'ഡിസംബർ'
  ];

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const selectedEntry = history[selectedDateKey];

  // Heatmap cell color-graded from dark teal (0%) to bright emerald green (100%)
  const getHeatmapCellStyle = (level: 0 | 1 | 2 | 3 | 4, isSelected: boolean, isToday: boolean) => {
    const baseClasses = 'relative flex flex-col items-center justify-center rounded-xl transition-all duration-200 cursor-pointer select-none ';
    const ringClass = isSelected
      ? isDark
        ? 'ring-2 ring-amber-400 scale-[1.04] z-10'
        : 'ring-2 ring-slate-950 scale-[1.04] z-10'
      : isToday
        ? 'ring-2 ring-emerald-300'
        : '';

    switch (level) {
      case 0:
        return `${baseClasses} ${ringClass} bg-teal-950 text-teal-100 border border-teal-900/80 hover:bg-teal-900`;
      case 1:
        return `${baseClasses} ${ringClass} bg-teal-800 text-white border border-teal-700 hover:bg-teal-700`;
      case 2:
        return `${baseClasses} ${ringClass} bg-teal-600 text-white border border-teal-500 hover:bg-teal-500`;
      case 3:
        return `${baseClasses} ${ringClass} bg-emerald-600 text-white border border-emerald-500 hover:bg-emerald-500`;
      case 4:
        return `${baseClasses} ${ringClass} bg-emerald-400 text-slate-950 font-black border border-emerald-300 shadow-sm shadow-emerald-500/30 hover:bg-emerald-300`;
    }
  };

  return (
    <section
      id="progress-analytics-section"
      data-testid="progress-analytics-section"
      className={`rounded-2xl p-4 sm:p-5 border transition-colors ${
        isDark
          ? 'bg-slate-800/95 border-slate-700 text-slate-100 shadow-lg'
          : 'bg-white border-slate-300 text-black shadow-md'
      }`}
    >
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-300 dark:border-slate-700">
        <div className="flex items-center gap-2.5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isDark
              ? 'bg-emerald-950/90 text-emerald-400 border border-emerald-700/60'
              : 'bg-emerald-100 text-emerald-950 border border-emerald-400'
          }`}>
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-base sm:text-lg font-black tracking-tight ${
              isDark ? 'text-white' : 'text-black'
            }`}>
              പുരോഗതി വിലയിരുത്തൽ • Progress Tracker
            </h2>
            <p className={`text-xs font-bold ${
              isDark ? 'text-slate-300' : 'text-slate-900'
            }`}>
              പ്രതിവാര & പ്രതിമാസ ദിക്ർ കണക്കുകൾ (Weekly & Monthly Analytics)
            </p>
          </div>
        </div>

        <div
          data-testid="weekly-streak-pill"
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border ${
            isDark
              ? 'bg-amber-950/80 text-amber-300 border-amber-700/60'
              : 'bg-amber-100 text-amber-950 border-amber-400'
          }`}
        >
          <Flame className={`w-4 h-4 ${isDark ? 'text-amber-400 fill-amber-400' : 'text-orange-600 fill-orange-500'}`} />
          <span>🔥 {summaryStats.currentStreak} Day Streak</span>
        </div>
      </div>

      {/* 1. Summary Stats Card (4 KPI Grid) */}
      <div
        data-testid="summary-stats-card"
        className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5"
      >
        <div className={`p-3 rounded-xl border ${
          isDark
            ? 'bg-slate-900/90 border-slate-700/80'
            : 'bg-slate-100 border-slate-300'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className={`text-[11px] font-extrabold uppercase tracking-wider ${
              isDark ? 'text-slate-300' : 'text-slate-900'
            }`}>
              Total Recitations
            </span>
            <Sparkles className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`} />
          </div>
          <div
            data-testid="stat-total-recitations"
            className={`text-xl sm:text-2xl font-black tabular-nums ${
              isDark ? 'text-white' : 'text-black'
            }`}
          >
            {summaryStats.totalRecitations.toLocaleString()}
          </div>
          <div className={`text-[11px] font-bold mt-0.5 ${
            isDark ? 'text-emerald-300' : 'text-emerald-950'
          }`}>
            ആകെ ചൊല്ലിയവ
          </div>
        </div>

        <div className={`p-3 rounded-xl border ${
          isDark
            ? 'bg-slate-900/90 border-slate-700/80'
            : 'bg-slate-100 border-slate-300'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className={`text-[11px] font-extrabold uppercase tracking-wider ${
              isDark ? 'text-slate-300' : 'text-slate-900'
            }`}>
              Active Days
            </span>
            <Calendar className={`w-4 h-4 ${isDark ? 'text-teal-400' : 'text-teal-800'}`} />
          </div>
          <div
            data-testid="stat-active-days"
            className={`text-xl sm:text-2xl font-black tabular-nums ${
              isDark ? 'text-white' : 'text-black'
            }`}
          >
            {summaryStats.activeDays}
          </div>
          <div className={`text-[11px] font-bold mt-0.5 ${
            isDark ? 'text-teal-300' : 'text-teal-950'
          }`}>
            സജീവ ദിനങ്ങൾ
          </div>
        </div>

        <div className={`p-3 rounded-xl border ${
          isDark
            ? 'bg-slate-900/90 border-slate-700/80'
            : 'bg-slate-100 border-slate-300'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className={`text-[11px] font-extrabold uppercase tracking-wider ${
              isDark ? 'text-slate-300' : 'text-slate-900'
            }`}>
              Best Streak
            </span>
            <Award className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-amber-800'}`} />
          </div>
          <div
            data-testid="stat-best-streak"
            className={`text-xl sm:text-2xl font-black tabular-nums ${
              isDark ? 'text-white' : 'text-black'
            }`}
          >
            {summaryStats.bestStreak} <span className="text-xs font-extrabold">days</span>
          </div>
          <div className={`text-[11px] font-bold mt-0.5 ${
            isDark ? 'text-amber-300' : 'text-amber-950'
          }`}>
            മികച്ച തുടർച്ച
          </div>
        </div>

        <div className={`p-3 rounded-xl border ${
          isDark
            ? 'bg-slate-900/90 border-slate-700/80'
            : 'bg-slate-100 border-slate-300'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className={`text-[11px] font-extrabold uppercase tracking-wider ${
              isDark ? 'text-slate-300' : 'text-slate-900'
            }`}>
              Current Streak
            </span>
            <Flame className={`w-4 h-4 ${isDark ? 'text-orange-400 fill-orange-400' : 'text-orange-700 fill-orange-500'}`} />
          </div>
          <div
            data-testid="stat-current-streak"
            className={`text-xl sm:text-2xl font-black tabular-nums ${
              isDark ? 'text-white' : 'text-black'
            }`}
          >
            {summaryStats.currentStreak} <span className="text-xs font-extrabold">days</span>
          </div>
          <div className={`text-[11px] font-bold mt-0.5 ${
            isDark ? 'text-orange-300' : 'text-orange-950'
          }`}>
            നിലവിലെ തുടർച്ച
          </div>
        </div>
      </div>

      {/* 2. Weekly Tracker (Last 7 Days Pill/Circle Indicators) */}
      <div
        data-testid="weekly-tracker-card"
        className={`p-3.5 sm:p-4 rounded-xl border mb-5 ${
          isDark
            ? 'bg-slate-900/75 border-slate-700'
            : 'bg-slate-50 border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-black'}`}>
              Weekly Tracker • കഴിഞ്ഞ 7 ദിവസങ്ങൾ
            </h3>
            <p className={`text-[11px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>
              ദിവസേനയുള്ള പൂർത്തീകരണ ശതമാനം (Mon–Sun)
            </p>
          </div>
          <div
            data-testid="weekly-average-badge"
            className={`px-2.5 py-1 rounded-lg text-xs font-black border ${
              isDark
                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-700'
                : 'bg-emerald-100 text-emerald-950 border-emerald-400'
            }`}
          >
            Weekly Avg: {weeklySummary.weeklyAverage}%
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {weeklySummary.days.map((day) => {
            const isSelected = selectedDateKey === day.date;
            const isComplete = day.percent === 100;
            const hasProgress = day.percent > 0;

            return (
              <button
                key={day.date}
                type="button"
                data-testid={`weekly-day-${day.date}`}
                onClick={() => setSelectedDateKey(day.date)}
                className={`flex flex-col items-center justify-between py-2 px-1 rounded-xl border transition-all ${
                  isSelected
                    ? isDark
                      ? 'bg-emerald-950/90 border-amber-400 ring-2 ring-amber-400/40'
                      : 'bg-emerald-100 border-slate-950 ring-2 ring-slate-950/20'
                    : day.isToday
                      ? isDark
                        ? 'bg-slate-800 border-emerald-500'
                        : 'bg-white border-emerald-700'
                      : isDark
                        ? 'bg-slate-800/70 border-slate-700 hover:bg-slate-800'
                        : 'bg-white border-slate-300 hover:bg-slate-100'
                }`}
              >
                <span className={`text-[10px] sm:text-xs font-black uppercase ${
                  isDark ? 'text-slate-200' : 'text-black'
                }`}>
                  {day.dayLabel}
                </span>

                {/* Circle indicator */}
                <div className={`my-1.5 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[11px] font-black tabular-nums border-2 transition-all ${
                  isComplete
                    ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow-sm shadow-emerald-500/40'
                    : hasProgress
                      ? isDark
                        ? 'bg-teal-900 text-emerald-200 border-emerald-500'
                        : 'bg-teal-700 text-white border-teal-900'
                      : isDark
                        ? 'bg-slate-900 text-slate-300 border-slate-700'
                        : 'bg-slate-200 text-black border-slate-400'
                }`}>
                  {isComplete ? (
                    <CheckCircle2 className="w-5 h-5 stroke-[2.6]" />
                  ) : (
                    <span>{day.percent}%</span>
                  )}
                </div>

                <span className={`text-[10px] font-extrabold tabular-nums ${
                  isDark ? 'text-slate-300' : 'text-black'
                }`}>
                  {day.dayNumber}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Monthly Calendar Heatmap Grid */}
      <div
        data-testid="monthly-calendar-card"
        className={`p-3.5 sm:p-4 rounded-xl border ${
          isDark
            ? 'bg-slate-900/75 border-slate-700'
            : 'bg-slate-50 border-slate-300'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div>
            <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-black'}`}>
              Monthly Heatmap • പ്രതിമാസ കലണ്ടർ
            </h3>
            <p className={`text-[11px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>
              {monthNamesMl[viewMonth]} {viewYear} ({monthlySummary.monthLabel})
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrevMonth}
              aria-label="Previous Month"
              className={`p-1.5 rounded-lg border transition-colors ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                  : 'bg-white border-slate-300 text-black hover:bg-slate-200'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className={`text-xs font-black px-2 tabular-nums ${
              isDark ? 'text-white' : 'text-black'
            }`}>
              {monthlySummary.monthLabel}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              aria-label="Next Month"
              className={`p-1.5 rounded-lg border transition-colors ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                  : 'bg-white border-slate-300 text-black hover:bg-slate-200'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Weekday Headers (Mon - Sun) */}
        <div className="grid grid-cols-7 gap-1.5 mb-1.5 text-center">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
            <div
              key={d}
              className={`text-[10px] font-black uppercase tracking-wider ${
                isDark ? 'text-slate-300' : 'text-black'
              }`}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Heatmap Cells */}
        <div
          data-testid="monthly-heatmap-grid"
          className="grid grid-cols-7 gap-1.5"
        >
          {Array.from({ length: monthlySummary.firstDayOffset }).map((_, idx) => (
            <div
              key={`empty-${idx}`}
              className="h-10 sm:h-11 rounded-xl opacity-0 pointer-events-none"
            />
          ))}
          {monthlySummary.cells.map((cell) => {
            const isSelected = selectedDateKey === cell.date;
            return (
              <button
                key={cell.date}
                type="button"
                data-testid={`heatmap-cell-${cell.date}`}
                data-intensity={cell.intensityLevel}
                onClick={() => setSelectedDateKey(cell.date)}
                title={`${cell.date}: ${cell.percent}%`}
                className={`h-10 sm:h-11 ${getHeatmapCellStyle(cell.intensityLevel, isSelected, cell.isToday)}`}
              >
                <span className="text-xs font-black leading-none tabular-nums">
                  {cell.dayOfMonth}
                </span>
                <span className="text-[9px] font-extrabold leading-none mt-0.5 tabular-nums opacity-95">
                  {cell.percent}%
                </span>
              </button>
            );
          })}
        </div>

        {/* Color-grade Legend (Dark Teal 0% -> Bright Emerald Green 100%) */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-300 dark:border-slate-700 text-[11px] font-extrabold">
          <span className={isDark ? 'text-slate-300' : 'text-black'}>
            Color Grade (0% Dark Teal → 100% Bright Emerald):
          </span>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-teal-950 text-teal-100 border border-teal-800 text-[10px] font-black">
              0%
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-teal-800 text-white text-[10px] font-black">
              1-34%
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-teal-600 text-white text-[10px] font-black">
              35-69%
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-black">
              70-99%
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-400 text-slate-950 text-[10px] font-black">
              100%
            </span>
          </div>
        </div>
      </div>

      {/* Selected Day Breakdown Inspector */}
      <div
        data-testid="selected-day-breakdown"
        className={`mt-4 p-3.5 rounded-xl border ${
          isDark
            ? 'bg-slate-900/90 border-slate-700'
            : 'bg-slate-100 border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between mb-2.5">
          <span className={`text-xs font-black ${isDark ? 'text-white' : 'text-black'}`}>
            📅 Day Breakdown ({selectedDateKey === todayStr ? `Today • ${selectedDateKey}` : selectedDateKey})
          </span>
          <span className={`text-xs font-black px-2 py-0.5 rounded-md ${
            (selectedEntry?.overallPercent ?? 0) === 100
              ? 'bg-emerald-500 text-slate-950'
              : isDark
                ? 'bg-slate-800 text-emerald-300 border border-slate-700'
                : 'bg-white text-black border border-slate-300'
          }`}>
            Overall: {selectedEntry?.overallPercent ?? 0}%
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
          {[
            { label: 'Morning', ml: 'രാവിലെ', val: `${selectedEntry?.sections.morning ?? 0}%` },
            { label: 'Evening', ml: 'വൈകുന്നേരം', val: `${selectedEntry?.sections.evening ?? 0}%` },
            { label: 'Prayer', ml: 'നമസ്കാരം', val: `${selectedEntry?.sections.prayer ?? 0}%` },
            { label: 'Sleep', ml: 'ഉറക്കം', val: `${selectedEntry?.sections.sleep ?? 0}%` },
            { label: 'Tasks', ml: 'സുന്നത്തുകൾ', val: `${selectedEntry?.sections.tasks ?? 0}%` },
            { label: 'Tasbih', ml: 'തസ്ബീഹ്', val: `${selectedEntry?.sections.tasbih ?? 0}` },
          ].map((item) => (
            <div
              key={item.label}
              className={`p-2 rounded-lg border ${
                isDark
                  ? 'bg-slate-800/90 border-slate-700 text-white'
                  : 'bg-white border-slate-300 text-black'
              }`}
            >
              <div className={`text-[10px] font-extrabold ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>
                {item.ml}
              </div>
              <div className="text-xs sm:text-sm font-black tabular-nums mt-0.5">
                {item.val}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
