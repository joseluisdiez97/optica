#!/usr/bin/env node
// Fase 8: verificación automática. Sale con 0 si todo pasa, 1 si hay fallos.
// Uso: node .claude/skills/rediseno-web/scripts/verificar.mjs [index.html | http://localhost:3000]
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';

const objetivo = process.argv[2] || 'index.html';
const DIR = 'docs/capturas';
await fs.rm(DIR, { recursive: true, force: true });
await fs.mkdir(DIR, { recursive: true });

// Servidor estático mínimo si nos pasan un archivo (file:// rompe fetch y algunos módulos)
let url = objetivo, server;
if (!/^https?:\/\//.test(objetivo)) {
  const raiz = path.resolve(path.dirname(objetivo));
  const tipos = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json',
    '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif',
    '.gif': 'image/gif', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff', '.mp4': 'video/mp4' };
  server = http.createServer(async (req, res) => {
    try {
      let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (p.endsWith('/')) p += 'index.html';
      const f = path.join(raiz, p);
      if (!f.startsWith(raiz)) throw new Error();
      const data = await fs.readFile(f);
      res.writeHead(200, { 'content-type': tipos[path.extname(f).toLowerCase()] || 'application/octet-stream' });
      res.end(data);
    } catch { res.writeHead(404); res.end('404'); }
  });
  await new Promise(r => server.listen(0, r));
  url = `http://127.0.0.1:${server.address().port}/${path.basename(objetivo)}`;
}

const fallos = [];
const avisos = [];
const fallo = (m) => { fallos.push(m); console.log('✗', m); };
const ok = (m) => console.log('✓', m);

const browser = await chromium.launch();

async function revisar({ ancho, alto, bloquearCDN = false, etiqueta }) {
  const ctx = await browser.newContext({ viewport: { width: ancho, height: alto }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errores = [], http404 = [];
  page.on('pageerror', e => errores.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
  page.on('response', r => { if (r.status() >= 400) http404.push(`${r.status()} ${r.url()}`); });
  if (bloquearCDN) {
    await page.route(/cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|unpkg\.com/, r => r.abort());
  }
  await page.goto(url, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(1500);

  // Primera pantalla con contenido real
  const visibleArriba = await page.evaluate(() => {
    const els = [...document.querySelectorAll('h1,h2,p,a,button,img')];
    return els.some(el => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
      return r.top < innerHeight && r.bottom > 0 && r.width > 0 && parseFloat(cs.opacity) > 0.5 && cs.visibility !== 'hidden'; });
  });
  if (!visibleArriba) fallo(`[${etiqueta}] La primera pantalla no muestra contenido visible`);

  // Capturas cada 900 px
  const alturaTotal = await page.evaluate(() => document.documentElement.scrollHeight);
  let i = 0;
  for (let y = 0; y < alturaTotal; y += 900) {
    await page.evaluate(y => window.scrollTo(0, y), y);
    await page.waitForTimeout(900);
    await page.screenshot({ path: path.join(DIR, `${etiqueta}-${String(i++).padStart(2, '0')}-y${y}.png`) });

    // Barras fijas/sticky arriba en y=0
    const barras = await page.evaluate(() => [...document.querySelectorAll('header, nav, [class*="bar"], [class*="nav"]')]
      .filter(el => ['fixed', 'sticky'].includes(getComputedStyle(el).position) && getComputedStyle(el).top === '0px')
      .map(el => ({ sel: el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : ''), y: Math.round(el.getBoundingClientRect().top), oculto: el.dataset.oculto ?? null })));
    for (const b of barras) {
      if (Math.abs(b.y) > 1 && y < 50) fallo(`[${etiqueta}] Barra fija ${b.sel} en y=${b.y} (debería ser 0) arriba del todo`);
      else if (Math.abs(b.y) > 1 && b.y > 0) fallo(`[${etiqueta}] Barra fija ${b.sel} desplazada a y=${b.y} en scroll ${y}`);
    }
  }
  // Al final del recorrido, todo lo que tenga texto y esté en pantalla debería verse
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  const escondidos = await page.evaluate(async () => {
    const res = [];
    for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
      window.scrollTo(0, y); await new Promise(r => setTimeout(r, 250));
      document.querySelectorAll('h1,h2,h3,p,li,a,button,figcaption,dd,dt,td').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top >= 0 && r.bottom <= innerHeight && el.innerText.trim()) {
          let n = el, op = 1;
          while (n && n !== document.documentElement) { op *= parseFloat(getComputedStyle(n).opacity); n = n.parentElement; }
          if (op < 0.1) res.push(el.tagName.toLowerCase() + ': ' + el.innerText.trim().slice(0, 50));
        }
      });
    }
    return [...new Set(res)];
  });
  if (escondidos.length) fallo(`[${etiqueta}] ${escondidos.length} textos siguen invisibles tras hacer scroll: ${escondidos.slice(0, 5).join(' | ')}`);

  // Desborde horizontal
  const { sw, iw, culpables } = await page.evaluate(() => ({
    sw: document.documentElement.scrollWidth, iw: window.innerWidth,
    culpables: [...document.querySelectorAll('body *')].filter(el => el.getBoundingClientRect().right > window.innerWidth + 1)
      .filter(el => !el.closest('[style*="overflow"], .horiz__ventana')).slice(0, 5)
      .map(el => el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : '')),
  }));
  if (sw !== iw) fallo(`[${etiqueta}] Desborde horizontal: scrollWidth ${sw} ≠ ${iw}. Posibles culpables: ${culpables.join(', ')}`);
  else ok(`[${etiqueta}] Sin desborde horizontal`);

  // Los fallos de carga se informan aparte como recursos con error
  const erroresReales = errores.filter(e => !/Failed to load resource|net::ERR_/.test(e));
  const fallosRed = errores.filter(e => /net::ERR_/.test(e) && !bloquearCDN);
  if (fallosRed.length) fallo(`[${etiqueta}] Recursos que no cargan (¿CDN caído o sin red?): ${[...new Set(fallosRed)].slice(0, 3).join(' | ')}`);
  if (erroresReales.length) fallo(`[${etiqueta}] Errores JS: ${erroresReales.slice(0, 5).join(' | ')}`);
  else ok(`[${etiqueta}] Sin errores de JavaScript`);
  const http404Reales = bloquearCDN ? [] : http404;
  if (http404Reales.length) fallo(`[${etiqueta}] Recursos con error: ${http404Reales.slice(0, 5).join(' | ')}`);
  else if (!bloquearCDN) ok(`[${etiqueta}] Sin 404`);

  if (etiqueta === 'escritorio') {
    const a11y = await page.evaluate(() => ({
      sinAlt: [...document.images].filter(i => !i.hasAttribute('alt')).map(i => i.getAttribute('src')),
      sinLabel: [...document.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([type=button]), select, textarea')]
        .filter(e => !e.id || !(e.labels && e.labels.length) ).map(e => e.name || e.type),
      lang: document.documentElement.lang,
      noGsapInicial: null,
    }));
    if (a11y.sinAlt.length) fallo(`Imágenes sin alt: ${a11y.sinAlt.join(', ')}`);
    if (a11y.sinLabel.length) fallo(`Campos sin id/label: ${a11y.sinLabel.join(', ')}`);
    if (!a11y.lang) fallo('Falta lang en <html>');
  }
  await ctx.close();
}

// Comprueba en el HTML fuente que existe la clase no-gsap
try {
  if (!/^https?:/.test(objetivo)) {
    const src = await fs.readFile(objetivo, 'utf8');
    if (/gsap/i.test(src) && !/<html[^>]*class="[^"]*no-gsap/.test(src)) fallo('Usa GSAP pero <html> no tiene class="no-gsap"');
    if (/gsap/i.test(src) && !/prefers-reduced-motion/.test(src + (await fs.readFile(path.join(path.dirname(objetivo), 'css/styles.css'), 'utf8').catch(() => '')) + (await fs.readFile(path.join(path.dirname(objetivo), 'js/main.js'), 'utf8').catch(() => ''))))
      fallo('No se encuentra prefers-reduced-motion en HTML/CSS/JS');
  }
} catch {}

console.log('\n— Escritorio 1440 px —');
await revisar({ ancho: 1440, alto: 900, etiqueta: 'escritorio' });
console.log('\n— Móvil 390 px —');
await revisar({ ancho: 390, alto: 844, etiqueta: 'movil' });
console.log('\n— Sin CDN (GSAP/Lenis bloqueados) —');
await revisar({ ancho: 1440, alto: 900, bloquearCDN: true, etiqueta: 'sin-cdn' });

await browser.close();
server?.close();

const informe = `# Verificación automática\n\nFecha: ${new Date().toISOString()}\nObjetivo: ${objetivo}\n\n## Fallos (${fallos.length})\n${fallos.map(f => '- ' + f).join('\n') || '- Ninguno'}\n\n## Pendiente de revisión manual\n- Mirar cada captura de docs/capturas/ (solapes, textos cortados, huecos)\n- Horarios en los límites (si hay lógica de fechas)\n- Menú móvil y acordeones a 390 px\n- Hovers principales\n`;
await fs.mkdir('docs', { recursive: true });
await fs.writeFile('docs/VERIFICACION.md', informe);
console.log(`\n${fallos.length ? '✗' : '✓'} ${fallos.length} fallos. Capturas en ${DIR}/. Informe en docs/VERIFICACION.md`);
process.exit(fallos.length ? 1 : 0);
