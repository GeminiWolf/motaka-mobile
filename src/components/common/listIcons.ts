import * as LucideIcons from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

type LucideModule = typeof LucideIcons;

export type ListIconName = {
  [K in keyof LucideModule]: LucideModule[K] extends LucideIcon ? K : never;
}[keyof LucideModule];

export function getListIcon(name: ListIconName): LucideIcon {
  return LucideIcons[name] as LucideIcon;
}
