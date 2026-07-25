export type ProgressBarState = {
  fill: number;
  isOver: boolean;
};

export function getProgressBarState(
  value: number,
  max: number,
): ProgressBarState {
  const safeValue = Number.isFinite(value) ? Math.max(0, value) : 0;
  const safeMax = Number.isFinite(max) ? max : 0;

  if (safeMax <= 0) {
    return { fill: 0, isOver: safeValue > 0 };
  }

  const ratio = safeValue / safeMax;
  return {
    fill: Math.min(ratio, 1),
    isOver: ratio > 1,
  };
}
