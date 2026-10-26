import React, { useEffect, useState } from 'react';
import { Flame, Sparkles, Trophy, ShieldCheck, X, CheckCircle2, Share2, ArrowUpRight } from 'lucide-react';
import { triggerHaptic, playCompletionSound } from '../utils/audio.ts';

interface StreakCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  previousStreak: number;
  newStreak: number;
  categoryName: string;
  freezeTokens: number;
  freezeUsed: boolean;
  onShare?: () => void;
}

export const StreakCompletionModal: React.FC<StreakCompletionModalProps> = ({
  isOpen,
  onClose,
  previousStreak,
  newStreak,
  categoryName,
  freezeTokens,
  freezeUsed,
  onShare,
}) => {
  const [displayedStreak, setDisplayedStreak] = useState(previousStreak);
  const [animationStage, setAnimationStage] = useState<'enter' | 'counting' | 'celebrate' | 'shrinking'>('enter');

  useEffect(() => {
    if (!isOpen) {
      setAnimationStage('enter');
      setDisplayedStreak(previousStreak);
      return;
    }

    // Play completion chime & haptic on modal trigger
    try {
      playCompletionSound();
      triggerHaptic('complete');
    } catch {
      // ignore
    }

    // 1. Entrance bounce phase
    const timer1 = setTimeout(() => {
      setAnimationStage('counting');
    }, 450);

    // 2. Animate counter number from previousStreak up to newStreak
    const startVal = Math.max(0, previousStreak);
    const endVal = Math.max(1, newStreak);
    const diff = endVal - startVal;

    let counterTimer: NodeJS.Timeout;

    if (diff > 0) {
      const steps = Math.min(diff, 10);
      const stepDuration = 700 / steps;
      let currentStep = 0;

      counterTimer = setInterval(() => {
        currentStep++;
        const val = Math.round(startVal + (diff * (currentStep / steps)));
        setDisplayedStreak(val);
        triggerHaptic('tap');

        if (currentStep >= steps) {
          clearInterval(counterTimer);
          setDisplayedStreak(endVal);
          setAnimationStage('celebrate');
        }
      }, stepDuration);
    } else {
      setDisplayedStreak(endVal);
      setAnimationStage('celebrate');
    }

    // 3. Auto shrink back into top bar after 5 seconds if not dismissed
    const autoShrinkTimer = setTimeout(() => {
      handleShrinkToTop();
    }, 5500);

    return () => {
      clearTimeout(timer1);
      if (counterTimer) clearInterval(counterTimer);
      clearTimeout(autoShrinkTimer);
    };
  }, [isOpen, previousStreak, newStreak]);

  if (!isOpen) return null;

  const handleShrinkToTop = () => {
    setAnimationStage('shrinking');
    setTimeout(() => {
      onClose();
    }, 450);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-400 ${
        animationStage === 'shrinking'
          ? 'bg-black/0 backdrop-blur-none pointer-events-none'
          : 'bg-black/75 backdrop-blur-sm'
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="streak-completion-title"
      onClick={handleShrinkToTop}
    >
      {/* Celebratory floating sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/6 animate-pulse text-amber-300 text-2xl">✨</div>
        <div className="absolute top-1/3 right-1/5 animate-bounce text-emerald-300 text-xl">🌟</div>
        <div className="absolute bottom-1/4 left-1/4 animate-ping text-amber-400 text-lg opacity-75">✦</div>
        <div className="absolute top-1/6 right-1/3 animate-pulse text-yellow-300 text-xl">✨</div>
      </div>

      {/* Main Animated Modal Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl transition-all duration-400 ${
          animationStage === 'shrinking'
            ? 'scale-25 -translate-y-96 opacity-0 ease-in'
            : 'scale-100 translate-y-0 opacity-100 ease-out bg-gradient-to-b from-slate-900 via-slate-900 to-teal-950 border border-amber-500/40 text-white'
        }`}
      >
        {/* Close button */}
        <button
          onClick={handleShrinkToTop}
          aria-label="Dismiss completion celebration"
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Floating Celebration Pill Banner that shrinks to top bar */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/30 uppercase tracking-wider mb-4 animate-in fade-in slide-in-from-top-3 duration-300">
          <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
          <span>Daily Streak Completed!</span>
        </div>

        {/* Scaling & Bouncing Flame Centerpiece */}
        <div className="relative my-4 flex items-center justify-center">
          {/* Pulsing halo aura */}
          <div className="absolute w-32 h-32 rounded-full bg-amber-500/25 blur-2xl animate-pulse" />

          {/* Scaling Fire Icon with Bounce */}
          <div
            className={`w-28 h-28 rounded-3xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 flex items-center justify-center shadow-2xl shadow-orange-500/50 transition-all duration-500 ${
              animationStage === 'enter'
                ? 'scale-0 rotate-[-20deg] opacity-0'
                : 'scale-100 rotate-0 opacity-100 animate-bounce'
            }`}
          >
            <Flame className="w-16 h-16 text-white fill-white drop-shadow-md" />
          </div>
        </div>

        {/* Counter Increment Animation Display */}
        <div className="mt-2 mb-1">
          <div className="flex items-baseline justify-center gap-1.5">
            <span
              id="streak-completion-title"
              className="text-5xl font-black font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-200 to-amber-400 drop-shadow-sm"
            >
              {displayedStreak}
            </span>
            <span className="text-xl font-bold text-amber-300">
              {displayedStreak === 1 ? 'Day' : 'Days'}
            </span>
          </div>

          <p className="font-arabic text-sm text-amber-200/90 mt-1">
            تم إكمال ورد اليوم بنجاح • ما شاء الله
          </p>
          <p className="text-xs text-slate-300 mt-0.5">
            You completed today’s {categoryName} remembrances!
          </p>
        </div>

        {/* Freeze Used / Freeze Protected Notice */}
        {freezeUsed && (
          <div className="my-3 px-3 py-2 rounded-xl bg-blue-950/60 border border-blue-500/40 text-blue-200 text-xs flex items-center gap-2 text-left">
            <ShieldCheck className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span>
              <strong>Streak Saved!</strong> Your weekly Freeze Token protected your streak for yesterday’s missed day.
            </span>
          </div>
        )}

        {/* Freeze Grace Token Active Badge */}
        {!freezeUsed && (
          <div className="my-3 px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs flex items-center justify-between text-slate-300">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Streak Freeze Grace</span>
            </div>
            <span className="font-bold text-emerald-400 font-mono">
              {freezeTokens > 0 ? '🛡️ 1 Token Active' : '0 Available'}
            </span>
          </div>
        )}

        {/* Quick Action Buttons */}
        <div className="mt-5 space-y-2">
          <button
            onClick={handleShrinkToTop}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm shadow-lg shadow-orange-500/25 transition-all transform active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Lock in & Shrink to Top Bar</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          {onShare && (
            <button
              onClick={() => {
                handleShrinkToTop();
                onShare();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Share {displayedStreak}-Day Adhkar Streak</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
