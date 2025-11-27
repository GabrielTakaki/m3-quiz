import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { type QuizUnitDefinition } from '@/constants/quiz-data';
import { getUnitsWithItems } from '@/services/units-service';
import { useQuizStore } from '@/stores/quiz-store';

type UseUnitsOptions = {
  enabled?: boolean;
};

export function useUnits(options?: UseUnitsOptions) {
  const hydrateUnits = useQuizStore((state) => state.hydrateUnits);
  const isUnitsReady = useQuizStore((state) => state.isUnitsReady);

  const queryResult = useQuery<QuizUnitDefinition[]>({
    queryKey: ['units'],
    queryFn: getUnitsWithItems,
    staleTime: 1000 * 60 * 60, // 1 hora
    enabled: options?.enabled ?? true,
  });

  useEffect(() => {
    if (queryResult.data && !isUnitsReady) {
      hydrateUnits(queryResult.data);
    }
  }, [queryResult.data, hydrateUnits, isUnitsReady]);

  return queryResult;
}
