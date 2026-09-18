import type { PartPriority, PartStatus, TrackedPart } from '../types';
import { prioritizeParts } from './healthSummary';

export type ChecklistSort = 'priority' | 'cost' | 'name';

export type ChecklistFilterOptions = {
  query?: string;
  priority?: PartPriority | 'all';
  status?: PartStatus | 'all';
  sort?: ChecklistSort;
};

export function filterChecklistParts(
  parts: TrackedPart[],
  options: ChecklistFilterOptions,
): TrackedPart[] {
  const query = options.query?.trim().toLowerCase() ?? '';
  const priority = options.priority ?? 'all';
  const status = options.status ?? 'all';

  return parts.filter(part => {
    if (priority !== 'all' && part.priority !== priority) {
      return false;
    }
    if (status !== 'all' && part.status !== status) {
      return false;
    }
    if (!query) {
      return true;
    }
    return (
      part.name.toLowerCase().includes(query) ||
      part.partNumber.toLowerCase().includes(query) ||
      part.category.toLowerCase().includes(query)
    );
  });
}

export function sortChecklistParts(
  parts: TrackedPart[],
  sort: ChecklistSort = 'priority',
): TrackedPart[] {
  if (sort === 'priority') {
    return prioritizeParts(parts);
  }
  if (sort === 'cost') {
    return [...parts].sort((a, b) => {
      const byCost = a.estimatedCost - b.estimatedCost;
      if (byCost !== 0) {
        return byCost;
      }
      return a.name.localeCompare(b.name);
    });
  }
  return [...parts].sort((a, b) => a.name.localeCompare(b.name));
}

export function getChecklistParts(
  parts: TrackedPart[],
  options: ChecklistFilterOptions,
): TrackedPart[] {
  return sortChecklistParts(
    filterChecklistParts(parts, options),
    options.sort ?? 'priority',
  );
}
