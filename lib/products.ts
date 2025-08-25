// lib/products.ts

export interface Variation {
  name: string;
  price: number;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  image: string;
  variations?: Variation[];
  category?: string;
  benefits?: string[];
}

// Define your products array here.  Each product should have a unique slug.
export const products: Product[] = [
  // Example product definition:
  {
    id: '1',
    slug: 'nws-dog-urine-32oz',
    title: "Nature’s Way Soil Dog Urine Neutralizer & Lawn Revitalizer",
    description: "Enzyme spray repairs yellow spots and revives lawns.",
    price: 2998,
    image: '/images/nws/dog_urine.png',
    variations: [
      { name: '32 Ounce', price: 2998 },
      { name: '1 Gallon', price: 5998 },
    ],
    category: 'Lawn Care',
    benefits: ['Repairs yellow spots', 'Safe for pets', 'Revives lawn health'],
  },
  // Define the other nine products similarly...
];

/**
 * Look up a product by slug.
 * Returns undefined if no matching product is found.
 */
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

/**
 * Get products by category.  If category is "All Products" (or falsy), return all products.
 */
export function getProductsByCategory(category: string): Product[] {
  return !category || category === 'All Products'
    ? products
    : products.filter((p) => p.category === category);
}

/**
 * Search products by keyword (in title or description).
 */
export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return products.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q),
  );
}
