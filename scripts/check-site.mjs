// Прості перевірки перед деплоєм: JSON валідний, HTML без CDN-версії Tailwind, є title та lang
import { readFileSync, readdirSync, existsSync } from 'node:fs';

let failed = false;
const fail = (msg) => { console.error('✗ ' + msg); failed = true; };

if (existsSync('data/cars.json')) {
  try { JSON.parse(readFileSync('data/cars.json', 'utf8')); console.log('✓ data/cars.json — валідний JSON'); }
  catch (e) { fail('data/cars.json: ' + e.message); }
}
for (const f of readdirSync('.').filter((n) => n.endsWith('.html'))) {
  const html = readFileSync(f, 'utf8');
  if (/cdn\.tailwindcss\.com/.test(html)) fail(`${f}: підключено Tailwind Play CDN (потрібен зібраний styles.css)`);
  if (!/<html[^>]*lang=/.test(html)) fail(`${f}: немає атрибута lang`);
  if (!/<title>[^<]+<\/title>/.test(html)) fail(`${f}: порожній <title>`);
  if (!failed) console.log(`✓ ${f}`);
}
if (!existsSync('assets/css/styles.css')) fail('немає assets/css/styles.css (запустіть npm run build:css)');
process.exit(failed ? 1 : 0);
