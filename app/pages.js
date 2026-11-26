/* pages.js — template tiap halaman dan pengikatan kontrolnya.
   Setiap halaman mengembalikan HTML; router.js menyisipkannya ke #view
   lalu memanggil fungsi bind yang sesuai. */

'use strict';

var SN = window.SN || {};
window.SN = SN;

SN.state = {
  year: 2024,          // tahun aktif di halaman Penduduk & Ekonomi
  provSort: { key: 'pop', dir: -1 },
  provSearch: '',
  provIsland: 'Semua',
  provCompare: [],     // nama provinsi yang dibandingkan (maks 3)
  homeTab: 'growth',    // tab grafik beranda: growth | population
  monthlyDesc: true   // urutan tabel inflasi bulanan: true = terbaru dulu
};

function num(n, dec) {
  var d = dec === undefined ? 1 : dec;
  return n.toFixed(d).replace('.', ',');
}

/* Bilangan bulat dengan pemisah ribuan titik (gaya Indonesia). */
function ribuan(n) {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function srcTag(source) {
  return '<span class="src">Sumber: ' + source + '</span>';
}

function yearOptions(selected) {
  return SN.years.map(function (y) {
    return '<option value="' + y + '"' + (y === selected ? ' selected' : '') + '>' + y + '</option>';
  }).join('');
}

function kpiCard(value, label, source) {
  return '<article class="kpi"><div class="kpi-value">' + value + '</div>' +
    '<div class="kpi-label">' + label + '</div>' +
    '<div class="kpi-src">' + source + '</div></article>';
}

function yearIndex(y) { return SN.years.indexOf(y); }

/* ---------------- Beranda ---------------- */
function homePage() {
  var k = SN.kpi;
  var tab = SN.state.homeTab;
  var chart = tab === 'growth'
    ? SN.charts.lineChart(SN.years.map(String), SN.series.gdpGrowth.values,
        { aria: 'Pertumbuhan ekonomi 2019-2024', color: SN.charts.colors.green, decimals: 2, height: 200 })
    : SN.charts.barChart(SN.years.map(String), SN.series.population.values,
        { aria: 'Jumlah penduduk 2019-2024', color: SN.charts.colors.terra, decimals: 1, height: 200 });
  var top5 = SN.provinces.slice(0, 5).map(function (p) {
    return { label: p.name, value: p.pop, text: num(p.pop, 2) + ' jt' };
  });
  return '' +
  '<section class="hero">' +
    '<h1>Indonesia dalam angka</h1>' +
    '<p class="lede">Statistik nasional Indonesia yang mudah dibaca: penduduk, ekonomi, ' +
    'provinsi, harga, dan tenaga kerja — setiap angka disertai sumber dan tahunnya.</p>' +
    '<p class="hero-meta">Data terakhir: 2024 &middot; 38 provinsi &middot; Diperbarui dari publikasi resmi BPS</p>' +
  '</section>' +
  '<section class="kpi-grid" aria-label="Indikator kunci">' +
    kpiCard(k.population.value, 'Penduduk', k.population.source) +
    kpiCard(k.gdp.value, 'PDB harga berlaku', k.gdp.source) +
    kpiCard(k.gdpGrowth.value, 'Pertumbuhan ekonomi', k.gdpGrowth.source) +
    kpiCard(k.gdpPerCapita.value, 'PDB per kapita', k.gdpPerCapita.source) +
    kpiCard(k.inflation.value, 'Inflasi tahunan', k.inflation.source) +
    kpiCard(k.unemployment.value, 'Pengangguran terbuka', k.unemployment.source) +
    kpiCard(k.poverty.value, 'Penduduk miskin', k.poverty.source) +
    kpiCard(k.hdi.value, 'Indeks Pembangunan Manusia', k.hdi.source) +
  '</section>' +
  '<section class="panel">' +
    '<div class="panel-head"><h2>Enam tahun terakhir</h2>' +
    '<div class="tabs" role="tablist">' +
      '<button type="button" class="tab' + (tab === 'growth' ? ' active' : '') + '" data-tab="growth">Pertumbuhan PDB</button>' +
      '<button type="button" class="tab' + (tab === 'population' ? ' active' : '') + '" data-tab="population">Penduduk</button>' +
    '</div></div>' +
    chart +
    '<p class="note">PDB tumbuh 5,03% pada 2024 setelah sempat terkontraksi -2,07% pada 2020 saat pandemi. ' +
    'Penduduk bertambah dari 268,1 juta (2019) menjadi 281,6 juta (2024). ' + srcTag('BPS 2024') + '</p>' +
  '</section>' +
  '<div class="two-col">' +
    '<section class="panel"><h2>Lima provinsi terpadat</h2>' +
      SN.charts.hbarChart(top5, { aria: 'Lima provinsi terpadat 2024', decimals: 2 }) +
      '<p class="note">Jawa Barat, Jawa Timur, dan Jawa Tengah menampung 129,6 juta jiwa — 46% penduduk Indonesia. ' +
      '<a href="#/provinsi">Lihat semua 38 provinsi &rarr;</a> ' + srcTag('BPS 2024') + '</p>' +
    '</section>' +
    '<section class="panel"><h2>Sorotan 2024</h2><ul class="highlights">' +
      '<li><strong>Inflasi 1,57%</strong> — terendah dalam enam tahun, dengan deflasi bulanan Mei–September 2024.</li>' +
      '<li><strong>Pengangguran 4,91%</strong> — terendah sejak 2019; 144,64 juta orang bekerja.</li>' +
      '<li><strong>Kemiskinan 8,57%</strong> — turun 0,79 poin dari 2023, level terendah yang pernah tercatat.</li>' +
      '<li><strong>IPM 75,02</strong> — naik 0,63 poin dari 2023; harapan hidup mencapai 74,2 tahun.</li>' +
    '</ul>' + srcTag('BPS 2024') + '</section>' +
  '</div>';
}

function bindHome() {
  var tabs = document.querySelectorAll('#view .tab');
  tabs.forEach(function (btn) {
    btn.addEventListener('click', function () {
      SN.state.homeTab = btn.getAttribute('data-tab');
      SN.router.render();
    });
  });
}

/* ---------------- Penduduk ---------------- */
function pendudukPage() {
  var y = SN.state.year, i = yearIndex(y);
  var pop = SN.series.population.values[i];
  var prev = i > 0 ? SN.series.population.values[i - 1] : null;
  var growth = prev ? ((pop - prev) / prev * 100) : null;
  var male = pop * (SN.sexSplit.male / SN.totalPop);
  var female = pop - male;
  var age = SN.ageGroups.map(function (a) {
    return { label: a.group + ' — ' + a.note, value: a.pct, text: num(a.pct, 1) + '%' };
  });
  return '' +
  '<section class="page-head"><h1>Penduduk</h1>' +
    '<p class="lede">Jumlah, sebaran umur, dan pertumbuhan penduduk Indonesia.</p>' +
    '<label class="year-pick">Tahun <select id="yearSelect">' + yearOptions(y) + '</select></label>' +
  '</section>' +
  '<section class="kpi-grid">' +
    kpiCard(num(pop, 1) + ' jt', 'Penduduk ' + y, 'BPS ' + y) +
    kpiCard(growth === null ? '—' : '+' + num(growth, 2) + '%', 'Pertumbuhan dari tahun lalu', 'BPS ' + y) +
    kpiCard(num(male, 1) + ' jt', 'Laki-laki', 'BPS 2024') +
    kpiCard(num(female, 1) + ' jt', 'Perempuan', 'BPS 2024') +
  '</section>' +
  '<section class="panel"><h2>Pertumbuhan penduduk 2019–2024</h2>' +
    SN.charts.lineChart(SN.years.map(String), SN.series.population.values,
      { aria: 'Jumlah penduduk 2019-2024', color: SN.charts.colors.green, decimals: 1 }) +
    '<p class="note">Penduduk bertambah rata-rata sekitar 2,7 juta jiwa per tahun. ' +
    'Laju pertumbuhan melambat dari 1,25% (2019) menjadi sekitar 1,0% (2024). ' + srcTag('BPS 2024') + '</p>' +
  '</section>' +
  '<div class="two-col">' +
    '<section class="panel"><h2>Struktur umur 2024</h2>' +
      SN.charts.hbarChart(age, { aria: 'Struktur umur penduduk 2024', decimals: 1, labelWidth: 230 }) +
      '<p class="note">68,7% penduduk berusia produktif (15–64 tahun) — bonus demografi masih berjalan. ' + srcTag('BPS 2024') + '</p>' +
    '</section>' +
    '<section class="panel"><h2>Komposisi jenis kelamin 2024</h2>' +
      SN.charts.donut([
        { value: SN.sexSplit.male, color: SN.charts.colors.green },
        { value: SN.sexSplit.female, color: SN.charts.colors.terra }
      ], { center: '50,4%', centerSub: 'laki-laki', aria: 'Penduduk menurut jenis kelamin 2024' }) +
      '<ul class="legend"><li><span class="sw green"></span>Laki-laki — 141,8 jt jiwa</li>' +
      '<li><span class="sw terra"></span>Perempuan — 139,8 jt jiwa</li></ul>' +
      '<p class="note">Rasio jenis kelamin 101,6 laki-laki per 100 perempuan. ' + srcTag('BPS 2024') + '</p>' +
    '</section>' +
  '</div>';
}

function bindYearSelect() {
  var sel = document.getElementById('yearSelect');
  if (sel) sel.addEventListener('change', function () {
    SN.state.year = parseInt(sel.value, 10);
    SN.router.render();
  });
}

/* ---------------- Ekonomi ---------------- */
function ekonomiPage() {
  var y = SN.state.year, i = yearIndex(y);
  var gdp = SN.series.gdpNominal.values[i];
  var growth = SN.series.gdpGrowth.values[i];
  var pop = SN.series.population.values[i];
  var perCapita = gdp * 1000 / pop; // Rp juta
  var topSectors = SN.sectors.slice(0, 10).map(function (s) {
    return { label: s.name, value: s.pct, text: num(s.pct, 1) + '%' };
  });
  var rest = SN.sectors.slice(10).reduce(function (s, x) { return s + x.pct; }, 0);
  topSectors.push({ label: 'Lapangan usaha lainnya', value: rest, text: num(rest, 1) + '%' });
  return '' +
  '<section class="page-head"><h1>Ekonomi</h1>' +
    '<p class="lede">Produk Domestik Bruto, pertumbuhan, dan struktur ekonomi Indonesia.</p>' +
    '<label class="year-pick">Tahun <select id="yearSelect">' + yearOptions(y) + '</select></label>' +
  '</section>' +
  '<section class="kpi-grid">' +
    kpiCard('Rp' + ribuan(gdp) + ' T', 'PDB harga berlaku ' + y, 'BPS ' + y) +
    kpiCard(num(growth, 2) + '%', 'Pertumbuhan ekonomi ' + y, 'BPS ' + y) +
    kpiCard('Rp' + num(perCapita, 1) + ' jt', 'PDB per kapita ' + y, 'BPS ' + y) +
    kpiCard(y === 2024 ? 'US$4.925' : '—', 'PDB per kapita (US$)', y === 2024 ? 'Bank Dunia 2024' : '—') +
  '</section>' +
  '<section class="panel"><h2>Pertumbuhan ekonomi 2019–2024</h2>' +
    SN.charts.barChart(SN.years.map(String), SN.series.gdpGrowth.values,
      { aria: 'Pertumbuhan PDB 2019-2024', decimals: 2 }) +
    '<p class="note">Kontraksi -2,07% pada 2020 adalah yang pertama sejak krisis 1998. ' +
    'Sejak 2022 pertumbuhan stabil di atas 5%. ' + srcTag('BPS 2024') + '</p>' +
  '</section>' +
  '<section class="panel"><h2>PDB menurut lapangan usaha, 2024</h2>' +
    SN.charts.hbarChart(topSectors, { aria: 'Pangsa lapangan usaha dalam PDB 2024', decimals: 1, labelWidth: 250 }) +
    '<p class="note">Industri pengolahan tetap penyumbang terbesar (18,7%), diikuti perdagangan (13,0%) ' +
    'dan pertanian (12,5%). ' + srcTag('BPS 2024') + '</p>' +
  '</section>';
}

/* ---------------- Provinsi ---------------- */
function filteredProvinces() {
  var q = SN.state.provSearch.trim().toLowerCase();
  var list = SN.provinces.filter(function (p) {
    var okIsland = SN.state.provIsland === 'Semua' || p.island === SN.state.provIsland;
    var okQ = !q || p.name.toLowerCase().indexOf(q) !== -1;
    return okIsland && okQ;
  });
  var key = SN.state.provSort.key, dir = SN.state.provSort.dir;
  list.sort(function (a, b) {
    if (key === 'name') return dir * a.name.localeCompare(b.name, 'id');
    if (key === 'island') return dir * a.island.localeCompare(b.island, 'id');
    return dir * (a.pop - b.pop);
  });
  return list;
}

function provinsiPage() {
  var list = filteredProvinces();
  var sort = SN.state.provSort;
  function th(key, label) {
    var arrow = sort.key === key ? (sort.dir === 1 ? ' ▲' : ' ▼') : '';
    return '<th><button type="button" class="sort-btn" data-sort="' + key + '">' + label + arrow + '</button></th>';
  }
  var rows = list.map(function (p, idx) {
    var share = p.pop / SN.totalPop * 100;
    var checked = SN.state.provCompare.indexOf(p.name) !== -1;
    return '<tr><td>' + (idx + 1) + '</td><td>' + p.name + '</td><td>' + p.island + '</td>' +
      '<td class="num">' + num(p.pop, 2) + '</td><td class="num">' + num(share, 2) + '%</td>' +
      '<td><label class="cmp"><input type="checkbox" data-compare="' + p.name + '"' + (checked ? ' checked' : '') + '> Bandingkan</label></td></tr>';
  }).join('');
  var compareHtml = '';
  if (SN.state.provCompare.length) {
    var items = SN.state.provCompare.map(function (name) {
      var p = SN.provinces.find(function (x) { return x.name === name; });
      return { label: p.name, value: p.pop, text: num(p.pop, 2) + ' jt' };
    });
    compareHtml = '<section class="panel" id="comparePanel"><h2>Perbandingan provinsi</h2>' +
      SN.charts.hbarChart(items, { aria: 'Perbandingan penduduk provinsi terpilih', decimals: 2, labelWidth: 190 }) +
      '<p class="note">Pilih sampai 3 provinsi dengan kotak centang di tabel. ' + srcTag('BPS 2024') + '</p></section>';
  }
  return '' +
  '<section class="page-head"><h1>Provinsi</h1>' +
    '<p class="lede">Penduduk 38 provinsi, 2024. Klik judul kolom untuk mengurutkan, ' +
    'ketik untuk mencari, atau centang sampai 3 provinsi untuk membandingkan.</p>' +
  '</section>' +
  '<section class="panel"><div class="filters">' +
    '<label>Cari <input type="search" id="provSearch" placeholder="Nama provinsi…" value="' + SN.state.provSearch.replace(/"/g, '&quot;') + '"></label>' +
    '<label>Pulau <select id="provIsland">' + SN.islands.map(function (is) {
      return '<option' + (is === SN.state.provIsland ? ' selected' : '') + '>' + is + '</option>';
    }).join('') + '</select></label>' +
    '<span class="count">' + list.length + ' dari 38 provinsi &middot; total ' + num(SN.totalPop, 2) + ' jt jiwa</span>' +
    '<button type="button" class="btn" id="csvBtn">Unduh CSV</button>' +
  '</div>' +
  '<div class="table-wrap"><table><thead><tr><th>#</th>' + th('name', 'Provinsi') + th('island', 'Pulau') +
    th('pop', 'Penduduk (juta)') + '<th>Pangsa</th><th></th></tr></thead><tbody>' +
    (rows || '<tr><td colspan="6">Tidak ada provinsi yang cocok dengan pencarian.</td></tr>') +
    '</tbody></table></div>' +
  '<p class="note">Penduduk per provinsi 2024; pangsa dihitung dari total nasional 281,6 juta jiwa. ' + srcTag('BPS 2024') + '</p></section>' +
  compareHtml;
}

function bindProvinsi() {
  var csvBtn = document.getElementById('csvBtn');
  if (csvBtn) csvBtn.addEventListener('click', downloadProvinsiCsv);
  var search = document.getElementById('provSearch');
  if (search) search.addEventListener('input', function () {
    SN.state.provSearch = search.value;
    SN.router.renderKeepFocus('provSearch');
  });
  var island = document.getElementById('provIsland');
  if (island) island.addEventListener('change', function () {
    SN.state.provIsland = island.value;
    SN.router.render();
  });
  document.querySelectorAll('#view .sort-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.getAttribute('data-sort');
      if (SN.state.provSort.key === key) SN.state.provSort.dir *= -1;
      else SN.state.provSort = { key: key, dir: key === 'name' ? 1 : -1 };
      SN.router.render();
    });
  });
  document.querySelectorAll('#view input[data-compare]').forEach(function (box) {
    box.addEventListener('change', function () {
      var name = box.getAttribute('data-compare');
      var i = SN.state.provCompare.indexOf(name);
      if (box.checked && i === -1) {
        if (SN.state.provCompare.length >= 3) { box.checked = false; return; }
        SN.state.provCompare.push(name);
      } else if (!box.checked && i !== -1) {
        SN.state.provCompare.splice(i, 1);
      }
      SN.router.render();
    });
  });
}

/* Unduh tabel provinsi yang sedang tampil (sesuai filter & urutan aktif)
   sebagai CSV. Pemisah titik koma karena angka memakai koma desimal;
   BOM UTF-8 agar Excel membukanya dengan benar. Tanpa jaringan. */
function downloadProvinsiCsv() {
  var list = filteredProvinces();
  var lines = ['Provinsi;Pulau;Penduduk (juta jiwa);Pangsa (%)'];
  list.forEach(function (p) {
    lines.push(p.name + ';' + p.island + ';' + num(p.pop, 2) + ';' +
      num(p.pop / SN.totalPop * 100, 2));
  });
  var blob = new Blob(['\ufeff' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'statistik-nusantara-provinsi-2024.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ---------------- Harga & Inflasi ---------------- */
function hargaPage() {
  return '' +
  '<section class="page-head"><h1>Harga &amp; Inflasi</h1>' +
    '<p class="lede">Perkembangan harga konsumen (IHK) dan inflasi tahunan Indonesia.</p>' +
  '</section>' +
  '<section class="kpi-grid">' +
    kpiCard('1,57%', 'Inflasi 2024 (y-on-y)', 'BPS 2024') +
    kpiCard('2,61%', 'Inflasi 2023 (y-on-y)', 'BPS 2023') +
    kpiCard('5,51%', 'Inflasi 2022 (y-on-y)', 'BPS 2022') +
    kpiCard('0,44%', 'Inflasi Des 2024 (m-to-m)', 'BPS 2024') +
  '</section>' +
  '<section class="panel"><h2>Inflasi tahunan 2019–2024</h2>' +
    SN.charts.lineChart(SN.years.map(String), SN.series.inflation.values,
      { aria: 'Inflasi tahunan 2019-2024', color: SN.charts.colors.terra, decimals: 2 }) +
    '<p class="note">Lonjakan 2022 (5,51%) mengikuti penyesuaian harga BBM bersubsidi pada September 2022. ' +
    'Pada 2024 inflasi kembali ke 1,57%, terendah dalam enam tahun. ' + srcTag('BPS 2024') + '</p>' +
  '</section>' +
  '<section class="panel"><h2>Inflasi bulanan 2024 (month-to-month)</h2>' +
    SN.charts.barChart(SN.monthlyInflation2024.map(function (d) { return d.m; }),
      SN.monthlyInflation2024.map(function (d) { return d.v; }),
      { aria: 'Inflasi bulanan 2024', decimals: 2, color: SN.charts.colors.gold }) +
    '<p class="note">Deflasi terjadi lima bulan berturut-turut (Mei–September 2024), terutama karena turunnya ' +
    'harga pangan seperti beras, cabai, dan bawang merah setelah panen raya. ' + srcTag('BPS 2024') + '</p>' +
  '</section>' +
  '<section class="panel"><div class="panel-head"><h2>Inflasi bulanan 2024 — tabel</h2>' +
    '<button type="button" class="btn" id="monthlySortBtn">' + (SN.state.monthlyDesc ? 'Terbaru dulu \u25bc' : 'Terlama dulu \u25b2') + '</button></div>' +
    '<div class="table-wrap"><table id="monthlyTable"><thead><tr><th>Bulan</th><th class="num">Inflasi (m-to-m)</th><th>Keterangan</th></tr></thead><tbody>' +
    monthlyRows() +
    '</tbody></table></div>' +
    '<p class="note">Urutkan dari bulan terbaru atau terlama dengan tombol di atas. Nilai negatif berarti deflasi. ' + srcTag('BPS 2024') + '</p></section>' +
  '<section class="panel"><h2>Yang perlu diketahui</h2><ul class="highlights">' +
    '<li>Inflasi diukur dari Indeks Harga Konsumen (IHK) di 90 kota, mencakup 11 kelompok pengeluaran.</li>' +
    '<li>Sasaran inflasi Bank Indonesia 2024: 2,5% ± 1% — realisasi 1,57% berada di bawah batas bawah sasaran.</li>' +
    '<li>Kelompok makanan, minuman, dan tembakau memberi andil terbesar pada pergerakan IHK 2024.</li>' +
  '</ul>' + srcTag('BPS &amp; Bank Indonesia 2024') + '</section>';
}

/* Nama bulan lengkap untuk tabel inflasi bulanan. */
var MONTH_NAMES = { Jan: 'Januari', Feb: 'Februari', Mar: 'Maret', Apr: 'April',
  Mei: 'Mei', Jun: 'Juni', Jul: 'Juli', Agu: 'Agustus', Sep: 'September',
  Okt: 'Oktober', Nov: 'November', Des: 'Desember' };

/* Baris tabel inflasi bulanan, diurutkan sesuai SN.state.monthlyDesc
   (true = Desember ke Januari, terbaru dulu). */
function monthlyRows() {
  var data = SN.monthlyInflation2024.slice();
  if (SN.state.monthlyDesc) data.reverse();
  return data.map(function (d) {
    return '<tr><td>' + MONTH_NAMES[d.m] + ' 2024</td><td class="num">' + num(d.v, 2) + '%</td><td>' +
      (d.v < 0 ? 'Deflasi' : d.v === 0 ? 'Stabil' : 'Inflasi') + '</td></tr>';
  }).join('');
}

function bindHarga() {
  var btn = document.getElementById('monthlySortBtn');
  if (btn) btn.addEventListener('click', function () {
    SN.state.monthlyDesc = !SN.state.monthlyDesc;
    btn.textContent = SN.state.monthlyDesc ? 'Terbaru dulu \u25bc' : 'Terlama dulu \u25b2';
    var tbody = document.querySelector('#monthlyTable tbody');
    if (tbody) tbody.innerHTML = monthlyRows();
  });
}

/* ---------------- Tenaga Kerja ---------------- */
function tenagaKerjaPage() {
  var l = SN.labour;
  var sectors = l.bySector.map(function (s) {
    return { label: s.name, value: s.pct, text: num(s.pct, 1) + '%' };
  });
  return '' +
  '<section class="page-head"><h1>Tenaga Kerja</h1>' +
    '<p class="lede">Angkatan kerja, pengangguran, dan lapangan pekerjaan — Agustus 2024.</p>' +
  '</section>' +
  '<section class="kpi-grid">' +
    kpiCard(num(l.workforce, 2) + ' jt', 'Angkatan kerja', 'BPS, Agu 2024') +
    kpiCard(num(l.employed, 2) + ' jt', 'Penduduk bekerja', 'BPS, Agu 2024') +
    kpiCard(num(l.unemployed, 2) + ' jt', 'Pengangguran', 'BPS, Agu 2024') +
    kpiCard(num(l.lfpr, 2) + '%', 'Tingkat partisipasi (TPAK)', 'BPS, Agu 2024') +
  '</section>' +
  '<section class="panel"><h2>Tingkat pengangguran terbuka 2019–2024</h2>' +
    SN.charts.lineChart(SN.years.map(String), SN.series.unemployment.values,
      { aria: 'Tingkat pengangguran 2019-2024', color: SN.charts.colors.green, decimals: 2 }) +
    '<p class="note">Pengangguran melonjak ke 7,07% pada 2020 saat pandemi, lalu turun bertahap hingga 4,91% ' +
    'pada Agustus 2024 — terendah sejak 2019. ' + srcTag('BPS, Agustus 2024') + '</p>' +
  '</section>' +
  '<div class="two-col">' +
    '<section class="panel"><h2>Pekerja menurut lapangan usaha</h2>' +
      SN.charts.hbarChart(sectors, { aria: 'Pekerja menurut lapangan usaha Agustus 2024', decimals: 1, labelWidth: 230 }) +
      '<p class="note">Pertanian masih menyerap pekerja terbanyak (28,4%), diikuti perdagangan (18,9%). ' + srcTag('BPS, Agustus 2024') + '</p>' +
    '</section>' +
    '<section class="panel"><h2>Formal vs informal</h2>' +
      SN.charts.donut([
        { value: l.formalPct, color: SN.charts.colors.green },
        { value: l.informalPct, color: SN.charts.colors.gold }
      ], { center: num(l.informalPct, 1) + '%', centerSub: 'informal', aria: 'Pekerja formal dan informal' }) +
      '<ul class="legend"><li><span class="sw green"></span>Formal — 40,88% (59,12 jt orang)</li>' +
      '<li><span class="sw gold"></span>Informal — 59,12% (85,51 jt orang)</li></ul>' +
      '<p class="note">Mayoritas pekerja Indonesia masih bekerja di sektor informal. ' + srcTag('BPS, Agustus 2024') + '</p>' +
    '</section>' +
  '</div>';
}

/* ---------------- Metodologi & Sumber ---------------- */
function metodologiPage() {
  return '' +
  '<section class="page-head"><h1>Metodologi &amp; Sumber</h1>' +
    '<p class="lede">Dari mana angka-angka di situs ini berasal, dan bagaimana angka itu dihitung.</p>' +
  '</section>' +
  '<section class="panel"><h2>Sumber data</h2>' +
  '<table><thead><tr><th>Indikator</th><th>Sumber</th><th>Terbit</th></tr></thead><tbody>' +
  '<tr><td>Penduduk &amp; struktur umur</td><td>Badan Pusat Statistik (BPS) — proyeksi penduduk</td><td>2024</td></tr>' +
  '<tr><td>PDB &amp; pertumbuhan ekonomi</td><td>BPS — Berita Resmi Statistik, PDB Triwulanan</td><td>2024</td></tr>' +
  '<tr><td>PDB per kapita (US$)</td><td>Bank Dunia — World Development Indicators</td><td>2024</td></tr>' +
  '<tr><td>Inflasi &amp; IHK</td><td>BPS — Berita Resmi Statistik, IHK</td><td>2024</td></tr>' +
  '<tr><td>Pengangguran &amp; ketenagakerjaan</td><td>BPS — Survei Angkatan Kerja Nasional (Sakernas)</td><td>Agustus 2024</td></tr>' +
  '<tr><td>Kemiskinan</td><td>BPS — Profil Kemiskinan di Indonesia</td><td>September 2024</td></tr>' +
  '<tr><td>Indeks Pembangunan Manusia</td><td>BPS — Indeks Pembangunan Manusia</td><td>2024</td></tr>' +
  '<tr><td>Penduduk provinsi</td><td>BPS — Statistik Indonesia &amp; proyeksi provinsi</td><td>2024</td></tr>' +
  '</tbody></table></section>' +
  '<section class="panel"><h2>Catatan metode</h2><ul class="highlights">' +
    '<li>Angka penduduk 2024 adalah proyeksi BPS berbasis Sensus Penduduk 2020; jumlah 38 provinsi (281,67 juta) selaras dengan total nasional 281,6 juta.</li>' +
    '<li>Pertumbuhan PDB dihitung year-on-year atas PDB harga konstan 2010; PDB per kapita = PDB harga berlaku dibagi jumlah penduduk.</li>' +
    '<li>Inflasi adalah perubahan Indeks Harga Konsumen (IHK) year-on-year; inflasi bulanan adalah perubahan month-to-month.</li>' +
    '<li>Tingkat pengangguran terbuka (TPT) dan TPAK diukur setiap Februari dan Agustus melalui Sakernas; angka di situs ini memakai Agustus.</li>' +
    '<li>Garis kemiskinan memakai pendekatan kebutuhan dasar (makanan dan non-makanan) per kapita per bulan.</li>' +
    '<li>Angka dibulatkan ke satu atau dua desimal; karena pembulatan, jumlah pangsa dapat berbeda 0,1 poin dari 100%.</li>' +
  '</ul></section>' +
  '<section class="panel"><h2>Tentang situs ini</h2>' +
  '<p>Statistik Nusantara adalah situs statistik independen yang menyajikan angka-angka resmi Indonesia ' +
  'dalam bentuk yang mudah dibaca. Situs ini bukan situs resmi pemerintah dan tidak berafiliasi dengan BPS ' +
  'atau lembaga mana pun; seluruh angka dikutip dari publikasi resmi yang tercantum di atas. ' +
  'Situs ini berjalan sepenuhnya dari berkas statisnya sendiri, tanpa permintaan jaringan, ' +
  'dan dapat dibuka di desktop maupun ponsel.</p></section>';
}

SN.pages = {
  home: { render: homePage, bind: bindHome },
  penduduk: { render: pendudukPage, bind: bindYearSelect },
  ekonomi: { render: ekonomiPage, bind: bindYearSelect },
  provinsi: { render: provinsiPage, bind: bindProvinsi },
  harga: { render: hargaPage, bind: bindHarga },
  tenagaKerja: { render: tenagaKerjaPage, bind: null },
  metodologi: { render: metodologiPage, bind: null }
};
