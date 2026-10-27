import React, { useEffect, useState } from 'react';
import { Flame, CheckCircle2, Sparkles, X } from 'lucide-react';
import { triggerHaptic, playCompletionSound } from '../utils/audio.ts';

export interface SectionCompletionEvent {
  sectionKey: string;
  sectionLabel: string;
  arabicLabel?: string;
  completedCount: number;
  totalCount: number;
}

interface SectionCompletionFireOverlayProps {
  event: SectionCompletionEvent | null;
  onDismiss: () => void;
  soundEnabled: boolean;
  vibrateEnabled: boolean;
}

export const SectionCompletionFireOverlay: React.FC<SectionCompletionFireOverlayProps> = ({
  event,
  onDismiss,
  soundEnabled,
  vibrateEnabled,
}) => {
  const [stage, setStage] = useState<'enter' | 'active' | 'exit'>('enter');

  useEffect(() => {
    if (!event) return;

    setStage('enter');

    if (soundEnabled) {
      playCompletionSound();
    }
    if (vibrateEnabled) {
      triggerHaptic('complete');
      try {
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          navigator.vibrate([40, 50, 90]);
        }
      } catch {
        // ignore
      }
    }

    const enterTimer = setTimeout(() => {
      setStage('active');
    }, 50);

    const exitTimer = setTimeout(() => {
      setStage('exit');
    }, 3200);

    const removeTimer = setTimeout(() => {
      onDismiss();
    }, 3600);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, [event, soundEnabled, vibrateEnabled]);

  if (!event) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      data-testid="section-completion-fire-overlay"
      onClick={onDismiss}
      className={`fixed inset-x-0 top-44 sm:top-48 z-40 flex justify-center px-4 pointer-events-none transition-all duration-300 ${
        stage === 'enter'
          ? 'opacity-0 -translate-y-4 scale-90'
          : stage === 'exit'
          ? 'opacity-0 -translate-y-6 scale-95'
          : 'opacity-100 translate-y-0 scale-100'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="pointer-events-auto relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-teal-950 to-slate-950 text-white border-2 border-amber-400/80 shadow-2xl shadow-orange-500/30 px-5 py-4 max-w-md w-full flex items-center gap-4"
      >
        {/* Warm vibrant background glow */}
        <div className="absolute -left-6 -top-6 w-28 h-28 rounded-full bg-amber-500/30 blur-2xl pointer-events-none animate-pulse" />
        <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-emerald-500/25 blur-2xl pointer-events-none animate-pulse" />

        {/* Localized Animated Flame Icon with Warm Glow */}
        <div className="relative flex-shrink-0 flex items-center justify-center">
          <div className="absolute w-16 h-16 rounded-full bg-gradient-to-tr from-orange-500/50 to-amber-300/40 blur-md animate-ping" />
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-300 flex items-center justify-center shadow-lg shadow-orange-500/50 ring-2 ring-amber-200 animate-bounce">
            <Flame className="w-8 h-8 text-slate-950 fill-white drop-shadow" />
          </div>
          <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center shadow-md">
            <CheckCircle2 className="w-4 h-4 text-white stroke-[3]" />
          </span>
        </div>

        {/* Completion Copy & Malayalam Badge */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-malayalam text-xs sm:text-sm font-black tracking-wide px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/50 flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-slate-950" />
              <span>പൂർത്തിയായി!</span>
            </span>
            <span className="text-xs font-mono font-black text-amber-300">
              {event.completedCount}/{event.totalCount} (100%)
            </span>
          </div>

          <h4 className="text-sm sm:text-base font-extrabold text-white mt-1 truncate">
            🔥 {event.sectionLabel} Completed!
          </h4>

          <p className="text-[11px] text-amber-200/95 font-medium mt-0.5">
            Alhamdulillah • Section 100% complete
          </p>
        </div>

        {/* Dismiss button */}
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Close section completion notification"
          className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer self-start"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
