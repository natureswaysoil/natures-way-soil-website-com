// app/products/[slug]/page.tsx
import { ProductImage } from '@/components/ProductImage';
import { ProductInfo } from '@/components/ProductInfo';
import { getProductBySlug } from '@/lib/products';

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) return null;

  return (
    <div className="container mx-auto flex flex-col md:flex-row gap-8 mt-8">
      <ProductImage src={product.image} alt={product.title} />
      <ProductInfo product={product} />
    </div>
  );
}
