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
      circleNum: '①',
      label: 'Morning',
      mlLabel: 'പ്രഭാതം',
      icon: Sun,
      arabic: 'أذكار الصباح',
      subtitle: '25 Contents',
    },
    {
      id: 'tab-evening',
      key: 'evening' as TabKey,
      circleNum: '②',
      label: 'Evening',
      mlLabel: 'പ്രദോഷം',
      icon: Moon,
      arabic: 'أذكار المساء',
      subtitle: '24 Contents',
    },
    {
      id: 'tab-prayer',
      key: 'prayer' as TabKey,
      circleNum: '③',
      label: 'After Prayer',
      mlLabel: 'നമസ്കാരം',
      icon: Sparkles,
      arabic: 'أذكار بعد الصلاة',
      subtitle: '14 Contents',
    },
    {
      id: 'tab-sleep',
      key: 'sleep' as TabKey,
      circleNum: '④',
      label: 'Sleep',
      mlLabel: 'ഉറക്കം',
      icon: BedDouble,
      arabic: 'أذكار النوم',
      subtitle: '11 Contents',
    },
    {
      id: 'tab-tasks',
      key: 'tasks' as TabKey,
      circleNum: '⑤',
      label: 'Tasks',
      mlLabel: 'കർമ്മങ്ങൾ',
      icon: CheckSquare,
      arabic: 'المهام اليومية',
      subtitle: 'Daily Checklist',
    },
    {
      id: 'tab-favorites',
      key: 'favorites' as TabKey,
      circleNum: '⑥',
      label: 'Favorites',
      mlLabel: 'പ്രിയപ്പെട്ടവ',
      icon: Star,
      arabic: 'المفضلة',
      subtitle: 'Saved Items',
    },
    {
      id: 'tab-tasbih',
      key: 'tasbih' as TabKey,
      circleNum: '⑦',
      label: 'Tasbih',
      mlLabel: 'തസ്ബീഹ്',
      icon: CircleDot,
      arabic: 'سبحة إلكترونية',
      subtitle: '33 / 100 Counter',
    },
    {
      id: 'tab-progress',
      key: 'progress' as TabKey,
      circleNum: '⑧',
      label: 'Progress',
      mlLabel: 'പുരോഗതി',
      icon: TrendingUp,
      arabic: 'التقدم الأسبوعي',
      subtitle: 'Weekly & Monthly',
    },
  ];

  return (
    <nav
      className="max-w-xl w-full mx-auto px-4 pt-2 pb-4"
      aria-label="Adhkar categories"
      data-testid="category-grid-section"
    >
      {/* 2-Column Rounded Emerald Green Card Grid */}
      <div className="grid grid-cols-2 gap-3">
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
              className={`relative rounded-2xl p-3.5 text-left text-white transition-all cursor-pointer select-none overflow-hidden min-h-[104px] flex flex-col justify-between active:scale-[0.98] ${
                isActive
                  ? 'bg-[#064e3b] dark:bg-[#064e3b] ring-2 ring-emerald-300 shadow-lg border border-emerald-400/50'
                  : 'bg-[#0d5c3a] hover:bg-[#115e59] dark:bg-[#0d5c3a] dark:hover:bg-[#115e59] shadow-md border border-emerald-500/30 opacity-95'
              }`}
            >
              <div className="flex items-start justify-between gap-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black text-white/95 leading-none">
                    {tab.circleNum}
                  </span>
                  {isSectionDone && (
                    <span
                      data-testid={`tab-flame-icon-${tab.key}`}
                      className="relative inline-flex items-center justify-center w-4 h-4 rounded-full bg-gradient-to-tr from-orange-500 via-amber-400 to-yellow-200 text-slate-950 shadow-[0_0_10px_rgba(251,191,36,0.9)]"
                    >
                      <Flame className="w-3 h-3 fill-orange-600 text-slate-950" />
                    </span>
                  )}
                </div>
                <span className="font-arabic text-xs text-emerald-100 font-bold">
                  {tab.arabic}
                </span>
              </div>

              <div className="pr-8 mt-1">
                <div className="text-sm sm:text-base font-extrabold text-white leading-tight">
                  {tab.label} • <span className="font-malayalam">{tab.mlLabel}</span>
                </div>
                <div className="text-[11px] font-bold text-emerald-100 mt-1 flex items-center gap-1 flex-wrap">
                  {tab.key === 'favorites' ? (
                    <span className="font-mono">
                      ★ {favoritesCount} • {tab.subtitle}
                    </span>
                  ) : tab.key === 'tasks' && tasksProgress ? (
                    <span className="font-mono">
                      {isTasksDone && '🔥 '}
                      {tasksProgress.completed}/{tasksProgress.total} • {tab.subtitle}
                    </span>
                  ) : progress ? (
                    <span className="font-mono">
                      {isCategoryDone && '🔥 '}
                      {progress.completed}/{progress.total} • {progress.total} Contents
                    </span>
                  ) : (
                    <span>{tab.subtitle}</span>
                  )}
                </div>

                {isSectionDone && (
                  <div
                    data-testid={`tab-completed-label-${tab.key}`}
                    className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/30 border border-emerald-300/70 text-emerald-100"
                  >
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-200 stroke-[3]" />
                    <span className="font-malayalam text-[9px] font-black tracking-tight text-emerald-100 leading-none">
                      പൂർത്തിയായി!
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom-Right Line-Art SVG Icon */}
              <Icon className="w-7 h-7 text-emerald-100/80 absolute bottom-2.5 right-2.5 stroke-[1.75] pointer-events-none" />
            </button>
          );
        })}
      </div>
    </nav>
  );
};
