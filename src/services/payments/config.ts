export const PREMIUM_PRODUCT_ID = 'com.lunasee.premium.monthly';

export const PAYMENT_CONFIG = {
  ios: {
    validateReceipt: true,
    sharedSecret: process.env.VITE_APP_STORE_SHARED_SECRET
  }
};