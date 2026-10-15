# Parsetting site

Сайт [parsetting.ru](https://parsetting.ru): возможности программы, лицензии и услуги внедрения. Next.js 16, React 19, TypeScript 7.

## Требования

Node.js 24 или новее и npm.

## Запуск

Откройте корень проекта в IDE и выполните:

```sh
npm ci
npm run dev
```

Локальный адрес: http://127.0.0.1:3000. Другой порт: `npm run dev -- --port 4320`.

```sh
npm test
npm run typecheck
npm run build
npm start
```

`npm run dev` запускает предпросмотр без индексации. `npm run build` собирает индексируемый информационный сайт; `npm start` запускает эту сборку на порту 3000. Для Docker: `docker compose up --build -d`.

## Настройки

Домен, контакты, тарифы, места и срок тестового периода заданы в `site.config.json`. После изменения нужна новая сборка. Переменные окружения перечислены в `.env.example`.

`SITE_MODE=preview` отключает индексацию. `SITE_MODE=brochure` включает информационные условия без реквизитов и оплаты; `SITE_INDEXABLE_BROCHURE=false` отключает его индексацию. Режим `SITE_MODE=production` включается явно и требует реквизитов продавца, ИНН и утверждённых текстов (`privacyReviewed` и `termsReviewed`). Обычная production-сборка Next.js этот режим не включает.

Сайт готовит текст обращения локально; пользователь сам отправляет его в Telegram или через почту. Кабинет и API лицензий находятся в отдельном проекте `parsetting-api`.
