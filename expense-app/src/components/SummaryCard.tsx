import { StyleSheet, Text, View } from 'react-native';

import { formatVND, type MonthSummary } from '../logic';
import { colors, radius } from '../theme';

export function SummaryCard({ summary }: { summary: MonthSummary }) {
  return (
    <View style={styles.card}>
      <Text style={styles.caption}>Số dư trong tháng</Text>
      <Text testID="balance-text" style={styles.balance} numberOfLines={1} adjustsFontSizeToFit>
        {formatVND(summary.balance)}
      </Text>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.smallCaption}>▲ Thu nhập</Text>
          <Text testID="income-text" style={styles.amount} numberOfLines={1} adjustsFontSizeToFit>
            {formatVND(summary.income)}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.column}>
          <Text style={styles.smallCaption}>▼ Chi tiêu</Text>
          <Text testID="expense-text" style={styles.amount} numberOfLines={1} adjustsFontSizeToFit>
            {formatVND(summary.expense)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: 20,
    gap: 4,
  },
  caption: {
    color: colors.onPrimary,
    opacity: 0.85,
    fontSize: 14,
  },
  balance: {
    color: colors.onPrimary,
    fontSize: 32,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  row: {
    flexDirection: 'row',
    marginTop: 14,
    backgroundColor: colors.primaryDark,
    borderRadius: radius.md,
    paddingVertical: 12,
  },
  column: {
    flex: 1,
    paddingHorizontal: 14,
    gap: 2,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  smallCaption: {
    color: colors.onPrimary,
    opacity: 0.85,
    fontSize: 12,
  },
  amount: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
});
