const fs = require('node:fs');
const path = require('node:path');

const dataFile = path.join(__dirname, '..', 'data.json');

let db = { subscribers: [], priceAlerts: {}, priceHistory: [], lastKnownPrice: 0, lastUpdate: "" };

if (fs.existsSync(dataFile)) {
    try {
        const loadedData = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
        db = { ...db, ...loadedData };
    } catch (e) {
        console.error("Gagal baca data.json", e.message);
    }
}

async function saveData() {
    try {
        await fs.promises.writeFile(dataFile, JSON.stringify(db, null, 2));
    } catch (e) {
        console.error("Gagal simpan data.json", e.message);
    }
}

function getDatabase() {
    return db;
}

module.exports = {
    getDatabase,
    saveData
};
