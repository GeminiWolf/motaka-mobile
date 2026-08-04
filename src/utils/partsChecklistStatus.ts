import type { PartStatus } from '../types';

export function statusFromChecklistChecked(checked: boolean): PartStatus {
  return checked ? 'installed' : 'needed';
}
