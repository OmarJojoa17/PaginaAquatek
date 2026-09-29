# Módulo 6.2 — Auditoría técnica

## Resultado

La primera versión del sitio queda preparada para pasar al despliegue provisional. Se revisaron
rendimiento, accesibilidad, SEO y seguridad sobre quince páginas estáticas.

## Rendimiento

- Los medios publicados pesan 6,63 MiB en total; el video representa 5,49 MiB.
- Cada imagen está por debajo de 200 KiB y el video por debajo de 6 MiB.
- El video solicita solo metadatos antes de que la persona decida reproducirlo.
- Las ocho imágenes de la galería usan carga diferida.
- Las fuentes locales se redujeron de trece archivos multilingües a dos subconjuntos latinos, con
  un peso conjunto aproximado de 52 KiB.
- `scripts/audit-build.mjs` impide publicar archivos técnicos originales y hace cumplir estos
  presupuestos en CI.

Quedan tres imágenes derivadas sin uso dentro de `public/`. Suman cerca de 207 KiB y no exponen
originales; se dejan identificadas para decidir si se reutilizan o retiran en una limpieza posterior.

## Accesibilidad

- Axe no encontró infracciones automáticas serias o críticas en inicio, páginas institucionales,
  especialidades, portafolio ni ficha de proyecto.
- Se verificaron foco de teclado, enlace para saltar al contenido, navegación móvil, un solo `h1`
  por página y ausencia de desbordamiento horizontal.
- El lockup del héroe usa el archivo oficial de marca, conserva al menos 168 px en las resoluciones
  ensayadas y mantiene legibles «Aquatek» e «Ingeniería de Recursos Hídricos».

La revisión automática no sustituye una evaluación manual con lector de pantalla; esa comprobación
queda recomendada antes del lanzamiento definitivo.

## SEO

- Cada página compilada tiene título, descripción, directiva robots y un `h1`.
- Sitemap, robots, Open Graph y datos estructurados siguen protegidos por pruebas.
- La vista previa continúa en `noindex, nofollow` hasta autorizar una URL pública.
- Al definir `PUBLIC_SITE_URL`, el build genera canónicas, URLs sociales absolutas y sitemap público.

La validación final de Search Console y resultados enriquecidos corresponde al Módulo 6.4, cuando
existan dominio y datos públicos aprobados.

## Seguridad

- CSP con hashes SHA-256, sin `unsafe-inline` ni `unsafe-eval`.
- Política de referencia `strict-origin-when-cross-origin`.
- Dependencias exactas, lockfile congelado y revisión mensual con Dependabot.
- Cero vulnerabilidades conocidas reportadas por npm para producción y desarrollo.
- Ningún documento original o formato técnico descargable dentro de `public/`.

El informe detallado se encuentra en `security_best_practices_report.md`. Quedan dos verificaciones
de riesgo bajo para el Módulo 6.3: fijar las GitHub Actions a hashes inmutables y comprobar las
cabeceras HTTP reales del proveedor.

## Evidencia

- Build estático: 15 páginas.
- Auditoría de build: correcta.
- Pruebas unitarias: 13.
- Pruebas E2E: 60 correctas y 2 omitidas por corresponder exclusivamente a otra resolución.
- Capturas: `output/playwright/module-6-2-contacto-brand.png` y
  `output/playwright/module-6-2-contacto-brand-mobile.png`.
