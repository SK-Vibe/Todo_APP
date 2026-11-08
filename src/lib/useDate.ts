'use client';

export function getTodayStr(): string {
  if (typeof window === 'undefined') return '';
  return new Date().toISOString().split('T')[0];
}

export function getFormattedToday(): string {
  if (typeof window === 'undefined') return 'Today';
  return new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}
