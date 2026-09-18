import React from 'react';
import { Text } from '../../components/common/Text';
import { useGarageStore } from '../../store/garageStore';
import { formatVehicleName } from '../../utils/formatVehicleName';

type Props = {
  vehicleId: string;
};

export function VehicleHeaderTitle({ vehicleId }: Props) {
  const vehicle = useGarageStore(s =>
    s.vehicles.find(v => v.id === vehicleId),
  );

  if (!vehicle) {
    return null;
  }

  return (
    <Text variant="subtitle" numberOfLines={1}>
      {formatVehicleName(vehicle)}
    </Text>
  );
}
