'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import * as Cart from '@/lib/cart';

export default function CartButton() {
  const [count, setCount] = useState(0);

  // Update cart count on mount and whenever cart changes (simple example)
  useEffect(() => {
    setCount(Cart.loadCart().reduce((total, item) => total + (item.qty ?? 0), 0));
    const handleStorage = () => {
      setCount(Cart.loadCart().reduce((total, item) => total + (item.qty ?? 0), 0));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <Link href="/cart" className="relative px-3 py-2 bg-green-100 rounded hover:bg-green-200">
      🛒
      {count > 0 && (
        <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  );
}
