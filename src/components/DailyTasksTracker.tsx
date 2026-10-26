import React, { useState } from 'react';
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
  Filter,
} from 'lucide-react';
import { DailyTask, TaskCategory, TaskFilterStatus } from '../types/tasks.ts';
import { AddCustomTaskModal } from './AddCustomTaskModal.tsx';
import { calculateTasksProgress } from '../utils/tasks-utils.ts';
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

  const stats = calculateTasksProgress(tasks);

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
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-teal-500/20 text-teal-400">
                <CheckSquare className="w-5 h-5" />
              </span>
              <h2 className="text-base sm:text-lg font-bold">
                Daily Islamic Tasks & Checklist
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-arabic">
              المهام اليومية والسنن الراتبة • പ്രതിദിന സുന്നത്തുകളും കർമ്മങ്ങളും
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
            <button
              onClick={onCompleteAllTasks}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                isDark
                  ? 'border-slate-700 hover:bg-slate-800 text-slate-300'
                  : 'border-slate-300 hover:bg-slate-100 text-slate-700'
              }`}
            >
              Complete All
            </button>
            <button
              onClick={onResetTasks}
              title="Reset all checkboxes for today"
              className={`p-1.5 rounded-xl text-xs font-medium border transition-all ${
                isDark
                  ? 'border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                  : 'border-slate-300 hover:bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Progress Bar & Counter */}
        <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-800/60">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="flex items-center gap-1.5">
              <span>Today’s Consistency:</span>
              <span className="font-bold text-teal-600 dark:text-teal-400 font-mono">
                {stats.completed} of {stats.total}
              </span>
              <span className="text-[11px] opacity-75">
                ({stats.percent}%)
              </span>
            </span>

            {stats.isAllDone ? (
              <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
                <span>All completed today! Masha'Allah</span>
              </span>
            ) : (
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {stats.total - stats.completed} remaining
              </span>
            )}
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${stats.percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-2">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks, prayers, virtues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border outline-none transition-all ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-slate-100 placeholder-slate-500 focus:border-teal-500'
                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-teal-600'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Status Filters & Category Pills */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-1">
          {/* Status buttons */}
          <div className="flex items-center gap-1 bg-slate-200/80 dark:bg-slate-800 p-0.5 rounded-lg shrink-0">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
                filterStatus === 'all'
                  ? 'bg-white dark:bg-slate-700 text-teal-800 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All ({tasks.length})
            </button>
            <button
              onClick={() => setFilterStatus('incomplete')}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
                filterStatus === 'incomplete'
                  ? 'bg-white dark:bg-slate-700 text-teal-800 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Remaining ({tasks.filter((t) => !t.completed).length})
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
                filterStatus === 'completed'
                  ? 'bg-white dark:bg-slate-700 text-teal-800 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
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
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1 border transition-all ${
                  categoryFilter === cat.key
                    ? 'border-teal-600 bg-teal-50 text-teal-900 dark:bg-teal-950 dark:border-teal-400 dark:text-teal-200 font-semibold'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
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
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <CheckCircle2 className="w-10 h-10 mx-auto text-slate-400 mb-2 opacity-50" />
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No tasks match your filter
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
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
                      : 'bg-emerald-50/30 border-teal-200/70'
                    : isDark
                    ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                {/* Main Task Header */}
                <div className="flex items-start gap-3">
                  {/* Big Checkbox */}
                  <button
                    onClick={() => handleTaskCheck(task.id)}
                    aria-label={`Mark ${task.title} as ${
                      task.completed ? 'incomplete' : 'completed'
                    }`}
                    className={`mt-0.5 p-1 rounded-lg transition-transform active:scale-95 cursor-pointer ${
                      task.completed
                        ? 'text-teal-600 dark:text-teal-400'
                        : 'text-slate-300 dark:text-slate-600 hover:text-slate-500'
                    }`}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-6 h-6 fill-teal-600 text-white dark:fill-teal-500 dark:text-slate-900" />
                    ) : (
                      <Square className="w-6 h-6" />
                    )}
                  </button>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Category Badge */}
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                            task.category === 'prayer'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                              : task.category === 'sunnah'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
                              : task.category === 'quran'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : task.category === 'dhikr'
                              ? 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300'
                              : task.category === 'charity'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                              : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {task.category}
                        </span>

                        {task.isCustom && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 font-medium">
                            Custom
                          </span>
                        )}
                      </div>

                      {/* Delete Custom Task */}
                      {task.isCustom && (
                        <button
                          onClick={() => onDeleteTask(task.id)}
                          title="Delete custom task"
                          className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Titles */}
                    <div className="mt-1">
                      <h4
                        className={`text-sm sm:text-base font-bold leading-tight ${
                          task.completed
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-950 dark:text-slate-100 font-extrabold'
                        }`}
                      >
                        {task.title}
                      </h4>

                      {/* Arabic Title: High-contrast bold Arabic script */}
                      <p className="font-arabic text-sm text-teal-950 dark:text-teal-300 mt-0.5 text-right font-bold" dir="rtl">
                        {task.arabicTitle}
                      </p>

                      {/* Malayalam Title: High-contrast bold Malayalam script */}
                      <p className="font-malayalam text-xs sm:text-[13px] text-slate-950 dark:text-slate-200 mt-0.5 font-bold">
                        {task.malayalamTitle}
                      </p>
                    </div>

                    {/* Subtasks (e.g. 5 prayers or 12 rawatib) */}
                    {hasSubtasks && task.subtasks && (
                      <div className="mt-3 pt-2 border-t border-slate-300 dark:border-slate-800/60">
                        <div className="flex items-center justify-between text-xs mb-1.5 font-bold text-slate-800 dark:text-slate-300">
                          <span>Portions / Rak'ahs:</span>
                          <span className="font-mono text-teal-800 dark:text-teal-300 font-black">
                            {completedSubtasksCount} / {task.subtasks.length}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {task.subtasks.map((st) => (
                            <button
                              key={st.id}
                              onClick={() => handleSubtaskCheck(task.id, st.id)}
                              className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                                st.completed
                                  ? 'bg-teal-700 border-teal-700 text-white shadow-xs'
                                  : isDark
                                  ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                                  : 'bg-slate-200 border-slate-300 text-slate-950 hover:bg-slate-300'
                              }`}
                            >
                              <span className="w-3.5 h-3.5 rounded flex items-center justify-center font-black">
                                {st.completed ? '✓' : '○'}
                              </span>
                              <span>{st.label}</span>
                              {st.malayalamLabel && (
                                <span className="font-malayalam text-[11px] font-bold text-slate-950 dark:text-slate-200">
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
                      <div className="mt-2.5 pt-1.5 border-t border-slate-200/40 dark:border-slate-800/40">
                        <button
                          onClick={() => toggleVirtue(task.id)}
                          className="flex items-center gap-1 text-[11px] font-semibold text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
                        >
                          <BookOpen className="w-3 h-3" />
                          <span>
                            {isVirtueExpanded ? 'Hide Hadith & Virtue' : 'Prophetic Virtue & Reference'}
                          </span>
                          {isVirtueExpanded ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </button>

                        {isVirtueExpanded && (
                          <div
                            className={`mt-2 p-2.5 rounded-xl text-xs space-y-1.5 animate-fade-in ${
                              isDark ? 'bg-slate-800/60 text-slate-300' : 'bg-slate-50 text-slate-700'
                            }`}
                          >
                            {task.virtue && (
                              <p className="italic leading-relaxed">
                                "{task.virtue}"
                              </p>
                            )}
                            {task.malayalamVirtue && (
                              <p className="text-[11px] text-teal-800 dark:text-teal-300/90 leading-relaxed font-medium">
                                {task.malayalamVirtue}
                              </p>
                            )}
                            {task.source && (
                              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold pt-1">
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
