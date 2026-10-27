import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Award, Undo2, Plus, AlertCircle, X } from 'lucide-react';
import { TASBIH_PRESETS } from '../data/adhkarData.ts';
import { playTapSound, playCompletionSound, triggerHaptic } from '../utils/audio.ts';
import { ThemeMode } from '../types/adhkar.ts';
import { undoTasbih, resetTasbih } from '../utils/tasbih-utils.ts';

interface TasbihCounterProps {
  soundEnabled: boolean;
  vibrateEnabled: boolean;
  theme: ThemeMode;
}

export const TasbihCounter: React.FC<TasbihCounterProps> = ({
  soundEnabled,
  vibrateEnabled,
  theme,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('subhanallah');
  const [customText, setCustomText] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);

  // Persistent count & laps
  const [count, setCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('adhkar_tasbih_count');
      return saved ? Math.max(0, parseInt(saved, 10)) : 0;
    } catch {
      return 0;
    }
  });

  const [laps, setLaps] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('adhkar_tasbih_laps');
      return saved ? Math.max(0, parseInt(saved, 10)) : 0;
    } catch {
      return 0;
    }
  });

  const [target, setTarget] = useState<number>(33);
  const [isPressing, setIsPressing] = useState<boolean>(false);

  // Undo history stack
  const [history, setHistory] = useState<{ count: number; laps: number }[]>([]);

  // In-app reset confirmation state (avoids prohibited/blocked window.confirm)
  const [isConfirmingReset, setIsConfirmingReset] = useState<boolean>(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear pending reset timer on unmount
  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  // Sync to localStorage whenever count or laps change
  useEffect(() => {
    try {
      localStorage.setItem('adhkar_tasbih_count', count.toString());
    } catch {
      // storage quota
    }
  }, [count]);

  useEffect(() => {
    try {
      localStorage.setItem('adhkar_tasbih_laps', laps.toString());
    } catch {
      // storage quota
    }
  }, [laps]);

  const activePreset = TASBIH_PRESETS.find((p) => p.id === selectedPresetId);

  // Reliable tap count increment
  const handleTap = () => {
    setIsPressing(true);
    setTimeout(() => setIsPressing(false), 120);

    // Save previous snapshot into undo history stack
    setHistory((prev) => [...prev.slice(-40), { count, laps }]);

    const nextCount = count + 1;

    if (target > 0 && nextCount >= target) {
      // Completed a cycle
      setCount(0);
      setLaps((l) => l + 1);

      try {
        localStorage.setItem('adhkar_tasbih_count', '0');
        localStorage.setItem('adhkar_tasbih_laps', (laps + 1).toString());
      } catch {
        // ignore
      }

      if (soundEnabled) {
        setTimeout(playCompletionSound, 40);
      }
      if (vibrateEnabled) {
        triggerHaptic('complete');
      }
    } else {
      setCount(nextCount);

      try {
        localStorage.setItem('adhkar_tasbih_count', nextCount.toString());
      } catch {
        // ignore
      }

      if (soundEnabled) {
        playTapSound();
      }
      if (vibrateEnabled) {
        triggerHaptic('tap');
      }
    }
  };

  // Reliable undo / decrement with immediate sound, haptic, and UI synchronization
  const handleUndo = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    const res = undoTasbih({ count, laps, target }, history);
    if (!res.canUndo) return;

    setCount(res.nextState.count);
    setLaps(res.nextState.laps);
    setHistory(res.newHistory);

    try {
      localStorage.setItem('adhkar_tasbih_count', res.nextState.count.toString());
      localStorage.setItem('adhkar_tasbih_laps', res.nextState.laps.toString());
    } catch {
      // ignore
    }

    // Audible click & tactile haptic on undo
    if (soundEnabled) {
      playTapSound();
    }
    if (vibrateEnabled) {
      triggerHaptic('tap');
    }
  };

  // Initiate or confirm reset (eliminates window.confirm which is blocked in iframes)
  const handleResetRequest = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (count === 0 && laps === 0) return;

    if (!isConfirmingReset) {
      setIsConfirmingReset(true);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      // Generous 15-second window so user has ample time to confirm or cancel
      resetTimerRef.current = setTimeout(() => {
        setIsConfirmingReset(false);
      }, 15000);
    } else {
      executeReset(e);
    }
  };

  const cancelReset = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    setIsConfirmingReset(false);
  };

  // Execute clean reset while saving previous snapshot for immediate undo
  const executeReset = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);

    const res = resetTasbih({ count, laps, target }, history);
    if (!res.didReset) return;

    setCount(0);
    setLaps(0);
    setHistory(res.newHistory);
    setIsConfirmingReset(false);

    try {
      localStorage.setItem('adhkar_tasbih_count', '0');
      localStorage.setItem('adhkar_tasbih_laps', '0');
    } catch {
      // ignore
    }

    if (soundEnabled) playTapSound();
    if (vibrateEnabled) triggerHaptic('reset');

    setResetMessage('تَمَّ تصفيرُ الْعَدَّادِ (يُمْكِنُكَ التَّرَاجُعُ)');
    setTimeout(() => {
      setResetMessage(null);
    }, 3500);
  };

  // Switch preset
  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    setIsCustom(false);
    const p = TASBIH_PRESETS.find((item) => item.id === presetId);
    if (p) {
      setTarget(p.target);
      setCount(0);
      setHistory([]);
      try {
        localStorage.setItem('adhkar_tasbih_count', '0');
      } catch {
        // ignore
      }
    }
  };

  // Keyboard support: Space to count, Backspace / 'z' to undo, 'r' to reset, Escape to cancel reset
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleTap();
      } else if (e.code === 'Backspace' || e.key.toLowerCase() === 'z') {
        e.preventDefault();
        handleUndo();
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        handleResetRequest();
      } else if (e.key === 'Escape' && isConfirmingReset) {
        e.preventDefault();
        cancelReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [count, laps, target, history, soundEnabled, vibrateEnabled, isConfirmingReset]);

  const isDark = theme === 'dark' || theme === 'midnight';
  const progressRatio = target > 0 ? (count / target) * 100 : 0;
  const canUndo = count > 0 || laps > 0 || history.length > 0;

  return (
    <div className="max-w-md mx-auto py-2">
      {/* Arabic Header Banner */}
      <div
        className={`rounded-2xl p-3.5 mb-3.5 text-center border shadow-xs ${
          isDark
            ? 'bg-gradient-to-r from-slate-900 via-teal-950/50 to-slate-900 border-teal-800/40 text-slate-100'
            : 'bg-gradient-to-r from-teal-50 via-emerald-50 to-teal-50 border-teal-400 text-black shadow-xs'
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          <span className="text-xl">📿</span>
          <h2 className={`text-base sm:text-lg font-black font-arabic tracking-wide ${isDark ? 'text-teal-200' : 'text-black'}`}>
            السَّبْحَةُ الإِلِكْتُرُونِيَّة
          </h2>
        </div>
        <p className={`font-arabic text-xs sm:text-sm mt-0.5 leading-relaxed font-black ${isDark ? 'text-teal-300' : 'text-black'}`}>
          «فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ»
        </p>
      </div>

      {/* Preset Selector Chips with authentic Arabic titles */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-3.5 no-scrollbar">
        {TASBIH_PRESETS.map((preset) => {
          const isSelected = !isCustom && selectedPresetId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0 ${
                isSelected
                  ? 'bg-teal-900 text-white shadow-md shadow-teal-950/30 ring-2 ring-teal-500 font-black'
                  : isDark
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 font-medium'
                  : 'bg-white text-black hover:bg-teal-50 border-2 border-teal-400 shadow-xs font-black'
              }`}
            >
              <span className="font-arabic text-sm font-black">{preset.arabic}</span>
            </button>
          );
        })}
        <button
          onClick={() => {
            setIsCustom(true);
            setCount(0);
            setHistory([]);
            try {
              localStorage.setItem('adhkar_tasbih_count', '0');
            } catch {
              // ignore
            }
          }}
          className={`px-3.5 py-2 rounded-2xl text-xs whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0 ${
            isCustom
              ? 'bg-teal-900 text-white shadow-md ring-2 ring-teal-500 font-black'
              : isDark
              ? 'bg-slate-800 text-slate-300 border border-slate-700 font-medium'
              : 'bg-white text-black border-2 border-teal-400 shadow-xs font-black'
          }`}
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span className="font-arabic text-sm font-black">ذِكْرٌ مُخَصَّصٌ</span>
        </button>
      </div>

      {/* Active Dhikr Display Card */}
      <div
        className={`rounded-2xl p-4 sm:p-5 mb-4 text-center border shadow-sm ${
          isDark
            ? 'bg-slate-900 border-slate-800'
            : 'bg-white border-slate-400 shadow-slate-200'
        }`}
      >
        {isCustom ? (
          <div>
            <label
              htmlFor="custom-dhikr-input"
              className={`block text-sm font-black font-arabic mb-1.5 text-center ${isDark ? 'text-teal-300' : 'text-black'}`}
            >
              اُكْتُبِ الذِّكْرَ أَوِ الدُّعَاءَ الْمُخَصَّصَ هُنَا:
            </label>
            <input
              id="custom-dhikr-input"
              type="text"
              dir="auto"
              placeholder="مِثَال: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className={`w-full px-3 py-2.5 rounded-xl text-center text-sm sm:text-base font-arabic font-black border focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                  : 'bg-slate-50 border-slate-400 text-black placeholder-slate-700 shadow-xs'
              }`}
            />
          </div>
        ) : (
          activePreset && (
            <div>
              <div
                dir="rtl"
                className={`font-arabic text-3xl sm:text-4xl font-black tracking-wide mb-1 leading-relaxed ${
                  isDark ? 'text-teal-300' : 'text-black'
                }`}
              >
                {activePreset.arabic}
              </div>
              <div className={`text-sm font-extrabold mt-0.5 ${isDark ? 'text-slate-100' : 'text-black'}`}>
                {activePreset.transliteration}
              </div>
              {activePreset.malayalamTranslation && (
                <div className={`font-malayalam text-xs sm:text-sm mt-1 font-extrabold leading-relaxed ${isDark ? 'text-emerald-300' : 'text-black'}`}>
                  {activePreset.malayalamTranslation}
                </div>
              )}
              <div className={`text-xs sm:text-sm mt-0.5 ${isDark ? 'text-slate-300 font-medium' : 'text-black font-bold'}`}>
                {activePreset.translation}
              </div>
            </div>
          )
        )}
      </div>

      {/* Target Selector and Lap/Cycle Indicators with Arabic Font */}
      <div className="flex flex-wrap items-center justify-between text-xs px-2 mb-3 gap-2">
        {/* Target Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`font-arabic font-black text-xs ${isDark ? 'text-slate-200' : 'text-black'}`}>
            الْهَدَفُ:
          </span>
          {[33, 99, 100, 0].map((t) => (
            <button
              key={t}
              onClick={() => {
                setTarget(t);
                setCount(0);
                setHistory([]);
                try {
                  localStorage.setItem('adhkar_tasbih_count', '0');
                } catch {
                  // ignore
                }
              }}
              className={`px-3 py-1 rounded-lg font-black transition-all cursor-pointer font-mono text-xs ${
                target === t
                  ? 'bg-amber-500 text-black shadow-xs ring-2 ring-amber-400'
                  : isDark
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-white text-black hover:bg-slate-200 border border-slate-400'
              }`}
            >
              {t === 0 ? <span className="font-arabic font-black">حُرّ (∞)</span> : t}
            </button>
          ))}
        </div>

        {/* Laps / Cycles Counter */}
        <div className={`flex items-center gap-1.5 font-black px-2.5 py-1 rounded-xl shadow-xs border ${
          isDark
            ? 'text-slate-300 bg-amber-950/40 border-amber-700/60'
            : 'text-black bg-amber-100 border-amber-500'
        }`}>
          <Award className={`w-3.5 h-3.5 ${isDark ? 'text-amber-400' : 'text-amber-800 stroke-[2.5]'}`} />
          <span className="font-arabic text-xs font-black">الدَّوْرَاتُ:</span>
          <span className={`font-mono font-black text-sm ${isDark ? 'text-amber-400' : 'text-black'}`}>
            {laps}
          </span>
        </div>
      </div>

      {/* Large Interactive Digital Bead Tap Surface */}
      <div className="flex flex-col items-center justify-center my-3 relative">
        <button
          type="button"
          onClick={handleTap}
          aria-label={`Digital tasbih counter. Current count is ${count}${
            target > 0 ? ` out of ${target}` : ''
          }. Tap to count or press spacebar.`}
          className={`w-64 h-64 sm:w-72 sm:h-72 rounded-full relative flex flex-col items-center justify-center cursor-pointer select-none transition-transform duration-100 focus:outline-none focus:ring-4 focus:ring-teal-500/40 ${
            isPressing ? 'scale-95' : 'scale-100'
          } ${
            isDark
              ? 'bg-gradient-to-b from-teal-900 to-slate-950 border-4 border-teal-700/60 shadow-2xl shadow-teal-950'
              : 'bg-gradient-to-b from-teal-700 to-teal-900 border-4 border-teal-600 shadow-2xl shadow-teal-800/30'
          }`}
        >
          {/* Circular SVG Progress Ring */}
          {target > 0 && (
            <svg
              className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-1.5"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="46"
                className="stroke-teal-950/40"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="46"
                className="stroke-amber-400 transition-all duration-150"
                strokeWidth="4"
                strokeDasharray="289"
                strokeDashoffset={289 - (289 * progressRatio) / 100}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          )}

          <div className="flex flex-col items-center z-10 px-4 text-center">
            {/* Arabic Dhikr Label preview inside bead */}
            {!isCustom && activePreset && (
              <span className="font-arabic text-teal-200 text-sm sm:text-base font-bold mb-1 opacity-90 truncate max-w-[200px]">
                {activePreset.arabic}
              </span>
            )}

            {/* Goal in Arabic font */}
            <span className="font-arabic text-teal-200/90 text-xs font-semibold mb-1">
              {target > 0 ? `الْهَدَفُ: ${target}` : 'تَسْبِيحٌ حُرّ'}
            </span>

            {/* Large Counter in English Digits */}
            <div className="my-1">
              <span className="text-6xl sm:text-7xl font-mono font-black text-white tracking-tight drop-shadow-md select-none">
                {count}
              </span>
            </div>

            {/* Tap Instruction in Arabic font */}
            <div className="mt-1 flex flex-col items-center">
              <span className="font-arabic text-sm text-teal-100 font-bold tracking-wide">
                اِضْغَطْ فِي أَيِّ مَكَانٍ لِلْعَدِّ
              </span>
              <span className="font-arabic text-[11px] text-teal-200/80 font-medium">
                (أَوْ مِسْطَرَةُ الْمَسَافَةِ • Spacebar)
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* Prominent Action Controls: Undo and Reset with Arabic Font Labels */}
      <div className="flex items-center justify-center gap-3 mt-4">
        {/* Dedicated Undo Button */}
        <button
          type="button"
          onClick={handleUndo}
          disabled={!canUndo}
          aria-label="Undo last tasbih count (-1)"
          title="تَرَاجُعٌ عَنِ الْعَدِّ • Undo last count"
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 border cursor-pointer active:scale-95 ${
            canUndo
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-600 shadow-md shadow-amber-500/30'
              : 'opacity-40 pointer-events-none bg-slate-200 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700'
          }`}
        >
          <Undo2 className="w-4 h-4 stroke-[2.5]" />
          <span className="font-arabic text-sm font-black">تَرَاجُعٌ (-1)</span>
        </button>

        {/* Reset Button with Safe In-App Confirmation (Replaces blocked window.confirm) */}
        {isConfirmingReset ? (
          <div className="flex-1 flex items-center gap-1.5 animate-in fade-in duration-150">
            <button
              type="button"
              onClick={executeReset}
              aria-label="Confirm reset tasbih"
              title="تَأْكِيدُ التَّصْفِيرِ • Confirm Reset"
              className="flex-1 py-3 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 bg-rose-700 hover:bg-rose-600 text-white border border-rose-600 shadow-md shadow-rose-700/40 cursor-pointer active:scale-95 animate-pulse"
            >
              <AlertCircle className="w-4 h-4 stroke-[2.5]" />
              <span className="font-arabic text-sm font-black">تَأْكِيدُ التَّصْفِيرِ</span>
            </button>
            <button
              type="button"
              onClick={cancelReset}
              aria-label="Cancel reset"
              title="إِلْغَاءٌ • Cancel"
              className="py-3 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 cursor-pointer active:scale-95 border border-slate-300 dark:border-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleResetRequest}
            disabled={count === 0 && laps === 0}
            aria-label="Reset Tasbih count"
            title="إِعَادَةُ ضَبْطِ الْعَدَّادِ • Reset Counter"
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 border cursor-pointer active:scale-95 ${
              count > 0 || laps > 0
                ? isDark
                  ? 'bg-slate-800 border-slate-700 text-slate-200 hover:text-white hover:bg-slate-700'
                  : 'bg-white border-slate-300 text-slate-950 hover:text-black hover:bg-slate-100 shadow-xs'
                : 'opacity-40 pointer-events-none bg-slate-200 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span className="font-arabic text-sm font-black">إِعَادَةُ ضَبْطٍ</span>
          </button>
        )}
      </div>

      {/* Undoable Reset Notification */}
      {resetMessage && (
        <div className="mt-2 text-center text-xs text-teal-950 dark:text-teal-400 font-arabic font-bold animate-in fade-in slide-in-from-top-1 duration-200">
          {resetMessage}
        </div>
      )}
    </div>
  );
};
