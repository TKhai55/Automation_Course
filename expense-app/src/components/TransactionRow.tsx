import { Pressable, StyleSheet, Text, View } from 'react-native';

import { getCategory } from '../categories';
import { formatVND } from '../logic';
import { colors } from '../theme';
import type { Transaction } from '../types';

interface Props {
  transaction: Transaction;
  onPress: (transaction: Transaction) => void;
}

export function TransactionRow({ transaction, onPress }: Props) {
  const category = getCategory(transaction.categoryId);
  const isIncome = transaction.type === 'income';
  const title = transaction.note || category.name;

  return (
    <Pressable
      testID={`tx-item-${transaction.id}`}
      accessibilityRole="button"
      accessibilityHint="Mở để sửa hoặc xóa"
      onPress={() => onPress(transaction)}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={[styles.icon, { backgroundColor: `${category.color}22` }]}>
        <Text style={styles.iconText}>{category.icon}</Text>
      </View>
      <View style={styles.texts}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {transaction.note ? <Text style={styles.subtitle}>{category.name}</Text> : null}
      </View>
      <Text style={[styles.amount, { color: isIncome ? colors.income : colors.expense }]}>
        {formatVND(isIncome ? transaction.amount : -transaction.amount, true)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: colors.card,
  },
  pressed: {
    backgroundColor: colors.track,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 20,
  },
  texts: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 12,
    color: colors.muted,
  },
  amount: {
    fontSize: 15,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
});
