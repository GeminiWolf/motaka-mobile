import { parseHexColor } from './parseHexColor';

function clampChannel(value: number): number {
  return Math.min(255, Math.max(0, Math.round(value)));
}

function toHexChannel(value: number): string {
  return clampChannel(value).toString(16).padStart(2, '0');
}

export function lightenColor(hex: string, amount = 0.2): string {
  const rgb = parseHexColor(hex);
  if (!rgb) {
    return hex;
  }

  const t = Number.isFinite(amount) ? Math.min(1, Math.max(0, amount)) : 0;
  const [r, g, b] = rgb;

  return `#${toHexChannel(r + (255 - r) * t)}${toHexChannel(
    g + (255 - g) * t,
  )}${toHexChannel(b + (255 - b) * t)}`;
}
