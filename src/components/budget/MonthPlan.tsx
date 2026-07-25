import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import type {CurrencyCode, TrackedPart} from '../../types';
import {suggestBuyOrder} from '../../utils/budgetPlanner';
import {formatMoney} from '../../utils/formatMoney';
import {colors, radius, spacing, typography} from '../../theme';
import {SectionHeader} from '../common/SectionHeader';
import {PriorityBadge} from '../parts/PriorityBadge';

type Props = {
  parts: TrackedPart[];
  currency: CurrencyCode;
};

export function MonthPlan({parts, currency}: Props) {
  const order = suggestBuyOrder(parts).slice(0, 8);

  return (
    <View style={styles.card}>
      <SectionHeader
        title="Buy first"
        subtitle="Urgent → soon → lower cost"
      />
      {order.length === 0 ? (
        <Text style={styles.empty}>Nothing pending in budget scope.</Text>
      ) : (
        order.map((part, index) => (
          <View key={part.id} style={styles.row}>
            <Text style={styles.index}>{index + 1}</Text>
            <View style={styles.body}>
              <Text style={styles.name}>{part.name}</Text>
              <View style={styles.metaRow}>
                <PriorityBadge priority={part.priority} />
                <Text style={styles.cost}>
                  {formatMoney(part.estimatedCost, currency)}
                </Text>
              </View>
            </View>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing.lg,
  },
  empty: {
    ...typography.body,
    color: colors.textMuted,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSubtle,
  },
  index: {
    ...typography.subtitle,
    color: colors.textDim,
    width: 28,
  },
  body: {
    flex: 1,
  },
  name: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  cost: {
    ...typography.caption,
    color: colors.accent,
  },
});
