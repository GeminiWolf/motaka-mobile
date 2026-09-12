import type { PartCategoryOption } from '../types';

export function formatCategoryPath(path: PartCategoryOption[]): string {
  return path.map(category => category.name).join(' › ');
}
