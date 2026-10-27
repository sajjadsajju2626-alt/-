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
          : 'bg-gradient-to-r from-teal-50/95 via-emerald-50/90 to-amber-50/80 border-teal-400 text-black'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Title, Arabic & Context */}
        <div className="flex items-start gap-3">
          <div
            className={`p-2.5 rounded-2xl flex-shrink-0 flex items-center justify-center border ${
              isDark
                ? 'bg-slate-800/80 border-slate-700/80'
                : 'bg-white border-teal-300 shadow-xs'
            }`}
          >
            {renderIcon()}
          </div>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black tracking-wider uppercase bg-teal-900 text-white shadow-xs">
                Time-Based Recommendation
              </span>
              <span className={`text-[11px] font-bold flex items-center gap-1 ${isDark ? 'text-slate-300' : 'text-black'}`}>
                <Clock className="w-3 h-3 stroke-[2.5]" />
                <span>Optimal Remembrance Period</span>
              </span>
            </div>

            <h2 className={`text-sm sm:text-base font-extrabold flex items-center gap-2 mt-1 ${isDark ? 'text-white' : 'text-black'}`}>
              <span>{recommendation.title}</span>
              <span className={`font-arabic text-base font-black ${isDark ? 'text-teal-300' : 'text-black'}`}>
                {recommendation.arabicTitle}
              </span>
            </h2>

            <p className={`text-xs mt-0.5 leading-relaxed line-clamp-2 ${isDark ? 'text-slate-200 font-medium' : 'text-black font-bold'}`}>
              {recommendation.description}
            </p>
          </div>
        </div>

        {/* Quick Action Buttons: Recite or Autoplay */}
        <div className="flex items-center gap-2 self-start sm:self-center flex-shrink-0">
          {!isCurrentTabRecommended ? (
            <button
              onClick={() => onSelectTab(recommendation.targetTab)}
              className="px-3.5 py-2 rounded-xl text-xs font-extrabold bg-teal-900 hover:bg-teal-800 text-white shadow-sm transition-all cursor-pointer flex items-center gap-1.5 active:scale-98"
            >
              <span>Switch to {recommendation.title.split(' ')[0]}</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          ) : (
            <div className={`inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-1.5 rounded-xl border ${
              isDark
                ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20'
                : 'text-black bg-emerald-100 border-emerald-600'
            }`}>
              <CheckCircle2 className={`w-3.5 h-3.5 stroke-[2.5] ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`} />
              <span>Current Section</span>
            </div>
          )}

          {onStartAutoplayAll && (
            <button
              onClick={onStartAutoplayAll}
              aria-label={isAutoplayActive ? 'Autoplay All active' : 'Start hands-free Autoplay All recitation'}
              className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-98 ${
                isAutoplayActive
                  ? 'bg-amber-500 text-black font-black animate-pulse'
                  : isDark
                  ? 'bg-emerald-800/15 hover:bg-emerald-800/25 text-emerald-200 border border-emerald-600/30 font-bold'
                  : 'bg-emerald-100 hover:bg-emerald-200 text-black border-2 border-emerald-700 font-extrabold'
              }`}
            >
              <Headphones className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{isAutoplayActive ? 'Playing All...' : 'Autoplay All'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Bars: Recommended Section & Overall Daily Progress */}
      <div className={`mt-3 pt-3 border-t grid grid-cols-1 sm:grid-cols-2 gap-3 ${isDark ? 'border-slate-800' : 'border-teal-300'}`}>
        {/* Recommended Category Progress (0-100%) */}
        <div>
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className={`font-extrabold ${isDark ? 'text-slate-200' : 'text-black'}`}>
              {recommendation.title.split(' ')[0]} Adhkar Progress
            </span>
            <span className={`font-mono font-black ${isDark ? 'text-teal-300' : 'text-black'}`}>
              {targetCategoryProg.completed} / {targetCategoryProg.total} ({targetCategoryProg.percent}%)
            </span>
          </div>
          <div className={`w-full h-2.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-300'}`}>
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                targetCategoryProg.percent === 100
                  ? 'bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.9)]'
                  : 'bg-gradient-to-r from-teal-700 to-emerald-600'
              }`}
              style={{ width: `${targetCategoryProg.percent}%` }}
            />
          </div>
        </div>

        {/* Overall Daily Devotional Adhkar Progress (0-100%) */}
        <div>
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className={`font-extrabold flex items-center gap-1 ${isDark ? 'text-slate-200' : 'text-black'}`}>
              <Sparkles className={`w-3 h-3 ${isDark ? 'text-amber-500' : 'text-amber-700'}`} />
              <span>Daily Adhkar Completion</span>
            </span>
            <span className={`font-mono font-black ${isDark ? 'text-amber-400' : 'text-black'}`}>
              {overallProgressPercent}%
            </span>
          </div>
          <div className={`w-full h-2.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-300'}`}>
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                overallProgressPercent === 100
                  ? 'bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.9)]'
                  : 'bg-gradient-to-r from-amber-600 to-orange-600'
              }`}
              style={{ width: `${overallProgressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
