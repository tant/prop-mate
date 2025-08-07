import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: unknown): string {
  if (!date) return 'Không có';
  let d: Date | null = null;
  if (typeof date === 'string' || typeof date === 'number') {
    d = new Date(date);
  } else if (date instanceof Date) {
    d = date;
  } else if (
    date &&
    typeof date === 'object' &&
    'toDate' in date &&
    typeof (date as { toDate: () => Date }).toDate === 'function'
  ) {
    d = (date as { toDate: () => Date }).toDate();
  }
  return d && !Number.isNaN(d.getTime()) ? d.toLocaleString() : 'Không hợp lệ';
}

export function toDateSafe(val: Date | { toDate: () => Date } | undefined | null): Date {
  if (!val) return new Date(0);
  if (val instanceof Date) return val;
  if (typeof val === 'object' && typeof val.toDate === 'function') return val.toDate();
  return new Date(0);
}
