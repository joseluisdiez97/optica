#!/usr/bin/env node
// Fase 1: descarga la web renderizada (portada + páginas del menú) e imágenes.
// Uso: node .claude/skills/rediseno-web/scripts/descargar.mjs https://ejemplo.com [maxPaginas]
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const inicio = process.argv[2];
const maxPaginas = parseInt(process.argv[3] || '15', 10);
if (!inicio) { console.error('Uso: node descargar.mjs <URL> [maxPaginas]'); process.exit(1); }

const base = new URL(inicio);
const DIR_HTML = 'docs/original';
const DIR_IMG = 'assets/originales';
await fs.mkdir(DIR_HTML, { recursive: true });
await fs.mkdir(DIR_IMG, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const imagenes = new Map(); // url -> bytes
page.on('response', async (res) => {
  try {
    const ct = res.headers()['content-type'] || '';
    if (ct.startsWith('image/') && res.ok()) {
      const buf = await res.body();
      imagenes.set(res.url(), buf);
    }
  } catch {}
});

const slug = (u) => {
  const p = new URL(u).pathname.replace(/\/$/, '').replace(/\.(html?|php|aspx?)$/i, '') || '/index';
  return p.replace(/^\//, '').replace(/[^\w.-]+/g, '_') || 'index';
};

async function cargar(url) {
  const bytes = { total: 0 };
  const onRes = async (r) => { try { const b = await r.body(); bytes.total += b.length; } catch {} };
  page.on('response', onRes);
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
  } catch (e) {
    if (!/Timeout/i.test(e.message)) throw e; // error real (sin red, DNS…)
    console.warn('  (la página no deja de cargar; sigo con lo que hay)');
    await page.waitForLoadState('load').catch(() => {});
  }
  // Bajar poco a poco para disparar lazy-load
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 150)); }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(800);
  page.off('response', onRes);
  return bytes.total;
}

const medidas = { origen: inicio, fecha: new Date().toISOString(), paginas: [] };

// Portada
const pesoPortada = await cargar(inicio);
const enlacesMenu = await page.evaluate((host) => {
  const sel = 'nav a[href], header a[href], [role="navigation"] a[href]';
  let as = [...document.querySelectorAll(sel)];
  if (as.length === 0) as = [...document.querySelectorAll('a[href]')];
  return [...new Set(as.map(a => a.href.split('#')[0]))].filter(h => { try { return new URL(h).host === host; } catch { return false; } });
}, base.host);

const cola = [inicio.split('#')[0], ...enlacesMenu.filter(u => u !== inicio.split('#')[0])].slice(0, maxPaginas);
const vistos = new Set();

for (const url of cola) {
  if (vistos.has(url)) continue;
  vistos.add(url);
  const peso = url === cola[0] ? pesoPortada : await cargar(url).catch(e => { console.warn('Fallo', url, e.message); return null; });
  if (peso === null) continue;
  const html = await page.content();
  const nombre = slug(url) + '.html';
  await fs.writeFile(path.join(DIR_HTML, nombre), html);
  const texto = await page.evaluate(() => document.body.innerText);
  await fs.writeFile(path.join(DIR_HTML, slug(url) + '.txt'), texto);

  const info = await page.evaluate(() => ({
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.content ?? null,
    imgsSinAlt: [...document.images].filter(i => !i.hasAttribute('alt') || i.alt.trim() === '').map(i => i.currentSrc || i.src),
    formularios: [...document.forms].map(f => ({ action: f.getAttribute('action'), method: f.method,
      campos: [...f.elements].filter(e => e.name || e.id).map(e => ({ tipo: e.type, name: e.name, id: e.id, label: e.labels?.[0]?.innerText ?? null })) })),
    mailto: [...document.querySelectorAll('a[href^="mailto:"]')].map(a => a.href),
    tel: [...document.querySelectorAll('a[href^="tel:"]')].map(a => a.href),
    externos: [...new Set([...document.querySelectorAll('a[href^="http"]')].map(a => a.href).filter(h => !h.includes(location.host)))],
    legales: [...document.querySelectorAll('a')].map(a => a.innerText.trim()).filter(t => /legal|privacidad|cookies|privacy/i.test(t)),
    fuentes: [...new Set([...document.querySelectorAll('link[href*="fonts"]')].map(l => l.href))],
  }));

  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(400);
  const desborde390 = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  await page.screenshot({ path: path.join(DIR_HTML, slug(url) + '-390.png'), fullPage: true });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({ path: path.join(DIR_HTML, slug(url) + '-1440.png'), fullPage: true });

  medidas.paginas.push({ url, archivo: nombre, pesoBytes: peso, desborde390, ...info });
  console.log('✓', url);
}

// Guardar imágenes conservando nombres
const pesosImg = [];
for (const [u, buf] of imagenes) {
  let nombre = decodeURIComponent(path.basename(new URL(u).pathname)) || 'imagen';
  if (!path.extname(nombre)) nombre += '.img';
  let destino = path.join(DIR_IMG, nombre), n = 1;
  while (await fs.access(destino).then(() => true, () => false)) destino = path.join(DIR_IMG, `${path.parse(nombre).name}-${n++}${path.extname(nombre)}`);
  await fs.writeFile(destino, buf);
  pesosImg.push({ url: u, archivo: destino, bytes: buf.length });
}
pesosImg.sort((a, b) => b.bytes - a.bytes);
medidas.imagenes = { total: pesosImg.length, top5: pesosImg.slice(0, 5) };

await fs.writeFile(path.join(DIR_HTML, 'medidas.json'), JSON.stringify(medidas, null, 2));
await browser.close();
console.log(`\nPáginas: ${medidas.paginas.length} · Imágenes: ${pesosImg.length}`);
console.log(`Peso portada: ${(pesoPortada / 1024 / 1024).toFixed(2)} MB`);
console.log('Resultado en docs/original/medidas.json');
