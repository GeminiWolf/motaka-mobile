import { Platform } from 'react-native';
import type { AppSettings } from '../types';

export const STORAGE_KEY = 'garageforge.v1';

export function getDefaultApiBaseUrl(): string {
  if (!__DEV__) {
    return 'https://auto-v-backend-production.up.railway.app';
  }

  return Platform.OS === 'android'
    ? 'http://10.0.2.2:3000'
    : 'http://localhost:3000';
}

function currentBudgetPeriodKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function getDefaultSettings(): AppSettings {
  return {
    currency: 'ZAR',
    units: 'metric',
    monthlyBudget: 2000,
    budgetRollover: true,
    budgetCarryOver: 0,
    budgetPeriodKey: currentBudgetPeriodKey(),
    budgetPeriodCommittedBaseline: 0,
    spendingAlertThreshold: 80,
    region: 'AF',
    apiBaseUrl: getDefaultApiBaseUrl(),
    apiBearerToken: '',
    notificationsEnabled: false,
  };
}

export const YEAR_RANGE = { min: 2010, max: 2026 };
