# Arquitectura

## Decisión principal

Astro con TypeScript estricto y salida estática. Esta combinación reduce JavaScript enviado al
navegador y permite desplegar el mismo artefacto en GitHub Pages, Cloudflare Pages, Netlify o
Vercel.

## Límites de módulos

- `pages`: composición de rutas; no almacena datos técnicos extensos.
- `layouts`: metadatos, estructura semántica y elementos compartidos.
- `components`: unidades de interfaz reutilizables.
- `content`: fuente versionada de servicios y proyectos.
- `utils`: transformaciones puras y reglas probables.
- `styles`: tokens y reglas globales; los estilos específicos permanecen cerca del componente.

## Principios

- Contenido separado de presentación.
- HTML primero; hidratación solo para interacciones necesarias.
- Un único origen para categorías de proyectos y servicios.
- Rutas de especialidad generadas desde contenido validado, no desde páginas duplicadas.
- Integración continua antes del despliegue.
- Medios originales fuera de Git; derivados públicos optimizados.
- Proyectos publicados mediante doble condición: estado editorial y autorización explícita.
- Búsqueda del portafolio en el navegador sobre HTML estático; ningún dato se envía a terceros.

## Registro de decisiones

Las decisiones que cambien estos límites deben documentarse aquí con fecha, motivo y consecuencias.

### 2026-09-27 — Portafolio estático con publicación segura

El índice y las fichas de proyecto se generan desde la colección `projects`. Se eligió filtrado local
para conservar un despliegue estático y rápido. Los borradores no generan rutas ni sitemap; esto
reduce el riesgo de exponer información sin autorización, aunque exige una revisión editorial antes
de poder inspeccionar una ficha completa en producción.
