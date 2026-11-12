# Docker: запуск проєкту локально

Весь проєкт (backend → cms → frontend) запускається однією командою, а кожен застосунок
можна запускати, зупиняти й дивитися його логи окремо.

## Файли

| Файл | Що робить |
| --- | --- |
| `compose.yaml` | Опис трьох сервісів (prod-режим), порядок запуску, порти, змінні оточення |
| `compose.dev.yaml` | Доповнення для dev-режиму: стадія `dev` і hot reload через `docker compose watch` |
| `backend/Dockerfile` | Образ API (NestJS + Prisma), стадії `dev` / `prod` |
| `cms/Dockerfile` | Образ CMS (Next.js), стадії `dev` / `prod` |
| `frontend/Dockerfile` | Образ вітрини (Next.js), стадії `dev` / `prod` |
| `.dockerignore` | Не пускає в образи `node_modules`, `.next`, `dist`, `.env*`, `.git` |

Контекст збірки кожного образу — корінь репозиторію, бо pnpm workspace має один
`pnpm-lock.yaml` на всі застосунки. В образ встановлюються залежності лише свого застосунку
(`pnpm install --filter <app>`).

## Перед першим запуском

1. Запущений Docker Desktop.
2. Є `backend/.env`, `cms/.env`, `frontend/.env` (скопіювати з `.env.example` і заповнити).
   Значення в образи не потрапляють, compose передає їх контейнерам при старті (`env_file`).
3. База даних — Supabase dev-проєкт з `backend/.env` (`DATABASE_URL`, `DIRECT_URL`).
   Окремого контейнера з Postgres немає.

## Команди

### Весь проєкт (з кореня)

| Команда | Що робить |
| --- | --- |
| `pnpm docker:start` | Збирає prod-образи і запускає всі три сервіси у фоні |
| `pnpm docker:dev` | Dev-режим з hot reload (термінал залишається прив'язаним, Ctrl+C — зупинити) |
| `pnpm docker:logs` | Логи всіх сервісів |
| `pnpm docker:down` | Зупиняє і видаляє контейнери та мережу |

### Один застосунок

```
pnpm --filter backend docker:start    # або cms / frontend
pnpm --filter backend docker:dev
pnpm --filter backend docker:stop
pnpm --filter backend docker:logs
```

Застосунок піднімає й ті, від яких залежить: `cms` запустить `backend`, `frontend` —
`backend` і `cms`. Запустити лише один сервіс без залежностей:

```
docker compose up -d --build --no-deps frontend
```

> `pnpm --filter backend docker:up` / `docker:down` — це **старий** окремий Postgres +
> pgAdmin з `backend/docker/postgres`, до цієї схеми не належить.

## Порядок запуску

Compose чекає на healthcheck попереднього сервісу (`depends_on: condition: service_healthy`):

1. **backend** (`:3001`) — здоровий, коли `GET /api/server/live` відповідає 200.
   У prod-режимі спочатку застосовує міграції (`start:prod` → `prisma migrate deploy`).
2. **cms** (`:3030`) — стартує після backend; здоровий, коли `/` відповідає (редирект на логін).
3. **frontend** (`:3000`) — стартує після backend і cms.

Відкривати в браузері як і раніше: http://localhost:3000, http://localhost:3030,
Swagger — http://localhost:3001/docs.

## Змінні оточення в мережі Docker

Усередині Docker `localhost` контейнера — це сам контейнер, тому compose перевизначає лише
адреси між сервісами (решта береться з `.env` застосунку):

| Сервіс | Змінна | Значення в Docker |
| --- | --- | --- |
| backend | `SERVER_PORT` | `3001` |
| backend | `FRONTEND_REVALIDATE_URL` | `http://frontend:3000/api/revalidate` (працює, якщо задано `REVALIDATE_SECRET`) |
| cms | `API_URL` | `http://backend:3001/api` |
| frontend | `API_URL` | `http://backend:3001/api` |

`CMS_URL`, `CMS_ORIGINS`, `WEBAUTHN_*` лишаються `localhost`-адресами: їх бачить браузер,
а він звертається до портів на вашому комп'ютері.

## Dev-режим (hot reload)

`compose.dev.yaml` перемикає образи на стадію `dev` (`nest start --watch`, `next dev`) і
описує правила `develop.watch`:

- `sync` — зміни в `src/`, `dictionaries/`, `public/` копіюються в контейнер, і watcher
  усередині Linux їх бачить. Без bind mount і polling, тому працює на Windows.
- `sync+restart` — зміна `next.config.ts` перезапускає контейнер.
- `rebuild` — зміна `package.json`, `pnpm-lock.yaml` або `backend/prisma` перезбирає образ
  (нові залежності, `prisma generate`).

Dev-backend міграції **не** застосовує (як `pnpm bdev`).

## Чому prod-frontend збирається при старті контейнера

### Що відбувається

`next build` вітрини не просто компілює код: з `cacheComponents` (PPR) він **пререндерить
сторінки** і для цього виконує читання даних з API:

- `generateStaticParams` колекцій бере список slug-ів через строгий `loadCollections`;
- `'use cache'`-функції (колекції, сезони, банери hero) виконуються під час збірки, і їхній
  результат стає частиною статичної оболонки сторінки;
- `failOnBuild` (`shared/api/backend-fallback.ts`) **навмисно** валить збірку, якщо API
  недоступний, щоб не зібрати й не задеплоїти «порожній» сайт.

Під час `docker build` контейнери ще не запущені, і збірка образу не бачить мережі compose,
тому `http://backend:3001` недоступний. Тому в prod-стадії `frontend/Dockerfile` образ
містить лише код і залежності, а `next build && next start` виконується в `CMD`, коли backend
уже здоровий. Через це перший старт frontend займає кілька хвилин. CMS під час збірки API не
викликає, тому вона збирається на етапі образу.

### Хіба застосунки не мають бути незалежними?

Вони незалежні **у коді і під час роботи**: немає імпортів між застосунками, а вітрина
переживає падіння API (порожні стани, самовідновлення за кілька хвилин, AGENTS.md §11).
Але **збірка** статично пререндереного сайту за визначенням залежить від даних: щоб
зберегти готовий HTML колекцій, ці колекції треба прочитати. Це свідоме рішення
(швидкість, SEO), а не випадкова зв'язність.

### Як це роблять на практиці

1. **Збірка в CI проти вже розгорнутого API (найпоширеніше).** Vercel так і працює зараз:
   preview/production-збірка ходить до API, який уже живе в інтернеті. Для Docker те саме:
   CI збирає образ (`docker build --build-arg API_URL=https://api.example.com …`) проти
   staging/production API, пушить у GHCR, сервер лише запускає готовий образ. Проблема
   «бекенд ще не запущений» виникає тільки локально, коли все піднімається в одному compose.
2. **Збірка без даних, наповнення під час роботи.** Пререндерити лише оболонку, а дані
   підтягувати в рантаймі (ISR / `cacheLife`). Збірка повністю незалежна, але перші
   відвідувачі отримують порожні або повільніші сторінки, і зникає захист `failOnBuild`.
   Це зміна коду фронтенду, зараз не зроблена.
3. **Локально: збірка образу з доступом до вже запущеного API.** Спочатку запустити backend,
   потім збирати frontend з `network: host` і `API_URL=http://host.docker.internal:3001/api`.
   Образ стає незмінним, але порядок «спочатку backend, потім build» доводиться тримати вручну.

Для локального запуску поточна схема (варіант зі збіркою при старті) найпростіша. Для
деплою на Hetzner + GHCR логічно перейти на варіант 1.

## Часті ситуації

- **Додали залежність** — у dev спрацює `rebuild`; у prod: `pnpm docker:start` (з `--build`).
- **Змінили `.env`** — перезапустити сервіс: `docker compose up -d <service>` (контейнер
  перестворюється з новими значеннями).
- **Сервіс не стартує** — `docker compose ps` (статус healthcheck), `pnpm docker:logs`.
- **Порт зайнятий** — зупинити локальні `pnpm bdev` / `cdev` / `fdev`: Docker
  використовує ті самі порти 3000 / 3001 / 3030.
