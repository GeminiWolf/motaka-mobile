import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { Vehicle } from '../../types';
import { getVehicleHealth } from '../../utils/healthSummary';
import type { TrackedPart } from '../../types';
import { colors, layout, spacing, tabularNums } from '../../theme';
import { Text } from '../common/Text';
import { getBudgetParts, sumEstimatedCost } from '../../utils/budgetPlanner';
import { formatMoney } from '../../utils/formatMoney';
import { formatVehicleName } from '../../utils/formatVehicleName';
import { useGarageStore } from '../../store/garageStore';

type Props = {
  vehicle: Vehicle;
  parts: TrackedPart[];
  onPress: () => void;
  onLongPress?: () => void;
};

export function VehicleCard({ vehicle, parts, onPress, onLongPress }: Props) {
  const health = getVehicleHealth(parts);
  const title = formatVehicleName(vehicle);
  const meta = vehicle.engine ?? '';
  const currency = useGarageStore(s => s.settings.currency);
  const openParts = parts.filter(part => part.status !== 'installed');
  const totalEstimatedCost = sumEstimatedCost(getBudgetParts(parts));

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={400}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${health.summary}`}
      accessibilityHint="Opens this build. Touch and hold to remove."
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.body}>
        <Text variant="subtitle">{title}</Text>
        {meta ? (
          <Text size="sm" tone="muted">
            {meta}
          </Text>
        ) : null}
        <Text size="sm" tone="dim">
          {openParts.length === 0
            ? 'Nothing outstanding'
            : `${openParts.length} still needed`}
        </Text>
      </View>
      <Text tone="muted" style={tabularNums}>
        {formatMoney(totalEstimatedCost, currency)}
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
    gap: spacing.md,
  },
  pressed: {
    opacity: 0.72,
  },
  body: {
    flex: 1,
    gap: 2,
  },
});
