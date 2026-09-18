import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Car, ChevronRight, Wrench } from 'lucide-react-native';
import type { Vehicle } from '../../types';
import { getVehicleHealth } from '../../utils/healthSummary';
import type { TrackedPart } from '../../types';
import { colors, radius, spacing, typography } from '../../theme';
import { Text } from '../common/Text';
import { Card } from '../common/Card';
import { Divider } from '../common/Divider';
import { getBudgetParts, sumEstimatedCost } from '../../utils/budgetPlanner';
import { formatMoney } from '../../utils/formatMoney';
import { useGarageStore } from '../../store/garageStore';

type Props = {
  vehicle: Vehicle;
  parts: TrackedPart[];
  onPress: () => void;
};

export function VehicleCard({ vehicle, parts, onPress }: Props) {
  const health = getVehicleHealth(parts);
  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
  const meta = [vehicle.trim, vehicle.engine].filter(Boolean).join(' · ');
  const currency = useGarageStore(s => s.settings.currency);
  const totalEstimatedCost = sumEstimatedCost(getBudgetParts(parts));

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${health.summary}`}
      accessibilityHint="Opens car dashboard"
      style={({ pressed }) => pressed && styles.pressed}
    >
      <Card style={styles.card} padding={spacing.xl}>
        <View style={styles.content}>
          <View style={styles.iconWrap} accessible={false}>
            <Car size={22} color={colors.accent} />
          </View>
          <View style={styles.body}>
            <Text style={styles.year}>{vehicle.year}</Text>
            <Text size="lg" weight="bold" style={styles.name}>
              {vehicle.make} {vehicle.model}
            </Text>
            {meta ? <Text style={styles.meta}>{meta}</Text> : null}
          </View>
          <ChevronRight size={18} color={colors.textDim} accessible={false} />
        </View>
        <Divider />
        <View style={[styles.footer, styles.row, styles.spaceBetween]}>
          <View style={styles.row}>
            <Wrench size={16} color={colors.accent} />
            <Text>{`${parts.length} parts needed`}</Text>
          </View>
          <View style={styles.costContent}>
            <Text size="xs">Estimated Cost</Text>
            <Text
              tone="accent"
              weight="semibold"
              style={styles.tabularNums}
            >
              {formatMoney(totalEstimatedCost, currency)}
            </Text>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  pressed: {
    opacity: 0.9,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.textDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  body: {
    flex: 1,
  },
  year: {
    ...typography.label,
    color: colors.accent,
    textTransform: 'uppercase',
  },
  name: {
    color: colors.white,
    marginTop: 2,
  },
  meta: {
    color: colors.graySoft,
    marginTop: 2,
  },
  health: {
    ...typography.caption,
    color: colors.textDim,
    marginTop: spacing.sm,
  },
  footer: {
    width: '100%',
  },
  costContent: {
    alignItems: 'flex-end',
    gap: 2,
  },
  tabularNums: {
    fontVariant: ['tabular-nums'],
  },
});
