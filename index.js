const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

console.log("BOT ISHGA TUSHDI");

bot.start((ctx) => {
  ctx.reply("👋 Salom! Bot ishlayapti");
});

bot.on('text', (ctx) => {
  ctx.reply("OK ✔️ " + ctx.message.text);
});

bot.launch();

const http = require('http');

http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is alive!');
}).listen(process.env.PORT || 3000);
