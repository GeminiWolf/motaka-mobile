import type { PartStatus, TrackedPart } from '../types';
import { prioritizeParts } from './healthSummary';

const BUDGET_STATUSES: PartStatus[] = ['needed', 'sourcing'];

export function getBudgetParts(parts: TrackedPart[]): TrackedPart[] {
  return parts.filter(p => BUDGET_STATUSES.includes(p.status));
}

export function sumEstimatedCost(parts: TrackedPart[]): number {
  return parts.reduce((sum, p) => sum + (p.estimatedCost || 0), 0);
}

export function monthsUntilAffordable(
  totalNeeded: number,
  monthlyBudget: number,
): number | null {
  if (totalNeeded <= 0) {
    return 0;
  }
  if (!Number.isFinite(monthlyBudget) || monthlyBudget <= 0) {
    return null;
  }
  return Math.ceil(totalNeeded / monthlyBudget);
}

export function suggestBuyOrder(parts: TrackedPart[]): TrackedPart[] {
  return prioritizeParts(getBudgetParts(parts));
}
