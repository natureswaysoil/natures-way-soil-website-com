import productsData from '@/data/products.json';
const products: Product[] = productsData;

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug && p.active);
}
export type Product = {
  id: number | null;
  slug: string;
  title: string;
  description: string;
  price: number;
  active: boolean;
  sku: string;
  images: string[];
  variations?: { name: string; price: number }[];
};
export type CartItem = {
  id: string;
  title?: string;
  price_cents?: number;
  image?: string;
  qty: number;
};

const KEY = 'nws_cart';

const isBrowser = () => typeof window !== 'undefined' && !!window.localStorage;

export function loadCart(): CartItem[] {
  if (!isBrowser()) return [];
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') as CartItem[]; }
  catch { return []; }
}

export function saveCart(items: CartItem[]) {
  if (!isBrowser()) return;
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addItem(item: CartItem, delta = 1): CartItem[] {
  const items = loadCart();
  const i = items.findIndex((x) => x.id === item.id);
  if (i >= 0) items[i].qty += delta;
  else items.push({ ...item, qty: Math.max(1, delta) });
  const cleaned = items.filter((x) => x.qty > 0);
  saveCart(cleaned);
  return cleaned;
}

export function setQty(id: string, qty: number): CartItem[] {
  const items = loadCart().map((x) => (x.id === id ? { ...x, qty } : x)).filter((x) => x.qty > 0);
  saveCart(items);
  return items;
}

export function removeItem(id: string): CartItem[] {
  const items = loadCart().filter((x) => x.id !== id);
  saveCart(items);
  return items;
}

export function clearCart() {
  saveCart([]);
}

export function subtotalCents(items: CartItem[] = loadCart()): number {
  return items.reduce((sum, x) => sum + (x.price_cents || 0) * (x.qty || 0), 0);
}

export default {
  loadCart,
  saveCart,
  addItem,
  setQty,
  removeItem,
  clearCart,
  subtotalCents,
};
