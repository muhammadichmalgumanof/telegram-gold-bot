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

module.exports = {
    formatRupiah,
    getPriceDeltaInfo
};
