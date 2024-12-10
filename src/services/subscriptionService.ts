import { db } from '../firebase/config';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { getCurrentDate } from '../utils/dateUtils';

// Web環境用のモックデータ
const mockProduct = {
  id: 'com.lunasee.premium.monthly',
  title: 'プレミアムプラン',
  description: '月額プレミアムサブスクリプション',
  price: 1000,
  localizedPrice: '¥1,000'
};

export async function initializePayments(): Promise<boolean> {
  return true;
}

export async function getPremiumProduct(): Promise<any> {
  return mockProduct;
}

export async function purchasePremium(userId: string): Promise<boolean> {
  try {
    const userProfileRef = doc(db, 'users', userId);
    const endDate = new Date(getCurrentDate());
    endDate.setMonth(endDate.getMonth() + 1);

    await setDoc(userProfileRef, {
      subscriptionStatus: 'premium',
      subscriptionEndDate: Timestamp.fromDate(endDate),
      lastTransactionId: `mock_${Date.now()}`,
      lastTransactionDate: Timestamp.now(),
      productId: mockProduct.id
    }, { merge: true });

    return true;
  } catch (error) {
    console.error('Failed to purchase premium:', error);
    return false;
  }
}

export async function restorePurchases(userId: string): Promise<boolean> {
  return false;
}