# Shahed-X Bot

Telegram-бот для гри Shahed-X: меню з правилами, умовами розіграшу, банкою для збору та кнопкою запуску гри (Mini App).

## Структура

```
package.json    — залежності (telegraf, express)
index.js        — весь код бота
.env.example    — приклад змінних середовища
.gitignore
```

## Перед деплоєм — обов'язково відредагуйте в `index.js`:

1. **`GIVEAWAY_TEXT`** — впишіть реальні умови розіграшу (зараз там `TODO`-заглушка).
2. **`DONATE_TEXT`** — впишіть реальні реквізити для збору (зараз там `TODO`-заглушка).
3. Перевірте, що `GAME_URL` (через змінну середовища, див. нижче) вказує на актуальний GitHub Pages URL гри.

## Деплой на Railway (безкоштовно)

1. Залийте цей репозиторій на GitHub (якщо ще не зробили).
2. Зареєструйтесь на [railway.app](https://railway.app) (можна через GitHub-акаунт).
3. **New Project → Deploy from GitHub repo** → виберіть цей репозиторій.
4. У розділі **Variables** проєкту додайте:
   - `BOT_TOKEN` — токен від [@BotFather](https://t.me/BotFather) (`/mybots` → ваш бот → `API Token`)
   - `GAME_URL` — посилання на вашу гру, наприклад `https://username.github.io/shahed-x/`
5. Railway автоматично задеплоїть і видасть публічний URL, наприклад:
   `https://shahed-x-bot-production.up.railway.app`
6. Прив'яжіть webhook — відкрийте в браузері (підставте свій токен і railway-домен):
   ```
   https://api.telegram.org/bot<ВАШ_ТОКЕН>/setWebhook?url=https://shahed-x-bot-production.up.railway.app/webhook
   ```
   Очікувана відповідь: `{"ok":true,"result":true,"description":"Webhook was set"}`

## Реєстрація команд у BotFather (щоб з'явились у меню "/")

Напишіть [@BotFather](https://t.me/BotFather) → `/setcommands` → виберіть бота → вставте:

```
start - Почати
rules - 📜 Правила гри
giveaway - 🎁 Умови розіграшу
donate - 💙 Банка для збору
```

## Перевірка

Напишіть боту `/start` в Telegram — має з'явитись клавіатура-меню знизу з кнопками:
`🎮 Грати`, `📜 Правила гри`, `🎁 Умови розіграшу`, `💙 Банка для збору`.

## Локальний запуск (опційно, для тестування)

```bash
cp .env.example .env
# впишіть BOT_TOKEN і GAME_URL у .env
npm install
npm start
```

Для локального тесту webhook не спрацює без публічного URL (Telegram не може достукатись до localhost) — використовуйте [ngrok](https://ngrok.com) або просто тестуйте одразу на Railway.

## Важливо про старий бекенд

Якщо цей самий бот раніше вже був підключений через **long polling** десь на іншому сервері — щойно ви викличете `setWebhook` на новий Railway-URL, Telegram автоматично перемкне доставку повідомлень сюди. Старий процес (де б він не був) просто перестане отримувати оновлення. Шукати й вимикати його вручну не обов'язково.
