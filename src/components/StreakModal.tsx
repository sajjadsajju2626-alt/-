import React from 'react';
import { X, Flame, Trophy, CheckCircle2, Clock, Sparkles, ShieldCheck } from 'lucide-react';
import { AdhkarCategory, ProgressSummary } from '../types/adhkar.ts';

interface StreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStreak: number;
  bestStreak: number;
  completedToday: boolean;
  categoryProgress: Record<AdhkarCategory, ProgressSummary>;
  freezeTokens?: number;
  canUseFreeze?: boolean;
  onUseFreeze?: () => void;
}

export const StreakModal: React.FC<StreakModalProps> = ({
  isOpen,
  onClose,
  currentStreak,
  bestStreak,
  completedToday,
  categoryProgress,
  freezeTokens = 1,
  canUseFreeze = false,
  onUseFreeze,
}) => {
  if (!isOpen) return null;

  const categories = [
    { key: 'morning' as AdhkarCategory, label: 'Morning Adhkar', arabic: 'أذكار الصباح' },
    { key: 'evening' as AdhkarCategory, label: 'Evening Adhkar', arabic: 'أذكار المساء' },
    { key: 'prayer' as AdhkarCategory, label: 'After Prayer', arabic: 'بعد الصلاة' },
    { key: 'sleep' as AdhkarCategory, label: 'Night & Sleep', arabic: 'أذكار النوم' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="streak-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-teal-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h2 id="streak-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
              Daily Remembrance Streak
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close streak details"
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Flame & Number Banner */}
        <div className="text-center py-5">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center shadow-lg shadow-amber-500/30 mb-3 text-white">
            <Flame className="w-10 h-10 fill-white" />
          </div>

          <div className="flex items-baseline justify-center gap-1.5">
            <span className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono">
              {currentStreak}
            </span>
            <span className="text-base font-bold text-amber-600 dark:text-amber-400">
              {currentStreak === 1 ? 'Day' : 'Days'}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {completedToday
              ? '🎉 Today’s streak is locked in! Keep the momentum alive.'
              : currentStreak > 0
              ? '⚡ Complete any category today to extend your streak!'
              : '🌟 Complete any full category today to begin your streak!'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Current Streak
            </div>
            <div className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-0.5">
              {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
              <Trophy className="w-3 h-3 text-amber-500" />
              <span>Best Streak</span>
            </div>
            <div className="text-xl font-bold font-mono text-slate-800 dark:text-slate-200 mt-0.5">
              {bestStreak} {bestStreak === 1 ? 'day' : 'days'}
            </div>
          </div>
        </div>

        {/* Streak Freeze Grace Period Card */}
        <div className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-blue-50/80 to-teal-50/80 dark:from-slate-800/80 dark:to-teal-950/40 border border-blue-200/60 dark:border-blue-900/40">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
              <span>Streak Freeze Grace</span>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-300">
              {freezeTokens > 0 ? '🛡️ 1 Token Active' : '0 Available'}
            </span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            1 free weekly freeze token protects your streak if a busy day is missed. Automatically replenishes every 7 days.
          </p>
          {canUseFreeze && onUseFreeze && (
            <button
              onClick={onUseFreeze}
              className="mt-2 w-full py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              Use Freeze Token to Protect Yesterday
            </button>
          )}
        </div>

        {/* Today's Categories Completion Checklist */}
        <div className="mb-4">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Today’s Category Progress
          </div>
          <div className="space-y-1.5">
            {categories.map((cat) => {
              const prog = categoryProgress[cat.key];
              const isDone = prog.total > 0 && prog.completed === prog.total;
              return (
                <div
                  key={cat.key}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors border ${
                    isDone
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    )}
                    <span className="font-medium">{cat.label}</span>
                  </div>
                  <span className="font-mono text-[11px]">
                    {prog.completed}/{prog.total}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Inspirational Hadith */}
        <div className="p-3 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 text-[11px] leading-relaxed text-amber-900 dark:text-amber-200">
          <div className="font-semibold flex items-center gap-1 mb-0.5">
            <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            <span>Consistency in Remembrance</span>
          </div>
          <div>
            “The most beloved deeds to Allah are those that are most consistent, even if they are small.” (Sahih al-Bukhari)
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-4">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-teal-700 hover:bg-teal-600 text-white rounded-xl font-bold text-xs shadow-md transition-colors cursor-pointer"
          >
            Keep Going
          </button>
        </div>
      </div>
    </div>
  );
};
