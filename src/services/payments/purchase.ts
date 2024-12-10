import { purchaseProduct, restoreProducts } from '@nativescript/payments';
import { PREMIUM_PRODUCT_ID } from './config';
import { PaymentTransaction, PaymentError } from './types';
import { updateSubscriptionStatus } from './status';
import { isNativeScript } from './platform';
import { mockPurchase, mockRestore } from './mock';

export async function purchasePremiumSubscription(userId: string): Promise<boolean> {
  try {
    let transaction: PaymentTransaction;

    if (!isNativeScript()) {
      transaction = await mockPurchase();
    } else {
      const result = await purchaseProduct(PREMIUM_PRODUCT_ID);
      if (!result.transactionId) {
        throw new Error('No transaction ID received');
      }

      transaction = {
        id: result.transactionId,
        productId: PREMIUM_PRODUCT_ID,
        purchaseDate: new Date(),
        isActive: true
      };
    }

    await updateSubscriptionStatus(userId, transaction);
    return true;
  } catch (error) {
    const paymentError = new Error('Purchase failed') as PaymentError;
    paymentError.code = 'purchase_failed';
    paymentError.details = error;
    throw paymentError;
  }
}

export async function restoreSubscriptions(userId: string): Promise<boolean> {
  try {
    let transaction: PaymentTransaction | null;

    if (!isNativeScript()) {
      transaction = await mockRestore();
    } else {
      const restoredProducts = await restoreProducts();
      const premiumProduct = restoredProducts.find(p => p.productId === PREMIUM_PRODUCT_ID);
      
      if (!premiumProduct?.transactionId) {
        return false;
      }

      transaction = {
        id: premiumProduct.transactionId,
        productId: PREMIUM_PRODUCT_ID,
        purchaseDate: new Date(),
        isActive: true
      };
    }

    if (!transaction) {
      return false;
    }

    await updateSubscriptionStatus(userId, transaction);
    return true;
  } catch (error) {
    const paymentError = new Error('Restore failed') as PaymentError;
    paymentError.code = 'restore_failed';
    paymentError.details = error;
    throw paymentError;
  }
}