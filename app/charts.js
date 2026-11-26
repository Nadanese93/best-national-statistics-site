/* charts.js — grafik SVG buatan sendiri, tanpa library.
   Semua fungsi mengembalikan string SVG yang bisa disisipkan ke halaman.
   Warna mengikuti palet situs (hijau nusantara, terakota, emas). */

'use strict';

var SN = window.SN || {};
window.SN = SN;

SN.charts = (function () {
  var GREEN = '#0e5a41';
  var GREEN_LIGHT = '#2e8b6a';
  var TERRA = '#c65a2e';
  var GOLD = '#d9a441';
  var GRID = '#d8ddd5';
  var INK = '#22302a';
  var MUTED = '#6b7a72';

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  }

  function niceMax(values) {
    var m = Math.max.apply(null, values.map(Math.abs));
    if (m <= 0) return 1;
    var pow = Math.pow(10, Math.floor(Math.log10(m)));
    var n = m / pow;
    var step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
    return step * pow;
  }

  /* Grafik garis dengan titik dan label nilai. */
  function lineChart(labels, values, opts) {
    opts = opts || {};
    var w = opts.width || 720, h = opts.height || 260;
    var padL = 52, padR = 16, padT = 22, padB = 34;
    var iw = w - padL - padR, ih = h - padT - padB;
    var min = opts.min !== undefined ? opts.min : Math.min(0, Math.min.apply(null, values));
    var max = opts.max !== undefined ? opts.max : niceMax(values);
    function x(i) { return padL + (iw * i) / (labels.length - 1); }
    function y(v) { return padT + ih - ((v - min) / (max - min)) * ih; }

    var out = [];
    out.push('<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(opts.aria || 'Grafik garis') + '" class="chart">');
    // garis grid + label sumbu Y
    for (var g = 0; g <= 4; g++) {
      var gv = min + ((max - min) * g) / 4;
      var gy = y(gv);
      out.push('<line x1="' + padL + '" y1="' + gy.toFixed(1) + '" x2="' + (w - padR) + '" y2="' + gy.toFixed(1) + '" stroke="' + GRID + '" stroke-width="1"/>');
      out.push('<text x="' + (padL - 8) + '" y="' + (gy + 4).toFixed(1) + '" text-anchor="end" class="axis">' + fmt(gv, opts.decimals) + '</text>');
    }
    var pts = values.map(function (v, i) { return x(i).toFixed(1) + ',' + y(v).toFixed(1); }).join(' ');
    out.push('<polyline points="' + pts + '" fill="none" stroke="' + (opts.color || GREEN) + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>');
    values.forEach(function (v, i) {
      out.push('<circle cx="' + x(i).toFixed(1) + '" cy="' + y(v).toFixed(1) + '" r="4.5" fill="#fff" stroke="' + (opts.color || GREEN) + '" stroke-width="2.5"/>');
      out.push('<text x="' + x(i).toFixed(1) + '" y="' + (y(v) - 11).toFixed(1) + '" text-anchor="middle" class="val">' + fmt(v, opts.decimals) + '</text>');
      out.push('<text x="' + x(i).toFixed(1) + '" y="' + (h - 10) + '" text-anchor="middle" class="axis">' + esc(labels[i]) + '</text>');
    });
    out.push('</svg>');
    return out.join('');
  }

  /* Grafik batang vertikal. */
  function barChart(labels, values, opts) {
    opts = opts || {};
    var w = opts.width || 720, h = opts.height || 260;
    var padL = 52, padR = 12, padT = 26, padB = 34;
    var iw = w - padL - padR, ih = h - padT - padB;
    var min = Math.min(0, Math.min.apply(null, values));
    var max = niceMax(values);
    var slot = iw / labels.length;
    var bw = Math.min(56, slot * 0.62);
    function y(v) { return padT + ih - ((v - min) / (max - min)) * ih; }

    var out = [];
    out.push('<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(opts.aria || 'Grafik batang') + '" class="chart">');
    for (var g = 0; g <= 4; g++) {
      var gv = min + ((max - min) * g) / 4;
      var gy = y(gv);
      out.push('<line x1="' + padL + '" y1="' + gy.toFixed(1) + '" x2="' + (w - padR) + '" y2="' + gy.toFixed(1) + '" stroke="' + GRID + '" stroke-width="1"/>');
      out.push('<text x="' + (padL - 8) + '" y="' + (gy + 4).toFixed(1) + '" text-anchor="end" class="axis">' + fmt(gv, opts.decimals) + '</text>');
    }
    values.forEach(function (v, i) {
      var bx = padL + slot * i + (slot - bw) / 2;
      var neg = v < 0;
      var color = neg ? TERRA : (opts.color || GREEN);
      var top = neg ? y(0) : y(v);
      var ht = Math.abs(y(v) - y(0));
      out.push('<rect x="' + bx.toFixed(1) + '" y="' + top.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + Math.max(ht, 1).toFixed(1) + '" rx="3" fill="' + color + '"/>');
      out.push('<text x="' + (bx + bw / 2).toFixed(1) + '" y="' + (neg ? y(v) + 16 : top - 8).toFixed(1) + '" text-anchor="middle" class="val">' + fmt(v, opts.decimals) + '</text>');
      out.push('<text x="' + (bx + bw / 2).toFixed(1) + '" y="' + (h - 10) + '" text-anchor="middle" class="axis">' + esc(labels[i]) + '</text>');
    });
    out.push('</svg>');
    return out.join('');
  }

  /* Grafik batang horizontal berlabel (untuk peringkat / pangsa). */
  function hbarChart(items, opts) {
    opts = opts || {};
    var w = opts.width || 720;
    var rowH = opts.rowHeight || 34;
    var labelW = opts.labelWidth || 210;
    var h = opts.height || (items.length * rowH + 16);
    var max = opts.max || Math.max.apply(null, items.map(function (d) { return d.value; }));
    var out = [];
    out.push('<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(opts.aria || 'Grafik batang horizontal') + '" class="chart">');
    items.forEach(function (d, i) {
      var y = 8 + i * rowH;
      var bw = ((w - labelW - 64) * d.value) / max;
      out.push('<text x="0" y="' + (y + 15) + '" class="hbar-label">' + esc(d.label) + '</text>');
      out.push('<rect x="' + labelW + '" y="' + y + '" width="' + Math.max(bw, 2).toFixed(1) + '" height="20" rx="4" fill="' + (d.color || (i === 0 ? TERRA : GREEN)) + '"/>');
      out.push('<text x="' + (labelW + bw + 8).toFixed(1) + '" y="' + (y + 15) + '" class="val">' + esc(d.text || fmt(d.value, opts.decimals)) + '</text>');
    });
    out.push('</svg>');
    return out.join('');
  }

  /* Diagram donat dua bagian (mis. formal vs informal). */
  function donut(parts, opts) {
    opts = opts || {};
    var size = opts.size || 220;
    var r = size / 2 - 14, cx = size / 2, cy = size / 2;
    var total = parts.reduce(function (s, p) { return s + p.value; }, 0);
    var out = [];
    out.push('<svg viewBox="0 0 ' + size + ' ' + size + '" role="img" aria-label="' + esc(opts.aria || 'Diagram donat') + '" class="chart donut">');
    var start = -Math.PI / 2;
    parts.forEach(function (p) {
      var frac = p.value / total;
      var end = start + frac * Math.PI * 2;
      var x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
      var x2 = cx + r * Math.cos(end), y2 = cy + r * Math.sin(end);
      var large = frac > 0.5 ? 1 : 0;
      out.push('<path d="M ' + cx + ' ' + cy + ' L ' + x1.toFixed(1) + ' ' + y1.toFixed(1) +
        ' A ' + r + ' ' + r + ' 0 ' + large + ' 1 ' + x2.toFixed(1) + ' ' + y2.toFixed(1) + ' Z" fill="' + p.color + '"/>');
      start = end;
    });
    out.push('<circle cx="' + cx + '" cy="' + cy + '" r="' + (r * 0.58).toFixed(1) + '" fill="#fffdf7"/>');
    out.push('<text x="' + cx + '" y="' + (cy - 2) + '" text-anchor="middle" class="donut-big">' + esc(opts.center || '') + '</text>');
    out.push('<text x="' + cx + '" y="' + (cy + 18) + '" text-anchor="middle" class="axis">' + esc(opts.centerSub || '') + '</text>');
    out.push('</svg>');
    return out.join('');
  }

  function fmt(v, decimals) {
    var d = decimals === undefined ? 1 : decimals;
    var s = v.toFixed(d);
    return s.replace('.', ',');
  }

  return {
    lineChart: lineChart,
    barChart: barChart,
    hbarChart: hbarChart,
    donut: donut,
    colors: { green: GREEN, greenLight: GREEN_LIGHT, terra: TERRA, gold: GOLD, ink: INK, muted: MUTED }
  };
})();
