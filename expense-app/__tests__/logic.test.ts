import {
  defaultDateForMonth,
  formatDayLabel,
  formatMonthLabel,
  formatVND,
  groupByDay,
  isTransaction,
  parseAmount,
  shiftDate,
  shiftMonth,
  summarizeMonth,
  toDateKey,
} from '../src/logic';
import type { Transaction } from '../src/types';

const tx = (overrides: Partial<Transaction>): Transaction => ({
  id: Math.random().toString(36),
  type: 'expense',
  amount: 10_000,
  categoryId: 'food',
  note: '',
  date: '2026-09-15',
  createdAt: 0,
  ...overrides,
});

describe('tiền tệ', () => {
  it('định dạng VND có dấu chấm phân cách', () => {
    expect(formatVND(0)).toBe('0 ₫');
    expect(formatVND(1_250_000)).toBe('1.250.000 ₫');
    expect(formatVND(-35_000)).toBe('-35.000 ₫');
    expect(formatVND(500, true)).toBe('+500 ₫');
  });

  it('đọc số tiền từ chuỗi đã định dạng', () => {
    expect(parseAmount('1.250.000')).toBe(1_250_000);
    expect(parseAmount('')).toBe(0);
    expect(parseAmount('abc')).toBe(0);
    expect(parseAmount('99999999999999999')).toBe(9_999_999_999_999);
  });
});

describe('ngày tháng', () => {
  it('chuyển Date sang YYYY-MM-DD', () => {
    expect(toDateKey(new Date(2026, 0, 5))).toBe('2026-01-05');
  });

  it('cộng trừ ngày qua ranh giới tháng/năm', () => {
    expect(shiftDate('2026-03-01', -1)).toBe('2026-02-28');
    expect(shiftDate('2026-12-31', 1)).toBe('2027-01-01');
  });

  it('cộng trừ tháng qua ranh giới năm', () => {
    expect(shiftMonth('2026-01', -1)).toBe('2025-12');
    expect(shiftMonth('2026-12', 1)).toBe('2027-01');
    expect(formatMonthLabel('2026-09')).toBe('Tháng 9/2026');
  });

  it('nhãn ngày thân thiện', () => {
    expect(formatDayLabel('2026-09-27', '2026-09-27')).toBe('Hôm nay');
    expect(formatDayLabel('2026-09-26', '2026-09-27')).toBe('Hôm qua');
    expect(formatDayLabel('2026-09-21', '2026-09-27')).toBe('Thứ Hai, 21/09');
    expect(formatDayLabel('2026-09-20', '2026-09-27')).toBe('Chủ nhật, 20/09');
  });

  it('ngày mặc định: hôm nay nếu là tháng này, ngày cuối tháng nếu là tháng cũ', () => {
    expect(defaultDateForMonth('2026-09', '2026-09-27')).toBe('2026-09-27');
    expect(defaultDateForMonth('2026-02', '2026-09-27')).toBe('2026-02-28');
    expect(defaultDateForMonth('2024-02', '2026-09-27')).toBe('2024-02-29');
  });
});

describe('thống kê', () => {
  const data = [
    tx({ type: 'income', amount: 15_000_000, categoryId: 'salary', date: '2026-09-01' }),
    tx({ amount: 300_000, categoryId: 'food', date: '2026-09-02' }),
    tx({ amount: 100_000, categoryId: 'food', date: '2026-09-03' }),
    tx({ amount: 600_000, categoryId: 'bills', date: '2026-09-03' }),
    tx({ amount: 999_999, categoryId: 'food', date: '2026-08-31' }), // tháng khác
  ];

  it('tính tổng thu, chi, số dư trong tháng', () => {
    const summary = summarizeMonth(data, '2026-09');
    expect(summary.income).toBe(15_000_000);
    expect(summary.expense).toBe(1_000_000);
    expect(summary.balance).toBe(14_000_000);
  });

  it('chi theo danh mục, sắp xếp giảm dần và có tỉ lệ', () => {
    const { byCategory } = summarizeMonth(data, '2026-09');
    expect(byCategory).toEqual([
      { categoryId: 'bills', total: 600_000, ratio: 0.6 },
      { categoryId: 'food', total: 400_000, ratio: 0.4 },
    ]);
  });

  it('tháng không có giao dịch', () => {
    expect(summarizeMonth(data, '2026-07')).toEqual({ income: 0, expense: 0, balance: 0, byCategory: [] });
  });

  it('gom theo ngày, ngày mới nhất trước, giao dịch mới nhất trước', () => {
    const a = tx({ id: 'a', date: '2026-09-03', createdAt: 1 });
    const b = tx({ id: 'b', date: '2026-09-03', createdAt: 2, type: 'income', amount: 50_000 });
    const c = tx({ id: 'c', date: '2026-09-01', createdAt: 3 });
    const sections = groupByDay([a, c, b], '2026-09');
    expect(sections.map((s) => s.dateKey)).toEqual(['2026-09-03', '2026-09-01']);
    expect(sections[0].data.map((t) => t.id)).toEqual(['b', 'a']);
    expect(sections[0].net).toBe(40_000);
  });
});

describe('kiểm tra dữ liệu đã lưu', () => {
  it('chấp nhận giao dịch hợp lệ, loại bỏ dữ liệu hỏng', () => {
    expect(isTransaction(tx({}))).toBe(true);
    expect(isTransaction(null)).toBe(false);
    expect(isTransaction({ ...tx({}), amount: '100' })).toBe(false);
    expect(isTransaction({ ...tx({}), type: 'other' })).toBe(false);
    expect(isTransaction({ ...tx({}), date: '27/09/2026' })).toBe(false);
  });
});
