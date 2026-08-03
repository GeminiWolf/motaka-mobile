import { Platform } from 'react-native';
import type { AppSettings } from '../types';

export const STORAGE_KEY = 'garageforge.v1';

export function getDefaultApiBaseUrl(): string {
  return Platform.OS === 'android'
    ? 'http://10.0.2.2:3000'
    : 'http://localhost:3000';
}

export function getDefaultSettings(): AppSettings {
  return {
    currency: 'ZAR',
    monthlyBudget: 2000,
    region: 'AF',
    apiBaseUrl: getDefaultApiBaseUrl(),
    apiBearerToken: '',
    notificationsEnabled: false,
  };
}

export const YEAR_RANGE = { min: 2010, max: 2026 };
