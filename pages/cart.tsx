import Link from 'next/link';

export default function CartPage() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Cart</h1>
      <p>Your cart is currently empty.</p>
      <Link href="/" className="text-green-600 underline mt-4 block">
        Continue shopping
      </Link>
    </div>
  );
}




