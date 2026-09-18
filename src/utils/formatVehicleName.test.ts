import { formatVehicleName } from './formatVehicleName';

describe('formatVehicleName', () => {
  const base = {
    year: 2015,
    make: 'Volkswagen',
    model: 'Polo',
    trim: 'GTI',
  };

  it('includes trim when present', () => {
    expect(formatVehicleName(base)).toBe('2015 Volkswagen Polo GTI');
  });

  it('omits empty trim', () => {
    expect(formatVehicleName({ ...base, trim: '' })).toBe(
      '2015 Volkswagen Polo',
    );
  });
});
