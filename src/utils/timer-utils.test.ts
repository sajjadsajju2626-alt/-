import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  TIMER_PRESETS,
  MIN_TIMER_SECONDS,
  MAX_TIMER_SECONDS,
  getRecommendedDurationSeconds,
  createInitialTimerState,
  clampDurationSeconds,
  formatCountdown,
  calculateTimerProgress,
  tickTimer,
  setTimerDuration,
  adjustTimerDuration,
} from './timer-utils';

describe('timer-utils', () => {
  describe('formatCountdown', () => {
    it('formats 0 seconds as 00:00', () => {
      assert.equal(formatCountdown(0), '00:00');
    });

    it('formats sub-minute seconds with leading zeros', () => {
      assert.equal(formatCountdown(9), '00:09');
      assert.equal(formatCountdown(45), '00:45');
    });

    it('formats exact and multi-minute durations properly', () => {
      assert.equal(formatCountdown(60), '01:00');
      assert.equal(formatCountdown(125), '02:05');
      assert.equal(formatCountdown(600), '10:00');
    });

    it('clamps negative or NaN values safely to 00:00', () => {
      assert.equal(formatCountdown(-15), '00:00');
      assert.equal(formatCountdown(Number.NaN), '00:00');
    });
  });

  describe('getRecommendedDurationSeconds', () => {
    it('recommends 300s (5m) for 100x target adhkar', () => {
      const duration = getRecommendedDurationSeconds({
        target: 100,
        arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
        isQuranic: false,
      });
      assert.equal(duration, 300);
    });

    it('recommends 180s (3m) for 33x target adhkar', () => {
      const duration = getRecommendedDurationSeconds({
        target: 33,
        arabic: 'سُبْحَانَ اللَّهِ',
        isQuranic: false,
      });
      assert.equal(duration, 180);
    });

    it('recommends 120s (2m) for 10x target adhkar', () => {
      const duration = getRecommendedDurationSeconds({
        target: 10,
        arabic: 'لَا إِلَهَ إِلَّا اللَّهُ',
        isQuranic: false,
      });
      assert.equal(duration, 120);
    });

    it('recommends 120s for 3x Quranic surahs and 60s for short 3x adhkar', () => {
      const quranic3x = getRecommendedDurationSeconds({
        target: 3,
        arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
        isQuranic: true,
      });
      assert.equal(quranic3x, 120);

      const short3x = getRecommendedDurationSeconds({
        target: 3,
        arabic: 'بِسْمِ اللَّهِ',
        isQuranic: false,
      });
      assert.equal(short3x, 60);
    });

    it('recommends 60s for 1x Quranic verses and 30s for concise 1x supplications', () => {
      const quranic1x = getRecommendedDurationSeconds({
        target: 1,
        arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
        isQuranic: true,
      });
      assert.equal(quranic1x, 60);

      const short1x = getRecommendedDurationSeconds({
        target: 1,
        arabic: 'بِاسْمِكَ رَبِّي',
        isQuranic: false,
      });
      assert.equal(short1x, 30);
    });
  });

  describe('calculateTimerProgress', () => {
    it('returns 0 when timer has not started', () => {
      assert.equal(calculateTimerProgress(120, 120), 0);
    });

    it('returns 50 when half of duration has elapsed', () => {
      assert.equal(calculateTimerProgress(60, 120), 50);
    });

    it('returns 100 when remainingSeconds reaches 0', () => {
      assert.equal(calculateTimerProgress(0, 120), 100);
    });

    it('handles invalid or zero duration gracefully', () => {
      assert.equal(calculateTimerProgress(10, 0), 0);
    });
  });

  describe('tickTimer', () => {
    it('does not decrement when idle or paused', () => {
      const idle = createInitialTimerState(60);
      assert.deepEqual(tickTimer(idle), idle);

      const paused = { ...idle, status: 'paused' as const };
      assert.deepEqual(tickTimer(paused), paused);
    });

    it('decrements remainingSeconds by 1 when running', () => {
      const running = { durationSeconds: 60, remainingSeconds: 60, status: 'running' as const };
      const next = tickTimer(running);
      assert.equal(next.remainingSeconds, 59);
      assert.equal(next.status, 'running');
    });

    it('transitions to completed when remainingSeconds hits 0', () => {
      const lastSecond = { durationSeconds: 60, remainingSeconds: 1, status: 'running' as const };
      const finished = tickTimer(lastSecond);
      assert.equal(finished.remainingSeconds, 0);
      assert.equal(finished.status, 'completed');
    });
  });

  describe('setTimerDuration & adjustTimerDuration', () => {
    it('sets new duration and resets status to idle', () => {
      const running = { durationSeconds: 60, remainingSeconds: 25, status: 'running' as const };
      const updated = setTimerDuration(running, 180);
      assert.deepEqual(updated, {
        durationSeconds: 180,
        remainingSeconds: 180,
        status: 'idle',
      });
    });

    it('clamps duration between MIN_TIMER_SECONDS and MAX_TIMER_SECONDS', () => {
      assert.equal(clampDurationSeconds(2), MIN_TIMER_SECONDS);
      assert.equal(clampDurationSeconds(9999), MAX_TIMER_SECONDS);
    });

    it('adjusts idle timer duration and remainingSeconds together', () => {
      const initial = createInitialTimerState(60);
      const plus15 = adjustTimerDuration(initial, 15);
      assert.equal(plus15.durationSeconds, 75);
      assert.equal(plus15.remainingSeconds, 75);
      assert.equal(plus15.status, 'idle');
    });

    it('adjusts running timer remainingSeconds and expands duration if needed', () => {
      const running = { durationSeconds: 60, remainingSeconds: 50, status: 'running' as const };
      const plus20 = adjustTimerDuration(running, 20);
      assert.equal(plus20.remainingSeconds, 70);
      assert.equal(plus20.durationSeconds, 70);
      assert.equal(plus20.status, 'running');
    });

    it('exposes standard presets', () => {
      assert.ok(TIMER_PRESETS.length >= 6);
      assert.equal(TIMER_PRESETS[0].seconds, 30);
    });
  });
});
