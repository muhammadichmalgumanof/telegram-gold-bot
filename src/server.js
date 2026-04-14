const express = require('express');
const { PORT } = require('./config');

function startServer() {
    const app = express();
    
    app.get('/', (req, res) => {
        res.send('Bot Emas is running 24/7!');
    });
    
    app.listen(PORT, () => {
        console.log(`✅ Web server nyala di port ${PORT}`);
    });
}

module.exports = {
    startServer
};
