import fs from 'fs';
import path from 'path';

// 1. Oku
let html = fs.readFileSync('new-codes/index.html', 'utf8');

// 2. Yolları Düzelt
// Orijinal site yolları: /_next/static/immutable/chunks/3scvsdd37w8xj.js
// Veya /_next/static/...
// Bizim klasörümüzde hepsi aynı yerde.
html = html.replace(/\/_next\/static\/immutable\/chunks\//g, './');
html = html.replace(/\/_next\/static\/[a-zA-Z0-9_-]+\//g, './'); // Diğer _next statikleri
html = html.replace(/\/_vercel\/speed-insights\//g, './'); // speed-insights gibi eklentiler hata vermesin

// 3. Yaz
fs.writeFileSync('new-codes/index.html', html);

// 4. Taşı
// Klasörü public içine alıyoruz ki Next.js sunabilsin
if (fs.existsSync('public/matrix-demo')) {
  fs.rmSync('public/matrix-demo', { recursive: true, force: true });
}
fs.renameSync('new-codes', 'public/matrix-demo');

console.log("Hazırlandı ve public/matrix-demo içine taşındı.");
