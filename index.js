const { Telegraf } = require("telegraf");
const fs = require("fs");

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHANNEL = "@kinolar_uz_2";
const ADMIN_ID = 8715755920;

const bot = new Telegraf(BOT_TOKEN);

// Fayllar
if (!fs.existsSync("kinolar.json")) {
  fs.writeFileSync("kinolar.json", "{}");
}

if (!fs.existsSync("users.json")) {
  fs.writeFileSync("users.json", "{}");
}

function loadMovies() {
  return JSON.parse(fs.readFileSync("kinolar.json"));
}

function saveMovies(data) {
  fs.writeFileSync("kinolar.json", JSON.stringify(data, null, 2));
}

function loadUsers() {
  return JSON.parse(fs.readFileSync("users.json"));
}

function saveUsers(data) {
  fs.writeFileSync("users.json", JSON.stringify(data, null, 2));
}

let kinolar = loadMovies();
let users = loadUsers();

let waitingVideo = false;
let waitingCode = false;
let tempVideo = "";

let broadcastMode = false;

async function checkMember(ctx) {
  try {
    const member = await ctx.telegram.getChatMember(CHANNEL, ctx.from.id);
    return member.status !== "left" && member.status !== "kicked";
  } catch {
    return false;
  }
}

bot.start(async (ctx) => {
  const joined = await checkMember(ctx);

  if (!joined) {
    return ctx.reply(
      `❌ Avval kanalga a'zo bo'ling:\n${CHANNEL}`
    );
  }

  users[ctx.from.id] = {
    id: ctx.from.id,
    name: ctx.from.first_name || "",
    username: ctx.from.username || ""
  };

  saveUsers(users);

  ctx.reply(
`🎬 Kino botga xush kelibsiz!

📥 Kino kodini yuboring.`
  );
});

bot.command("addkino", (ctx) => {
  if (ctx.from.id !== ADMIN_ID)
    return ctx.reply("⛔ Siz admin emassiz.");

  waitingVideo = true;
  waitingCode = false;
  tempVideo = "";

  ctx.reply("🎥 Videoni yuboring.");
});

bot.on("video", (ctx) => {
  if (!waitingVideo) return;

  tempVideo = ctx.message.video.file_id;

  waitingVideo = false;
  waitingCode = true;

  ctx.reply("🔢 Endi kino kodini yuboring.");
});

bot.command("list", (ctx) => {
  if (ctx.from.id !== ADMIN_ID)
    return ctx.reply("⛔ Siz admin emassiz.");

  const list = Object.keys(kinolar);

  if (list.length === 0)
    return ctx.reply("📂 Hozircha kinolar yo'q.");

  ctx.reply("🎬 Kinolar:\n\n" + list.join("\n"));
});

bot.command("stats", (ctx) => {
  if (ctx.from.id !== ADMIN_ID)
    return ctx.reply("⛔ Siz admin emassiz.");

  ctx.reply(
    `📊 Statistika\n\n👥 Foydalanuvchilar: ${Object.keys(users).length} ta\n🎬 Kinolar: ${Object.keys(kinolar).length} ta`
  );
});

bot.command("deletekino", (ctx) => {
  if (ctx.from.id !== ADMIN_ID)
    return;

  const code = ctx.message.text.split(" ")[1];

  if (!code)
    return ctx.reply("Masalan:\n/deletekino 101");

  if (!kinolar[code])
    return ctx.reply("❌ Bunday kino yo'q.");

  delete kinolar[code];

  saveMovies(kinolar);

  ctx.reply("🗑 Kino o'chirildi.");
});

bot.command("broadcast", (ctx) => {
  if (ctx.from.id !== ADMIN_ID)
    return;

  broadcastMode = true;

  ctx.reply("📢 Hammaga yuboriladigan xabarni yozing.");
});

bot.on("text", async (ctx) => {
  const text = ctx.message.text;

  if (text.startsWith("/")) return;

  if (waitingCode) {
    kinolar[text] = tempVideo;

    saveMovies(kinolar);

    waitingCode = false;
    tempVideo = "";

    return ctx.reply("✅ Kino muvaffaqiyatli saqlandi.");
  }

  if (broadcastMode) {
    broadcastMode = false;

    const ids = Object.keys(users);

    let count = 0;

    for (const id of ids) {
      try {
        await bot.telegram.sendMessage(id, text);
        count++;
      } catch {}
    }

    return ctx.reply(`✅ ${count} ta foydalanuvchiga yuborildi.`);
  }

  if (kinolar[text]) {
    return ctx.replyWithVideo(kinolar[text]);
  }

  ctx.reply("❌ Bunday kodli kino topilmadi.");
});

// Botni ishga tushirish
bot.launch(() => {
  console.log("✅ Kino bot ishga tushdi.");
});

// Xatolarni ushlash
bot.catch((err, ctx) => {
  console.error("Bot xatosi:", err);
});

// To'g'ri to'xtatish
process.once("SIGINT", () => {
  bot.stop("SIGINT");
});

process.once("SIGTERM", () => {
  bot.stop("SIGTERM");
});
