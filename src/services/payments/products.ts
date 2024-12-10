import { getProducts } from '@nativescript/payments';
import { PREMIUM_PRODUCT_ID } from './config';
import { PaymentProduct, PaymentError } from './types';
import { isNativeScript } from './platform';
import { getMockProduct } from './mock';

export async function getPremiumProductDetails(): Promise<PaymentProduct | null> {
  try {
    if (!isNativeScript()) {
      return getMockProduct();
    }

    const products = await getProducts([PREMIUM_PRODUCT_ID]);
    return products[0] || null;
  } catch (error) {
    const paymentError = new Error('Failed to fetch product details') as PaymentError;
    paymentError.code = 'product_fetch_failed';
    paymentError.details = error;
    throw paymentError;
  }
}