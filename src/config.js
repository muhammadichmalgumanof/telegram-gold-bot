require('dotenv').config();

const PORT = process.env.PORT || 3000;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ALLOWED_CHAT_IDS = process.env.ALLOWED_CHAT_IDS || "";

const getAllowedIds = () => {
    return ALLOWED_CHAT_IDS.split(',').map(id => id.trim()).filter(id => id !== "");
};

module.exports = {
    PORT,
    TELEGRAM_BOT_TOKEN,
    getAllowedIds
};
