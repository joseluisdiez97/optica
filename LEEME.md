# Kit de rediseño web para Claude Code

## Instalación (una vez por proyecto)

1. Descomprime este zip **en la raíz de tu repo** (la carpeta donde abres `claude`).
   Deben quedar así:
   ```
   tu-repo/
   ├── CLAUDE.md
   ├── .mcp.json
   ├── package.json
   ├── .claude/
   │   ├── settings.json
   │   ├── agents/  (3 agentes)
   │   └── skills/rediseno-web/  (SKILL.md, fases/, scripts/…)
   ```
   Ojo: `.claude` y `.mcp.json` empiezan por punto y en Mac/Windows pueden estar
   ocultos. En Mac: Cmd+Shift+. en Finder.
   Si tu repo ya tenía un CLAUDE.md, junta los dos en uno.

2. Instala las dependencias de los scripts:
   ```bash
   npm install
   npx playwright install chromium
   ```

3. Abre `CLAUDE.md` y rellena **Cliente**, **Web original** y **Permiso**
   (cámbialo a `confirmado` si la web es tuya o tienes permiso).

4. Guarda el punto de partida:
   ```bash
   git init        # si aún no es un repo
   git add -A && git commit -m "Kit de rediseño"
   ```

5. Abre Claude Code en esa carpeta (`claude`). Si ya estaba abierto, ciérralo y
   vuelve a abrirlo para que cargue la skill. Acepta los servidores MCP cuando lo pida.

6. Escribe:
   ```
   /rediseno-web
   ```
   Para ir a una fase concreta: `/rediseno-web 4`.

## Comprobar que todo cargó

- `/skills` o `/` → debe aparecer `rediseno-web`
- `/agents` → `auditor-contenido`, `investigador-referencias`, `verificador-qa`
- `/mcp` → `playwright` y `context7` conectados

## Cómo trabajar

| Fase | Consejo |
|---|---|
| 1 | Revisa tú `docs/INVENTARIO.md`. Luego `/clear` |
| 2-5 | Modo plan (Shift+Tab) |
| 3 | Luego `/clear` |
| 4 | Eliges dirección ⏸ |
| 7 | Commit por sección |
| 8 | `/goal verificar.mjs termina con 0 fallos` |
| 11 | Tú decides si se despliega ⏸ |

`/clear` no pierde nada: el estado vive en `docs/` y en `CLAUDE.md`.

## Usarlo en todas tus webs (opcional)

Copia `.claude/skills/rediseno-web` a `~/.claude/skills/` y `.claude/agents/*`
a `~/.claude/agents/`. Así no hace falta copiarlos en cada repo; en cada proyecto
solo necesitas `CLAUDE.md`, `.claude/settings.json`, `.mcp.json` y `package.json`.

## Plugin recomendado

Dentro de Claude Code: `/plugin` → busca **frontend-design** (marketplace oficial
de Anthropic) e instálalo. Refuerza el diseño con criterio y evita el aspecto genérico.
