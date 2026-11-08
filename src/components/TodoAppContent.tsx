'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TodoProvider, useTodo } from '@/context/TodoContext';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import DashboardStats from '@/components/dashboard/DashboardStats';
import TaskFilters from '@/components/tasks/TaskFilters';
import TaskList from '@/components/tasks/TaskList';
import KanbanBoard from '@/components/tasks/KanbanBoard';
import TaskModal from '@/components/tasks/TaskModal';
import TaskDetailsModal from '@/components/tasks/TaskDetailsModal';
import SettingsView from '@/components/settings/SettingsView';
import Toast from '@/components/ui/Toast';
import { Calendar, Plus, ShieldCheck, Loader2 } from 'lucide-react';
import { getFormattedToday } from '@/lib/useDate';

function TodoAppMain() {
  const router = useRouter();
  const { 
    activeTab, 
    filters, 
    userProfile, 
    user,
    isLoadingAuth,
    isLoadingTasks,
    setIsCreateModalOpen 
  } = useTodo();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const todayFormatted = getFormattedToday();

  // Protected Route Guard: If not authenticated, redirect to /login
  useEffect(() => {
    if (!isLoadingAuth && !user) {
      router.replace('/login');
    }
  }, [isLoadingAuth, user, router]);

  // Loading Screen while verifying session or redirecting
  if (isLoadingAuth || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg animate-pulse">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Checking authentication...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-950">
      {/* Top Navigation */}
      <Navbar onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar */}
        <Sidebar
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {/* Connected User Badge */}
          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Connected to Supabase PostgreSQL • RLS Protected</span>
          </div>

          {activeTab === 'settings' ? (
            <SettingsView />
          ) : (
            <div className="space-y-6">
              {/* Header Greeting Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{todayFormatted}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Welcome back, {userProfile.name.split(' ')[0]} 👋
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Here is a live summary of your synced tasks in PostgreSQL.
                  </p>
                </div>

                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-2xl shadow-sm shadow-indigo-600/30 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Create Task</span>
                </button>
              </div>

              {/* High-Level Overview Stats */}
              <DashboardStats />

              {/* Filters & View Switcher */}
              <TaskFilters />

              {/* Loading indicator if tasks are fetching */}
              {isLoadingTasks ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                  <span className="text-xs font-medium">Syncing with Supabase...</span>
                </div>
              ) : (
                /* Task Views (List vs Kanban) */
                filters.viewMode === 'kanban' ? <KanbanBoard /> : <TaskList />
              )}
            </div>
          )}
        </main>
      </div>

      {/* Global Modals & Toast */}
      <TaskModal />
      <TaskDetailsModal />
      <Toast />
    </div>
  );
}

export default function TodoAppContent() {
  return (
    <TodoProvider>
      <TodoAppMain />
    </TodoProvider>
  );
}
