import { useMemo } from 'react';

import { useAuth } from '@/contexts/auth-context';
import { getNextItemIndex } from '@/lib/progress-utils';
import { useStudentUnits } from '@/hooks/use-student-units';
import { useUnits } from '@/hooks/use-units';
import { useQuizStore } from '@/stores/quiz-store';
import { type StudentUnitProgress } from '@/services/student-units.service';

type UseUnitProgressResult = {
  progress: StudentUnitProgress | null;
  status: StudentUnitProgress['status'];
  nextItemIndex: number;
};

export function useUnitProgress(unitId?: string): UseUnitProgressResult {
  const { user } = useAuth();
  useUnits({ enabled: Boolean(user) });
  const { data: studentUnits } = useStudentUnits(user?.uid);
  const units = useQuizStore((state) => state.units);

  const progressByUnitId = useMemo(() => {
    if (!studentUnits) {
      return {};
    }

    return (studentUnits as any[]).reduce<Record<string, StudentUnitProgress>>((acc, item) => {
      acc[item.unitId] = item;
      return acc;
    }, {});
  }, [studentUnits]);

  const unit = unitId ? units[unitId] : undefined;
  const progress = unitId ? progressByUnitId[unitId] ?? null : null;
  const status: StudentUnitProgress['status'] = progress?.status ?? 'not-started';
  const nextItemIndex = unit ? getNextItemIndex(progress, unit.itemIds.length) : 0;

  return { progress, status, nextItemIndex };
}
