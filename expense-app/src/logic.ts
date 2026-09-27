import type { Transaction } from './types';

// ---------- Tiền tệ ----------

/** 1250000 -> "1.250.000" */
export function formatNumber(value: number): string {
  return Math.round(Math.abs(value))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/** 1250000 -> "1.250.000 ₫"; withSign thêm dấu "+" cho số dương */
export function formatVND(value: number, withSign = false): string {
  const sign = value < 0 ? '-' : withSign && value > 0 ? '+' : '';
  return `${sign}${formatNumber(value)} ₫`;
}

const MAX_AMOUNT_DIGITS = 13;

/** "1.250.000" -> 1250000; bỏ mọi ký tự không phải số */
export function parseAmount(text: string): number {
  const digits = text.replace(/\D/g, '').slice(0, MAX_AMOUNT_DIGITS);
  return digits ? Number(digits) : 0;
}

// ---------- Ngày tháng ----------

const pad = (n: number) => String(n).padStart(2, '0');

/** Date -> "YYYY-MM-DD" theo giờ địa phương */
export function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function shiftDate(dateKey: string, days: number): string {
  const date = parseDateKey(dateKey);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
}

/** "2026-09-27" -> "2026-09" */
export function toMonthKey(dateKey: string): string {
  return dateKey.slice(0, 7);
}

export function shiftMonth(monthKey: string, delta: number): string {
  const [year, month] = monthKey.split('-').map(Number);
  const date = new Date(year, month - 1 + delta, 1);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
}

/** "2026-09" -> "Tháng 9/2026" */
export function formatMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number);
  return `Tháng ${month}/${year}`;
}

const WEEKDAYS = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

/** "Hôm nay", "Hôm qua" hoặc "Thứ Hai, 21/09" */
export function formatDayLabel(dateKey: string, todayKey: string): string {
  if (dateKey === todayKey) return 'Hôm nay';
  if (dateKey === shiftDate(todayKey, -1)) return 'Hôm qua';
  const date = parseDateKey(dateKey);
  return `${WEEKDAYS[date.getDay()]}, ${pad(date.getDate())}/${pad(date.getMonth() + 1)}`;
}

/** "2026-09-27" -> "27/09/2026" */
export function formatFullDate(dateKey: string): string {
  const [year, month, day] = dateKey.split('-');
  return `${day}/${month}/${year}`;
}

/**
 * Ngày mặc định khi thêm giao dịch mới trong tháng đang xem:
 * tháng hiện tại -> hôm nay; tháng trước đó -> ngày cuối tháng.
 */
export function defaultDateForMonth(monthKey: string, todayKey: string): string {
  if (monthKey === toMonthKey(todayKey)) return todayKey;
  return shiftDate(`${shiftMonth(monthKey, 1)}-01`, -1);
}

// ---------- Thống kê ----------

export interface CategoryTotal {
  categoryId: string;
  total: number;
  /** Tỉ lệ so với tổng chi trong tháng (0..1) */
  ratio: number;
}

export interface MonthSummary {
  income: number;
  expense: number;
  balance: number;
  /** Chi tiêu theo danh mục, sắp xếp giảm dần */
  byCategory: CategoryTotal[];
}

export function summarizeMonth(transactions: Transaction[], monthKey: string): MonthSummary {
  let income = 0;
  let expense = 0;
  const totals = new Map<string, number>();

  for (const tx of transactions) {
    if (toMonthKey(tx.date) !== monthKey) continue;
    if (tx.type === 'income') {
      income += tx.amount;
    } else {
      expense += tx.amount;
      totals.set(tx.categoryId, (totals.get(tx.categoryId) ?? 0) + tx.amount);
    }
  }

  const byCategory = [...totals]
    .map(([categoryId, total]) => ({
      categoryId,
      total,
      ratio: expense > 0 ? total / expense : 0,
    }))
    .sort((a, b) => b.total - a.total);

  return { income, expense, balance: income - expense, byCategory };
}

export interface DaySection {
  dateKey: string;
  /** Thu - chi trong ngày */
  net: number;
  data: Transaction[];
}

/** Gom giao dịch của một tháng theo ngày, ngày mới nhất lên đầu */
export function groupByDay(transactions: Transaction[], monthKey: string): DaySection[] {
  const days = new Map<string, Transaction[]>();
  for (const tx of transactions) {
    if (toMonthKey(tx.date) !== monthKey) continue;
    const list = days.get(tx.date) ?? [];
    list.push(tx);
    days.set(tx.date, list);
  }

  return [...days]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([dateKey, items]) => ({
      dateKey,
      net: items.reduce((sum, tx) => sum + (tx.type === 'income' ? tx.amount : -tx.amount), 0),
      data: [...items].sort((a, b) => b.createdAt - a.createdAt),
    }));
}

// ---------- Khác ----------

export function createId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function isTransaction(value: unknown): value is Transaction {
  if (typeof value !== 'object' || value === null) return false;
  const tx = value as Record<string, unknown>;
  return (
    typeof tx.id === 'string' &&
    (tx.type === 'expense' || tx.type === 'income') &&
    typeof tx.amount === 'number' &&
    Number.isFinite(tx.amount) &&
    typeof tx.categoryId === 'string' &&
    typeof tx.note === 'string' &&
    typeof tx.date === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(tx.date) &&
    typeof tx.createdAt === 'number'
  );
}
