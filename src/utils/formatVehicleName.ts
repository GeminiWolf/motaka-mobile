import type { Vehicle } from '../types';

export function formatVehicleName(
  vehicle: Pick<Vehicle, 'year' | 'make' | 'model' | 'trim'>,
): string {
  return [vehicle.year, vehicle.make, vehicle.model, vehicle.trim]
    .map(part => String(part ?? '').trim())
    .filter(part => part !== '')
    .join(' ');
}
