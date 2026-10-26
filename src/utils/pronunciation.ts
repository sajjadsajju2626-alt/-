/**
 * Audio recitation and pronunciation engine for Daily Adhkar.
 * - Traditional melodic Tajweed / Murattal recitation for Quranic verses (Mishary Rashid Alafasy).
 * - Clear, resonant classical Arabic native male voice for daily supplications.
 * - Interactive Play, Pause, Resume, Replay, and Speed control (0.75x, 1.0x, 1.25x).
 * - Real-time state subscription across cards so only one recitation plays at a time.
 */

export type PronunciationSpeed = '0.75x' | '1.0x' | '1.25x';
export type PlaybackStatus = 'idle' | 'playing' | 'paused' | 'buffering';

export interface AudioPlaybackState {
  playingId: string | null;
  status: PlaybackStatus;
  speed: PronunciationSpeed;
  isQuranic: boolean;
  reciterTitle?: string;
  currentTime?: number;
  duration?: number;
}

/**
 * Prepares diacritized Arabic text for natural spoken recitation.
 * Strips Quranic verse end-markers and parenthesized numbers like (١) or (285)
 * so the audio recites smooth, uninterrupted prayer verses without reading numbers.
 */
export function prepareArabicSpeechText(text: string): string {
  if (!text) return '';
  return text
    .replace(/\s*\([٠-٩\d]+\)\s*/g, ' ')
    .replace(/\n+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Converts pronunciation speed label into playback rate number.
 */
export function getPronunciationSpeechRate(speed: PronunciationSpeed): number {
  switch (speed) {
    case '0.75x':
      return 0.75;
    case '1.25x':
      return 1.25;
    case '1.0x':
    default:
      return 0.95; // Slightly measured pace for reverent, clear articulation
  }
}

/**
 * Selects the highest quality classical Arabic male voice available in the browser.
 * Prioritizes deep, resonant classical Arabic male voices.
 */
export function selectBestArabicVoice(
  voices: { lang: string; name?: string; default?: boolean }[]
): { lang: string; name?: string; default?: boolean } | null {
  if (!voices || voices.length === 0) return null;

  // Known high-quality classical Arabic male voice names
  const maleKeywords = ['maged', 'tariq', 'naayf', 'male', 'fahad', 'salman', 'ar-sa', 'standard-b'];

  // 1. Look for known Arabic male voices
  const arabicVoices = voices.filter((v) => {
    const lang = (v.lang || '').toLowerCase();
    return lang.startsWith('ar');
  });

  if (arabicVoices.length > 0) {
    const maleVoice = arabicVoices.find((v) => {
      const name = (v.name || '').toLowerCase();
      return maleKeywords.some((kw) => name.includes(kw));
    });
    if (maleVoice) return maleVoice;

    // 2. Look for Saudi Arabia standard voice
    const saudiVoice = arabicVoices.find((v) => (v.lang || '').toLowerCase() === 'ar-sa');
    if (saudiVoice) return saudiVoice;

    return arabicVoices[0];
  }

  return null;
}

/**
 * Checks if the browser runtime supports Web Speech API.
 */
export function isSpeechSynthesisSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    typeof window.SpeechSynthesisUtterance !== 'undefined'
  );
}

type AudioStateListener = (state: AudioPlaybackState) => void;

class PronunciationManagerClass {
  private currentPlayingId: string | null = null;
  private status: PlaybackStatus = 'idle';
  private currentSpeed: PronunciationSpeed = '1.0x';
  private isCurrentQuranic = false;
  private currentReciterTitle = '';

  // HTML5 Audio playback (for Melodic Tajweed Quranic clips & supplication audio)
  private audioElement: HTMLAudioElement | null = null;
  private audioPlaylist: string[] = [];
  private currentPlaylistIndex = 0;

  // Speech Synthesis fallback (for classical resonant male voice)
  private currentUtterance: any = null;
  private utteranceText = '';

  private listeners: Set<AudioStateListener> = new Set();
  private endListeners: Set<(id: string) => void> = new Set();

  public getState(): AudioPlaybackState {
    return {
      playingId: this.currentPlayingId,
      status: this.status,
      speed: this.currentSpeed,
      isQuranic: this.isCurrentQuranic,
      reciterTitle: this.currentReciterTitle,
      currentTime: this.audioElement?.currentTime || 0,
      duration: this.audioElement?.duration || 0,
    };
  }

  public subscribe(listener: AudioStateListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public onEnd(listener: (id: string) => void): () => void {
    this.endListeners.add(listener);
    return () => {
      this.endListeners.delete(listener);
    };
  }

  private triggerEnd(id: string) {
    for (const listener of this.endListeners) {
      try {
        listener(id);
      } catch {
        // ignore subscriber errors
      }
    }
  }

  private notify() {
    const state = this.getState();
    for (const listener of this.listeners) {
      try {
        listener(state);
      } catch {
        // ignore subscriber errors
      }
    }
  }

  /**
   * Pauses the currently playing audio or speech.
   */
  public pause() {
    if (this.audioElement && this.status === 'playing') {
      try {
        this.audioElement.pause();
      } catch {
        // ignore
      }
      this.status = 'paused';
      this.notify();
      return;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window && this.status === 'playing') {
      try {
        window.speechSynthesis.pause();
      } catch {
        // ignore
      }
      this.status = 'paused';
      this.notify();
    }
  }

  /**
   * Resumes paused audio or speech.
   */
  public resume() {
    if (this.audioElement && this.status === 'paused') {
      try {
        const promise = this.audioElement.play();
        if (promise) {
          promise
            .then(() => {
              this.status = 'playing';
              this.notify();
            })
            .catch(() => {
              this.status = 'idle';
              this.notify();
            });
        }
      } catch {
        this.status = 'idle';
        this.notify();
      }
      return;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window && this.status === 'paused') {
      try {
        window.speechSynthesis.resume();
        this.status = 'playing';
        this.notify();
      } catch {
        this.status = 'idle';
        this.notify();
      }
    }
  }

  /**
   * Completely stops any currently playing or paused audio/speech.
   */
  public stop() {
    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
        this.audioElement.src = '';
      } catch {
        // ignore
      }
      this.audioElement = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }

    this.currentPlayingId = null;
    this.status = 'idle';
    this.audioPlaylist = [];
    this.currentPlaylistIndex = 0;
    this.currentUtterance = null;
    this.utteranceText = '';
    this.notify();
  }

  /**
   * Toggles play / pause for a specific Dhikr item.
   * If already playing this item -> pauses it.
   * If paused on this item -> resumes it.
   * If another item or stopped -> starts playing this item.
   */
  public togglePlayPause(options: {
    id: string;
    arabicText: string;
    speed?: PronunciationSpeed;
    isQuranic?: boolean;
    audioUrl?: string;
    audioUrls?: string[];
    reciterTitle?: string;
  }) {
    const { id, arabicText, speed = this.currentSpeed, isQuranic = false, audioUrl, audioUrls, reciterTitle } = options;

    if (this.currentPlayingId === id) {
      if (this.status === 'playing') {
        this.pause();
        return;
      }
      if (this.status === 'paused') {
        this.resume();
        return;
      }
    }

    // Play fresh
    this.play({
      id,
      arabicText,
      speed,
      isQuranic,
      audioUrl,
      audioUrls,
      reciterTitle,
    });
  }

  /**
   * Plays the recitation from the beginning.
   */
  public play(options: {
    id: string;
    arabicText: string;
    speed?: PronunciationSpeed;
    isQuranic?: boolean;
    audioUrl?: string;
    audioUrls?: string[];
    reciterTitle?: string;
  }) {
    const { id, arabicText, speed = this.currentSpeed, isQuranic = false, audioUrl, audioUrls, reciterTitle } = options;

    // Stop whatever was playing previously
    this.stop();

    this.currentPlayingId = id;
    this.currentSpeed = speed;
    this.isCurrentQuranic = isQuranic;
    this.currentReciterTitle =
      reciterTitle ||
      (isQuranic
        ? 'Sheikh Mishary Rashid Alafasy • Melodic Tajweed'
        : 'Classical Resonant Arabic Male Voice');

    // Build URL list: support single audioUrl or multiple audioUrls
    const playlist: string[] = [];
    if (audioUrls && audioUrls.length > 0) {
      playlist.push(...audioUrls);
    } else if (audioUrl) {
      playlist.push(audioUrl);
    }

    const preparedText = prepareArabicSpeechText(arabicText);

    if (playlist.length > 0) {
      this.playAudioPlaylist(id, playlist, speed, preparedText);
    } else {
      this.playSpeechSynthesis(id, preparedText, speed);
    }
  }

  /**
   * Sets playback rate/speed on the fly.
   */
  public setSpeed(speed: PronunciationSpeed) {
    this.currentSpeed = speed;
    const rate = getPronunciationSpeechRate(speed);

    if (this.audioElement) {
      this.audioElement.playbackRate = rate;
    }
    this.notify();
  }

  /**
   * Replays current item from the start.
   */
  public replay(options?: {
    id?: string;
    arabicText?: string;
    speed?: PronunciationSpeed;
    isQuranic?: boolean;
    audioUrl?: string;
    audioUrls?: string[];
  }) {
    if (this.audioElement) {
      this.audioElement.currentTime = 0;
      this.audioElement.play().catch(() => {});
      this.status = 'playing';
      this.notify();
      return;
    }

    if (options && options.id && options.arabicText) {
      this.play({
        id: options.id,
        arabicText: options.arabicText,
        speed: options.speed || this.currentSpeed,
        isQuranic: options.isQuranic,
        audioUrl: options.audioUrl,
        audioUrls: options.audioUrls,
      });
    }
  }

  /**
   * Plays a playlist of authentic audio clips (e.g. multi-verse Quranic recitation).
   */
  private playAudioPlaylist(
    id: string,
    playlist: string[],
    speed: PronunciationSpeed,
    fallbackText: string
  ) {
    this.audioPlaylist = playlist;
    this.currentPlaylistIndex = 0;
    this.status = 'buffering';
    this.notify();

    const playCurrentIndex = () => {
      if (this.currentPlayingId !== id) return;

      if (this.currentPlaylistIndex >= this.audioPlaylist.length) {
        // Finished all tracks
        const finishedId = this.currentPlayingId;
        this.stop();
        if (finishedId) {
          this.triggerEnd(finishedId);
        }
        return;
      }

      const url = this.audioPlaylist[this.currentPlaylistIndex];
      const audio = new Audio(url);
      audio.playbackRate = getPronunciationSpeechRate(speed);
      this.audioElement = audio;

      audio.onplay = () => {
        if (this.currentPlayingId === id) {
          this.status = 'playing';
          this.notify();
        }
      };

      audio.onended = () => {
        if (this.currentPlayingId === id) {
          this.currentPlaylistIndex++;
          playCurrentIndex();
        }
      };

      audio.onerror = () => {
        // If external CDN audio fails, fall back to resonant male classical Arabic voice
        if (fallbackText) {
          this.playSpeechSynthesis(id, fallbackText, speed);
        } else {
          this.stop();
        }
      };

      audio.play().catch(() => {
        if (fallbackText) {
          this.playSpeechSynthesis(id, fallbackText, speed);
        } else {
          this.stop();
        }
      });
    };

    playCurrentIndex();
  }

  /**
   * Classical Resonant Arabic Male Voice via Web Speech API.
   * Deep, measured cadence specifically for supplications.
   */
  private playSpeechSynthesis(id: string, text: string, speed: PronunciationSpeed) {
    if (!isSpeechSynthesisSupported() || !text) {
      this.stop();
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const utterance = new window.SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = getPronunciationSpeechRate(speed);
      // Pitch 0.92 gives a deeper, resonant masculine classical tone
      utterance.pitch = 0.92;

      // Select classical Arabic male voice
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const bestVoice = selectBestArabicVoice(voices);
        if (bestVoice) {
          utterance.voice = bestVoice as SpeechSynthesisVoice;
        }
      }

      utterance.onstart = () => {
        if (this.currentPlayingId === id) {
          this.status = 'playing';
          this.notify();
        }
      };

      utterance.onend = () => {
        if (this.currentPlayingId === id) {
          const finishedId = id;
          this.stop();
          this.triggerEnd(finishedId);
        }
      };

      utterance.onerror = (e) => {
        if (this.currentPlayingId === id) {
          this.stop();
        }
      };

      this.currentUtterance = utterance;
      this.status = 'buffering';
      this.notify();

      window.speechSynthesis.speak(utterance);
    } catch {
      this.stop();
    }
  }
}

export const PronunciationManager = new PronunciationManagerClass();
