'use client';

import React from 'react';
import { useTodo } from '@/context/TodoContext';
import { TaskStatus } from '@/types/todo';
import { CATEGORIES_META } from '@/lib/mockData';
import { getTodayStr } from '@/lib/useDate';
import { 
  Plus, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Calendar, 
  CheckSquare, 
  Pencil, 
  Trash2,
  Eye
} from 'lucide-react';

export default function KanbanBoard() {
  const { 
    tasks, 
    filters, 
    moveTaskStatus, 
    deleteTask, 
    setTaskToEdit, 
    setSelectedTask, 
    setIsCreateModalOpen 
  } = useTodo();

  const columns: { status: TaskStatus; title: string; color: string; border: string; bg: string }[] = [
    {
      status: 'todo',
      title: 'To Do',
      color: 'text-slate-700 dark:text-slate-300',
      border: 'border-slate-300 dark:border-slate-700',
      bg: 'bg-slate-100/60 dark:bg-slate-800/40',
    },
    {
      status: 'in_progress',
      title: 'In Progress',
      color: 'text-blue-700 dark:text-blue-400',
      border: 'border-blue-300 dark:border-blue-800',
      bg: 'bg-blue-50/50 dark:bg-blue-950/20',
    },
    {
      status: 'completed',
      title: 'Completed',
      color: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-300 dark:border-emerald-800',
      bg: 'bg-emerald-50/50 dark:bg-emerald-950/20',
    },
  ];

  // Filter tasks based on current filters (excluding status which is dictated by columns)
  const filteredTasks = tasks.filter((task) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description?.toLowerCase().includes(q) || false;
      const matchCat = task.category.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCat) return false;
    }
    if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
    if (filters.category !== 'all' && task.category !== filters.category) return false;
    return true;
  });

  const todayStr = getTodayStr();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      {columns.map((column) => {
        const columnTasks = filteredTasks.filter((t) => t.status === column.status);

        return (
          <div
            key={column.status}
            className={`flex flex-col rounded-2xl border ${column.border} ${column.bg} p-4 transition-all`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <h3 className={`font-bold text-sm tracking-tight ${column.color}`}>
                  {column.title}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold font-mono">
                  {columnTasks.length}
                </span>
              </div>

              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="Add task to this list"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Column Task Cards */}
            <div className="space-y-3 min-h-[300px]">
              {columnTasks.length === 0 ? (
                <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center p-4">
                  <p className="text-xs text-slate-400">No tasks in {column.title}</p>
                </div>
              ) : (
                columnTasks.map((task) => {
                  const meta = CATEGORIES_META[task.category];
                  const isOverdue =
                    task.status !== 'completed' && task.dueDate && task.dueDate < todayStr;

                  return (
                    <div
                      key={task.id}
                      className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-all hover:border-indigo-300 dark:hover:border-indigo-700"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${meta.bgColor} ${meta.color} ${meta.borderColor}`}
                        >
                          {task.category}
                        </span>

                        <span
                          className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                            task.priority === 'urgent'
                              ? 'bg-rose-100 dark:bg-rose-950 text-rose-600'
                              : task.priority === 'high'
                              ? 'bg-amber-100 dark:bg-amber-950 text-amber-600'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>

                      <h4
                        onClick={() => setSelectedTask(task)}
                        className="font-semibold text-sm text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer line-clamp-2 leading-snug"
                      >
                        {task.title}
                      </h4>

                      {task.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      {/* Due date & subtasks */}
                      <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800/60 pt-2.5">
                        {task.dueDate ? (
                          <span
                            className={`flex items-center gap-1 text-[11px] font-medium ${
                              isOverdue ? 'text-rose-500' : 'text-slate-400'
                            }`}
                          >
                            <Calendar className="w-3 h-3" />
                            {task.dueDate}
                          </span>
                        ) : (
                          <span />
                        )}

                        {task.subtasks.length > 0 && (
                          <span className="flex items-center gap-1 text-[11px]">
                            <CheckSquare className="w-3 h-3 text-indigo-500" />
                            {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length}
                          </span>
                        )}
                      </div>

                      {/* Kanban Column Transition Controls */}
                      <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setSelectedTask(task)}
                            className="p-1 text-slate-400 hover:text-indigo-600 rounded transition-colors"
                            title="View"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setTaskToEdit(task)}
                            className="p-1 text-slate-400 hover:text-indigo-600 rounded transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Move Buttons */}
                        <div className="flex items-center gap-1">
                          {column.status === 'in_progress' && (
                            <button
                              onClick={() => moveTaskStatus(task.id, 'todo')}
                              className="px-2 py-1 text-[11px] font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md flex items-center gap-1 transition-colors"
                              title="Move back to To Do"
                            >
                              <ArrowLeft className="w-3 h-3" />
                              <span>To Do</span>
                            </button>
                          )}
                          {column.status === 'todo' && (
                            <button
                              onClick={() => moveTaskStatus(task.id, 'in_progress')}
                              className="px-2 py-1 text-[11px] font-medium bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 rounded-md flex items-center gap-1 transition-colors"
                              title="Start working"
                            >
                              <span>Progress</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                          {column.status !== 'completed' && (
                            <button
                              onClick={() => moveTaskStatus(task.id, 'completed')}
                              className="px-2 py-1 text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 rounded-md flex items-center gap-1 transition-colors"
                              title="Complete task"
                            >
                              <Check className="w-3 h-3 stroke-[2.5]" />
                            </button>
                          )}
                          {column.status === 'completed' && (
                            <button
                              onClick={() => moveTaskStatus(task.id, 'in_progress')}
                              className="px-2 py-1 text-[11px] font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-md flex items-center gap-1 transition-colors"
                              title="Re-open task"
                            >
                              <ArrowLeft className="w-3 h-3" />
                              <span>Reopen</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
