const { Telegraf } = require('telegraf');
const fs = require('fs');

const CHANNEL = "@kinolar_uz_2";

const bot = new Telegraf(process.env.BOT_TOKEN);

// O'Z TELEGRAM ID'ingNI YOZ
const ADMIN_ID = 8715755920;

async function checkMember(ctx) {
  try {
    const member = await ctx.telegram.getChatMember(
      CHANNEL,
      ctx.from.id
    );

    if (member.status === "left" || member.status === "kicked") {
      return false;
    }

    return true;
  } catch (e) {
    return false;
  }
}


// kinolar.json bo'lmasa yaratadi
if (!fs.existsSync('kinolar.json')) {
  fs.writeFileSync('kinolar.json', '{}');
}

let kinolar = JSON.parse(fs.readFileSync('kinolar.json'));

let kutyapti = false;
let vaqtinchaVideo = null;

bot.start(async (ctx) => {
  const ok = await checkMember(ctx);

  if (!ok) {
    return ctx.reply("❗ Kanalga a’zo bo‘ling:\n" + CHANNEL);
  }

  ctx.reply("🎬 Kino botga xush kelibsiz!");
});

bot.command('addkino', (ctx) => {
  if (ctx.from.id != ADMIN_ID) {
    return ctx.reply("⛔ Siz admin emassiz.");
  }

  kutyapti = true;
  ctx.reply("🎥 Videoni yuboring.");
});

bot.on('video', (ctx) => {
  if (!kutyapti) return;

  vaqtinchaVideo = ctx.message.video.file_id;
  ctx.reply("Endi kino kodini yuboring.");
});

bot.on('text', (ctx) => {
  const text = ctx.message.text;

  if (kutyapti && vaqtinchaVideo) {
    kinolar[text] = vaqtinchaVideo;

    fs.writeFileSync('kinolar.json', JSON.stringify(kinolar, null, 2));

    ctx.reply(`✅ Kino saqlandi.\nKod: ${text}`);

    kutyapti = false;
    vaqtinchaVideo = null;
    return;
  }

  if (kinolar[text]) {
    return ctx.replyWithVideo(kinolar[text]);
  }

  ctx.reply("❌ Bunday kino topilmadi.");
});

bot.command('list', (ctx) => {
  if (ctx.from.id != ADMIN_ID) return;

  const list = Object.keys(kinolar);

  if (list.length === 0) {
    return ctx.reply("Hech qanday kino yo'q.");
  }

  ctx.reply("📃 Kinolar:\n\n" + list.join("\n"));
});

bot.command('deletekino', (ctx) => {
  if (ctx.from.id != ADMIN_ID) return;

  const kod = ctx.message.text.split(" ")[1];

  if (!kod) {
    return ctx.reply("Masalan:\n/deletekino 101");
  }

  if (!kinolar[kod]) {
    return ctx.reply("Bunday kod yo'q.");
  }

  delete kinolar[kod];
  fs.writeFileSync('kinolar.json', JSON.stringify(kinolar, null, 2));

  ctx.reply("🗑 O'chirildi.");
});

bot.launch();

console.log("✅ Bot ishga tushdi.");

