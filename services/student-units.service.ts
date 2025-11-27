import { collection, doc, getDocs, setDoc, Timestamp } from 'firebase/firestore';

import { db } from '@/lib/firebase';

export interface StudentUnitProgress {
  unitId: string;
  status: 'not-started' | 'in-progress' | 'completed';
  itemsCompleted: number;
  totalItems: number;
  answers: Record<
    string,
    {
      selectedOptionId: string | null;
      isCorrect: boolean | null;
    }
  >;
  updatedAt: Date;
}

function toDate(value: any): Date {
  if (value instanceof Timestamp) {
    return value.toDate();
  }

  if (value instanceof Date) {
    return value;
  }

  return new Date(0);
}

export async function getStudentUnitsProgress(userId: string): Promise<StudentUnitProgress[]> {
  const progressCollection = collection(db, 'students', userId, 'units');
  const snapshot = await getDocs(progressCollection);

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      unitId: data.unitId ?? docSnap.id,
      status: (data.status as StudentUnitProgress['status']) ?? 'not-started',
      itemsCompleted: data.itemsCompleted ?? 0,
      totalItems: data.totalItems ?? 0,
      answers: data.answers ?? {},
      updatedAt: toDate(data.updatedAt),
    };
  });
}

export async function updateUnitProgress(
  userId: string,
  unitId: string,
  data: Partial<StudentUnitProgress>
) {
  const docRef = doc(db, 'students', userId, 'units', unitId);
  await setDoc(
    docRef,
    {
      unitId,
      ...data,
      updatedAt: new Date(),
    },
    { merge: true }
  );
}

export async function saveAnswer(
  userId: string,
  unitId: string,
  itemId: string,
  selectedOptionId: string,
  isCorrect: boolean,
  itemsCompleted?: number
) {
  const docRef = doc(db, 'students', userId, 'units', unitId);

  await setDoc(
    docRef,
    {
      unitId,
      answers: {
        [itemId]: {
          selectedOptionId,
          isCorrect,
        },
      },
      ...(itemsCompleted !== undefined ? { itemsCompleted } : {}),
      updatedAt: new Date(),
    },
    { merge: true }
  );
}

export async function markUnitStarted(
  userId: string,
  unitId: string,
  totalItems: number
): Promise<void> {
  await updateUnitProgress(userId, unitId, {
    status: 'in-progress',
    itemsCompleted: 0,
    totalItems,
    answers: {},
  });
}

export async function markItemCompleted(
  userId: string,
  unitId: string,
  itemsCompleted: number
): Promise<void> {
  await updateUnitProgress(userId, unitId, {
    itemsCompleted,
  });
}

export async function markUnitCompleted(
  userId: string,
  unitId: string,
  totalItems: number
): Promise<void> {
  await updateUnitProgress(userId, unitId, {
    status: 'completed',
    itemsCompleted: totalItems,
    totalItems,
  });
}
