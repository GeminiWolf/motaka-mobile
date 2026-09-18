import type { AppSettings, PartStatus, TrackedPart } from '../types/garage';
import { getBudgetParts, sumEstimatedCost } from './budgetPlanner';
import { isSpendingAlertActive } from './spendingAlerts';

const COMMITTED_STATUSES: PartStatus[] = ['ordered', 'installed'];

export type BudgetOverview = {
  totalNeeded: number;
  monthlyCap: number;
  overBy: number;
  remaining: number;
  isOverCap: boolean;
  usagePercent: number;
  isSpendingAlert: boolean;
};

export function getBudgetPeriodKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function getCommittedSpend(parts: TrackedPart[]): number {
  return parts
    .filter(part => COMMITTED_STATUSES.includes(part.status))
    .reduce(
      (sum, part) => sum + (part.actualCost ?? part.estimatedCost ?? 0),
      0,
    );
}

export function getEffectiveMonthlyCap(
  settings: Pick<
    AppSettings,
    'monthlyBudget' | 'budgetRollover' | 'budgetCarryOver'
  >,
): number {
  const monthly = Number.isFinite(settings.monthlyBudget)
    ? Math.max(0, settings.monthlyBudget)
    : 0;
  const carry =
    settings.budgetRollover && Number.isFinite(settings.budgetCarryOver)
      ? Math.max(0, settings.budgetCarryOver)
      : 0;
  return monthly + carry;
}

export function getBudgetPeriodSyncPatch(
  settings: Pick<
    AppSettings,
    | 'monthlyBudget'
    | 'budgetRollover'
    | 'budgetCarryOver'
    | 'budgetPeriodKey'
    | 'budgetPeriodCommittedBaseline'
  >,
  committedSpend: number,
  now: Date = new Date(),
): Partial<AppSettings> | null {
  const currentKey = getBudgetPeriodKey(now);
  if (settings.budgetPeriodKey === currentKey) {
    return null;
  }

  const safeCommitted = Number.isFinite(committedSpend)
    ? Math.max(0, committedSpend)
    : 0;
  const baseline = Number.isFinite(settings.budgetPeriodCommittedBaseline)
    ? Math.max(0, settings.budgetPeriodCommittedBaseline)
    : 0;
  const spendThisPeriod = Math.max(0, safeCommitted - baseline);
  const previousAvailable = getEffectiveMonthlyCap(settings);
  const unused = Math.max(0, previousAvailable - spendThisPeriod);

  return {
    budgetPeriodKey: currentKey,
    budgetCarryOver: settings.budgetRollover ? unused : 0,
    budgetPeriodCommittedBaseline: safeCommitted,
  };
}

export function getBudgetOverview(input: {
  parts: TrackedPart[];
  settings: Pick<
    AppSettings,
    | 'monthlyBudget'
    | 'budgetRollover'
    | 'budgetCarryOver'
    | 'spendingAlertThreshold'
  >;
}): BudgetOverview {
  const totalNeeded = sumEstimatedCost(getBudgetParts(input.parts));
  const monthlyCap = getEffectiveMonthlyCap(input.settings);
  const overBy = totalNeeded - monthlyCap;
  const remaining = monthlyCap - totalNeeded;
  const usagePercent =
    monthlyCap > 0 ? (totalNeeded / monthlyCap) * 100 : totalNeeded > 0 ? 100 : 0;

  return {
    totalNeeded,
    monthlyCap,
    overBy,
    remaining,
    isOverCap: overBy > 0,
    usagePercent,
    isSpendingAlert: isSpendingAlertActive(
      usagePercent,
      input.settings.spendingAlertThreshold,
    ),
  };
}
