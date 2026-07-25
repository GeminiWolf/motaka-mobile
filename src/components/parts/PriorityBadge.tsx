import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { PartPriority } from '../../types';
import { colors, spacing, typography } from '../../theme';

const LABELS: Record<PartPriority, string> = {
  urgent: 'Urgent',
  soon: 'Soon',
  someday: 'Someday',
};

const TINT: Record<PartPriority, string> = {
  urgent: colors.urgent,
  soon: colors.soon,
  someday: colors.someday,
};

type Props = { priority: PartPriority };

export function PriorityBadge({ priority }: Props) {
  const color = TINT[priority];
  return (
    <View style={[styles.badge, { borderColor: color }]}>
      <Text style={[styles.label, { color }]}>{LABELS[priority]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  label: {
    ...typography.label,
    textTransform: 'uppercase',
  },
});
