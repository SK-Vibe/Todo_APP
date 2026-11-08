'use client';

import React from 'react';
import { useTodo } from '@/context/TodoContext';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Layers, 
  TrendingUp 
} from 'lucide-react';

export default function DashboardStats() {
  const { stats, updateFilter, setActiveTab } = useTodo();

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.total,
      icon: Layers,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
      border: 'border-indigo-100 dark:border-indigo-900/50',
      onClick: () => {
        setActiveTab('all');
        updateFilter({ status: 'all', dateFilter: 'all' });
      },
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: Clock,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      border: 'border-blue-100 dark:border-blue-900/50',
      onClick: () => {
        setActiveTab('all');
        updateFilter({ status: 'in_progress', dateFilter: 'all' });
      },
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-100 dark:border-emerald-900/50',
      onClick: () => {
        setActiveTab('completed');
        updateFilter({ status: 'completed', dateFilter: 'all' });
      },
    },
    {
      title: 'Overdue Tasks',
      value: stats.overdue,
      icon: AlertTriangle,
      color: stats.overdue > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400',
      bg: stats.overdue > 0 ? 'bg-rose-50 dark:bg-rose-950/40' : 'bg-slate-50 dark:bg-slate-900/40',
      border: stats.overdue > 0 ? 'border-rose-200 dark:border-rose-900/50' : 'border-slate-200 dark:border-slate-800',
      onClick: () => {
        setActiveTab('all');
        updateFilter({ dateFilter: 'overdue', status: 'all' });
      },
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((card) => {
        const Icon = card.icon;
        return (
          <button
            key={card.title}
            onClick={card.onClick}
            className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border ${card.border} shadow-sm hover:shadow-md transition-all text-left group hover:scale-[1.01]`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl ${card.bg} ${card.color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {card.value}
              </span>
              {card.title === 'Completed' && stats.total > 0 && (
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />
                  {stats.completionRate}%
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

