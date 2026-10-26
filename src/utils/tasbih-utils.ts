/**
 * Pure functions for Tasbih Counter, Arabic numerals, and reliable undo/decrement logic.
 */

export interface TasbihState {
  count: number;
  laps: number;
  target: number;
}

/**
 * Converts Western digits (0-9) to Eastern Arabic digits (٠-٩).
 */
export function toArabicDigits(num: number | string): string {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().replace(/\d/g, (d) => arabicDigits[parseInt(d, 10)]);
}

/**
 * Calculates new tasbih state on increment tap.
 */
export function incrementTasbih(state: TasbihState): {
  nextState: TasbihState;
  completedLap: boolean;
} {
  const { count, laps, target } = state;
  const nextCount = count + 1;

  if (target > 0 && nextCount >= target) {
    return {
      nextState: { count: 0, laps: laps + 1, target },
      completedLap: true,
    };
  }

  return {
    nextState: { count: nextCount, laps, target },
    completedLap: false,
  };
}

/**
 * Directly and reliably decrements the tasbih counter by 1.
 * If count > 0, decrements count by 1.
 * If count === 0 and laps > 0 with target > 0, steps back into previous lap (target - 1, laps - 1).
 * If count === 0 and laps === 0, returns unchanged with didDecrement: false.
 */
export function decrementTasbih(state: TasbihState): {
  nextState: TasbihState;
  didDecrement: boolean;
} {
  const { count, laps, target } = state;
  if (count > 0) {
    return {
      nextState: { count: count - 1, laps, target },
      didDecrement: true,
    };
  } else if (laps > 0 && target > 0) {
    return {
      nextState: { count: target - 1, laps: laps - 1, target },
      didDecrement: true,
    };
  }
  return {
    nextState: state,
    didDecrement: false,
  };
}

/**
 * Safely undoes the last tasbih tap using history stack if present,
 * or falls back directly to decrementTasbih.
 */
export function undoTasbih(
  currentState: TasbihState,
  history: { count: number; laps: number }[]
): {
  nextState: TasbihState;
  newHistory: { count: number; laps: number }[];
  canUndo: boolean;
} {
  if (history && history.length > 0) {
    const previous = history[history.length - 1];
    return {
      nextState: {
        count: previous.count,
        laps: previous.laps,
        target: currentState.target,
      },
      newHistory: history.slice(0, -1),
      canUndo: true,
    };
  }

  const { nextState, didDecrement } = decrementTasbih(currentState);
  return {
    nextState,
    newHistory: [],
    canUndo: didDecrement,
  };
}

/**
 * Resets the tasbih counter to 0 laps and 0 count, while pushing
 * the current snapshot into the history stack for instant undoability.
 */
export function resetTasbih(
  currentState: TasbihState,
  history: { count: number; laps: number }[]
): {
  nextState: TasbihState;
  newHistory: { count: number; laps: number }[];
  didReset: boolean;
} {
  if (currentState.count === 0 && currentState.laps === 0) {
    return {
      nextState: currentState,
      newHistory: history,
      didReset: false,
    };
  }

  return {
    nextState: {
      count: 0,
      laps: 0,
      target: currentState.target,
    },
    newHistory: [
      ...history.slice(-40),
      { count: currentState.count, laps: currentState.laps },
    ],
    didReset: true,
  };
}
