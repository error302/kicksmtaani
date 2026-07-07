// Shared types for KicksMtaani

export type Category = "MEN" | "WOMEN" | "KIDS" | "UNISEX";

export interface BrandDTO {
  id: string;
  name: string;
  slug: string;
  country: string | null;
  description: string | null;
  featured: boolean;
}

export interface ColorOption {
  name: string;
  hex: string;
}

export interface ProductDTO {
  id: string;
  name: string;
  slug: string;
  brandId: string;
  brandName: string;
  brandSlug: string;
  category: Category;
  description: string | null;
  basePrice: number;
  compareAt: number | null;
  images: string[];
  sizes: string[];
  colors: ColorOption[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isFeatured: boolean;
  isNew: boolean;
  tags: string[];
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  brandName: string;
  image: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
}

export interface OrderPayload {
  email: string;
  phone: string;
  fullName: string;
  address: string;
  city: string;
  notes?: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: "MPESA" | "CARD" | "CASH";
}
