import { PaymentProduct, PaymentTransaction } from './types';

const MOCK_PRODUCT: PaymentProduct = {
  id: 'com.lunasee.premium.monthly',
  title: 'プレミアムプラン',
  description: '月額プレミアムサブスクリプション',
  price: 1000,
  localizedPrice: '¥1,000'
};

export async function getMockProduct(): Promise<PaymentProduct> {
  return MOCK_PRODUCT;
}

export async function mockPurchase(): Promise<PaymentTransaction> {
  return {
    id: `mock_${Date.now()}`,
    productId: MOCK_PRODUCT.id,
    purchaseDate: new Date(),
    isActive: true
  };
}

export async function mockRestore(): Promise<PaymentTransaction | null> {
  // Web環境では購入履歴の復元をシミュレート
  return null;
}