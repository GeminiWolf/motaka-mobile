import type {PartCategory} from '../types';

export function formatCategoryPath(path: PartCategory[]): string {
  return path.map(category => category.name).join(' › ');
}
