import Link from 'next/link';
import Image from 'next/image';
import productsData from '@/data/products.json';
import type { Product } from '@/lib/cart';
import type { LandingContent } from '@/lib/cms';
import { useState, useEffect } from 'react';
import * as Cart from '@/lib/cart';

export default function LandingPage({ content }: { content: LandingContent }) {

		const [cart, setCart] = useState<Cart.CartItem[]>([]);

		useEffect(() => {
			setCart(Cart.loadCart());
			const handleStorage = () => setCart(Cart.loadCart());
			window.addEventListener('storage', handleStorage);
			return () => window.removeEventListener('storage', handleStorage);
		}, []);

		function handleAddToCart(p: Product) {
			Cart.addItem({ id: p.slug, title: p.title, price_cents: Math.round((p.variations?.[0]?.price ?? p.price) * 100), image: p.images[0], qty: 1 });
			setCart(Cart.loadCart());
		}

		function handleRemoveFromCart(p: Product) {
			Cart.removeItem(p.slug);
			setCart(Cart.loadCart());
		}

			return (
					<>
						<section className="flex flex-col items-center text-center bg-green-100 p-8">
							<Image
								src="/logo.png"
								alt="Nature's Way Soil logo"
								width={160}
								height={0}
								style={{ height: 'auto' }}
								className="mb-2"
							/>
							<Image
								src={content.heroImage}
								alt="Nature's Way Soil hero"
								width={300}
								height={300}
								className="mb-4"
							/>
							<h1 className="text-3xl font-bold mb-4">{content.heroTitle}</h1>
							<p className="max-w-xl mb-6">{content.mission}</p>
							<Link href="#products" className="bg-green-600 text-white px-4 py-2 rounded shadow">
								Shop Now
							</Link>
						</section>

					<section className="p-8 bg-white text-center">
						<h2 className="text-2xl font-semibold mb-4">Our Promise</h2>
						<ul className="max-w-3xl mx-auto text-left list-disc list-inside space-y-2">
							{content.promise.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
					</section>

					<section className="p-8 text-center bg-green-50">
						<h2 className="text-2xl font-semibold mb-4">Why We Do It</h2>
						{content.why.map((p, i) => (
							<p key={i} className={i === 0 ? 'max-w-2xl mx-auto mb-2' : 'max-w-2xl mx-auto'}>
								{p}
							</p>
						))}
					</section>

					<section className="p-8 flex justify-center bg-gray-100">
						<div className="w-full max-w-3xl aspect-video">
							<iframe
								className="w-full h-full rounded"
								src={content.videoUrl}
								title="Benefits of Nature's Way Soil products"
								allowFullScreen
							></iframe>
						</div>
					</section>

					<main id="products" className="p-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
						{productsData.map((p: Product) => {
							const inCart = cart.some((item) => item.id === p.slug);
							return (
								<div key={p.id} className="border rounded p-4 flex flex-col">
									<Image
										src={p.images[0] || '/placeholder-product.png'}
										alt={p.title}
										width={300}
										height={300}
										className="mb-2"
									/>
									<h2 className="text-lg font-semibold mb-2">{p.title}</h2>
									<p className="flex-grow">{p.description}</p>
									<p className="mt-2 font-bold">${p.price.toFixed(2)}</p>
									<button
										className="mt-4 inline-block bg-green-600 text-white px-3 py-1 rounded text-center"
										onClick={() => handleAddToCart(p)}
										disabled={inCart}
									>
										{inCart ? 'In Cart' : 'Add to Cart'}
									</button>
									{inCart && (
										<button
											className="mt-2 inline-block bg-red-600 text-white px-3 py-1 rounded text-center"
											onClick={() => handleRemoveFromCart(p)}
										>
											Remove from Cart
										</button>
									)}
								</div>
							);
						})}
					</main>

					<section className="p-8 text-center bg-green-100">
						<h2 className="text-2xl font-semibold mb-4">Ready to restore your soil?</h2>
						<Link href="#products" className="bg-green-600 text-white px-4 py-2 rounded shadow">
							Browse Products
						</Link>
						<p className="mt-4">
							Prefer Amazon?{' '}
							<a
								href="https://www.amazon.com"
								className="text-green-700 underline"
								target="_blank"
								rel="noopener noreferrer"
							>
								Find us on Amazon
							</a>
							.
						</p>
						<p className="mt-2 text-sm">Secure checkout powered by Stripe.</p>
					</section>
				</>
			);
	}
