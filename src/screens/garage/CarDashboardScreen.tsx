import React, { useMemo } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CirclePlus, ListChecks, Plus, Trash } from 'lucide-react-native';

import { EmptyState } from '../../components/common/EmptyState';
import { Screen } from '../../components/common/Screen';
import { TrackedPartRow } from '../../components/parts/TrackedPartRow';
import type { GarageStackParamList } from '../../navigation/types';
import { useGarageStore } from '../../store/garageStore';
import { prioritizeParts } from '../../utils/healthSummary';
import { colors, radius, spacing, typography } from '../../theme';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { formatMoney } from '../../utils/formatMoney';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Text } from '../../components/common/Text';
import { withOpacity } from '../../utils/withOpacity';
import { statusFromChecklistChecked } from '../../utils/partsChecklistStatus';
import { useBudgetOverview } from '../../hooks/useBudgetOverview';
import VehicleDashboardCard from '../../components/garage/VehicleDashboardCard';
import { Button } from '../../components/common/Button';

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

  const { isOverCap, isSpendingAlert } = useBudgetOverview(parts);

  const currency = settings.currency;

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
      <View style={styles.sideMargin}>
        <VehicleDashboardCard vehicle={vehicle} />
      </View>

      <View style={styles.sideMargin}>
        <Button
          leftIcon={<CirclePlus size={16} />}
          label="Add part"
          onPress={() => navigation.navigate('AddPart', { vehicleId })}
        />
      </View>

      <View style={styles.checklist}>
        <View style={[styles.row, styles.spaceBetween, styles.sidePadding]}>
          <View style={styles.row}>
            <ListChecks size={16} color={colors.accent} />
            <Text
              tone="white"
              size="lg"
              weight="semibold"
            >{`Parts Tracker (${parts.length})`}</Text>
          </View>
          <Pressable
            onPress={() => navigation.navigate('PartsChecklist', { vehicleId })}
          >
            <Text tone="accent">Manage</Text>
          </Pressable>
        </View>
        <FlatList
          keyExtractor={item => item.id}
          data={parts}
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
