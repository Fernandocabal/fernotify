/**
 * Converts logoMeta.webp → favicon.ico (16x16 + 32x32 multi-size ICO)
 * and injects <link rel="icon"> into all generated HTML files.
 *
 * Run: node scripts/gen-favicon.cjs  (called automatically via postbuild)
 */
const sharp = require('sharp');
const fs    = require('fs');
const path  = require('path');

const SRC             = path.join(__dirname, '../docs/assets/img/logoMeta.webp');
const DOCS_ROOT       = path.join(__dirname, '../../docs');
const DEST_ICO_ROOT   = path.join(DOCS_ROOT, 'favicon.ico');
const DEST_ICO_ASSETS = path.join(DOCS_ROOT, 'assets/favicon.ico');
const DEST_PNG        = path.join(DOCS_ROOT, 'assets/favicon-32x32.png');

const FAVICON_TAG = '<link rel="icon" type="image/x-icon" href="./favicon.ico">\n    <link rel="shortcut icon" type="image/x-icon" href="./favicon.ico">';

async function main() {
  if (!fs.existsSync(SRC)) {
    console.error('Source not found:', SRC);
    process.exit(1);
  }

  // Generate PNG sizes
  const png32 = await sharp(SRC).resize(32, 32).png().toBuffer();
  fs.writeFileSync(DEST_PNG, png32);

  const png16 = await sharp(SRC).resize(16, 16).png().toBuffer();
  const ico   = buildIco([{ size: 16, data: png16 }, { size: 32, data: png32 }]);
  fs.writeFileSync(DEST_ICO_ROOT,   ico);
  fs.writeFileSync(DEST_ICO_ASSETS, ico);
  console.log('✓ favicon.ico written (root + assets)');

  // Inject <link rel="icon"> into every index.html under docs/
  const htmlFiles = findHtml(DOCS_ROOT);
  let injected = 0;
  for (const file of htmlFiles) {
    let html = fs.readFileSync(file, 'utf8');
    if (html.includes('rel="icon"') || html.includes("rel='icon'")) continue; // already has it
    html = html.replace('</head>', `    ${FAVICON_TAG}\n  </head>`);
    fs.writeFileSync(file, html, 'utf8');
    injected++;
  }
  console.log(`✓ favicon link injected into ${injected} HTML files`);
}

function findHtml(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findHtml(full));
    } else if (entry.name.endsWith('.html')) {
      results.push(full);
    }
  }
  return results;
}

/**
 * Minimal ICO builder with PNG-in-ICO (supported by all modern browsers).
 */
function buildIco(images) {
  const HEADER_SIZE = 6;
  const ENTRY_SIZE  = 16;
  let offset = HEADER_SIZE + ENTRY_SIZE * images.length;
  const entries = images.map(img => {
    const entry = { ...img, offset };
    offset += img.data.length;
    return entry;
  });
  const buf = Buffer.alloc(offset);
  buf.writeUInt16LE(0, 0);
  buf.writeUInt16LE(1, 2);
  buf.writeUInt16LE(images.length, 4);
  entries.forEach((e, i) => {
    const base = HEADER_SIZE + i * ENTRY_SIZE;
    buf.writeUInt8(e.size === 256 ? 0 : e.size, base + 0);
    buf.writeUInt8(e.size === 256 ? 0 : e.size, base + 1);
    buf.writeUInt8(0,  base + 2);
    buf.writeUInt8(0,  base + 3);
    buf.writeUInt16LE(1,  base + 4);
    buf.writeUInt16LE(32, base + 6);
    buf.writeUInt32LE(e.data.length, base + 8);
    buf.writeUInt32LE(e.offset,      base + 12);
  });
  entries.forEach(e => e.data.copy(buf, e.offset));
  return buf;
}

main().catch(err => { console.error(err); process.exit(1); });
