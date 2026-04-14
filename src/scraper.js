const axios = require('axios');
const cheerio = require('cheerio');

async function getGoldPrice() {
    const url = "https://www.logammulia.com/id/harga-emas-hari-ini";
    try {
        const { data } = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
                "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
                "Accept-Encoding": "gzip, deflate, br",
                "Referer": "https://www.google.com/",
                "Connection": "keep-alive",
                "Upgrade-Insecure-Requests": "1",
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "cross-site",
                "Pragma": "no-cache",
                "Cache-Control": "no-cache"
            }
        });

        const $ = cheerio.load(data);
        let price1gStr = "";
        
        $('tbody tr').each((i, el) => {
            const weight = $(el).find('td').eq(0).text().trim();
            if (weight === '1 gr') {
                price1gStr = $(el).find('td').eq(1).text().trim();
            }
        });

        if (!price1gStr) return null;

        // Beli
        const priceNum = Number.parseInt(price1gStr.replaceAll(',', '').replaceAll('.', ''), 10);
        
        // Kita menggunakan selisih (spread) tipikal emas Antam sekitar Rp 100.000 - Rp 150.000 untuk estimasi Buyback otomatis
        // karena logammulia.com menyembunyikan harga buyback dari tabel utamanya.
        const buybackEstimasi = priceNum - 120000;

        return {
            beli: priceNum,
            jual: buybackEstimasi,
            url: url
        };
    } catch (err) {
        console.error("Gagal mendapatkan harga emas:", err.message);
        return null;
    }
}

module.exports = {
    getGoldPrice
};
