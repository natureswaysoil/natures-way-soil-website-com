/*
 * Product generation script
 *
 * This script reads the products CSV (`../products.csv`) and optional image
 * mapping file (`../product images for website.txt`) to produce a clean
 * `data/products.json` file used by the Next.js application.  It also
 * supports simple variation parsing.  Run this manually with `node
 * scripts/generate-products.js` or rely on the prebuild step defined in
 * the `npm run build` script.
 */

'use strict';

const fs = require('fs');
const path = require('path');

// Input CSV and mapping file locations
const csvPath = path.join(__dirname, '..', 'products.csv');
const imagesPath = path.join(__dirname, '..', 'product images for website.txt');
const outPath = path.join(__dirname, '..', 'data', 'products.json');

// Ensure the CSV exists
if (!fs.existsSync(csvPath)) {
  console.error(`Missing products.csv at ${csvPath}`);
  process.exit(1);
}

// Read CSV, remove carriage returns, and split into lines
const csv = fs.readFileSync(csvPath, 'utf8').replace(/\r/g, '');
const lines = csv.split('\n').filter(Boolean);
// Skip the header row
const rows = lines.slice(1);

// Parse a CSV line without splitting inside quoted fields
function parseCSVLine(line) {
  const regex = /("([^"]|"")*"|[^,]+)|(?<=,)(?=,)|^$/g;
  const cells = line.match(regex) || [];
  return cells.map((c) => {
    const cell = (c || '').trim();
    return cell.startsWith('"') && cell.endsWith('"')
      ? cell.slice(1, -1).replace(/""/g, '"')
      : cell;
  });
}

// Build image mapping: lines like `1. /nws/dog_urine.png /nws/dog_urine_2.png`
const imageMap = {};
if (fs.existsSync(imagesPath)) {
  const imgRaw = fs.readFileSync(imagesPath, 'utf8');
  imgRaw.split(/\r?\n/).forEach((line) => {
    const match = line.match(/^\s*(\d+)\.\s*(.+)$/);
    if (match) {
      const id = Number(match[1]);
      const paths = match[2].split(/\s+/).filter(Boolean);
      if (paths.length) {
        imageMap[id] = paths;
      }
    }
  });
}

// Convert each CSV row into a product object
const products = rows.map((row) => {
  const [idStr, title, description, priceStr, activeStr, sku, variationsRaw = ''] = parseCSVLine(row);
  const id = Number(idStr);
  const price = Number(priceStr) || 0;
  const active = String(activeStr).toUpperCase() === 'TRUE';
  // Parse variations like `32oz:29.98;1gal:39.99`
  const variations = String(variationsRaw)
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((entry) => {
      const [name, vPrice] = entry.split(':');
      return { name: (name || '').trim(), price: Number(vPrice) || 0 };
    });
  return {
    id,
    slug: String(sku || '').toLowerCase(),
    title: String(title || '').trim(),
    description: String(description || '').trim(),
    price,
    active,
    sku: String(sku || '').trim(),
    images: imageMap[id] || ['/placeholder-product.png'],
    variations,
  };
});

// Write the output JSON
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(products, null, 2), 'utf8');
console.log(`Generated ${products.length} products -> ${path.relative(process.cwd(), outPath)}`);