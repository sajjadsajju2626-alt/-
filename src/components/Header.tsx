import React from 'react';
import { Settings, Volume2, VolumeX, Moon, Sun, CheckCircle2, Flame } from 'lucide-react';
import { TabKey, ProgressSummary, ThemeMode } from '../types/adhkar.ts';

interface HeaderProps {
  activeTab: TabKey;
  activeCategoryName: string;
  arabicCategoryName: string;
  progress: ProgressSummary;
  timeHint: string;
  soundEnabled: boolean;
  onToggleSound: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  remindersEnabled?: boolean;
  currentStreak: number;
  completedToday: boolean;
  isInstalled?: boolean;
  onOpenStreak: () => void;
  onOpenSettings: () => void;
  onTriggerBellNotification?: () => void;
  onResetActiveTab?: () => void;
  onOpenExportSingleFile?: () => void;
  onOpenInstallModal?: () => void;
  onOpenShare?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  activeCategoryName,
  arabicCategoryName,
  progress,
  timeHint,
  soundEnabled,
  onToggleSound,
  theme,
  onToggleTheme,
  currentStreak,
  completedToday,
  onOpenStreak,
  onOpenSettings,
}) => {
  const isTasbih = activeTab === 'tasbih';

  return (
    <header className="sticky top-0 z-30 bg-gradient-to-b from-[#064e3b] via-[#0d5c3a] to-[#115e59] dark:from-[#042f2e] dark:via-[#064e3b] dark:to-[#0d5c3a] text-white shadow-lg rounded-b-[2rem] border-b border-emerald-400/20">
      <div className="max-w-xl mx-auto px-4 pt-3.5 pb-5">
        {/* Top Row: Left Streak Badge, Right 3 Action Icons */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onOpenStreak}
              aria-label={`Daily streak: ${currentStreak} days. ${
                completedToday ? 'Completed today!' : 'Complete any category today to extend.'
              } Click to view streak details.`}
              title="View Daily Streak"
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold transition-all border cursor-pointer select-none active:scale-95 ${
                completedToday
                  ? 'bg-amber-400 text-[#064e3b] border-amber-300 shadow-sm'
                  : 'bg-white/15 hover:bg-white/25 text-white border-white/25 backdrop-blur-xs'
              }`}
            >
              <Flame
                className={`w-3.5 h-3.5 ${
                  completedToday ? 'fill-[#064e3b] text-[#064e3b]' : 'fill-amber-300 text-amber-300'
                }`}
              />
              <span className="font-mono text-xs">{currentStreak}d</span>
            </button>
          </div>

          {/* Quick Action Icons: Sound Toggle, Day/Night Theme Toggle, Settings */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onToggleSound}
              aria-label={soundEnabled ? 'Mute tap sound' : 'Enable tap sound'}
              title={soundEnabled ? 'Sound Enabled' : 'Sound Muted'}
              className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-white/70" />}
            </button>

            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={theme === 'emerald' ? 'Switch to Dark Theme' : 'Switch to Light Emerald Theme'}
              title="Toggle Theme"
              className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
            >
              {theme === 'emerald' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-300" />}
            </button>

            <button
              type="button"
              onClick={onOpenSettings}
              aria-label="Open Display and Reading Settings"
              title="Settings"
              className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Centered White Title / Calligraphy Banner */}
        <div className="text-center mt-1 mb-1">
          <h1 className="app-arabic-title" dir="rtl">مُدَاوَمَةٌ</h1>
          <div className="text-xs sm:text-sm font-extrabold tracking-tight text-white/95 flex items-center justify-center gap-1.5 mt-1">
            <span>Daily Adhkar</span>
            <span className="opacity-75">•</span>
            <span className="font-malayalam">പ്രതിദിന ദിക്റുകൾ</span>
          </div>
          <p className="text-xs font-semibold text-emerald-100 flex items-center justify-center gap-1.5 mt-0.5">
            <span>{activeCategoryName}</span>
            <span className="opacity-60">•</span>
            <span className="font-arabic text-sm">{arabicCategoryName}</span>
          </p>
        </div>

        {/* Category Progress Bar (only for list categories) */}
        {!isTasbih && activeTab !== 'progress' && (
          <div className="mt-3 pt-2.5 border-t border-white/20">
            <div className="flex items-center justify-between text-xs text-white mb-1.5">
              <span className="flex items-center gap-1.5 font-bold">
                {progress.isAllDone ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300 drop-shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
                    <span className="text-emerald-200 font-extrabold">
                      Completed All Today! • <span className="font-malayalam font-black">പൂർത്തിയായി! 🔥</span>
                    </span>
                  </>
                ) : (
                  <span>
                    Progress: {progress.completed} of {progress.total} Completed
                  </span>
                )}
              </span>
              <span className={`font-black ${progress.isAllDone ? 'text-emerald-300' : 'text-amber-300'}`}>
                {progress.percent}%
              </span>
            </div>
            <div className="w-full bg-emerald-950/50 h-2 rounded-full overflow-hidden p-0.5">
              <div
                data-testid="active-section-progress-bar"
                className={`h-full rounded-full transition-all duration-300 ${
                  progress.isAllDone
                    ? 'bg-emerald-400 animate-pulse shadow-[0_0_12px_rgba(52,211,153,0.95)]'
                    : 'bg-amber-300'
                }`}
                style={{ width: `${Math.max(progress.percent, 0)}%` }}
              />
            </div>
            <div className="text-[11px] text-emerald-100/90 mt-1 font-medium text-center">{timeHint}</div>
          </div>
        )}
      </div>
    </header>
  );
};
