import { DhikrItem } from '../types/adhkar';

export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface TimerState {
  durationSeconds: number;
  remainingSeconds: number;
  status: TimerStatus;
}

export interface TimerPreset {
  seconds: number;
  label: string;
  malayalamLabel: string;
}

export const TIMER_PRESETS: TimerPreset[] = [
  { seconds: 30, label: '30s', malayalamLabel: '30 സെ.' },
  { seconds: 60, label: '1m', malayalamLabel: '1 മി.' },
  { seconds: 120, label: '2m', malayalamLabel: '2 മി.' },
  { seconds: 180, label: '3m', malayalamLabel: '3 മി.' },
  { seconds: 300, label: '5m', malayalamLabel: '5 മി.' },
  { seconds: 600, label: '10m', malayalamLabel: '10 മി.' },
];

export const MIN_TIMER_SECONDS = 10;
export const MAX_TIMER_SECONDS = 3600;

/**
 * Calculates a sensible recommended focus duration (in seconds) for a Dhikr item
 * based on its target repetition count, Arabic text length, and whether it is Quranic.
 */
export function getRecommendedDurationSeconds(
  item: Pick<DhikrItem, 'target' | 'arabic' | 'isQuranic'>
): number {
  const target = Math.max(1, item.target || 1);
  const arabicLength = (item.arabic || '').trim().length;

  if (target >= 100) {
    return 300; // 5 minutes for 100x dhikr sessions
  }
  if (target >= 33) {
    return 180; // 3 minutes for 33x-34x tasbih sessions
  }
  if (target >= 10) {
    return 120; // 2 minutes for 10x recitations
  }
  if (target >= 3) {
    return arabicLength > 160 || item.isQuranic ? 120 : 60;
  }
  // Single recitation (1x)
  if (arabicLength > 250 || item.isQuranic) {
    return 60; // 1 minute for longer Quranic verses like Ayat al-Kursi / Amanar-Rasul
  }
  return 30; // 30 seconds for concise single supplications
}

/**
 * Creates the initial TimerState for a given Dhikr item or custom duration.
 */
export function createInitialTimerState(durationSeconds: number): TimerState {
  const clamped = clampDurationSeconds(durationSeconds);
  return {
    durationSeconds: clamped,
    remainingSeconds: clamped,
    status: 'idle',
  };
}

/**
 * Clamps timer duration within [MIN_TIMER_SECONDS, MAX_TIMER_SECONDS].
 */
export function clampDurationSeconds(seconds: number): number {
  if (!Number.isFinite(seconds)) return 60;
  const rounded = Math.round(seconds);
  return Math.max(MIN_TIMER_SECONDS, Math.min(MAX_TIMER_SECONDS, rounded));
}

/**
 * Formats a duration in seconds into MM:SS string (e.g. 02:05).
 */
export function formatCountdown(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(Number.isFinite(totalSeconds) ? totalSeconds : 0));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Calculates elapsed progress percentage (0 to 100) for a countdown timer.
 */
export function calculateTimerProgress(
  remainingSeconds: number,
  durationSeconds: number
): number {
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
    return 0;
  }
  const safeRemaining = Math.max(0, Math.min(durationSeconds, remainingSeconds));
  const elapsed = durationSeconds - safeRemaining;
  return Math.round((elapsed / durationSeconds) * 100);
}

/**
 * Advances the timer by 1 second when in 'running' status.
 * Transitions to 'completed' when remainingSeconds reaches 0.
 */
export function tickTimer(state: TimerState): TimerState {
  if (state.status !== 'running') {
    return state;
  }
  const nextRemaining = Math.max(0, state.remainingSeconds - 1);
  if (nextRemaining === 0) {
    return {
      ...state,
      remainingSeconds: 0,
      status: 'completed',
    };
  }
  return {
    ...state,
    remainingSeconds: nextRemaining,
  };
}

/**
 * Sets a new preset or custom duration and resets remaining time to that duration.
 */
export function setTimerDuration(state: TimerState, newDurationSeconds: number): TimerState {
  const clamped = clampDurationSeconds(newDurationSeconds);
  return {
    durationSeconds: clamped,
    remainingSeconds: clamped,
    status: 'idle',
  };
}

/**
 * Adjusts the current timer by deltaSeconds (e.g. +15 or -15 seconds).
 * If idle or completed, adjusts both durationSeconds and remainingSeconds equally.
 * If running or paused, adjusts remainingSeconds (and expands durationSeconds if remaining exceeds it).
 */
export function adjustTimerDuration(state: TimerState, deltaSeconds: number): TimerState {
  if (!Number.isFinite(deltaSeconds) || deltaSeconds === 0) {
    return state;
  }

  if (state.status === 'idle' || state.status === 'completed') {
    const nextDuration = clampDurationSeconds(state.durationSeconds + deltaSeconds);
    return {
      durationSeconds: nextDuration,
      remainingSeconds: nextDuration,
      status: 'idle',
    };
  }

  // When running or paused, adjust remaining time and keep duration >= remaining
  const nextRemaining = Math.max(
    MIN_TIMER_SECONDS,
    Math.min(MAX_TIMER_SECONDS, Math.round(state.remainingSeconds + deltaSeconds))
  );
  const nextDuration = Math.max(state.durationSeconds, nextRemaining);

  return {
    ...state,
    durationSeconds: nextDuration,
    remainingSeconds: nextRemaining,
  };
}
