const axios = require("axios");
const cheerio = require("cheerio");

async function run() {
    try {
        const { data } = await axios.get("https://harga-emas.org/", {
            headers: { "User-Agent": "Mozilla/5.0" },
            timeout: 5000
        });
        const $ = cheerio.load(data);
        console.log($('table').text().substring(0, 500));
    } catch(e) {
        console.error("error harga-emas.org", e.message);
    }
}
run();
