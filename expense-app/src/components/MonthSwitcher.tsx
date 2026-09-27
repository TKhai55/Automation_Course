import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatMonthLabel } from '../logic';
import { colors } from '../theme';

interface Props {
  month: string;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function MonthSwitcher({ month, canGoNext, onPrev, onNext }: Props) {
  return (
    <View style={styles.row}>
      <Pressable
        testID="month-prev"
        accessibilityRole="button"
        accessibilityLabel="Tháng trước"
        onPress={onPrev}
        hitSlop={8}
        style={({ pressed }) => [styles.arrow, pressed && styles.pressed]}
      >
        <Text style={styles.arrowText}>‹</Text>
      </Pressable>
      <Text testID="month-label" style={styles.label}>
        {formatMonthLabel(month)}
      </Text>
      <Pressable
        testID="month-next"
        accessibilityRole="button"
        accessibilityLabel="Tháng sau"
        accessibilityState={{ disabled: !canGoNext }}
        disabled={!canGoNext}
        onPress={onNext}
        hitSlop={8}
        style={({ pressed }) => [styles.arrow, pressed && styles.pressed, !canGoNext && styles.disabled]}
      >
        <Text style={styles.arrowText}>›</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  arrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  arrowText: {
    fontSize: 22,
    lineHeight: 24,
    color: colors.text,
    fontWeight: '600',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    minWidth: 104,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
  disabled: {
    opacity: 0.3,
  },
});
