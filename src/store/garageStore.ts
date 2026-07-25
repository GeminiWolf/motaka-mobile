import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getDefaultSettings, STORAGE_KEY} from '../config';
import {setApiBearerToken} from '../services/api';
import {createId} from '../utils/createId';
import type {
  AppSettings,
  TrackedPart,
  Vehicle,
} from '../types';

type GarageState = {
  vehicles: Vehicle[];
  trackedParts: TrackedPart[];
  settings: AppSettings;
  activeVehicleId: string | null;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  setActiveVehicleId: (id: string | null) => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id'> & {id?: string}) => string;
  removeVehicle: (id: string) => void;
  addTrackedPart: (
    part: Omit<TrackedPart, 'id'> & {id?: string},
  ) => string;
  updateTrackedPart: (id: string, patch: Partial<TrackedPart>) => void;
  removeTrackedPart: (id: string) => void;
  updateSettings: (patch: Partial<AppSettings>) => void;
  clearGarage: () => void;
  partsForVehicle: (vehicleId: string) => TrackedPart[];
  getActiveVehicle: () => Vehicle | null;
};

export const useGarageStore = create<GarageState>()(
  persist(
    (set, get) => ({
      vehicles: [],
      trackedParts: [],
      settings: getDefaultSettings(),
      activeVehicleId: null,
      hasHydrated: false,

      setHasHydrated: value => set({hasHydrated: value}),

      setActiveVehicleId: id => set({activeVehicleId: id}),

      addVehicle: vehicle => {
        const id = vehicle.id ?? createId('veh');
        const next: Vehicle = {...vehicle, id};
        set(state => ({
          vehicles: [...state.vehicles, next],
          activeVehicleId: id,
        }));
        return id;
      },

      removeVehicle: id => {
        set(state => {
          const vehicles = state.vehicles.filter(v => v.id !== id);
          const trackedParts = state.trackedParts.filter(
            p => p.vehicleId !== id,
          );
          const activeVehicleId =
            state.activeVehicleId === id
              ? vehicles[0]?.id ?? null
              : state.activeVehicleId;
          return {vehicles, trackedParts, activeVehicleId};
        });
      },

      addTrackedPart: part => {
        const id = part.id ?? createId('part');
        const next: TrackedPart = {...part, id};
        set(state => ({trackedParts: [...state.trackedParts, next]}));
        return id;
      },

      updateTrackedPart: (id, patch) => {
        set(state => ({
          trackedParts: state.trackedParts.map(p =>
            p.id === id ? {...p, ...patch, id: p.id} : p,
          ),
        }));
      },

      removeTrackedPart: id => {
        set(state => ({
          trackedParts: state.trackedParts.filter(p => p.id !== id),
        }));
      },

      updateSettings: patch => {
        set(state => {
          const settings = {...state.settings, ...patch};
          setApiBearerToken(settings.apiBearerToken ?? '');
          return {settings};
        });
      },

      clearGarage: () => {
        set({
          vehicles: [],
          trackedParts: [],
          activeVehicleId: null,
        });
      },

      partsForVehicle: vehicleId =>
        get().trackedParts.filter(p => p.vehicleId === vehicleId),

      getActiveVehicle: () => {
        const {vehicles, activeVehicleId} = get();
        if (!activeVehicleId) {
          return vehicles[0] ?? null;
        }
        return vehicles.find(v => v.id === activeVehicleId) ?? vehicles[0] ?? null;
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        vehicles: state.vehicles,
        trackedParts: state.trackedParts,
        settings: state.settings,
        activeVehicleId: state.activeVehicleId,
      }),
      merge: (persisted, current) => {
        const stored = (persisted ?? {}) as Partial<GarageState>;
        return {
          ...current,
          ...stored,
          settings: {
            ...getDefaultSettings(),
            ...stored.settings,
          },
        };
      },
      onRehydrateStorage: () => state => {
        if (state) {
          setApiBearerToken(state.settings.apiBearerToken ?? '');
          state.setHasHydrated(true);
        }
      },
    },
  ),
);
