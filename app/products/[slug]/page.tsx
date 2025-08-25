// app/products/[slug]/page.tsx
import { ProductImage } from '@/components/ProductImage';
import { ProductInfo } from '@/components/ProductInfo';
import { products } from '@/lib/products';
import type { Product } from '@/lib/products';

/**
 * Expose all product slugs so Next.js can statically generate each page.
 */
export async function generateStaticParams() {
  return products.map((p: Product) => ({
    slug: p.slug,
  }));
}

/**
 * Returns a single product by its slug.
 * You can keep this helper here; it doesn't need to be exported elsewhere.
 */
function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export default function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = getProductBySlug(params.slug);
  if (!product) return null;

  return (
    <div className="container mx-auto flex flex-col md:flex-row gap-8 mt-8">
      <ProductImage src={product.image} alt={product.title} />
      <ProductInfo product={product} />
    </div>
  );
}
