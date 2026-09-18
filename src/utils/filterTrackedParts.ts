import type { PartPriority, PartStatus, TrackedPart } from '../types';
import { prioritizeParts } from './healthSummary';

export type PartSortKey = 'priority' | 'cost' | 'name';

export type TrackedPartFilters = {
  priority: PartPriority | 'all';
  status: PartStatus | 'all';
  sort: PartSortKey;
};

function sortParts(parts: TrackedPart[], sort: PartSortKey): TrackedPart[] {
  if (sort === 'cost') {
    return [...parts].sort((a, b) => a.estimatedCost - b.estimatedCost);
  }
  if (sort === 'name') {
    return [...parts].sort((a, b) => a.name.localeCompare(b.name));
  }
  return prioritizeParts(parts);
}

export function filterAndSortTrackedParts(
  parts: TrackedPart[],
  { priority, status, sort }: TrackedPartFilters,
): TrackedPart[] {
  const filtered = parts.filter(part => {
    if (priority !== 'all' && part.priority !== priority) {
      return false;
    }
    if (status !== 'all' && part.status !== status) {
      return false;
    }
    return true;
  });
  return sortParts(filtered, sort);
}
