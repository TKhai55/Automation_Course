import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { getCategoriesByType } from '../categories';
import { formatDayLabel, formatFullDate, formatNumber, parseAmount, shiftDate } from '../logic';
import { colors, radius } from '../theme';
import type { Transaction, TransactionInput, TransactionType } from '../types';

const QUICK_AMOUNTS = [10_000, 50_000, 100_000, 500_000];

interface Props {
  /** Giao dịch đang sửa; bỏ trống khi thêm mới */
  initial?: Transaction;
  defaultDate: string;
  todayKey: string;
  onSubmit: (input: TransactionInput) => void;
  onDelete?: () => void;
  onClose: () => void;
}

export function TransactionForm({ initial, defaultDate, todayKey, onSubmit, onDelete, onClose }: Props) {
  const [type, setType] = useState<TransactionType>(initial?.type ?? 'expense');
  const [amount, setAmount] = useState(initial?.amount ?? 0);
  const [categoryId, setCategoryId] = useState(
    initial?.categoryId ?? getCategoriesByType('expense')[0].id,
  );
  const [date, setDate] = useState(initial?.date ?? defaultDate);
  const [note, setNote] = useState(initial?.note ?? '');

  const categories = getCategoriesByType(type);
  const canSave = amount > 0;
  const canGoNextDay = date < todayKey;

  const changeType = (next: TransactionType) => {
    setType(next);
    const nextCategories = getCategoriesByType(next);
    if (!nextCategories.some((category) => category.id === categoryId)) {
      setCategoryId(nextCategories[0].id);
    }
  };

  const submit = () => {
    if (!canSave) return;
    onSubmit({ type, amount, categoryId, date, note: note.trim() });
  };

  const accent = type === 'income' ? colors.income : colors.expense;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable testID="cancel-button" accessibilityRole="button" onPress={onClose} hitSlop={8}>
          <Text style={styles.headerButton}>Hủy</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{initial ? 'Sửa giao dịch' : 'Thêm giao dịch'}</Text>
        <Pressable
          testID="save-button"
          accessibilityRole="button"
          accessibilityState={{ disabled: !canSave }}
          disabled={!canSave}
          onPress={submit}
          hitSlop={8}
        >
          <Text style={[styles.headerButton, styles.saveText, !canSave && styles.disabledText]}>Lưu</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View style={styles.segment}>
          {(['expense', 'income'] as const).map((value) => {
            const selected = value === type;
            return (
              <Pressable
                key={value}
                testID={`type-${value}`}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => changeType(value)}
                style={[styles.segmentItem, selected && styles.segmentItemSelected]}
              >
                <Text style={[styles.segmentText, selected && styles.segmentTextSelected]}>
                  {value === 'expense' ? 'Chi tiêu' : 'Thu nhập'}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.amountBox}>
          <TextInput
            testID="amount-input"
            accessibilityLabel="Số tiền"
            style={[styles.amountInput, { color: accent }]}
            value={amount > 0 ? formatNumber(amount) : ''}
            onChangeText={(text) => setAmount(parseAmount(text))}
            placeholder="0"
            placeholderTextColor={colors.muted}
            keyboardType="number-pad"
            autoFocus={!initial}
            returnKeyType="done"
            onSubmitEditing={submit}
          />
          <Text style={[styles.currency, { color: accent }]}>₫</Text>
        </View>
        <View style={styles.quickRow}>
          {QUICK_AMOUNTS.map((value) => (
            <Pressable
              key={value}
              testID={`quick-amount-${value}`}
              accessibilityRole="button"
              onPress={() => setAmount((prev) => prev + value)}
              style={({ pressed }) => [styles.quickChip, pressed && styles.pressed]}
            >
              <Text style={styles.quickText}>+{formatNumber(value / 1000)}k</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Danh mục</Text>
        <View style={styles.grid}>
          {categories.map((category) => {
            const selected = category.id === categoryId;
            return (
              <Pressable
                key={category.id}
                testID={`category-${category.id}`}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setCategoryId(category.id)}
                style={[
                  styles.categoryChip,
                  selected && { borderColor: category.color, backgroundColor: `${category.color}1A` },
                ]}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryName} numberOfLines={1}>
                  {category.name}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Ngày</Text>
        <View style={styles.dateRow}>
          <Pressable
            testID="date-prev"
            accessibilityRole="button"
            accessibilityLabel="Ngày trước"
            onPress={() => setDate((prev) => shiftDate(prev, -1))}
            style={({ pressed }) => [styles.dateArrow, pressed && styles.pressed]}
          >
            <Text style={styles.dateArrowText}>‹</Text>
          </Pressable>
          <View style={styles.dateTexts}>
            <Text testID="date-label" style={styles.dateMain}>
              {formatDayLabel(date, todayKey)}
            </Text>
            <Text style={styles.dateSub}>{formatFullDate(date)}</Text>
          </View>
          <Pressable
            testID="date-next"
            accessibilityRole="button"
            accessibilityLabel="Ngày sau"
            accessibilityState={{ disabled: !canGoNextDay }}
            disabled={!canGoNextDay}
            onPress={() => setDate((prev) => shiftDate(prev, 1))}
            style={({ pressed }) => [styles.dateArrow, pressed && styles.pressed, !canGoNextDay && styles.disabled]}
          >
            <Text style={styles.dateArrowText}>›</Text>
          </Pressable>
        </View>

        <Text style={styles.label}>Ghi chú</Text>
        <TextInput
          testID="note-input"
          style={styles.noteInput}
          value={note}
          onChangeText={setNote}
          placeholder="Ví dụ: Cà phê với bạn (không bắt buộc)"
          placeholderTextColor={colors.muted}
          maxLength={80}
          returnKeyType="done"
        />

        {onDelete ? (
          <Pressable
            testID="delete-button"
            accessibilityRole="button"
            onPress={onDelete}
            style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]}
          >
            <Text style={styles.deleteText}>Xóa giao dịch</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.card,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  headerButton: {
    fontSize: 16,
    color: colors.primary,
    minWidth: 44,
  },
  saveText: {
    fontWeight: '700',
    textAlign: 'right',
  },
  disabledText: {
    color: colors.muted,
  },
  content: {
    padding: 16,
    gap: 12,
    paddingBottom: 48,
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: colors.track,
    borderRadius: radius.sm,
    padding: 3,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  segmentItemSelected: {
    backgroundColor: colors.card,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  segmentText: {
    fontSize: 14,
    color: colors.muted,
    fontWeight: '500',
  },
  segmentTextSelected: {
    color: colors.text,
    fontWeight: '600',
  },
  amountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  amountInput: {
    flex: 1,
    // Ô input trên web có chiều rộng mặc định, không cho co lại nếu thiếu dòng này
    minWidth: 0,
    fontSize: 34,
    fontWeight: '700',
    paddingVertical: 6,
    fontVariant: ['tabular-nums'],
  },
  currency: {
    fontSize: 28,
    fontWeight: '600',
  },
  quickRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: radius.sm,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  quickText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '500',
  },
  label: {
    fontSize: 13,
    color: colors.muted,
    fontWeight: '600',
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    width: '23%',
    flexGrow: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 10,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  categoryIcon: {
    fontSize: 22,
  },
  categoryName: {
    fontSize: 12,
    color: colors.text,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 8,
  },
  dateArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.track,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateArrowText: {
    fontSize: 22,
    lineHeight: 24,
    color: colors.text,
    fontWeight: '600',
  },
  dateTexts: {
    flex: 1,
    alignItems: 'center',
  },
  dateMain: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  dateSub: {
    fontSize: 12,
    color: colors.muted,
  },
  noteInput: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
  },
  deleteButton: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    alignItems: 'center',
  },
  deleteText: {
    color: colors.expense,
    fontSize: 15,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.6,
  },
  disabled: {
    opacity: 0.3,
  },
});
