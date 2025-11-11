import { useMutation } from '@tanstack/react-query';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

import { auth, db } from '@/lib/firebase';

export type LoginPayload = {
  email: string;
  password: string;
};

async function loginUser(values: LoginPayload) {
  const credential = await signInWithEmailAndPassword(auth, values.email, values.password);

  await setDoc(
    doc(db, 'users', credential.user.uid),
    {
      lastLoginAt: serverTimestamp(),
    },
    { merge: true }
  );

  return credential.user;
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: loginUser,
  });
}
