# Phase 3: Storefront (Frontend) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build complete customer-facing Next.js storefront with all pages, cart, checkout, auth, and account dashboard.

**Architecture:** Next.js 14 App Router with server components for SEO. Client components for interactivity. Zustand for cart state. React Query for API data fetching.

**Tech Stack:** Next.js 14, React 18, Tailwind CSS, Zustand, React Query, Lucide React

---

## File Structure

```
apps/web/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (exists)
│   │   ├── page.tsx                # Homepage (exists)
│   │   ├── globals.css             # Global styles (exists)
│   │   ├── products/
│   │   │   ├── page.tsx             # Product listing
│   │   │   └── [slug]/page.tsx      # Product detail
│   │   ├── category/[category]/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── checkout/
│   │   │   ├── page.tsx             # Checkout flow
│   │   │   └── success/page.tsx
│   │   ├── search/page.tsx
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── forgot-password/page.tsx
│   │   └── account/
│   │       ├── page.tsx             # Account dashboard
│   │       ├── orders/page.tsx
│   │       └── profile/page.tsx
│   ├── components/
│   │   ├── ui/                      # shadcn-like components
│   │   ├── layout/                  # Header, Footer
│   │   ├── products/                 # Product cards, gallery
│   │   ├── cart/                    # Cart slide-over
│   │   └── checkout/                # Checkout steps
│   ├── lib/
│   │   ├── api.ts                   # API client
│   │   ├── store.ts                 # Zustand stores
│   │   └── utils.ts                 # Helpers
│   └── hooks/                       # Custom React hooks
```

---

## Tasks

### Task 1: Set Up React Query & API Client

**Files:**

- Create: `apps/web/src/lib/api.ts`
- Create: `apps/web/src/lib/providers.tsx`
- Modify: `apps/web/src/app/layout.tsx`

- [ ] **Step 1: Install dependencies**

Run: `cd apps/web && pnpm add @tanstack/react-query axios`

- [ ] **Step 2: Create apps/web/src/lib/api.ts**

```typescript
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// Products
export const getProducts = (params?: any) =>
  api.get("/products", { params }).then((r) => r.data);
export const getProduct = (slug: string) =>
  api.get(`/products/${slug}`).then((r) => r.data);
export const searchProducts = (q: string, params?: any) =>
  api.get("/products/search", { params: { q, ...params } }).then((r) => r.data);

// Auth
export const login = (data: any) =>
  api.post("/auth/login", data).then((r) => r.data);
export const register = (data: any) =>
  api.post("/auth/register", data).then((r) => r.data);
export const getProfile = () => api.get("/auth/me").then((r) => r.data);
export const refreshToken = () => api.post("/auth/refresh").then((r) => r.data);

// Orders
export const createOrder = (data: any) =>
  api.post("/orders", data).then((r) => r.data);
export const getOrders = () => api.get("/orders").then((r) => r.data);
export const getOrder = (id: string) =>
  api.get(`/orders/${id}`).then((r) => r.data);
```

- [ ] **Step 3: Create apps/web/src/lib/providers.tsx**

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

- [ ] **Step 4: Update apps/web/src/app/layout.tsx**

```typescript
import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/lib/providers';

export const metadata: Metadata = {
  title: 'KicksMtaani - Premium Shoes in Kenya',
  description: 'Shop the best shoes for the whole family. Men, Women, Kids - Free delivery in Nairobi & Mombasa.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/lib/ apps/web/src/app/layout.tsx && git commit -m "feat(web): add API client and React Query providers"
```

---

### Task 2: Create Cart Store (Zustand)

**Files:**

- Create: `apps/web/src/lib/store.ts`

- [ ] **Step 1: Install zustand**

Run: `cd apps/web && pnpm add zustand`

- [ ] **Step 2: Create apps/web/src/lib/store.ts**

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  variantId: string;
  productId: string;
  name: string;
  size: string;
  color?: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const items = get().items;
        const existing = items.find((i) => i.variantId === item.variantId);

        if (existing) {
          set({
            items: items.map((i) =>
              i.variantId === item.variantId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i,
            ),
          });
        } else {
          set({ items: [...items, item] });
        }
      },

      removeItem: (variantId) => {
        set({ items: get().items.filter((i) => i.variantId !== variantId) });
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((i) => i.variantId !== variantId) });
        } else {
          set({
            items: get().items.map((i) =>
              i.variantId === variantId ? { ...i, quantity } : i,
            ),
          });
        }
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set({ isOpen: !get().isOpen }),

      setCartOpen: (open) => set({ isOpen: open }),

      getTotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );
      },
    }),
    {
      name: "kicksmtaani-cart",
    },
  ),
);

// Auth store
interface AuthStore {
  user: any | null;
  token: string | null;
  setUser: (user: any, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user, token) => {
        localStorage.setItem("accessToken", token);
        set({ user, token });
      },
      logout: () => {
        localStorage.removeItem("accessToken");
        set({ user: null, token: null });
      },
    }),
    {
      name: "kicksmtaani-auth",
    },
  ),
);
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/lib/store.ts && git commit -m "feat(web): add Zustand cart and auth stores"
```

---

### Task 3: Create Layout Components (Header, Footer)

**Files:**

- Create: `apps/web/src/components/layout/Header.tsx`
- Create: `apps/web/src/components/layout/Footer.tsx`
- Create: `apps/web/src/components/layout/index.ts`

- [ ] **Step 1: Create apps/web/src/components/layout/Header.tsx**

```typescript
'use client';

import Link from 'next/link';
import { ShoppingCart, Search, Menu, User } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { useState } from 'react';

export function Header() {
  const { items, toggleCart } = useCartStore();
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-primary">
            KicksMtaani
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/products?category=MEN" className="hover:text-primary">Men</Link>
            <Link href="/products?category=WOMEN" className="hover:text-primary">Women</Link>
            <Link href="/products?category=BOYS" className="hover:text-primary">Boys</Link>
            <Link href="/products?category=GIRLS" className="hover:text-primary">Girls</Link>
            <Link href="/products?category=KIDS" className="hover:text-primary">Kids</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link href="/search" className="p-2 hover:text-primary">
              <Search className="w-5 h-5" />
            </Link>
            <Link href="/account" className="p-2 hover:text-primary hidden md:block">
              <User className="w-5 h-5" />
            </Link>
            <button onClick={toggleCart} className="p-2 hover:text-primary relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 md:hidden">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              <Link href="/products?category=MEN" onClick={() => setMobileMenuOpen(false)}>Men</Link>
              <Link href="/products?category=WOMEN" onClick={() => setMobileMenuOpen(false)}>Women</Link>
              <Link href="/products?category=KIDS" onClick={() => setMobileMenuOpen(false)}>Kids</Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Create apps/web/src/components/layout/Footer.tsx**

```typescript
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">KicksMtaani</h3>
            <p className="text-gray-400">Premium shoes for the whole family in Kenya.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <div className="flex flex-col gap-2 text-gray-400">
              <Link href="/products?category=MEN">Men</Link>
              <Link href="/products?category=WOMEN">Women</Link>
              <Link href="/products?category=KIDS">Kids</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <div className="flex flex-col gap-2 text-gray-400">
              <Link href="/contact">Contact Us</Link>
              <Link href="/faq">FAQ</Link>
              <Link href="/shipping">Shipping Info</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="text-gray-400">
              <p>Nairobi, Kenya</p>
              <p>info@kicksmtaani.co.ke</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          © 2024 KicksMtaani. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Create apps/web/src/components/layout/index.ts**

```typescript
export { Header } from "./Header";
export { Footer } from "./Footer";
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/components/layout/ && git commit -m "feat(web): add Header and Footer components"
```

---

### Task 4: Create Cart Slide-Over Component

**Files:**

- Create: `apps/web/src/components/cart/CartSidebar.tsx`

- [ ] **Step 1: Create apps/web/src/components/cart/CartSidebar.tsx**

```typescript
'use client';

import { useCartStore } from '@/lib/store';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

export function CartSidebar() {
  const { items, isOpen, setCartOpen, updateQuantity, removeItem, getTotal } = useCartStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={() => setCartOpen(false)} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
            <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-gray-100 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Your cart is empty
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.variantId} className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      <p className="text-gray-500 text-sm">Size: {item.size}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="font-medium">KES {item.price.toLocaleString()}</span>
                      </div>
                    </div>
                    <button onClick={() => removeItem(item.variantId)} className="text-gray-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t p-4">
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-lg font-semibold">KES {getTotal().toLocaleString()}</span>
              </div>
              <Link
                href="/checkout"
                onClick={() => setCartOpen(false)}
                className="block w-full bg-primary text-white text-center py-3 rounded-lg font-medium hover:bg-primary-dark"
              >
                Proceed to Checkout
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/components/cart/ && git commit -m "feat(web): add cart slide-over component"
```

---

### Task 5: Update Root Layout with Header/Footer/Cart

**Files:**

- Modify: `apps/web/src/app/layout.tsx`

- [ ] **Step 1: Update layout.tsx**

```typescript
import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/lib/providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartSidebar } from '@/components/cart/CartSidebar';

export const metadata: Metadata = {
  title: 'KicksMtaani - Premium Shoes in Kenya',
  description: 'Shop the best shoes for the whole family.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CartSidebar />
        </Providers>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/app/layout.tsx && git commit -m "feat(web): integrate layout components into root layout"
```

---

### Task 6: Create Homepage

**Files:**

- Modify: `apps/web/src/app/page.tsx`

- [ ] **Step 1: Update homepage**

```typescript
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getProducts } from '@/lib/api';

export default async function HomePage() {
  const products = await getProducts({ limit: 8 });

  const categories = [
    { name: 'Men', slug: 'MEN', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
    { name: 'Women', slug: 'WOMEN', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400' },
    { name: 'Boys', slug: 'BOYS', image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400' },
    { name: 'Girls', slug: 'GIRLS', image: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400' },
    { name: 'Kids', slug: 'KIDS', image: 'https://images.unsplash.com/photo-1595950653106-6c9eb2fad643?w=400' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-black text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Premium Shoes for the <span className="text-primary">Whole Family</span>
            </h1>
            <p className="text-gray-300 text-lg mb-8">
              Shop the best Nike, Adidas, and local brands. Free delivery in Nairobi & Mombasa.
            </p>
            <div className="flex gap-4">
              <Link href="/products" className="bg-primary px-6 py-3 rounded-lg font-medium hover:bg-primary-dark inline-flex items-center gap-2">
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/products?category=KIDS" className="border border-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-black">
                Kids Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/products?category=${cat.slug}`} className="group">
                <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden mb-2">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                </div>
                <h3 className="font-medium text-center">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">New Arrivals</h2>
            <Link href="/products" className="text-primary hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.data?.slice(0, 8).map((product: any) => (
              <Link key={product.id} href={`/products/${product.slug}`} className="group">
                <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden mb-3">
                  <img
                    src={product.images?.[0] || 'https://via.placeholder.com/400'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>
                <h3 className="font-medium text-sm mb-1">{product.name}</h3>
                <p className="text-gray-500 text-sm">{product.brand}</p>
                <p className="text-primary font-semibold">KES {Number(product.basePrice).toLocaleString()}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/app/page.tsx && git commit -m "feat(web): create homepage with hero, categories, and products"
```

---

### Task 7: Create Products Listing Page

**Files:**

- Create: `apps/web/src/app/products/page.tsx`

- [ ] **Step 1: Create apps/web/src/app/products/page.tsx**

```typescript
'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getProducts } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  const { data, isLoading } = useQuery({
    queryKey: ['products', category],
    queryFn: () => getProducts({ category }),
  });

  const products = data?.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {category ? `${category} Shoes` : 'All Products'}
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-semibold mb-4">Filters</h3>

            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Category</h4>
              <div className="space-y-2">
                {['MEN', 'WOMEN', 'BOYS', 'GIRLS', 'KIDS'].map((cat) => (
                  <Link
                    key={cat}
                    href={`/products?category=${cat}`}
                    className={`block text-sm ${category === cat ? 'text-primary font-medium' : 'text-gray-600'}`}
                  >
                    {cat.charAt(0) + cat.slice(1).toLowerCase()}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="text-center py-12">Loading...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No products found</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product: any) => (
                <Link key={product.id} href={`/products/${product.slug}`} className="group">
                  <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden mb-3">
                    <img
                      src={product.images?.[0] || 'https://via.placeholder.com/400'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <h3 className="font-medium text-sm mb-1">{product.name}</h3>
                  <p className="text-gray-500 text-sm">{product.brand}</p>
                  <p className="text-primary font-semibold">KES {Number(product.basePrice).toLocaleString()}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/app/products/ && git commit -m "feat(web): create products listing page with filters"
```

---

### Task 8: Create Product Detail Page

**Files:**

- Create: `apps/web/src/app/products/[slug]/page.tsx`

- [ ] **Step 1: Create product detail page**

```typescript
'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getProduct } from '@/lib/api';
import { useCartStore } from '@/lib/store';
import { useState } from 'react';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { addItem, setCartOpen } = useCartStore();
  const [selectedSize, setSelectedSize] = useState('');

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProduct(slug),
  });

  if (isLoading) return <div className="container mx-auto px-4 py-8">Loading...</div>;
  if (!product?.data) return <div className="container mx-auto px-4 py-8">Product not found</div>;

  const p = product.data;

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    const variant = p.variants?.find((v: any) => v.size === selectedSize);

    addItem({
      variantId: variant?.id,
      productId: p.id,
      name: p.name,
      size: selectedSize,
      price: Number(variant?.priceOverride || p.basePrice),
      quantity: 1,
      image: p.images?.[0] || '',
    });

    setCartOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
          <img
            src={p.images?.[0] || 'https://via.placeholder.com/600'}
            alt={p.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{p.name}</h1>
          <p className="text-gray-500 mb-4">{p.brand}</p>
          <p className="text-2xl text-primary font-bold mb-6">
            KES {Number(p.basePrice).toLocaleString()}
          </p>

          {/* Size Selector */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Select Size</h3>
            <div className="flex flex-wrap gap-2">
              {p.variants?.map((v: any) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedSize(v.size)}
                  className={`px-4 py-2 border rounded-lg ${
                    selectedSize === v.size
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-300 hover:border-primary'
                  }`}
                >
                  {v.size}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark mb-4"
          >
            Add to Cart
          </button>

          <div className="text-gray-600 text-sm space-y-2">
            <p>✓ Free delivery in Nairobi & Mombasa</p>
            <p>✓ 7-day return policy</p>
            <p>✓ Original products guaranteed</p>
          </div>
        </div>
      </div>

      {/* Description */}
      {p.description && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Description</h2>
          <p className="text-gray-600">{p.description}</p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/app/products/\[slug\]/ && git commit -m "feat(web): create product detail page with size selector"
```

---

### Task 9: Create Auth Pages (Login, Register)

**Files:**

- Create: `apps/web/src/app/auth/login/page.tsx`
- Create: `apps/web/src/app/auth/register/page.tsx`

- [ ] **Step 1: Create login page**

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);

    try {
      const result = await login({
        email: formData.get('email'),
        password: formData.get('password'),
      });

      setUser(result.data.user, result.data.accessToken);
      router.push('/account');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-8">Sign In</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">{error}</div>}

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="text-primary hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create register page**

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { register } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);

    try {
      const result = await register({
        email: formData.get('email'),
        password: formData.get('password'),
        fullName: formData.get('fullName'),
        phone: formData.get('phone'),
      });

      setUser(result.data.user, result.data.accessToken);
      router.push('/account');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-8">Create Account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">{error}</div>}

          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              placeholder="+254712345678"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              minLength={8}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-primary hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/app/auth/ && git commit -m "feat(web): create auth pages (login/register)"
```

---

### Task 10: Create Checkout Page

**Files:**

- Create: `apps/web/src/app/checkout/page.tsx`

- [ ] **Step 1: Create checkout page**

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store';
import { createOrder } from '@/lib/api';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const order = await createOrder({
        items: items.map(item => ({
          variantId: item.variantId,
          quantity: item.quantity,
        })),
        deliveryAddress: {
          name: formData.get('name'),
          phone: formData.get('phone'),
          area: formData.get('area'),
          city: formData.get('city'),
          notes: formData.get('notes'),
        },
        paymentProvider: 'MPESA',
        phoneNumber: formData.get('phone'),
      });

      clearCart();
      router.push(`/checkout/success?order=${order.data.orderNumber}`);
    } catch (err) {
      alert('Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-500 mb-4">Your cart is empty</p>
        <a href="/products" className="text-primary hover:underline">Continue Shopping</a>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="font-semibold text-lg">Delivery Details</h2>

          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input type="text" name="name" required className="w-full px-4 py-2 border rounded-lg" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input type="tel" name="phone" required className="w-full px-4 py-2 border rounded-lg" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Area</label>
            <input type="text" name="area" required className="w-full px-4 py-2 border rounded-lg" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input type="text" name="city" required className="w-full px-4 py-2 border rounded-lg" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes (optional)</label>
            <textarea name="notes" rows={3} className="w-full px-4 py-2 border rounded-lg" />
          </div>

          <h2 className="font-semibold text-lg pt-4">Payment Method</h2>
          <div className="flex items-center gap-2 p-4 border rounded-lg">
            <input type="radio" name="payment" value="MPESA" defaultChecked className="text-primary" />
            <span>M-Pesa STK Push</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark disabled:opacity-50"
          >
            {loading ? 'Processing...' : `Place Order - KES ${getTotal().toLocaleString()}`}
          </button>
        </form>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.variantId} className="flex justify-between">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">Size: {item.size} x {item.quantity}</p>
                </div>
                <p>KES {(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4 flex justify-between font-bold">
            <span>Total</span>
            <span>KES {getTotal().toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create success page**

```typescript
export default function CheckoutSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-4">✅</div>
      <h1 className="text-2xl font-bold mb-4">Order Placed Successfully!</h1>
      <p className="text-gray-600 mb-8">
        You will receive an M-Pesa prompt shortly. Check your phone for payment instructions.
      </p>
      <a href="/account/orders" className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark">
        View Orders
      </a>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/app/checkout/ && git commit -m "feat(web): create checkout flow with M-Pesa"
```

---

### Task 11: Create Account Dashboard

**Files:**

- Create: `apps/web/src/app/account/page.tsx`
- Create: `apps/web/src/app/account/orders/page.tsx`

- [ ] **Step 1: Create account page**

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { Package, User, MapPin } from 'lucide-react';

export default function AccountPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">My Account</h1>

      <div className="grid md:grid-cols-4 gap-8">
        <nav className="space-y-2">
          <Link href="/account" className="block p-3 bg-primary text-white rounded-lg">
            Dashboard
          </Link>
          <Link href="/account/orders" className="block p-3 hover:bg-gray-100 rounded-lg">
            My Orders
          </Link>
          <button onClick={handleLogout} className="block w-full text-left p-3 hover:bg-gray-100 rounded-lg text-red-500">
            Logout
          </button>
        </nav>

        <div className="md:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="font-semibold text-lg mb-4">Welcome, {user.fullName}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-gray-600">{user.phone}</p>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <h2 className="font-semibold text-lg mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/account/orders" className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100">
                <Package className="w-8 h-8 mx-auto mb-2 text-primary" />
                <span>View Orders</span>
              </Link>
              <Link href="/products" className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100">
                <User className="w-8 h-8 mx-auto mb-2 text-primary" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create orders page**

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { getOrders } from '@/lib/api';
import Link from 'next/link';

export default function OrdersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
  });

  const orders = data?.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">My Orders</h1>

      {isLoading ? (
        <div>Loading...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No orders yet</p>
          <Link href="/products" className="text-primary hover:underline">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <div key={order.id} className="bg-white p-6 rounded-lg border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold">{order.orderNumber}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                  order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">KES {Number(order.totalAmount).toLocaleString()}</span>
                <Link href={`/account/orders/${order.id}`} className="text-primary hover:underline">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/app/account/ && git commit -m "feat(web): create account dashboard and orders page"
```

---

## Phase 3 Completion Checklist

- [ ] Task 1: Set Up React Query & API Client
- [ ] Task 2: Create Cart Store (Zustand)
- [ ] Task 3: Create Layout Components (Header, Footer)
- [ ] Task 4: Create Cart Slide-Over Component
- [ ] Task 5: Update Root Layout
- [ ] Task 6: Create Homepage
- [ ] Task 7: Create Products Listing Page
- [ ] Task 8: Create Product Detail Page
- [ ] Task 9: Create Auth Pages (Login, Register)
- [ ] Task 10: Create Checkout Page
- [ ] Task 11: Create Account Dashboard
