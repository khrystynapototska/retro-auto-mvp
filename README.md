# Ретро Авто — багатосторінковий MVP (контрольна № 2)

Сайт оренди ретро-автомобілів у Львові: головна, автопарк (слайдер + фільтр + галерея), калькулятор вартості, про нас, контакти (форма з валідацією), 404.
Навчальний прототип: тарифи, відгуки та контакти демонстраційні.

## Технології
- HTML5 (семантичні теги, один `h1` на сторінку), Tailwind CSS 3 (збірка CLI, темна тема `dark:`)
- Vanilla JS: `fetch`/`async-await`, `localStorage`, регулярні вирази, без jQuery
- Node.js 22 і npm — лише для збірки CSS та перевірок
- CI/CD: GitHub Actions → Netlify

## Основні функції
- Дані автопарку й відгуків — у `data/cars.json`, завантажуються через `fetch`.
- Темна/світла тема зі збереженням вибору в `localStorage`.
- Автопарк: слайдер Swiper, фільтр за подією, галерея Fancybox.
- Калькулятор вартості: стійкий до некоректного введення (немає NaN/Infinity/від'ємних сум).
- Форма на сторінці «Контакти»: RegEx для email і телефону `+380XXXXXXXXX`, маска, модальне вікно успіху.
- SEO: Open Graph, `sitemap.xml`, `robots.txt`.

## Структура
```
index.html, fleet.html, calculator.html, about.html, contacts.html, 404.html
data/cars.json                контент
assets/css/input.css          вихідні стилі (→ styles.css після збірки)
assets/js/                    common.js, home.js, fleet.js, calculator.js, form.js
assets/images, assets/icons   графіка
scripts/                      check-site.mjs, make-dist.mjs
.github/workflows/deploy.yml  CI/CD
```

## Запуск
Сторінки завантажують `data/cars.json`, тому відкривайте їх через сервер (не подвійним кліком по файлу):
```bash
npm install
npm run build:css      # зібрати assets/css/styles.css
npx serve .            # або Live Server у VS Code
```
Збірка для публікації: `npm run build` → папка `dist/`.

## Сторонні бібліотеки та сервіси
| Що | Для чого | Як підключено |
|---|---|---|
| Swiper 11.1.14 | слайдер автопарку | CDN jsDelivr |
| Fancybox (@fancyapps/ui 5.0.36) | галерея фото | CDN jsDelivr |
| Google Fonts (Playfair Display, Inter) | шрифти | `<link>` з `display=swap` |
| Tailwind CSS 3 | стилі | npm, збірка в `styles.css` |
| GitHub Actions, Netlify | збірка й публікація | `deploy.yml` |

Аналітика не підключена.

## CI/CD
`.github/workflows/deploy.yml` (Node 22): push у `main` → збірка CSS → перевірки (`scripts/check-site.mjs`) → деплой на Netlify.
Секрети репозиторію: `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID` (у коді їх немає).

## Адреса сайту (Open Graph, sitemap)
Абсолютні адреси в мета-тегах `og:*`, `canonical`, `sitemap.xml`, `robots.txt` задаються змінною `SITE_URL` у генераторі сторінок.
Поки сайт не розгорнуто, там тимчасова адреса; після деплою підставте справжню й перегенеруйте сторінки.

## Перевірки
- HTML: валідатор `html-validate` — 0 помилок на всіх 6 сторінках.
- Автотести в Chrome: 28 з 28 (консоль без помилок, мобільний 375 px без горизонтального скролу).
- Lighthouse (mobile): Accessibility, Best Practices, SEO — 100; Performance 87–100 залежно від сторінки.

## Примітки
Серверної частини немає — форма лише імітує надсилання, клієнтська валідація не замінює серверної.
Логотип, іконки й hero-зображення створено за допомогою ШІ (ЛР 3); промпти наведено у звіті.
