/* Автопарк: слайдер Swiper, фільтр, галерея Fancybox — дані з data/cars.json */
document.addEventListener('DOMContentLoaded', () => {
  const { h, money, loadData, carCard } = window.Retro;
  const $ = (id) => document.getElementById(id);
  const errorBox = $('fleetError'), slides = $('slides'), catalog = $('catalog'), filters = $('filters'), count = $('resultCount');
  let swiper = null, data = null, active = 'all';

  function buildSlider() {
    slides.replaceChildren(...data.cars.map((car) =>
      h('div', { class: 'swiper-slide' },
        h('figure', { class: 'card overflow-hidden' },
          h('img', { src: car.image, alt: car.alt, width: car.width, height: car.height, class: 'aspect-[4/3] w-full object-cover' }),
          h('figcaption', { class: 'p-4' },
            h('span', { class: 'font-heading text-lg font-bold text-primary dark:text-amber-200' }, car.name),
            h('span', { class: 'muted block text-sm' }, `${car.year} · від ${money(car.rate)}/год`))))));
    if (swiper) swiper.destroy(true, true);
    swiper = new Swiper('.fleet-swiper', {
      loop: true, speed: 700, spaceBetween: 16, slidesPerView: 1, grabCursor: true,
      autoplay: { delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true },
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
      keyboard: { enabled: true }, a11y: { enabled: true },
      breakpoints: { 640: { slidesPerView: 2, spaceBetween: 20 }, 1024: { slidesPerView: 3, spaceBetween: 24 } },
    });
  }

  function renderFilters() {
    filters.replaceChildren(...data.categories.map((c) => {
      const b = h('button', { type: 'button', class: 'chip', 'aria-pressed': String(c.id === active), 'data-cat': c.id }, c.label);
      b.addEventListener('click', () => { active = c.id; renderFilters(); renderCatalog(); });
      return b;
    }));
  }

  function renderCatalog() {
    const list = active === 'all' ? data.cars : data.cars.filter((c) => c.categories.includes(active));
    catalog.replaceChildren(...list.map((c) => carCard(c, true)));
    count.textContent = list.length ? `Знайдено автомобілів: ${list.length}` : 'За цим фільтром авто немає.';
  }

  async function init() {
    try {
      data = await loadData(true);
      errorBox.classList.add('hidden');
      buildSlider(); renderFilters(); renderCatalog();
    } catch (err) {
      console.warn('Не вдалося завантажити data/cars.json:', err.message);
      errorBox.classList.remove('hidden');
    }
  }
  $('retryBtn').addEventListener('click', init);
  Fancybox.bind('[data-fancybox="catalog"]', { Thumbs: { type: 'classic' }, Hash: false });
  init();
  window.fleetSwiper = () => swiper;
});
