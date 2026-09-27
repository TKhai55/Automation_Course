import AsyncStorage from '@react-native-async-storage/async-storage';

import { isTransaction } from './logic';
import type { Transaction } from './types';

const STORAGE_KEY = 'expense-app/transactions/v1';

export async function loadTransactions(): Promise<Transaction[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  const parsed: unknown = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed.filter(isTransaction) : [];
}

export async function saveTransactions(transactions: Transaction[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}
