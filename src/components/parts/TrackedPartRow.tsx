import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { CurrencyCode, TrackedPart } from '../../types';
import { formatMoney } from '../../utils/formatMoney';
import { colors, radius, spacing, typography } from '../../theme';
import { Checkbox } from '../common/Checkbox';
import { Text } from '../common/Text';
import { PriorityBadge } from './PriorityBadge';
import { StatusBadge } from './StatusBadge';

type Props = {
  part: TrackedPart;
  currency: CurrencyCode;
  onPress: () => void;
  checkbox?: boolean;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export function TrackedPartRow({
  part,
  currency,
  onPress,
  checkbox = false,
  checked = false,
  onCheckedChange,
}: Props) {
  const cost = formatMoney(part.estimatedCost, currency);
  const levelCategory =
    part.category.split(' › ').at(-1)?.trim() || part.category;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${part.name}, part number ${part.partNumber}, ${part.priority} priority, ${part.status}, estimated ${cost}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.body}>
        {checkbox ? (
          <View style={styles.checkbox}>
            <Checkbox
              checked={checked}
              onChange={onCheckedChange}
              accessibilityLabel={`Select ${part.name}`}
            />
          </View>
        ) : null}
        <View style={styles.gap}>
          <View style={styles.row}>
            <PriorityBadge priority={part.priority} />
            <Text tone="dim">{levelCategory}</Text>
          </View>
          <Text size="lg" weight="semibold">
            {part.name}
          </Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={styles.cost}>{cost}</Text>
        <StatusBadge status={part.status} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  pressed: {
    opacity: 0.9,
  },
  checkbox: {
    marginRight: spacing.md,
  },
  gap: {
    gap: spacing.sm,
  },
  body: {
    flex: 1,
    marginRight: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    ...typography.subtitle,
    color: colors.text,
  },
  number: {
    ...typography.mono,
    color: colors.textMuted,
    marginTop: 2,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  right: {
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  cost: {
    ...typography.caption,
    color: colors.accent,
    fontVariant: ['tabular-nums'],
  },
});
