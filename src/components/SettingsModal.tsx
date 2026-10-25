import React, { useState, useEffect } from 'react';
import { X, Check, Volume2, Smartphone, Type, BookOpen, Sparkles, Moon, Sun, Bell, Send, Languages, Download, ExternalLink } from 'lucide-react';
import { AppSettings, FontSize, ThemeMode, TranslationLanguage } from '../types/adhkar.ts';
import {
  getNotificationPermissionStatus,
  requestNotificationPermission,
  formatTimeDisplay,
  sendAdhkarNotification,
} from '../utils/reminder-utils.ts';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (updater: (prev: AppSettings) => AppSettings) => void;
  onOpenExportSingleFile: () => void;
  onOpenInstallModal: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onOpenExportSingleFile,
  onOpenInstallModal,
}) => {
  const [permStatus, setPermStatus] = useState<NotificationPermission | 'unsupported'>(() =>
    getNotificationPermissionStatus()
  );
  const [testSent, setTestSent] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setPermStatus(getNotificationPermissionStatus());
    }
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
                      ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 font-semibold ring-2 ring-teal-600/20'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="text-xs mb-1">{opt.label}</div>
                  <div className="font-arabic text-base">{opt.sample}</div>
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
                                ? 'bg-teal-700 text-white border-teal-700 shadow-sm font-semibold'
                                : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            <div className={`text-xs font-medium ${langOpt.id !== 'en' ? 'font-malayalam' : ''}`}>
                              {langOpt.label}
                            </div>
                            <div className="text-[10px] opacity-75 mt-0.5">{langOpt.sub}</div>
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
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                <Bell className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Daily Adhkar Reminders</span>
              </label>

              <button
                type="button"
                role="switch"
                aria-checked={settings.remindersEnabled}
                aria-label="Toggle Daily Adhkar Reminders"
                onClick={async () => {
                  const nextVal = !settings.remindersEnabled;
                  if (nextVal) {
                    const perm = await requestNotificationPermission();
                    setPermStatus(perm);
                  }
                  onUpdateSettings((s) => ({
                    ...s,
                    remindersEnabled: nextVal,
                  }));
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
              <div className="space-y-4 p-3.5 rounded-2xl bg-teal-50/50 dark:bg-slate-800/40 border border-teal-200/50 dark:border-slate-800">
                {/* Permission Status & Request Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-teal-100 dark:border-slate-800">
                  <div className="text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Browser Permission: </span>
                    <span
                      className={`font-semibold ${
                        permStatus === 'granted'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : permStatus === 'denied'
                          ? 'text-red-500'
                          : 'text-amber-600'
                      }`}
                    >
                      {permStatus === 'granted'
                        ? 'Granted ✓'
                        : permStatus === 'denied'
                        ? 'Blocked in Browser'
                        : permStatus === 'unsupported'
                        ? 'Not Supported'
                        : 'Permission Needed'}
                    </span>
                  </div>

                  {permStatus !== 'granted' && permStatus !== 'unsupported' && (
                    <button
                      type="button"
                      onClick={async () => {
                        const perm = await requestNotificationPermission();
                        setPermStatus(perm);
                      }}
                      className="px-2.5 py-1 text-xs font-semibold bg-teal-700 hover:bg-teal-600 text-white rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
                    >
                      Allow Notifications
                    </button>
                  )}
                </div>

                {permStatus === 'denied' && (
                  <p className="text-[11px] text-red-600 dark:text-red-400 leading-tight">
                    Notifications are blocked by your browser settings. To receive daily adhkar reminders, please enable notifications for this site in your browser site settings.
                  </p>
                )}

                {/* Preferred Times Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Morning Reminder Time */}
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                        <Sun className="w-3.5 h-3.5 text-amber-500" />
                        <span>Morning Time</span>
                      </span>
                      <span className="text-[11px] font-mono text-teal-700 dark:text-teal-400 font-semibold">
                        {formatTimeDisplay(settings.morningReminderTime)}
                      </span>
                    </div>

                    <input
                      type="time"
                      value={settings.morningReminderTime}
                      onChange={(e) =>
                        onUpdateSettings((s) => ({
                          ...s,
                          morningReminderTime: e.target.value,
                        }))
                      }
                      className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />

                    {/* Quick Presets */}
                    <div className="flex gap-1.5 mt-2">
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
                          className={`flex-1 py-1 text-[10px] font-mono rounded transition-colors ${
                            settings.morningReminderTime === time
                              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-700'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Evening Reminder Time */}
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                        <Moon className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Evening Time</span>
                      </span>
                      <span className="text-[11px] font-mono text-teal-700 dark:text-teal-400 font-semibold">
                        {formatTimeDisplay(settings.eveningReminderTime)}
                      </span>
                    </div>

                    <input
                      type="time"
                      value={settings.eveningReminderTime}
                      onChange={(e) =>
                        onUpdateSettings((s) => ({
                          ...s,
                          eveningReminderTime: e.target.value,
                        }))
                      }
                      className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />

                    {/* Quick Presets */}
                    <div className="flex gap-1.5 mt-2">
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
                          className={`flex-1 py-1 text-[10px] font-mono rounded transition-colors ${
                            settings.eveningReminderTime === time
                              ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 font-bold border border-indigo-300 dark:border-indigo-700'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Test Notification Button */}
                <div className="pt-1 flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Verify notification appearance:
                  </span>
                  <button
                    type="button"
                    onClick={async () => {
                      if (permStatus !== 'granted') {
                        const perm = await requestNotificationPermission();
                        setPermStatus(perm);
                        if (perm !== 'granted') return;
                      }
                      sendAdhkarNotification(
                        'Daily Adhkar Reminder • أذكار',
                        'It is time for your blessed remembrances. May Allah bless your day!',
                        onClose
                      );
                      setTestSent(true);
                      setTimeout(() => setTestSent(false), 3000);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 hover:bg-teal-200 border border-teal-300 dark:border-teal-700 transition-colors cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>{testSent ? 'Notification Sent!' : 'Send Test Notification'}</span>
                  </button>
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
