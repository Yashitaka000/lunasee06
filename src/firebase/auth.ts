import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  User
} from 'firebase/auth';
import { auth } from './config';

export interface AuthError {
  code: string;
  message: string;
}

export async function loginUser(email: string, password: string): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw formatAuthError(error);
  }
}

export async function registerUser(email: string, password: string): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw formatAuthError(error);
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw formatAuthError(error);
  }
}

function formatAuthError(error: any): AuthError {
  const errorCode = error.code || 'auth/unknown';
  let message: string;

  switch (errorCode) {
    case 'auth/invalid-email':
      message = 'メールアドレスの形式が正しくありません';
      break;
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      message = 'メールアドレスまたはパスワードが間違っています';
      break;
    case 'auth/email-already-in-use':
      message = 'このメールアドレスは既に使用されています';
      break;
    case 'auth/weak-password':
      message = 'パスワードは6文字以上で入力してください';
      break;
    default:
      message = 'エラーが発生しました。もう一度お試しください';
  }

  return { code: errorCode, message };
}