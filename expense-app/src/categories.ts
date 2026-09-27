import type { Category, TransactionType } from './types';

export const EXPENSE_CATEGORIES: Category[] = [
  { id: 'food', name: 'Ăn uống', icon: '🍜', color: '#F59E0B', type: 'expense' },
  { id: 'transport', name: 'Di chuyển', icon: '🛵', color: '#3B82F6', type: 'expense' },
  { id: 'shopping', name: 'Mua sắm', icon: '🛍️', color: '#EC4899', type: 'expense' },
  { id: 'bills', name: 'Hóa đơn', icon: '🧾', color: '#8B5CF6', type: 'expense' },
  { id: 'entertainment', name: 'Giải trí', icon: '🎬', color: '#F97316', type: 'expense' },
  { id: 'health', name: 'Sức khỏe', icon: '💊', color: '#10B981', type: 'expense' },
  { id: 'education', name: 'Học tập', icon: '📚', color: '#06B6D4', type: 'expense' },
  { id: 'other-expense', name: 'Khác', icon: '📦', color: '#6B7280', type: 'expense' },
];

export const INCOME_CATEGORIES: Category[] = [
  { id: 'salary', name: 'Lương', icon: '💰', color: '#16A34A', type: 'income' },
  { id: 'bonus', name: 'Thưởng', icon: '🎁', color: '#22C55E', type: 'income' },
  { id: 'other-income', name: 'Thu khác', icon: '💵', color: '#84CC16', type: 'income' },
];

const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export function getCategoriesByType(type: TransactionType): Category[] {
  return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}

export function getCategory(id: string): Category {
  return (
    ALL_CATEGORIES.find((category) => category.id === id) ??
    EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1]
  );
}
