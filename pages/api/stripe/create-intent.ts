import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { getProduct } from '@/lib/cart';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug = '', qty = '1' } = req.query;
  const product = getProduct(String(slug));
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  const quantity = Number(qty);
  try {
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(product.price * 100 * quantity),
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: { product: product.slug, quantity },
    });
    res.status(200).json({ clientSecret: intent.client_secret });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
