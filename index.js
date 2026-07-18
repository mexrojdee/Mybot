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
