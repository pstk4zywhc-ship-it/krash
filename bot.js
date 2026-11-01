
const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf(9023866580:AAGhVmk-_1xSp1i2nfEoUpl_cNEdlCmYYvE);

const platforms = [
  ["📸 Instagram", "instagram"],
  ["🎵 TikTok", "tiktok"],
  ["👻 Snapchat", "snapchat"],
  ["▶️ YouTube", "youtube"],
  ["🐦 Twitter / X", "twitter"]
];

const sessions = new Map();

const menu = Markup.inlineKeyboard([
  [
    Markup.button.callback("📸 Instagram", "instagram"),
    Markup.button.callback("🎵 TikTok", "tiktok")
  ],
  [
    Markup.button.callback("👻 Snapchat", "snapchat"),
    Markup.button.callback("▶️ YouTube", "youtube")
  ],
  [
    Markup.button.callback("🐦 Twitter / X", "twitter")
  ]
]);

bot.start(async (ctx) => {
  sessions.delete(ctx.from.id);

  await ctx.reply(
    "🤖 أهلاً بك في بوت التحميل الشامل\n\nاختر المنصة:",
    menu
  );
});

for (const [name, platform] of platforms) {
  bot.action(platform, async (ctx) => {
    sessions.set(ctx.from.id, platform);

    await ctx.answerCbQuery();

    await ctx.reply(
      `✅ اخترت ${name}\n\nأرسل اسم المستخدم أو رابط المقطع.`
    );
  });
}

bot.command("cancel", async (ctx) => {
  sessions.delete(ctx.from.id);
  await ctx.reply("تم إلغاء الطلب.", menu);
});

bot.on("text", async (ctx) => {
  const platform = sessions.get(ctx.from.id);

  if (!platform) {
    return ctx.reply("اختر منصة أولاً:", menu);
  }

  const input = ctx.message.text.trim();

  if (input.length > 1000) {
    return ctx.reply("الرابط طويل جداً.");
  }

  await ctx.reply(
    `📥 استلمت طلبك!\n\n` +
    `المنصة: ${platform}\n` +
    `الطلب: ${input}\n\n` +
    `محرك التنزيل سيتم ربطه في المرحلة القادمة.`
  );
});

bot.catch((err) => console.error(err));

bot.launch();

console.log("Bot is running!");
