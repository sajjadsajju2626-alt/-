import React from 'react';
import { Sun, Moon, Sparkles, BedDouble, CircleDot, Star, CheckSquare, Flame, CheckCircle2, TrendingUp } from 'lucide-react';
import { TabKey, AdhkarCategory } from '../types/adhkar.ts';

interface TabBarProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  categoryProgress: Record<AdhkarCategory, { completed: number; total: number }>;
  favoritesCount: number;
  favoritesCompletedCount?: number;
  tasksProgress?: { completed: number; total: number };
}

export const TabBar: React.FC<TabBarProps> = ({
  activeTab,
  onTabChange,
  categoryProgress,
  favoritesCount,
  favoritesCompletedCount = 0,
  tasksProgress,
}) => {
  const tabs = [
    {
      id: 'tab-morning',
      key: 'morning' as TabKey,
      label: 'Morning',
      icon: Sun,
      arabic: 'الصباح',
    },
    {
      id: 'tab-evening',
      key: 'evening' as TabKey,
      label: 'Evening',
      icon: Moon,
      arabic: 'المساء',
    },
    {
      id: 'tab-prayer',
      key: 'prayer' as TabKey,
      label: 'Prayer',
      icon: Sparkles,
      arabic: 'الصلاة',
    },
    {
      id: 'tab-sleep',
      key: 'sleep' as TabKey,
      label: 'Sleep',
      icon: BedDouble,
      arabic: 'النوم',
    },
    {
      id: 'tab-tasks',
      key: 'tasks' as TabKey,
      label: 'Tasks',
      icon: CheckSquare,
      arabic: 'المهام',
    },
    {
      id: 'tab-favorites',
      key: 'favorites' as TabKey,
      label: 'Favorites',
      icon: Star,
      arabic: 'المفضلة',
    },
    {
      id: 'tab-tasbih',
      key: 'tasbih' as TabKey,
      label: 'Tasbih',
      icon: CircleDot,
      arabic: 'سبحة',
    },
    {
      id: 'tab-progress',
      key: 'progress' as TabKey,
      label: 'Progress',
      icon: TrendingUp,
      arabic: 'التقدم',
    },
  ];

  return (
    <nav
      className="bg-teal-900 border-b border-teal-800 text-teal-100 overflow-x-auto no-scrollbar"
      aria-label="Adhkar categories"
    >
      <div className="max-w-xl mx-auto flex items-stretch min-w-full">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;
          const isCategory = ['morning', 'evening', 'prayer', 'sleep'].includes(tab.key);
          const progress = isCategory ? categoryProgress[tab.key as AdhkarCategory] : null;
          const isTasksDone =
            tab.key === 'tasks' &&
            tasksProgress &&
            tasksProgress.total > 0 &&
            tasksProgress.completed === tasksProgress.total;
          const isFavoritesDone =
            tab.key === 'favorites' &&
            favoritesCount > 0 &&
            favoritesCompletedCount === favoritesCount;
          const isCategoryDone =
            progress && progress.total > 0 && progress.completed === progress.total;

          const isSectionDone = Boolean(isCategoryDone || isTasksDone || isFavoritesDone);

          return (
            <button
              key={tab.key}
              id={tab.id}
              role="tab"
              aria-selected={isActive}
              data-section-completed={isSectionDone ? 'true' : 'false'}
              onClick={() => onTabChange(tab.key)}
              className={`relative flex-1 min-w-[68px] py-2 px-1 flex flex-col items-center justify-center gap-0.5 transition-all border-b-2 text-center cursor-pointer select-none ${
                isActive
                  ? isSectionDone
                    ? 'border-emerald-400 bg-teal-800/95 text-white font-bold shadow-[inset_0_-8px_16px_rgba(16,185,129,0.25)]'
                    : 'border-amber-400 bg-teal-800/80 text-white font-semibold'
                  : isSectionDone
                  ? 'border-emerald-500/70 bg-teal-900/90 text-emerald-200 hover:text-white hover:bg-teal-800/50 font-semibold'
                  : 'border-transparent text-teal-200 hover:text-white hover:bg-teal-800/40 font-medium'
              }`}
            >
              <div className="flex items-center gap-1">
                {isSectionDone ? (
                  <span
                    data-testid={`tab-flame-icon-${tab.key}`}
                    className="relative inline-flex items-center justify-center w-4 h-4 rounded-full bg-gradient-to-tr from-orange-500 via-amber-400 to-yellow-200 text-slate-950 shadow-[0_0_10px_rgba(251,191,36,0.9)] scale-110 transition-transform animate-pulse"
                  >
                    <Flame className="w-3 h-3 fill-orange-600 text-slate-950" />
                  </span>
                ) : (
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isActive ? 'text-amber-400' : 'text-teal-300'
                    }`}
                  />
                )}
                <span className="text-[11px] sm:text-xs">{tab.label}</span>
              </div>

              {/* Progress counter badge or Arabic subtitle */}
              <div className="text-[10px] leading-none flex items-center justify-center gap-1 mt-0.5">
                {tab.key === 'favorites' ? (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-mono flex items-center gap-1 ${
                      isFavoritesDone
                        ? 'bg-gradient-to-r from-amber-400/30 to-emerald-500/30 text-amber-200 font-black ring-1 ring-amber-300/70 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                        : favoritesCount > 0
                        ? 'bg-amber-400/20 text-amber-300 font-bold'
                        : 'bg-black/20 text-teal-200'
                    }`}
                  >
                    <Star className="w-2 h-2 fill-amber-300 text-amber-300" />
                    <span>{favoritesCount}</span>
                  </span>
                ) : tab.key === 'tasks' && tasksProgress ? (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-mono flex items-center gap-0.5 transition-all ${
                      isTasksDone
                        ? 'bg-gradient-to-r from-orange-500/40 via-amber-400/30 to-emerald-500/40 text-amber-200 font-black ring-1 ring-amber-300/80 shadow-[0_0_10px_rgba(251,191,36,0.65)] scale-105'
                        : 'bg-black/20 text-teal-200'
                    }`}
                  >
                    {isTasksDone && <span className="text-[9px]">🔥</span>}
                    <span>
                      {tasksProgress.completed}/{tasksProgress.total}
                    </span>
                  </span>
                ) : progress ? (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-mono flex items-center gap-0.5 transition-all ${
                      isCategoryDone
                        ? 'bg-gradient-to-r from-orange-500/40 via-amber-400/30 to-emerald-500/40 text-amber-200 font-black ring-1 ring-amber-300/80 shadow-[0_0_10px_rgba(251,191,36,0.65)] scale-105'
                        : 'bg-black/20 text-teal-200'
                    }`}
                  >
                    {isCategoryDone && <span className="text-[9px]">🔥</span>}
                    <span>
                      {progress.completed}/{progress.total}
                    </span>
                  </span>
                ) : (
                  <span className="font-arabic text-[11px] text-teal-300/80">
                    {tab.arabic}
                  </span>
                )}
              </div>

              {/* Glowing Checkmark + Bold 'പൂർത്തിയായി!' Label Below Completed Tab */}
              {isSectionDone && (
                <div
                  data-testid={`tab-completed-label-${tab.key}`}
                  className="mt-0.5 flex items-center justify-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-500/25 border border-emerald-400/70 text-emerald-200 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                >
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-300 stroke-[3]" />
                  <span className="font-malayalam text-[9px] font-black tracking-tight text-emerald-200 leading-none">
                    പൂർത്തിയായി!
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
