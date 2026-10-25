import React, { useState } from 'react';
import { Check, Copy, CheckCheck, RotateCcw, Info, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { DhikrItem, AppSettings, ThemeMode } from '../types/adhkar.ts';
import { getVisibleTranslations, getVisibleVirtues } from '../utils/translation-utils.ts';

interface DhikrCardProps {
  item: DhikrItem;
  count: number;
  onIncrement: (id: string) => void;
  onResetItem: (id: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  showCategoryBadge?: boolean;
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
  settings,
  theme,
}) => {
  const [copied, setCopied] = useState(false);
  const [showVirtue, setShowVirtue] = useState(false);

  const isDone = count >= item.target;
  const progressPercent = Math.min(100, Math.round((count / item.target) * 100));

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
      onClick={handleCardClick}
      className={`card relative rounded-2xl p-5 mb-4 border transition-all duration-200 shadow-sm ${
        isDone
          ? isDark
            ? 'bg-emerald-950/20 border-emerald-600/40 shadow-emerald-950/40'
            : 'bg-emerald-50/60 border-emerald-300 shadow-emerald-100/50'
          : isDark
          ? 'bg-slate-900 border-slate-800 hover:border-slate-700 shadow-black/20'
          : 'bg-white border-slate-200/80 hover:border-teal-300/60 shadow-slate-200/40'
      } ${settings.cardTapToCount && !isDone ? 'cursor-pointer active:scale-[0.995]' : ''}`}
    >
      {/* Top Meta Bar: Repeat count badge & Actions */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {item.uthaymeenNumber && (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                isDark
                  ? 'bg-amber-950/70 text-amber-300 border border-amber-800/80'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}
              title={`Supplication #${item.uthaymeenNumber} from Shaykh Ibn Uthaymeen collection`}
            >
              #{item.uthaymeenNumber}
            </span>
          )}
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              isDone
                ? 'bg-emerald-600 text-white'
                : isDark
                ? 'bg-teal-900/60 text-teal-300 border border-teal-800'
                : 'bg-teal-50 text-teal-800 border border-teal-200'
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
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              • {item.repeatNote}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Reset single item */}
          {count > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onResetItem(item.id);
              }}
              aria-label={`Reset count for this dhikr (${count}/${item.target})`}
              title="Reset counter"
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                isDark
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
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
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors ${
              copied
                ? 'text-emerald-500 bg-emerald-50'
                : isDark
                ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            {copied ? (
              <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
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
                ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                : isDark
                ? 'text-slate-400 hover:text-amber-400 hover:bg-slate-800'
                : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100'
            }`}
          >
            <Star
              className={`w-3.5 h-3.5 ${
                isFavorite ? 'fill-amber-400 text-amber-500' : ''
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

      {/* Arabic Script */}
      <div
        dir="rtl"
        className={`arabic font-arabic text-right select-text tracking-wide mb-3 ${arabicSizeClass} ${
          isDark ? 'text-slate-100' : 'text-slate-900'
        }`}
      >
        {item.arabic}
      </div>

      {/* Transliteration (if enabled in settings) */}
      {settings.showTransliteration && item.transliteration && (
        <div
          className={`transliteration text-xs italic mb-2 select-text font-serif leading-relaxed ${
            isDark ? 'text-teal-300/80' : 'text-teal-800'
          }`}
        >
          {item.transliteration}
        </div>
      )}

      {/* Meaning / Translation (English & Malayalam) */}
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
                    : 'bg-emerald-50/70 border-emerald-200/70 text-emerald-950'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-200/70 dark:bg-emerald-900/80 text-emerald-900 dark:text-emerald-200 uppercase">
                    മലയാളം
                  </span>
                </div>
                <p className="leading-relaxed font-normal">{visible.ml}</p>
              </div>

              {/* English Translation */}
              <div
                className={`text-xs sm:text-[13px] select-text leading-relaxed px-2 py-1 ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    English:
                  </span>
                </div>
                <p>{visible.en}</p>
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
                  : 'bg-emerald-50/70 border-emerald-200/70 text-emerald-950'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-200/70 dark:bg-emerald-900/80 text-emerald-900 dark:text-emerald-200 uppercase">
                  മലയാളം
                </span>
              </div>
              <p className="leading-relaxed font-normal">{visible.ml}</p>
            </div>
          );
        }

        if (visible.hasEn) {
          return (
            <div
              className={`meaning text-xs sm:text-sm select-text leading-relaxed mb-3.5 ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {visible.en}
            </div>
          );
        }

        return null;
      })()}

      {/* Virtue / Hadith Source disclosure */}
      {settings.showVirtues && (item.virtue || item.malayalamVirtue || item.source) && (
        <div className="mb-3.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowVirtue(!showVirtue);
            }}
            aria-expanded={showVirtue}
            className={`flex items-center justify-between w-full py-1.5 px-2.5 rounded-lg text-xs font-medium transition-colors ${
              isDark
                ? 'bg-slate-800/70 hover:bg-slate-800 text-teal-300'
                : 'bg-teal-50/70 hover:bg-teal-100/70 text-teal-800'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>Source: {item.source}</span>
            </span>
            {showVirtue ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          {showVirtue && (() => {
            const visibleVirtue = getVisibleVirtues(item, settings.translationLanguage || 'both');

            if (!visibleVirtue.hasMl && !visibleVirtue.hasEn) return null;

            return (
              <div
                className={`p-2.5 mt-1.5 rounded-lg text-xs leading-relaxed border space-y-2.5 ${
                  isDark
                    ? 'bg-slate-800/40 border-slate-700/60 text-slate-300'
                    : 'bg-amber-50/70 border-amber-200/60 text-amber-900'
                }`}
              >
                {/* Both Malayalam and English */}
                {visibleVirtue.hasMl && visibleVirtue.hasEn && (
                  <>
                    <div className="font-malayalam">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
                          ശ്രേഷ്ഠത (Hadith Virtue)
                        </span>
                      </div>
                      <p className="leading-relaxed font-normal">{visibleVirtue.ml}</p>
                    </div>

                    <div className="pt-2 border-t border-amber-200/60 dark:border-slate-700/60">
                      <div className="text-[10px] font-semibold text-amber-800/80 dark:text-slate-400 mb-0.5">
                        Virtue (English):
                      </div>
                      <p className="text-[11px] leading-relaxed">{visibleVirtue.en}</p>
                    </div>
                  </>
                )}

                {/* Malayalam only */}
                {visibleVirtue.hasMl && !visibleVirtue.hasEn && (
                  <div className="font-malayalam">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
                        ശ്രേഷ്ഠത (Hadith Virtue)
                      </span>
                    </div>
                    <p className="leading-relaxed font-normal">{visibleVirtue.ml}</p>
                  </div>
                )}

                {/* English only */}
                {!visibleVirtue.hasMl && visibleVirtue.hasEn && (
                  <div>
                    <div className="font-semibold mb-0.5">Hadith Virtue:</div>
                    <p>{visibleVirtue.en}</p>
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
          className={`counter-btn w-full py-3.5 px-4 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-150 relative overflow-hidden select-none active:scale-[0.98] ${
            isDone
              ? 'completed bg-emerald-600 text-white cursor-default shadow-sm shadow-emerald-600/30'
              : 'bg-teal-700 hover:bg-teal-600 text-white cursor-pointer shadow-md shadow-teal-900/20'
          }`}
        >
          {/* Subtle progress fill layer */}
          {!isDone && progressPercent > 0 && (
            <span
              className="absolute left-0 top-0 bottom-0 bg-teal-800/60 pointer-events-none transition-all duration-200"
              style={{ width: `${progressPercent}%` }}
            />
          )}

          <span className="relative z-10 flex items-center gap-2">
            {isDone ? (
              <>
                <Check className="w-5 h-5 stroke-[2.5]" />
                <span>Completed ({item.target})</span>
              </>
            ) : (
              <>
                <span>Tap:</span>
                <span className="font-mono text-base font-extrabold bg-teal-800/80 px-2 py-0.5 rounded-md">
                  {count} / {item.target}
                </span>
                {progressPercent > 0 && (
                  <span className="text-xs text-teal-200/90 font-normal">
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
