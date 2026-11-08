'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const TodoAppContent = dynamic(() => import('@/components/TodoAppContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg animate-pulse" />
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Loading TaskFlow...
        </span>
      </div>
    </div>
  ),
});

export default function Home() {
  return <TodoAppContent />;
}
