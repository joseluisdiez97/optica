#!/usr/bin/env node
// Fase 9: convierte assets/originales/ a WebP en assets/. No toca los originales.
// Uso: node .claude/skills/rediseno-web/scripts/optimizar.mjs [anchoRetrato=900] [anchoFondo=1600]
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const ORIG = 'assets/originales', DEST = 'assets';
const RETRATO = parseInt(process.argv[2] || '900', 10);
const FONDO = parseInt(process.argv[3] || '1600', 10);
const LIMITE_PNG = 80 * 1024;

const archivos = (await fs.readdir(ORIG)).filter(f => /\.(jpe?g|png|webp|avif|gif|tiff?)$/i.test(f));
let antes = 0, despues = 0;
const filas = [];

for (const f of archivos) {
  const src = path.join(ORIG, f);
  const { size } = await fs.stat(src);
  antes += size;
  const img = sharp(src, { animated: false });
  const meta = await img.metadata();
  const ext = path.extname(f).toLowerCase();

  // Logos/PNG con transparencia que ya pesan poco: se copian tal cual
  if ((ext === '.png' || ext === '.gif') && meta.hasAlpha && size < LIMITE_PNG) {
    await fs.copyFile(src, path.join(DEST, f));
    despues += size;
    filas.push([f, size, size, 'copiado (transparencia, ligero)']);
    continue;
  }
  const esRetrato = (meta.height ?? 0) > (meta.width ?? 0);
  const ancho = Math.min(meta.width ?? FONDO, esRetrato ? RETRATO : FONDO);
  const out = path.join(DEST, path.parse(f).name + '.webp');
  await img.resize({ width: ancho, withoutEnlargement: true }).webp({ quality: 78 }).toFile(out);
  const { size: nuevo } = await fs.stat(out);
  despues += nuevo;
  filas.push([f, size, nuevo, `${esRetrato ? 'retrato' : 'fondo'} → ${ancho}px webp`]);
}

const kb = n => (n / 1024).toFixed(0).padStart(6) + ' KB';
console.log('Archivo'.padEnd(40), 'Antes'.padStart(9), 'Después'.padStart(9), ' Nota');
for (const [f, a, d, n] of filas) console.log(f.slice(0, 39).padEnd(40), kb(a), kb(d), ' ' + n);
console.log(`\nTOTAL imágenes: ${kb(antes)} → ${kb(despues)} (${antes ? Math.round((1 - despues / antes) * 100) : 0}% menos)`);
