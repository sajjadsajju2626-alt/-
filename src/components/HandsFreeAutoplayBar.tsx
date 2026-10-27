import React from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Square,
  Headphones,
  Volume2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { DhikrItem, ThemeMode } from '../types/adhkar.ts';

interface HandsFreeAutoplayBarProps {
  isActive: boolean;
  currentIndex: number;
  totalItems: number;
  currentItem: DhikrItem | null;
  isPlaying: boolean;
  isPaused: boolean;
  isWaitingPause: boolean;
  pauseSeconds: number;
  onSetPauseSeconds: (sec: number) => void;
  onTogglePlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onStop: () => void;
  theme: ThemeMode;
}

export const HandsFreeAutoplayBar: React.FC<HandsFreeAutoplayBarProps> = ({
  isActive,
  currentIndex,
  totalItems,
  currentItem,
  isPlaying,
  isPaused,
  isWaitingPause,
  pauseSeconds,
  onSetPauseSeconds,
  onTogglePlayPause,
  onNext,
  onPrevious,
  onStop,
  theme,
}) => {
  if (!isActive || !currentItem) return null;

  const isDark = theme === 'dark' || theme === 'midnight';
  const progressPercent = totalItems > 0 ? Math.round(((currentIndex + 1) / totalItems) * 100) : 0;

  return (
    <div
      role="region"
      aria-label="Hands-Free Audio Recite-Along Mode"
      className="fixed bottom-3 left-0 right-0 z-40 px-3 sm:px-4 max-w-xl mx-auto pointer-events-none"
    >
      <div
        className={`pointer-events-auto rounded-2xl p-3.5 shadow-2xl border backdrop-blur-md animate-in slide-in-from-bottom-4 duration-300 ${
          isDark
            ? 'bg-slate-900/95 border-emerald-500/50 text-white shadow-emerald-950/80 ring-1 ring-emerald-500/30'
            : 'bg-white border-2 border-emerald-600 text-black shadow-xl shadow-emerald-900/20'
        }`}
      >
        {/* Top bar: indicator & item info */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex h-2.5 w-2.5 relative flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600" />
            </span>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-emerald-400' : 'text-emerald-900'}`}>
                  Recite-Along Mode
                </span>
                <span className={`text-[11px] font-mono font-extrabold ${isDark ? 'text-slate-400' : 'text-black'}`}>
                  {currentIndex + 1} of {totalItems}
                </span>
              </div>
              <p className={`text-xs font-black truncate font-arabic text-right ${isDark ? 'text-slate-100' : 'text-black'}`}>
                {currentItem.arabic.substring(0, 48)}...
              </p>
            </div>
          </div>

          {/* Pause length selector: 2s / 4s / 6s */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className={`text-[10px] font-extrabold hidden xs:inline ${isDark ? 'text-slate-400' : 'text-black'}`}>
              Pause:
            </span>
            <div className={`inline-flex rounded-lg border p-0.5 ${isDark ? 'border-slate-800 bg-slate-800' : 'border-slate-400 bg-slate-100'}`}>
              {[2, 4, 6].map((sec) => (
                <button
                  key={sec}
                  onClick={() => onSetPauseSeconds(sec)}
                  className={`px-1.5 py-0.5 text-[10px] font-extrabold rounded-md transition-colors cursor-pointer ${
                    pauseSeconds === sec
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : isDark
                      ? 'text-slate-400 hover:text-white font-bold'
                      : 'text-black hover:bg-slate-200'
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Progress bar across playlist */}
        <div className={`w-full h-1.5 rounded-full mb-2.5 overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-300'}`}>
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Status text & playback buttons */}
        <div className="flex items-center justify-between gap-2">
          <div className={`text-[11px] font-bold flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-black'}`}>
            {isWaitingPause ? (
              <span className={`flex items-center gap-1 animate-pulse font-extrabold ${isDark ? 'text-amber-400' : 'text-amber-900'}`}>
                <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Pause ({pauseSeconds}s) before next supplication...</span>
              </span>
            ) : isPlaying ? (
              <span className={`flex items-center gap-1 font-extrabold ${isDark ? 'text-emerald-400' : 'text-emerald-950'}`}>
                <Volume2 className="w-3.5 h-3.5 animate-pulse stroke-[2.5]" />
                <span>
                  {currentItem.isQuranic
                    ? 'Tajweed / Murattal Recitation (Qari)'
                    : 'Calm & Reverent Dua Voice'}
                </span>
              </span>
            ) : (
              <span className={`font-extrabold ${isDark ? 'text-slate-400' : 'text-black'}`}>
                Paused • Hands-free active
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Prev */}
            <button
              onClick={onPrevious}
              disabled={currentIndex <= 0}
              aria-label="Previous supplication"
              className={`p-1.5 rounded-lg disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer ${
                isDark
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                  : 'text-black hover:bg-slate-200 border border-slate-300'
              }`}
            >
              <SkipBack className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Play / Pause */}
            <button
              onClick={onTogglePlayPause}
              aria-label={isPlaying ? 'Pause recite-along' : 'Resume recite-along'}
              className="p-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white shadow-md shadow-emerald-700/30 transition-transform active:scale-95 cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
            </button>

            {/* Next */}
            <button
              onClick={onNext}
              disabled={currentIndex >= totalItems - 1}
              aria-label="Next supplication"
              className={`p-1.5 rounded-lg disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer ${
                isDark
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                  : 'text-black hover:bg-slate-200 border border-slate-300'
              }`}
            >
              <SkipForward className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Stop / Exit */}
            <button
              onClick={onStop}
              aria-label="Exit recite-along mode"
              title="Stop Autoplay"
              className="p-1.5 ml-1 rounded-lg text-rose-700 dark:text-rose-500 hover:text-rose-800 hover:bg-rose-100 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
            >
              <Square className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
