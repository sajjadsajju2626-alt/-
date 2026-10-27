import React, { useEffect, useState } from 'react';
import { Flame, Sparkles, CheckCircle2, Trophy, Share2 } from 'lucide-react';
import { triggerHaptic, playCompletionSound } from '../utils/audio.ts';

interface AllCompletedFireworksModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  streakCount: number;
  bestStreak: number;
  totalRecitationsToday: number;
  completedSectionsCount: number;
  soundEnabled: boolean;
  vibrateEnabled: boolean;
  onShare?: () => void;
}

interface FireworkBurst {
  id: number;
  left: string;
  top: string;
  color: string;
  delay: string;
  size: string;
}

const FIREWORK_BURSTS: FireworkBurst[] = [
  { id: 1, left: '14%', top: '18%', color: '#fbbf24', delay: '0s', size: 'w-28 h-28' },
  { id: 2, left: '82%', top: '16%', color: '#34d399', delay: '0.3s', size: 'w-32 h-32' },
  { id: 3, left: '22%', top: '72%', color: '#f43f5e', delay: '0.6s', size: 'w-24 h-24' },
  { id: 4, left: '78%', top: '68%', color: '#38bdf8', delay: '0.2s', size: 'w-28 h-28' },
  { id: 5, left: '50%', top: '12%', color: '#a78bfa', delay: '0.45s', size: 'w-36 h-36' },
  { id: 6, left: '10%', top: '45%', color: '#f59e0b', delay: '0.75s', size: 'w-24 h-24' },
  { id: 7, left: '88%', top: '42%', color: '#10b981', delay: '0.15s', size: 'w-28 h-28' },
];

const GOLD_SPARKLERS = Array.from({ length: 18 }).map((_, idx) => ({
  id: idx,
  left: `${5 + ((idx * 17) % 90)}%`,
  delay: `${(idx % 6) * 0.25}s`,
  duration: `${2.2 + (idx % 4) * 0.4}s`,
  symbol: idx % 3 === 0 ? '🎇' : idx % 3 === 1 ? '✨' : '🎆',
}));

export const AllCompletedFireworksModal: React.FC<AllCompletedFireworksModalProps> = ({
  isOpen,
  onDismiss,
  streakCount,
  bestStreak,
  totalRecitationsToday,
  completedSectionsCount,
  soundEnabled,
  vibrateEnabled,
  onShare,
}) => {
  const [dissolving, setDissolving] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setDissolving(false);
      return;
    }

    if (soundEnabled) {
      playCompletionSound();
    }
    if (vibrateEnabled) {
      triggerHaptic('complete');
      try {
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          navigator.vibrate([80, 50, 120, 50, 180]);
        }
      } catch {
        // ignore
      }
    }

    // Automatically dissolve the full-screen fireworks into the top 'Completed All Today!' bar after 4.5 seconds
    const dissolveTimer = setTimeout(() => {
      setDissolving(true);
    }, 4300);

    const closeTimer = setTimeout(() => {
      onDismiss();
    }, 4850);

    return () => {
      clearTimeout(dissolveTimer);
      clearTimeout(closeTimer);
    };
  }, [isOpen, soundEnabled, vibrateEnabled]);

  if (!isOpen) return null;

  const handleManualDismiss = () => {
    setDissolving(true);
    setTimeout(() => {
      onDismiss();
    }, 420);
  };

  const displayStreak = Math.max(1, streakCount);
  const displayBest = Math.max(displayStreak, bestStreak);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="all-completed-fireworks-title"
      data-testid="all-completed-fireworks-modal"
      onClick={handleManualDismiss}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-500 ${
        dissolving
          ? 'bg-slate-950/0 opacity-0 pointer-events-none'
          : 'bg-slate-950/80 opacity-100'
      }`}
    >
      {/* Multicolored Exploding Fireworks & Ascending Gold Glitter Sparklers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {FIREWORK_BURSTS.map((fw) => (
          <div
            key={fw.id}
            style={{
              left: fw.left,
              top: fw.top,
              animationDelay: fw.delay,
            }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 ${fw.size} animate-pulse opacity-85`}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
              {Array.from({ length: 12 }).map((_, rayIdx) => {
                const angle = (rayIdx * 30 * Math.PI) / 180;
                const x1 = 50 + Math.cos(angle) * 12;
                const y1 = 50 + Math.sin(angle) * 12;
                const x2 = 50 + Math.cos(angle) * 46;
                const y2 = 50 + Math.sin(angle) * 46;
                return (
                  <g key={rayIdx}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={fw.color}
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray="4 4"
                    />
                    <circle cx={x2} cy={y2} r="3.5" fill={fw.color} />
                  </g>
                );
              })}
            </svg>
          </div>
        ))}

        {/* Ascending Sparklers & Gold Glitter Particles */}
        {GOLD_SPARKLERS.slice(0, 10).map((sp) => (
          <div
            key={sp.id}
            style={{
              left: sp.left,
              bottom: `${8 + (sp.id % 5) * 14}%`,
            }}
            className="absolute text-xl sm:text-2xl select-none opacity-90"
          >
            {sp.symbol}
          </div>
        ))}
      </div>

      {/* Centerpiece Celebration Card (Dissolves upward into the top 'Completed All Today!' bar) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-md rounded-3xl p-6 sm:p-7 text-center transition-all duration-500 border-2 border-amber-400/90 bg-gradient-to-b from-slate-950/95 via-teal-950/95 to-slate-950/95 text-white shadow-2xl ${
          dissolving
            ? 'scale-50 -translate-y-48 opacity-0'
            : 'scale-100 translate-y-0 opacity-100'
        }`}
      >
        {/* Top Festive Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 text-xs font-black tracking-wide uppercase shadow-md mb-3">
          <span>🎆</span>
          <span>All Completed Today • 100%</span>
          <span>🎇</span>
        </div>

        {/* Gigantic Roaring Streak Flame Graphic */}
        <div className="relative my-3 flex items-center justify-center">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-red-600 via-orange-500 to-amber-300 flex items-center justify-center shadow-2xl ring-4 ring-amber-300/90">
            <Flame className="w-16 h-16 sm:w-20 sm:h-20 text-white fill-amber-100" />
          </div>
        </div>

        {/* Dynamic Streak Heading */}
        <h2
          id="all-completed-fireworks-title"
          className="text-2xl sm:text-3xl font-black tracking-tight text-amber-300 mt-1"
        >
          🔥 {displayStreak} Day Streak!
        </h2>

        {/* Malayalam 100% Celebration Message */}
        <p className="font-malayalam text-base sm:text-lg font-extrabold text-emerald-300 mt-2 leading-snug drop-shadow-xs">
          ദിവസേനയുള്ള ദിക്റുകൾ പൂർത്തിയായി! 100%!
        </p>

        {/* Gold Script: Alhamdulillah / Mashallah */}
        <div className="mt-2.5 py-2 px-4 rounded-2xl bg-amber-500/15 border border-amber-400/40">
          <p className="font-arabic text-xl sm:text-2xl font-bold text-amber-300 tracking-wide">
            الحمد لله • ما شاء الله تبارك الله
          </p>
          <p className="text-xs font-extrabold uppercase tracking-widest text-amber-200 mt-0.5">
            Alhamdulillah • Māshā’Allāh
          </p>
        </div>

        {/* Standard Statistics Highlighted in Gold Lettering */}
        <div className="grid grid-cols-3 gap-2 my-4">
          <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-amber-400/40">
            <div className="text-[10px] font-bold uppercase text-amber-200/90">
              Daily Progress
            </div>
            <div className="text-base sm:text-lg font-black font-mono text-amber-300 mt-0.5">
              100%
            </div>
            <div className="text-[10px] text-emerald-300 font-bold">
              {completedSectionsCount} Sections Done
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-amber-400/40">
            <div className="text-[10px] font-bold uppercase text-amber-200/90">
              Recitations
            </div>
            <div className="text-base sm:text-lg font-black font-mono text-amber-300 mt-0.5">
              {totalRecitationsToday}
            </div>
            <div className="text-[10px] text-amber-200/80 font-bold">
              Today’s Total
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-amber-400/40">
            <div className="text-[10px] font-bold uppercase text-amber-200/90">
              Best Streak
            </div>
            <div className="text-base sm:text-lg font-black font-mono text-amber-300 mt-0.5 flex items-center justify-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>{displayBest}d</span>
            </div>
            <div className="text-[10px] text-amber-200/80 font-bold">
              Record
            </div>
          </div>
        </div>

        {/* End-User Trigger: 'പ്രതീക്ഷയോടെ തുടരുക' (Dismiss/Continue) */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleManualDismiss}
            data-testid="dismiss-fireworks-btn"
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-sm sm:text-base shadow-lg shadow-amber-500/30 transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
            <span className="font-malayalam">പ്രതീക്ഷയോടെ തുടരുക</span>
            <span className="text-xs font-extrabold opacity-85">(Continue)</span>
          </button>

          {onShare && (
            <button
              type="button"
              onClick={() => {
                handleManualDismiss();
                onShare();
              }}
              className="w-full py-2 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-amber-200 font-bold text-xs border border-amber-400/30 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share 100% Daily Completion</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
