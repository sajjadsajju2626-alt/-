/**
 * Exclusive Audio Recitation & Pronunciation Engine for Daily Adhkar.
 *
 * 1. Exclusive Playback (Zero Audio Mixing):
 *    - Uses a single global `currentAudio` player instance.
 *    - Before any audio starts playing, forces any currently playing audio track
 *      to pause/stop, detaches its event listeners, resets `currentTime = 0`,
 *      unloads its source, and cancels any active Web Speech synthesis.
 *    - Only one audio source can ever be active at any given time.
 *
 * 2. Strictly Segregated Voice Styles:
 *    - Quranic Verses (ആയത്തുകൾ - `quranic_tajweed`):
 *      Traditional melodic, contemplative, and rhythmic Quranic recitation
 *      (Tajweed/Murattal style) by a native male reciter (Qari).
 *    - Regular Adhkar & Supplications (ദിക്റുകൾ - `natural_dua`):
 *      Natural, humble, calm, and conversational native Arabic male voice,
 *      using a steady and reverent spiritual tone suitable for private remembrance (Dua).
 *
 * 3. Synchronized Visual Indicators:
 *    - Broadcasts real-time playback state across all subscribed components so
 *      Play and Pause icons toggle immediately when playback starts, pauses,
 *      completes, is cancelled, or switches to another card.
 */

export type PronunciationSpeed = '0.75x' | '1.0x' | '1.25x';
export type PlaybackStatus = 'idle' | 'playing' | 'paused' | 'buffering';
export type VoiceStyle = 'quranic_tajweed' | 'natural_dua';

export interface VoiceStyleProfile {
  style: VoiceStyle;
  label: string;
  activeLabel: string;
  malayalamLabel: string;
  description: string;
  pitch: number;
  baseRate: number;
  volume: number;
}

export const VOICE_STYLE_PROFILES: Record<VoiceStyle, VoiceStyleProfile> = {
  quranic_tajweed: {
    style: 'quranic_tajweed',
    label: 'Tajweed / Murattal (Qari)',
    activeLabel: 'Melodic Tajweed (الترتيل)',
    malayalamLabel: 'ആയത്തുകൾ • തജ്‌വീദ് പാരായണം',
    description:
      'Traditional melodic, contemplative, and rhythmic Quranic recitation (Tajweed/Murattal style) by a native male reciter (Qari).',
    pitch: 0.98,
    baseRate: 0.88,
    volume: 1.0,
  },
  natural_dua: {
    style: 'natural_dua',
    label: 'Calm Natural Dua Voice',
    activeLabel: 'Calm & Reverent Dua (دعاء خاشع)',
    malayalamLabel: 'ദിക്റുകൾ • ശാന്തമായ ദുആ ശൈലി',
    description:
      'Natural, humble, calm, and conversational native Arabic male voice with a steady and reverent spiritual tone suitable for private remembrance (Dua).',
    pitch: 1.0, // Natural, unforced conversational pitch (avoids theatrical/broadcast distortion)
    baseRate: 0.95, // Steady, calm, reverent conversational cadence
    volume: 0.92, // Gentle, humble, intimate delivery for personal remembrance
  },
};

export interface AudioPlaybackState {
  playingId: string | null;
  status: PlaybackStatus;
  speed: PronunciationSpeed;
  isQuranic: boolean;
  voiceStyle: VoiceStyle;
  reciterTitle?: string;
  currentTime?: number;
  duration?: number;
}

declare global {
  interface Window {
    currentAudio?: HTMLAudioElement | null;
  }
}

/**
 * Single global HTMLAudioElement instance shared across the entire application.
 * Guarantees that at most one audio track can exist or play at any time.
 */
let currentAudio: HTMLAudioElement | null = null;

/**
 * Returns the active global HTMLAudioElement instance, if any.
 */
export function getCurrentAudio(): HTMLAudioElement | null {
  return currentAudio;
}

/**
 * Returns the segregated voice style profile based on whether the item is a Quranic verse
 * (ആയത്തുകൾ) or a regular Dhikr/Supplication (ദിക്റുകൾ).
 */
export function getVoiceStyleProfile(isQuranic: boolean): VoiceStyleProfile {
  return isQuranic ? VOICE_STYLE_PROFILES.quranic_tajweed : VOICE_STYLE_PROFILES.natural_dua;
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
export function getPronunciationSpeechRate(
  speed: PronunciationSpeed,
  voiceStyle: VoiceStyle = 'natural_dua'
): number {
  const profile = VOICE_STYLE_PROFILES[voiceStyle] || VOICE_STYLE_PROFILES.natural_dua;
  switch (speed) {
    case '0.75x':
      return 0.75;
    case '1.25x':
      return 1.25;
    case '1.0x':
    default:
      return profile.baseRate;
  }
}

/**
 * Selects the best native Arabic male voice available in the browser,
 * tailored to the segregated voice style:
 * - For `natural_dua`: prioritizes natural, calm, conversational native Arabic male voices
 *   (e.g., Maged, Tariq, Naayf, Hamed, Natural/Online Arabic male voices).
 * - For `quranic_tajweed`: prioritizes clear native Arabic Qari/male voices when TTS fallback is needed.
 */
export function selectBestArabicVoice(
  voices: { lang: string; name?: string; default?: boolean }[],
  voiceStyle: VoiceStyle = 'natural_dua'
): { lang: string; name?: string; default?: boolean } | null {
  if (!voices || voices.length === 0) return null;

  const arabicVoices = voices.filter((v) => {
    const lang = (v.lang || '').toLowerCase();
    return lang.startsWith('ar');
  });

  if (arabicVoices.length === 0) return null;

  // Natural conversational native Arabic male voice identifiers
  const naturalMaleKeywords = [
    'maged',
    'tariq',
    'naayf',
    'hamed',
    'fahed',
    'fahad',
    'salman',
    'omar',
    'khalid',
    'male',
    'ar-sa',
    'standard-b',
    'wavenet-b',
    'neural',
    'natural',
  ];

  if (voiceStyle === 'natural_dua') {
    // Prefer natural/neural native male voices first for humble, calm conversational Dua
    const naturalMale = arabicVoices.find((v) => {
      const name = (v.name || '').toLowerCase();
      return (
        (name.includes('natural') || name.includes('online')) &&
        naturalMaleKeywords.some((kw) => name.includes(kw))
      );
    });
    if (naturalMale) return naturalMale;
  }

  // Match known native Arabic male voices
  const maleVoice = arabicVoices.find((v) => {
    const name = (v.name || '').toLowerCase();
    return naturalMaleKeywords.some((kw) => name.includes(kw));
  });
  if (maleVoice) return maleVoice;

  // Look for Saudi Arabia (ar-SA) native voice
  const saudiVoice = arabicVoices.find((v) => (v.lang || '').toLowerCase() === 'ar-sa');
  if (saudiVoice) return saudiVoice;

  return arabicVoices[0];
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
  private currentVoiceStyle: VoiceStyle = 'natural_dua';
  private currentReciterTitle = '';

  // Monotonically increasing token to invalidate stale async callbacks
  private playbackToken = 0;

  // Playlist tracking for multi-verse Quranic recitations
  private audioPlaylist: string[] = [];
  private currentPlaylistIndex = 0;

  // Speech Synthesis instance for natural, calm conversational Dua voice
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  private listeners: Set<AudioStateListener> = new Set();
  private endListeners: Set<(id: string) => void> = new Set();

  public getState(): AudioPlaybackState {
    return {
      playingId: this.currentPlayingId,
      status: this.status,
      speed: this.currentSpeed,
      isQuranic: this.isCurrentQuranic,
      voiceStyle: this.currentVoiceStyle,
      reciterTitle: this.currentReciterTitle,
      currentTime: currentAudio?.currentTime || 0,
      duration: currentAudio?.duration || 0,
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
   * Forces the global `currentAudio` instance and any active Web Speech utterance
   * to immediately stop, reset playback time to 0, detach all listeners, and unload.
   * Prevents any overlapping or mixed audio tracks.
   */
  private destroyActiveAudioResources() {
    // 1. Stop, reset to 0, and unload the single global HTMLAudioElement
    if (currentAudio) {
      try {
        // Detach listeners FIRST so clearing src/loading never triggers onerror or onended
        currentAudio.onplay = null;
        currentAudio.onpause = null;
        currentAudio.onended = null;
        currentAudio.onerror = null;
        currentAudio.ontimeupdate = null;
        currentAudio.onloadedmetadata = null;

        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio.removeAttribute('src');
        currentAudio.load();
      } catch {
        // ignore DOM media cleanup errors
      }
      currentAudio = null;
      if (typeof window !== 'undefined') {
        window.currentAudio = null;
      }
    }

    // 2. Cancel and detach any active Web Speech API utterance
    if (this.currentUtterance) {
      try {
        this.currentUtterance.onstart = null;
        this.currentUtterance.onend = null;
        this.currentUtterance.onerror = null;
        this.currentUtterance.onpause = null;
        this.currentUtterance.onresume = null;
      } catch {
        // ignore
      }
      this.currentUtterance = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
  }

  /**
   * Pauses the currently playing audio or speech.
   */
  public pause() {
    if (currentAudio && (this.status === 'playing' || this.status === 'buffering')) {
      try {
        currentAudio.pause();
      } catch {
        // ignore
      }
      this.status = 'paused';
      this.notify();
      return;
    }

    if (
      typeof window !== 'undefined' &&
      'speechSynthesis' in window &&
      (this.status === 'playing' || this.status === 'buffering')
    ) {
      try {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          window.speechSynthesis.pause();
          this.status = 'paused';
          this.notify();
          return;
        }
      } catch {
        // ignore
      }
      // If speechSynthesis pause is unsupported on the platform, stop cleanly
      this.stop();
    }
  }

  /**
   * Resumes paused audio or speech.
   */
  public resume() {
    if (currentAudio && this.status === 'paused') {
      const token = this.playbackToken;
      try {
        const promise = currentAudio.play();
        this.status = 'playing';
        this.notify();
        if (promise) {
          promise.catch(() => {
            if (this.playbackToken === token) {
              this.stop();
            }
          });
        }
      } catch {
        this.stop();
      }
      return;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window && this.status === 'paused') {
      try {
        window.speechSynthesis.resume();
        this.status = 'playing';
        this.notify();
      } catch {
        this.stop();
      }
    }
  }

  /**
   * Completely stops and unloads any currently playing or paused audio/speech,
   * resetting playback time to zero and syncing all visual indicators to idle.
   */
  public stop() {
    this.playbackToken++;
    this.destroyActiveAudioResources();

    this.currentPlayingId = null;
    this.status = 'idle';
    this.audioPlaylist = [];
    this.currentPlaylistIndex = 0;
    this.notify();
  }

  /**
   * Toggles play / pause for a specific Dhikr item.
   * - If already playing or buffering this item -> pauses it.
   * - If paused on this item -> resumes it.
   * - If another item is playing or idle -> immediately cancels/unloads the previous
   *   track and starts playing the newly selected item.
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
    const {
      id,
      arabicText,
      speed = this.currentSpeed,
      isQuranic = false,
      audioUrl,
      audioUrls,
      reciterTitle,
    } = options;

    if (this.currentPlayingId === id) {
      if (this.status === 'playing' || this.status === 'buffering') {
        this.pause();
        return;
      }
      if (this.status === 'paused') {
        this.resume();
        return;
      }
    }

    // Play fresh (automatically stops, resets, and unloads any previously active audio)
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
   * Starts playing the requested item from the beginning after forcibly stopping,
   * resetting, and unloading any previously active audio track.
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
    const {
      id,
      arabicText,
      speed = this.currentSpeed,
      isQuranic = false,
      audioUrl,
      audioUrls,
      reciterTitle,
    } = options;

    // 1. Force stop, reset to 0, and unload any currently playing audio or speech
    this.stop();

    const token = ++this.playbackToken;
    const styleProfile = getVoiceStyleProfile(isQuranic);

    this.currentPlayingId = id;
    this.currentSpeed = speed;
    this.isCurrentQuranic = isQuranic;
    this.currentVoiceStyle = styleProfile.style;
    this.currentReciterTitle =
      reciterTitle ||
      (isQuranic
        ? 'Sheikh Mishary Rashid Alafasy • Melodic Tajweed (Qari)'
        : 'Natural, Calm & Reverent Arabic Male Voice (Dua)');

    // Mark status as playing immediately so visual Play/Pause buttons toggle without lag
    this.status = 'playing';
    this.notify();

    // Segregate playback by Voice Style:
    // - Quranic Verses (ആയത്തുകൾ): Melodic Tajweed/Murattal audio recitation by native Qari
    // - Regular Adhkar (ദിക്റുകൾ): Natural, humble, calm, conversational native Arabic male voice
    const playlist: string[] = [];
    if (isQuranic) {
      if (audioUrls && audioUrls.length > 0) {
        playlist.push(...audioUrls);
      } else if (audioUrl) {
        playlist.push(audioUrl);
      }
    } else if (audioUrls && audioUrls.length > 0) {
      playlist.push(...audioUrls);
    } else if (audioUrl) {
      playlist.push(audioUrl);
    }

    const preparedText = prepareArabicSpeechText(arabicText);

    if (playlist.length > 0) {
      this.playAudioPlaylist(id, token, playlist, speed, preparedText, styleProfile);
    } else {
      this.playSpeechSynthesis(id, token, preparedText, speed, styleProfile);
    }
  }

  /**
   * Updates playback speed on the fly.
   */
  public setSpeed(speed: PronunciationSpeed) {
    this.currentSpeed = speed;
    const rate = getPronunciationSpeechRate(speed, this.currentVoiceStyle);

    if (currentAudio) {
      currentAudio.playbackRate = rate;
    }
    this.notify();
  }

  /**
   * Replays the current item from the start (resets currentTime to 0).
   */
  public replay(options?: {
    id?: string;
    arabicText?: string;
    speed?: PronunciationSpeed;
    isQuranic?: boolean;
    audioUrl?: string;
    audioUrls?: string[];
  }) {
    if (currentAudio && (!options?.id || options.id === this.currentPlayingId)) {
      try {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        this.status = 'playing';
        this.notify();
        currentAudio.play().catch(() => {
          this.stop();
        });
        return;
      } catch {
        // fall through to full restart
      }
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
   * Plays a sequential playlist of audio tracks using the single global `currentAudio` instance.
   */
  private playAudioPlaylist(
    id: string,
    token: number,
    playlist: string[],
    speed: PronunciationSpeed,
    fallbackText: string,
    styleProfile: VoiceStyleProfile
  ) {
    this.audioPlaylist = playlist;
    this.currentPlaylistIndex = 0;

    const playCurrentSegment = () => {
      // Abort if another track was started or stop() was called
      if (this.playbackToken !== token || this.currentPlayingId !== id) {
        return;
      }

      if (this.currentPlaylistIndex >= this.audioPlaylist.length) {
        // Completed all segments in the playlist
        const finishedId = this.currentPlayingId;
        this.stop();
        if (finishedId) {
          this.triggerEnd(finishedId);
        }
        return;
      }

      // Clean up previous segment's Audio instance before creating/assigning the new one
      this.destroyActiveAudioResources();

      const url = this.audioPlaylist[this.currentPlaylistIndex];
      const audio = new Audio();
      audio.preload = 'auto';
      audio.src = url;
      audio.currentTime = 0;
      audio.volume = styleProfile.volume;
      audio.playbackRate = getPronunciationSpeechRate(speed, styleProfile.style);

      // Assign to the single global `currentAudio` instance
      currentAudio = audio;
      if (typeof window !== 'undefined') {
        window.currentAudio = audio;
      }

      let fallbackTriggered = false;
      const triggerFallbackOnce = () => {
        if (fallbackTriggered) return;
        if (this.playbackToken !== token || this.currentPlayingId !== id) return;
        fallbackTriggered = true;

        this.destroyActiveAudioResources();
        if (fallbackText) {
          this.playSpeechSynthesis(id, token, fallbackText, speed, styleProfile);
        } else {
          this.stop();
        }
      };

      audio.onplay = () => {
        if (this.playbackToken === token && this.currentPlayingId === id) {
          this.status = 'playing';
          this.notify();
        }
      };

      audio.onpause = () => {
        // Only mark paused if we didn't reach the end or get stopped
        if (
          this.playbackToken === token &&
          this.currentPlayingId === id &&
          !audio.ended &&
          this.status === 'playing'
        ) {
          this.status = 'paused';
          this.notify();
        }
      };

      audio.onended = () => {
        if (this.playbackToken === token && this.currentPlayingId === id) {
          this.currentPlaylistIndex++;
          playCurrentSegment();
        }
      };

      audio.onerror = () => {
        triggerFallbackOnce();
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          triggerFallbackOnce();
        });
      }
    };

    playCurrentSegment();
  }

  /**
   * Speaks the Arabic text using Web Speech API with segregated vocal parameters:
   * - Regular Adhkar (`natural_dua`): Natural, humble, calm, conversational native Arabic
   *   male voice (`pitch = 1.0`, `rate = 0.95`, `volume = 0.92`) with a steady, reverent spiritual tone.
   * - Quranic fallback (`quranic_tajweed`): Contemplative, rhythmic Murattal pacing (`pitch = 0.98`, `rate = 0.88`).
   */
  private playSpeechSynthesis(
    id: string,
    token: number,
    text: string,
    speed: PronunciationSpeed,
    styleProfile: VoiceStyleProfile
  ) {
    if (this.playbackToken !== token || this.currentPlayingId !== id) {
      return;
    }

    if (!isSpeechSynthesisSupported() || !text) {
      this.stop();
      return;
    }

    try {
      // Ensure any prior speech or audio is completely stopped
      this.destroyActiveAudioResources();

      const utterance = new window.SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = getPronunciationSpeechRate(speed, styleProfile.style);
      utterance.pitch = styleProfile.pitch;
      utterance.volume = styleProfile.volume;

      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const bestVoice = selectBestArabicVoice(voices, styleProfile.style);
        if (bestVoice) {
          utterance.voice = bestVoice as SpeechSynthesisVoice;
        }
      }

      utterance.onstart = () => {
        if (this.playbackToken === token && this.currentPlayingId === id) {
          this.status = 'playing';
          this.notify();
        }
      };

      utterance.onend = () => {
        if (this.playbackToken === token && this.currentPlayingId === id) {
          const finishedId = id;
          this.stop();
          this.triggerEnd(finishedId);
        }
      };

      utterance.onerror = () => {
        if (this.playbackToken === token && this.currentPlayingId === id) {
          this.stop();
        }
      };

      this.currentUtterance = utterance;
      this.status = 'playing';
      this.notify();

      window.speechSynthesis.speak(utterance);
    } catch {
      if (this.playbackToken === token) {
        this.stop();
      }
    }
  }
}

export const PronunciationManager = new PronunciationManagerClass();
