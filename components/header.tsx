'use client';

import Image from 'next/image';
import Link from 'next/link';
import CartButton from '@/components/cart-button';

export default function Header() {
  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-4">
        {/* Left navigation */}
        <nav className="hidden md:flex space-x-8">
          <Link href="/">Home</Link>
          <Link href="/products">Products</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        {/* Centred logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/logo-with-tagline.png"
            alt="Nature’s Way Soil – From Our Farm to Your Garden"
            width={240}
            height={120}
            priority
          />
        </Link>

        {/* Right side: call-to-action + cart */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            href="/expert-advice"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Get Expert Advice
          </Link>
          <CartButton />
        </div>
      </div>
    </header>
  );
}
