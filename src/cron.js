const cron = require('node-cron');
const { getGoldPrice } = require('./scraper');
const { getDatabase, saveData } = require('./storage');
const { formatRupiah, getPriceDeltaInfo } = require('./utils');
const { broadcastToAll } = require('./bot');

async function checkAndBroadcastPrice(forceBroadcast = false) {
    console.log("Menjalankan pengecekan harga harian...");
    const gold = await getGoldPrice();
    if (!gold) return false;

    const db = getDatabase();
    const currentPrice = gold.beli;
    if (currentPrice === db.lastKnownPrice && !forceBroadcast) {
        console.log("Harga emas belum ada perubahan.");
        return false;
    }

    const infoDelta = getPriceDeltaInfo(currentPrice, db.lastKnownPrice, forceBroadcast);
    db.lastKnownPrice = currentPrice;
    db.lastUpdate = new Date().toISOString();
    await saveData();

    const broadcastMsg = `🔔 **Update Harga Emas Hari Ini!**\n\n🟢 **Harga Beli:** ${formatRupiah(gold.beli)}\n🔴 **Harga Jual (Buyback):** ± ${formatRupiah(gold.jual)}\n${infoDelta}`;
    await broadcastToAll(broadcastMsg);
    
    return true;
}

function startCron() {
    cron.schedule('30 8 * * *', async () => {
        await checkAndBroadcastPrice(false);
    }, {
        timezone: "Asia/Jakarta"
    });
}

module.exports = {
    startCron,
    checkAndBroadcastPrice
};
