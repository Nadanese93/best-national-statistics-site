# Statistik Nusantara

[![bounty](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/Nadanese93/best-national-statistics-site/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/Nadanese93/best-national-statistics-site/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

Situs statistik nasional Indonesia yang orisinal dan berjalan sepenuhnya dari berkas statis — tanpa permintaan jaringan, tanpa pustaka eksternal, di desktop maupun ponsel.

## Isi situs

- **Beranda** — kartu indikator kunci 2024 (penduduk 281,6 juta jiwa, PDB Rp22.139 triliun, pertumbuhan 5,03 persen, inflasi 1,57 persen) plus grafik enam tahun terakhir dan sorotan 2024.
- **Penduduk** — jumlah dan pertumbuhan penduduk 2019–2024 dengan pemilih tahun, struktur umur, dan komposisi jenis kelamin.
- **Ekonomi** — PDB harga berlaku, pertumbuhan, PDB per kapita, dan pangsa 17 lapangan usaha.
- **Provinsi** — tabel 38 provinsi yang bisa dicari, disaring per pulau, dan diurutkan; sampai 3 provinsi bisa dibandingkan dalam satu grafik; tabel yang sedang tampil bisa diunduh sebagai CSV.
- **Harga dan Inflasi** — inflasi tahunan 2019–2024 dan inflasi bulanan 2024 dalam grafik plus tabel yang bisa diurutkan dari bulan terbaru atau terlama.
- **Tenaga Kerja** — tingkat pengangguran terbuka, pekerja menurut lapangan usaha, dan pekerja formal vs informal (Agustus 2024).
- **Metodologi dan Sumber** — asal setiap angka dan catatan metode.

Setiap angka disertai sumber dan tahunnya (BPS dan Bank Dunia, 2024), dan angka antar halaman konsisten satu sama lain — misalnya jumlah penduduk 38 provinsi menjumlah ke total nasional.

## Cara menjalankan

Sajikan folder `app/` dengan server statis apa saja, lalu buka `index.html`:

```sh
cd app
python3 -m http.server 8080
```

atau `node serve.ts` bila memakai starter kit. Tidak ada langkah build.

## Struktur berkas

- `app/index.html` — kerangka halaman dan navigasi
- `app/styles.css` — seluruh tampilan
- `app/data.js` — semua angka statistik beserta sumbernya
- `app/charts.js` — grafik SVG buatan sendiri (garis, batang, donat)
- `app/pages.js` — template tiap halaman dan kontrolnya
- `app/router.js` — routing hash dan perenderan halaman
- `main.ts` — menyerahkan situs ke direktori keluaran dan menulis `dossier.json`
- `screenshots/` — tangkapan layar asli dari situs ini

## Lisensi

MIT — lihat `LICENSE`.
