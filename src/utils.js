function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
}

function getPriceDeltaInfo(currentPrice, oldPrice, forceBroadcast) {
    if (oldPrice > 0 && currentPrice !== oldPrice) {
        const diff = currentPrice - oldPrice;
        return diff > 0 ? `🟢 *Naik:* ${formatRupiah(diff)}` : `🔴 *Turun:* ${formatRupiah(Math.abs(diff))}`;
    }
    if (forceBroadcast && currentPrice === oldPrice) {
        return "\n_(Mode Testing Notifikasi - Harga Tidak Berubah)_";
    }
    return "";
}

function calculateTrend(priceHistory, currentPrice) {
    if (!priceHistory || priceHistory.length === 0) return "";
    
    // Ambil harga tertua dari riwayat (maks 7 hari lalu)
    const oldestEntry = priceHistory[0];
    const oldPrice = oldestEntry.price;
    const diff = currentPrice - oldPrice;
    
    if (diff === 0) return "\n⚪ **Trend 7 Hari:** Stabil (0%)";
    
    const percent = ((diff / oldPrice) * 100).toFixed(2);
    const emoji = diff > 0 ? "📈" : "📉";
    const sign = diff > 0 ? "+" : "";
    
    return `\n${emoji} **Trend 7 Hari:** ${sign}${formatRupiah(diff)} (${sign}${percent}%)`;
}

module.exports = {
    formatRupiah,
    getPriceDeltaInfo,
    calculateTrend
};
