# FASE 1 — Descarga y auditoría

No diseñes nada todavía.

Delega esta fase en el subagente `auditor-contenido` pasándole la URL de CLAUDE.md.
Cuando termine, revisa que existan los dos archivos y enseña al usuario la sección
"Pendiente" del inventario. **Pídele que revise el inventario**: es la base de todo.

## 1.1 Descarga

Ejecuta:

```bash
node .claude/skills/rediseno-web/scripts/descargar.mjs <URL>
```

El script renderiza con Chromium (sirve también para webs hechas con JavaScript),
baja la portada y cada página enlazada desde el menú a `docs/original/`, las
imágenes a `assets/originales/` conservando nombres, y deja `docs/original/medidas.json`
con pesos, title, meta description, imágenes sin alt, formularios y desborde a 390 px.

Si el script falla, haz la descarga a mano con WebFetch y anótalo.

## 1.2 Inventario de contenido → `docs/INVENTARIO.md`

Con **todo** esto, literal, sin resumir:

- Nombre, eslogan y descripción del negocio
- Cada servicio o producto con su texto
- Personas, cargos y fotos
- Direcciones, teléfonos, emails, redes sociales
- Horarios (completos, con excepciones)
- Precios y tarifas
- Cifras que el negocio ya declara (años, clientes, proyectos…)
- Testimonios con autor
- Formularios: qué campos piden y a dónde envían
- Enlaces externos: reservas, pagos, mapas, formularios de terceros
- Logotipos, colores y tipografías actuales de la marca
- Página de origen de cada dato

**Regla absoluta: no inventes ni un dato.** Lo que falte va en una sección
"## Pendiente". Nunca lo rellenes con texto de relleno, cifras supuestas o premios
que no existen.

## 1.3 Auditoría técnica → `docs/AUDITORIA.md`

- Peso total de la portada y las 5 imágenes más pesadas
- Textos legales obligatorios en su país: aviso legal, privacidad, cookies (¿existen?)
- Si los formularios envían de verdad (action/endpoint) o solo abren el correo (mailto)
- `<title>` y `meta description`
- Imágenes sin `alt`
- Si se ve bien a 390 px de ancho (desborde horizontal sí/no)
