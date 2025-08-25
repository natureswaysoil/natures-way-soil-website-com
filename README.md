# Minimal On‑Site Stripe (Elements) — Tiny Bundle

This repository contains a minimal Next.js storefront with Stripe integration for selling Nature's Way Soil products.  It provides a simple checkout flow using Stripe Elements and a basic CMS layer for the landing page copy.

## Key Files

- `components/CheckoutForm.tsx` – Handles Stripe Elements card input and payment intent creation.
- `pages/checkout.tsx` – Checkout page that mounts the checkout form.
- `pages/api/stripe/create-intent.ts` – API route for creating a Stripe payment intent based on the selected product and quantity.
- `pages/api/stripe/webhook.ts` – API route for handling Stripe webhooks (e.g. payment succeeded events).
- `lib/cart.ts` – Simple client-side cart helpers and product type definitions.

## Environment Variables (Vercel)

Set the following secrets in your deployment environment:

- `STRIPE_SECRET_KEY` – Your Stripe secret key for server-side API calls.
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` – Your Stripe publishable key for client-side Elements.
- `STRIPE_WEBHOOK_SECRET` – Signing secret for verifying Stripe webhook events.
- `MAKE_WEBHOOK_URL` – URL used to register the webhook endpoint during deployment (optional).

## CMS (Contentful)

This project optionally integrates with Contentful for the landing page content.  To enable it, provide these environment variables:

- `CONTENTFUL_SPACE_ID`
- `CONTENTFUL_ACCESS_TOKEN`
- `CONTENTFUL_ENTRY_ID`

If these are unset, default landing page copy, images, and video are used.

## Using Products Data

Product metadata lives in `products.csv`.  Run the generation script to convert this CSV into `data/products.json`:

```bash
node scripts/generate-products.js
```

During the build, this script runs automatically (`npm run generate-products`).  It reads `product images for website.txt` to map product IDs to image paths in `public/nws`.

## Adding Products

To add or update products:

1. Update `products.csv` with a new row or edits.  The columns are `id,title,description,price,active,sku,variations`.
2. Add corresponding images to `public/nws` and list them in `product images for website.txt` as `<id>. <img1> [<img2> ...]`.
3. Run `node scripts/generate-products.js` to regenerate `data/products.json`.
