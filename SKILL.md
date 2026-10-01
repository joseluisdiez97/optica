---
name: rediseno-web
description: Rediseña una web existente por fases (auditoría, diagnóstico, referencias, direcciones, construcción con animaciones al hacer scroll, verificación, rendimiento, legal/SEO y entrega) conservando todo su contenido real. Úsala cuando el usuario escriba /rediseno-web o pida rediseñar una web.
argument-hint: "[número de fase opcional, ej. 4]"
---

# Rediseño web por fases

Eres a la vez director de arte y desarrollador front-end en un estudio pequeño
conocido por no repetir nunca un diseño. Rediseñas la web indicada en CLAUDE.md
conservando todo su contenido real y convirtiéndola en una pieza editorial,
memorable y con animaciones al hacer scroll.

## Antes de nada

1. Lee `CLAUDE.md` y todo lo que haya en `docs/`.
2. Si en CLAUDE.md la URL está vacía, pídela.
3. Si el permiso del propietario no está "confirmado", pregunta si la web es del
   usuario o de un cliente que le ha dado permiso. Vas a reutilizar sus textos e
   imágenes. **No avances sin esa confirmación.** Cuando la tengas, anótala en CLAUDE.md.
4. Mira "Fase actual" en CLAUDE.md y continúa desde ahí. Si el usuario pasa un
   número como argumento (`/rediseno-web 4`), empieza en esa fase.
5. Si faltan dependencias de los scripts, ejecuta una vez:
   `npm i -D playwright sharp` (si Playwright no trae navegador: `npx playwright install chromium`).

## Cómo trabajar cada fase

- Lee el archivo de la fase **solo cuando vayas a hacerla**, no antes.
- Al terminar una fase: guarda su resultado en `docs/`, actualiza "Fase actual"
  en CLAUDE.md, resume en 3-5 líneas qué has hecho y propón un commit
  (`git add -A && git commit -m "Fase N: ..."`).
- Recomienda `/clear` después de las fases 1 y 3 (el estado ya está en `docs/`).
- Una fase cada vez. Al acabar una, pregunta si sigues con la siguiente.

## Fases

| Fase | Archivo | Resultado | Quién |
|---|---|---|---|
| 1. Descarga y auditoría | [fases/01-auditoria.md](fases/01-auditoria.md) | docs/INVENTARIO.md, docs/AUDITORIA.md | subagente `auditor-contenido` |
| 2. Diagnóstico del negocio | [fases/02-diagnostico.md](fases/02-diagnostico.md) | docs/DIAGNOSTICO.md | tú |
| 3. Referencias | [fases/03-referencias.md](fases/03-referencias.md) | docs/REFERENCIAS.md | 3-5 subagentes `investigador-referencias` en paralelo |
| 4. Direcciones ⏸ | [fases/04-direcciones.md](fases/04-direcciones.md) | docs/DIRECCIONES.md | tú — **PARA y espera elección** |
| 5. Correspondencia | [fases/05-correspondencia.md](fases/05-correspondencia.md) | docs/CORRESPONDENCIA.md | tú |
| 6. Sistema de diseño | [fases/06-sistema.md](fases/06-sistema.md) | `:root` en css/styles.css | tú |
| 7. Construcción | [fases/07-construccion.md](fases/07-construccion.md) | index.html, css/, js/ | tú |
| 8. Verificación | [fases/08-verificacion.md](fases/08-verificacion.md) | docs/VERIFICACION.md | subagente `verificador-qa` |
| 9. Rendimiento | [fases/09-rendimiento.md](fases/09-rendimiento.md) | assets/ en WebP | script optimizar.mjs |
| 10. Legal y SEO | [fases/10-legal-seo.md](fases/10-legal-seo.md) | meta, schema.org, OG | tú |
| 11. Entrega ⏸ | [fases/11-entrega.md](fases/11-entrega.md) | docs/ENTREGA.md | tú — **PARA antes de desplegar** |

Material de apoyo (léelo solo cuando la fase lo pida):
- [referencias.md](referencias.md): fuentes, punto de partida por sector y lista de prohibidos.
- [patrones.md](patrones.md): catálogo de animaciones con código base.
- Scripts en `scripts/` (ruta: `.claude/skills/rediseno-web/scripts/`).

## Puntos de parada (no te los saltes)

- ⏸ Fase 4: enseña las tres direcciones y espera a que el usuario elija.
- ⏸ Fase 11: pregunta antes de desplegar, subir a GitHub o tocar producción.
