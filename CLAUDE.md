# Proyecto: rediseño web

<!-- Rellena estos 3 datos al empezar. Los demás los actualiza Claude solo. -->
Cliente: Pejiguera Smash
Web original: https://pejiguera-smash-template.netlify.app/
Permiso del propietario: pendiente
<!-- Cuando confirmes que la web es tuya o tienes permiso, cambia a: confirmado -->

Fase actual: 1
Dirección elegida: sin elegir

## Cómo trabajamos
- Sigue la skill /rediseno-web. Una fase cada vez.
- El estado vive en docs/. Al empezar una sesión, lee docs/ antes de hacer nada.
- Al terminar una fase: actualiza "Fase actual" aquí y propón un commit.

## Paradas obligatorias
- Fase 4: presenta 3 direcciones y ESPERA mi elección. Cuando elija, escríbela arriba.
- Fase 11: no despliegues, no hagas push, no toques producción sin mi OK.

## Reglas absolutas
- No inventes datos: ni cifras, ni premios, ni testimonios, ni horarios.
  Lo que falte va a "Pendiente" en docs/INVENTARIO.md.
- Copia ideas de las referencias, nunca código, textos ni imágenes.
- No hay "terminado" sin pasar verificar.mjs con 0 fallos.

## Reglas técnicas
- HTML + CSS + JS vanilla, sin build. CDN con versión fija.
- Nunca animes con transform un elemento que ya usa transform.
- Sin GSAP/Lenis la página se lee entera (clase no-gsap en <html>).
- Nada que leer en opacity:0 en reposo. La primera captura muestra contenido real.
- prefers-reduced-motion desactiva animaciones.
- Barras fijas: top:0 + padding-top: env(safe-area-inset-top, 0px).
- Scroll horizontal anclado: carril dentro de envoltorio con overflow:hidden.
- Sin desbordes a 390 px. Tablas en contenedor con overflow-x:auto.
- Foco visible, alt en todas las imágenes, cada campo con id y label.
