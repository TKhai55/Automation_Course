import { useCallback, useEffect, useState } from 'react';

import { createId } from './logic';
import { loadTransactions, saveTransactions } from './storage';
import type { Transaction, TransactionInput } from './types';

type Status = 'loading' | 'ready' | 'error';

/** Danh sách giao dịch, tự lưu vào bộ nhớ máy mỗi khi thay đổi */
export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    let active = true;
    loadTransactions()
      .then((items) => {
        if (!active) return;
        setTransactions(items);
        setStatus('ready');
      })
      .catch((error) => {
        console.warn('Không đọc được dữ liệu', error);
        // Không ghi đè dữ liệu cũ khi đọc lỗi
        if (active) setStatus('error');
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (status !== 'ready') return;
    saveTransactions(transactions).catch((error) => console.warn('Không lưu được dữ liệu', error));
  }, [transactions, status]);

  const addTransaction = useCallback((input: TransactionInput) => {
    const tx: Transaction = { ...input, id: createId(), createdAt: Date.now() };
    setTransactions((prev) => [tx, ...prev]);
  }, []);

  const updateTransaction = useCallback((id: string, input: TransactionInput) => {
    setTransactions((prev) => prev.map((tx) => (tx.id === id ? { ...tx, ...input } : tx)));
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  }, []);

  return { transactions, status, addTransaction, updateTransaction, deleteTransaction };
}
