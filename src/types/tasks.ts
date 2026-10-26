export type TaskCategory = 'prayer' | 'sunnah' | 'quran' | 'dhikr' | 'charity' | 'custom';

export interface TaskSubtask {
  id: string;
  label: string;
  arabicLabel?: string;
  malayalamLabel?: string;
  completed: boolean;
}

export interface DailyTask {
  id: string;
  title: string;
  arabicTitle: string;
  malayalamTitle: string;
  category: TaskCategory;
  description?: string;
  malayalamDescription?: string;
  virtue?: string;
  malayalamVirtue?: string;
  source?: string;
  isCustom?: boolean;
  subtasks?: TaskSubtask[];
  completed: boolean;
  completedAt?: string;
}

export type TaskFilterStatus = 'all' | 'incomplete' | 'completed';
