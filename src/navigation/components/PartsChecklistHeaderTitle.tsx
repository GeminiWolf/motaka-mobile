import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { Text } from '../../components/common/Text';
import { useGarageStore } from '../../store/garageStore';
import type { GarageStackParamList } from '../types';
import { spacing } from '../../theme';

type Props = {
  route: RouteProp<GarageStackParamList, 'PartsChecklist'>;
};

export function PartsChecklistHeaderTitle({ route }: Props) {
  const vehicle = useGarageStore(s =>
    s.vehicles.find(v => v.id === route.params.vehicleId),
  );

  return (
    <View style={styles.container}>
      <Text size="lg" weight="semibold">
        {vehicle?.make} {vehicle?.model}
      </Text>
      <View>
        <Text size="sm" tone="accent">
          {vehicle?.year}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: spacing.lg,
  },
});
