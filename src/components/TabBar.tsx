import React from 'react';
import { Sun, Moon, Sparkles, BedDouble, CircleDot, Star } from 'lucide-react';
import { TabKey, AdhkarCategory } from '../types/adhkar.ts';

interface TabBarProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  categoryProgress: Record<AdhkarCategory, { completed: number; total: number }>;
  favoritesCount: number;
}

export const TabBar: React.FC<TabBarProps> = ({
  activeTab,
  onTabChange,
  categoryProgress,
  favoritesCount,
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
          const isDone =
            progress && progress.total > 0 && progress.completed === progress.total;

          return (
            <button
              key={tab.key}
              id={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onTabChange(tab.key)}
              className={`flex-1 min-w-[65px] py-2 px-1 flex flex-col items-center justify-center gap-1 transition-all border-b-2 text-center cursor-pointer select-none ${
                isActive
                  ? 'border-amber-400 bg-teal-800/80 text-white font-semibold'
                  : 'border-transparent text-teal-200 hover:text-white hover:bg-teal-800/40 font-medium'
              }`}
            >
              <div className="flex items-center gap-1">
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive ? 'text-amber-400' : 'text-teal-300'
                  }`}
                />
                <span className="text-xs">{tab.label}</span>
              </div>

              {/* Progress counter badge or Arabic subtitle */}
              <div className="text-[10px] leading-none opacity-80 flex items-center gap-1">
                {tab.key === 'favorites' ? (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-mono flex items-center gap-1 ${
                      favoritesCount > 0
                        ? 'bg-amber-400/20 text-amber-300 font-bold'
                        : 'bg-black/20 text-teal-200'
                    }`}
                  >
                    <Star className="w-2 h-2 fill-amber-300 text-amber-300" />
                    <span>{favoritesCount}</span>
                  </span>
                ) : progress ? (
                  <span
                    className={`px-1 py-0.5 rounded text-[9px] font-mono ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                        : 'bg-black/20 text-teal-200'
                    }`}
                  >
                    {progress.completed}/{progress.total}
                  </span>
                ) : (
                  <span className="font-arabic text-[11px] text-teal-300/80">
                    {tab.arabic}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
