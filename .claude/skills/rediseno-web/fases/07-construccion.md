# FASE 7 — Construcción

Lee `docs/CORRESPONDENCIA.md` (orden de secciones y contenido) y
[../patrones.md](../patrones.md) (solo los patrones que pide la dirección).

## Stack

HTML + CSS + JS vanilla. Sin build: se abre el archivo y funciona.
Librerías por CDN y con versión fija:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.18/dist/lenis.min.js" defer></script>
<script src="js/main.js" defer></script>
```

Estructura: `index.html`, `css/styles.css`, `js/main.js`, `assets/`.
Si dudas de una API de GSAP o Lenis, consulta la documentación (Context7 si está
conectado) en lugar de suponer.

## Orden de trabajo

1. Primero la página **completa sin animaciones**, con todo el contenido real.
   Comprueba que se lee entera.
2. Después añade animaciones, sección a sección.
3. Commit después de cada sección importante.

Usa SOLO textos, datos e imágenes de `docs/INVENTARIO.md` y `assets/originales/`.
Donde falte algo, deja un hueco visible y honesto (p. ej. "Foto pendiente") y
anótalo, nunca texto o imagen inventados.

## Reglas técnicas innegociables

1. **Nunca animes con `transform` un elemento que ya usa `transform` para otra
   cosa.** Una barra fija que se esconde al bajar usa `transform`; si además le
   metes un tween de entrada, se pisan y se queda congelada a medio camino, sin
   ningún error en consola. Anima un hijo o un envoltorio.
2. **Scroll horizontal anclado: el carril va dentro de un envoltorio con
   `overflow:hidden`.** Si no, las tarjetas se montan encima del texto de al lado.
3. **Degradación**: si GSAP o Lenis no cargan, la página se lee entera. Pon
   `class="no-gsap"` en `<html>` y quítala en JS solo si GSAP existe. Nada queda en
   `opacity:0` esperando.
4. **Nada que leer escondido en reposo**: la primera captura, sin hacer scroll,
   muestra contenido real. Los estados iniciales ocultos se ponen desde JS
   (`gsap.from`), no en el CSS.
5. `prefers-reduced-motion` desactiva las animaciones.
6. Barras fijas: `top:0` más `padding-top: env(safe-area-inset-top, 0px)`.
7. Sin `min-width` más ancho que la pantalla. Tablas en su propio contenedor con
   `overflow-x:auto`.
8. Foco de teclado visible. `alt` en todas las imágenes. Cada campo con `id` y `label`.

Al terminar, pasa a la fase 8. No digas que está terminado.
