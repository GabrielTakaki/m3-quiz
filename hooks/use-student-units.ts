import { useQuery } from '@tanstack/react-query';

import { getStudentUnitsProgress } from '@/services/student-units.service';

export function useStudentUnits(userId?: string) {
  return useQuery({
    queryKey: ['student-units', userId],
    queryFn: () => getStudentUnitsProgress(userId as string),
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 60, // 1 hora
  });
}
