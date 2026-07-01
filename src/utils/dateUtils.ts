import { format, parseISO, startOfMonth, endOfMonth, subMonths } from 'date-fns';

export function getCurrentMonthKey(): string {
  return format(new Date(), 'yyyy-MM');
}

export function toMonthKey(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'yyyy-MM');
}

export function monthKeyToLabel(key: string): string {
  return format(parseISO(`${key}-01`), 'MMMM yyyy');
}

export function getPreviousMonthKeys(n: number): string[] {
  const keys: string[] = [];
  for (let i = 0; i < n; i++) {
    keys.push(format(subMonths(new Date(), i), 'yyyy-MM'));
  }
  return keys;
}

export function getMonthStart(key: string): string {
  return format(startOfMonth(parseISO(`${key}-01`)), 'yyyy-MM-dd');
}

export function getMonthEnd(key: string): string {
  return format(endOfMonth(parseISO(`${key}-01`)), 'yyyy-MM-dd');
}

export function todayISO(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function nowISO(): string {
  return new Date().toISOString();
}
