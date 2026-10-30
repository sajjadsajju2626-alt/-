import React, { useState, useMemo } from 'react';
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Search,
  BarChart3,
  Award,
  AlertCircle,
} from 'lucide-react';
import { DailyTask, TaskCategory, TaskFilterStatus } from '../types/tasks.ts';
import { AddCustomTaskModal } from './AddCustomTaskModal.tsx';
import {
  calculateTasksProgress,
  loadAndSyncTaskHistory,
  buildTaskAuditReport,
  TaskAuditPeriod,
  TaskAuditFilter,
} from '../utils/tasks-utils.ts';
import { getTodayDateString } from '../utils/adhkar-utils.ts';
import { playCompletionSound, triggerHaptic } from '../utils/audio.ts';

interface DailyTasksTrackerProps {
  tasks: DailyTask[];
  onToggleTask: (taskId: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onAddTask: (data: {
    title: string;
    category: TaskCategory;
    description?: string;
    arabicTitle?: string;
    malayalamTitle?: string;
  }) => void;
  onDeleteTask: (taskId: string) => void;
  onResetTasks: () => void;
  onCompleteAllTasks: () => void;
  soundEnabled: boolean;
  vibrateEnabled: boolean;
  theme: string;
}

const CATEGORY_TABS: { key: string; label: string; icon: string }[] = [
  { key: 'all', label: 'All', icon: '📋' },
  { key: 'prayer', label: 'Prayers', icon: '🕌' },
  { key: 'sunnah', label: 'Sunnah', icon: '✨' },
  { key: 'quran', label: 'Quran', icon: '📖' },
  { key: 'dhikr', label: 'Dhikr', icon: '📿' },
  { key: 'charity', label: 'Charity', icon: '🤝' },
  { key: 'custom', label: 'Personal', icon: '⭐' },
];

export const DailyTasksTracker: React.FC<DailyTasksTrackerProps> = ({
  tasks,
  onToggleTask,
  onToggleSubtask,
  onAddTask,
  onDeleteTask,
  onResetTasks,
  onCompleteAllTasks,
  soundEnabled,
  vibrateEnabled,
  theme,
}) => {
  const isDark = theme === 'dark' || theme === 'midnight';
  const [filterStatus, setFilterStatus] = useState<TaskFilterStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedVirtueIds, setExpandedVirtueIds] = useState<Record<string, boolean>>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Weekly & Monthly Task Audit (ടാസ്ക് പുരോഗതി) state
  const [auditPeriod, setAuditPeriod] = useState<TaskAuditPeriod>('week');
  const [auditFilter, setAuditFilter] = useState<TaskAuditFilter>('all');

  const stats = calculateTasksProgress(tasks);
  const todayStr = getTodayDateString(new Date());

  // Dynamically pull and sync task completion history from localStorage
  const auditReport = useMemo(() => {
    const historyMap = loadAndSyncTaskHistory(todayStr, tasks);
    return buildTaskAuditReport(tasks, historyMap, auditPeriod, auditFilter, todayStr);
  }, [tasks, auditPeriod, auditFilter, todayStr]);

  const toggleVirtue = (id: string) => {
    setExpandedVirtueIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTaskCheck = (taskId: string) => {
    onToggleTask(taskId);
    if (soundEnabled) playCompletionSound();
    if (vibrateEnabled) triggerHaptic('tap');
  };

  const handleSubtaskCheck = (taskId: string, subtaskId: string) => {
    onToggleSubtask(taskId, subtaskId);
    if (soundEnabled) playCompletionSound();
    if (vibrateEnabled) triggerHaptic('tap');
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (filterStatus === 'incomplete' && t.completed) return false;
    if (filterStatus === 'completed' && !t.completed) return false;
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchText = `${t.title} ${t.arabicTitle} ${t.malayalamTitle} ${t.description || ''} ${t.malayalamDescription || ''} ${t.virtue || ''}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Daily Progress & Motivation Banner */}
      <div
        className={`rounded-2xl p-4 sm:p-5 border shadow-sm transition-all ${
          stats.isAllDone
            ? 'bg-gradient-to-br from-emerald-800 to-teal-900 text-white border-emerald-600'
            : isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-400 text-black'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`p-1.5 rounded-lg ${isDark ? 'bg-teal-500/20 text-teal-400' : 'bg-teal-100 text-teal-900'}`}>
                <CheckSquare className="w-5 h-5 stroke-[2.5]" />
              </span>
              <h2 className="text-base sm:text-lg font-extrabold">
                Daily Islamic Tasks & Checklist
              </h2>
            </div>
            <p className={`text-xs font-arabic ${isDark ? 'text-slate-400' : 'text-black font-bold'}`}>
              المهام اليومية والسنن الراتبة • പ്രതിദിന സുന്നത്തുകളും കർമ്മങ്ങളും
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-teal-800 hover:bg-teal-900 text-white shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Task</span>
            </button>
            <button
              onClick={onCompleteAllTasks}
              className={`px-3 py-1.5 rounded-xl text-xs border transition-all cursor-pointer ${
                isDark
                  ? 'border-slate-700 hover:bg-slate-800 text-slate-300 font-medium'
                  : 'border-2 border-slate-400 hover:bg-slate-200 text-black font-extrabold bg-white'
              }`}
            >
              Complete All
            </button>
            <button
              onClick={onResetTasks}
              title="Reset all checkboxes for today"
              className={`p-1.5 rounded-xl text-xs border transition-all cursor-pointer ${
                isDark
                  ? 'border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-medium'
                  : 'border-2 border-slate-400 hover:bg-slate-200 text-black font-extrabold bg-white'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Progress Bar & Counter */}
        <div className={`mt-4 pt-3 border-t ${isDark ? 'border-slate-800/60' : 'border-slate-300'}`}>
          <div className="flex items-center justify-between text-xs mb-1.5 font-extrabold">
            <span className="flex items-center gap-1.5">
              <span>Today’s Consistency:</span>
              <span className={`font-black font-mono ${isDark ? 'text-teal-400' : 'text-teal-900'}`}>
                {stats.completed} of {stats.total}
              </span>
              <span className="text-[11px]">
                ({stats.percent}%)
              </span>
            </span>

            {stats.isAllDone ? (
              <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
                <span>All completed today! Masha'Allah</span>
              </span>
            ) : (
              <span className={`text-[11px] font-bold ${isDark ? 'text-slate-400' : 'text-black'}`}>
                {stats.total - stats.completed} remaining
              </span>
            )}
          </div>

          <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-300'}`}>
            <div
              className="bg-gradient-to-r from-teal-600 to-emerald-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${stats.percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-2">
        {/* Search Input */}
        <div className="relative">
          <Search className={`w-4 h-4 absolute left-3 top-2.5 ${isDark ? 'text-slate-400' : 'text-slate-800'}`} />
          <input
            type="text"
            placeholder="Search tasks, prayers, virtues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border outline-none transition-all ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-slate-100 placeholder-slate-500 focus:border-teal-500'
                : 'bg-white border-slate-400 text-black font-bold placeholder-slate-700 focus:border-teal-700'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={`absolute right-3 top-2.5 text-xs font-bold ${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-black hover:underline'}`}
            >
              Clear
            </button>
          )}
        </div>

        {/* Status Filters & Category Pills */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-1">
          {/* Status buttons */}
          <div className={`flex items-center gap-1 p-0.5 rounded-lg shrink-0 border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-400'}`}>
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2 py-1 rounded-md text-[11px] font-extrabold transition-all cursor-pointer ${
                filterStatus === 'all'
                  ? 'bg-teal-900 text-white shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-white font-medium'
                  : 'text-black hover:bg-slate-200'
              }`}
            >
              All ({tasks.length})
            </button>
            <button
              onClick={() => setFilterStatus('incomplete')}
              className={`px-2 py-1 rounded-md text-[11px] font-extrabold transition-all cursor-pointer ${
                filterStatus === 'incomplete'
                  ? 'bg-teal-900 text-white shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-white font-medium'
                  : 'text-black hover:bg-slate-200'
              }`}
            >
              Remaining ({tasks.filter((t) => !t.completed).length})
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-2 py-1 rounded-md text-[11px] font-extrabold transition-all cursor-pointer ${
                filterStatus === 'completed'
                  ? 'bg-teal-900 text-white shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-white font-medium'
                  : 'text-black hover:bg-slate-200'
              }`}
            >
              Done ({tasks.filter((t) => t.completed).length})
            </button>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1 shrink-0">
            {CATEGORY_TABS.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setCategoryFilter(cat.key)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold flex items-center gap-1 border transition-all cursor-pointer ${
                  categoryFilter === cat.key
                    ? isDark
                      ? 'border-teal-400 bg-teal-950 text-teal-200 font-semibold'
                      : 'border-teal-800 bg-teal-900 text-white'
                    : isDark
                    ? 'border-transparent text-slate-400 hover:bg-slate-800 font-medium'
                    : 'border-slate-300 bg-white text-black hover:bg-slate-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div
            className={`text-center py-12 px-4 rounded-2xl border ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300'
            }`}
          >
            <CheckCircle2 className="w-10 h-10 mx-auto text-slate-400 mb-2 opacity-50" />
            <h3 className={`text-sm font-bold ${isDark ? 'text-slate-300' : 'text-black'}`}>
              No tasks match your filter
            </h3>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-800 font-semibold'}`}>
              Try changing the filter or search query.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const hasSubtasks = !!task.subtasks && task.subtasks.length > 0;
            const completedSubtasksCount =
              task.subtasks?.filter((s) => s.completed).length || 0;
            const isVirtueExpanded = !!expandedVirtueIds[task.id];

            return (
              <div
                key={task.id}
                className={`rounded-2xl border p-4 transition-all ${
                  task.completed
                    ? isDark
                      ? 'bg-slate-900/40 border-teal-800/40 opacity-90'
                      : 'bg-emerald-50/70 border-emerald-400'
                    : isDark
                    ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    : 'bg-white border-slate-300 hover:border-slate-400 shadow-xs'
                }`}
              >
                {/* Main Task Header */}
                <div className="flex items-start gap-3">
                  {/* Big Checkbox */}
                  <button
                    type="button"
                    data-testid={`task-toggle-${task.id}`}
                    onClick={() => handleTaskCheck(task.id)}
                    aria-label={`Mark ${task.title} as ${
                      task.completed ? 'incomplete' : 'completed'
                    }`}
                    className={`mt-0.5 p-1 rounded-lg transition-transform active:scale-95 cursor-pointer ${
                      task.completed
                        ? isDark
                          ? 'text-teal-400'
                          : 'text-teal-800'
                        : isDark
                        ? 'text-slate-600 hover:text-slate-400'
                        : 'text-slate-700 hover:text-black'
                    }`}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-6 h-6 fill-teal-700 text-white dark:fill-teal-500 dark:text-slate-900" />
                    ) : (
                      <Square className="w-6 h-6 stroke-[2.2]" />
                    )}
                  </button>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Category Badge */}
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                            task.category === 'prayer'
                              ? 'bg-amber-200 text-black dark:bg-amber-950/60 dark:text-amber-300'
                              : task.category === 'sunnah'
                              ? 'bg-purple-200 text-black dark:bg-purple-950/60 dark:text-purple-300'
                              : task.category === 'quran'
                              ? 'bg-emerald-200 text-black dark:bg-emerald-950/60 dark:text-emerald-300'
                              : task.category === 'dhikr'
                              ? 'bg-teal-200 text-black dark:bg-teal-950/60 dark:text-teal-300'
                              : task.category === 'charity'
                              ? 'bg-rose-200 text-black dark:bg-rose-950/60 dark:text-rose-300'
                              : 'bg-slate-200 text-black dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {task.category}
                        </span>

                        {task.isCustom && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-200 text-black dark:bg-blue-950/60 dark:text-blue-300 font-bold">
                            Custom
                          </span>
                        )}
                      </div>

                      {/* Delete Custom Task */}
                      {task.isCustom && (
                        <button
                          onClick={() => onDeleteTask(task.id)}
                          title="Delete custom task"
                          className="p-1 text-slate-600 hover:text-rose-600 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Titles */}
                    <div className="mt-1">
                      <h4
                        className={`text-sm sm:text-base font-extrabold leading-tight ${
                          task.completed
                            ? isDark
                              ? 'line-through text-slate-500'
                              : 'line-through text-slate-700'
                            : isDark
                            ? 'text-slate-100'
                            : 'text-black'
                        }`}
                      >
                        {task.title}
                      </h4>

                      {/* Arabic Title: High-contrast bold Arabic script */}
                      <p className={`font-arabic text-sm mt-0.5 text-right font-black ${isDark ? 'text-teal-300' : 'text-black'}`} dir="rtl">
                        {task.arabicTitle}
                      </p>

                      {/* Malayalam Title: High-contrast bold Malayalam script */}
                      <p className={`font-malayalam text-xs sm:text-[13px] mt-0.5 font-bold ${isDark ? 'text-slate-200' : 'text-black'}`}>
                        {task.malayalamTitle}
                      </p>
                    </div>

                    {/* Subtasks (e.g. 5 prayers or 12 rawatib) */}
                    {hasSubtasks && task.subtasks && (
                      <div className={`mt-3 pt-2 border-t ${isDark ? 'border-slate-800/60' : 'border-slate-300'}`}>
                        <div className={`flex items-center justify-between text-xs mb-1.5 font-extrabold ${isDark ? 'text-slate-300' : 'text-black'}`}>
                          <span>Portions / Rak'ahs:</span>
                          <span className={`font-mono font-black ${isDark ? 'text-teal-300' : 'text-teal-950'}`}>
                            {completedSubtasksCount} / {task.subtasks.length}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {task.subtasks.map((st) => (
                            <button
                              key={st.id}
                              onClick={() => handleSubtaskCheck(task.id, st.id)}
                              className={`px-2.5 py-1 rounded-xl text-xs font-extrabold flex items-center gap-1.5 border transition-all cursor-pointer ${
                                st.completed
                                  ? 'bg-teal-800 border-teal-800 text-white shadow-xs'
                                  : isDark
                                  ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700 font-bold'
                                  : 'bg-slate-100 border-slate-400 text-black hover:bg-slate-200'
                              }`}
                            >
                              <span className="w-3.5 h-3.5 rounded flex items-center justify-center font-black">
                                {st.completed ? '✓' : '○'}
                              </span>
                              <span>{st.label}</span>
                              {st.malayalamLabel && (
                                <span className={`font-malayalam text-[11px] font-bold ${st.completed ? 'text-white' : isDark ? 'text-slate-200' : 'text-black'}`}>
                                  • {st.malayalamLabel}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Hadith / Virtue Accordion */}
                    {(task.virtue || task.source) && (
                      <div className={`mt-2.5 pt-1.5 border-t ${isDark ? 'border-slate-800/40' : 'border-slate-300'}`}>
                        <button
                          onClick={() => toggleVirtue(task.id)}
                          className={`flex items-center gap-1 text-[11px] font-extrabold hover:underline cursor-pointer ${
                            isDark ? 'text-teal-400' : 'text-teal-950'
                          }`}
                        >
                          <BookOpen className="w-3 h-3 stroke-[2.5]" />
                          <span>
                            {isVirtueExpanded ? 'Hide Hadith & Virtue' : 'Prophetic Virtue & Reference'}
                          </span>
                          {isVirtueExpanded ? (
                            <ChevronUp className="w-3 h-3 stroke-[2.5]" />
                          ) : (
                            <ChevronDown className="w-3 h-3 stroke-[2.5]" />
                          )}
                        </button>

                        {isVirtueExpanded && (
                          <div
                            className={`mt-2 p-2.5 rounded-xl text-xs space-y-1.5 animate-fade-in border ${
                              isDark ? 'bg-slate-800/60 border-slate-700 text-slate-300' : 'bg-amber-50 border-amber-400 text-black'
                            }`}
                          >
                            {task.virtue && (
                              <p className={`italic leading-relaxed ${isDark ? '' : 'font-bold text-black'}`}>
                                "{task.virtue}"
                              </p>
                            )}
                            {task.malayalamVirtue && (
                              <p className={`text-[11px] leading-relaxed font-malayalam ${isDark ? 'text-teal-300/90 font-medium' : 'text-black font-bold'}`}>
                                {task.malayalamVirtue}
                              </p>
                            )}
                            {task.source && (
                              <div className={`text-[10px] font-extrabold pt-1 ${isDark ? 'text-slate-400' : 'text-black'}`}>
                                📖 Reference: {task.source}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Dedicated Weekly & Monthly Task Audit Section (ടാസ്ക് പുരോഗതി) — Scoped Only to Tasks Tab */}
      <section
        data-testid="weekly-monthly-task-audit"
        aria-label="Weekly & Monthly Task Audit"
        className={`rounded-2xl p-4 sm:p-5 border shadow-sm transition-all space-y-4 ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-400 text-black'
        }`}
      >
        {/* Audit Header + Period Switcher: [ This Week (ഈ ആഴ്ച) ] | [ This Month (ഈ മാസം) ] */}
        <div className="flex flex-col gap-2.5 pb-3 border-b border-slate-300 dark:border-slate-800">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span
                className={`p-1.5 rounded-lg shrink-0 ${
                  isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-950'
                }`}
              >
                <BarChart3 className="w-5 h-5 stroke-[2.5]" />
              </span>
              <h3 className="text-base sm:text-lg font-extrabold">
                Weekly &amp; Monthly Task Audit{' '}
                <span className="font-malayalam text-sm sm:text-base font-black">
                  (ടാസ്ക് പുരോഗതി)
                </span>
              </h3>
            </div>
            <p
              className={`text-xs font-malayalam ${
                isDark ? 'text-slate-400 font-medium' : 'text-black font-bold'
              }`}
            >
              ഓരോ സുന്നത്ത്-ഫർള് കർമ്മങ്ങളുടെയും ആഴ്ചയിലെയും മാസത്തെയും കൃത്യമായ കണക്ക്
            </p>
          </div>

          {/* Period Switcher */}
          <div
            role="group"
            aria-label="Task audit period switcher"
            className={`inline-flex items-center gap-1 p-1 rounded-xl border shrink-0 self-start ${
              isDark
                ? 'bg-slate-950 border-slate-800'
                : 'bg-slate-100 border-slate-400'
            }`}
          >
            <button
              type="button"
              data-testid="audit-period-week"
              onClick={() => setAuditPeriod('week')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold whitespace-nowrap cursor-pointer font-malayalam ${
                auditPeriod === 'week'
                  ? 'bg-teal-900 text-white shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-black hover:bg-slate-200'
              }`}
            >
              This Week (ഈ ആഴ്ച)
            </button>
            <button
              type="button"
              data-testid="audit-period-month"
              onClick={() => setAuditPeriod('month')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold whitespace-nowrap cursor-pointer font-malayalam ${
                auditPeriod === 'month'
                  ? 'bg-teal-900 text-white shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-black hover:bg-slate-200'
              }`}
            >
              This Month (ഈ മാസം)
            </button>
          </div>
        </div>

        {/* Encouraging Summary Note (ഏറ്റവും കൃത്യമായി ചെയ്തത് & ശ്രദ്ധിക്കേണ്ട ടാസ്ക്) */}
        <div
          data-testid="task-audit-summary-note"
          className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
        >
          <div
            data-testid="most-completed-task-note"
            className={`p-3 rounded-xl border flex items-start gap-2.5 ${
              isDark
                ? 'bg-emerald-950/40 border-emerald-800/70 text-emerald-100'
                : 'bg-emerald-50 border-emerald-600 text-black'
            }`}
          >
            <Award
              className={`w-5 h-5 shrink-0 mt-0.5 ${
                isDark ? 'text-emerald-400' : 'text-emerald-800'
              }`}
            />
            <div className="min-w-0 text-xs leading-relaxed font-malayalam">
              <div
                className={`font-black ${
                  isDark ? 'text-emerald-300' : 'text-black'
                }`}
              >
                ഏറ്റവും കൃത്യമായി ചെയ്തത്:{' '}
                <span className="font-extrabold">
                  {auditReport.mostCompletedTask
                    ? `${auditReport.mostCompletedTask.task.malayalamTitle} (${auditReport.mostCompletedTask.task.title})`
                    : '—'}
                </span>
              </div>
              {auditReport.mostCompletedTask && (
                <div
                  className={`text-[11px] font-mono font-bold mt-0.5 ${
                    isDark ? 'text-emerald-400/90' : 'text-emerald-950'
                  }`}
                >
                  🟢 {auditReport.mostCompletedTask.ratioLabel} ({auditReport.mostCompletedTask.completionPercent}%)
                </div>
              )}
            </div>
          </div>

          <div
            data-testid="most-skipped-task-note"
            className={`p-3 rounded-xl border flex items-start gap-2.5 ${
              isDark
                ? 'bg-rose-950/40 border-rose-800/70 text-rose-100'
                : 'bg-rose-50 border-rose-600 text-black'
            }`}
          >
            <AlertCircle
              className={`w-5 h-5 shrink-0 mt-0.5 ${
                isDark ? 'text-rose-400' : 'text-rose-800'
              }`}
            />
            <div className="min-w-0 text-xs leading-relaxed font-malayalam">
              <div
                className={`font-black ${
                  isDark ? 'text-rose-300' : 'text-black'
                }`}
              >
                ശ്രദ്ധിക്കേണ്ട ടാസ്ക്:{' '}
                <span className="font-extrabold">
                  {auditReport.mostSkippedTask
                    ? `${auditReport.mostSkippedTask.task.malayalamTitle} (${auditReport.mostSkippedTask.task.title})`
                    : '—'}
                </span>
              </div>
              {auditReport.mostSkippedTask && (
                <div
                  className={`text-[11px] font-mono font-bold mt-0.5 ${
                    isDark ? 'text-rose-400/90' : 'text-rose-950'
                  }`}
                >
                  🔴 {auditReport.mostSkippedTask.ratioLabel} ({auditReport.mostSkippedTask.missedDays} days missed)
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Filter Chips: All (എല്ലാം) | Completed (പൂർത്തിയായവ) | Missed (നഷ്ടപ്പെട്ടവ) */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div
            role="group"
            aria-label="Task audit quick filter chips"
            className="flex flex-wrap items-center gap-1.5"
          >
            <button
              type="button"
              data-testid="audit-filter-all"
              onClick={() => setAuditFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border cursor-pointer font-malayalam ${
                auditFilter === 'all'
                  ? 'bg-teal-900 text-white border-teal-950 shadow-xs'
                  : isDark
                  ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-100 border-slate-400 text-black hover:bg-slate-200'
              }`}
            >
              All (എല്ലാം) • {auditReport.counts.all}
            </button>

            <button
              type="button"
              data-testid="audit-filter-completed"
              onClick={() => setAuditFilter('completed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border cursor-pointer font-malayalam ${
                auditFilter === 'completed'
                  ? 'bg-emerald-800 text-white border-emerald-950 shadow-xs'
                  : isDark
                  ? 'bg-slate-800 border-slate-700 text-emerald-300 hover:bg-slate-700'
                  : 'bg-emerald-50 border-emerald-600 text-black hover:bg-emerald-100'
              }`}
            >
              Completed (പൂർത്തിയായവ) • {auditReport.counts.completed}
            </button>

            <button
              type="button"
              data-testid="audit-filter-missed"
              onClick={() => setAuditFilter('missed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border cursor-pointer font-malayalam ${
                auditFilter === 'missed'
                  ? 'bg-rose-800 text-white border-rose-950 shadow-xs'
                  : isDark
                  ? 'bg-slate-800 border-slate-700 text-rose-300 hover:bg-slate-700'
                  : 'bg-rose-50 border-rose-600 text-black hover:bg-rose-100'
              }`}
            >
              Missed (നഷ്ടപ്പെട്ടവ) • {auditReport.counts.missed}
            </button>
          </div>

          {/* Legend for Mini-Status Dots */}
          <div className="flex items-center gap-3 text-[11px] font-extrabold">
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-emerald-700 inline-block" />
              <span>🟢 Completed</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-rose-700 inline-block" />
              <span>🔴 Missed</span>
            </span>
          </div>
        </div>

        {/* Itemized Task-by-Task List (All 11 Tasks Row-by-Row) */}
        <div data-testid="task-audit-itemized-list" className="space-y-2.5">
          {auditReport.filteredRows.length === 0 ? (
            <div
              className={`p-6 rounded-xl border text-center text-xs font-bold font-malayalam ${
                isDark
                  ? 'bg-slate-950/60 border-slate-800 text-slate-400'
                  : 'bg-slate-50 border-slate-300 text-black'
              }`}
            >
              {auditFilter === 'completed'
                ? 'ഈ കാലയളവിൽ പൂർത്തിയായ ടാസ്കുകൾ ഇല്ല. മുകളിലെ ചെക്ക്‌ലിസ്റ്റിൽ ടാസ്കുകൾ പൂർത്തിയാക്കി തുടങ്ങാം!'
                : 'തിരഞ്ഞെടുത്ത ഫിൽട്ടറിൽ ടാസ്കുകൾ ലഭ്യമല്ല.'}
            </div>
          ) : (
            auditReport.filteredRows.map((row) => (
              <div
                key={row.task.id}
                data-testid={`task-audit-row-${row.task.id}`}
                className={`p-3 rounded-xl border transition-all ${
                  isDark
                    ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    : 'bg-slate-50/90 border-slate-300 hover:border-slate-400'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  {/* Task Name + Category Badge */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                          row.task.category === 'prayer'
                            ? 'bg-amber-200 text-black dark:bg-amber-950/60 dark:text-amber-300'
                            : row.task.category === 'sunnah'
                            ? 'bg-purple-200 text-black dark:bg-purple-950/60 dark:text-purple-300'
                            : row.task.category === 'quran'
                            ? 'bg-emerald-200 text-black dark:bg-emerald-950/60 dark:text-emerald-300'
                            : row.task.category === 'dhikr'
                            ? 'bg-teal-200 text-black dark:bg-teal-950/60 dark:text-teal-300'
                            : row.task.category === 'charity'
                            ? 'bg-rose-200 text-black dark:bg-rose-950/60 dark:text-rose-300'
                            : 'bg-slate-200 text-black dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {row.task.category}
                      </span>

                      <span
                        className={`text-xs sm:text-sm font-extrabold ${
                          isDark ? 'text-white' : 'text-black'
                        }`}
                      >
                        {row.task.title}
                      </span>
                    </div>

                    <div
                      className={`text-xs font-malayalam font-bold mt-0.5 ${
                        isDark ? 'text-slate-300' : 'text-black'
                      }`}
                    >
                      {row.task.malayalamTitle}
                    </div>
                  </div>

                  {/* Completion Ratio Badge (e.g. 5/7 days or 22/30 days) */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      data-testid={`task-audit-ratio-${row.task.id}`}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-extrabold border ${
                        row.completedDays === row.totalDays
                          ? isDark
                            ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                            : 'bg-emerald-200 border-emerald-700 text-black'
                          : row.completedDays > 0
                          ? isDark
                            ? 'bg-teal-950/80 border-teal-600 text-teal-300'
                            : 'bg-teal-100 border-teal-700 text-black'
                          : isDark
                          ? 'bg-rose-950/70 border-rose-700 text-rose-300'
                          : 'bg-rose-100 border-rose-600 text-black'
                      }`}
                    >
                      {row.ratioLabel}
                    </span>

                    <span
                      className={`text-[11px] font-mono font-extrabold w-10 text-right ${
                        isDark ? 'text-slate-300' : 'text-black'
                      }`}
                    >
                      {row.completionPercent}%
                    </span>
                  </div>
                </div>

                {/* Visual Mini-Status Row: 7 compact dots/bars for Week or 30 mini dots for Month */}
                <div
                  data-testid={`task-audit-dots-${row.task.id}`}
                  className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-2"
                >
                  {auditPeriod === 'week' ? (
                    <div className="grid grid-cols-7 gap-1.5 w-full">
                      {row.dots.map((dot) => (
                        <div
                          key={dot.date}
                          title={`${dot.shortLabel} (${dot.dayOfWeek}): ${
                            dot.completed ? '🟢 Completed' : '🔴 Missed / Incomplete'
                          }`}
                          data-status={dot.completed ? 'completed' : 'missed'}
                          className={`flex flex-col items-center justify-center py-1 px-1 rounded-lg border text-[10px] font-mono font-extrabold ${
                            dot.completed
                              ? isDark
                                ? 'bg-emerald-950/70 border-emerald-500/80 text-emerald-200'
                                : 'bg-emerald-100 border-emerald-700 text-black'
                              : isDark
                              ? 'bg-rose-950/60 border-rose-700/80 text-rose-200'
                              : 'bg-rose-50 border-rose-500 text-black'
                          } ${dot.isToday ? 'ring-2 ring-teal-500' : ''}`}
                        >
                          <span className="text-[9px] uppercase tracking-tight">
                            {dot.dayOfWeek}
                          </span>
                          <span
                            aria-label={dot.completed ? 'Completed' : 'Missed'}
                            className={`w-2.5 h-2.5 rounded-full mt-0.5 border ${
                              dot.completed
                                ? 'bg-emerald-500 border-emerald-700'
                                : 'bg-rose-500 border-rose-700'
                            }`}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-1 w-full">
                      {row.dots.map((dot) => (
                        <span
                          key={dot.date}
                          title={`${dot.shortLabel} (${dot.dayOfWeek}): ${
                            dot.completed ? '🟢 Completed' : '🔴 Missed / Incomplete'
                          }`}
                          data-status={dot.completed ? 'completed' : 'missed'}
                          aria-label={`${dot.shortLabel}: ${
                            dot.completed ? 'Completed' : 'Missed'
                          }`}
                          className={`w-3 h-3 rounded-full border inline-block transition-transform hover:scale-125 ${
                            dot.completed
                              ? 'bg-emerald-500 border-emerald-700'
                              : 'bg-rose-500 border-rose-700'
                          } ${dot.isToday ? 'ring-2 ring-teal-500' : ''}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Add Custom Task Modal */}
      <AddCustomTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTask={onAddTask}
        isDark={isDark}
      />
    </div>
  );
};
