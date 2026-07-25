import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {EmptyState} from '../components/common/EmptyState';
import {Screen} from '../components/common/Screen';
import {SectionHeader} from '../components/common/SectionHeader';
import type {GarageStackParamList} from '../navigation/types';
import {useGarageStore} from '../store/garageStore';
import {colors, spacing, typography} from '../theme';

type Props = NativeStackScreenProps<GarageStackParamList, 'FindPart'>;

export function FindPartScreen({navigation, route}: Props) {
  const {vehicleId, partNumber} = route.params;
  const vehicle = useGarageStore(s => s.vehicles.find(v => v.id === vehicleId));

  return (
    <Screen scroll>
      <SectionHeader
        title="Find this part"
        subtitle={
          vehicle
            ? `${vehicle.year} ${vehicle.make} ${vehicle.model}${
                partNumber ? ` · #${partNumber}` : ''
              }`
            : 'Marketplace listings'
        }
      />
      <Text style={styles.hint}>
        Marketplace listings are not available on the current API.
      </Text>
      <EmptyState
        title="No listings endpoint"
        subtitle="Add listings to the backend to enable this screen."
        actionLabel="Go back"
        onAction={() => navigation.goBack()}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hint: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
});
