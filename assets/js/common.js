/* Спільна логіка сайту: тема (dark/light + localStorage), мобільне меню, завантаження JSON, картка авто */
(function () {
  'use strict';
  const root = document.documentElement;

  /* ---------- Перемикач теми ---------- */
  function currentTheme() { return root.classList.contains('dark') ? 'dark' : 'light'; }
  function syncToggle() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    const dark = currentTheme() === 'dark';
    btn.setAttribute('aria-pressed', String(dark));
    btn.setAttribute('aria-label', dark ? 'Світла тема' : 'Темна тема');
  }
  function setTheme(theme) {
    root.classList.toggle('dark', theme === 'dark');
    try { localStorage.setItem('theme', theme); } catch (e) { /* приватний режим — працюємо без збереження */ }
    syncToggle();
  }

  /* ---------- Створення DOM без innerHTML (захист від XSS) ---------- */
  function h(tag, attrs, ...children) {
    const el = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (v === false || v == null) return;
      if (k === 'class') el.className = v; else el.setAttribute(k, v === true ? '' : v);
    });
    children.flat().forEach((c) => el.append(c instanceof Node ? c : document.createTextNode(String(c))));
    return el;
  }

  const money = (n) => new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 0 }).format(Math.round(n)) + ' грн';

  /* ---------- Дані (cars.json) ---------- */
  let dataPromise = null;
  function loadData(force) {
    if (!dataPromise || force) {
      dataPromise = fetch('data/cars.json').then((r) => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      }).catch((e) => { dataPromise = null; throw e; });
    }
    return dataPromise;
  }

  /* ---------- Картка автомобіля ---------- */
  function carCard(car, withGallery) {
    const img = h('img', { src: car.image, alt: car.alt, width: car.width, height: car.height, loading: 'lazy', decoding: 'async',
      class: 'aspect-[4/3] w-full object-cover' });
    const media = withGallery
      ? h('a', { href: car.image, 'data-fancybox': 'catalog', 'data-caption': `${car.name}, ${car.year}`, class: 'block overflow-hidden', 'aria-label': `Збільшити фото: ${car.name}` }, img)
      : img;
    return h('article', { class: 'card flex flex-col overflow-hidden' },
      media,
      h('div', { class: 'flex flex-1 flex-col gap-2 p-5' },
        h('h3', { class: 'font-heading text-xl font-bold text-primary dark:text-amber-200' }, car.name),
        h('p', { class: 'muted text-sm' }, `${car.year} · ${car.type}`),
        h('p', { class: 'text-sm' }, car.description),
        h('ul', { class: 'muted flex flex-wrap gap-3 text-sm' }, h('li', {}, `${car.seats} місця`), h('li', {}, `${car.luggage} валізи`), h('li', {}, car.gearbox)),
        h('p', { class: 'mt-auto pt-2' }, h('strong', { class: 'text-lg text-primary dark:text-amber-200' }, money(car.rate * 2)),
          h('span', { class: 'muted ml-2 text-xs' }, 'за 2 год')),
        h('a', { class: 'btn-outline mt-2', href: `calculator.html?car=${encodeURIComponent(car.id)}` }, 'Розрахувати вартість')));
  }

  document.addEventListener('DOMContentLoaded', () => {
    syncToggle();
    const toggle = document.getElementById('themeToggle');
    if (toggle) toggle.addEventListener('click', () => setTheme(currentTheme() === 'dark' ? 'light' : 'dark'));

    const menuBtn = document.getElementById('menuToggle'), nav = document.getElementById('main-nav');
    if (menuBtn && nav) {
      const setMenu = (open) => { menuBtn.setAttribute('aria-expanded', String(open)); nav.classList.toggle('hidden', !open); };
      menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') { setMenu(false); menuBtn.focus(); }
      });
    }
  });

  window.Retro = { h, money, loadData, carCard };
})();
