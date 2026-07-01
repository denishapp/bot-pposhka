const { Telegraf, Markup } = require('telegraf');
const express = require('express');

const BOT_TOKEN = process.env.BOT_TOKEN;
const GAME_URL = process.env.GAME_URL || 'https://ваш-username.github.io/ваш-репозиторій/';
const PORT = process.env.PORT || 3000;
const WEBHOOK_PATH = '/webhook';

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

// TODO: впишіть сюди реальні умови —
// • що саме розігрується
// • критерій перемоги (топ-1 в лідерборді? рандомний вибір серед учасників з N+ кілами?)
// • дедлайн / дату підбиття підсумків
// • як зв'яжуться з переможцем (інстаграм-нік, який гравець вказує при реєстрації в грі)`;

const DONATE_TEXT = `💙 *Банка для збору*

// TODO: впишіть сюди реальні реквізити —
// • посилання на monobank-банку / номер картки
// • на що саме збираються кошти`;

// ── Команди (з'являються в меню "/" після /setcommands у BotFather) ──
bot.command('rules', (ctx) => ctx.replyWithMarkdown(RULES_TEXT));
bot.command('giveaway', (ctx) => ctx.replyWithMarkdown(GIVEAWAY_TEXT));
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

// Обробка натискань на кнопки клавіатури (текст має збігатись символ у символ)
bot.hears('📜 Правила гри', (ctx) => ctx.replyWithMarkdown(RULES_TEXT));
bot.hears('🎁 Умови розіграшу', (ctx) => ctx.replyWithMarkdown(GIVEAWAY_TEXT));
bot.hears('💙 Банка для збору', (ctx) => ctx.replyWithMarkdown(DONATE_TEXT));

bot.hears('🎮 Грати', (ctx) => {
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
