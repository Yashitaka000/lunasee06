import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc,
  query,
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from './config';
import { User, UserProfile } from '../types';

export async function createUserProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
  if (!userId) throw new Error('User ID is required');
  
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    ...data,
    createdAt: Timestamp.now()
  }, { merge: true });
}

export async function getUserDocument(userId: string): Promise<UserProfile | null> {
  if (!userId) return null;

  try {
    const userRef = doc(db, 'users', userId);
    const snapshot = await userRef.get();
    
    if (!snapshot.exists()) return null;
    
    const data = snapshot.data();
    return {
      ...data,
      subscriptionEndDate: data.subscriptionEndDate?.toDate()
    } as UserProfile;
  } catch (error) {
    console.error('Error fetching user document:', error);
    return null;
  }
}

export async function updateUserDocument(
  userId: string, 
  data: Partial<UserProfile>
): Promise<void> {
  if (!userId) throw new Error('User ID is required');

  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    ...data,
    updatedAt: Timestamp.now()
  }, { merge: true });
}

export async function deleteUserDocument(userId: string): Promise<void> {
  if (!userId) throw new Error('User ID is required');

  const userRef = doc(db, 'users', userId);
  await deleteDoc(userRef);
}