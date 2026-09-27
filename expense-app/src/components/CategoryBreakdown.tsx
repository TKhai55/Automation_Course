import { StyleSheet, Text, View } from 'react-native';

import { getCategory } from '../categories';
import { formatVND, type CategoryTotal } from '../logic';
import { colors, radius } from '../theme';

export function CategoryBreakdown({ items }: { items: CategoryTotal[] }) {
  if (items.length === 0) return null;

  return (
    <View style={styles.card} testID="category-breakdown">
      <Text style={styles.title}>Chi tiêu theo danh mục</Text>
      {items.map((item) => {
        const category = getCategory(item.categoryId);
        const percent = Math.round(item.ratio * 100);
        return (
          <View key={item.categoryId} style={styles.item}>
            <View style={styles.itemHeader}>
              <Text style={styles.name}>
                {category.icon} {category.name}
              </Text>
              <Text style={styles.percent}>{percent}%</Text>
              <Text style={styles.amount}>{formatVND(item.total)}</Text>
            </View>
            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  { width: `${Math.max(item.ratio * 100, 2)}%`, backgroundColor: category.color },
                ]}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  item: {
    gap: 6,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  percent: {
    fontSize: 12,
    color: colors.muted,
    fontVariant: ['tabular-nums'],
  },
  amount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.track,
    overflow: 'hidden',
  },
  fill: {
    height: 6,
    borderRadius: 3,
  },
});
