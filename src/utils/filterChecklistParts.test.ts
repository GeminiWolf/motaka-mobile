import type { TrackedPart } from '../types';
import { getChecklistParts } from './filterChecklistParts';

function part(
  overrides: Partial<TrackedPart> & Pick<TrackedPart, 'id' | 'name'>,
): TrackedPart {
  return {
    vehicleId: 'v1',
    partNumber: overrides.id,
    category: 'Engine',
    priority: 'soon',
    status: 'needed',
    estimatedCost: 100,
    ...overrides,
  };
}

const parts: TrackedPart[] = [
  part({
    id: 'oil',
    name: 'Oil filter',
    partNumber: 'OF-1',
    category: 'Engine › Filters',
    priority: 'urgent',
    status: 'needed',
    estimatedCost: 250,
  }),
  part({
    id: 'pads',
    name: 'Brake pads',
    partNumber: 'BP-9',
    category: 'Brakes',
    priority: 'soon',
    status: 'sourcing',
    estimatedCost: 80,
  }),
  part({
    id: 'mat',
    name: 'Cabin mat',
    partNumber: 'CM-3',
    category: 'Interior',
    priority: 'someday',
    status: 'installed',
    estimatedCost: 40,
  }),
];

describe('getChecklistParts', () => {
  it('filters by search across name, part number, and category', () => {
    expect(
      getChecklistParts(parts, { query: 'filter' }).map(item => item.id),
    ).toEqual(['oil']);
    expect(
      getChecklistParts(parts, { query: 'bp-9' }).map(item => item.id),
    ).toEqual(['pads']);
    expect(
      getChecklistParts(parts, { query: 'interior' }).map(item => item.id),
    ).toEqual(['mat']);
  });

  it('filters by priority and status', () => {
    expect(
      getChecklistParts(parts, { priority: 'urgent' }).map(item => item.id),
    ).toEqual(['oil']);
    expect(
      getChecklistParts(parts, { status: 'sourcing' }).map(item => item.id),
    ).toEqual(['pads']);
  });

  it('sorts by priority, cost, or name', () => {
    expect(
      getChecklistParts(parts, { sort: 'priority' }).map(item => item.id),
    ).toEqual(['oil', 'pads', 'mat']);
    expect(
      getChecklistParts(parts, { sort: 'cost' }).map(item => item.id),
    ).toEqual(['mat', 'pads', 'oil']);
    expect(
      getChecklistParts(parts, { sort: 'name' }).map(item => item.id),
    ).toEqual(['pads', 'mat', 'oil']);
  });

  it('combines search, filters, and sort', () => {
    const mixed: TrackedPart[] = [
      ...parts,
      part({
        id: 'air',
        name: 'Air filter',
        partNumber: 'AF-2',
        category: 'Engine › Filters',
        priority: 'soon',
        status: 'needed',
        estimatedCost: 60,
      }),
    ];

    expect(
      getChecklistParts(mixed, {
        query: 'filter',
        status: 'needed',
        sort: 'cost',
      }).map(item => item.id),
    ).toEqual(['air', 'oil']);
  });
});
