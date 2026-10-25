import React, { useState, useEffect } from 'react';
import { RotateCcw, Volume2, VolumeX, Sparkles, Plus, Award } from 'lucide-react';
import { TASBIH_PRESETS } from '../data/adhkarData.ts';
import { playTapSound, playCompletionSound, triggerHaptic } from '../utils/audio.ts';
import { ThemeMode } from '../types/adhkar.ts';

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
  const [count, setCount] = useState<number>(() => {
    const saved = localStorage.getItem('adhkar_tasbih_count');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [laps, setLaps] = useState<number>(() => {
    const saved = localStorage.getItem('adhkar_tasbih_laps');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [target, setTarget] = useState<number>(33);
  const [isPressing, setIsPressing] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('adhkar_tasbih_count', count.toString());
  }, [count]);

  useEffect(() => {
    localStorage.setItem('adhkar_tasbih_laps', laps.toString());
  }, [laps]);

  const activePreset = TASBIH_PRESETS.find((p) => p.id === selectedPresetId);

  // Keyboard support (Space to count)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (e.target as HTMLElement).tagName !== 'INPUT') {
        e.preventDefault();
        handleTap();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const handleTap = () => {
    setIsPressing(true);
    setTimeout(() => setIsPressing(false), 120);

    const nextCount = count + 1;

    if (soundEnabled) {
      playTapSound();
    }
    if (vibrateEnabled) {
      triggerHaptic('tap');
    }

    if (target > 0 && nextCount >= target) {
      // Completed a cycle!
      setCount(0);
      setLaps((l) => l + 1);
      if (soundEnabled) {
        setTimeout(playCompletionSound, 50);
      }
      if (vibrateEnabled) {
        triggerHaptic('complete');
      }
    } else {
      setCount(nextCount);
    }
  };

  const handleReset = () => {
    if (count > 0 || laps > 0) {
      if (window.confirm('Reset tasbih count and completed cycles?')) {
        setCount(0);
        setLaps(0);
        if (vibrateEnabled) triggerHaptic('reset');
      }
    }
  };

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    setIsCustom(false);
    const p = TASBIH_PRESETS.find((item) => item.id === presetId);
    if (p) {
      setTarget(p.target);
      setCount(0);
    }
  };

  const isDark = theme === 'dark' || theme === 'midnight';
  const progressRatio = target > 0 ? (count / target) * 100 : 0;

  return (
    <div className="max-w-md mx-auto py-2">
      {/* Preset Selector Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
        {TASBIH_PRESETS.map((preset) => {
          const isSelected = !isCustom && selectedPresetId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset.id)}
              className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all font-medium ${
                isSelected
                  ? 'bg-teal-700 text-white shadow-sm'
                  : isDark
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200/60'
              }`}
            >
              {preset.transliteration}
            </button>
          );
        })}
        <button
          onClick={() => {
            setIsCustom(true);
            setCount(0);
          }}
          className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all font-medium flex items-center gap-1 ${
            isCustom
              ? 'bg-teal-700 text-white'
              : isDark
              ? 'bg-slate-800 text-slate-300'
              : 'bg-teal-50 text-teal-800 border border-teal-200/60'
          }`}
        >
          <Plus className="w-3 h-3" />
          Custom
        </button>
      </div>

      {/* Active Dhikr Card Display */}
      <div
        className={`rounded-2xl p-5 mb-5 text-center border shadow-sm ${
          isDark
            ? 'bg-slate-900 border-slate-800'
            : 'bg-white border-teal-100 shadow-teal-50/50'
        }`}
      >
        {isCustom ? (
          <div>
            <label
              htmlFor="custom-dhikr-input"
              className="block text-xs font-medium text-teal-700 dark:text-teal-300 mb-1"
            >
              Enter custom remembrance / intention
            </label>
            <input
              id="custom-dhikr-input"
              type="text"
              placeholder="e.g. Subhānallāh wa bihamdihi"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl text-center text-sm border focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            />
          </div>
        ) : (
          activePreset && (
            <div>
              <div
                dir="rtl"
                className={`font-arabic text-3xl font-bold tracking-wide mb-1 ${
                  isDark ? 'text-teal-300' : 'text-teal-800'
                }`}
              >
                {activePreset.arabic}
              </div>
              <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {activePreset.transliteration}
              </div>
              {activePreset.malayalamTranslation && (
                <div className="font-malayalam text-xs text-emerald-700 dark:text-emerald-300 mt-1 font-medium">
                  {activePreset.malayalamTranslation}
                </div>
              )}
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {activePreset.translation}
              </div>
            </div>
          )
        )}
      </div>

      {/* Target and Lap Indicators */}
      <div className="flex items-center justify-between text-xs px-2 mb-4">
        {/* Target Buttons */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            Target:
          </span>
          {[33, 99, 100, 0].map((t) => (
            <button
              key={t}
              onClick={() => {
                setTarget(t);
                setCount(0);
              }}
              className={`px-2 py-0.5 rounded-md font-mono transition-colors ${
                target === t
                  ? 'bg-amber-500 text-white font-bold'
                  : isDark
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t === 0 ? '∞ Free' : t}
            </button>
          ))}
        </div>

        {/* Laps counter */}
        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300 font-medium">
          <Award className="w-3.5 h-3.5 text-amber-500" />
          <span>Cycles:</span>
          <span className="font-mono font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-1.5 py-0.2 rounded">
            {laps}
          </span>
        </div>
      </div>

      {/* Large Interactive Digital Bead Tap Surface */}
      <div className="flex flex-col items-center justify-center my-4">
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

          <div className="flex flex-col items-center z-10">
            <span className="text-teal-200/80 text-xs tracking-wider uppercase font-semibold mb-1">
              {target > 0 ? `Goal: ${target}` : 'Free Counter'}
            </span>
            <span className="text-6xl sm:text-7xl font-mono font-black text-white tracking-tighter drop-shadow-md">
              {count}
            </span>
            <span className="text-teal-200/70 text-xs mt-2 flex items-center gap-1 font-medium">
              <span>Tap Anywhere</span>
              <span className="text-[10px] hidden sm:inline">(or Spacebar)</span>
            </span>
          </div>
        </button>
      </div>

      {/* Bottom Controls */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={handleReset}
          aria-label="Reset Tasbih count"
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
            isDark
              ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
              : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-sm'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Counter</span>
        </button>
      </div>
    </div>
  );
};
