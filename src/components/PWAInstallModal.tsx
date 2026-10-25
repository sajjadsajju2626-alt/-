import React, { useState } from 'react';
import {
  X,
  Share,
  PlusSquare,
  Smartphone,
  Check,
  Copy,
  Download,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  isInstallable: boolean;
  isIOS: boolean;
  onNativeInstall: () => Promise<boolean>;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  isInstallable,
  isIOS,
  onNativeInstall,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [deviceTab, setDeviceTab] = useState<'ios' | 'android'>(isIOS ? 'ios' : 'android');

  if (!isOpen) return null;

  const currentUrl =
    typeof window !== 'undefined'
      ? window.location.href.split('#')[0].split('?')[0]
      : 'https://ais-pre-vnltcvivdjsnkrcxvjxrzx-323150098264.asia-east1.run.app';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    } catch {
      // fallback
    }
  };

  const handleNativeClick = async () => {
    const success = await onNativeInstall();
    if (success) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="install-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-800 text-amber-300 flex items-center justify-center text-xl shadow-xs">
              📿
            </div>
            <div>
              <h2
                id="install-modal-title"
                className="text-lg font-bold text-slate-900 dark:text-white"
              >
                Add to Home Screen
              </h2>
              <p className="text-xs text-teal-700 dark:text-teal-400 font-medium">
                Daily Adhkar <span className="font-arabic text-sm font-normal">«مداومة»</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close installation dialog"
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Benefits badge */}
        <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/50 flex items-center gap-2.5 text-xs text-teal-950 dark:text-teal-200">
          <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
          <span>Opens instantly in full-screen with offline access and daily notifications!</span>
        </div>

        {/* 1-Click Native Install Button (if browser supports beforeinstallprompt) */}
        {isInstallable && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-teal-700 to-teal-800 text-white shadow-md space-y-2">
            <div className="font-bold text-sm">Quick 1-Tap Install Available:</div>
            <p className="text-xs text-teal-100">Your browser supports direct installation.</p>
            <button
              onClick={handleNativeClick}
              className="w-full py-2.5 px-4 rounded-xl bg-white text-teal-900 hover:bg-teal-50 font-bold text-xs transition-transform active:scale-95 shadow-sm cursor-pointer"
            >
              📲 Install Daily Adhkar Now
            </button>
          </div>
        )}

        {/* Device Switcher */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Step-by-Step Instructions:
            </span>
            <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setDeviceTab('ios')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  deviceTab === 'ios'
                    ? 'bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                iPhone / iPad
              </button>
              <button
                type="button"
                onClick={() => setDeviceTab('android')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  deviceTab === 'android'
                    ? 'bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Android / Chrome
              </button>
            </div>
          </div>

          {/* iOS Instructions */}
          {deviceTab === 'ios' ? (
            <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 font-bold flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    Open in Safari & Tap Share
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
                    Tap the <strong>Share</strong> button
                    <span className="inline-flex items-center p-1 rounded bg-slate-200 dark:bg-slate-700">
                      <Share className="w-3.5 h-3.5" />
                    </span>
                    at the bottom toolbar of Safari.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 font-bold flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    Select "Add to Home Screen"
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
                    Scroll down and tap
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-semibold text-[11px]">
                      <PlusSquare className="w-3 h-3 text-teal-600" />
                      Add to Home Screen
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 font-bold flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    Tap "Add" in Top-Right
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                    The <strong>Daily Adhkar</strong> icon will be placed directly on your iPhone home screen!
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Android Instructions */
            <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 font-bold flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    Tap Chrome Menu (⋮)
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                    Tap the three dots icon in the top-right corner of Chrome.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 font-bold flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    Tap "Install app" or "Add to Home screen"
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                    Select <strong>Add to Home screen</strong> from the menu options.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 font-bold flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    Confirm & Install
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                    Tap <strong>Add</strong> or <strong>Install</strong> to place the icon on your home screen.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Copy App Link Action */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="flex-1 py-2.5 px-3 rounded-xl border border-teal-300 dark:border-teal-700 bg-teal-50/60 dark:bg-teal-950/40 hover:bg-teal-100 dark:hover:bg-teal-900/40 text-teal-800 dark:text-teal-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy App Link</span>
                </>
              )}
            </button>
            <a
              href={currentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in Tab</span>
            </a>
          </div>
          <p className="text-[11px] text-slate-500 text-center">
            If viewing inside WhatsApp or social apps, copy the link and open it in <strong>Safari</strong> or <strong>Chrome</strong>.
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};
