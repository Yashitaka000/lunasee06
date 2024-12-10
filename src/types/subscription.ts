export interface StoreProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  localizedPrice: string;
}

export interface StoreTransaction {
  id: string;
  productId: string;
  purchaseDate: Date;
  isActive: boolean;
}

export interface SubscriptionState {
  isActive: boolean;
  expiryDate: Date | null;
  productId: string | null;
  lastTransactionId: string | null;
}