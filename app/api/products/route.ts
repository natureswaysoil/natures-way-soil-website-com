import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

// Use Node runtime so we can read from the filesystem
export const runtime = 'nodejs';

export async function GET() {
  try {
    const file = path.join(process.cwd(), 'data', 'products.json');
    const json = await fs.readFile(file, 'utf8');
    const products = JSON.parse(json).filter((p: any) => p.active !== false);

    return NextResponse.json(products, {
      headers: {
        // cache at the CDN for 5 minutes; serve stale for an hour
        'Cache-Control': 's-maxage=300, stale-while-revalidate=3600',
      },
    });
  } catch (err: any) {
    console.error('GET /api/products failed:', err?.message || err);
    return NextResponse.json({ error: 'Products not available' }, { status: 500 });
  }
}
