import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { EmptyState } from '../../components/common/EmptyState';
import { Screen } from '../../components/common/Screen';
import { VehiclePartsWorkspace } from '../../components/parts/VehiclePartsWorkspace';
import type { GarageStackParamList } from '../../navigation/types';
import { useGarageStore } from '../../store/garageStore';
import { confirmRemoveVehicle } from '../../utils/confirmRemoveVehicle';
import { formatVehicleName } from '../../utils/formatVehicleName';

type Props = NativeStackScreenProps<GarageStackParamList, 'CarDashboard'>;

export function CarDashboardScreen({ navigation, route }: Props) {
  const { vehicleId } = route.params;
  const vehicle = useGarageStore(s => s.vehicles.find(v => v.id === vehicleId));
  const removeVehicle = useGarageStore(s => s.removeVehicle);

  if (!vehicle) {
    return (
      <Screen>
        <EmptyState
          title="This car isn’t in the garage"
          actionLabel="Back to garage"
          onAction={() => navigation.navigate('GarageHome')}
        />
      </Screen>
    );
  }

  return (
    <VehiclePartsWorkspace
      vehicleId={vehicleId}
      navigation={navigation}
      onRemoveVehicle={() => {
        confirmRemoveVehicle(formatVehicleName(vehicle), () => {
          removeVehicle(vehicleId);
          navigation.navigate('GarageHome');
        });
      }}
    />
  );
}
