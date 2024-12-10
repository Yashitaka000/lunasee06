import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { PaymentTransaction } from './types';
import { getCurrentDate } from '../../utils/dateUtils';

export async function updateSubscriptionStatus(
  userId: string, 
  transaction: PaymentTransaction
): Promise<void> {
  const userProfileRef = doc(db, 'users', userId);
  const endDate = new Date(getCurrentDate());
  endDate.setMonth(endDate.getMonth() + 1);

  await setDoc(userProfileRef, {
    subscriptionStatus: 'premium',
    subscriptionEndDate: Timestamp.fromDate(endDate),
    lastTransactionId: transaction.id,
    lastTransactionDate: Timestamp.fromDate(transaction.purchaseDate),
    productId: transaction.productId
  }, { merge: true });
}