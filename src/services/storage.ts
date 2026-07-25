import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEY} from '../config';
import type {GaragePersistState} from '../types';

export async function loadGarageState(): Promise<GaragePersistState | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as GaragePersistState;
  } catch {
    return null;
  }
}

export async function saveGarageState(state: GaragePersistState): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export async function clearGarageState(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
