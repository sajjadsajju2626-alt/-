import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  toArabicDigits,
  incrementTasbih,
  decrementTasbih,
  undoTasbih,
  resetTasbih,
} from './tasbih-utils.ts';

describe('Tasbih Utilities & Arabic Digits', () => {
  it('converts Western numbers to Eastern Arabic numerals correctly', () => {
    assert.equal(toArabicDigits(0), '٠');
    assert.equal(toArabicDigits(1), '١');
    assert.equal(toArabicDigits(33), '٣٣');
    assert.equal(toArabicDigits(99), '٩٩');
    assert.equal(toArabicDigits(100), '١٠٠');
    assert.equal(toArabicDigits('2026'), '٢٠٢٦');
  });

  it('increments count normally below target', () => {
    const initial = { count: 12, laps: 2, target: 33 };
    const { nextState, completedLap } = incrementTasbih(initial);
    assert.equal(nextState.count, 13);
    assert.equal(nextState.laps, 2);
    assert.equal(completedLap, false);
  });

  it('completes a lap when reaching target and resets count to 0', () => {
    const atTarget = { count: 32, laps: 1, target: 33 };
    const { nextState, completedLap } = incrementTasbih(atTarget);
    assert.equal(nextState.count, 0);
    assert.equal(nextState.laps, 2);
    assert.equal(completedLap, true);
  });

  it('directly decrements count by 1 with decrementTasbih', () => {
    const current = { count: 5, laps: 0, target: 33 };
    const { nextState, didDecrement } = decrementTasbih(current);
    assert.equal(didDecrement, true);
    assert.equal(nextState.count, 4);
    assert.equal(nextState.laps, 0);
  });

  it('decrements across lap boundary when count is 0 and laps > 0', () => {
    const current = { count: 0, laps: 2, target: 33 };
    const { nextState, didDecrement } = decrementTasbih(current);
    assert.equal(didDecrement, true);
    assert.equal(nextState.count, 32);
    assert.equal(nextState.laps, 1);
  });

  it('does not decrement when count and laps are 0', () => {
    const current = { count: 0, laps: 0, target: 33 };
    const { nextState, didDecrement } = decrementTasbih(current);
    assert.equal(didDecrement, false);
    assert.equal(nextState.count, 0);
    assert.equal(nextState.laps, 0);
  });

  it('undoes from history stack accurately', () => {
    const history = [
      { count: 10, laps: 0 },
      { count: 11, laps: 0 },
    ];
    const current = { count: 12, laps: 0, target: 33 };

    const res = undoTasbih(current, history);
    assert.equal(res.canUndo, true);
    assert.equal(res.nextState.count, 11);
    assert.equal(res.newHistory.length, 1);

    // Second undo
    const res2 = undoTasbih(res.nextState, res.newHistory);
    assert.equal(res2.canUndo, true);
    assert.equal(res2.nextState.count, 10);
    assert.equal(res2.newHistory.length, 0);
  });

  it('handles fallback undo without history: decrementing count', () => {
    const current = { count: 5, laps: 0, target: 33 };
    const res = undoTasbih(current, []);
    assert.equal(res.canUndo, true);
    assert.equal(res.nextState.count, 4);
  });

  it('resets count and laps to 0 while saving state into history for undo', () => {
    const current = { count: 18, laps: 2, target: 33 };
    const history = [{ count: 17, laps: 2 }];
    const res = resetTasbih(current, history);

    assert.equal(res.didReset, true);
    assert.equal(res.nextState.count, 0);
    assert.equal(res.nextState.laps, 0);
    assert.equal(res.newHistory.length, 2);
    assert.deepEqual(res.newHistory[res.newHistory.length - 1], { count: 18, laps: 2 });

    // Undoing immediately restores the state prior to reset!
    const undoRes = undoTasbih(res.nextState, res.newHistory);
    assert.equal(undoRes.canUndo, true);
    assert.equal(undoRes.nextState.count, 18);
    assert.equal(undoRes.nextState.laps, 2);
  });

  it('does nothing when already at 0 count and 0 laps', () => {
    const current = { count: 0, laps: 0, target: 33 };
    const history: { count: number; laps: number }[] = [];
    const res = resetTasbih(current, history);
    assert.equal(res.didReset, false);
    assert.equal(res.nextState.count, 0);
    assert.equal(res.nextState.laps, 0);
  });
});
