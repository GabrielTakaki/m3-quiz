import { useMutation } from '@tanstack/react-query';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

import { auth, db } from '@/lib/firebase';

export type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
};

async function registerUser(values: RegisterPayload) {
  const credential = await createUserWithEmailAndPassword(auth, values.email, values.password);

  if (credential.user) {
    await updateProfile(credential.user, { displayName: values.fullName });
    await setDoc(doc(db, 'users', credential.user.uid), {
      fullName: values.fullName,
      email: values.email,
      createdAt: serverTimestamp(),
    });
  }

  return credential.user;
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: registerUser,
  });
}
