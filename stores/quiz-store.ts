import { create } from 'zustand';

import { type QuizItemDefinition, type QuizUnitDefinition } from '@/constants/quiz-data';

interface QuizItem extends QuizItemDefinition {
  unitId: string;
}

export interface QuizUnit extends Omit<QuizUnitDefinition, 'items'> {
  itemIds: string[];
}

export interface QuizResults {
  correct: number;
  total: number;
}

type QuizStatus = 'idle' | 'in-progress' | 'finished';

interface QuizState {
  unitOrder: string[];
  units: Record<string, QuizUnit>;
  items: Record<string, QuizItem>;
  activeUnitId?: string;
  currentIndex: number;
  answers: Record<string, string>;
  results?: QuizResults;
  status: QuizStatus;
  isUnitsReady: boolean;
  hydrateUnits: (definitions: QuizUnitDefinition[]) => void;
  startUnit: (unitId: string, startIndex?: number, initialAnswers?: Record<string, string>) => void;
  answerItem: (itemId: string, optionId: string) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  finishUnit: () => void;
  resetSession: () => void;
}

function normalizeUnits(quizUnits: QuizUnitDefinition[]) {
  const unitOrder = quizUnits.map((unit) => unit.id);

  const units: Record<string, QuizUnit> = {};
  const items: Record<string, QuizItem> = {};

  quizUnits.forEach((unit) => {
    const { items: unitItems, ...metadata } = unit;
    const itemIds: string[] = [];

    unitItems.forEach((item) => {
      const normalizedItem: QuizItem = {
        ...item,
        unitId: unit.id,
      };

      items[item.id] = normalizedItem;
      itemIds.push(item.id);
    });

    units[unit.id] = {
      ...metadata,
      itemIds,
    };
  });

  return { unitOrder, units, items };
}

export const useQuizStore = create<QuizState>((set, get) => ({
  unitOrder: [],
  units: {},
  items: {},
  activeUnitId: undefined,
  currentIndex: 0,
  answers: {},
  results: undefined,
  status: 'idle',
  isUnitsReady: false,
  hydrateUnits: (definitions) => {
    const normalized = normalizeUnits(definitions);

    set({
      ...normalized,
      activeUnitId: undefined,
      currentIndex: 0,
      answers: {},
      results: undefined,
      status: 'idle',
      isUnitsReady: true,
    });
  },
  startUnit: (unitId, startIndex = 0, initialAnswers = {}) => {
    const state = get();

    if (!state.units[unitId]) {
      return;
    }

    set({
      activeUnitId: unitId,
      currentIndex: Math.max(0, Math.min(startIndex, state.units[unitId].itemIds.length - 1)),
      answers: initialAnswers,
      results: undefined,
      status: 'in-progress',
    });
  },
  answerItem: (itemId, optionId) =>
    set((state) => ({
      answers: {
        ...state.answers,
        [itemId]: optionId,
      },
    })),
  goToNext: () =>
    set((state) => {
      if (!state.activeUnitId) {
        return {};
      }

      const unit = state.units[state.activeUnitId];
      const maxIndex = unit.itemIds.length - 1;
      const nextIndex = Math.min(state.currentIndex + 1, maxIndex);

      if (nextIndex === state.currentIndex) {
        return {};
      }

      return { currentIndex: nextIndex };
    }),
  goToPrevious: () =>
    set((state) => {
      const previousIndex = Math.max(state.currentIndex - 1, 0);

      if (previousIndex === state.currentIndex) {
        return {};
      }

      return { currentIndex: previousIndex };
    }),
  finishUnit: () => {
    const { activeUnitId } = get();
    if (!activeUnitId) {
      return;
    }

    const state = get();
    const unit = state.units[activeUnitId];

    const correct = unit.itemIds.reduce((count, itemId) => {
      const item = state.items[itemId];
      return count + (state.answers[itemId] === item.correctOptionId ? 1 : 0);
    }, 0);

    set({
      results: { correct, total: unit.itemIds.length },
      status: 'finished',
    });
  },
  resetSession: () =>
    set({
      activeUnitId: undefined,
      currentIndex: 0,
      answers: {},
      results: undefined,
      status: 'idle',
    }),
}));
