import React, { useState, useEffect } from 'react';
import {
  Check,
  Copy,
  CheckCheck,
  RotateCcw,
  Info,
  ChevronDown,
  ChevronUp,
  Star,
  Volume2,
  Play,
  Pause,
  Music2,
  Mic,
  Timer,
  Plus,
  Minus,
  Sparkles,
} from 'lucide-react';
import { DhikrItem, AppSettings, ThemeMode } from '../types/adhkar.ts';
import { getVisibleTranslations, getVisibleVirtues } from '../utils/translation-utils.ts';
import {
  PronunciationManager,
  PronunciationSpeed,
  AudioPlaybackState,
} from '../utils/pronunciation.ts';
import {
  TIMER_PRESETS,
  TimerState,
  getRecommendedDurationSeconds,
  createInitialTimerState,
  formatCountdown,
  calculateTimerProgress,
  tickTimer,
  setTimerDuration,
  adjustTimerDuration,
} from '../utils/timer-utils.ts';
import { playCompletionSound, playTapSound, triggerHaptic } from '../utils/audio.ts';

interface DhikrCardProps {
  item: DhikrItem;
  count: number;
  onIncrement: (id: string) => void;
  onResetItem: (id: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  showCategoryBadge?: boolean;
  isAutoplayCurrentItem?: boolean;
  settings: AppSettings;
  theme: ThemeMode;
}

export const DhikrCard: React.FC<DhikrCardProps> = ({
  item,
  count,
  onIncrement,
  onResetItem,
  isFavorite,
  onToggleFavorite,
  showCategoryBadge = false,
  isAutoplayCurrentItem = false,
  settings,
  theme,
}) => {
  const [copied, setCopied] = useState(false);
  const [showVirtue, setShowVirtue] = useState(() => item.category === 'sleep');
  const [playbackState, setPlaybackState] = useState<AudioPlaybackState>(PronunciationManager.getState());
  const [speechSpeed, setSpeechSpeed] = useState<PronunciationSpeed>('1.0x');

  const recommendedSeconds = getRecommendedDurationSeconds(item);
  const [timerState, setTimerState] = useState<TimerState>(() =>
    createInitialTimerState(recommendedSeconds)
  );
  const [showTimerPresets, setShowTimerPresets] = useState(false);

  const isDone = count >= item.target;
  const progressPercent = Math.min(100, Math.round((count / item.target) * 100));
  const timerProgressPercent = calculateTimerProgress(
    timerState.remainingSeconds,
    timerState.durationSeconds
  );

  useEffect(() => {
    const unsubscribe = PronunciationManager.subscribe((state) => {
      setPlaybackState(state);
    });
    return () => unsubscribe();
  }, []);

  // Countdown interval when timer is running
  useEffect(() => {
    if (timerState.status !== 'running') return;

    const intervalId = window.setInterval(() => {
      setTimerState((prev) => {
        const next = tickTimer(prev);
        if (prev.status === 'running' && next.status === 'completed') {
          if (settings.soundEnabled) {
            playCompletionSound();
          }
          if (settings.vibrateEnabled) {
            triggerHaptic('complete');
          }
        }
        return next;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [timerState.status, settings.soundEnabled, settings.vibrateEnabled]);

  const handleTimerToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (settings.soundEnabled) playTapSound();
    if (settings.vibrateEnabled) triggerHaptic('tap');

    setTimerState((prev) => {
      if (prev.status === 'running') {
        return { ...prev, status: 'paused' };
      }
      if (prev.status === 'completed' || prev.remainingSeconds <= 0) {
        return {
          ...prev,
          remainingSeconds: prev.durationSeconds,
          status: 'running',
        };
      }
      return { ...prev, status: 'running' };
    });
  };

  const handleTimerReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (settings.vibrateEnabled) triggerHaptic('reset');
    setTimerState((prev) => ({
      ...prev,
      remainingSeconds: prev.durationSeconds,
      status: 'idle',
    }));
  };

  const handleSelectPreset = (seconds: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (settings.soundEnabled) playTapSound();
    setTimerState((prev) => setTimerDuration(prev, seconds));
  };

  const handleAdjustDuration = (deltaSeconds: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (settings.soundEnabled) playTapSound();
    setTimerState((prev) => adjustTimerDuration(prev, deltaSeconds));
  };

  const isThisItemActive = playbackState.playingId === item.id;
  const isThisItemPlaying =
    isThisItemActive && (playbackState.status === 'playing' || playbackState.status === 'buffering');
  const isThisItemPaused = isThisItemActive && playbackState.status === 'paused';

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    PronunciationManager.togglePlayPause({
      id: item.id,
      arabicText: item.arabic,
      speed: speechSpeed,
      isQuranic: !!item.isQuranic,
      audioUrl: item.audioUrl,
      audioUrls: item.audioUrls,
      reciterTitle: item.reciter,
    });
  };

  const handleSpeedChange = (newSpeed: PronunciationSpeed, e: React.MouseEvent) => {
    e.stopPropagation();
    setSpeechSpeed(newSpeed);
    PronunciationManager.setSpeed(newSpeed);
  };

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    PronunciationManager.replay({
      id: item.id,
      arabicText: item.arabic,
      speed: speechSpeed,
      isQuranic: !!item.isQuranic,
      audioUrl: item.audioUrl,
      audioUrls: item.audioUrls,
    });
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.arabic).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (settings.cardTapToCount) {
      // Don't trigger if clicking buttons or disclosures
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('a')) return;
      onIncrement(item.id);
    }
  };

  // Font size classes
  const arabicSizeClass =
    settings.arabicFontSize === 'xlarge'
      ? 'text-3xl leading-[2.2]'
      : settings.arabicFontSize === 'large'
      ? 'text-2xl leading-[2.0]'
      : 'text-xl leading-[1.8]';

  const isDark = theme === 'dark' || theme === 'midnight';

  return (
    <article
      id={`adhkar-card-${item.id}`}
      data-item-id={item.id}
      onClick={handleCardClick}
      className={`card relative rounded-2xl p-5 mb-4 border transition-all duration-200 shadow-sm ${
        isAutoplayCurrentItem
          ? isDark
            ? 'ring-3 ring-emerald-400 border-emerald-400 bg-slate-900 shadow-xl shadow-emerald-950/80'
            : 'ring-3 ring-emerald-600 border-emerald-600 bg-emerald-50/60 shadow-xl shadow-emerald-200/80'
          : isThisItemPlaying
          ? isDark
            ? 'ring-2 ring-emerald-500/70 border-emerald-500/80 bg-slate-900 shadow-emerald-950/60'
            : 'ring-2 ring-emerald-600 border-emerald-500 bg-white shadow-emerald-100'
          : isThisItemPaused
          ? isDark
            ? 'ring-2 ring-amber-500/60 border-amber-500/70 bg-slate-900 shadow-amber-950/40'
            : 'ring-2 ring-amber-600 border-amber-500 bg-white shadow-amber-100'
          : isDone
          ? isDark
            ? 'bg-emerald-950/20 border-emerald-600/40 shadow-emerald-950/40'
            : 'bg-emerald-50/80 border-emerald-400 shadow-emerald-100/60'
          : isDark
          ? 'bg-slate-900 border-slate-800 hover:border-slate-700 shadow-black/20'
          : 'bg-white border-slate-300 hover:border-slate-400 shadow-slate-200/60'
      } ${settings.cardTapToCount && !isDone ? 'cursor-pointer active:scale-[0.995]' : ''}`}
    >
      {/* Top Meta Bar: Repeat count badge & Actions */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {item.uthaymeenNumber && (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black ${
                isDark
                  ? 'bg-amber-950/70 text-amber-300 border border-amber-800/80'
                  : 'bg-amber-200 text-black border border-amber-600'
              }`}
              title={`Supplication #${item.uthaymeenNumber} from Shaykh Ibn Uthaymeen collection`}
            >
              #{item.uthaymeenNumber}
            </span>
          )}
          {item.hisnNumber && (
            <span
              data-testid={`hisn-badge-${item.id}`}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-black ${
                isDark
                  ? 'bg-amber-950/70 text-amber-300 border border-amber-800/80'
                  : 'bg-amber-200 text-black border border-amber-600'
              }`}
              title={`Hisn al-Muslim (حصن المسلم) Chapter 28 — Hadith #${item.hisnNumber}`}
            >
              <span>Hisn #{item.hisnNumber}</span>
            </span>
          )}
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
              isDone
                ? 'bg-emerald-700 text-white font-extrabold shadow-xs'
                : isDark
                ? 'bg-teal-900/60 text-teal-300 border border-teal-800'
                : 'bg-teal-100 text-black border border-teal-600 font-extrabold'
            }`}
          >
            {isDone ? (
              <>
                <Check className="w-3 h-3 stroke-[3]" />
                Completed
              </>
            ) : (
              <span>Target: {item.target}x</span>
            )}
          </span>

          {item.repeatNote && (
            <span
              className={`text-[11px] ${
                isDark ? 'text-slate-300 font-bold' : 'text-black font-extrabold'
              }`}
            >
              • {item.repeatNote}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Quick Play/Pause Audio Button alongside card header */}
          <button
            type="button"
            onClick={handleTogglePlay}
            aria-label={
              isThisItemPlaying
                ? `Pause audio recitation for ${item.transliteration}`
                : isThisItemPaused
                ? `Resume audio recitation for ${item.transliteration}`
                : `Play audio recitation for ${item.transliteration}`
            }
            title={
              isThisItemPlaying
                ? 'Pause audio'
                : isThisItemPaused
                ? 'Resume audio'
                : item.isQuranic
                ? 'Listen: Melodic Tajweed / Murattal Recitation (Qari)'
                : 'Listen: Natural, Humble & Calm Arabic Male Voice (Dua)'
            }
            className={`p-1.5 rounded-lg text-xs flex items-center justify-center transition-all cursor-pointer ${
              isThisItemPlaying
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                : isThisItemPaused
                ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                : isDark
                ? 'text-emerald-400 hover:text-white hover:bg-slate-800'
                : 'text-teal-950 hover:text-black bg-teal-50 hover:bg-teal-100 border border-teal-300'
            }`}
          >
            {isThisItemPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            )}
          </button>

          {/* Reset single item */}
          {count > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onResetItem(item.id);
              }}
              aria-label={`Reset count for this dhikr (${count}/${item.target})`}
              title="Reset counter"
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                isDark
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'text-slate-900 hover:text-black hover:bg-slate-200 border border-slate-300'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          )}

          {/* Copy Arabic text */}
          <button
            onClick={handleCopy}
            aria-label="Copy Arabic text"
            title="Copy Arabic"
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer ${
              copied
                ? 'text-emerald-900 font-extrabold bg-emerald-100 border border-emerald-500'
                : isDark
                ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                : 'text-slate-900 hover:text-black hover:bg-slate-200 border border-slate-300'
            }`}
          >
            {copied ? (
              <CheckCheck className="w-3.5 h-3.5 text-emerald-800 stroke-[2.5]" />
            ) : (
              <Copy className="w-3.5 h-3.5 stroke-[2.2]" />
            )}
          </button>

          {/* Star / Favorite button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(item.id);
            }}
            aria-label={
              isFavorite
                ? `Remove ${item.transliteration} from favorites`
                : `Add ${item.transliteration} to favorites`
            }
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className={`p-1.5 rounded-lg text-xs flex items-center transition-all cursor-pointer ${
              isFavorite
                ? 'text-amber-950 bg-amber-100 border border-amber-500 dark:bg-amber-950/60 dark:text-amber-300'
                : isDark
                ? 'text-slate-400 hover:text-amber-400 hover:bg-slate-800'
                : 'text-slate-900 hover:text-amber-800 hover:bg-slate-200 border border-slate-300'
            }`}
          >
            <Star
              className={`w-3.5 h-3.5 ${
                isFavorite ? 'fill-amber-500 text-amber-700' : 'stroke-[2.2]'
              }`}
            />
          </button>
        </div>
      </div>

      {showCategoryBadge && (
        <div className="mb-2">
          <span
            className={`inline-block text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-md border ${
              isDark
                ? 'bg-teal-950/60 text-teal-300 border-teal-800'
                : 'bg-teal-100 text-black border-teal-500'
            }`}
          >
            {item.category === 'morning'
              ? '☀️ Morning'
              : item.category === 'evening'
              ? '🌙 Evening'
              : item.category === 'prayer'
              ? '✨ After Prayer'
              : '🌌 Sleep'}
          </span>
        </div>
      )}

      {item.title && (
        <h3
          className={`font-malayalam text-sm sm:text-base font-extrabold mb-2.5 tracking-tight ${
            isDark ? 'text-teal-200' : 'text-black'
          }`}
        >
          {item.title}
        </h3>
      )}

      {/* Audio Pronunciation Player Bar */}
      <div
        className={`audio-player-bar flex flex-wrap items-center justify-between gap-2 p-2 sm:px-3 sm:py-2.5 rounded-xl mb-3 border transition-all ${
          isThisItemPlaying
            ? isDark
              ? 'bg-emerald-950/70 border-emerald-500/80 shadow-md shadow-emerald-950/50'
              : 'bg-emerald-50 border-emerald-400 shadow-md shadow-emerald-200/50'
            : isThisItemPaused
            ? isDark
              ? 'bg-amber-950/40 border-amber-500/50'
              : 'bg-amber-50/80 border-amber-300'
            : isDark
            ? 'bg-slate-800/60 border-slate-700/60 hover:border-slate-600'
            : 'bg-slate-50/90 border-slate-200 hover:border-teal-300'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {/* Main Play / Pause / Resume Button */}
          <button
            type="button"
            onClick={handleTogglePlay}
            aria-label={
              isThisItemPlaying
                ? `Pause recitation for ${item.transliteration}`
                : isThisItemPaused
                ? `Resume recitation for ${item.transliteration}`
                : `Play audio recitation for ${item.transliteration}`
            }
            title={
              isThisItemPlaying
                ? 'Pause recitation'
                : isThisItemPaused
                ? 'Resume recitation'
                : 'Play recitation'
            }
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs shrink-0 select-none ${
              isThisItemPlaying
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : isThisItemPaused
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-teal-700 hover:bg-teal-600 text-white'
            }`}
          >
            {isThisItemPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : isThisItemPaused ? (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play</span>
                <span className="font-arabic font-normal text-[11px] opacity-90 hidden xs:inline">
                  استمع
                </span>
              </>
            )}
          </button>

          {/* Segregated Reciter Badge & Voice Style Indicator */}
          <div className="flex items-center gap-1.5 min-w-0">
            {item.isQuranic ? (
              <div
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-extrabold border ${
                  isThisItemPlaying
                    ? isDark
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                      : 'bg-emerald-100 text-black border-emerald-600'
                    : isDark
                    ? 'bg-teal-950/60 text-teal-300 border-teal-800 font-bold'
                    : 'bg-teal-50 text-black border-teal-500'
                }`}
                title="Traditional melodic, contemplative, and rhythmic Quranic recitation (Tajweed/Murattal style) by a native male reciter (Qari)"
              >
                <Music2 className={`w-3 h-3 shrink-0 ${isDark ? 'text-emerald-400' : 'text-emerald-800 stroke-[2.5]'}`} />
                <span className="truncate">
                  {isThisItemPlaying ? (
                    <span className="flex items-center gap-1">
                      <span className="flex items-center gap-0.5 h-3">
                        <span className="w-0.5 h-2 bg-emerald-700 dark:bg-emerald-400 animate-pulse rounded-full" />
                        <span className="w-0.5 h-3.5 bg-emerald-700 dark:bg-emerald-400 animate-pulse delay-75 rounded-full" />
                        <span className="w-0.5 h-2 bg-emerald-700 dark:bg-emerald-400 animate-pulse delay-150 rounded-full" />
                      </span>
                      <span>Tajweed / Murattal (الترتيل)</span>
                    </span>
                  ) : (
                    <span>Tajweed / Murattal • Qari (ആയത്തുകൾ)</span>
                  )}
                </span>
              </div>
            ) : (
              <div
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-extrabold border ${
                  isThisItemPlaying
                    ? isDark
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                      : 'bg-emerald-100 text-black border-emerald-600'
                    : isDark
                    ? 'bg-slate-700/60 text-slate-200 border-slate-600 font-bold'
                    : 'bg-white text-black border-slate-400'
                }`}
                title="Natural, humble, calm, and conversational native Arabic male voice with a steady and reverent spiritual tone suitable for private remembrance (Dua)"
              >
                <Mic className={`w-3 h-3 shrink-0 ${isDark ? 'text-teal-400' : 'text-teal-900 stroke-[2.5]'}`} />
                <span className="truncate">
                  {isThisItemPlaying ? (
                    <span className="flex items-center gap-1">
                      <span className="flex items-center gap-0.5 h-3">
                        <span className="w-0.5 h-2 bg-emerald-700 dark:bg-emerald-400 animate-pulse rounded-full" />
                        <span className="w-0.5 h-3.5 bg-emerald-700 dark:bg-emerald-400 animate-pulse delay-75 rounded-full" />
                        <span className="w-0.5 h-2 bg-emerald-700 dark:bg-emerald-400 animate-pulse delay-150 rounded-full" />
                      </span>
                      <span>Calm &amp; Reverent Dua (دعاء خاشع)</span>
                    </span>
                  ) : (
                    <span>Calm Natural Dua Voice (ദിക്റുകൾ)</span>
                  )}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Speed Controls (0.75x slow for learners, 1.0x normal, 1.25x) & Replay */}
        <div className="flex items-center gap-1 shrink-0">
          {(isThisItemPlaying || isThisItemPaused) && (
            <button
              type="button"
              onClick={handleReplay}
              aria-label="Replay audio from start"
              title="Replay from beginning"
              className={`p-1 rounded-md transition-colors cursor-pointer mr-0.5 ${
                isDark
                  ? 'text-slate-400 hover:text-white hover:bg-slate-700'
                  : 'text-black hover:bg-slate-200 border border-slate-300'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          )}

          <div
            className={`inline-flex items-center rounded-lg p-0.5 border ${
              isDark
                ? 'bg-slate-900 border-slate-700'
                : 'bg-white border-slate-400'
            }`}
            role="group"
            aria-label="Pronunciation playback speed"
          >
            {(['0.75x', '1.0x', '1.25x'] as PronunciationSpeed[]).map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={(e) => handleSpeedChange(spd, e)}
                title={
                  spd === '0.75x'
                    ? '0.75x - Slow pace for reciting along'
                    : spd === '1.0x'
                    ? '1.0x - Normal pace'
                    : '1.25x - Faster pace'
                }
                aria-pressed={speechSpeed === spd}
                className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold transition-all cursor-pointer select-none ${
                  speechSpeed === spd
                    ? 'bg-teal-800 text-white shadow-xs'
                    : isDark
                    ? 'text-slate-400 hover:text-white font-bold'
                    : 'text-black hover:bg-slate-200 font-extrabold'
                }`}
              >
                {spd}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Arabic Script: Maximum contrast black bold font for crisp daylight readability */}
      <div
        dir="rtl"
        className={`arabic font-arabic text-right select-text tracking-wide mb-3 p-2 rounded-xl transition-all duration-200 ${arabicSizeClass} ${
          isThisItemPlaying || isThisItemPaused
            ? isDark
              ? 'text-white font-bold bg-teal-950/50 ring-1 ring-emerald-500/60'
              : 'text-black font-black bg-emerald-100/80 ring-2 ring-emerald-700'
            : isDark
            ? 'text-slate-100 font-bold'
            : 'text-black font-black'
        }`}
      >
        {item.arabic}
      </div>

      {/* Transliteration (if enabled in settings) */}
      {settings.showTransliteration && item.transliteration && (
        <div
          className={`transliteration text-xs sm:text-[13px] italic mb-2.5 select-text font-serif leading-relaxed ${
            isDark ? 'text-teal-300 font-medium' : 'text-teal-950 font-extrabold'
          }`}
        >
          {item.transliteration}
        </div>
      )}

      {/* Meaning / Translation (English & Malayalam) with Strong Daylight Contrast */}
      {settings.showTranslation && (() => {
        const visible = getVisibleTranslations(item, settings.translationLanguage || 'both');

        if (visible.hasMl && visible.hasEn) {
          return (
            <div className="space-y-2 mb-3.5">
              {/* Malayalam Translation */}
              <div
                className={`font-malayalam text-xs sm:text-[13px] select-text leading-relaxed p-2.5 rounded-xl border ${
                  isDark
                    ? 'bg-teal-950/30 border-teal-800/40 text-teal-100'
                    : 'bg-emerald-50/90 border-emerald-500 text-black shadow-xs'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-[10px] font-black tracking-wider px-2 py-0.5 rounded bg-emerald-900 text-white uppercase shadow-xs">
                    മലയാളം
                  </span>
                </div>
                <p className={`leading-relaxed ${isDark ? 'font-semibold text-teal-100' : 'font-bold text-black'}`}>
                  {visible.ml}
                </p>
              </div>

              {/* English Translation */}
              <div
                className={`text-xs sm:text-[13px] select-text leading-relaxed px-2 py-1 ${
                  isDark ? 'text-slate-300' : 'text-black font-bold'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-teal-950'}`}>
                    English:
                  </span>
                </div>
                <p className={isDark ? 'text-slate-200 font-medium' : 'text-black font-bold'}>
                  {visible.en}
                </p>
              </div>
            </div>
          );
        }

        if (visible.hasMl) {
          return (
            <div
              className={`meaning font-malayalam text-xs sm:text-[13px] select-text leading-relaxed mb-3.5 p-2.5 rounded-xl border ${
                isDark
                  ? 'bg-teal-950/30 border-teal-800/40 text-teal-100'
                  : 'bg-emerald-50/90 border-emerald-500 text-black shadow-xs'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-[10px] font-black tracking-wider px-2 py-0.5 rounded bg-emerald-900 text-white uppercase shadow-xs">
                  മലയാളം
                </span>
              </div>
              <p className={`leading-relaxed ${isDark ? 'font-semibold text-teal-100' : 'font-bold text-black'}`}>
                {visible.ml}
              </p>
            </div>
          );
        }

        if (visible.hasEn) {
          return (
            <div
              className={`meaning text-xs sm:text-sm select-text leading-relaxed mb-3.5 ${
                isDark ? 'text-slate-300 font-medium' : 'text-black font-bold'
              }`}
            >
              {visible.en}
            </div>
          );
        }

        return null;
      })()}

      {/* Virtue / Hadith Source disclosure with Strong Daylight Contrast */}
      {settings.showVirtues && (item.virtue || item.malayalamVirtue || item.source) && (
        <div className="mb-3.5">
          <button
            type="button"
            data-testid={`virtue-toggle-${item.id}`}
            onClick={(e) => {
              e.stopPropagation();
              setShowVirtue(!showVirtue);
            }}
            aria-expanded={showVirtue}
            className={`flex items-center justify-between gap-2 w-full py-1.5 px-2.5 rounded-lg text-xs text-left transition-colors cursor-pointer border ${
              isDark
                ? 'bg-slate-800/70 hover:bg-slate-800 text-teal-300 border-slate-700 font-bold'
                : 'bg-teal-100 hover:bg-teal-200 text-black border-teal-600 font-extrabold shadow-xs'
            }`}
          >
            <span className="flex items-center gap-1.5 min-w-0 flex-wrap">
              <Info className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
              <span className="break-words">Hadith Ref: {item.source}</span>
              <span
                className={`font-malayalam text-[10px] px-1.5 py-0.5 rounded font-black shrink-0 ${
                  isDark
                    ? 'bg-amber-950/80 text-amber-300 border border-amber-800/70'
                    : 'bg-amber-200 text-black border border-amber-600'
                }`}
              >
                ഹദീസിന്റെ ശ്രേഷ്ഠത
              </span>
            </span>
            {showVirtue ? (
              <ChevronUp className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
            )}
          </button>

          {showVirtue && (() => {
            const visibleVirtue = getVisibleVirtues(item, settings.translationLanguage || 'both');

            if (!visibleVirtue.hasMl && !visibleVirtue.hasEn) return null;

            return (
              <div
                data-testid={`virtue-panel-${item.id}`}
                className={`p-3 mt-1.5 rounded-xl text-xs leading-relaxed border space-y-2.5 ${
                  isDark
                    ? 'bg-slate-800/40 border-slate-700/60 text-slate-300'
                    : 'bg-amber-50 border-amber-600 text-black shadow-xs'
                }`}
              >
                {/* Both Malayalam and English */}
                {visibleVirtue.hasMl && visibleVirtue.hasEn && (
                  <>
                    <div className="font-malayalam">
                      <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                        <span className="text-[10px] font-black tracking-wider px-2 py-0.5 rounded bg-amber-900 text-white uppercase shadow-xs">
                          ശ്രേഷ്ഠത / ഫലം (Hadith Virtue &amp; Benefit)
                        </span>
                      </div>
                      <p className={`leading-relaxed ${isDark ? 'font-semibold text-amber-200' : 'font-extrabold text-black'}`}>
                        {visibleVirtue.ml}
                      </p>
                    </div>

                    <div className={`pt-2 border-t ${isDark ? 'border-slate-700/60' : 'border-amber-400'}`}>
                      <div className={`text-[10px] font-black uppercase mb-0.5 ${isDark ? 'text-slate-400' : 'text-black'}`}>
                        Virtue (English):
                      </div>
                      <p className={`text-[12px] leading-relaxed ${isDark ? 'font-medium text-slate-200' : 'font-bold text-black'}`}>
                        {visibleVirtue.en}
                      </p>
                    </div>
                  </>
                )}

                {/* Malayalam only */}
                {visibleVirtue.hasMl && !visibleVirtue.hasEn && (
                  <div className="font-malayalam">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-[10px] font-black tracking-wider px-2 py-0.5 rounded bg-amber-900 text-white uppercase shadow-xs">
                        ശ്രേഷ്ഠത / ഫലം (Hadith Virtue &amp; Benefit)
                      </span>
                    </div>
                    <p className={`leading-relaxed ${isDark ? 'font-semibold text-amber-200' : 'font-extrabold text-black'}`}>
                      {visibleVirtue.ml}
                    </p>
                  </div>
                )}

                {/* English only */}
                {!visibleVirtue.hasMl && visibleVirtue.hasEn && (
                  <div>
                    <div className={`font-black mb-0.5 ${isDark ? 'text-slate-300' : 'text-black'}`}>Hadith Virtue:</div>
                    <p className={isDark ? 'font-medium text-slate-200' : 'font-bold text-black'}>{visibleVirtue.en}</p>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Recitation Focus Countdown Timer */}
      <div
        data-testid={`dhikr-timer-${item.id}`}
        onClick={(e) => e.stopPropagation()}
        className={`dhikr-focus-timer rounded-xl p-2.5 sm:px-3 sm:py-2.5 mb-3.5 border transition-all ${
          timerState.status === 'running'
            ? isDark
              ? 'bg-emerald-950/60 border-emerald-500/80 shadow-md shadow-emerald-950/50'
              : 'bg-emerald-50 border-emerald-600 shadow-sm'
            : timerState.status === 'paused'
            ? isDark
              ? 'bg-amber-950/40 border-amber-500/60'
              : 'bg-amber-50/90 border-amber-500'
            : timerState.status === 'completed'
            ? isDark
              ? 'bg-emerald-900/50 border-emerald-400 ring-1 ring-emerald-400/60'
              : 'bg-emerald-100/90 border-emerald-600 ring-1 ring-emerald-600'
            : isDark
            ? 'bg-slate-800/50 border-slate-700/70 hover:border-slate-600'
            : 'bg-slate-100/90 border-slate-300 hover:border-teal-500'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Left: Timer Label & Live MM:SS Countdown Display */}
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`p-1.5 rounded-lg flex items-center justify-center shrink-0 ${
                timerState.status === 'running'
                  ? 'bg-emerald-600 text-white animate-pulse'
                  : timerState.status === 'paused'
                  ? 'bg-amber-600 text-white'
                  : timerState.status === 'completed'
                  ? 'bg-emerald-700 text-white'
                  : isDark
                  ? 'bg-slate-700 text-teal-300'
                  : 'bg-teal-800 text-white'
              }`}
            >
              <Timer className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span
                  className={`text-[11px] font-extrabold tracking-tight ${
                    isDark ? 'text-slate-200' : 'text-black'
                  }`}
                >
                  Focus Timer
                </span>
                <span
                  className={`font-malayalam text-[10px] font-bold ${
                    isDark ? 'text-teal-300' : 'text-teal-950'
                  }`}
                >
                  • സമയക്രമം
                </span>
              </div>
            </div>

            {/* Countdown Digital Clock Display */}
            <span
              data-testid={`timer-display-${item.id}`}
              aria-live="polite"
              className={`font-mono text-xs sm:text-sm font-black px-2 py-0.5 rounded-md border tracking-wider select-none ${
                timerState.status === 'running'
                  ? isDark
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                    : 'bg-white text-black border-emerald-700 shadow-2xs'
                  : timerState.status === 'paused'
                  ? isDark
                    ? 'bg-amber-950 text-amber-300 border-amber-500'
                    : 'bg-white text-black border-amber-600'
                  : timerState.status === 'completed'
                  ? 'bg-emerald-700 text-white border-emerald-800'
                  : isDark
                  ? 'bg-slate-900 text-teal-200 border-slate-700'
                  : 'bg-white text-black border-slate-400'
              }`}
            >
              {formatCountdown(timerState.remainingSeconds)}
            </span>
          </div>

          {/* Right: Start/Pause, Reset, and Duration Toggle Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              data-testid={`timer-toggle-${item.id}`}
              onClick={handleTimerToggle}
              aria-label={
                timerState.status === 'running'
                  ? `Pause focus timer for ${item.transliteration}`
                  : timerState.status === 'paused'
                  ? `Resume focus timer for ${item.transliteration}`
                  : `Start focus timer for ${item.transliteration}`
              }
              className={`px-2.5 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1 transition-all cursor-pointer select-none shadow-2xs ${
                timerState.status === 'running'
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : timerState.status === 'paused'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-teal-800 hover:bg-teal-700 text-white'
              }`}
            >
              {timerState.status === 'running' ? (
                <>
                  <Pause className="w-3 h-3 fill-current" />
                  <span>Pause</span>
                </>
              ) : timerState.status === 'paused' ? (
                <>
                  <Play className="w-3 h-3 fill-current" />
                  <span>Resume</span>
                </>
              ) : timerState.status === 'completed' ? (
                <>
                  <RotateCcw className="w-3 h-3 stroke-[2.5]" />
                  <span>Restart</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-current" />
                  <span>Start</span>
                </>
              )}
            </button>

            {(timerState.status !== 'idle' ||
              timerState.remainingSeconds !== timerState.durationSeconds) && (
              <button
                type="button"
                data-testid={`timer-reset-${item.id}`}
                onClick={handleTimerReset}
                title="Reset focus timer"
                aria-label="Reset focus timer"
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer border ${
                  isDark
                    ? 'bg-slate-800 text-slate-300 hover:text-white border-slate-700 hover:bg-slate-700'
                    : 'bg-white text-black hover:bg-slate-200 border-slate-400 font-bold'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            )}

            <button
              type="button"
              data-testid={`timer-customize-toggle-${item.id}`}
              onClick={(e) => {
                e.stopPropagation();
                setShowTimerPresets((prev) => !prev);
              }}
              aria-expanded={showTimerPresets}
              title="Set recitation timer duration"
              className={`px-2 py-1 rounded-lg text-[11px] font-extrabold flex items-center gap-1 transition-colors cursor-pointer border ${
                showTimerPresets
                  ? isDark
                    ? 'bg-teal-900/80 text-teal-200 border-teal-600'
                    : 'bg-teal-200 text-black border-teal-600'
                  : isDark
                  ? 'bg-slate-900 text-slate-300 hover:text-white border-slate-700'
                  : 'bg-white text-black hover:bg-slate-200 border-slate-400'
              }`}
            >
              <span>Set Time</span>
              {showTimerPresets ? (
                <ChevronUp className="w-3 h-3 stroke-[2.5]" />
              ) : (
                <ChevronDown className="w-3 h-3 stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>

        {/* Visual Progress Bar */}
        {(timerState.status !== 'idle' || showTimerPresets) && (
          <div
            className={`w-full h-1.5 rounded-full overflow-hidden mt-2 ${
              isDark ? 'bg-slate-900' : 'bg-slate-300'
            }`}
          >
            <div
              data-testid={`timer-progress-${item.id}`}
              className={`h-full transition-all duration-300 rounded-full ${
                timerState.status === 'completed'
                  ? 'bg-emerald-500 animate-pulse'
                  : timerState.status === 'paused'
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${timerProgressPercent}%` }}
            />
          </div>
        )}

        {/* Completed Celebration Notice */}
        {timerState.status === 'completed' && (
          <div
            data-testid={`timer-completed-banner-${item.id}`}
            className={`mt-2 px-2.5 py-1.5 rounded-lg flex flex-wrap items-center justify-between gap-2 text-xs font-extrabold border ${
              isDark
                ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/70'
                : 'bg-white text-black border-emerald-600 shadow-2xs'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 fill-amber-400" />
              <span>Focus Session Complete!</span>
              <span className="font-malayalam">• സമയം പൂർത്തിയായി!</span>
            </span>
            {!isDone && (
              <button
                type="button"
                data-testid={`timer-complete-dhikr-${item.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onIncrement(item.id);
                }}
                className="px-2 py-0.5 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-extrabold cursor-pointer transition-colors"
              >
                +1 Count ({count}/{item.target})
              </button>
            )}
          </div>
        )}

        {/* Expandable Duration Presets & +/- 15s Fine Adjustment */}
        {showTimerPresets && (
          <div
            data-testid={`timer-presets-panel-${item.id}`}
            className={`mt-2.5 pt-2 border-t flex flex-wrap items-center justify-between gap-2 ${
              isDark ? 'border-slate-700/70' : 'border-slate-300'
            }`}
          >
            <div className="flex items-center gap-1 flex-wrap">
              {TIMER_PRESETS.map((preset) => {
                const isSelected = timerState.durationSeconds === preset.seconds;
                return (
                  <button
                    key={preset.seconds}
                    type="button"
                    data-testid={`timer-preset-${preset.seconds}-${item.id}`}
                    onClick={(e) => handleSelectPreset(preset.seconds, e)}
                    className={`px-2 py-1 rounded-md text-[11px] font-extrabold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-teal-800 text-white border-teal-900 shadow-2xs'
                        : isDark
                        ? 'bg-slate-900 text-slate-300 hover:text-white border-slate-700 hover:bg-slate-800'
                        : 'bg-white text-black hover:bg-teal-50 border-slate-400'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                data-testid={`timer-minus-${item.id}`}
                onClick={(e) => handleAdjustDuration(-15, e)}
                title="Decrease duration by 15 seconds"
                aria-label="Decrease duration by 15 seconds"
                className={`px-2 py-1 rounded-md text-[11px] font-extrabold flex items-center gap-0.5 cursor-pointer border transition-colors ${
                  isDark
                    ? 'bg-slate-900 text-slate-300 hover:text-white border-slate-700 hover:bg-slate-800'
                    : 'bg-white text-black hover:bg-slate-200 border-slate-400'
                }`}
              >
                <Minus className="w-3 h-3 stroke-[2.5]" />
                <span>15s</span>
              </button>
              <button
                type="button"
                data-testid={`timer-plus-${item.id}`}
                onClick={(e) => handleAdjustDuration(15, e)}
                title="Increase duration by 15 seconds"
                aria-label="Increase duration by 15 seconds"
                className={`px-2 py-1 rounded-md text-[11px] font-extrabold flex items-center gap-0.5 cursor-pointer border transition-colors ${
                  isDark
                    ? 'bg-slate-900 text-slate-300 hover:text-white border-slate-700 hover:bg-slate-800'
                    : 'bg-white text-black hover:bg-slate-200 border-slate-400'
                }`}
              >
                <Plus className="w-3 h-3 stroke-[2.5]" />
                <span>15s</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Primary Counter Button */}
      <div className="relative">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onIncrement(item.id);
          }}
          disabled={isDone}
          aria-label={
            isDone
              ? `Completed: ${item.transliteration}, ${item.target} of ${item.target} reached`
              : `Tap counter for ${item.transliteration}: ${count} of ${item.target} done`
          }
          className={`counter-btn w-full py-3.5 px-4 rounded-xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-150 relative overflow-hidden select-none active:scale-[0.98] ${
            isDone
              ? 'completed bg-emerald-700 text-white cursor-default shadow-sm shadow-emerald-700/40'
              : 'bg-teal-800 hover:bg-teal-700 text-white cursor-pointer shadow-md shadow-teal-950/30 ring-1 ring-teal-700'
          }`}
        >
          {/* Subtle progress fill layer */}
          {!isDone && progressPercent > 0 && (
            <span
              className="absolute left-0 top-0 bottom-0 bg-teal-900/60 pointer-events-none transition-all duration-200"
              style={{ width: `${progressPercent}%` }}
            />
          )}

          <span className="relative z-10 flex items-center gap-2 font-bold">
            {isDone ? (
              <>
                <Check className="w-5 h-5 stroke-[3]" />
                <span>Completed ({item.target})</span>
              </>
            ) : (
              <>
                <span>Tap:</span>
                <span className="font-mono text-base font-black bg-teal-950/70 px-2 py-0.5 rounded-md text-white border border-teal-600/40">
                  {count} / {item.target}
                </span>
                {progressPercent > 0 && (
                  <span className="text-xs text-teal-100 font-semibold">
                    ({progressPercent}%)
                  </span>
                )}
              </>
            )}
          </span>
        </button>
      </div>
    </article>
  );
};
