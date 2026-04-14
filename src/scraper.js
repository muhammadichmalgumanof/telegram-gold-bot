const axios = require('axios');
const { GOLDAPI_KEY } = require('./config');

async function getUsdToIdr() {
    try {
        const { data } = await axios.get("https://open.er-api.com/v6/latest/USD");
        return data.rates.IDR;
    } catch (err) {
        console.error("Gagal ambil kurs USD/IDR:", err.message);
        // Fallback kurs estimasi jika API kurs mati
        return 16800;
    }
}

async function getGoldPrice() {
    const url = "https://www.goldapi.io/api/XAU/USD";
    try {
        const { data } = await axios.get(url, {
            headers: {
                "x-access-token": GOLDAPI_KEY,
                "Content-Type": "application/json"
            }
        });

        const kurs = await getUsdToIdr();
        const hargaPerGramUsd = data.price_gram_24k;
        const hargaPerGram = Math.round(hargaPerGramUsd * kurs);

        // Estimasi buyback (selisih sekitar 3-4% dari harga beli)
        const buybackEstimasi = Math.round(hargaPerGram * 0.96);

        return {
            beli: hargaPerGram,
            jual: buybackEstimasi,
            kurs: kurs,
            url: "https://www.goldapi.io"
        };
    } catch (err) {
        console.error("Gagal mendapatkan harga emas:", err.message);
        return null;
    }
}

module.exports = {
    getGoldPrice
};
