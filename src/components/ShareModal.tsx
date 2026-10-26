import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  QrCode,
  Send,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';
import QRCode from 'qrcode';
import { TabKey } from '../types/adhkar.ts';
import {
  getSharePayload,
  getSocialShareLinks,
  canNativeShare,
  copyToClipboard,
  ShareDataPayload,
} from '../utils/share.ts';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: TabKey;
  activeCategoryName: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  activeTab,
  activeCategoryName,
}) => {
  const [shareScope, setShareScope] = useState<'app' | 'category'>('app');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [showQrCode, setShowQrCode] = useState(false);
  const [hasNativeShare, setHasNativeShare] = useState(false);
  const linkInputRef = useRef<HTMLInputElement>(null);
  const qrSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHasNativeShare(canNativeShare());
    }
  }, []);

  const currentTabParam = shareScope === 'category' && activeTab !== 'tasbih' ? activeTab : 'all';
  const payload: ShareDataPayload = getSharePayload(
    shareScope === 'category' ? activeTab : undefined
  );
  const socialLinks = getSocialShareLinks(payload);

  // Generate QR Code data URL whenever target URL changes
  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(payload.url, {
        width: 240,
        margin: 2,
        color: {
          dark: '#115e59', // teal-800
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Error generating QR code:', err));
    }
  }, [isOpen, payload.url]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    await copyToClipboard(payload.url, linkInputRef.current);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 4000);
  };

  const handleCopyFullMessage = async () => {
    const fullText = `${payload.title}\n\n${payload.text}\n${payload.url}`;
    await copyToClipboard(fullText);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 4000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: payload.title,
          text: payload.text,
          url: payload.url,
        });
      } catch (err: any) {
        // User cancelled or aborted
        if (err.name !== 'AbortError') {
          console.error('Error in native share:', err);
        }
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 flex items-center justify-center shadow-xs">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 id="share-modal-title" className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                Share Daily Adhkar
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-arabic">
                مشاركة الأذكار مع الأهل والأصدقاء
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close share dialog"
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-5">
          {/* Authentic Hadith Banner */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50/60 dark:from-slate-800/80 dark:to-teal-950/40 border border-teal-200/60 dark:border-teal-800/40 shadow-xs">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-arabic font-bold text-teal-950 dark:text-teal-100 text-right leading-relaxed" dir="rtl">
                  «مَنْ دَلَّ عَلَى خَيْرٍ فَلَهُ مِثْلُ أَجْرِ فَاعِلِهِ»
                </p>
                <p className="text-xs text-teal-900 dark:text-teal-200 leading-snug">
                  <span className="font-semibold">&ldquo;Whoever guides to goodness will have a reward like the one who did it.&rdquo;</span>{' '}
                  <span className="text-[11px] opacity-75">(Sahih Muslim)</span>
                </p>
                <p className="text-[11px] text-teal-800/80 dark:text-teal-300/80 pt-0.5">
                  Share this free, authentic supplication tool to earn ongoing reward (Sadaqah Jariyah).
                </p>
              </div>
            </div>
          </div>

          {/* Share Target / Scope Picker */}
          <div>
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Select What to Share:
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShareScope('app')}
                className={`py-2 px-3 rounded-xl border text-left transition-all cursor-pointer ${
                  shareScope === 'app'
                    ? 'bg-teal-50 dark:bg-teal-950/50 border-teal-600 dark:border-teal-500 text-teal-950 dark:text-teal-100 ring-2 ring-teal-600/20 font-semibold'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="text-xs font-bold flex items-center justify-between">
                  <span>Full App</span>
                  {shareScope === 'app' && <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />}
                </div>
                <div className="text-[11px] opacity-80 mt-0.5">All Morning, Evening & Prayer Adhkar</div>
              </button>

              <button
                type="button"
                onClick={() => setShareScope('category')}
                className={`py-2 px-3 rounded-xl border text-left transition-all cursor-pointer ${
                  shareScope === 'category'
                    ? 'bg-teal-50 dark:bg-teal-950/50 border-teal-600 dark:border-teal-500 text-teal-950 dark:text-teal-100 ring-2 ring-teal-600/20 font-semibold'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="text-xs font-bold flex items-center justify-between">
                  <span>{activeCategoryName}</span>
                  {shareScope === 'category' && <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />}
                </div>
                <div className="text-[11px] opacity-80 mt-0.5">Direct link to this section</div>
              </button>
            </div>
          </div>

          {/* Native System Share Button (on phones and tablets) */}
          {hasNativeShare && (
            <div>
              <button
                type="button"
                onClick={handleNativeShare}
                className="w-full py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-[0.99]"
              >
                <Share2 className="w-4 h-4" />
                <span>Share via Phone Apps (WhatsApp, AirDrop, etc.)</span>
              </button>
            </div>
          )}

          {/* Quick Copy Link Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <span>Public App Link</span>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800/60">
                  Public &amp; No Login Required
                </span>
              </span>
              {copiedLink && (
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 animate-fadeIn">
                  <CheckCircle2 className="w-3 h-3" /> Copied!
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 p-1.5 pl-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 focus-within:ring-2 focus-within:ring-teal-500">
              <input
                ref={linkInputRef}
                type="text"
                readOnly
                value={payload.url}
                className="w-full bg-transparent text-xs text-slate-700 dark:text-slate-300 font-mono focus:outline-none select-all truncate"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <a
                href={payload.url}
                target="_blank"
                rel="noopener noreferrer"
                title="Test link in new tab"
                aria-label="Test link in new tab"
                className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-slate-200/70 dark:hover:bg-slate-700/60 transition-colors cursor-pointer shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={handleCopyLink}
                aria-label="Copy App Link"
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                  copiedLink
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-teal-700 hover:bg-teal-600 text-white shadow-xs'
                }`}
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <span>Anyone opening this link on mobile WhatsApp, SMS, or browser will open the app immediately.</span>
            </p>
          </div>

          {/* Direct Social Shortcuts */}
          <div>
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Share Instantly:
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer text-center ${link.bgColor} ${link.textColor}`}
                >
                  <MessageSquare className="w-4 h-4 mb-1" />
                  <span className="text-[11px] font-semibold tracking-tight leading-tight">
                    {link.name}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Full Invitation Text Copy & QR Code Toggle */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleCopyFullMessage}
              className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedMessage ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedMessage ? 'Copied Full Invitation!' : 'Copy Full Text with Hadith'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const next = !showQrCode;
                setShowQrCode(next);
                if (next) {
                  setTimeout(() => {
                    qrSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                  }, 80);
                }
              }}
              className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>{showQrCode ? 'Hide QR Code' : 'Show In-Person QR Code'}</span>
            </button>
          </div>

          {/* QR Code Presentation */}
          {showQrCode && (
            <div
              ref={qrSectionRef}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center animate-fadeIn"
            >
              <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-200">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Scan Daily Adhkar QR Code"
                    className="w-48 h-48 block"
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center text-xs text-slate-400">
                    Generating QR code...
                  </div>
                )}
              </div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-2.5">
                Scan with any phone camera
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs mt-0.5">
                Point iPhone or Android camera at this code to open the app instantly without typing.
              </p>
            </div>
          )}
        </div>

        {/* Done / Close Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
