import React from 'react';
import {
  Sunrise,
  Sun,
  Sunset,
  Moon,
  Clock,
  CheckCircle2,
  Headphones,
  ArrowRight,
  Sparkles,
  Shield,
} from 'lucide-react';
import { TabKey, ProgressSummary, ThemeMode } from '../types/adhkar.ts';
import { getTimeBasedRecommendation, TimeBasedRecommendation } from '../utils/streak-utils.ts';

interface TimeRecommendationBannerProps {
  currentTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  categoryProgress: Record<string, ProgressSummary>;
  overallProgressPercent: number;
  onStartAutoplayAll?: () => void;
  isAutoplayActive?: boolean;
  theme: ThemeMode;
}

export const TimeRecommendationBanner: React.FC<TimeRecommendationBannerProps> = ({
  currentTab,
  onSelectTab,
  categoryProgress,
  overallProgressPercent,
  onStartAutoplayAll,
  isAutoplayActive = false,
  theme,
}) => {
  const currentHour = new Date().getHours();
  const recommendation: TimeBasedRecommendation = getTimeBasedRecommendation(currentHour);

  const targetCategoryProg = categoryProgress[recommendation.targetTab] || {
    completed: 0,
    total: 0,
    percent: 0,
    isAllDone: false,
  };

  const isCurrentTabRecommended = currentTab === recommendation.targetTab;
  const isDark = theme === 'dark' || theme === 'midnight';

  const renderIcon = () => {
    switch (recommendation.iconName) {
      case 'sunrise':
        return <Sunrise className="w-5 h-5 text-amber-500 fill-amber-500/20" />;
      case 'sun':
        return <Sun className="w-5 h-5 text-amber-500 fill-amber-500/20" />;
      case 'sunset':
        return <Sunset className="w-5 h-5 text-orange-500 fill-orange-500/20" />;
      case 'moon':
      default:
        return <Moon className="w-5 h-5 text-indigo-400 fill-indigo-400/20" />;
    }
  };

  return (
    <section
      aria-label="Time-Based Recommended Adhkar"
      className={`rounded-2xl p-4 mb-4 border transition-all duration-200 shadow-sm ${
        isDark
          ? 'bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border-teal-800/40 text-slate-100'
          : 'bg-gradient-to-r from-teal-50/90 via-emerald-50/80 to-amber-50/60 border-teal-200/90 text-slate-900'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Title, Arabic & Context */}
        <div className="flex items-start gap-3">
          <div
            className={`p-2.5 rounded-2xl flex-shrink-0 flex items-center justify-center border ${
              isDark
                ? 'bg-slate-800/80 border-slate-700/80'
                : 'bg-white border-teal-100 shadow-xs'
            }`}
          >
            {renderIcon()}
          </div>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black tracking-wider uppercase bg-teal-800 text-white shadow-xs">
                Time-Based Recommendation
              </span>
              <span className="text-[11px] text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Optimal Remembrance Period</span>
              </span>
            </div>

            <h2 className="text-sm sm:text-base font-extrabold text-slate-950 dark:text-white flex items-center gap-2 mt-1">
              <span>{recommendation.title}</span>
              <span className="font-arabic text-base text-teal-950 dark:text-teal-300 font-bold">
                {recommendation.arabicTitle}
              </span>
            </h2>

            <p className="text-xs text-slate-900 dark:text-slate-200 mt-0.5 leading-relaxed font-medium line-clamp-2">
              {recommendation.description}
            </p>
          </div>
        </div>

        {/* Quick Action Buttons: Recite or Autoplay */}
        <div className="flex items-center gap-2 self-start sm:self-center flex-shrink-0">
          {!isCurrentTabRecommended ? (
            <button
              onClick={() => onSelectTab(recommendation.targetTab)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-teal-800 hover:bg-teal-700 text-white shadow-sm transition-all cursor-pointer flex items-center gap-1.5 active:scale-98"
            >
              <span>Switch to {recommendation.title.split(' ')[0]}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-950 dark:text-emerald-300 px-2.5 py-1.5 rounded-xl bg-emerald-100 border border-emerald-300 dark:bg-emerald-500/10 dark:border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              <span>Current Section</span>
            </div>
          )}

          {onStartAutoplayAll && (
            <button
              onClick={onStartAutoplayAll}
              aria-label={isAutoplayActive ? 'Autoplay All active' : 'Start hands-free Autoplay All recitation'}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-98 ${
                isAutoplayActive
                  ? 'bg-amber-500 text-slate-950 font-black animate-pulse'
                  : 'bg-emerald-800/15 hover:bg-emerald-800/25 text-emerald-900 dark:text-emerald-200 border border-emerald-600/30'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>{isAutoplayActive ? 'Playing All...' : 'Autoplay All'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Bars: Recommended Section & Overall Daily Progress */}
      <div className="mt-3 pt-3 border-t border-slate-300 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Recommended Category Progress (0-100%) */}
        <div>
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="font-bold text-slate-950 dark:text-slate-200">
              {recommendation.title.split(' ')[0]} Adhkar Progress
            </span>
            <span className="font-mono font-black text-teal-900 dark:text-teal-300">
              {targetCategoryProg.completed} / {targetCategoryProg.total} ({targetCategoryProg.percent}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 transition-all duration-300"
              style={{ width: `${targetCategoryProg.percent}%` }}
            />
          </div>
        </div>

        {/* Overall Daily Devotional Adhkar Progress (0-100%) */}
        <div>
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="font-bold text-slate-950 dark:text-slate-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-500" />
              <span>Daily Adhkar Completion</span>
            </span>
            <span className="font-mono font-black text-amber-900 dark:text-amber-400">
              {overallProgressPercent}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
              style={{ width: `${overallProgressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
