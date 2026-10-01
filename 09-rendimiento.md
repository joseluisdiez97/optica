# FASE 9 — Rendimiento

```bash
node .claude/skills/rediseno-web/scripts/optimizar.mjs
```

El script:
- Pasa las fotos de `assets/originales/` a **WebP** en `assets/`: retratos a 900 px
  de ancho, el resto (fondos) a 1600 px. Los originales no se tocan.
- Deja PNG/SVG con transparencia como están si pesan menos de 80 KB.
- Imprime el peso antes y después.

Después, a mano:
- Cambia las rutas del HTML a los nuevos `.webp` y pon `width`/`height`.
- `loading="lazy"` en todo lo que no esté en la primera pantalla
  (la imagen del hero, sin lazy y con `fetchpriority="high"`).
- Google Fonts con `display=swap` y solo los pesos que se usan.
- Dile al usuario el peso de la portada antes y después.

Vuelve a pasar la fase 8 (verificar.mjs) tras los cambios.
