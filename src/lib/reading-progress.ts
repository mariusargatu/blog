/**
 * Pure scroll-progress math, isolated from the DOM so it is unit-testable.
 * Returns a clamped fraction in [0, 1].
 */
export function computeProgress(
  scrollTop: number,
  scrollHeight: number,
  clientHeight: number,
): number {
  const scrollable = scrollHeight - clientHeight
  if (scrollable <= 0) return 0
  const ratio = scrollTop / scrollable
  if (Number.isNaN(ratio)) return 0
  return Math.min(1, Math.max(0, ratio))
}
