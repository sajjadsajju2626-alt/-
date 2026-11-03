import React, { useEffect, useState } from 'react';
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

const GOLD_STAR_PARTICLES = [
  { char: '✨', tx: '-74px', ty: '-66px', rot: '-35deg', delay: '0.02s', size: 'text-2xl text-amber-300' },
  { char: '★', tx: '76px', ty: '-60px', rot: '40deg', delay: '0.05s', size: 'text-xl text-yellow-300' },
  { char: '✦', tx: '-92px', ty: '-10px', rot: '-60deg', delay: '0.09s', size: 'text-lg text-amber-200' },
  { char: '✨', tx: '94px', ty: '-14px', rot: '55deg', delay: '0.07s', size: 'text-2xl text-yellow-400' },
  { char: '★', tx: '-58px', ty: '50px', rot: '-25deg', delay: '0.11s', size: 'text-base text-amber-300' },
  { char: '✦', tx: '62px', ty: '46px', rot: '30deg', delay: '0.13s', size: 'text-lg text-yellow-200' },
  { char: '✨', tx: '0px', ty: '-92px', rot: '15deg', delay: '0.04s', size: 'text-xl text-amber-400' },
  { char: '●', tx: '-36px', ty: '-82px', rot: '-20deg', delay: '0.08s', size: 'text-sm text-yellow-300' },
  { char: '●', tx: '40px', ty: '-80px', rot: '20deg', delay: '0.10s', size: 'text-sm text-amber-300' },
];

const CATEGORY_MALAYALAM_TITLES: Record<string, string> = {
  morning: 'പ്രഭാത ദിക്റുകൾ പൂർത്തിയായി!',
  evening: 'പ്രദോഷ ദിക്റുകൾ പൂർത്തിയായി!',
  prayer: 'നമസ്കാര ശേഷമുള്ള ദിക്റുകൾ പൂർത്തിയായി!',
  sleep: 'ഉറങ്ങാൻ നേരമുള്ള ദിക്റുകൾ പൂർത്തിയായി!',
  tasks: 'പ്രതിദിന കർമ്മങ്ങൾ പൂർത്തിയായി!',
  favorites: 'പ്രിയപ്പെട്ട ദിക്റുകൾ പൂർത്തിയായി!',
};

export const SectionCompletionFireOverlay: React.FC<SectionCompletionFireOverlayProps> = ({
  event,
  onDismiss,
  soundEnabled,
  vibrateEnabled,
}) => {
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    if (!event) return;

    setFadingOut(false);

    if (soundEnabled) {
      playCompletionSound();
    }
    if (vibrateEnabled) {
      triggerHaptic('complete');
      try {
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          navigator.vibrate([60, 40, 60]);
        }
      } catch {
        // ignore
      }
    }

    const fadeTimer = setTimeout(() => {
      setFadingOut(true);
    }, 1700);

    const removeTimer = setTimeout(() => {
      onDismiss();
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [event, soundEnabled, vibrateEnabled]);

  if (!event) return null;

  const dynamicMalayalamTitle =
    CATEGORY_MALAYALAM_TITLES[event.sectionKey] || 'പ്രഭാത ദിക്റുകൾ പൂർത്തിയായി!';

  return (
    <div
      role="status"
      aria-live="polite"
      data-testid="section-completion-fire-overlay"
      onClick={onDismiss}
      style={{
        backdropFilter: 'blur(5px) brightness(0.6)',
        WebkitBackdropFilter: 'blur(5px) brightness(0.6)',
        background: 'rgba(0, 0, 0, 0.28)',
      }}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center px-4 select-none cursor-pointer transition-opacity duration-300 ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <style>{`
        @keyframes reactFreeFlameIgniteBounce {
          0% {
            transform: scale(0.35) translateY(24px);
            opacity: 0;
            filter: drop-shadow(0 0 12px rgba(255, 165, 0, 0.6));
          }
          45% {
            transform: scale(1.18) translateY(-10px);
            opacity: 1;
            filter: drop-shadow(0 0 32px rgba(255, 215, 0, 0.95)) drop-shadow(0 0 60px rgba(255, 120, 0, 0.75));
          }
          70% {
            transform: scale(0.96) translateY(2px);
            filter: drop-shadow(0 0 24px rgba(255, 200, 0, 0.85));
          }
          100% {
            transform: scale(1.04) translateY(-4px);
            opacity: 1;
            filter: drop-shadow(0 0 28px rgba(255, 215, 0, 0.9)) drop-shadow(0 0 48px rgba(255, 140, 0, 0.65));
          }
        }
        @keyframes reactFreeGoldStarScatter {
          0% {
            transform: translate(0, 0) scale(0.2) rotate(0deg);
            opacity: 0;
          }
          25% {
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx, 0px), var(--ty, -60px)) scale(1.15) rotate(var(--rot, 45deg));
            opacity: 0;
          }
        }
      `}</style>

      {/* Free-floating Bouncing/Igniting Fire & Scattering Gold Stars/Particles (NO card or box) */}
      <div className="relative flex items-center justify-center mb-3 pointer-events-none">
        {GOLD_STAR_PARTICLES.map((p, idx) => (
          <span
            key={idx}
            className={`absolute pointer-events-none ${p.size}`}
            style={{
              ['--tx' as string]: p.tx,
              ['--ty' as string]: p.ty,
              ['--rot' as string]: p.rot,
              animation: `reactFreeGoldStarScatter 1.55s cubic-bezier(0.16, 1, 0.3, 1) ${p.delay} forwards`,
              textShadow: '0 0 12px rgba(255, 215, 0, 0.95), 0 2px 8px rgba(0, 0, 0, 0.8)',
            }}
          >
            {p.char}
          </span>
        ))}

        <div
          className="text-7xl sm:text-8xl leading-none select-none"
          style={{
            animation: 'reactFreeFlameIgniteBounce 0.75s cubic-bezier(0.22, 1, 0.36, 1) forwards',
            textShadow: '0 4px 15px rgba(0, 0, 0, 0.9), 0 0 25px rgba(255, 165, 0, 0.85)',
          }}
        >
          🔥
        </div>
      </div>

      {/* Glowing Large Golden Arabic Calligraphy Centered Directly Below Fire */}
      <div
        dir="rtl"
        className="pointer-events-none font-arabic text-4xl sm:text-5xl font-bold text-amber-300 text-center tracking-wide mb-2"
        style={{
          textShadow: '0 4px 15px rgba(0, 0, 0, 0.9), 0 0 10px rgba(255, 215, 0, 0.5)',
        }}
      >
        مَا شَاءَ اللَّه
      </div>

      {/* Celebratory Category Completion Text in Bold Glowing White and Gold */}
      <div className="pointer-events-none text-center space-y-1.5">
        <div
          className="font-malayalam text-xl sm:text-2xl font-extrabold text-white tracking-tight"
          style={{
            textShadow: '0 4px 15px rgba(0, 0, 0, 0.9), 0 0 10px rgba(255, 215, 0, 0.5)',
          }}
        >
          {dynamicMalayalamTitle}
        </div>
        <div
          className="font-malayalam text-sm sm:text-base font-extrabold text-amber-300 tracking-wide"
          style={{
            textShadow: '0 4px 15px rgba(0, 0, 0, 0.9), 0 0 10px rgba(255, 215, 0, 0.5)',
          }}
        >
          വിഭാഗം പൂർത്തിയായി! • Category Completed!
        </div>
      </div>
    </div>
  );
};


