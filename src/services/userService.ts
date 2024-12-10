import { db } from '../firebase/config';
import { collection, doc, setDoc, getDocs, Timestamp, query, deleteDoc, getDoc } from 'firebase/firestore';
import { User, UserProfile } from '../types';
import { getCurrentDate } from '../utils/dateUtils';

export async function saveUser(userId: string, userData: User) {
  try {
    if (!userId) throw new Error('User ID is required');
    
    const userDocRef = doc(db, 'users', userId);
    const trackedUsersRef = doc(collection(userDocRef, 'trackedUsers'), userData.id);
    
    // Check subscription status before saving
    const userProfile = await getUserProfile(userId);
    const trackedUsers = await getTrackedUsers(userId);
    const userIndex = trackedUsers.findIndex(u => u.id === userData.id);
    
    const now = getCurrentDate();
    const isPremiumActive = userProfile?.subscriptionStatus === 'premium' && 
      userProfile?.subscriptionEndDate && userProfile.subscriptionEndDate > now;
    
    // Only check for premium if it's a new user or updating a premium user
    if (userIndex === -1 && trackedUsers.length >= 2 && !isPremiumActive) {
      throw new Error('premium_required');
    }

    // Allow updates to existing users regardless of position
    if (userIndex >= 2 && !isPremiumActive) {
      throw new Error('premium_required');
    }
    
    const firestoreData = {
      ...userData,
      lastPeriodStart: Timestamp.fromDate(userData.lastPeriodStart),
      createdAt: userIndex === -1 ? Timestamp.now() : trackedUsers[userIndex].createdAt,
      updatedAt: Timestamp.now()
    };
    
    await setDoc(trackedUsersRef, firestoreData);
    return true;
  } catch (error) {
    console.error('Error saving user:', error);
    throw error;
  }
}

export async function getTrackedUsers(userId: string): Promise<User[]> {
  try {
    if (!userId) return [];
    
    const userDocRef = doc(db, 'users', userId);
    const trackedUsersRef = collection(userDocRef, 'trackedUsers');
    const q = query(trackedUsersRef);
    const querySnapshot = await getDocs(q);
    
    const users = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        lastPeriodStart: data.lastPeriodStart.toDate(),
      } as User;
    });

    // Sort by creation date
    return users.sort((a: any, b: any) => {
      return a.createdAt.seconds - b.createdAt.seconds;
    });
  } catch (error) {
    console.error('Error getting tracked users:', error);
    return [];
  }
}

export async function deleteUser(userId: string, trackedUserId: string) {
  try {
    if (!userId) throw new Error('User ID is required');
    
    const userDocRef = doc(db, 'users', userId);
    const trackedUserRef = doc(collection(userDocRef, 'trackedUsers'), trackedUserId);
    await deleteDoc(trackedUserRef);
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    if (!userId) return null;
    
    const userProfileRef = doc(db, 'users', userId);
    const userProfileDoc = await getDoc(userProfileRef);
    
    if (userProfileDoc.exists()) {
      const data = userProfileDoc.data();
      return {
        subscriptionStatus: data.subscriptionStatus || 'free',
        subscriptionEndDate: data.subscriptionEndDate?.toDate()
      };
    }
    
    // Return default free profile if none exists
    return {
      subscriptionStatus: 'free'
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

export async function updateSubscription(userId: string, status: 'free' | 'premium') {
  try {
    if (!userId) throw new Error('User ID is required');
    
    const userProfileRef = doc(db, 'users', userId);
    const endDate = new Date(getCurrentDate());
    endDate.setDate(endDate.getDate() + 30); // 30日間の有効期限を設定
    
    await setDoc(userProfileRef, {
      subscriptionStatus: status,
      subscriptionEndDate: status === 'premium' ? Timestamp.fromDate(endDate) : null
    }, { merge: true });
    
    return true;
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
}

export async function cancelSubscription(userId: string) {
  try {
    if (!userId) throw new Error('User ID is required');
    
    const userProfileRef = doc(db, 'users', userId);
    const userProfile = await getUserProfile(userId);
    
    // 解約時はステータスをfreeに変更するが、有効期限は維持
    await setDoc(userProfileRef, {
      subscriptionStatus: 'free',
      subscriptionEndDate: userProfile?.subscriptionEndDate ? Timestamp.fromDate(userProfile.subscriptionEndDate) : null
    }, { merge: true });
    
    return true;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
}