'use client';

import React from 'react';
import { useTodo } from '@/context/TodoContext';
import { CATEGORIES_META } from '@/lib/mockData';
import { 
  X, 
  Calendar, 
  Pencil, 
  Trash2, 
  Check 
} from 'lucide-react';
import { TaskStatus } from '@/types/todo';

export default function TaskDetailsModal() {
  const { 
    selectedTask, 
    setSelectedTask, 
    setTaskToEdit, 
    deleteTask, 
    toggleSubtask, 
    moveTaskStatus 
  } = useTodo();

  if (!selectedTask) return null;

  const handleClose = () => setSelectedTask(null);

  const categoryMeta = CATEGORIES_META[selectedTask.category] || CATEGORIES_META.Work;

  const formatDateTime = (isoStr: string) => {
    try {
      return new Date(isoStr).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${categoryMeta.bgColor} ${categoryMeta.color} ${categoryMeta.borderColor}`}
            >
              {selectedTask.category}
            </span>
            <span
              className={`text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                selectedTask.priority === 'urgent'
                  ? 'bg-rose-100 dark:bg-rose-950 text-rose-600'
                  : selectedTask.priority === 'high'
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {selectedTask.priority}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setTaskToEdit(selectedTask);
                handleClose();
              }}
              className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Edit Task"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                deleteTask(selectedTask.id);
                handleClose();
              }}
              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Title */}
          <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
            {selectedTask.title}
          </h2>

          {/* Description */}
          {selectedTask.description ? (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
              {selectedTask.description}
            </div>
          ) : (
            <p className="text-xs italic text-slate-400">No additional description provided.</p>
          )}

          {/* Status Quick Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['todo', 'in_progress', 'completed'] as TaskStatus[]).map((st) => (
                <button
                  key={st}
                  onClick={() => moveTaskStatus(selectedTask.id, st)}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                    selectedTask.status === st
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-600/30'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {st === 'todo' ? 'To Do' : st === 'in_progress' ? 'In Progress' : 'Completed'}
                </button>
              ))}
            </div>
          </div>

          {/* Subtasks Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Checklist ({selectedTask.subtasks.filter((s) => s.completed).length}/
                {selectedTask.subtasks.length})
              </label>
            </div>

            {selectedTask.subtasks.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No checklist items for this task.</p>
            ) : (
              <div className="space-y-2">
                {selectedTask.subtasks.map((st) => (
                  <div
                    key={st.id}
                    onClick={() => toggleSubtask(selectedTask.id, st.id)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:bg-slate-100/80 cursor-pointer transition-colors"
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                        st.completed
                          ? 'bg-emerald-500 text-white'
                          : 'border-2 border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {st.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span
                      className={`text-sm ${
                        st.completed
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {st.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Metadata: Due Date & Timestamps */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-500 dark:text-slate-400">
            {selectedTask.dueDate && (
              <div className="flex items-center justify-between">
                <span>Due Date:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {selectedTask.dueDate}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span>Created:</span>
              <span>{formatDateTime(selectedTask.createdAt)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Last Modified:</span>
              <span>{formatDateTime(selectedTask.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
