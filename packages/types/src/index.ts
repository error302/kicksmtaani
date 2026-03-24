export type UserRole = 'CUSTOMER' | 'ADMIN' | 'SUPERADMIN';

export type ProductCategory = 'MEN' | 'WOMEN' | 'BOYS' | 'GIRLS' | 'KIDS';

export type OrderStatus = 
  | 'PENDING' 
  | 'CONFIRMED' 
  | 'SHIPPED' 
  | 'DELIVERED' 
  | 'CANCELLED' 
  | 'REFUNDED';

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export type PaymentProvider = 'MPESA' | 'STRIPE' | 'FLUTTERWAVE' | 'CASH';

export interface Address {
  name: string;
  phone: string;
  area: string;
  city: string;
  notes?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  meta?: {
    page: number;
    total: number;
    limit: number;
  };
  error?: {
    code: string;
    message: string;
    field?: string;
  };
}
