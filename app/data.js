/* data.js — seluruh angka situs Statistik Nusantara.
   Angka diambil dari publikasi resmi (BPS dan Bank Dunia) dan disusun
   agar konsisten antar halaman: total penduduk 2024 = 281,6 juta,
   dan jumlah penduduk 38 provinsi menjumlah ke total itu.
   Setiap angka di halaman selalu disertai sumber dan tahunnya. */

'use strict';

var SN = window.SN || {};
window.SN = SN;

/* Seri tahunan 2019-2024. Sumber: BPS, Berita Resmi Statistik. */
SN.years = [2019, 2020, 2021, 2022, 2023, 2024];

SN.series = {
  population: { // juta jiwa
    label: 'Penduduk', unit: 'juta jiwa', source: 'BPS, 2024',
    values: [268.1, 270.2, 272.7, 275.8, 278.7, 281.6]
  },
  gdpGrowth: { // persen y-on-y
    label: 'Pertumbuhan PDB', unit: '% (y-on-y)', source: 'BPS, 2024',
    values: [5.02, -2.07, 3.70, 5.31, 5.05, 5.03]
  },
  gdpNominal: { // Rp triliun, harga berlaku
    label: 'PDB harga berlaku', unit: 'Rp triliun', source: 'BPS, 2024',
    values: [15834, 15434, 16977, 19589, 20892, 22139]
  },
  inflation: { // persen y-on-y, IHK
    label: 'Inflasi (IHK)', unit: '% (y-on-y)', source: 'BPS, 2024',
    values: [2.72, 1.68, 1.87, 5.51, 2.61, 1.57]
  },
  unemployment: { // persen, Agustus
    label: 'Tingkat pengangguran terbuka', unit: '%', source: 'BPS, Agustus 2024',
    values: [5.28, 7.07, 6.49, 5.86, 5.32, 4.91]
  },
  poverty: { // persen, September (2024) / Maret-September
    label: 'Penduduk miskin', unit: '%', source: 'BPS, 2024',
    values: [9.22, 10.19, 9.71, 9.57, 9.36, 8.57]
  },
  hdi: { // Indeks Pembangunan Manusia
    label: 'Indeks Pembangunan Manusia', unit: 'skor 0-100', source: 'BPS, 2024',
    values: [71.92, 71.94, 72.29, 73.37, 74.39, 75.02]
  }
};

/* Indikator kunci tahun berjalan (2024, kecuali dinyatakan lain). */
SN.kpi = {
  population: { value: '281,6 jt', note: 'jiwa, proyeksi BPS 2024', source: 'BPS 2024' },
  gdp: { value: 'Rp22.139 T', note: 'PDB harga berlaku 2024', source: 'BPS 2024' },
  gdpGrowth: { value: '5,03%', note: 'pertumbuhan ekonomi 2024', source: 'BPS 2024' },
  gdpPerCapita: { value: 'Rp78,6 jt', note: 'per kapita 2024 (US$4.925)', source: 'BPS / Bank Dunia 2024' },
  inflation: { value: '1,57%', note: 'inflasi tahunan 2024 (IHK)', source: 'BPS 2024' },
  unemployment: { value: '4,91%', note: 'TPT Agustus 2024', source: 'BPS 2024' },
  poverty: { value: '8,57%', note: 'penduduk miskin, Sep 2024', source: 'BPS 2024' },
  hdi: { value: '75,02', note: 'Indeks Pembangunan Manusia 2024', source: 'BPS 2024' },
  lifeExpectancy: { value: '74,2 thn', note: 'angka harapan hidup 2024', source: 'BPS 2024' }
};

/* Struktur umur 2024 (persen penduduk). Sumber: BPS, 2024. */
SN.ageGroups = [
  { group: '0-14 tahun', pct: 24.2, note: 'anak' },
  { group: '15-24 tahun', pct: 16.9, note: 'remaja & pemuda' },
  { group: '25-54 tahun', pct: 42.8, note: 'usia kerja utama' },
  { group: '55-64 tahun', pct: 9.0, note: 'pra-lansia' },
  { group: '65+ tahun', pct: 7.1, note: 'lansia' }
];

SN.sexSplit = { male: 141.8, female: 139.8 }; // juta jiwa, BPS 2024

/* Inflasi bulanan 2024 (month-to-month, %). Sumber: BPS, 2024. */
SN.monthlyInflation2024 = [
  { m: 'Jan', v: 0.04 }, { m: 'Feb', v: 0.37 }, { m: 'Mar', v: 0.52 },
  { m: 'Apr', v: 0.07 }, { m: 'Mei', v: -0.03 }, { m: 'Jun', v: -0.08 },
  { m: 'Jul', v: -0.18 }, { m: 'Agu', v: -0.03 }, { m: 'Sep', v: -0.12 },
  { m: 'Okt', v: 0.08 }, { m: 'Nov', v: 0.30 }, { m: 'Des', v: 0.44 }
];

/* PDB menurut lapangan usaha 2024, pangsa %. Sumber: BPS, 2024. */
SN.sectors = [
  { name: 'Industri pengolahan', pct: 18.7 },
  { name: 'Perdagangan besar & eceran', pct: 13.0 },
  { name: 'Pertanian, kehutanan & perikanan', pct: 12.5 },
  { name: 'Konstruksi', pct: 10.1 },
  { name: 'Pertambangan & penggalian', pct: 9.0 },
  { name: 'Transportasi & pergudangan', pct: 5.3 },
  { name: 'Informasi & komunikasi', pct: 4.2 },
  { name: 'Jasa keuangan & asuransi', pct: 4.2 },
  { name: 'Administrasi pemerintahan', pct: 3.6 },
  { name: 'Jasa pendidikan', pct: 3.2 },
  { name: 'Real estat', pct: 2.8 },
  { name: 'Akomodasi & makan minum', pct: 2.6 },
  { name: 'Jasa perusahaan', pct: 1.8 },
  { name: 'Jasa lainnya', pct: 1.6 },
  { name: 'Jasa kesehatan', pct: 1.2 },
  { name: 'Listrik & gas', pct: 1.1 },
  { name: 'Pengadaan air', pct: 0.1 }
];

/* Tenaga kerja, Agustus 2024. Sumber: BPS, Sakernas Agustus 2024. */
SN.labour = {
  workforce: 152.11, // juta jiwa angkatan kerja
  employed: 144.64,  // juta jiwa bekerja
  unemployed: 7.47,  // juta jiwa
  lfpr: 70.63,        // TPAK %
  formalPct: 40.88,
  informalPct: 59.12,
  bySector: [
    { name: 'Pertanian, kehutanan & perikanan', pct: 28.4 },
    { name: 'Perdagangan besar & eceran', pct: 18.9 },
    { name: 'Industri pengolahan', pct: 13.7 },
    { name: 'Konstruksi', pct: 8.6 },
    { name: 'Akomodasi & makan minum', pct: 7.0 },
    { name: 'Transportasi & pergudangan', pct: 6.2 },
    { name: 'Lapangan usaha lainnya', pct: 17.2 }
  ]
};

/* 38 provinsi, penduduk 2024 (juta jiwa). Sumber: BPS, 2024.
   Jumlahnya 281,67 juta, selaras dengan total nasional 281,6 juta. */
SN.provinces = [
  { name: 'Jawa Barat', island: 'Jawa', pop: 49.94 },
  { name: 'Jawa Timur', island: 'Jawa', pop: 41.81 },
  { name: 'Jawa Tengah', island: 'Jawa', pop: 37.89 },
  { name: 'Sumatera Utara', island: 'Sumatera', pop: 16.05 },
  { name: 'Banten', island: 'Jawa', pop: 12.43 },
  { name: 'DKI Jakarta', island: 'Jawa', pop: 10.68 },
  { name: 'Sulawesi Selatan', island: 'Sulawesi', pop: 9.35 },
  { name: 'Lampung', island: 'Sumatera', pop: 9.30 },
  { name: 'Sumatera Selatan', island: 'Sumatera', pop: 8.84 },
  { name: 'Riau', island: 'Sumatera', pop: 6.64 },
  { name: 'Kalimantan Barat', island: 'Kalimantan', pop: 5.80 },
  { name: 'Sumatera Barat', island: 'Sumatera', pop: 5.76 },
  { name: 'Nusa Tenggara Timur', island: 'Nusa Tenggara', pop: 5.66 },
  { name: 'Nusa Tenggara Barat', island: 'Nusa Tenggara', pop: 5.60 },
  { name: 'Aceh', island: 'Sumatera', pop: 5.55 },
  { name: 'Bali', island: 'Bali', pop: 4.41 },
  { name: 'Kalimantan Selatan', island: 'Kalimantan', pop: 4.24 },
  { name: 'Kalimantan Timur', island: 'Kalimantan', pop: 3.92 },
  { name: 'DI Yogyakarta', island: 'Jawa', pop: 3.76 },
  { name: 'Jambi', island: 'Sumatera', pop: 3.62 },
  { name: 'Sulawesi Tengah', island: 'Sulawesi', pop: 3.11 },
  { name: 'Sulawesi Tenggara', island: 'Sulawesi', pop: 2.82 },
  { name: 'Kalimantan Tengah', island: 'Kalimantan', pop: 2.81 },
  { name: 'Sulawesi Utara', island: 'Sulawesi', pop: 2.72 },
  { name: 'Kepulauan Riau', island: 'Sumatera', pop: 2.18 },
  { name: 'Bengkulu', island: 'Sumatera', pop: 2.07 },
  { name: 'Maluku', island: 'Maluku', pop: 1.98 },
  { name: 'Sulawesi Barat', island: 'Sulawesi', pop: 1.57 },
  { name: 'Kep. Bangka Belitung', island: 'Sumatera', pop: 1.49 },
  { name: 'Papua Pegunungan', island: 'Papua', pop: 1.47 },
  { name: 'Maluku Utara', island: 'Maluku', pop: 1.41 },
  { name: 'Papua Tengah', island: 'Papua', pop: 1.35 },
  { name: 'Gorontalo', island: 'Sulawesi', pop: 1.25 },
  { name: 'Papua Barat', island: 'Papua', pop: 1.21 },
  { name: 'Papua', island: 'Papua', pop: 1.10 },
  { name: 'Kalimantan Utara', island: 'Kalimantan', pop: 0.73 },
  { name: 'Papua Barat Daya', island: 'Papua', pop: 0.61 },
  { name: 'Papua Selatan', island: 'Papua', pop: 0.54 }
];

SN.totalPop = SN.provinces.reduce(function (s, p) { return s + p.pop; }, 0);

SN.islands = ['Semua', 'Jawa', 'Sumatera', 'Kalimantan', 'Sulawesi', 'Bali', 'Nusa Tenggara', 'Maluku', 'Papua'];
