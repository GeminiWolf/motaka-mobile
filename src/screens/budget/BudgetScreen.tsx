import React, { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { EmptyState } from '../../components/common/EmptyState';
import { Input } from '../../components/common/Input';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Screen } from '../../components/common/Screen';
import { Text } from '../../components/common/Text';
import type {
  GarageStackParamList,
  RootTabParamList,
} from '../../navigation/types';
import { useBudgetOverview } from '../../hooks/useBudgetOverview';
import { useGarageStore } from '../../store/garageStore';
import { layout, spacing, tabularNums } from '../../theme';
import BudgetPartItem from '../../components/budget/BudgetPartItem';
import { suggestBuyOrder } from '../../utils/budgetPlanner';
import { formatMoney, getCurrencySymbol } from '../../utils/formatMoney';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabParamList, 'BudgetTab'>,
  NativeStackNavigationProp<GarageStackParamList>
>;

export function BudgetScreen() {
  const navigation = useNavigation<Nav>();
  const hasHydrated = useGarageStore(s => s.hasHydrated);
  const vehicles = useGarageStore(s => s.vehicles);
  const trackedParts = useGarageStore(s => s.trackedParts);
  const settings = useGarageStore(s => s.settings);
  const updateSettings = useGarageStore(s => s.updateSettings);
  const { totalNeeded, monthlyCap, remaining, isOverCap, isSpendingAlert, usagePercent } =
    useBudgetOverview(trackedParts);

  const neededParts = useMemo(
    () => suggestBuyOrder(trackedParts),
    [trackedParts],
  );

  const currency = settings.currency;

  const vehicleLabelById = useMemo(() => {
    const map = new Map<string, string>();
    for (const vehicle of vehicles) {
      map.set(vehicle.id, `${vehicle.make} ${vehicle.model}`);
    }
    return map;
  }, [vehicles]);

  if (!hasHydrated) {
    return <Screen loading />;
  }

  return (
    <View style={styles.container}>
      {vehicles.length === 0 ? (
        <EmptyState
          title="Nothing to budget yet"
          subtitle="Add a car first. This screen is for what still needs buying, against this month’s cap."
          actionLabel="Add vehicle"
          onAction={() => navigation.navigate('AddVehicle')}
        />
      ) : (
        <View style={styles.content}>
          <View style={styles.hero}>
            <Text variant="label" tone="muted">
              {isOverCap ? 'Over this month’s cap' : 'Left this month'}
            </Text>
            <Text variant="hero" style={tabularNums}>
              {formatMoney(Math.abs(remaining), currency)}
            </Text>
            <Text tone="muted">
              {formatMoney(totalNeeded, currency)} still to source
            </Text>
            <ProgressBar
              value={totalNeeded}
              max={monthlyCap}
              warning={isSpendingAlert && !isOverCap}
              accessibilityLabel="Amount still to source versus this month’s cap"
              style={styles.bar}
            />
            {isSpendingAlert && !isOverCap ? (
              <Text size="sm" tone="warning">
                {Math.round(usagePercent)}% of this month’s cap is spoken for
              </Text>
            ) : null}
          </View>

          <Input
            label="Monthly cap"
            keyboardType="decimal-pad"
            leftSection={getCurrencySymbol(currency)}
            value={String(settings.monthlyBudget)}
            onChangeText={v =>
              updateSettings({ monthlyBudget: Number(v) || 0 })
            }
            accessibilityLabel="Monthly budget"
          />

          <Text variant="label" tone="muted" style={styles.queueLabel}>
            Buy first
          </Text>
          <FlatList
            keyExtractor={item => item.id}
            data={neededParts}
            style={styles.list}
            ListEmptyComponent={
              <Text tone="muted">No open parts waiting on money.</Text>
            }
            renderItem={({ index, item }) => (
              <BudgetPartItem
                index={index + 1}
                part={item}
                vehicleLabel={vehicleLabelById.get(item.vehicleId) ?? ''}
                currency={currency}
                onPress={() =>
                  navigation.navigate('PartDetail', { partId: item.id })
                }
              />
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: layout.gutter,
    paddingTop: spacing.md,
  },
  content: {
    flex: 1,
    gap: spacing.lg,
  },
  hero: {
    gap: spacing.xs,
  },
  bar: {
    marginTop: spacing.sm,
  },
  queueLabel: {
    marginTop: spacing.sm,
  },
  list: {
    flex: 1,
  },
});
