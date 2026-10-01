# Catálogo de patrones (GSAP 3.12 + ScrollTrigger + Lenis 1.1)

Elige solo los que pida la dirección. Más animación no es mejor diseño.

## Base obligatoria (siempre)

```html
<html lang="es" class="no-gsap">
```

```css
/* Sin GSAP todo visible; los estados ocultos los pone JS */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }
}
:focus-visible { outline: 2px solid var(--acento); outline-offset: 3px; }
```

```js
// js/main.js
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

if (hasGsap && !reduce) {
  document.documentElement.classList.remove('no-gsap');
  gsap.registerPlugin(ScrollTrigger);

  if (typeof window.Lenis !== 'undefined') {
    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  initAnimaciones();
}
// Lo que no es animación (menú, reloj, abierto/cerrado) funciona siempre:
initMenu();
```

## Entrada de página

**Preloader con tope de tiempo**: barra + porcentaje; se quita al `load` o a los
2,5 s, lo que ocurra antes. Sin JS no debe existir (créalo desde JS o escóndelo con `.no-gsap`).

**Titular por líneas con máscara**
```html
<h1><span class="linea"><span>Primera línea</span></span><span class="linea"><span>Segunda</span></span></h1>
```
```css
.linea { display:block; overflow:hidden; }
.linea > span { display:inline-block; }
```
```js
gsap.from('.linea > span', { yPercent: 110, duration: 1, ease: 'power4.out', stagger: 0.08 });
```

## Scroll

**Parallax por capas**
```js
gsap.utils.toArray('[data-speed]').forEach(el => {
  gsap.to(el, { yPercent: -20 * parseFloat(el.dataset.speed), ease: 'none',
    scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
});
```

**Párrafo que se colorea palabra a palabra**
```js
document.querySelectorAll('[data-colorea]').forEach(p => {
  p.innerHTML = p.textContent.split(' ').map(w => `<span>${w}</span>`).join(' ');
  gsap.fromTo(p.children, { color: 'var(--texto-suave)' }, { color: 'var(--texto)', stagger: 0.05,
    scrollTrigger: { trigger: p, start: 'top 80%', end: 'bottom 40%', scrub: true } });
});
```
(Cuidado: si el párrafo tiene enlaces o `<strong>`, recorre nodos de texto en vez de `textContent`.)

**Marquesina que invierte con el scroll**
```js
const pista = document.querySelector('.marquesina__pista'); // contenido duplicado dos veces
const tl = gsap.to(pista, { xPercent: -50, repeat: -1, duration: 20, ease: 'none' });
ScrollTrigger.create({ onUpdate: s => gsap.to(tl, { timeScale: s.direction, duration: 0.3 }) });
```

**Scroll horizontal anclado** (regla: carril dentro de envoltorio con overflow:hidden)
```html
<section class="horiz"><div class="horiz__ventana"><div class="horiz__carril">…tarjetas…</div></div></section>
```
```css
.horiz__ventana { overflow: hidden; }
.horiz__carril { display: flex; gap: var(--s-4); width: max-content; }
.no-gsap .horiz__carril { width: auto; flex-wrap: wrap; } /* sin GSAP, rejilla normal */
```
```js
const carril = document.querySelector('.horiz__carril');
const dist = () => carril.scrollWidth - window.innerWidth;
gsap.to(carril, { x: () => -dist(), ease: 'none',
  scrollTrigger: { trigger: '.horiz', pin: true, scrub: 1, end: () => '+=' + dist(), invalidateOnRefresh: true } });
```
En móvil (≤ 768 px) mejor desactivar con `gsap.matchMedia()` y usar scroll nativo con `scroll-snap`.

**Contador que sube una vez** (el número real va en el HTML; JS solo lo anima)
```js
document.querySelectorAll('[data-contador]').forEach(el => {
  const fin = parseFloat(el.textContent.replace(/\D/g, ''));
  const obj = { v: 0 };
  gsap.to(obj, { v: fin, duration: 1.6, ease: 'power2.out',
    scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    onUpdate: () => el.textContent = Math.round(obj.v).toLocaleString('es-ES') });
});
```

**Índice pegajoso**: columna izquierda `position: sticky; top: var(--s-5)` con el
número activo, actualizado con `ScrollTrigger.create({ trigger: seccion, start:'top center', onToggle })`.

## Interacción

**Filas de índice que se rellenan y revelan foto**: `::before` con `transform: scaleY(0)`
→ `scaleY(1)` en `:hover`; foto en `position: fixed` que sigue al puntero con `gsap.quickTo`.
Solo con `@media (hover: hover) and (pointer: fine)`.

**Botón magnético**
```js
if (matchMedia('(pointer: fine)').matches) document.querySelectorAll('[data-magnetico]').forEach(b => {
  const x = gsap.quickTo(b, 'x', { duration: 0.4 }), y = gsap.quickTo(b, 'y', { duration: 0.4 });
  b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect();
    x((e.clientX - r.left - r.width / 2) * 0.25); y((e.clientY - r.top - r.height / 2) * 0.25); });
  b.addEventListener('pointerleave', () => { x(0); y(0); });
});
```

**Cursor propio con etiqueta**: solo escritorio con puntero fino; nunca ocultar el
cursor del sistema en campos de formulario.

## Datos vivos (solo si el negocio los tiene en el inventario)

**Reloj de la ciudad**
```js
const fmt = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit' });
setInterval(() => reloj.textContent = fmt.format(new Date()), 1000);
```

**Abierto/cerrado** desde el horario real. Calcula la hora **en la zona del negocio**
(no la del visitante) y devuelve "Abierto · cierra a las 21:00" o "Cerrado · abre
mañana a las 7:00" / "abre el lunes a las…". Escribe la función pura
`estado(horario, fecha)` para poder probarla en la fase 8 en los límites.

## Errores típicos

- Tween de entrada sobre una barra fija que ya usa `transform` para esconderse → se congela. Anima un hijo.
- `opacity:0` en CSS esperando a JS → sin CDN, página vacía. Usa `gsap.from`.
- `pin` sin `invalidateOnRefresh` → medidas mal tras redimensionar.
- Olvidar `ScrollTrigger.refresh()` tras cargar fuentes/imágenes que cambian alturas
  (`document.fonts.ready.then(() => ScrollTrigger.refresh())`).
