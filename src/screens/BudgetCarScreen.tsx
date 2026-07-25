import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {BudgetSummary} from '../components/budget/BudgetSummary';
import {MonthPlan} from '../components/budget/MonthPlan';
import {EmptyState} from '../components/common/EmptyState';
import {Screen} from '../components/common/Screen';
import type {GarageStackParamList} from '../navigation/types';
import {useGarageStore} from '../store/garageStore';
import {formatMoney} from '../utils/formatMoney';
import {colors, radius, spacing, typography} from '../theme';
import { Text } from '../components/common/Text';
import { Card } from '../components/common/Card';

type Props = NativeStackScreenProps<GarageStackParamList, 'BudgetCar'>;

export function BudgetCarScreen({navigation, route}: Props) {
  const {vehicleId} = route.params;
  const vehicle = useGarageStore(s => s.vehicles.find(v => v.id === vehicleId));
  const trackedParts = useGarageStore(s => s.trackedParts);
  const settings = useGarageStore(s => s.settings);

  const parts = useMemo(
    () => trackedParts.filter(p => p.vehicleId === vehicleId),
    [trackedParts, vehicleId],
  );

  if (!vehicle) {
    return (
      <Screen>
        <EmptyState
          title="Vehicle not found"
          actionLabel="Back to garage"
          onAction={() => navigation.navigate('GarageHome')}
        />
      </Screen>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text size='lg' tone='accent'>Budget Planner</Text>
        <Text tone='white'>Manage monthly sourcing spend across your garage</Text>
      </View>
      <Card>
        
      </Card>
      <View style={styles.budgetNote}>
        <Text style={styles.budgetLabel}>Monthly garage budget</Text>
        <Text style={styles.budgetValue}>
          {formatMoney(settings.monthlyBudget, settings.currency)}
        </Text>
        <Text style={styles.budgetHint}>
          Edit this amount on the Budget tab or in Settings. It applies to all
          vehicles.
        </Text>
      </View>
      <BudgetSummary
        parts={parts}
        monthlyBudget={settings.monthlyBudget}
        currency={settings.currency}
      />
      <MonthPlan parts={parts} currency={settings.currency} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.lg,
  },
  headerContainer: {
    gap: spacing.sm,
  },
  budgetNote: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  budgetLabel: {
    ...typography.label,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  budgetValue: {
    ...typography.title,
    color: colors.accent,
  },
  budgetHint: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
});
