export interface PaymentProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  localizedPrice: string;
}

export interface PaymentTransaction {
  id: string;
  productId: string;
  purchaseDate: Date;
  isActive: boolean;
}

export interface PaymentError extends Error {
  code?: string;
  details?: any;
}