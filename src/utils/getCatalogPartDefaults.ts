import {CatalogPart} from '../types';

export function getCatalogPartDefaults(catalog: CatalogPart, category: string) {
  return {
    name: catalog.name,
    partNumber: catalog.id,
    category,
  };
}
