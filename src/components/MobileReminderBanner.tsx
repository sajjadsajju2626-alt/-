import React, { useEffect } from 'react';
import { Bell, X, ArrowRight, ShieldCheck, Volume2 } from 'lucide-react';
import { InAppNotificationEvent } from '../utils/reminder-utils.ts';
import { TabKey, ThemeMode } from '../types/adhkar.ts';

interface MobileReminderBannerProps {
  notification: InAppNotificationEvent | null;
  onDismiss: () => void;
  onSelectTab: (tab: TabKey) => void;
  theme: ThemeMode;
}

export const MobileReminderBanner: React.FC<MobileReminderBannerProps> = ({
  notification,
  onDismiss,
  onSelectTab,
  theme,
}) => {
  const isDark = theme === 'dark' || theme === 'midnight';

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 15000);
    return () => clearTimeout(timer);
  }, [notification, onDismiss]);

  if (!notification) return null;

  const targetTab = (notification.targetTab || 'morning') as TabKey;
  const actionLabel =
    notification.actionLabel ||
    (targetTab === 'evening'
      ? 'Open Evening Adhkar'
      : targetTab === 'sleep'
      ? 'Open Sleep Adhkar'
      : targetTab === 'tasks'
      ? 'Open Daily Tasks'
      : 'Open Morning Adhkar');

  const channelBadgeText =
    notification.channel === 'service-worker'
      ? 'Service Worker Push + Mobile Audio Alert'
      : notification.channel === 'notification-api'
      ? 'Browser Push + Mobile Audio Alert'
      : 'Unblockable Mobile In-App + Audio Alert';

  return (
    <div
      data-testid="mobile-reminder-banner"
      role="status"
      aria-live="polite"
      className="fixed top-3 left-1/2 -translate-x-1/2 z-[70] w-[94%] max-w-lg animate-fade-in"
    >
      <div
        className={`rounded-2xl p-4 shadow-2xl border-2 transition-all ${
          isDark
            ? 'bg-slate-900/98 border-emerald-500/80 text-white shadow-emerald-950/60'
            : 'bg-white border-teal-800 text-black shadow-slate-900/25'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          {/* Icon & Content */}
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                isDark
                  ? 'bg-emerald-950/90 border-emerald-500/50 text-amber-300'
                  : 'bg-teal-900 border-teal-950 text-amber-300'
              }`}
            >
              <Bell className="w-5 h-5" />
            </div>

            <div className="min-w-0 flex-1">
              {/* Top Delivery Badge */}
              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider border ${
                    isDark
                      ? 'bg-emerald-950/80 border-emerald-600/60 text-emerald-300'
                      : 'bg-emerald-100 border-emerald-700 text-black'
                  }`}
                >
                  <ShieldCheck className="w-3 h-3 shrink-0" />
                  <span>{channelBadgeText}</span>
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-extrabold ${
                    isDark ? 'text-amber-300' : 'text-black'
                  }`}
                >
                  <Volume2 className="w-3 h-3" />
                  <span>Chime Active</span>
                </span>
              </div>

              {/* Title */}
              <h3
                className={`text-sm sm:text-base font-extrabold leading-snug ${
                  isDark ? 'text-white' : 'text-black'
                }`}
              >
                {notification.title}
              </h3>

              {/* Arabic & Malayalam Subtitles */}
              {(notification.arabicSubtitle || notification.malayalamSubtitle) && (
                <div className="flex flex-wrap items-center gap-2 mt-0.5">
                  {notification.malayalamSubtitle && (
                    <span
                      className={`text-xs font-malayalam font-black ${
                        isDark ? 'text-amber-300' : 'text-black'
                      }`}
                    >
                      {notification.malayalamSubtitle}
                    </span>
                  )}
                  {notification.arabicSubtitle && (
                    <span
                      className={`text-sm font-arabic font-bold ${
                        isDark ? 'text-emerald-300' : 'text-black'
                      }`}
                    >
                      • {notification.arabicSubtitle}
                    </span>
                  )}
                </div>
              )}

              {/* Message Body */}
              <p
                className={`text-xs mt-1.5 leading-relaxed ${
                  isDark ? 'text-slate-200 font-medium' : 'text-black font-bold'
                }`}
              >
                {notification.body}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <button
                  type="button"
                  data-testid="mobile-reminder-action-btn"
                  onClick={() => {
                    if (notification.onClick) {
                      notification.onClick();
                    } else {
                      onSelectTab(targetTab);
                    }
                    onDismiss();
                  }}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-colors cursor-pointer shadow-xs ${
                    isDark
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-teal-900 hover:bg-teal-800 text-white'
                  }`}
                >
                  <span>{actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  data-testid="mobile-reminder-dismiss-btn"
                  onClick={onDismiss}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-colors cursor-pointer ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                      : 'bg-slate-100 hover:bg-slate-200 border-slate-500 text-black'
                  }`}
                >
                  Alhamdulillah • Dismiss
                </button>
              </div>
            </div>
          </div>

          {/* Close Icon */}
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Close reminder notification"
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark
                ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                : 'text-black hover:bg-slate-200 font-bold'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
