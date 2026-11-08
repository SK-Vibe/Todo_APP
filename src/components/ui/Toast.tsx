'use client';

import React from 'react';
import { useTodo } from '@/context/TodoContext';
import { CheckCircle2, X } from 'lucide-react';

export default function Toast() {
  const { toastMessage, clearToast } = useTodo();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-xl shadow-2xl border border-slate-700/50 dark:border-slate-300 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
      <span className="text-sm font-medium">{toastMessage}</span>
      <button
        onClick={clearToast}
        className="p-1 hover:bg-slate-800 dark:hover:bg-slate-200 rounded-md transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

