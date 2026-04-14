require('../src/config');
const { getGoldPrice } = require('../src/scraper');
const { calculateTrend, formatRupiah } = require('../src/utils');

async function test() {
    console.log("🔍 Sedang mengambil harga asli dari GoldAPI...");
    const gold = await getGoldPrice();
    
    if (!gold) {
        console.log("❌ Gagal mengambil harga.");
        return;
    }

    // Simulasi sejarah: kita pura-pura harga 7 hari lalu lebih murah 50rb
    const sejarahPalsu = [{ price: gold.beli - 50000, date: "2024-04-07" }];
    const trend = calculateTrend(sejarahPalsu, gold.beli);

    console.log("\n--- 📱 SIMULASI TAMPILAN TELEGRAM ---");
    console.log(`📊 **Harga Emas (1 Gram) Hari Ini**:`);
    console.log(`\n🟢 **Harga Beli:** ${formatRupiah(gold.beli)}`);
    console.log(`🔴 **Harga Jual (Buyback):** ± ${formatRupiah(gold.jual)}`);
    console.log(trend);
    console.log(`\n📌 _Harga referensi internasional (24K), bukan harga resmi Antam._`);
    console.log(`\n🏷 **Cek Harga Resmi Antam:**`);
    console.log(`https://www.logammulia.com/id/harga-emas-hari-ini`);
    console.log("-------------------------------------\n");
}

test();
