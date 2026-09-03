export type SheetPoint = 'full' | 'fit' | number;

export type SheetMetrics = {
  windowHeight: number;
  topInset: number;
  fitHeight: number;
};

export function normalizePoints(
  points: SheetPoint | SheetPoint[] | undefined,
): SheetPoint[] {
  if (points == null) {
    return ['fit'];
  }
  return Array.isArray(points) ? points : [points];
}

export function fullSheetHeight(metrics: SheetMetrics): number {
  return Math.max(0, metrics.windowHeight - metrics.topInset);
}

export function resolvePointHeight(
  point: SheetPoint,
  metrics: SheetMetrics,
): number {
  const full = fullSheetHeight(metrics);
  if (point === 'full') {
    return full;
  }
  if (point === 'fit') {
    return Math.min(Math.max(metrics.fitHeight, 0), full);
  }
  return Math.min(Math.max(point, 0), full);
}

export function resolvePointHeights(
  points: SheetPoint[],
  metrics: SheetMetrics,
): number[] {
  return points.map(point => resolvePointHeight(point, metrics));
}

export function snapTranslateY(sheetHeight: number, maxHeight: number): number {
  return Math.max(0, maxHeight - sheetHeight);
}

export function nearestSnapIndex(translateY: number, snapYs: number[]): number {
  if (snapYs.length === 0) {
    return 0;
  }
  let best = 0;
  let bestDist = Math.abs(snapYs[0] - translateY);
  for (let i = 1; i < snapYs.length; i += 1) {
    const dist = Math.abs(snapYs[i] - translateY);
    if (dist < bestDist) {
      best = i;
      bestDist = dist;
    }
  }
  return best;
}

export function pickReleaseTarget(
  translateY: number,
  snapYs: number[],
  velocityY: number,
  dismissThreshold: number,
): number | 'close' {
  if (snapYs.length === 0) {
    return 'close';
  }
  const lowestY = Math.max(...snapYs);
  const flungClosed = velocityY > 1.35 && translateY > lowestY - 24;
  if (translateY > lowestY + dismissThreshold || flungClosed) {
    return 'close';
  }
  if (velocityY < -0.85) {
    const higher = snapYs
      .map((y, i) => ({ y, i }))
      .filter(item => item.y < translateY - 8);
    if (higher.length > 0) {
      return higher.reduce((best, item) => (item.y > best.y ? item : best)).i;
    }
  }
  if (velocityY > 0.85) {
    const lower = snapYs
      .map((y, i) => ({ y, i }))
      .filter(item => item.y > translateY + 8);
    if (lower.length > 0) {
      return lower.reduce((best, item) => (item.y < best.y ? item : best)).i;
    }
  }
  return nearestSnapIndex(translateY, snapYs);
}
