const { Telegraf } = require('telegraf');

const bot = new Telegraf('8236967922:AAFZKnaeRFX5shEGLPacbHz4VTerC4R_-SY');

console.log("BOT ISHGA TUSHDI");

bot.start((ctx) => {
  ctx.reply("👋 Salom! Bot ishlayapti");
});

bot.on('text', (ctx) => {
  ctx.reply("OK ✔️ " + ctx.message.text);
});

bot.launch();
