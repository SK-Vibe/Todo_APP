import { Task, UserProfile, CategoryMeta, TaskCategory } from '@/types/todo';

export const INITIAL_USER: UserProfile = {
  name: "Farhan Ahmed",
  email: "farhan@example.com",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  role: "Product Lead & Developer",
};

export const CATEGORIES_META: Record<TaskCategory, CategoryMeta> = {
  Work: {
    name: 'Work',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950/40',
    borderColor: 'border-blue-200 dark:border-blue-800',
  },
  Personal: {
    name: 'Personal',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950/40',
    borderColor: 'border-purple-200 dark:border-purple-800',
  },
  Study: {
    name: 'Study',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/40',
    borderColor: 'border-amber-200 dark:border-amber-800',
  },
  Health: {
    name: 'Health',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
  },
  Finance: {
    name: 'Finance',
    color: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-50 dark:bg-rose-950/40',
    borderColor: 'border-rose-200 dark:border-rose-800',
  },
};

// Today's date ISO helper
const today = new Date();
const formatDate = (daysOffset: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
};

export const INITIAL_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Design Frontend Component Architecture",
    description: "Create modular, reusable UI components including Kanban board, Task Modal, Filter bar, and Responsive Layout.",
    status: "in_progress",
    priority: "urgent",
    category: "Work",
    dueDate: formatDate(0), // Today
    subtasks: [
      { id: "sub-1", title: "Set up Tailwind CSS & theme tokens", completed: true },
      { id: "sub-2", title: "Build Task Card & Kanban Board", completed: true },
      { id: "sub-3", title: "Implement Search and Advanced Filters", completed: false },
      { id: "sub-4", title: "Verify full responsive states", completed: false }
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "task-2",
    title: "Quarterly Financial Budget Review",
    description: "Analyze monthly operational expenditure, calculate cloud hosting cost estimates, and prepare invoice summaries.",
    status: "todo",
    priority: "high",
    category: "Finance",
    dueDate: formatDate(2), // In 2 days
    subtasks: [
      { id: "sub-21", title: "Export Stripe and Supabase billing logs", completed: false },
      { id: "sub-22", title: "Review hosting infrastructure forecast", completed: false }
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "task-3",
    title: "Next.js App Router & Server Components Mastery",
    description: "Read documentation on Server Actions, Turbopack optimizations, and caching strategies.",
    status: "completed",
    priority: "medium",
    category: "Study",
    dueDate: formatDate(-1), // Yesterday (completed on time)
    subtasks: [
      { id: "sub-31", title: "Study caching strategies in Next.js 15/16", completed: true },
      { id: "sub-32", title: "Build a prototype testing streaming SSR", completed: true }
    ],
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "task-4",
    title: "Morning 5K Jog & Cardio Session",
    description: "Complete 30 minutes cardio and stretch recovery routine to maintain peak health.",
    status: "completed",
    priority: "low",
    category: "Health",
    dueDate: formatDate(0),
    subtasks: [],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "task-5",
    title: "Grocery Shopping & Home Meal Prep",
    description: "Purchase fresh vegetables, fruits, whole grains, and prep lunches for the upcoming work week.",
    status: "todo",
    priority: "medium",
    category: "Personal",
    dueDate: formatDate(1),
    subtasks: [
      { id: "sub-51", title: "Make shopping checklist", completed: true },
      { id: "sub-52", title: "Order organic groceries online", completed: false }
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "task-6",
    title: "Review Database Schema & RLS Security Policies",
    description: "Ensure Row Level Security policies prevent cross-tenant data leakage before backend integration.",
    status: "todo",
    priority: "urgent",
    category: "Work",
    dueDate: formatDate(3),
    subtasks: [
      { id: "sub-61", title: "Draft schema migration SQL", completed: false },
      { id: "sub-62", title: "Verify foreign key cascades & indexing", completed: false }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

