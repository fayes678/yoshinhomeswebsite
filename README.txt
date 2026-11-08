YoshinAce
1. Buka index.html (atau hosting statis). Semua halaman jalan tanpa server.
2. Untuk donasi global & feed otomatis: node server.js, isi YA.API di config.js,
   lalu arahkan webhook Saweria/Sociabuzz ke /webhook/saweria dan /webhook/sociabuzz.
   Feed IG/TikTok: kirim POST ke /webhook/feed (mis. via Zapier/Make/IFTTT). YouTube: isi YT_CHANNEL_ID.
3. Downloader: pasang backend sendiri di /api/dl lalu gunakan hanya untuk konten yang diizinkan.
