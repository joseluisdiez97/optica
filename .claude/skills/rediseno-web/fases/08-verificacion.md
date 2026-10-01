# FASE 8 — Verificación → `docs/VERIFICACION.md`

**No es opcional.** Delega en el subagente `verificador-qa`. Él no ha escrito el
código, así que no se autoaprueba.

## Automático (script)

```bash
node .claude/skills/rediseno-web/scripts/verificar.mjs index.html
```

Comprueba y guarda capturas en `docs/capturas/`:

1. `scrollWidth === innerWidth` a **1440 px y a 390 px** (sin desborde horizontal).
2. Cero errores de JavaScript. Cero 404.
3. Captura cada 900 px bajando la página, esperando a que se disparen las animaciones.
4. Posición de las barras fijas/sticky: tienen que estar en `y = 0`.
5. Recarga **bloqueando los CDN** y confirma que se lee igual (sin texto en opacity 0).
6. Elementos con texto que siguen en `opacity:0` tras hacer scroll.
7. Imágenes sin `alt` y campos sin `label`.

Termina con código 0 si todo pasa y 1 si hay fallos.

## Manual (con las capturas o Playwright MCP)

- **Mira cada captura**: solapes, textos cortados, huecos, elementos congelados.
- Si hay lógica de fechas u horarios, pruébala en los límites: justo antes de
  abrir, el minuto de cierre, el último día de apertura de la semana y el día que
  no abre (sobrescribe `Date` en la página o extrae la función y pruébala con node).
- Abre el menú móvil y los acordeones; comprueba que su contenido cabe a 390 px.
- Prueba los hovers principales moviendo el ratón y haz captura.

## Bucle

Arregla lo que aparezca y vuelve a pasar **la lista entera**. Solo cuando el
script dé 0 fallos y la revisión manual esté limpia, está terminado.
Consejo para el usuario: `/goal verificar.mjs termina con 0 fallos`.
