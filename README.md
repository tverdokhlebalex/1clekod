# Лёгкий код

Сайт компании на Astro. Страницы собираются в статику, заявка уходит через серверный адрес `/api/lead`. Исходники CRMSTACK в этот проект не входят.

## Запуск

```bash
npm install
npm run dev
```

Сайт откроется на http://localhost:4321.

## Заявки

Скопируйте `.env.example` в `.env`. Токен Telegram и chat id остаются только там, в браузер они не попадают.

```env
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
PUBLIC_YANDEX_METRIKA_ID=
PUBLIC_SITE_URL=https://1clekod.ru
```

Номер Метрики можно вместо этого вписать в настройках сайта в CMS. Цель отправки формы по умолчанию: `lead_submit`. Её нужно создать в Метрике вручную. UTM и `yclid` сохраняются в сессии браузера и прикладываются к заявке.

На хостинге нужен Node: страницы статические, а форма живёт в `dist/server/entry.mjs`.

```bash
npm run build
node ./dist/server/entry.mjs
```

## CMS

Редактор: https://app.pagescms.org/

Файл `.pages.yml` уже описывает разделы на русском. Инструкция для редакторов: `docs/redaktory.md`.

Правка в Pages CMS попадает в ветку `main` и запускает `.github/workflows/test-build.yml`. После успешной сборки сайт публикуется на GitHub Pages. Адрес и базовый путь задаются переменными сборки, в компонентах их нет. Боевой домен 1clekod.ru, его DNS и хостинг эта сборка не меняет.

Картинки загружаются в `public/media`.

## Проверки

```bash
npm run check
npm run check:cms
npm run build
```
