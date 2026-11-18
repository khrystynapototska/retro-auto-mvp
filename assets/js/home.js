/* Головна: популярні авто та відгуки з data/cars.json (fetch + async/await) */
document.addEventListener('DOMContentLoaded', async () => {
  const { h, loadData, carCard } = window.Retro;
  const featured = document.getElementById('featured');
  const reviews = document.getElementById('reviews');
  try {
    const data = await loadData();
    featured.replaceChildren(...data.cars.slice(0, 3).map((c) => carCard(c, false)));
    reviews.replaceChildren(...data.reviews.map((r) =>
      h('figure', { class: 'card p-5' },
        h('blockquote', { class: 'text-sm' }, '«' + r.text + '»'),
        h('figcaption', { class: 'muted mt-3 text-sm font-medium' }, `${r.author} · ${r.event}`))));
  } catch (err) {
    console.warn('Не вдалося завантажити data/cars.json:', err.message);
    featured.replaceChildren(h('p', { class: 'muted' }, 'Не вдалося завантажити автопарк. Перегляньте повний каталог на сторінці «Автопарк».'));
    reviews.replaceChildren();
  }
});
