import React, { useMemo } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ListChecks, Trash } from 'lucide-react-native';

import { EmptyState } from '../components/common/EmptyState';
import { Screen } from '../components/common/Screen';
import { TrackedPartRow } from '../components/parts/TrackedPartRow';
import type { GarageStackParamList } from '../navigation/types';
import { useGarageStore } from '../store/garageStore';
import { prioritizeParts } from '../utils/healthSummary';
import { colors, radius, spacing, typography } from '../theme';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { formatMoney } from '../utils/formatMoney';
import { ProgressBar } from '../components/common/ProgressBar';
import { Text } from '../components/common/Text';
import { withOpacity } from '../utils/withOpacity';
import { statusFromChecklistChecked } from '../utils/partsChecklistStatus';
import { useBudgetOverview } from '../hooks/useBudgetOverview';

type Props = NativeStackScreenProps<GarageStackParamList, 'CarDashboard'>;

export function CarDashboardScreen({ navigation, route }: Props) {
  const { vehicleId } = route.params;
  const vehicle = useGarageStore(s => s.vehicles.find(v => v.id === vehicleId));
  const trackedParts = useGarageStore(s => s.trackedParts);
  const updateTrackedPart = useGarageStore(s => s.updateTrackedPart);
  const settings = useGarageStore(s => s.settings);
  const removeVehicle = useGarageStore(s => s.removeVehicle);
  const parts = useMemo(
    () => trackedParts.filter(p => p.vehicleId === vehicleId),
    [trackedParts, vehicleId],
  );

  const {
    totalNeeded,
    monthlyCap,
    overBy,
    isOverCap,
    isSpendingAlert,
    usagePercent,
  } = useBudgetOverview(parts);

  const currency = settings.currency;
  const statusTone = isOverCap || isSpendingAlert ? 'warning' : 'accent';

  const checklist = useMemo(() => prioritizeParts(parts).slice(0, 3), [parts]);

  const handleRemoveVehicle = () => {
    Alert.alert(
      'Remove vehicle',
      'Are you sure you want to remove this vehicle?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', onPress: () => removeVehicle(vehicleId) },
      ],
    );
  };

  const handlePartCheckedChange = (partId: string, checked: boolean) => {
    updateTrackedPart(partId, { status: statusFromChecklistChecked(checked) });
  };

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
      <Card gap="md" backgroundColor="slate800" style={styles.sideMargin}>
        <View style={[styles.row, styles.spaceBetween]}>
          <View>
            <View style={styles.row}>
              <Badge
                label={vehicle.year?.toString() ?? ''}
                style={styles.yearBdage}
                tone="accent"
              />

              <Text size="lg" tone="slate">
                {vehicle.trim}
              </Text>
            </View>
            <Text size="2xl" weight="bold" tone="white">
              {vehicle.make} {vehicle.model}
            </Text>
          </View>
          <Pressable onPress={handleRemoveVehicle}>
            <View style={styles.dangerBox}>
              <Trash size={24} color={colors.danger} />
            </View>
          </Pressable>
        </View>
        <Card backgroundColor="slate900" gap="lg">
          <View style={[styles.row, styles.spaceBetween]}>
            <Text>Total Needed across garage</Text>
            <Text>{formatMoney(totalNeeded, settings.currency)}</Text>
          </View>
          <ProgressBar
            value={totalNeeded}
            max={monthlyCap}
            warning={isSpendingAlert && !isOverCap}
            accessibilityLabel="Budget used versus total cap"
          />
          <View style={[styles.row, styles.spaceBetween]}>
            <Text size="sm">
              Total Cap: {formatMoney(monthlyCap, currency)}
            </Text>
            <Text size="sm" tone={statusTone}>
              {isOverCap
                ? `${formatMoney(overBy, currency)} over monthly cap`
                : `${formatMoney(-overBy, currency)} remaining`}
            </Text>
          </View>
          {isSpendingAlert && !isOverCap ? (
            <Text size="sm" tone="warning">
              Spending alert: used {Math.round(usagePercent)}% of your budget
            </Text>
          ) : null}
        </Card>
      </Card>

      <View style={styles.checklist}>
        <View style={[styles.row, styles.spaceBetween, styles.sidePadding]}>
          <View style={styles.row}>
            <ListChecks size={16} color={colors.accent} />
            <Text
              tone="white"
              size="lg"
              weight="semibold"
            >{`Parts Checklist (${checklist.length})`}</Text>
          </View>
          <Pressable
            onPress={() => navigation.navigate('PartsChecklist', { vehicleId })}
          >
            <Text tone="dim">View All</Text>
          </Pressable>
        </View>
        <FlatList
          keyExtractor={item => item.id}
          data={checklist}
          contentContainerStyle={styles.checklistContent}
          renderItem={({ item }) => (
            <TrackedPartRow
              key={item.id}
              part={item}
              currency={currency}
              checkbox
              checked={item.status === 'installed'}
              onCheckedChange={checked =>
                handlePartCheckedChange(item.id, checked)
              }
              onPress={() =>
                navigation.navigate('PartDetail', { partId: item.id })
              }
            />
          )}
          ListEmptyComponent={
            <EmptyState
              title="No parts tracked yet"
              subtitle="Add the parts this car still needs."
              actionLabel="Add part"
              onAction={() => navigation.navigate('AddPart', { vehicleId })}
            />
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  sidePadding: {
    paddingHorizontal: spacing.lg,
  },
  sideMargin: {
    marginHorizontal: spacing.lg,
  },
  dangerBox: {
    backgroundColor: withOpacity(colors.danger, 0.1),
    borderColor: withOpacity(colors.danger, 0.25),
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.xs,
  },
  container: {
    flex: 1,
    paddingTop: spacing.lg,
    gap: spacing.lg,
  },
  yearBdage: {
    backgroundColor: withOpacity(colors.accent, 0.15),
    borderColor: withOpacity(colors.accent, 0.25),
    borderWidth: 1,
    color: colors.accent,
  },
  checklist: {
    flex: 1,
    gap: spacing.sm,
  },
  checklistContent: {
    marginTop: spacing.sm,
    marginHorizontal: spacing.lg,
  },
  year: {
    ...typography.label,
    color: colors.accent,
    textTransform: 'uppercase',
  },
  title: {
    ...typography.hero,
    color: colors.text,
  },
  meta: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  actions: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  actionBtn: {
    borderRadius: radius.md,
  },
  link: {
    ...typography.caption,
    color: colors.accent,
  },
});
