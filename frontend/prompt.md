Я дам тобі файл стилів, який я сам створив і частково змінив після генерації
через Shadcn.

Твоє завдання — не просто описати ці стилі, а проаналізувати їх як основу для
власної дизайн-системи інтернет-магазину.

Важливий контекст:

- Проєкт використовує Shadcn UI як базовий UI framework.
- Я не хочу залишатися з дефолтною Shadcn темою.
- Я вже змінив і "покрамсав" згенерований Shadcn файл, тому потрібно враховувати
  мої рішення, а не повертатися до стандартних токенів.
- Мета: створити власну дизайн-систему, яка використовує технічні можливості
  Shadcn (CSS variables, Tailwind tokens, компоненти, variants), але має власну
  айдентику.
- Це дизайн-система саме для e-commerce проєкту.

Проаналізуй мої стилі і створи документацію дизайн-системи.

Потрібно описати:

1. Brand foundation:

- основна ідея стилю;
- який характер бренду передають кольори, типографіка, контраст;
- для якого типу інтернет-магазину це підходить.

2. Design tokens: Створи структурований опис змінних:

Colors:

- primary
- secondary
- accent
- background
- foreground
- muted
- destructive
- success
- warning
- info
- border
- input
- ring

Для кожної змінної поясни:

- роль у системі;
- де вона використовується;
- які компоненти Shadcn на неї спираються.

3. E-commerce специфічні токени: Додай рекомендації для змінних, яких немає у
   стандартному Shadcn:

Наприклад:

- product-card-background
- product-image-background
- price-primary
- price-old
- discount-badge
- stock-success
- stock-warning
- cart-highlight
- checkout-accent
- promo-background
- review-stars

Поясни, чи потрібно їх додавати окремими CSS variables або краще будувати через
існуючі semantic tokens.

4. Typography system: Опиши:

- font roles;
- heading hierarchy;
- body text;
- captions;
- price typography;
- product titles;
- buttons;
- labels.

5. Spacing system: Проаналізуй spacing і запропонуй:

- базову шкалу;
- правила для product cards;
- grids;
- sections;
- checkout layout.

6. Component mapping: Покажи як ця дизайн-система повинна застосовуватися до
   Shadcn компонентів:

Наприклад:

- Button variants
- Card
- Badge
- Input
- Select
- Dialog
- Dropdown
- Sheet
- Tabs
- Accordion

Для кожного:

- які токени використовувати;
- які variants створити;
- які props/variants мають сенс для e-commerce.

7. Рекомендована структура теми:

Запропонуй структуру файлів:

/styles globals.css tokens.css ecommerce.css

/components/ui button.tsx card.tsx badge.tsx

/components/shop product-card.tsx price.tsx cart-item.tsx

8. CSS variables: Створи фінальну пропозицію набору CSS variables, який замінить
   стандартний Shadcn theme.

Формат: --background: --foreground: --primary: ...

І додатково: --shop-price: --shop-discount: --shop-stock: ...

9. Tailwind/Shadcn compatibility: Перевір, щоб система:

- не ламала Shadcn;
- залишалась сумісною з dark mode;
- підтримувала variants через class-variance-authority;
- могла масштабуватися на великий магазин.

10. Фінальний результат: Дай мені:

- короткий опис дизайн-системи;
- таблицю токенів;
- рекомендації по архітектурі;
- список того, що варто залишити від Shadcn;
- список того, що потрібно замінити власними рішеннями.

Не вигадуй новий стиль. Працюй тільки на основі файлу, який я дам. Якщо бачиш
проблеми у моїх рішеннях — поясни їх і запропонуй покращення, але зберігай
загальний напрямок дизайну.
