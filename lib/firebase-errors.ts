import { FirebaseError } from 'firebase/app';

const errorMessages: Record<string, string> = {
  'auth/email-already-in-use': 'Este email já está em uso.',
  'auth/invalid-email': 'O email informado é inválido.',
  'auth/wrong-password': 'Senha incorreta. Verifique e tente novamente.',
  'auth/user-not-found': 'Usuário não encontrado.',
  'auth/invalid-credential': 'Credenciais inválidas.',
  'auth/network-request-failed': 'Falha de conexão. Verifique sua internet.',
  'auth/too-many-requests': 'Muitas tentativas. Aguarde alguns instantes.',
  'permission-denied': 'Permissão negada. Verifique suas credenciais.',
};

export function getFirebaseErrorMessage(error: unknown) {
  if (error instanceof FirebaseError) {
    return errorMessages[error.code] ?? 'Não foi possível concluir a operação.';
  }

  return 'Não foi possível concluir a operação.';
}
