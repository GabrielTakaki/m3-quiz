import { type StudentUnitProgress } from '@/services/student-units.service';

export function getNextItemIndex(
  progress: StudentUnitProgress | null | undefined,
  totalItems: number
): number {
  if (!progress) {
    return 0;
  }

  if (progress.status === 'completed') {
    return 0;
  }

  if (totalItems <= 0) {
    return 0;
  }

  return Math.max(0, Math.min(progress.itemsCompleted, totalItems - 1));
}
