const fs = require('node:fs');
const path = require('node:path');

const dataFile = path.join(__dirname, '..', 'data.json');

let db = { subscribers: [], lastKnownPrice: 0, lastUpdate: "" };

if (fs.existsSync(dataFile)) {
    try {
        db = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
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
