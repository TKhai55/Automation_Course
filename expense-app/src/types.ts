export type TransactionType = 'expense' | 'income';

export interface Transaction {
  id: string;
  type: TransactionType;
  /** Số tiền (VND), luôn là số dương */
  amount: number;
  categoryId: string;
  note: string;
  /** Ngày giao dịch dạng YYYY-MM-DD (giờ địa phương) */
  date: string;
  /** Thời điểm tạo (ms), dùng để sắp xếp trong cùng một ngày */
  createdAt: number;
}

export type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>;

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}
