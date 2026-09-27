import { useMemo, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, SectionList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { CategoryBreakdown } from './components/CategoryBreakdown';
import { MonthSwitcher } from './components/MonthSwitcher';
import { SummaryCard } from './components/SummaryCard';
import { TransactionForm } from './components/TransactionForm';
import { TransactionRow } from './components/TransactionRow';
import { confirmAction } from './confirm';
import {
  defaultDateForMonth,
  formatDayLabel,
  formatVND,
  groupByDay,
  shiftMonth,
  summarizeMonth,
  toDateKey,
  toMonthKey,
} from './logic';
import { colors, radius } from './theme';
import type { Transaction, TransactionInput } from './types';
import { useTransactions } from './useTransactions';

interface FormState {
  visible: boolean;
  /** Tăng mỗi lần mở để form khởi tạo lại từ đầu */
  key: number;
  editing?: Transaction;
}

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const todayKey = toDateKey(new Date());
  const currentMonth = toMonthKey(todayKey);
  const [month, setMonth] = useState(currentMonth);
  const [form, setForm] = useState<FormState>({ visible: false, key: 0 });
  const { transactions, status, addTransaction, updateTransaction, deleteTransaction } = useTransactions();

  const summary = useMemo(() => summarizeMonth(transactions, month), [transactions, month]);
  const sections = useMemo(() => groupByDay(transactions, month), [transactions, month]);

  const openForm = (editing?: Transaction) =>
    setForm((prev) => ({ visible: true, key: prev.key + 1, editing }));
  const closeForm = () => setForm((prev) => ({ ...prev, visible: false }));

  const handleSubmit = (input: TransactionInput) => {
    if (form.editing) {
      updateTransaction(form.editing.id, input);
    } else {
      addTransaction(input);
      // Nhảy tới tháng của giao dịch vừa thêm để người dùng thấy ngay
      setMonth(toMonthKey(input.date));
    }
    closeForm();
  };

  const handleDelete = () => {
    const editing = form.editing;
    if (!editing) return;
    confirmAction('Xóa giao dịch?', 'Bạn không thể hoàn tác thao tác này.', 'Xóa', () => {
      deleteTransaction(editing.id);
      closeForm();
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.topBar}>
        <Text style={styles.appTitle}>Chi tiêu</Text>
        <MonthSwitcher
          month={month}
          canGoNext={month < currentMonth}
          onPrev={() => setMonth((prev) => shiftMonth(prev, -1))}
          onNext={() => setMonth((prev) => shiftMonth(prev, 1))}
        />
      </View>

      {status === 'loading' ? (
        <ActivityIndicator style={styles.loading} color={colors.primary} />
      ) : (
        <SectionList
          testID="transaction-list"
          sections={sections}
          keyExtractor={(item) => item.id}
          stickySectionHeadersEnabled={false}
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 96 }]}
          ListHeaderComponent={
            <View style={styles.header}>
              {status === 'error' ? (
                <Text style={styles.errorText}>
                  Không đọc được dữ liệu đã lưu. Dữ liệu mới sẽ không được lưu cho đến khi mở lại app.
                </Text>
              ) : null}
              <SummaryCard summary={summary} />
              <CategoryBreakdown items={summary.byCategory} />
              {sections.length > 0 ? <Text style={styles.sectionTitle}>Giao dịch</Text> : null}
            </View>
          }
          renderSectionHeader={({ section }) => (
            <View style={styles.dayHeader}>
              <Text style={styles.dayLabel}>{formatDayLabel(section.dateKey, todayKey)}</Text>
              <Text style={styles.dayTotal}>{formatVND(section.net, true)}</Text>
            </View>
          )}
          renderItem={({ item, index, section }) => (
            <View
              style={[
                styles.itemWrapper,
                index === 0 && styles.itemFirst,
                index === section.data.length - 1 && styles.itemLast,
              ]}
            >
              <TransactionRow transaction={item} onPress={openForm} />
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.empty} testID="empty-state">
              <Text style={styles.emptyIcon}>🪙</Text>
              <Text style={styles.emptyTitle}>Chưa có giao dịch nào</Text>
              <Text style={styles.emptyText}>Nhấn nút + để ghi khoản chi tiêu đầu tiên.</Text>
            </View>
          }
        />
      )}

      <Pressable
        testID="add-button"
        accessibilityRole="button"
        accessibilityLabel="Thêm giao dịch"
        onPress={() => openForm()}
        style={({ pressed }) => [styles.fab, { bottom: insets.bottom + 24 }, pressed && styles.fabPressed]}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>

      <Modal
        visible={form.visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeForm}
      >
        <TransactionForm
          key={form.key}
          initial={form.editing}
          defaultDate={defaultDateForMonth(month, todayKey)}
          todayKey={todayKey}
          onSubmit={handleSubmit}
          onDelete={form.editing ? handleDelete : undefined}
          onClose={closeForm}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  loading: {
    marginTop: 48,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  header: {
    gap: 12,
    marginBottom: 4,
  },
  errorText: {
    color: colors.expense,
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 14,
    paddingBottom: 6,
    paddingHorizontal: 4,
  },
  dayLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.muted,
  },
  dayTotal: {
    fontSize: 13,
    color: colors.muted,
    fontVariant: ['tabular-nums'],
  },
  itemWrapper: {
    overflow: 'hidden',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  itemFirst: {
    borderTopLeftRadius: radius.md,
    borderTopRightRadius: radius.md,
  },
  itemLast: {
    borderBottomLeftRadius: radius.md,
    borderBottomRightRadius: radius.md,
    borderBottomWidth: 0,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 6,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  emptyText: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  fabPressed: {
    backgroundColor: colors.primaryDark,
  },
  fabText: {
    color: colors.onPrimary,
    fontSize: 32,
    lineHeight: 34,
    fontWeight: '400',
  },
});
