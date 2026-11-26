// Oyunun web dosyalarını www/ klasörüne kopyalar; Capacitor iOS uygulamasına
// buradan paketler. Oyunun kendisi derleme gerektirmez: bu sadece kopyalama.
// Kökteki yeni oyun dosyaları (ör. models/ altındaki .glb dosyaları) otomatik
// gelir; sadece aşağıdaki geliştirme dosyaları dışarıda bırakılır.
import { cpSync, rmSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'www');
const SKIP = new Set([
  'www', 'ios', 'android', 'node_modules', 'scripts', 'tools', 'docs', 'tests', 'test',
  'package.json', 'package-lock.json', 'capacitor.config.json', 'README.md',
  'playwright.config.js', 'playwright.config.mjs', 'playwright.config.ts',
  'Sand Box Titanic.html'
]);

rmSync(out, { recursive: true, force: true });
mkdirSync(out);
let n = 0;
for (const name of readdirSync(root)) {
  if (name.startsWith('.') || SKIP.has(name)) continue;
  cpSync(join(root, name), join(out, name), { recursive: true });
  n++;
}
console.log(`www/ hazır (${n} öğe kopyalandı).`);

// App Store sürümünde gizli kod ekranı kapalı: Apple incelemecisi ve
// mağazadan indiren herkes oyunu kodsuz açabilmeli. Kodu korumak için:
//   KILIT=1 npm run ios:sync
if (process.env.KILIT !== '1') {
  const f = join(out, 'index.html');
  const html = readFileSync(f, 'utf8');
  const from = 'if(remembered)unlock();';
  if (html.includes(from)) {
    writeFileSync(f, html.replace(from, 'if(true||remembered)unlock();'));
    console.log('Gizli kod ekranı bu sürümde kapalı (açmak için KILIT=1).');
  } else {
    console.warn('UYARI: gizli kod satırı bulunamadı; kod ekranı açık kalabilir.');
  }
}
