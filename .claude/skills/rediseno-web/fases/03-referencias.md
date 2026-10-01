# FASE 3 — Búsqueda de referencias → `docs/REFERENCIAS.md`

Lee [../referencias.md](../referencias.md) para las fuentes y el orden.

## 3.1 Encontrar candidatas

1. Busca en las galerías (Awwwards, CSS Design Awards, One Page Love) y con
   WebSearch: `"{sector}" website awwwards`, `"{sector}" site of the day`,
   `best {sector} website design`.
2. Elige **entre 3 y 5 webs reales**, al menos una **fuera del sector** del cliente
   (las mejores ideas vienen de trasplantar).
3. Si una fuente bloquea o no devuelve contenido legible, **no reintentes**:
   pasa a la siguiente y anótalo en "Fuentes que fallaron".

## 3.2 Estudiar cada una (en paralelo)

Lanza un subagente `investigador-referencias` por web, **todos a la vez**, pasando
la URL y el sector del cliente. Cada uno devuelve una ficha con:

- **Estructura**: orden de secciones y qué hace el hero
- **Tipografía**: familias, tamaño del titular, peso, interlineado, tracking
- **Color**: fondo, texto, acento; cuántos colores usa de verdad
- **Retícula**: columnas, márgenes, cuánto aire deja
- **Movimiento**: qué se anima, cuándo y cómo (entrada, scroll, hover)
- **El gesto memorable**: la única cosa que recuerdas al cerrar la pestaña

Junta las fichas en `docs/REFERENCIAS.md`. Añade al final las fuentes que el
usuario debería mirar a ojo (las que bloquean a agentes).

Copia **ideas y estructuras, nunca código, textos ni imágenes** de las referencias.
