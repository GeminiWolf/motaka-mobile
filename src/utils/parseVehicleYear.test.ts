import { parseVehicleYear } from './parseVehicleYear';

describe('parseVehicleYear', () => {
  it('accepts a plausible year', () => {
    expect(parseVehicleYear('2015')).toBe(2015);
  });

  it('rejects empty and out-of-range values', () => {
    expect(parseVehicleYear('')).toBeNull();
    expect(parseVehicleYear('12.5')).toBeNull();
    expect(parseVehicleYear('1800')).toBeNull();
    expect(parseVehicleYear('2200')).toBeNull();
  });
});
