import {setApiBearerToken} from '../../services/api';
import {getDefaultSettings} from '../../config';
import {
  getBudgetPeriodSyncPatch,
  getCommittedSpend,
} from '../../utils/budgetStatus';
import type {GarageSlice, SettingsSlice} from '../types';

export const createSettingsSlice: GarageSlice<SettingsSlice> = (set, get) => ({
  settings: getDefaultSettings(),

  updateSettings: patch => {
    set(state => {
      const settings = {...state.settings, ...patch};
      setApiBearerToken(settings.apiBearerToken ?? '');
      return {settings};
    });
  },

  syncBudgetPeriod: () => {
    const {settings, trackedParts} = get();
    const patch = getBudgetPeriodSyncPatch(
      settings,
      getCommittedSpend(trackedParts),
    );
    if (patch == null) {
      return;
    }
    set({settings: {...settings, ...patch}});
  },
});
