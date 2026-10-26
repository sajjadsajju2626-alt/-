/**
 * Utility functions for sharing the Daily Adhkar app across platforms,
 * social media, direct messaging, and native OS share sheets.
 */

export interface ShareDataPayload {
  title: string;
  text: string;
  url: string;
}

export interface SocialShareLink {
  id: 'whatsapp' | 'telegram' | 'twitter' | 'facebook' | 'sms' | 'email';
  name: string;
  url: string;
  bgColor: string;
  textColor: string;
}

export const PUBLIC_SHARE_URL = 'https://ais-pre-vnltcvivdjsnkrcxvjxrzx-323150098264.asia-east1.run.app';
export const FALLBACK_APP_URL = PUBLIC_SHARE_URL;

/**
 * Normalizes any origin (including localhost, 127.0.0.1, internal ais-dev domains)
 * into a guaranteed public URL accessible by any recipient worldwide without requiring authentication.
 */
export function resolvePublicAppUrl(inputOrigin?: string): string {
  let origin = inputOrigin?.trim();

  if (!origin) {
    if (typeof window !== 'undefined' && window.location && window.location.origin) {
      origin = window.location.origin;
    } else {
      return PUBLIC_SHARE_URL;
    }
  }

  // 1. Transform AI Studio private dev domain to public deployment domain
  if (origin.includes('ais-dev-')) {
    return origin.replace('ais-dev-', 'ais-pre-').replace(/\/$/, '');
  }

  // 2. Check for localhost or local private network addresses
  const isLocalOrPrivate =
    origin.includes('localhost') ||
    origin.includes('127.0.0.1') ||
    origin.includes('0.0.0.0') ||
    /^https?:\/\/192\.168\./.test(origin) ||
    /^https?:\/\/10\./.test(origin) ||
    /^https?:\/\/172\.(1[6-9]|2[0-9]|3[0-1])\./.test(origin);

  if (isLocalOrPrivate) {
    return PUBLIC_SHARE_URL;
  }

  // 3. If it's already a public domain, strip trailing slash and return
  return origin.replace(/\/$/, '');
}

/**
 * Returns the shareable URL for the app or a specific tab category.
 */
export function getShareUrl(categoryTab?: string, baseOrigin?: string): string {
  const publicBase = resolvePublicAppUrl(baseOrigin);

  if (categoryTab && categoryTab !== 'all') {
    const separator = publicBase.includes('?') ? '&' : '?';
    return `${publicBase}${separator}tab=${encodeURIComponent(categoryTab)}`;
  }

  return publicBase;
}

/**
 * Returns formatted share text and title with authentic Hadith reference.
 */
export function getSharePayload(categoryTab?: string, baseOrigin?: string): ShareDataPayload {
  const url = getShareUrl(categoryTab, baseOrigin);

  let categoryLabel = 'Daily Adhkar (مداومة)';
  if (categoryTab === 'morning') {
    categoryLabel = 'Morning Adhkar • أذكار الصباح';
  } else if (categoryTab === 'evening') {
    categoryLabel = 'Evening Adhkar • أذكار المساء';
  } else if (categoryTab === 'prayer') {
    categoryLabel = 'After-Prayer Adhkar • أذكار بعد الصلاة';
  } else if (categoryTab === 'sleep') {
    categoryLabel = 'Bedtime Adhkar • أذكار النوم';
  } else if (categoryTab === 'tasbih') {
    categoryLabel = 'Digital Tasbih Counter • مسبحة إلكترونية';
  } else if (categoryTab === 'tasks') {
    categoryLabel = 'Daily Sunnah & Good Deeds Tasks • مهام اليوم';
  }

  const title = `Daily Adhkar - ${categoryLabel}`;
  const text = `📿 Read & listen to authentic ${categoryLabel} with Arabic script, transliteration, English & Malayalam translations, audio, and interactive counter.\n\n«مَنْ دَلَّ عَلَى خَيْرٍ فَلَهُ مِثْلُ أَجْرِ فَاعِلِهِ»\n"Whoever guides someone to goodness will have a reward like the one who did it." (Sahih Muslim)\n\nOpen directly here:`;

  return {
    title,
    text,
    url,
  };
}

/**
 * Checks if the Web Share API (native OS share dialog) is available.
 */
export function canNativeShare(): boolean {
  if (typeof navigator === 'undefined') return false;
  return typeof navigator.share === 'function';
}

/**
 * Generates direct sharing links for popular messaging apps and social platforms.
 */
export function getSocialShareLinks(payload: ShareDataPayload): SocialShareLink[] {
  const fullMessage = `${payload.text}\n${payload.url}`;
  const encodedText = encodeURIComponent(fullMessage);
  const encodedUrl = encodeURIComponent(payload.url);
  const encodedTitle = encodeURIComponent(payload.title);

  return [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      url: `https://api.whatsapp.com/send?text=${encodedText}`,
      bgColor: 'bg-emerald-600 hover:bg-emerald-700',
      textColor: 'text-white',
    },
    {
      id: 'telegram',
      name: 'Telegram',
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(payload.text)}`,
      bgColor: 'bg-sky-500 hover:bg-sky-600',
      textColor: 'text-white',
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(payload.title + '\n\n' + payload.text)}&url=${encodedUrl}`,
      bgColor: 'bg-slate-900 hover:bg-black dark:bg-slate-800 dark:hover:bg-slate-700',
      textColor: 'text-white',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      bgColor: 'bg-blue-600 hover:bg-blue-700',
      textColor: 'text-white',
    },
    {
      id: 'sms',
      name: 'SMS / Text',
      url: `sms:?&body=${encodedText}`,
      bgColor: 'bg-teal-600 hover:bg-teal-700',
      textColor: 'text-white',
    },
    {
      id: 'email',
      name: 'Email',
      url: `mailto:?subject=${encodedTitle}&body=${encodedText}`,
      bgColor: 'bg-slate-700 hover:bg-slate-800',
      textColor: 'text-white',
    },
  ];
}

/**
 * Safely copies text to the clipboard with fallback for non-secure contexts and iframes.
 */
export async function copyToClipboard(
  text: string,
  existingInput?: HTMLInputElement | null
): Promise<boolean> {
  // 1. If an existing input in the DOM is available, select and copy directly
  if (existingInput) {
    try {
      existingInput.focus();
      existingInput.select();
      if (typeof existingInput.setSelectionRange === 'function') {
        existingInput.setSelectionRange(0, 99999);
      }
      const res = document.execCommand('copy');
      if (res) return true;
    } catch {
      // Continue to navigator.clipboard
    }
  }

  // 2. Try modern Clipboard API
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Permission denied or blocked in iframe, continue to DOM textarea fallback
    }
  }

  // 3. Fallback using temporary textarea in viewport
  if (typeof document !== 'undefined') {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.width = '2em';
      textArea.style.height = '2em';
      textArea.style.padding = '0';
      textArea.style.border = 'none';
      textArea.style.outline = 'none';
      textArea.style.boxShadow = 'none';
      textArea.style.background = 'transparent';
      textArea.setAttribute('readonly', '');
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      if (typeof textArea.setSelectionRange === 'function') {
        textArea.setSelectionRange(0, 99999);
      }
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch {
      return false;
    }
  }

  return false;
}
