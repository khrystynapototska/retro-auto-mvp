// Копіює лише потрібні для публікації файли в dist/ (без node_modules, вихідних конфігів тощо)
import { copyFileSync, rmSync, mkdirSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

// Рекурсивне копіювання без fs.cpSync (щоб збірка однаково працювала на всіх версіях Node і ОС)
function copyDir(src, dest, skip = () => false) {
  mkdirSync(dest, { recursive: true });
  for (const name of readdirSync(src)) {
    const from = join(src, name), to = join(dest, name);
    if (skip(from)) continue;
    if (statSync(from).isDirectory()) copyDir(from, to, skip);
    else copyFileSync(from, to);
  }
}

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist', { recursive: true });
for (const f of readdirSync('.')) {
  if (/\.(html|xml)$/.test(f) || f === 'robots.txt') copyFileSync(f, `dist/${f}`);
}
copyDir('assets', 'dist/assets', (p) => p.endsWith('input.css'));
if (existsSync('data')) copyDir('data', 'dist/data');
console.log('dist/ готовий');
