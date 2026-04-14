# Dokumentasi Bot Emas BSI / Antam

Bot Telegram ini berfungsi untuk memberikan informasi harga emas terkini, khususnya merujuk pada produk emas Bank Syariah Indonesia (BSI) berupa Emas Antam.

## Fitur Tersedia
1. **Pengecekan Harga Real-time**: Menggunakan perintah `/harga` untuk mengambil harga emas 1 gram.
2. **Kalkulator Emas**: Menggunakan perintah `/hitung <jumlah_gram>` (contoh: `/hitung 5`) untuk secara otomatis mengkalkulasikan nilai aset berdasarkan harga pasaran.
3. **Auto-Update & Broadcast**: Bot menggunakan penjadwalan `node-cron` untuk memonitor harga pada pukul 08:30 pagi setiap harinya. Jika terjadi selisih harga dari hari sebelumnya, bot akan langsung mengirimkan peringatan otomatis kepada pengguna terdaftar.
4. **Keamanan (Security)**: Menyaring siapa yang dapat memakai bot ini menggunakan filter `ALLOWED_CHAT_IDS` yang ada di `.env`.
5. **Server Awet (Web Service)**: Memiliki web server kecil (*Express*) bawaan agar dapat dihosting gratis 24 jam nonstop di cloud seperti Render.

## Cara Menggunakan (Local/Komputer Sendiri)

### Langkah 1: Setup Token Rahasia
1. Di dalam direktori folder ini (`telegram-bsi-gold-bot`), Anda akan melihat file bernama `.env.example`.
2. Hapus kata `.example` sehingga nama file-nya hanya menjadi `.env` saja.
3. Buka file `.env` tersebut dengan VSCode / Notepad, dan masukkan kunci rahasia Telegram Bot Anda pada kolom `TELEGRAM_BOT_TOKEN=...`.

### Langkah 2: Menyalakan Bot
1. Buka Terminal (Command Prompt atau *New Terminal* di VSCode). Pastikan alat perang lengkap dengan perintah `npm install` terlebih dahulu.
2. Ketikkan perintah ini dan tekan tombol **Enter**:
```bash
npm start
```
3. Jika muncul tampilan teks berbunyi `✅ Web server nyala` dan `✅ Bot telah berjalan.`, itu tandanya aplikasi sudah berhasil aktif.

### Langkah 3: Setup Keamanan (Opsional namun Penting)
Jika Anda ingin agar bot ini tidak bisa ditekan/di-akses oleh sembarang orang, Anda dapat menguncinya:
1. Awali dengan masuk ke ruang obrolan Bot Anda di Telegram, tekan tombol **Start** (atau berikan pesan `/start`).
2. Bot akan memberikan sapaan pembuka beserta sebuah nomor unik, yaitu **ID Chat Anda** (contoh: `111222333`).
3. Matikan bot di Terminal (`Ctrl + C`).
4. Kembali buka file `.env` Anda, kali ini isikan angka rahasia tersebut ke dalam konfigurasi `ALLOWED_CHAT_IDS=111222333`.
5. Nyalakan bot Anda kembali (`npm start`). Selamat! Kini bot Anda anti-penyusup.

### Langkah 4: Setup Visual Menu Telegram (Jika tidak muncul otomatis)
Pada umumnya, setiap kali bot baru pertama kali dinyalakan, menu navigasinya akan otomatis terekam ke aplikasi Telegram. Namun, apabila ikon Menu (`☰`) belum muncul, dorong pembaruannya secara paksa dengan cara berikut:
1. Hubungi kembali **@BotFather** di Telegram.
2. Ketik perintah `/setcommands` lalu pilih nama bot Anda dari daftar.
3. Kirim blok teks berikut ini ke BotFather:
```text
start - Mulai bot & Daftar notifikasi harian
harga - Cek harga referensi emas hari ini
hitung - Kalkulasi nilai saldo emas
tes_notif - Paksa kirim alarm harga khusus Admin
stop - Menghapus akun Anda dari langganan alarm
```
4. Selesai! Tutup aplikasi/jendela obrolan Telegram bot Anda lalu buka lagi, maka tombol menu akan langsung muncul.

## Integrasi Eksternal
Kode bot ini tidak ditujukan untuk disewakan ke pihak lain tanpa modifikasi file lokal `data.json` ke layanan Database pihak ketiga (seperti MongoDB, PostgreSQL) jika skala sistem membesar. File `data.json` hanya dioptimalkan sebagai penyimpanan skala personal.
