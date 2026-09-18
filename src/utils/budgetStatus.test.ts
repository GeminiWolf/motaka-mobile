import {
  getBudgetPeriodKey,
  getBudgetPeriodSyncPatch,
  getEffectiveMonthlyCap,
} from './budgetStatus';

describe('getEffectiveMonthlyCap', () => {
  it('adds carry-over only when rollover is on', () => {
    expect(
      getEffectiveMonthlyCap({
        monthlyBudget: 1000,
        budgetRollover: false,
        budgetCarryOver: 250,
      }),
    ).toBe(1000);

    expect(
      getEffectiveMonthlyCap({
        monthlyBudget: 1000,
        budgetRollover: true,
        budgetCarryOver: 250,
      }),
    ).toBe(1250);
  });
});

describe('getBudgetPeriodSyncPatch', () => {
  it('returns null in the same month', () => {
    const now = new Date('2026-04-12T10:00:00');
    expect(
      getBudgetPeriodSyncPatch(
        {
          monthlyBudget: 1000,
          budgetRollover: false,
          budgetCarryOver: 0,
          budgetPeriodKey: getBudgetPeriodKey(now),
          budgetPeriodCommittedBaseline: 200,
        },
        200,
        now,
      ),
    ).toBeNull();
  });

  it('resets carry-over when rollover is off', () => {
    const now = new Date('2026-05-01T10:00:00');
    expect(
      getBudgetPeriodSyncPatch(
        {
          monthlyBudget: 1000,
          budgetRollover: false,
          budgetCarryOver: 400,
          budgetPeriodKey: '2026-04',
          budgetPeriodCommittedBaseline: 100,
        },
        300,
        now,
      ),
    ).toEqual({
      budgetPeriodKey: '2026-05',
      budgetCarryOver: 0,
      budgetPeriodCommittedBaseline: 300,
    });
  });
});
