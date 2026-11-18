/* Калькулятор вартості оренди (з ЛР 11, захисне програмування). Тарифи беруться з data/cars.json */
(function () {
  'use strict';
  const LIMITS = { hoursMin: 2, hoursMax: 24, kmMax: 500 };
  const PRICES = { kmRate: 25, chauffeurPerHour: 500, decor: 1200, serviceFee: 0.05 };
  const DISCOUNT = { longFrom: 6, long: 0.1, code: 'RETRO10', promo: 0.1 };

  function parseWhole(raw, { min, max, label, allowEmpty = false }) {
    const s = String(raw == null ? '' : raw).trim();
    if (s === '') return allowEmpty ? { ok: true, value: 0 } : { ok: false, error: `Вкажіть ${label}.` };
    if (!/^-?\d+$/.test(s)) return { ok: false, error: `${label[0].toUpperCase() + label.slice(1)} — лише ціле число, без літер і символів.` };
    const n = Number(s);
    if (!Number.isFinite(n)) return { ok: false, error: 'Занадто велике число.' };
    if (n < min) return { ok: false, error: `Мінімум — ${min}.` };
    if (n > max) return { ok: false, error: `Максимум — ${max}.` };
    return { ok: true, value: n };
  }

  function calculate(state, cars) {
    const errors = {};
    const car = cars.find((c) => c.id === state.car);
    if (!car) errors.car = 'Оберіть автомобіль зі списку.';
    const hours = parseWhole(state.hours, { min: LIMITS.hoursMin, max: LIMITS.hoursMax, label: 'кількість годин' });
    if (!hours.ok) errors.hours = hours.error;
    const km = parseWhole(state.km, { min: 0, max: LIMITS.kmMax, label: 'відстань', allowEmpty: true });
    if (!km.ok) errors.km = km.error;
    if (Object.keys(errors).length) return { ok: false, errors };

    const lines = [];
    let subtotal = car.rate * hours.value;
    lines.push([`${car.name}: ${hours.value} год × ${car.rate} грн`, subtotal]);
    if (state.chauffeur) { const v = PRICES.chauffeurPerHour * hours.value; subtotal += v; lines.push(['Водій (за кожну годину)', v]); }
    if (state.decor) { subtotal += PRICES.decor; lines.push(['Святкове оформлення авто', PRICES.decor]); }
    if (km.value > 0) { const v = km.value * PRICES.kmRate; subtotal += v; lines.push([`Виїзд за місто: ${km.value} км × ${PRICES.kmRate} грн`, v]); }
    let rate = 0;
    if (hours.value >= DISCOUNT.longFrom) { rate += DISCOUNT.long; lines.push([`Знижка за ${DISCOUNT.longFrom}+ год (−10%)`, -subtotal * DISCOUNT.long]); }
    const promo = String(state.promo == null ? '' : state.promo).trim().toUpperCase();
    const promoApplied = promo === DISCOUNT.code;
    if (promoApplied) { rate += DISCOUNT.promo; lines.push([`Промокод ${DISCOUNT.code} (−10%)`, -subtotal * DISCOUNT.promo]); }
    let total = subtotal * (1 - rate);
    const fee = total * PRICES.serviceFee;
    lines.push(['Сервісний збір (5%)', fee]);
    total = Math.max(0, Math.round(total + fee));
    if (!Number.isFinite(total)) return { ok: false, errors: { _: 'Не вдалося розрахувати вартість.' } };
    return { ok: true, total, lines, promoApplied, promoEntered: promo !== '' };
  }

  document.addEventListener('DOMContentLoaded', async () => {
    const { h, money, loadData } = window.Retro;
    const $ = (id) => document.getElementById(id);
    const els = { car: $('car'), hours: $('hours'), km: $('km'), chauffeur: $('chauffeur'), decor: $('decor'), promo: $('promo') };
    let cars = [];
    try {
      cars = (await loadData()).cars;
    } catch (e) {
      $('summary').textContent = 'Не вдалося завантажити тарифи. Оновіть сторінку.';
      return;
    }
    els.car.replaceChildren(...cars.map((c) => h('option', { value: c.id }, `${c.name} — ${money(c.rate)}/год`)));
    const wanted = new URLSearchParams(location.search).get('car');
    if (wanted && cars.some((c) => c.id === wanted)) els.car.value = wanted;

    function setErr(name, message) {
      const input = els[name], err = $(name + 'Error');
      if (!input || !err) return;
      input.setAttribute('aria-invalid', message ? 'true' : 'false');
      err.textContent = message || '';
      err.classList.toggle('hidden', !message);
    }
    function render() {
      const r = calculate({ car: els.car.value, hours: els.hours.value, km: els.km.value, chauffeur: els.chauffeur.checked,
        decor: els.decor.checked, promo: els.promo.value }, cars);
      ['car', 'hours', 'km'].forEach((n) => setErr(n, r.ok ? '' : r.errors[n]));
      $('lines').replaceChildren();
      if (!r.ok) { $('total').textContent = '—'; $('summary').textContent = 'Виправте виділені поля, щоб побачити вартість.'; $('promoMsg').textContent = ''; return; }
      $('total').textContent = money(r.total);
      $('summary').textContent = 'Орієнтовна вартість з усіма зборами:';
      $('lines').replaceChildren(...r.lines.map(([label, v]) =>
        h('li', { class: 'flex justify-between gap-3 py-1' }, h('span', {}, label),
          h('span', { class: v < 0 ? 'text-green-300' : '' }, (v < 0 ? '−' : '') + money(Math.abs(v))))));
      $('promoMsg').textContent = r.promoEntered ? (r.promoApplied ? 'Промокод застосовано.' : 'Невірний промокод.') : '';
      $('promoMsg').className = 'mt-1 text-sm ' + (r.promoApplied ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300');
    }
    Object.values(els).forEach((el) => { el.addEventListener('input', render); el.addEventListener('change', render); });
    $('resetBtn').addEventListener('click', () => { $('calcForm').reset(); els.car.value = cars[0].id; render(); });
    $('calcForm').addEventListener('submit', (e) => e.preventDefault());
    render();
    window.RentalCalc = { calculate: (s) => calculate(s, cars) };
  });
})();
