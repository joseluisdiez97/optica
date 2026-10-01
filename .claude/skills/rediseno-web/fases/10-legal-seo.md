# FASE 10 — Legal y SEO

## Legal
Textos legales obligatorios según el país del negocio. En España: aviso legal
(LSSI-CE), política de privacidad (RGPD) y política de cookies si hay analítica o
cookies de terceros.
**Si no existen en la web original, no los inventes: márcalos como pendiente
bloqueante** en `docs/INVENTARIO.md` y en la entrega. Si existen, enlázalos.

## SEO
- `<title>` y `meta description` con el servicio y la ciudad (datos reales).
- `<html lang="…">` correcto.
- Datos estructurados `schema.org` (JSON-LD, tipo `LocalBusiness` o el más
  específico) con dirección, teléfono y horario **reales** del inventario. Si un
  dato no existe, se omite el campo.
- Open Graph y Twitter Card: `og:title`, `og:description`, `og:image` (1200×630),
  `og:url`, `og:type`.
- Favicon.

Vuelve a pasar verificar.mjs al terminar.
