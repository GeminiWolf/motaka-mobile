import type { NavigatorScreenParams } from '@react-navigation/native';

export type RootTabParamList = {
  GarageTab: undefined;
  BudgetTab: undefined;
  SettingsTab: undefined;
};

export type GarageStackParamList = {
  GarageHome: NavigatorScreenParams<RootTabParamList> | undefined;
  AddVehicle: undefined;
  CarDashboard: { vehicleId: string };
  PartsTracker: { vehicleId: string };
  AddPart: { vehicleId: string };
  PartDetail: { partId: string };
  PartsChecklist: { vehicleId: string };
  FindPart: {
    vehicleId: string;
    partNumber?: string;
    category?: string;
    catalogPartId?: string;
  };
  BudgetCar: { vehicleId: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends GarageStackParamList {}
  }
}
