import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import type {CurrencyCode, TrackedPart} from '../../types';
import {
  monthsUntilAffordable,
  sumEstimatedCost,
  getBudgetParts,
} from '../../utils/budgetPlanner';
import {formatMoney} from '../../utils/formatMoney';
import {colors, radius, spacing, typography} from '../../theme';
import {SectionHeader} from '../common/SectionHeader';

type Props = {
  parts: TrackedPart[];
  monthlyBudget: number;
  currency: CurrencyCode;
};

export function BudgetSummary({parts, monthlyBudget, currency}: Props) {
  const budgetParts = getBudgetParts(parts);
  const total = sumEstimatedCost(budgetParts);
  const months = monthsUntilAffordable(total, monthlyBudget);

  return (
    <View style={styles.card}>
      <SectionHeader
        title="Budget snapshot"
        subtitle="Needed + sourcing estimates"
      />
      <Text style={styles.total}>{formatMoney(total, currency)}</Text>
      <Text style={styles.meta}>
        Monthly budget {formatMoney(monthlyBudget, currency)}
      </Text>
      <Text style={styles.meta}>
        {months == null
          ? 'Set a monthly budget to see timeline'
          : months === 0
            ? 'Covered by current budget'
            : `~${months} month${months === 1 ? '' : 's'} until affordable`}
      </Text>
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
    marginBottom: spacing.lg,
  },
  total: {
    ...typography.hero,
    color: colors.accent,
  },
  meta: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});
