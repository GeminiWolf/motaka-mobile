export function getListItemAccessibilityLabel(
  label: string,
  description?: string,
): string {
  if (description == null || description === '') {
    return label;
  }
  return `${label}, ${description}`;
}
