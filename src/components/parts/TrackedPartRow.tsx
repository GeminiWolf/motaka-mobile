import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { CurrencyCode, TrackedPart } from '../../types';
import { formatMoney } from '../../utils/formatMoney';
import { colors, layout, spacing, tabularNums } from '../../theme';
import { Checkbox } from '../common/Checkbox';
import { Text } from '../common/Text';

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
  const installed = part.status === 'installed';
  const meta = [part.priority === 'urgent' ? 'Urgent' : null, part.status]
    .filter(Boolean)
    .join(' · ');

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${part.name}, part number ${part.partNumber}, ${part.priority} priority, ${part.status}, estimated ${cost}`}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      {checkbox ? (
        <View style={styles.checkbox}>
          <Checkbox
            checked={checked}
            onChange={onCheckedChange}
            accessibilityLabel={`Mark ${part.name} installed`}
          />
        </View>
      ) : null}
      <View style={styles.body}>
        <Text
          weight="medium"
          strike={installed}
          tone={installed ? 'dim' : 'default'}
        >
          {part.name}
        </Text>
        <Text size="sm" tone="dim" transform="capitalize">
          {meta}
        </Text>
      </View>
      <Text
        size="sm"
        tone={installed ? 'dim' : 'muted'}
        style={tabularNums}
      >
        {cost}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: layout.rowMinHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: layout.hairline,
    borderBottomColor: colors.borderSubtle,
  },
  pressed: {
    opacity: 0.72,
  },
  checkbox: {
    marginRight: spacing.md,
  },
  body: {
    flex: 1,
    marginRight: spacing.sm,
    gap: 2,
  },
});
