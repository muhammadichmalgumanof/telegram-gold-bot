require('../src/config');
const { getDatabase, saveData } = require('../src/storage');
const { checkAndBroadcastPrice } = require('../src/cron');

async function testAlert() {
    console.log("🔍 Mengetes Logika Alert...");
    const db = getDatabase();
    
    // Pasang target harga sangat tinggi supaya pasti tercapai
    const fakeChatId = "999";
    db.priceAlerts[fakeChatId] = 9999999; 
    await saveData();
    
    console.log(`Target palsu dipasang untuk chat ${fakeChatId} : 9.9jt`);
    
    // Jalankan simulasi pengecekan harga
    // Jika robot belum login (token salah), akan ada error bot.telegram, 
    // tapi itu bukti loop logika alert sudah jalan mencari chat 999.
    await checkAndBroadcastPrice(true);
    
    // Bersihkan kembali
    delete db.priceAlerts[fakeChatId];
    await saveData();
    console.log("\n✅ Tes Selesai. Cek log di atas untuk bukti loop alert.");
}

testAlert();
