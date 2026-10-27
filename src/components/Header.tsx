import React from 'react';
import { Settings, RotateCcw, Volume2, VolumeX, Moon, Sun, CheckCircle2, Bell, Flame, Download, Smartphone, Share2 } from 'lucide-react';
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
  remindersEnabled: boolean;
  currentStreak: number;
  completedToday: boolean;
  isInstalled: boolean;
  onOpenStreak: () => void;
  onOpenSettings: () => void;
  onResetActiveTab: () => void;
  onOpenExportSingleFile: () => void;
  onOpenInstallModal: () => void;
  onOpenShare: () => void;
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
  remindersEnabled,
  currentStreak,
  completedToday,
  isInstalled,
  onOpenStreak,
  onOpenSettings,
  onResetActiveTab,
  onOpenExportSingleFile,
  onOpenInstallModal,
  onOpenShare,
}) => {
  const isTasbih = activeTab === 'tasbih';

  return (
    <header className="sticky top-0 z-30 bg-teal-800 text-white shadow-md border-b border-teal-700/60 backdrop-blur-md">
      <div className="max-w-xl mx-auto px-4 py-3.5">
        <div className="flex items-center justify-between gap-2">
          {/* Brand & Title + Daily Streak */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📿</span>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                Daily Adhkar
              </h1>

              {/* Daily Streak Tracker Badge */}
              <button
                type="button"
                onClick={onOpenStreak}
                aria-label={`Daily streak: ${currentStreak} days. ${
                  completedToday ? 'Completed today!' : 'Complete any category today to extend.'
                } Click to view streak details.`}
                title="View Daily Streak"
                className={`ml-1 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold transition-all border cursor-pointer select-none active:scale-95 ${
                  completedToday
                    ? 'bg-amber-400 text-teal-950 border-amber-300 shadow-sm shadow-amber-400/40'
                    : 'bg-teal-900/90 text-amber-300 border-teal-700/80 hover:bg-teal-950'
                }`}
              >
                <Flame
                  className={`w-3.5 h-3.5 ${
                    completedToday ? 'fill-teal-950 text-teal-950' : 'fill-amber-400 text-amber-400'
                  }`}
                />
                <span className="font-mono text-xs">{currentStreak}d</span>
              </button>
            </div>
            <p className="text-xs text-teal-200/90 flex items-center gap-1 mt-0.5">
              <span>{activeCategoryName}</span>
              <span className="opacity-60">•</span>
              <span className="font-arabic text-sm">{arabicCategoryName}</span>
            </p>
          </div>

          {/* Quick Action Icons */}
          <div className="flex items-center gap-1">
            <button
              onClick={onToggleSound}
              aria-label={soundEnabled ? 'Mute tap sound' : 'Enable tap sound'}
              title={soundEnabled ? 'Sound Enabled' : 'Sound Muted'}
              className="p-2 rounded-lg text-teal-100 hover:text-white hover:bg-teal-700/60 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-teal-300/60" />}
            </button>

            <button
              onClick={onToggleTheme}
              aria-label={theme === 'emerald' ? 'Switch to Dark Theme' : 'Switch to Light Emerald Theme'}
              title="Toggle Theme"
              className="p-2 rounded-lg text-teal-100 hover:text-white hover:bg-teal-700/60 transition-colors"
            >
              {theme === 'emerald' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-300" />}
            </button>

            <button
              onClick={onOpenSettings}
              aria-label={remindersEnabled ? 'Adhkar reminders active. Open reminder settings' : 'Enable daily adhkar reminders'}
              title={remindersEnabled ? 'Daily Reminders Active' : 'Setup Daily Reminders'}
              className="p-2 rounded-lg text-teal-100 hover:text-white hover:bg-teal-700/60 transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              {remindersEnabled && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-teal-800" />
              )}
            </button>

            {!isTasbih && (
              <button
                onClick={onResetActiveTab}
                aria-label="Reset counters for this category"
                title="Reset Category Counters"
                className="p-2 rounded-lg text-teal-100 hover:text-white hover:bg-teal-700/60 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onOpenExportSingleFile}
              aria-label="Download or copy standalone single-file HTML version for offline use"
              title="Get Single-File Offline Version"
              className="p-2 rounded-lg text-teal-100 hover:text-white hover:bg-teal-700/60 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>

            {!isInstalled && (
              <button
                onClick={onOpenInstallModal}
                aria-label="Add Daily Adhkar to Home Screen"
                title="Add to Home Screen"
                className="p-2 rounded-lg text-amber-300 hover:text-white hover:bg-teal-700/60 transition-colors cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onOpenShare}
              aria-label="Share Daily Adhkar with family and friends"
              title="Share App (مشاركة التطبيق)"
              className="p-2 rounded-lg text-emerald-300 hover:text-white hover:bg-teal-700/60 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenSettings}
              aria-label="Open Display and Reading Settings"
              title="Settings"
              className="p-2 rounded-lg text-teal-100 hover:text-white hover:bg-teal-700/60 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Progress Bar (only for list categories) */}
        {!isTasbih && activeTab !== 'progress' && (
          <div className="mt-2.5 pt-2 border-t border-teal-700/40">
            <div className="flex items-center justify-between text-xs text-teal-100 mb-1.5">
              <span className="flex items-center gap-1.5 font-medium">
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
              <span className={`font-bold ${progress.isAllDone ? 'text-emerald-300 font-black' : 'text-amber-300'}`}>
                {progress.percent}%
              </span>
            </div>
            <div className="w-full bg-teal-950/50 h-2.5 rounded-full overflow-hidden p-0.5">
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
            <div className="text-[11px] text-teal-200/80 mt-1 italic">{timeHint}</div>
          </div>
        )}
      </div>
    </header>
  );
};
