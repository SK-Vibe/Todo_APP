'use client';

import React from 'react';
import { useTodo } from '@/context/TodoContext';
import { 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Kanban, 
  ListTodo, 
  Settings, 
  X,
  Flame
} from 'lucide-react';
import { TaskCategory } from '@/types/todo';
import { CATEGORIES_META } from '@/lib/mockData';
import { getTodayStr } from '@/lib/useDate';

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export default function Sidebar({ isOpenMobile, onCloseMobile }: SidebarProps) {
  const { 
    tasks, 
    activeTab, 
    setActiveTab, 
    filters, 
    updateFilter,
    stats 
  } = useTodo();

  const todayStr = getTodayStr();

  const todayCount = tasks.filter((t) => todayStr && t.dueDate === todayStr && t.status !== 'completed').length;
  const upcomingCount = tasks.filter((t) => todayStr && t.dueDate && t.dueDate > todayStr && t.status !== 'completed').length;

  const navItems = [
    {
      id: 'all' as const,
      label: 'All Tasks',
      icon: ListTodo,
      count: stats.total,
      onClick: () => {
        setActiveTab('all');
        updateFilter({ status: 'all', dateFilter: 'all', viewMode: 'list' });
        onCloseMobile();
      },
    },
    {
      id: 'today' as const,
      label: 'Today',
      icon: Clock,
      count: todayCount,
      onClick: () => {
        setActiveTab('today');
        updateFilter({ dateFilter: 'today', status: 'all', viewMode: 'list' });
        onCloseMobile();
      },
    },
    {
      id: 'upcoming' as const,
      label: 'Upcoming',
      icon: Calendar,
      count: upcomingCount,
      onClick: () => {
        setActiveTab('upcoming');
        updateFilter({ dateFilter: 'upcoming', status: 'all', viewMode: 'list' });
        onCloseMobile();
      },
    },
    {
      id: 'completed' as const,
      label: 'Completed',
      icon: CheckCircle2,
      count: stats.completed,
      onClick: () => {
        setActiveTab('completed');
        updateFilter({ status: 'completed', dateFilter: 'all', viewMode: 'list' });
        onCloseMobile();
      },
    },
    {
      id: 'kanban' as const,
      label: 'Kanban Board',
      icon: Kanban,
      count: undefined,
      onClick: () => {
        setActiveTab('kanban');
        updateFilter({ viewMode: 'kanban' });
        onCloseMobile();
      },
    },
    {
      id: 'settings' as const,
      label: 'Settings',
      icon: Settings,
      count: undefined,
      onClick: () => {
        setActiveTab('settings');
        onCloseMobile();
      },
    },
  ];

  const categories: TaskCategory[] = ['Work', 'Personal', 'Study', 'Health', 'Finance'];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4">
      {/* Mobile Header with close button */}
      <div className="flex items-center justify-between pb-4 lg:hidden border-b border-slate-200 dark:border-slate-800 mb-4">
        <span className="font-bold text-slate-800 dark:text-slate-100">Navigation</span>
        <button
          onClick={onCloseMobile}
          className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Navigation */}
      <div className="space-y-1">
        <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Views
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.count !== undefined && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-indigo-200 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Categories Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between px-3 mb-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Categories
          </p>
          {filters.category !== 'all' && (
            <button
              onClick={() => updateFilter({ category: 'all' })}
              className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Reset
            </button>
          )}
        </div>
        <div className="space-y-1">
          {categories.map((cat) => {
            const meta = CATEGORIES_META[cat];
            const isCategoryActive = filters.category === cat;
            const categoryCount = tasks.filter((t) => t.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => {
                  updateFilter({ category: isCategoryActive ? 'all' : cat });
                  if (activeTab === 'settings') setActiveTab('all');
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all ${
                  isCategoryActive
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-medium'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${meta.bgColor.replace('/40', '')} border ${meta.borderColor}`} />
                  <span>{cat}</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">{categoryCount}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Productivity Streak / Progress Card */}
      <div className="mt-auto pt-6">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-200/50 dark:border-indigo-900/50">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Productivity Score
            </span>
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
              {stats.completionRate}%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {stats.completed}/{stats.total} done
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-[calc(100vh-4rem)] sticky top-16">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl z-50 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
