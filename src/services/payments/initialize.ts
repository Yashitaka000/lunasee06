import { initializePayments } from '@nativescript/payments';
import { PAYMENT_CONFIG } from './config';
import { PaymentError } from './types';
import { isNativeScript } from './platform';

export async function initializePaymentSystem(): Promise<boolean> {
  if (!isNativeScript()) {
    return true;
  }

  try {
    await initializePayments(PAYMENT_CONFIG);
    return true;
  } catch (error) {
    const paymentError = new Error('Failed to initialize payment system') as PaymentError;
    paymentError.code = 'init_failed';
    paymentError.details = error;
    throw paymentError;
  }
}