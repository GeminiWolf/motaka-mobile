import { useEffect, useMemo } from 'react';
import { useGarageStore } from '../store/garageStore';
import type { TrackedPart } from '../types';
import {
  getBudgetOverview,
  getBudgetPeriodSyncPatch,
  getCommittedSpend,
  type BudgetOverview,
} from '../utils/budgetStatus';

export function useBudgetOverview(parts: TrackedPart[]): BudgetOverview {
  const settings = useGarageStore(s => s.settings);
  const updateSettings = useGarageStore(s => s.updateSettings);
  const allTrackedParts = useGarageStore(s => s.trackedParts);

  const garageCommittedSpend = useMemo(
    () => getCommittedSpend(allTrackedParts),
    [allTrackedParts],
  );

  useEffect(() => {
    const patch = getBudgetPeriodSyncPatch(settings, garageCommittedSpend);
    if (patch != null) {
      updateSettings(patch);
    }
  }, [garageCommittedSpend, settings, updateSettings]);

  return useMemo(
    () => getBudgetOverview({ parts, settings }),
    [parts, settings],
  );
}
