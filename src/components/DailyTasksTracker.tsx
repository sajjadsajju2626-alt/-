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
