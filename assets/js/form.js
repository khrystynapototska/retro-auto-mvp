/* Форма заявки: клієнтська валідація (RegEx), маска +380, модальне вікно (з ЛР 9) */
(function () {
  'use strict';
  const REGEX_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const REGEX_PHONE = /^\+380\d{9}$/;

  const rules = {
    username:  { err: 'nameError',      check: (el) => (el.value.trim().length >= 2 ? '' : "Ім'я повинно містити не менше 2 символів.") },
    email:     { err: 'emailError',     check: (el) => (REGEX_EMAIL.test(el.value.trim()) ? '' : 'Введіть коректну адресу, наприклад user@mail.com.') },
    phone:     { err: 'phoneError',     check: (el) => (REGEX_PHONE.test(el.value) ? '' : 'Формат має бути строго +380XXXXXXXXX (9 цифр після +380).') },
    message:   { err: 'messageError',   check: (el) => (el.value.trim().length >= 10 ? '' : 'Повідомлення повинно містити не менше 10 символів.') },
    agreement: { err: 'agreementError', check: (el) => (el.checked ? '' : 'Потрібна згода з політикою конфіденційності.') },
  };

  function normalizePhone(raw) {
    let d = String(raw).replace(/\D/g, '');
    if (d.startsWith('380')) d = d.slice(3); else if (d.startsWith('80')) d = d.slice(2); else if (d.startsWith('0')) d = d.slice(1);
    return '+380' + d.slice(0, 9);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('feedbackForm');
    const submitBtn = document.getElementById('submitBtn');
    const modal = document.getElementById('successModal');
    const touched = new Set();
    let lastFocus = null;
    const el = (n) => document.getElementById(n);

    function paint(name, message) {
      const input = el(name), err = el(rules[name].err);
      input.setAttribute('aria-invalid', message ? 'true' : 'false');
      if (message || !touched.has(name)) input.removeAttribute('data-valid'); else input.setAttribute('data-valid', 'true');
      err.textContent = message; err.classList.toggle('hidden', !message);
    }
    function validate(name) { const m = rules[name].check(el(name)); paint(name, m); return !m; }

    Object.keys(rules).forEach((name) => {
      const input = el(name);
      input.addEventListener(name === 'agreement' ? 'change' : 'input', () => {
        if (name === 'phone') input.value = normalizePhone(input.value);
        touched.add(name); validate(name);
      });
      input.addEventListener('blur', () => { if (touched.has(name)) validate(name); });
    });
    const phone = el('phone');
    // Вставку не блокуємо: подія input нормалізує номер (прибирає пробіли, дужки, дефіси)
    phone.addEventListener('focus', () => { if (!phone.value) phone.value = '+380'; });
    phone.addEventListener('blur', () => { if (phone.value === '+380' && !touched.has('phone')) phone.value = ''; });

    const openModal = () => { lastFocus = document.activeElement; modal.classList.remove('hidden'); modal.classList.add('flex'); el('closeModalBtn').focus(); };
    const closeModal = () => {
      if (modal.classList.contains('hidden')) return;
      modal.classList.add('hidden'); modal.classList.remove('flex'); if (lastFocus) lastFocus.focus();
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (submitBtn.disabled) return;
      let first = null;
      Object.keys(rules).forEach((n) => { touched.add(n); if (!validate(n) && !first) first = el(n); });
      if (first) { first.focus(); return; }
      submitBtn.disabled = true; openModal(); form.reset(); touched.clear();
      Object.keys(rules).forEach((n) => paint(n, ''));
      setTimeout(() => { submitBtn.disabled = false; }, 800);
    });
    el('closeModalBtn').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
  });
})();
