const { startServer } = require('./server');
const { startCron, checkAndBroadcastPrice } = require('./cron');
const { bot } = require('./bot');

// Attach tes_notif that requires cron module
bot.command('tes_notif', async (ctx) => {
    ctx.reply("Menjalankan simulasi Notifikasi Harian secara paksa...");
    await checkAndBroadcastPrice(true);
});

async function main() {
    console.log("Memulai sistem...");
    
    // Start Web Server
    startServer();

    // Start Cron
    startCron();

    // Start Bot Telegraf
    bot.launch({ dropPendingUpdates: true }).then(() => {
        console.log("✅ Bot telah berjalan.");
    }).catch(err => {
        console.error("❌ Gagal login bot:", err.message);
    });

    // Graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

main();
