import React, { useState, useEffect } from 'react';
import { X, Check, Volume2, Smartphone, Type, BookOpen, Sparkles, Moon, Sun, Bell, Send, Languages, Download, ExternalLink, Share2, Target, ShieldCheck } from 'lucide-react';
import { AppSettings, FontSize, ThemeMode, TranslationLanguage } from '../types/adhkar.ts';
import {
  getNotificationPermissionStatus,
  requestNotificationPermission,
  formatTimeDisplay,
  dispatchMobileSafeNotification,
  getMobileNotificationDiagnostics,
  registerAdhkarServiceWorker,
  getMsUntilNextTime,
  formatMsUntilNextTrigger,
  getNextMinuteTimeString,
} from '../utils/reminder-utils.ts';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (updater: (prev: AppSettings) => AppSettings) => void;
  onOpenExportSingleFile: () => void;
  onOpenInstallModal: () => void;
  onOpenShareModal: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onOpenExportSingleFile,
  onOpenInstallModal,
  onOpenShareModal,
}) => {
  const [permStatus, setPermStatus] = useState<NotificationPermission | 'unsupported'>(() =>
    getNotificationPermissionStatus()
  );
  const [swReady, setSwReady] = useState<boolean>(false);
  const [testSent, setTestSent] = useState<boolean>(false);
  const [lastTestChannel, setLastTestChannel] = useState<string>('');
  const [nowTick, setNowTick] = useState<Date>(() => new Date());

  useEffect(() => {
    if (!isOpen) return;
    setPermStatus(getNotificationPermissionStatus());
    setNowTick(new Date());
    registerAdhkarServiceWorker().then((reg) => {
      const diag = getMobileNotificationDiagnostics();
      setSwReady(Boolean(reg || diag.serviceWorkerSupported));
    });
    const timer = setInterval(() => {
      setNowTick(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const fontOptions: { id: FontSize; label: string; sample: string }[] = [
    { id: 'medium', label: 'Medium', sample: 'بِسْمِ اللَّهِ' },
    { id: 'large', label: 'Large', sample: 'بِسْمِ اللَّهِ' },
    { id: 'xlarge', label: 'Extra Large', sample: 'بِسْمِ اللَّهِ' },
  ];

  const themeOptions: { id: ThemeMode; label: string; bg: string }[] = [
    { id: 'emerald', label: 'Emerald Light', bg: 'bg-teal-700' },
    { id: 'dark', label: 'Slate Dark', bg: 'bg-slate-900' },
    { id: 'midnight', label: 'OLED Midnight', bg: 'bg-black' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h2 id="settings-title" className="text-lg font-bold text-slate-900 dark:text-white">
              Display & Preferences
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close settings"
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-6">
          {/* Arabic Font Size */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
              <Type className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Arabic Script Size</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {fontOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() =>
                    onUpdateSettings((s) => ({ ...s, arabicFontSize: opt.id }))
                  }
                  className={`py-2 px-3 rounded-xl border text-center transition-all ${
                    settings.arabicFontSize === opt.id
                      ? 'border-teal-700 bg-teal-50 dark:bg-teal-950/40 text-teal-950 dark:text-teal-200 font-bold ring-2 ring-teal-700/30'
                      : 'border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium'
                  }`}
                >
                  <div className="text-xs mb-1 font-semibold">{opt.label}</div>
                  <div className="font-arabic text-base font-bold text-slate-950 dark:text-white">{opt.sample}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Reading Toggles */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
              <BookOpen className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Content & Reading Aids</span>
            </label>
            <div className="space-y-2.5">
              {/* Transliteration */}
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                <div>
                  <div className="text-sm font-medium text-slate-900 dark:text-white">
                    Transliteration
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Phonetic Latin pronunciation guide
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showTransliteration}
                  onChange={(e) =>
                    onUpdateSettings((s) => ({
                      ...s,
                      showTransliteration: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                />
              </label>

              {/* Translation Toggle & Language Selector */}
              <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <div className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Languages className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      <span>Translations / അർത്ഥം</span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Understand meanings in Malayalam, English, or both
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showTranslation}
                    onChange={(e) =>
                      onUpdateSettings((s) => ({
                        ...s,
                        showTranslation: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                  />
                </label>

                {settings.showTranslation && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Translation Language:
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        {
                          id: 'both' as TranslationLanguage,
                          label: 'Both (രണ്ടും)',
                          sub: 'Malayalam + EN',
                        },
                        {
                          id: 'ml' as TranslationLanguage,
                          label: 'മലയാളം',
                          sub: 'Malayalam Only',
                        },
                        {
                          id: 'en' as TranslationLanguage,
                          label: 'English',
                          sub: 'English Only',
                        },
                      ].map((langOpt) => {
                        const isSelected =
                          (settings.translationLanguage || 'both') === langOpt.id;
                        return (
                          <button
                            key={langOpt.id}
                            type="button"
                            onClick={() =>
                              onUpdateSettings((s) => ({
                                ...s,
                                translationLanguage: langOpt.id,
                              }))
                            }
                            className={`py-2 px-2 rounded-xl text-center border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-teal-800 text-white border-teal-800 shadow-sm font-bold'
                                : 'bg-slate-100 dark:bg-slate-800/60 text-slate-900 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 font-semibold'
                            }`}
                          >
                            <div className={`text-xs font-bold ${langOpt.id !== 'en' ? 'font-malayalam' : ''}`}>
                              {langOpt.label}
                            </div>
                            <div className="text-[10px] text-slate-700 dark:text-slate-400 mt-0.5 font-medium">{langOpt.sub}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Virtues & Hadith sources */}
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                <div>
                  <div className="text-sm font-medium text-slate-900 dark:text-white">
                    Virtues & References
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Hadith citation and spiritual benefits
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showVirtues}
                  onChange={(e) =>
                    onUpdateSettings((s) => ({
                      ...s,
                      showVirtues: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                />
              </label>

              {/* Card tap to count */}
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                <div>
                  <div className="text-sm font-medium text-slate-900 dark:text-white">
                    Tap Anywhere on Card
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Increment count by tapping the card body
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.cardTapToCount}
                  onChange={(e) =>
                    onUpdateSettings((s) => ({
                      ...s,
                      cardTapToCount: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                />
              </label>
            </div>
          </div>

          {/* Sensory Feedback */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
              <Volume2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Sensory & Feedback</span>
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) =>
                    onUpdateSettings((s) => ({
                      ...s,
                      soundEnabled: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                />
                <div className="text-xs">
                  <div className="font-semibold text-slate-900 dark:text-white">
                    Sound Click
                  </div>
                  <div className="text-slate-500 dark:text-slate-400">Subtle tap audio</div>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <input
                  type="checkbox"
                  checked={settings.vibrateEnabled}
                  onChange={(e) =>
                    onUpdateSettings((s) => ({
                      ...s,
                      vibrateEnabled: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                />
                <div className="text-xs">
                  <div className="font-semibold text-slate-900 dark:text-white">
                    Haptics
                  </div>
                  <div className="text-slate-500 dark:text-slate-400">Vibration feedback</div>
                </div>
              </label>
            </div>
          </div>

          {/* Daily Reminders & Browser Notifications */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <label className="flex items-center gap-2 text-sm font-extrabold text-black dark:text-slate-200">
                <Bell className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                <span>Daily Adhkar Reminders</span>
              </label>

              <button
                type="button"
                role="switch"
                data-testid="toggle-daily-reminders-switch"
                aria-checked={settings.remindersEnabled}
                aria-label="Toggle Daily Adhkar Reminders"
                onClick={async () => {
                  const nextVal = !settings.remindersEnabled;
                  onUpdateSettings((s) => ({
                    ...s,
                    remindersEnabled: nextVal,
                  }));
                  if (nextVal) {
                    const perm = await requestNotificationPermission();
                    setPermStatus(perm);
                  }
                }}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  settings.remindersEnabled ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`block w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-150 ${
                    settings.remindersEnabled ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {settings.remindersEnabled && (
              <div className="space-y-4 p-3.5 rounded-2xl bg-teal-50/70 dark:bg-slate-800/40 border border-teal-600 dark:border-slate-800">
                {/* Dual-Trigger Notification Architecture Status Card */}
                <div
                  data-testid="mobile-notification-status-card"
                  className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-teal-600 dark:border-slate-800 space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                      <span className="text-xs font-extrabold text-black dark:text-white">
                        Dual-Trigger Notification Engine:
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/70 text-black dark:text-emerald-300 border border-emerald-700 dark:border-emerald-700">
                        {swReady ? 'SW + Native + In-App ✓' : 'Native + In-App ✓'}
                      </span>
                    </div>

                    {permStatus !== 'granted' && permStatus !== 'unsupported' && (
                      <button
                        type="button"
                        onClick={async () => {
                          const perm = await requestNotificationPermission(1500);
                          setPermStatus(perm);
                        }}
                        className="px-2.5 py-1 text-xs font-bold bg-teal-800 hover:bg-teal-700 text-white rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
                      >
                        Allow System Push
                      </button>
                    )}
                  </div>

                  <div className="text-[11px] font-bold text-black dark:text-slate-300 leading-relaxed">
                    <span>
                      1. <strong>Service Worker (500ms timeout)</strong>:{' '}
                      <code>navigator.serviceWorker.ready.then(reg =&gt; reg.showNotification(...))</code>
                      <br />
                      2. <strong>Native Fallback</strong>:{' '}
                      <code>new Notification(&apos;Daily Adhkar&apos;, &#123; ... &#125;)</code> if SW takes &gt;500ms or is unavailable
                      <br />
                      3. <strong>Guaranteed In-App Toast + Chime</strong>: Displays{' '}
                      <span className="font-malayalam font-black">നോട്ടിഫിക്കേഷൻ അയച്ചു!</span> immediately even if WebView blocks OS notifications.
                    </span>
                  </div>
                </div>

                {/* Preferred Times Grid (Morning Fajr & Evening Asr) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Morning (Fajr) Reminder Time */}
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-400 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-extrabold text-black dark:text-slate-200 flex items-center gap-1">
                        <Sun className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        <span>Morning (Fajr)</span>
                      </span>
                      <span
                        data-testid="morning-formatted-time"
                        className="text-[11px] font-mono text-teal-900 dark:text-teal-400 font-extrabold"
                      >
                        {formatTimeDisplay(settings.morningReminderTime)}
                      </span>
                    </div>

                    <div
                      data-testid="morning-next-countdown"
                      className="text-[10px] font-mono font-extrabold text-emerald-900 dark:text-emerald-400 mb-1.5 flex items-center justify-between"
                    >
                      <span> Exact :00s Timer Armed</span>
                      <span>
                        in {formatMsUntilNextTrigger(getMsUntilNextTime(settings.morningReminderTime, nowTick))}
                      </span>
                    </div>

                    <input
                      type="time"
                      aria-label="Morning Reminder Time"
                      data-testid="morning-time-input"
                      value={settings.morningReminderTime}
                      onChange={(e) =>
                        onUpdateSettings((s) => ({
                          ...s,
                          morningReminderTime: e.target.value,
                        }))
                      }
                      className="w-full px-2.5 py-1.5 text-xs font-mono font-bold rounded-lg border border-slate-400 dark:border-slate-700 dark:bg-slate-800 text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />

                    {/* Quick Presets + Instant Next-Minute Test Pill */}
                    <div className="flex gap-1 mt-2">
                      {['05:30', '06:00', '07:00'].map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() =>
                            onUpdateSettings((s) => ({
                              ...s,
                              morningReminderTime: time,
                            }))
                          }
                          className={`flex-1 py-1 text-[10px] font-mono rounded transition-colors cursor-pointer ${
                            settings.morningReminderTime === time
                              ? 'bg-amber-200 dark:bg-amber-950/60 text-black dark:text-amber-300 font-extrabold border border-amber-600 dark:border-amber-700'
                              : 'bg-slate-100 dark:bg-slate-800 text-black dark:text-slate-400 font-bold hover:bg-slate-200 border border-slate-300 dark:border-slate-700'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                      <button
                        type="button"
                        data-testid="morning-plus-1m-pill"
                        title="Set Morning reminder to next minute (:00s) to test auto-trigger"
                        onClick={() => {
                          const nextMin = getNextMinuteTimeString(new Date());
                          onUpdateSettings((s) => ({
                            ...s,
                            morningReminderTime: nextMin,
                          }));
                        }}
                        className="px-1.5 py-1 text-[10px] font-mono font-extrabold rounded bg-emerald-100 dark:bg-emerald-950/70 text-black dark:text-emerald-300 border border-emerald-700 hover:bg-emerald-200 transition-colors cursor-pointer"
                      >
                        +1m
                      </button>
                    </div>
                  </div>

                  {/* Evening (Asr) Reminder Time */}
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-400 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-extrabold text-black dark:text-slate-200 flex items-center gap-1">
                        <Moon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        <span>Evening (Asr)</span>
                      </span>
                      <span
                        data-testid="evening-formatted-time"
                        className="text-[11px] font-mono text-teal-900 dark:text-teal-400 font-extrabold"
                      >
                        {formatTimeDisplay(settings.eveningReminderTime)}
                      </span>
                    </div>

                    <div
                      data-testid="evening-next-countdown"
                      className="text-[10px] font-mono font-extrabold text-emerald-900 dark:text-emerald-400 mb-1.5 flex items-center justify-between"
                    >
                      <span>Exact :00s Timer Armed</span>
                      <span>
                        in {formatMsUntilNextTrigger(getMsUntilNextTime(settings.eveningReminderTime, nowTick))}
                      </span>
                    </div>

                    <input
                      type="time"
                      aria-label="Evening Reminder Time"
                      data-testid="evening-time-input"
                      value={settings.eveningReminderTime}
                      onChange={(e) =>
                        onUpdateSettings((s) => ({
                          ...s,
                          eveningReminderTime: e.target.value,
                        }))
                      }
                      className="w-full px-2.5 py-1.5 text-xs font-mono font-bold rounded-lg border border-slate-400 dark:border-slate-700 dark:bg-slate-800 text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />

                    {/* Quick Presets + Instant Next-Minute Test Pill */}
                    <div className="flex gap-1 mt-2">
                      {['16:30', '17:30', '18:30'].map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() =>
                            onUpdateSettings((s) => ({
                              ...s,
                              eveningReminderTime: time,
                            }))
                          }
                          className={`flex-1 py-1 text-[10px] font-mono rounded transition-colors cursor-pointer ${
                            settings.eveningReminderTime === time
                              ? 'bg-indigo-100 dark:bg-indigo-950/60 text-black dark:text-indigo-300 font-extrabold border border-indigo-600 dark:border-indigo-700'
                              : 'bg-slate-100 dark:bg-slate-800 text-black dark:text-slate-400 font-bold hover:bg-slate-200 border border-slate-300 dark:border-slate-700'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                      <button
                        type="button"
                        data-testid="evening-plus-1m-pill"
                        title="Set Evening reminder to next minute (:00s) to test auto-trigger"
                        onClick={() => {
                          const nextMin = getNextMinuteTimeString(new Date());
                          onUpdateSettings((s) => ({
                            ...s,
                            eveningReminderTime: nextMin,
                          }));
                        }}
                        className="px-1.5 py-1 text-[10px] font-mono font-extrabold rounded bg-emerald-100 dark:bg-emerald-950/70 text-black dark:text-emerald-300 border border-emerald-700 hover:bg-emerald-200 transition-colors cursor-pointer"
                      >
                        +1m
                      </button>
                    </div>
                  </div>
                </div>

                {/* Daily Goal Completion Reminder */}
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-600 dark:border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-extrabold text-black dark:text-white flex items-center gap-1.5">
                        <Target className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                        <span>Daily Goal Completion Reminder</span>
                      </div>
                      <div className="text-[11px] font-bold text-black dark:text-slate-400 mt-0.5 leading-tight">
                        Sends a reminder if daily goal progress is &lt; 100%
                      </div>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={settings.goalReminderEnabled}
                      aria-label="Toggle Daily Goal Reminder"
                      onClick={() =>
                        onUpdateSettings((s) => ({
                          ...s,
                          goalReminderEnabled: !s.goalReminderEnabled,
                        }))
                      }
                      className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        settings.goalReminderEnabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span
                        className={`block w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-150 ${
                          settings.goalReminderEnabled ? 'translate-x-4' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  {settings.goalReminderEnabled && (
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-extrabold text-black dark:text-slate-300">
                          Reminder Scheduled Time:
                        </span>
                        <span className="text-xs font-mono text-emerald-800 dark:text-emerald-400 font-extrabold">
                          {formatTimeDisplay(settings.dailyGoalReminderTime || '20:00')}
                        </span>
                      </div>

                      <input
                        type="time"
                        aria-label="Daily Goal Reminder Time"
                        value={settings.dailyGoalReminderTime || '20:00'}
                        onChange={(e) =>
                          onUpdateSettings((s) => ({
                            ...s,
                            dailyGoalReminderTime: e.target.value,
                          }))
                        }
                        className="w-full px-2.5 py-1.5 text-xs font-mono font-bold rounded-lg border border-slate-400 dark:border-slate-700 dark:bg-slate-800 text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />

                      {/* Quick Presets for Goal Reminder */}
                      <div className="flex gap-1.5 mt-2">
                        {['19:00', '20:00', '21:00', '22:00'].map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() =>
                              onUpdateSettings((s) => ({
                                ...s,
                                dailyGoalReminderTime: time,
                              }))
                            }
                            className={`flex-1 py-1 text-[10px] font-mono rounded transition-colors cursor-pointer ${
                              (settings.dailyGoalReminderTime || '20:00') === time
                                ? 'bg-emerald-200 dark:bg-emerald-950/60 text-black dark:text-emerald-300 font-extrabold border border-emerald-700 dark:border-emerald-700'
                                : 'bg-slate-100 dark:bg-slate-800 text-black dark:text-slate-400 font-bold hover:bg-slate-200 border border-slate-300 dark:border-slate-700'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Dual-Trigger Test Notification & Screen-Off Catch-Up Alert */}
                <div className="pt-1 space-y-2">
                  <div className="text-xs font-bold text-black dark:text-slate-300">
                    Test Dual-Trigger Notification (SW 500ms &rarr; Native &rarr; In-App Toast):
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      data-testid="send-test-notification-btn"
                      onClick={async () => {
                        setTestSent(true);
                        if (permStatus === 'default') {
                          requestNotificationPermission(1500)
                            .then((perm) => setPermStatus(perm))
                            .catch(() => {});
                        }
                        const channel = await dispatchMobileSafeNotification(
                          'Daily Adhkar',
                          'രാവിലെത്തെ ദിക്റുകൾ ചൊല്ലാൻ സമയമായി 🌅',
                          undefined,
                          {
                            arabicSubtitle: 'أَذْكَارُ الصَّبَاحِ • تذكير الأذكار',
                            malayalamSubtitle: 'പ്രഭാത ദിക്റുകൾ • Morning Remembrances',
                            targetTab: 'morning',
                            actionLabel: 'Open Morning Adhkar',
                            tag: 'adhkar-test-notification',
                            icon: 'icon.png',
                          }
                        );
                        setLastTestChannel(channel);
                        setTimeout(() => setTestSent(false), 5000);
                      }}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-extrabold rounded-xl bg-teal-900 hover:bg-teal-800 text-white border border-teal-950 dark:bg-teal-800 dark:hover:bg-teal-700 dark:border-teal-600 transition-colors cursor-pointer shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span className="font-malayalam">
                        {testSent
                          ? `നോട്ടിഫിക്കേഷൻ അയച്ചു! (${
                              lastTestChannel === 'service-worker'
                                ? 'SW Push'
                                : lastTestChannel === 'notification-api'
                                ? 'Native Push'
                                : 'In-App Toast'
                            }) ✓`
                          : 'Send Test Notification'}
                      </span>
                    </button>

                    <button
                      type="button"
                      data-testid="simulate-catchup-alert-btn"
                      onClick={async () => {
                        setTestSent(true);
                        const isEveningHour = new Date().getHours() >= 15;
                        const channel = await dispatchMobileSafeNotification(
                          isEveningHour
                            ? '🌙 Missed Evening (Asr) Adhkar • Catch-Up Alert'
                            : '🌅 Missed Morning (Fajr) Adhkar • Catch-Up Alert',
                          isEveningHour
                            ? `വൈകുന്നേരത്തെ ദിക്റുകൾ ചൊല്ലാൻ സമയമായി 🌙 • Scheduled Asr Adhkar (${formatTimeDisplay(
                                settings.eveningReminderTime
                              )}) was missed while screen was off.`
                            : `രാവിലെത്തെ ദിക്റുകൾ ചൊല്ലാൻ സമയമായി 🌅 • Scheduled Fajr Adhkar (${formatTimeDisplay(
                                settings.morningReminderTime
                              )}) was missed while screen was off.`,
                          undefined,
                          {
                            arabicSubtitle: isEveningHour
                              ? 'أَذْكَارُ الْمَسَاءِ (العصر)'
                              : 'أَذْكَارُ الصَّبَاحِ (الفجر)',
                            malayalamSubtitle: isEveningHour
                              ? 'സായാഹ്ന ദിക്റുകൾ (അസർ) • Screen-Off Catch-Up'
                              : 'പ്രഭാത ദിക്റുകൾ (ഫജ്റ്) • Screen-Off Catch-Up',
                            targetTab: isEveningHour ? 'evening' : 'morning',
                            actionLabel: isEveningHour
                              ? 'Recite Evening (Asr) Adhkar'
                              : 'Recite Morning (Fajr) Adhkar',
                            tag: 'adhkar-catchup-test',
                            icon: 'icon.png',
                            isCatchUp: true,
                            period: isEveningHour ? 'evening' : 'morning',
                          }
                        );
                        setLastTestChannel(channel);
                        setTimeout(() => setTestSent(false), 5000);
                      }}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-extrabold rounded-xl bg-amber-100 hover:bg-amber-200 text-black border border-amber-700 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 dark:text-amber-300 dark:border-amber-600 transition-colors cursor-pointer shadow-xs"
                    >
                      <span>⚡ Test Screen-Off Catch-Up</span>
                    </button>
                  </div>

                  {testSent && (
                    <div
                      data-testid="settings-debug-feedback"
                      className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-700 text-xs font-extrabold text-black dark:text-emerald-200 flex items-center justify-between gap-2"
                    >
                      <span className="font-malayalam">നോട്ടിഫിക്കേഷൻ അയച്ചു! ✓</span>
                      <span className="font-mono text-[11px]">
                        Channel:{' '}
                        {lastTestChannel === 'service-worker'
                          ? 'Service Worker (reg.showNotification)'
                          : lastTestChannel === 'notification-api'
                          ? 'Native new Notification()'
                          : 'In-App Toast + Audio Chime'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme Selector */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
              <Moon className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Theme</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {themeOptions.map((thm) => (
                <button
                  key={thm.id}
                  onClick={() =>
                    onUpdateSettings((s) => ({ ...s, theme: thm.id }))
                  }
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    settings.theme === thm.id
                      ? 'border-teal-600 ring-2 ring-teal-600/20 font-semibold'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className={`w-full h-4 rounded-md mb-1.5 ${thm.bg}`} />
                  <div className="text-xs text-slate-800 dark:text-slate-200">
                    {thm.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Add to Home Screen Option */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
              <Smartphone className="w-4 h-4 text-amber-500" />
              <span>Add to Home Screen (App Shortcut)</span>
            </label>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Install Daily Adhkar directly on your iPhone, iPad, or Android home screen for quick daily remembrance without browser navigation bars.
            </p>
            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenInstallModal();
                }}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                <span>Open Add to Home Screen Helper</span>
              </button>
            </div>
          </div>

          {/* Share App with Family & Friends */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
              <Share2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Share App</span>
              <span className="font-arabic font-normal text-xs text-slate-500 dark:text-slate-400">
                (مشاركة التطبيق)
              </span>
            </label>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Earn ongoing good deeds (Sadaqah Jariyah) by sharing Daily Adhkar with loved ones, friends, and community groups via WhatsApp, Telegram, QR code, or direct link.
            </p>
            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenShareModal();
                }}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Open Sharing Options (WhatsApp, Link, QR)</span>
              </button>
            </div>
          </div>

          {/* Standalone Single File Offline Download */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
              <Download className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Offline Single-File Version</span>
            </label>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Get the complete all-in-one standalone HTML version. It contains all 23 morning, 23 evening, prayer, and sleep adhkar, full Malayalam & English translations, interactive counter, streak tracking, and built-in audio synth. Works anywhere offline with zero installation or servers!
            </p>
            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenExportSingleFile();
                }}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 dark:hover:bg-teal-900/40 text-teal-800 dark:text-teal-200 border border-teal-300 dark:border-teal-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Open Offline Single-File Exporter (.html)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Done Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 bg-teal-700 hover:bg-teal-600 text-white rounded-xl font-bold text-sm shadow-md transition-colors"
          >
            Done & Save
          </button>
        </div>
      </div>
    </div>
  );
};
