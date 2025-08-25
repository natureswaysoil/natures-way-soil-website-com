import { useState } from 'react';
import Link from 'next/link';
import * as Cart from '@/lib/cart';
import type { Product } from '@/lib/products';

export function ProductInfo({ product }: { product: Product }) {
  const [selected, setSelected] = useState(
    product.variations?.[0] ?? { name: '', price: product.price }
  );

  return (
    <div className="flex flex-col space-y-4">
      <h1 className="text-2xl font-bold">{product.title}</h1>
      <p className="text-gray-700">{product.description}</p>

      {product.variations && (
        <select
          value={selected.name}
          onChange={(e) => {
            const choice = product.variations?.find(
              (v) => v.name === e.target.value
            );
            if (choice) setSelected(choice);
          }}
          className="border rounded p-2 max-w-xs"
        >
          {product.variations.map((v) => (
            <option key={v.name} value={v.name}>
              {v.name} — ${(v.price / 100).toFixed(2)}
            </option>
          ))}
        </select>
      )}

      <div className="flex items-center space-x-4">
        <span className="text-2xl font-bold text-green-600">
          ${(selected.price / 100).toFixed(2)}
        </span>
        <button
          onClick={() => Cart.addToCart(product.slug, selected.name)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add to Cart
        </button>
        <Link
          href={`/checkout?product=${product.slug}&variant=${selected.name}`}
          className="px-4 py-2 border border-green-600 text-green-600 rounded hover:bg-green-600 hover:text-white"
        >
          Buy Now
        </Link>
      </div>
    </div>
  );
}
