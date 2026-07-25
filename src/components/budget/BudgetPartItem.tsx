import { View, StyleSheet } from 'react-native';
import React from 'react';
import type { CurrencyCode, TrackedPart } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '@react-navigation/elements';
import { colors, spacing } from '../../theme';
import { Text } from '../common/Text';
import { withOpacity } from '../../utils/withOpacity';
import { formatMoney } from '../../utils/formatMoney';

const PRIORITY_LABELS: Record<TrackedPart['priority'], string> = {
  urgent: 'Urgent',
  soon: 'Soon',
  someday: 'Someday',
};

type Props = {
  index?: number;
  part: TrackedPart;
  vehicleLabel: string;
  currency?: CurrencyCode;
};

export default function BudgetPartItem({
  index,
  part,
  vehicleLabel,
  currency = 'ZAR',
}: Props) {
  const priorityBadgeColor = colors[`${part.priority}`];

  return (
    <Card backgroundColor="slate800" gap="md" style={styles.container}>
      <View style={[styles.row, { gap: spacing.sm }]}>
        <View>
          <Badge size={25} visible={true} style={styles.badge}>
            {index?.toString()}
          </Badge>
        </View>
        <View style={styles.gapXs}>
          <Text tone="white">{part.name}</Text>
          <Text size="sm" tone="slate">
            {vehicleLabel}
          </Text>
        </View>
      </View>
      <View style={[styles.alignRight]}>
        <Badge
          size={22}
          visible={true}
          style={[
            styles.priorityBadge,
            {
              backgroundColor: withOpacity(priorityBadgeColor, 0.15),
              color: priorityBadgeColor,
            },
          ]}
        >
          {PRIORITY_LABELS[part.priority]}
        </Badge>
        <Text tone="accent">{formatMoney(part.estimatedCost, currency)}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  badge: {
    backgroundColor: colors.slate600,
    color: colors.white,
  },
  priorityBadge: {
    backgroundColor: colors.accent,
    color: colors.white,
    borderRadius: 8,
  },
  alignRight: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  gapXs: {
    gap: spacing.xs,
  },
});
