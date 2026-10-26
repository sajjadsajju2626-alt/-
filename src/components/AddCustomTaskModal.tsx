import React, { useState } from 'react';
import { X, Plus, CheckCircle2, Bookmark } from 'lucide-react';
import { TaskCategory } from '../types/tasks.ts';

interface AddCustomTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (data: {
    title: string;
    category: TaskCategory;
    description?: string;
    arabicTitle?: string;
    malayalamTitle?: string;
  }) => void;
  isDark: boolean;
}

const CATEGORY_OPTIONS: { key: TaskCategory; label: string; iconLabel: string }[] = [
  { key: 'prayer', label: 'Prayer / Salah', iconLabel: '🕌' },
  { key: 'sunnah', label: 'Sunnah Deed', iconLabel: '✨' },
  { key: 'quran', label: 'Quran Recitation', iconLabel: '📖' },
  { key: 'dhikr', label: 'Dhikr & Dua', iconLabel: '📿' },
  { key: 'charity', label: 'Charity / Kindness', iconLabel: '🤝' },
  { key: 'custom', label: 'Personal Routine', iconLabel: '⭐' },
];

export const AddCustomTaskModal: React.FC<AddCustomTaskModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
  isDark,
}) => {
  const [title, setTitle] = useState('');
  const [malayalamTitle, setMalayalamTitle] = useState('');
  const [arabicTitle, setArabicTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('custom');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      malayalamTitle: malayalamTitle.trim() || title.trim(),
      arabicTitle: arabicTitle.trim() || title.trim(),
      description: description.trim() || undefined,
      category,
    });

    setTitle('');
    setMalayalamTitle('');
    setArabicTitle('');
    setDescription('');
    setCategory('custom');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`w-full max-w-md rounded-2xl p-6 shadow-2xl border transition-all ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold">Add Daily Sunnah / Task</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                പ്രതിദിന കർമ്മം ചേർക്കുക
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Task Title (English / Common) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Listen to Islamic lecture or Visit sick"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3 py-2 text-sm rounded-xl border outline-none transition-all ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-slate-100 focus:border-teal-400'
                  : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-teal-600'
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Malayalam Title (മലയാളത്തിൽ - Optional)
            </label>
            <input
              type="text"
              placeholder="ഉദാ: മാതാപിതാക്കളെ ഫോൺ വിളിക്കൽ"
              value={malayalamTitle}
              onChange={(e) => setMalayalamTitle(e.target.value)}
              className={`w-full px-3 py-2 text-sm rounded-xl border outline-none transition-all ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-slate-100 focus:border-teal-400'
                  : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-teal-600'
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category (വിഭാഗം)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORY_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.key}
                  onClick={() => setCategory(opt.key)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 border transition-all text-left ${
                    category === opt.key
                      ? 'border-teal-600 bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:border-teal-400 dark:text-teal-200 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="text-sm">{opt.iconLabel}</span>
                  <span className="truncate">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Notes or Goal (കുറിപ്പ് - Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Target 20 minutes before Maghrib"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-3 py-2 text-sm rounded-xl border outline-none transition-all resize-none ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-slate-100 focus:border-teal-400'
                  : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-teal-600'
              }`}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-medium border transition-colors ${
                isDark
                  ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
