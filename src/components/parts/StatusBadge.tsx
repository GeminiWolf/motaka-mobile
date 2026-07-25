import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import type {PartStatus} from '../../types';
import {colors, radius, spacing, typography} from '../../theme';

const LABELS: Record<PartStatus, string> = {
  needed: 'Needed',
  sourcing: 'Sourcing',
  ordered: 'Ordered',
  installed: 'Installed',
};

const TINT: Record<PartStatus, string> = {
  needed: colors.needed,
  sourcing: colors.sourcing,
  ordered: colors.ordered,
  installed: colors.installed,
};

type Props = {status: PartStatus};

export function StatusBadge({status}: Props) {
  const color = TINT[status];
  return (
    <View style={[styles.badge, {backgroundColor: `${color}22`}]}>
      <Text style={[styles.label, {color}]}>{LABELS[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  label: {
    ...typography.label,
    textTransform: 'uppercase',
  },
});
