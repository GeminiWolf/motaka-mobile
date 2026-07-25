export type PartPriority = 'urgent' | 'soon' | 'someday';
export type PartStatus = 'needed' | 'sourcing' | 'ordered' | 'installed';
export type CurrencyCode = 'ZAR' | 'USD' | 'EUR';

export type Vehicle = {
  id: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  engine?: string;
  modelYearId: string;
  vin?: string;
};

export type TrackedPart = {
  id: string;
  vehicleId: string;
  catalogPartId?: string;
  name: string;
  partNumber: string;
  category: string;
  priority: PartPriority;
  status: PartStatus;
  estimatedCost: number;
  actualCost?: number;
  notes?: string;
  source?: string;
};

export type AppSettings = {
  currency: CurrencyCode;
  monthlyBudget: number;
  apiBaseUrl: string;
  apiBearerToken: string;
  notificationsEnabled: boolean;
};

export type Make = {id: string; name: string};
export type Model = {id: string; name: string; makeId: string};
export type ModelYear = {
  id: string;
  modelId: string;
  year: number;
};

export type PartCategory = {
  id: string;
  name: string;
  parentId?: string;
};

export type CatalogPart = {
  id: string;
  name: string;
  categoryId?: string;
};

export type GaragePersistState = {
  vehicles: Vehicle[];
  trackedParts: TrackedPart[];
  settings: AppSettings;
  activeVehicleId: string | null;
};
