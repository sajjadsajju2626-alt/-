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
} from 'lucide-react';
import { DhikrItem, AppSettings, ThemeMode } from '../types/adhkar.ts';
import { getVisibleTranslations, getVisibleVirtues } from '../utils/translation-utils.ts';
import {
  PronunciationManager,
  PronunciationSpeed,
  AudioPlaybackState,
} from '../utils/pronunciation.ts';

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
  const [showVirtue, setShowVirtue] = useState(false);
  const [playbackState, setPlaybackState] = useState<AudioPlaybackState>(PronunciationManager.getState());
  const [speechSpeed, setSpeechSpeed] = useState<PronunciationSpeed>('1.0x');

  const isDone = count >= item.target;
  const progressPercent = Math.min(100, Math.round((count / item.target) * 100));

  useEffect(() => {
    const unsubscribe = PronunciationManager.subscribe((state) => {
      setPlaybackState(state);
    });
    return () => unsubscribe();
  }, []);

  const isThisItemActive = playbackState.playingId === item.id;
  const isThisItemPlaying = isThisItemActive && playbackState.status === 'playing';
  const isThisItemPaused = isThisItemActive && playbackState.status === 'paused';
  const isThisItemBuffering = isThisItemActive && playbackState.status === 'buffering';

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
                  : 'bg-amber-100 text-amber-950 border border-amber-400'
              }`}
              title={`Supplication #${item.uthaymeenNumber} from Shaykh Ibn Uthaymeen collection`}
            >
              #{item.uthaymeenNumber}
            </span>
          )}
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
              isDone
                ? 'bg-emerald-700 text-white font-extrabold shadow-xs'
                : isDark
                ? 'bg-teal-900/60 text-teal-300 border border-teal-800'
                : 'bg-teal-100 text-teal-950 border border-teal-400 font-extrabold'
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
              className={`text-[11px] font-bold ${
                isDark ? 'text-slate-300' : 'text-slate-800'
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
                ? 'Listen: Melodic Tajweed Recitation'
                : 'Listen: Classical Arabic Voice'
            }
            className={`p-1.5 rounded-lg text-xs flex items-center justify-center transition-all cursor-pointer ${
              isThisItemPlaying
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                : isThisItemPaused
                ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                : isDark
                ? 'text-emerald-400 hover:text-white hover:bg-slate-800'
                : 'text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50'
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
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/80'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Copy Arabic text */}
          <button
            onClick={handleCopy}
            aria-label="Copy Arabic text"
            title="Copy Arabic"
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer ${
              copied
                ? 'text-emerald-700 font-bold bg-emerald-100 border border-emerald-300'
                : isDark
                ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/80'
            }`}
          >
            {copied ? (
              <CheckCheck className="w-3.5 h-3.5 text-emerald-700" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
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
                ? 'text-amber-900 bg-amber-100 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300'
                : isDark
                ? 'text-slate-400 hover:text-amber-400 hover:bg-slate-800'
                : 'text-slate-600 hover:text-amber-600 hover:bg-slate-200/80'
            }`}
          >
            <Star
              className={`w-3.5 h-3.5 ${
                isFavorite ? 'fill-amber-500 text-amber-600' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {showCategoryBadge && (
        <div className="mb-2">
          <span className="inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-800">
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

          {/* Reciter Badge & Style Indicator */}
          <div className="flex items-center gap-1.5 min-w-0">
            {item.isQuranic ? (
              <div
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
                  isThisItemPlaying
                    ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-400'
                    : isDark
                    ? 'bg-teal-950/60 text-teal-300 border-teal-800'
                    : 'bg-teal-50 text-teal-800 border-teal-200'
                }`}
                title="Traditional Melodic Tajweed recitation by Sheikh Mishary Rashid Alafasy"
              >
                <Music2 className="w-3 h-3 text-emerald-500 shrink-0" />
                <span className="truncate">
                  {isThisItemPlaying ? (
                    <span className="flex items-center gap-1">
                      <span className="flex items-center gap-0.5 h-3">
                        <span className="w-0.5 h-2 bg-emerald-500 animate-pulse rounded-full" />
                        <span className="w-0.5 h-3.5 bg-emerald-500 animate-pulse delay-75 rounded-full" />
                        <span className="w-0.5 h-2 bg-emerald-500 animate-pulse delay-150 rounded-full" />
                      </span>
                      <span>Melodic Tajweed (الترتيل)</span>
                    </span>
                  ) : (
                    <span>Melodic Tajweed • Alafasy</span>
                  )}
                </span>
              </div>
            ) : (
              <div
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border ${
                  isThisItemPlaying
                    ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-400'
                    : isDark
                    ? 'bg-slate-700/60 text-slate-300 border-slate-600'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
                title="Pronounced in a resonant classical Arabic male voice"
              >
                <Mic className="w-3 h-3 text-teal-600 dark:text-teal-400 shrink-0" />
                <span className="truncate">
                  {isThisItemPlaying ? (
                    <span className="flex items-center gap-1">
                      <span className="flex items-center gap-0.5 h-3">
                        <span className="w-0.5 h-2 bg-emerald-500 animate-pulse rounded-full" />
                        <span className="w-0.5 h-3.5 bg-emerald-500 animate-pulse delay-75 rounded-full" />
                        <span className="w-0.5 h-2 bg-emerald-500 animate-pulse delay-150 rounded-full" />
                      </span>
                      <span>Classical Male Voice</span>
                    </span>
                  ) : (
                    <span>Classical Male Voice</span>
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
              className="p-1 rounded-md text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer mr-0.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          <div
            className="inline-flex items-center rounded-lg p-0.5 bg-slate-200/80 dark:bg-slate-900 border border-slate-300/60 dark:border-slate-700"
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
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer select-none ${
                  speechSpeed === spd
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
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
        className={`arabic font-arabic text-right select-text tracking-wide mb-3 p-2 rounded-xl transition-all duration-200 font-bold ${arabicSizeClass} ${
          isThisItemPlaying || isThisItemPaused
            ? isDark
              ? 'text-white bg-teal-950/50 ring-1 ring-emerald-500/60'
              : 'text-black bg-emerald-100/70 ring-2 ring-emerald-600'
            : isDark
            ? 'text-slate-100'
            : 'text-black'
        }`}
      >
        {item.arabic}
      </div>

      {/* Transliteration (if enabled in settings) */}
      {settings.showTransliteration && item.transliteration && (
        <div
          className={`transliteration text-xs sm:text-[13px] italic mb-2.5 select-text font-serif leading-relaxed ${
            isDark ? 'text-teal-300 font-medium' : 'text-teal-950 font-bold'
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
                    : 'bg-emerald-50 border-emerald-300 text-slate-950 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-[10px] font-black tracking-wider px-2 py-0.5 rounded bg-emerald-800 text-white uppercase shadow-xs">
                    മലയാളം
                  </span>
                </div>
                <p className="leading-relaxed font-semibold text-slate-950 dark:text-teal-100">{visible.ml}</p>
              </div>

              {/* English Translation */}
              <div
                className={`text-xs sm:text-[13px] select-text leading-relaxed px-2 py-1 ${
                  isDark ? 'text-slate-300' : 'text-slate-900 font-medium'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-400">
                    English:
                  </span>
                </div>
                <p className="text-slate-900 dark:text-slate-200 font-medium">{visible.en}</p>
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
                  : 'bg-emerald-50 border-emerald-300 text-slate-950 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-[10px] font-black tracking-wider px-2 py-0.5 rounded bg-emerald-800 text-white uppercase shadow-xs">
                  മലയാളം
                </span>
              </div>
              <p className="leading-relaxed font-semibold text-slate-950 dark:text-teal-100">{visible.ml}</p>
            </div>
          );
        }

        if (visible.hasEn) {
          return (
            <div
              className={`meaning text-xs sm:text-sm select-text leading-relaxed mb-3.5 font-medium ${
                isDark ? 'text-slate-300' : 'text-slate-900'
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
            onClick={(e) => {
              e.stopPropagation();
              setShowVirtue(!showVirtue);
            }}
            aria-expanded={showVirtue}
            className={`flex items-center justify-between w-full py-1.5 px-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
              isDark
                ? 'bg-slate-800/70 hover:bg-slate-800 text-teal-300 border-slate-700'
                : 'bg-teal-100 hover:bg-teal-200/90 text-teal-950 border-teal-300 shadow-xs'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>Source: {item.source}</span>
            </span>
            {showVirtue ? (
              <ChevronUp className="w-3.5 h-3.5 stroke-[2.5]" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
            )}
          </button>

          {showVirtue && (() => {
            const visibleVirtue = getVisibleVirtues(item, settings.translationLanguage || 'both');

            if (!visibleVirtue.hasMl && !visibleVirtue.hasEn) return null;

            return (
              <div
                className={`p-3 mt-1.5 rounded-xl text-xs leading-relaxed border space-y-2.5 ${
                  isDark
                    ? 'bg-slate-800/40 border-slate-700/60 text-slate-300'
                    : 'bg-amber-50 border-amber-300 text-amber-950 shadow-xs'
                }`}
              >
                {/* Both Malayalam and English */}
                {visibleVirtue.hasMl && visibleVirtue.hasEn && (
                  <>
                    <div className="font-malayalam">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="text-[10px] font-black tracking-wider px-2 py-0.5 rounded bg-amber-800 text-white uppercase shadow-xs">
                          ശ്രേഷ്ഠത (Hadith Virtue)
                        </span>
                      </div>
                      <p className="leading-relaxed font-semibold text-amber-950 dark:text-amber-200">{visibleVirtue.ml}</p>
                    </div>

                    <div className="pt-2 border-t border-amber-300/80 dark:border-slate-700/60">
                      <div className="text-[10px] font-black uppercase text-amber-950 dark:text-slate-400 mb-0.5">
                        Virtue (English):
                      </div>
                      <p className="text-[12px] leading-relaxed font-medium text-amber-950 dark:text-slate-200">{visibleVirtue.en}</p>
                    </div>
                  </>
                )}

                {/* Malayalam only */}
                {visibleVirtue.hasMl && !visibleVirtue.hasEn && (
                  <div className="font-malayalam">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-[10px] font-black tracking-wider px-2 py-0.5 rounded bg-amber-800 text-white uppercase shadow-xs">
                        ശ്രേഷ്ഠത (Hadith Virtue)
                      </span>
                    </div>
                    <p className="leading-relaxed font-semibold text-amber-950 dark:text-amber-200">{visibleVirtue.ml}</p>
                  </div>
                )}

                {/* English only */}
                {!visibleVirtue.hasMl && visibleVirtue.hasEn && (
                  <div>
                    <div className="font-black text-amber-950 dark:text-slate-300 mb-0.5">Hadith Virtue:</div>
                    <p className="font-medium text-amber-950 dark:text-slate-200">{visibleVirtue.en}</p>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

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
