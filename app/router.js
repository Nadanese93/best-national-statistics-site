/* router.js — routing hash dan perenderan halaman.
   Rute: #/ (beranda), #/penduduk, #/ekonomi, #/provinsi, #/harga,
   #/tenaga-kerja, #/metodologi. Rute tak dikenal kembali ke beranda. */

'use strict';

var SN = window.SN || {};
window.SN = SN;

SN.router = (function () {
  var routes = {
    '': 'home',
    'penduduk': 'penduduk',
    'ekonomi': 'ekonomi',
    'provinsi': 'provinsi',
    'harga': 'harga',
    'tenaga-kerja': 'tenagaKerja',
    'metodologi': 'metodologi'
  };

  var titles = {
    home: 'Statistik Nusantara — Indonesia dalam angka',
    penduduk: 'Penduduk — Statistik Nusantara',
    ekonomi: 'Ekonomi — Statistik Nusantara',
    provinsi: 'Provinsi — Statistik Nusantara',
    harga: 'Harga & Inflasi — Statistik Nusantara',
    tenagaKerja: 'Tenaga Kerja — Statistik Nusantara',
    metodologi: 'Metodologi & Sumber — Statistik Nusantara'
  };

  function currentKey() {
    var hash = window.location.hash || '#/';
    var path = hash.replace(/^#\/?/, '').replace(/\/$/, '');
    return routes[path] || 'home';
  }

  function render(focusId) {
    var key = currentKey();
    var page = SN.pages[key];
    var view = document.getElementById('view');
    view.innerHTML = page.render();
    document.title = titles[key];
    // Tandai tautan navigasi yang aktif.
    document.querySelectorAll('.nav a').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      var route = href.replace(/^#\/?/, '').replace(/\/$/, '');
      a.classList.toggle('active', (routes[route] || 'home') === key);
    });
    if (page.bind) page.bind();
    if (focusId) {
      var el = document.getElementById(focusId);
      if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
    }
    window.scrollTo(0, 0);
  }

  // Render ulang sambil menjaga fokus (dipakai saat mengetik di kotak cari).
  function renderKeepFocus(focusId) {
    render(focusId);
  }

  function init() {
    window.addEventListener('hashchange', function () { render(); });
    render();
  }

  return { render: render, renderKeepFocus: renderKeepFocus, init: init, currentKey: currentKey };
})();

document.addEventListener('DOMContentLoaded', function () {
  SN.router.init();
});
