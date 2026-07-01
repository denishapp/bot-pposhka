const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const fs = require('fs');
const path = require('path');

const BOT_TOKEN = process.env.BOT_TOKEN;
const GAME_URL = process.env.GAME_URL || 'https://ваш-username.github.io/ваш-репозиторій/';
const PORT = process.env.PORT || 3000;
const WEBHOOK_PATH = '/webhook';
const GIVEAWAY_PHOTO_PATH = path.join(__dirname, 'assets', 'giveaway-hoodie.jpg');

if (!BOT_TOKEN) {
  console.error('❌ Немає змінної середовища BOT_TOKEN. Додайте її в налаштуваннях хостингу.');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);
const app = express();
app.use(express.json());

// ── Тексти меню ──────────────────────────────────────────
// Відредагуйте прямо тут — TODO-місця обов'язково заповніть реальними даними.

const RULES_TEXT = `📜 *Правила гри Shahed-X*

*Мета:* знищуй хвилі ворожих дронів і протримайся якнайдовше.

*Керування*
Веди пальцем по екрану — дрон рухається за тобою. Стрільба ведеться автоматично.

*Життя*
У тебе 3 життя. Зіткнення з ворожим дроном чи кулею забирає одне життя. Втратив усі — гра закінчена.

*Хвилі*
Дрони летять організованою формацією. На початку кожної хвилі є 3 секунди захисту. Окремі дрони відриваються від строю та пікірують на тебе зі стріляниною. З кожною хвилею вороги стають швидшими й агресивнішими — до певної межі, далі складність стабілізується.

*Паверапи*
❤️ +1 життя
🔫 друга гармата
⚡ ×2 швидкострільність
🛡️ щит (ворожі дрони, що врізаються в щит, вибухають)

*Прогресія*
Чим довше граєш — тим сильнішим стає твій дрон: швидша стрільба, довший щит.

*Рекорди*
Після завершення гри результат автоматично йде в загальний рейтинг. Перевір "Статистику" в грі, щоб побачити найкращих гравців.`;

const GIVEAWAY_TEXT = `🎁 *Умови розіграшу*

• На сторінці реєстрації вкажіть свій нікнейм в Instagram або номер телефону, до якого прив'язаний Telegram.
• Збийте якомога більше ворожих БПЛА.
• Увійдіть до трійки лідерів.
• Отримайте худі «Skyfall × 125 ОВМБр» у подарунок.`;

const DONATE_TEXT = `💙 *Банка для збору*

Підтримати 125 ОВМБр можна за посиланням:
https://send.monobank.ua/jar/8yWvsovzrM`;

// Відправляє умови розіграшу як фото з підписом.
// Якщо файл фото раптом відсутній (наприклад, не закомічений у git) —
// не валимо весь обробник, а тихо відповідаємо просто текстом.
async function sendGiveaway(ctx) {
  if (fs.existsSync(GIVEAWAY_PHOTO_PATH)) {
    await ctx.replyWithPhoto(
      { source: GIVEAWAY_PHOTO_PATH },
      { caption: GIVEAWAY_TEXT, parse_mode: 'Markdown' }
    );
  } else {
    await ctx.replyWithMarkdown(GIVEAWAY_TEXT);
  }
}

// ── Команди (з'являються в меню "/" після /setcommands у BotFather) ──
bot.command('rules', (ctx) => ctx.replyWithMarkdown(RULES_TEXT));
bot.command('giveaway', sendGiveaway);
bot.command('donate', (ctx) => ctx.replyWithMarkdown(DONATE_TEXT));

// ── /start — постійна клавіатура-меню знизу екрана ──
bot.start((ctx) => {
  ctx.reply(
    'Ласкаво просимо! Обери пункт меню або натисни "Грати", щоб почати.',
    Markup.keyboard([
      ['🎮 Грати'],
      ['📜 Правила гри', '🎁 Умови розіграшу'],
      ['💙 Банка для збору']
    ]).resize()
  );
});

// Обробка натискань на кнопки клавіатури.
// Використовуємо regex за ключовим словом (а не точний збіг рядка з емодзі),
// бо емодзі, скопійовані в різних місцях, можуть відрізнятись по байтах
// (варіаційні селектори Unicode) навіть якщо виглядають однаково.
bot.hears(/Правила гри/i, (ctx) => ctx.replyWithMarkdown(RULES_TEXT));
bot.hears(/Умови розіграшу/i, sendGiveaway);
bot.hears(/Банка для збору/i, (ctx) => ctx.replyWithMarkdown(DONATE_TEXT));

bot.hears(/Грати/i, (ctx) => {
  ctx.reply(
    'Тисни, щоб почати гру:',
    Markup.inlineKeyboard([
      Markup.button.webApp('🚀 Відкрити гру', GAME_URL)
    ])
  );
});

// ── Webhook + healthcheck ──────────────────────────────────
app.get('/', (req, res) => res.send('Shahed-X bot is running'));
app.use(bot.webhookCallback(WEBHOOK_PATH));

app.listen(PORT, () => {
  console.log(`✅ Bot server running on port ${PORT}`);
  console.log(`   Webhook path: ${WEBHOOK_PATH}`);
  console.log(`   Game URL: ${GAME_URL}`);
});
