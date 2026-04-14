const { Telegraf } = require('telegraf');
const axios = require('axios');
const { TELEGRAM_BOT_TOKEN, GOLDAPI_KEY, getAllowedIds } = require('./config');
const { getDatabase, saveData } = require('./storage');
const { formatRupiah } = require('./utils');
const { getGoldPrice } = require('./scraper');

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);
const db = getDatabase();
const allowedIds = getAllowedIds();

bot.use(async (ctx, next) => {
    if (allowedIds.length > 0) {
        if (!allowedIds.includes(ctx.chat.id.toString())) {
            console.log(`⛔ Akses ditolak untuk Chat ID: ${ctx.chat.id}`);
            return ctx.reply(`⛔ Akses Ditolak.\n\nJika Anda adalah pemilik bot ini, copy ID Chat berikut dan masukkan ke dalam ALLOWED_CHAT_IDS di file .env:\n\nID Chat Anda: ${ctx.chat.id}`);
        }
    }
    if (!db.subscribers.includes(ctx.chat.id)) {
        db.subscribers.push(ctx.chat.id);
        await saveData();
    }
    return next();
});

bot.start((ctx) => {
    ctx.reply(`Halo 👋!\nSaya adalah Bot Harga Emas Global.\n\nBerikut fitur operasional yang bisa Anda gunakan:\n/harga - Menampilkan rincian harga emas terkini\n/hitung <gram> - Kalkulasi total saldo emas Anda\n\n⚠️ Harga yang ditampilkan adalah *harga emas internasional* yang dikonversi ke Rupiah, bukan harga resmi Antam.\n\nUntuk harga resmi Antam, kunjungi:\nhttps://www.logammulia.com/id/harga-emas-hari-ini\n\nBot ini juga akan otomatis mengirim pesan pemberitahuan kepada Anda setiap kali terdeteksi pembaruan harga!`, { parse_mode: "Markdown" });
});

bot.help((ctx) => {
    ctx.reply(`🛠 <b>Daftar Fungsi Emas</b>:\n\n/harga - Menampilkan rincian harga emas 1 Gram\n/hitung &lt;angka&gt; - Kalkulasi perkiraan total saldo emas Anda\n/tes_notif - Memanggil dan mengecek siaran alarm secara instan (Admin)`, { parse_mode: "HTML" });
});

bot.command('harga', async (ctx) => {
    ctx.reply("🔍 Memeriksa harga terbaru...");
    const gold = await getGoldPrice();
    if (gold) {
        ctx.reply(`📊 **Harga Emas (1 Gram) Hari Ini**:\n\n🟢 **Harga Beli:** ${formatRupiah(gold.beli)}\n🔴 **Harga Jual (Buyback):** ± ${formatRupiah(gold.jual)}\n\n📌 _Harga referensi internasional (24K), bukan harga resmi Antam._\n\n🏷 **Cek Harga Resmi Antam:**\nhttps://www.logammulia.com/id/harga-emas-hari-ini`, { parse_mode: "Markdown" });
    } else {
        ctx.reply("⚠️ Gagal mengambil data harga saat ini. Coba lagi nanti.");
    }
});

bot.command('hitung', async (ctx) => {
    const messageText = ctx.message.text;
    const args = messageText.split(' ');
    
    if (args.length < 2) {
        return ctx.reply("❌ Format Salah. Gunakan:\n`/hitung <jumlah_gram>`\nContoh: `/hitung 5`", { parse_mode: "Markdown" });
    }

    const gram = Number.parseFloat(args[1].replaceAll(',', '.'));
    if (Number.isNaN(gram)) {
        return ctx.reply("⚠️ Mohon masukkan angka yang valid untuk jumlah gram.");
    }

    const gold = await getGoldPrice();
    if (!gold) {
        return ctx.reply("⚠️ Gagal mengambil harga referensi saat ini. Coba lagi nanti.");
    }

    const totalBeli = gram * gold.beli;
    const totalJual = gram * gold.jual;
    ctx.reply(`🧮 **Kalkulasi Nilai Emas (${gram} Gram)**\n\n🟢 **Jika Anda Beli Baru:**\n${gram} x ${formatRupiah(gold.beli)} = **${formatRupiah(totalBeli)}**\n\n🔴 **Jika Anda Jual/Buyback:**\n${gram} x ± ${formatRupiah(gold.jual)} = **${formatRupiah(totalJual)}**\n\n📌 _Harga referensi internasional (24K), bukan harga resmi Antam._\n\n🏷 **Cek Harga Resmi Antam:**\nhttps://www.logammulia.com/id/harga-emas-hari-ini`, { parse_mode: "Markdown" });
});

bot.command('stop', async (ctx) => {
    const index = db.subscribers.indexOf(ctx.chat.id);
    if (index !== -1) {
        db.subscribers.splice(index, 1);
        await saveData();
    }
    ctx.reply("Sesi telah diakhiri. ID Anda telah dihapus dari sistem berlangganan bot emas.\nKetikan perintah /start kembali jika Anda ingin menghidupkannya lagi.");
});

bot.command('kuota', async (ctx) => {
    try {
        const { data } = await axios.get('https://www.goldapi.io/api/stat', {
            headers: { 'x-access-token': GOLDAPI_KEY }
        });
        ctx.reply(`📡 **Statistik Pemakaian API GoldAPI**\n\n📅 **Hari Ini:** ${data.requests_today} request\n📆 **Kemarin:** ${data.requests_yesterday} request\n🗓 **Bulan Ini:** ${data.requests_month} request\n📋 **Bulan Lalu:** ${data.requests_last_month} request\n\n⚠️ _Batas gratis: 100 request/hari_`, { parse_mode: "Markdown" });
    } catch (err) {
        console.error("Gagal mendapatkan status GoldAPI:", err.message);
        ctx.reply("⚠️ Gagal mengambil data kuota API. Coba lagi nanti.");
    }
});

async function broadcastToAll(message) {
    for (const chatId of db.subscribers) {
        try {
            await bot.telegram.sendMessage(chatId, message, { parse_mode: "Markdown" });
        } catch (e) {
            console.error(`Failed to send to ${chatId}`, e.message);
        }
    }
}

module.exports = {
    bot,
    broadcastToAll
};
