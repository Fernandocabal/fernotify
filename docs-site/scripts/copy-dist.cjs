const fs = require('fs');
const path = require('path');

const src  = path.join(__dirname, '..', '..', 'dist');
const dest = path.join(__dirname, '..', '..', 'docs', 'dist');

if (!fs.existsSync(src)) {
  console.log('⚠  dist/ not found — skipping copy (run npm run build first)');
  process.exit(0);
}

fs.mkdirSync(dest, { recursive: true });

for (const file of fs.readdirSync(src)) {
  fs.copyFileSync(path.join(src, file), path.join(dest, file));
  console.log(`📋 docs/dist/${file}`);
}

console.log('✅ dist copiado a docs/dist/');
