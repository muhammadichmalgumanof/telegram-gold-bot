const express = require('express');
const { PORT } = require('./config');

function startServer() {
    const app = express();
    
    app.get('/', (req, res) => {
        res.send('Bot Emas is running 24/7!');
    });
    
    const IP = process.env.IP || process.env.HOST || '0.0.0.0';
    app.listen(PORT, IP, () => {
        console.log(`✅ Web server nyala di port ${PORT} IP ${IP}`);
    });
}

module.exports = {
    startServer
};
