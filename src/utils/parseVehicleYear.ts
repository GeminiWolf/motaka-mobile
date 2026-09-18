export function parseVehicleYear(value: string): number | null {
  const year = Number(value.trim());
  if (!Number.isInteger(year) || year < 1900 || year > 2100) {
    return null;
  }
  return year;
}
