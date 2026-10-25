/**
 * Lightweight Web Audio API synthesizer for tactile tap clicks and completion chimes.
 * Requires zero external audio files and works offline seamlessly.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Gentle wooden tasbih bead or subtle tap click sound
 */
export function playTapSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Subtle wood-tap frequency pitch drop
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.035);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {
    // AudioContext might be blocked until user gesture, ignore silently
  }
}

/**
 * Harmonious spiritual chime when completing a dhikr target (e.g., reaching 3 or 100)
 */
export function playCompletionSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const chords = [523.25, 659.25, 783.99]; // C5, E5, G5 major triad

    chords.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      gain.gain.setValueAtTime(0.08, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.55);
    });
  } catch {
    // ignore
  }
}

/**
 * Vibration feedback using browser navigator.vibrate
 */
export function triggerHaptic(type: 'tap' | 'complete' | 'reset' = 'tap') {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      if (type === 'tap') {
        navigator.vibrate(15);
      } else if (type === 'complete') {
        navigator.vibrate([30, 40, 50]);
      } else if (type === 'reset') {
        navigator.vibrate([20, 20]);
      }
    } catch {
      // Vibrate not supported or permission denied
    }
  }
}
