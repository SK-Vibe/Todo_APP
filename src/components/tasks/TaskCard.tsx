'use client';

import React from 'react';
import { Task, TaskPriority } from '@/types/todo';
import { useTodo } from '@/context/TodoContext';
import { CATEGORIES_META } from '@/lib/mockData';
import { getTodayStr } from '@/lib/useDate';
import { 
  Check, 
  Calendar, 
  CheckSquare, 
  Pencil, 
  Trash2, 
  AlertCircle,
  Eye
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const { 
    toggleTaskStatus, 
    deleteTask, 
    setTaskToEdit, 
    setSelectedTask 
  } = useTodo();

  const isCompleted = task.status === 'completed';
  const categoryMeta = CATEGORIES_META[task.category] || CATEGORIES_META.Work;

  const todayStr = getTodayStr();

  // Format Due Date
  const isOverdue = !isCompleted && task.dueDate && todayStr && task.dueDate < todayStr;
  const isDueToday = !isCompleted && task.dueDate && todayStr && task.dueDate === todayStr;

  const priorityStyles: Record<TaskPriority, { label: string; bg: string; text: string; dot: string }> = {
    urgent: {
      label: 'Urgent',
      bg: 'bg-rose-50 dark:bg-rose-950/60',
      text: 'text-rose-700 dark:text-rose-400',
      dot: 'bg-rose-500',
    },
    high: {
      label: 'High',
      bg: 'bg-amber-50 dark:bg-amber-950/60',
      text: 'text-amber-700 dark:text-amber-400',
      dot: 'bg-amber-500',
    },
    medium: {
      label: 'Medium',
      bg: 'bg-blue-50 dark:bg-blue-950/60',
      text: 'text-blue-700 dark:text-blue-400',
      dot: 'bg-blue-500',
    },
    low: {
      label: 'Low',
      bg: 'bg-slate-100 dark:bg-slate-800',
      text: 'text-slate-600 dark:text-slate-400',
      dot: 'bg-slate-400',
    },
  };

  const currentPriority = priorityStyles[task.priority];

  // Subtask progress
  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;

  return (
    <div
      className={`group relative bg-white dark:bg-slate-900 border rounded-2xl p-4 sm:p-5 transition-all duration-200 hover:shadow-md ${
        isCompleted
          ? 'border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/40 opacity-75'
          : isOverdue
          ? 'border-rose-200 dark:border-rose-900/60'
          : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800/80'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Completion Checkbox */}
        <button
          onClick={() => toggleTaskStatus(task.id)}
          className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200 ${
            isCompleted
              ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20'
              : 'border-2 border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400'
          }`}
          aria-label={isCompleted ? 'Mark task as incomplete' : 'Mark task as completed'}
        >
          {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Task Body */}
        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setSelectedTask(task)}>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            {/* Category Badge */}
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${categoryMeta.bgColor} ${categoryMeta.color} ${categoryMeta.borderColor}`}
            >
              {task.category}
            </span>

            {/* Priority Badge */}
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1.5 ${currentPriority.bg} ${currentPriority.text}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${currentPriority.dot}`} />
              {currentPriority.label}
            </span>
          </div>

          {/* Title */}
          <h3
            className={`text-base font-semibold leading-snug transition-colors ${
              isCompleted
                ? 'line-through text-slate-400 dark:text-slate-500'
                : 'text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
            }`}
          >
            {task.title}
          </h3>

          {/* Description */}
          {task.description && (
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Footer Metadata: Due Date & Subtasks */}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            {task.dueDate && (
              <span
                className={`flex items-center gap-1.5 font-medium px-2 py-0.5 rounded-md ${
                  isOverdue
                    ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60'
                    : isDueToday
                    ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60'
                    : 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800'
                }`}
              >
                {isOverdue ? (
                  <AlertCircle className="w-3.5 h-3.5" />
                ) : (
                  <Calendar className="w-3.5 h-3.5" />
                )}
                <span>
                  {isDueToday
                    ? 'Due Today'
                    : isOverdue
                    ? `Overdue (${task.dueDate})`
                    : task.dueDate}
                </span>
              </span>
            )}

            {totalSubtasks > 0 && (
              <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                <CheckSquare className="w-3.5 h-3.5 text-indigo-500" />
                <span>
                  {completedSubtasks}/{totalSubtasks} subtasks
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={() => setSelectedTask(task)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTaskToEdit(task)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Edit Task"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => deleteTask(task.id)}
            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition-colors"
            title="Delete Task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
