# FASE 6 — Sistema de diseño → `css/styles.css` (bloque `:root`)

Si ya existe una web en la carpeta, muévela antes a `_backup/`.

Antes del primer selector, define en variables CSS en `:root`:

- **Color** con nombres de función: `--fondo`, `--texto`, `--texto-suave`,
  `--linea`, `--acento`. El neutro elegido con un matiz hacia el acento, no un gris
  por defecto.
- **Escala tipográfica** con `clamp()`: `--t-titular`, `--t-h2`, `--t-h3`,
  `--t-cuerpo`, `--t-etiqueta`. Titulares con `text-wrap: balance`. Cuerpo cerca
  de 65 caracteres por línea (`max-width: 65ch`).
- **Espaciado**: un `--pad` lateral con `clamp()`, nunca menor de 16 px
  (p. ej. `clamp(16px, 4vw, 64px)`), y una escala `--s-1` … `--s-6`.
- **Movimiento**: dos o tres curvas (`--ease-out`, `--ease-in-out`) y duraciones
  fijas (`--d-rapida`, `--d-media`, `--d-lenta`).

Añade también la base: reset mínimo, `:focus-visible` visible, `.no-gsap` y
`@media (prefers-reduced-motion: reduce)`.

Enseña al usuario el bloque `:root` antes de seguir.
