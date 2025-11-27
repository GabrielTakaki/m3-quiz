import { type StudentUnitProgress } from '@/services/student-units.service';

export function getNextItemIndex(
  progress: StudentUnitProgress | null | undefined,
  totalItems: number
): number {
  if (!progress) {
    return 0;
  }

  const answeredCount = progress.answers
    ? Object.values(progress.answers).filter((ans) => ans?.selectedOptionId).length
    : 0;
  const effectiveCompleted = Math.max(progress.itemsCompleted ?? 0, answeredCount);

  if (progress.status === 'completed') {
    return 0;
  }

  if (totalItems <= 0) {
    return 0;
  }

  return Math.max(0, Math.min(effectiveCompleted, totalItems - 1));
}
