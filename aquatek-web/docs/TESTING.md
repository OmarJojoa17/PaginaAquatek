# Estrategia de pruebas

## Pirámide pragmática

1. Astro check y TypeScript para estructura y tipos.
2. Vitest para funciones puras, filtros, slugs y reglas editoriales.
3. Playwright para navegación crítica, comportamiento responsive y accesibilidad observable.
4. Revisión manual de contenido técnico, teclado y calidad visual.

El build ejecuta además `scripts/audit-build.mjs`: controla el peso de medios, metadatos SEO, CSP y
la ausencia de formatos técnicos originales dentro de `public/`.

Las especialidades prueban una matriz común de siete rutas. La prueba confirma metadatos, un único
encabezado principal, ausencia de desbordamiento horizontal y bloqueo de proyectos no autorizados.

El portafolio comprueba su ruta pública en escritorio y móvil, navegación activa, accesibilidad,
ausencia de desbordamiento y exclusión del borrador tanto de la ruta dinámica como del sitemap. Las
funciones puras prueban la combinación de autorización, disciplina, búsqueda y tipo de evidencia.

No se crean pruebas unitarias para HTML estático sin lógica. Una prueba debe proteger una regla o
un recorrido con valor real.

## Matriz responsive inicial

- Móvil: 390 × 844.
- Tableta: 768 × 1024.
- Escritorio: 1440 × 900.
- Pantalla amplia: 1920 × 1080.

## Criterio de terminado por módulo

- `pnpm run ci` termina correctamente.
- La prueba E2E pertinente pasa en escritorio y móvil.
- No hay errores en consola ni desbordamiento horizontal.
- La navegación funciona con teclado y el foco es visible.
- Axe no reporta infracciones automáticas serias o críticas.
- La documentación refleja la decisión implementada.
