'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Task, FilterOptions, UserProfile, TaskStatus, TaskPriority, TaskCategory, Subtask } from '@/types/todo';
import { INITIAL_USER } from '@/lib/mockData';
import { getTodayStr } from '@/lib/useDate';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

interface TodoContextType {
  tasks: Task[];
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  updateFilter: (partial: Partial<FilterOptions>) => void;
  resetFilters: () => void;
  
  // Auth state
  user: User | null;
  isLoadingAuth: boolean;
  signOut: () => Promise<void>;

  // Task Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskStatus: (id: string) => Promise<void>;
  moveTaskStatus: (id: string, newStatus: TaskStatus) => Promise<void>;
  toggleSubtask: (taskId: string, subtaskId: string) => Promise<void>;
  
  // Modals & Active Selections
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  taskToEdit: Task | null;
  setTaskToEdit: (task: Task | null) => void;
  
  // User Profile & Settings
  userProfile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  
  // Navigation
  activeTab: 'all' | 'today' | 'upcoming' | 'completed' | 'kanban' | 'settings';
  setActiveTab: (tab: 'all' | 'today' | 'upcoming' | 'completed' | 'kanban' | 'settings') => void;
  
  // Notifications / Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
  clearToast: () => void;
  
  // Statistics
  stats: {
    total: number;
    todo: number;
    inProgress: number;
    completed: number;
    overdue: number;
    completionRate: number;
  };
  isLoadingTasks: boolean;
}

const defaultFilters: FilterOptions = {
  search: '',
  status: 'all',
  priority: 'all',
  category: 'all',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  viewMode: 'list',
  dateFilter: 'all',
};

const TodoContext = createContext<TodoContextType | undefined>(undefined);

// Helper to map DB row (snake_case) to Frontend Task (camelCase)
interface DbTaskRow {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  due_date: string | null;
  subtasks: Subtask[];
  created_at: string;
  updated_at: string;
}

function mapDbToTask(row: DbTaskRow): Task {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    description: row.description || '',
    status: row.status,
    priority: row.priority,
    category: row.category,
    dueDate: row.due_date || undefined,
    subtasks: Array.isArray(row.subtasks) ? row.subtasks : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function TodoProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('taskflow_theme');
        if (saved) return saved === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      } catch {
        // Fallback
      }
    }
    return false;
  });
  const [activeTab, setActiveTab] = useState<'all' | 'today' | 'upcoming' | 'completed' | 'kanban' | 'settings'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Toast Helper
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  const clearToast = () => setToastMessage(null);

  // Fetch Tasks from Supabase
  const fetchTasks = useCallback(async (userId: string) => {
    setIsLoadingTasks(true);
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        showToast('Failed to load tasks from database.');
      } else if (data) {
        setTasks(data.map((row) => mapDbToTask(row as unknown as DbTaskRow)));
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setIsLoadingTasks(false);
    }
  }, [supabase, showToast]);

  // Fetch Profile from Supabase
  const fetchProfile = useCallback(async (currentUser: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (data) {
        setUserProfile({
          id: data.id,
          name: data.full_name || currentUser.email?.split('@')[0] || 'User',
          email: currentUser.email || '',
          avatarUrl: data.avatar_url || INITIAL_USER.avatarUrl,
          role: data.role || 'TaskFlow Member',
        });
      } else if (error) {
        // Fallback from auth metadata
        setUserProfile({
          id: currentUser.id,
          name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'User',
          email: currentUser.email || '',
          avatarUrl: INITIAL_USER.avatarUrl,
          role: 'TaskFlow Member',
        });
      }
    } catch {
      // Ignore
    }
  }, [supabase]);

  // Auth State Listener
  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setIsLoadingAuth(false);

      if (currentUser) {
        fetchProfile(currentUser);
        fetchTasks(currentUser.id);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setIsLoadingAuth(false);

      if (currentUser) {
        fetchProfile(currentUser);
        fetchTasks(currentUser.id);
      } else {
        setTasks([]);
        setUserProfile(INITIAL_USER);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile, fetchTasks]);

  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setTasks([]);
    setUserProfile(INITIAL_USER);
    showToast('Signed out successfully.');
    router.push('/login');
  };

  // Toggle Theme
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        localStorage.setItem('taskflow_theme', 'dark');
      } else {
        localStorage.setItem('taskflow_theme', 'light');
      }
      return next;
    });
  };

  const updateFilter = (partial: Partial<FilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    showToast('Filters reset to default');
  };

  // 1. Add Task
  const addTask = async (newTaskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      showToast('Please sign in to save tasks to your database!');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          user_id: user.id,
          title: newTaskData.title,
          description: newTaskData.description || null,
          status: newTaskData.status,
          priority: newTaskData.priority,
          category: newTaskData.category,
          due_date: newTaskData.dueDate || null,
          subtasks: newTaskData.subtasks || [],
        })
        .select()
        .single();

      if (error) {
        console.error('Add task error:', error);
        showToast(`Error: ${error.message}`);
      } else if (data) {
        const created = mapDbToTask(data as unknown as DbTaskRow);
        setTasks((prev) => [created, ...prev]);
        showToast(`Task "${created.title}" created successfully!`);
        setIsCreateModalOpen(false);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      showToast(`Failed to create task: ${message}`);
    }
  };

  // 2. Update Task
  const updateTask = async (id: string, updates: Partial<Task>) => {
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t))
    );
    if (selectedTask?.id === id) {
      setSelectedTask((prev) => (prev ? { ...prev, ...updates } : null));
    }
    setTaskToEdit(null);

    if (user) {
      const dbUpdates: Record<string, unknown> = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description || null;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate || null;
      if (updates.subtasks !== undefined) dbUpdates.subtasks = updates.subtasks;

      const { error } = await supabase
        .from('tasks')
        .update(dbUpdates)
        .eq('id', id);

      if (error) {
        console.error('Update error:', error);
        showToast(`Update error: ${error.message}`);
      } else {
        showToast('Task updated in database!');
      }
    } else {
      showToast('Task updated locally');
    }
  };

  // 3. Delete Task
  const deleteTask = async (id: string) => {
    const taskToDelete = tasks.find((t) => t.id === id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (selectedTask?.id === id) setSelectedTask(null);

    if (user) {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) {
        showToast(`Delete error: ${error.message}`);
      } else {
        showToast(`Task "${taskToDelete?.title || ''}" deleted from database.`);
      }
    } else {
      showToast(`Task "${taskToDelete?.title || ''}" deleted.`);
    }
  };

  // 4. Toggle Task Completion Status
  const toggleTaskStatus = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const newStatus: TaskStatus = task.status === 'completed' ? 'todo' : 'completed';
    await updateTask(id, { status: newStatus });
  };

  // 5. Move Task Status (Kanban or Quick Select)
  const moveTaskStatus = async (id: string, newStatus: TaskStatus) => {
    await updateTask(id, { status: newStatus });
  };

  // 6. Toggle Subtask
  const toggleSubtask = async (taskId: string, subtaskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const updatedSubtasks = task.subtasks.map((st) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    await updateTask(taskId, { subtasks: updatedSubtasks });
  };

  // 7. Update User Profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updates }));

    if (user) {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: updates.name,
          avatar_url: updates.avatarUrl,
          role: updates.role,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        showToast(`Profile update error: ${error.message}`);
      } else {
        showToast('Profile updated in Supabase!');
      }
    } else {
      showToast('Profile updated locally.');
    }
  };

  // Compute Statistics
  const todayStr = getTodayStr();
  const total = tasks.length;
  const todo = tasks.filter((t) => t.status === 'todo').length;
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const overdue = tasks.filter(
    (t) => t.status !== 'completed' && t.dueDate && todayStr && t.dueDate < todayStr
  ).length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <TodoContext.Provider
      value={{
        tasks,
        filters,
        setFilters,
        updateFilter,
        resetFilters,
        user,
        isLoadingAuth,
        signOut,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        moveTaskStatus,
        toggleSubtask,
        selectedTask,
        setSelectedTask,
        isCreateModalOpen,
        setIsCreateModalOpen,
        taskToEdit,
        setTaskToEdit,
        userProfile,
        updateProfile,
        isDarkMode,
        toggleDarkMode,
        activeTab,
        setActiveTab,
        toastMessage,
        showToast,
        clearToast,
        stats: {
          total,
          todo,
          inProgress,
          completed,
          overdue,
          completionRate,
        },
        isLoadingTasks,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function useTodo() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
}
