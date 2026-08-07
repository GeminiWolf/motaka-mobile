import ReactNativeBlobUtil from 'react-native-blob-util';

import type {
  CatalogPart,
  Make,
  Model,
  ModelYear,
  PartCategory,
} from '../types';
import type { GarageExportPayload } from '../utils/garageExport';
import {
  arrayBufferToBase64,
  buildVehicleExportFilename,
  parseContentDispositionFilename,
} from '../utils/garageExport';

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

type ApiMake = {id: number; name: string; created_at: string};
type ApiModel = {
  id: number;
  make_id: number;
  name: string;
  created_at: string;
};
type ApiModelYear = {
  id: number;
  model_id: number;
  year: number;
  created_at: string;
};
type ApiCategory = {
  id: number;
  name: string;
  parent_id: number | null;
  created_at: string;
};
type ApiPart = {
  id: number;
  name: string;
  category_id: number | null;
  created_at: string;
};

export function mapMake(raw: ApiMake): Make {
  return {id: String(raw.id), name: raw.name};
}

export function mapModel(raw: ApiModel): Model {
  return {
    id: String(raw.id),
    name: raw.name,
    makeId: String(raw.make_id),
  };
}

export function mapModelYear(raw: ApiModelYear): ModelYear {
  return {
    id: String(raw.id),
    modelId: String(raw.model_id),
    year: raw.year,
  };
}

export function mapCategory(raw: ApiCategory): PartCategory {
  return {
    id: String(raw.id),
    name: raw.name,
    parentId: raw.parent_id != null ? String(raw.parent_id) : undefined,
  };
}

export function mapPart(raw: ApiPart): CatalogPart {
  return {
    id: String(raw.id),
    name: raw.name,
    categoryId: raw.category_id != null ? String(raw.category_id) : undefined,
  };
}

let apiBearerToken = '';

export function normalizeBearerToken(token: string): string {
  const trimmed = token.trim();
  if (/^bearer\s+/i.test(trimmed)) {
    return trimmed.replace(/^bearer\s+/i, '').trim();
  }
  return trimmed;
}

export function setApiBearerToken(token: string): void {
  apiBearerToken = normalizeBearerToken(token);
}

export function getApiBearerToken(): string {
  return apiBearerToken;
}

export function buildRequestHeaders(
  init?: RequestInit,
  token: string = apiBearerToken,
): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (init?.body) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (init?.headers) {
    const extra = new Headers(init.headers);
    extra.forEach((value, key) => {
      headers[key] = value;
    });
  }
  return headers;
}

async function request<T>(
  baseUrl: string,
  path: string,
  init?: RequestInit,
): Promise<T> {
  const url = `${baseUrl.replace(/\/$/, '')}${path}`;
  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      headers: buildRequestHeaders(init),
    });
  } catch {
    throw new ApiError('Unable to reach API. Check the base URL and network.');
  }

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      if (body?.message) {
        message = Array.isArray(body.message)
          ? body.message.join(', ')
          : String(body.message);
      } else if (body?.error) {
        message = String(body.error);
      }
    } catch {
      // ignore parse errors
    }
    throw new ApiError(message, response.status);
  }

  return response.json() as Promise<T>;
}

export function getMakes(baseUrl: string, region: string): Promise<Make[]> {
  return request<ApiMake[]>(
    baseUrl,
    `/vehicles/makes?region=${encodeURIComponent(region)}`,
  ).then(rows => rows.map(mapMake));
}

export function getModels(baseUrl: string, makeId: string): Promise<Model[]> {
  return request<ApiModel[]>(
    baseUrl,
    `/vehicles/models?make_id=${encodeURIComponent(makeId)}`,
  ).then(rows => rows.map(mapModel));
}

export function getModelYears(
  baseUrl: string,
  modelId: string,
): Promise<ModelYear[]> {
  return request<ApiModelYear[]>(
    baseUrl,
    `/vehicles/years?model_id=${encodeURIComponent(modelId)}`,
  ).then(rows => rows.map(mapModelYear));
}

export function getCategories(
  baseUrl: string,
  parentId?: string,
): Promise<PartCategory[]> {
  const qs =
    parentId != null
      ? `?parent_id=${encodeURIComponent(parentId)}`
      : '';
  return request<ApiCategory[]>(baseUrl, `/categories${qs}`).then(rows =>
    rows.map(mapCategory),
  );
}

export function getParts(
  baseUrl: string,
  categoryId: string,
): Promise<CatalogPart[]> {
  return request<ApiPart[]>(
    baseUrl,
    `/parts?category_id=${encodeURIComponent(categoryId)}`,
  ).then(rows => rows.map(mapPart));
}

export async function probeApiHealth(
  baseUrl: string,
  bearerToken?: string,
): Promise<boolean> {
  try {
    const token =
      bearerToken !== undefined
        ? normalizeBearerToken(bearerToken)
        : apiBearerToken;
    const url = `${baseUrl.replace(/\/$/, '')}/health`;
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await fetch(url, { headers });
    if (!response.ok) {
      return false;
    }
    const result = (await response.json()) as {ok?: boolean};
    return result.ok === true;
  } catch {
    return false;
  }
}

export type VehiclePdfExportResult = {
  path: string;
  filename: string;
};

export async function exportVehiclePdf(
  baseUrl: string,
  payload: GarageExportPayload,
): Promise<VehiclePdfExportResult> {
  const vehicle = payload.vehicles[0];
  if (vehicle == null) {
    throw new ApiError('Export requires at least one vehicle.');
  }

  const fallbackFilename = buildVehicleExportFilename(vehicle);
  const url = `${baseUrl.replace(/\/$/, '')}/vehicles/export`;
  const body = JSON.stringify(payload);
  const headers = buildRequestHeaders({ body });
  headers.Accept = 'application/pdf';

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });
  } catch {
    throw new ApiError('Unable to reach API. Check the base URL and network.');
  }

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const errorBody = await response.json();
      if (errorBody?.message) {
        message = Array.isArray(errorBody.message)
          ? errorBody.message.join(', ')
          : String(errorBody.message);
      } else if (errorBody?.error) {
        message = String(errorBody.error);
      }
    } catch {
      // ignore parse errors
    }
    throw new ApiError(message, response.status);
  }

  const filename =
    parseContentDispositionFilename(
      response.headers.get('content-disposition'),
    ) ?? fallbackFilename;
  const buffer = await response.arrayBuffer();
  const path = `${ReactNativeBlobUtil.fs.dirs.CacheDir}/${filename}`;
  await ReactNativeBlobUtil.fs.writeFile(
    path,
    arrayBufferToBase64(buffer),
    'base64',
  );

  return { path, filename };
}
