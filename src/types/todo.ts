export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export type TaskCategory = 'Work' | 'Personal' | 'Study' | 'Health' | 'Finance';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  userId?: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate?: string;
  subtasks: Subtask[];
  createdAt: string;
  updatedAt: string;
}

export type ViewMode = 'list' | 'kanban';

export interface FilterOptions {
  search: string;
  status: 'all' | TaskStatus;
  priority: 'all' | TaskPriority;
  category: 'all' | TaskCategory;
  sortBy: 'dueDate' | 'priority' | 'createdAt' | 'title';
  sortOrder: 'asc' | 'desc';
  viewMode: ViewMode;
  dateFilter?: 'all' | 'today' | 'upcoming' | 'overdue';
}

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: string;
}

export interface CategoryMeta {
  name: TaskCategory;
  color: string;
  bgColor: string;
  borderColor: string;
}

