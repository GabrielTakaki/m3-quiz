import { collection, getDocs } from 'firebase/firestore';

import { type QuizItemDefinition, type QuizUnitDefinition } from '@/constants/quiz-data';
import { db } from '@/lib/firebase';

function mapItem(raw: any, fallbackId: string): QuizItemDefinition {
  const options = Array.isArray(raw.options)
    ? raw.options.map((option: any, idx: number) => ({
        id: option.id ?? `option-${idx}`,
        label: option.label ?? '',
      }))
    : [];

  return {
    id: raw.id ?? fallbackId,
    title: raw.title ?? '',
    prompt: raw.prompt ?? '',
    code: raw.code,
    options,
    correctOptionId: raw.correctOptionId ?? '',
    explanation: raw.explanation ?? '',
  };
}

export async function getUnitsWithItems(): Promise<QuizUnitDefinition[]> {
  const unitsSnapshot = await getDocs(collection(db, 'units'));

  const units = await Promise.all(
    unitsSnapshot.docs.map(async (unitDoc) => {
      const data = unitDoc.data();
      const itemsSnapshot = await getDocs(collection(unitDoc.ref, 'items'));

      const items = itemsSnapshot.docs.map((itemDoc, idx) =>
        mapItem(itemDoc.data(), `${unitDoc.id}-item-${idx}`)
      );

      return {
        id: data.id ?? unitDoc.id,
        title: data.title ?? '',
        description: data.description ?? '',
        ability: data.ability ?? '',
        difficulty: data.difficulty ?? 'Iniciante',
        introContent: Array.isArray(data.introContent) ? data.introContent : [],
        items,
      };
    })
  );

  return units;
}
