// main.ts — Statistik Nusantara, entri best-national-statistics-site (Node 22,
// hanya pustaka standar). Program ini menyerahkan situs: menyalin app/ dan
// screenshots/ dari samping berkas ini ke direktori keluaran, lalu menulis
// /output/dossier.json memakai buildDossier dari vendor/makefun-frontend.ts.
//
// Di luar kontainer grader, MAKEFUN_OUTPUT_DIR menggantikan /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// vendor/makefun-frontend.ts dibiarkan apa adanya: scorer mengharuskan
// dossier.json sama persis dengan yang ditulis salinannya sendiri.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// Batas-batas yang dipakai scorer (lihat kit): dossier menolak entri yang
// melewatinya, jadi program menolak lebih dulu dengan batas yang sama.
writeFileSync(
  join(outputDir, 'dossier.json'),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
