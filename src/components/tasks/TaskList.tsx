'use client';

import React from 'react';
import { useTodo } from '@/context/TodoContext';
import TaskCard from './TaskCard';
import { 
  ClipboardList, 
  Plus, 
  SearchX 
} from 'lucide-react';
import { TaskPriority } from '@/types/todo';
import { getTodayStr } from '@/lib/useDate';

export default function TaskList() {
  const { tasks, filters, setIsCreateModalOpen, resetFilters } = useTodo();

  const todayStr = getTodayStr();

  // Priority order for sorting
  const priorityWeights: Record<TaskPriority, number> = {
    urgent: 4,
    high: 3,
    medium: 2,
    low: 1,
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    // 1. Search Query
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description?.toLowerCase().includes(q) || false;
      const matchCat = task.category.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCat) return false;
    }

    // 2. Status Filter
    if (filters.status !== 'all' && task.status !== filters.status) {
      return false;
    }

    // 3. Priority Filter
    if (filters.priority !== 'all' && task.priority !== filters.priority) {
      return false;
    }

    // 4. Category Filter
    if (filters.category !== 'all' && task.category !== filters.category) {
      return false;
    }

    // 5. Date Filter (Today, Upcoming, Overdue)
    if (filters.dateFilter === 'today') {
      if (task.dueDate !== todayStr) return false;
    } else if (filters.dateFilter === 'upcoming') {
      if (!task.dueDate || task.dueDate <= todayStr) return false;
    } else if (filters.dateFilter === 'overdue') {
      if (!task.dueDate || task.dueDate >= todayStr || task.status === 'completed') return false;
    }

    return true;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (filters.sortBy === 'dueDate') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    }
    if (filters.sortBy === 'priority') {
      return priorityWeights[b.priority] - priorityWeights[a.priority];
    }
    if (filters.sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    // Default: createdAt desc
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Empty State: When no tasks match filters
  if (sortedTasks.length === 0) {
    const isFiltered =
      filters.search ||
      filters.status !== 'all' ||
      filters.priority !== 'all' ||
      filters.category !== 'all' ||
      (filters.dateFilter && filters.dateFilter !== 'all');

    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 sm:p-14 text-center shadow-sm">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          {isFiltered ? <SearchX className="w-8 h-8" /> : <ClipboardList className="w-8 h-8" />}
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
          {isFiltered ? 'No matching tasks found' : 'No tasks in this view'}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
          {isFiltered
            ? 'Try adjusting your search query, priority filters, or status tabs to find what you need.'
            : 'Get organized today! Add your first task and track it effortlessly.'}
        </p>

        {isFiltered ? (
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-xl transition-colors"
          >
            Clear all filters
          </button>
        ) : (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-600/30 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create First Task</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* List Header Count */}
      <div className="flex items-center justify-between px-1 mb-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Showing {sortedTasks.length} {sortedTasks.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      {/* Task Cards */}
      <div className="space-y-3">
        {sortedTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
