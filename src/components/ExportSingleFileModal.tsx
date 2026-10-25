import React, { useState } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  Eye,
  Sparkles,
  Info,
  ShieldAlert,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import {
  generateSingleFileHtml,
  triggerClientDownload,
  copyHtmlToClipboard,
} from '../utils/single-file-generator.ts';

interface ExportSingleFileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportSingleFileModal: React.FC<ExportSingleFileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  if (!isOpen) return null;

  const html = generateSingleFileHtml();

  const handleDownload = () => {
    const success = triggerClientDownload(html, 'daily-adhkar-single-file.html');
    if (success) {
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    }
  };

  const handleCopy = async () => {
    const success = await copyHtmlToClipboard(html);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📦</span>
            <div>
              <h2
                id="export-modal-title"
                className="text-lg font-bold text-slate-900 dark:text-white"
              >
                Standalone Single-File Version
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                100% Offline • Zero Dependencies • Complete Adhkar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close export dialog"
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feature Highlights */}
        <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/50 space-y-2 text-xs text-teal-950 dark:text-teal-200">
          <div className="font-bold flex items-center gap-1.5 text-teal-900 dark:text-teal-100">
            <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Everything included in one portable .html file:</span>
          </div>
          <ul className="space-y-1 list-disc list-inside text-slate-700 dark:text-slate-300">
            <li>All 23 Morning & 23 Evening Adhkar (Shaykh Ibn Uthaymeen)</li>
            <li>Full Arabic, English transliteration & English translation</li>
            <li>Complete authentic Malayalam translations (മലയാളം തർജ്ജമ)</li>
            <li>Built-in Web Audio synthesizer & haptics (no audio files needed)</li>
            <li>Interactive tasbih counter, streaks, favorites & search</li>
          </ul>
        </div>

        {/* Main Action Buttons */}
        <div className="space-y-2.5">
          {/* Direct In-Memory Download */}
          <button
            onClick={handleDownload}
            className="w-full py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            {downloaded ? (
              <>
                <Check className="w-5 h-5 text-emerald-300" />
                <span>Downloaded Successfully!</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Download File (daily-adhkar-single-file.html)</span>
              </>
            )}
          </button>

          {/* Copy HTML Code Button (Bypasses all Safari download blocks) */}
          <button
            onClick={handleCopy}
            className="w-full py-2.5 px-4 rounded-xl border border-teal-300 dark:border-teal-700 bg-white dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-teal-800 dark:text-teal-200 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-400">
                  Copied Complete Single-File Code to Clipboard!
                </span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Full HTML Code to Clipboard</span>
              </>
            )}
          </button>

          {/* In-App Live Preview (Zero-network iframe) */}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="w-full py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-4 h-4 text-slate-500" />
            <span>{showPreview ? 'Hide In-App Preview' : 'Test Preview Inside App (No Cookies Required)'}</span>
          </button>
        </div>

        {/* Live In-App Iframe Preview */}
        {showPreview && (
          <div className="border border-teal-200 dark:border-teal-800 rounded-2xl overflow-hidden shadow-inner space-y-2 p-2 bg-slate-50 dark:bg-slate-950">
            <div className="flex items-center justify-between text-xs px-2 text-slate-500">
              <span className="font-medium">Sandbox In-Memory Preview:</span>
              <button
                onClick={() => setShowPreview(false)}
                className="text-rose-600 hover:underline text-xs"
              >
                Close Preview
              </button>
            </div>
            <iframe
              title="Single File Adhkar Preview"
              srcDoc={html}
              className="w-full h-80 rounded-xl border border-slate-200 dark:border-slate-800 bg-white"
              sandbox="allow-scripts allow-same-origin allow-downloads"
            />
          </div>
        )}

        {/* iOS & Safari Guidance Note */}
        <div className="p-3 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 space-y-1.5 text-xs text-amber-950 dark:text-amber-200">
          <div className="font-bold flex items-center gap-1.5 text-amber-900 dark:text-amber-300">
            <Smartphone className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Why Safari shows "Blocking a required security cookie":</span>
          </div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            Safari blocks third-party iframe cookies by default. When clicking external tabs, Cloud Run requires an auth cookie. 
          </p>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
            <p>
              • <strong>Best Solution:</strong> Tap <strong>Download File</strong> above (it saves locally via client memory with no cookies) or <strong>Copy Full HTML Code</strong> to paste into your phone's Notes or file app.
            </p>
            <p>
              • <strong>In Safari:</strong> Go to iPhone <em>Settings &gt; Safari &gt; Advanced / Privacy</em> and temporarily toggle off <em>"Prevent Cross-Site Tracking"</em>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
