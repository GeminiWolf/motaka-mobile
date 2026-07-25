import { parseHexColor } from './parseHexColor';

export function withOpacity(hex: string, opacity = 1): string {
  const rgb = parseHexColor(hex);
  if (rgb == null) {
    return hex;
  }

  const alpha = Number.isFinite(opacity)
    ? Math.min(1, Math.max(0, opacity))
    : 1;
  const [r, g, b] = rgb;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
