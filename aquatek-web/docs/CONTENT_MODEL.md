# Modelo de contenido

## Servicios

Cada servicio contiene una URL editorial, título, resumen, encabezado, introducción, orden de
navegación y cuerpo explicativo. Los campos estructurados indican qué problemas aborda, cuál es el
alcance, qué puede recibir el cliente y cómo pasa de la información inicial a una decisión técnica.

Las páginas se generan desde `src/pages/especialidades/[slug].astro`. La relación con proyectos usa
la disciplina principal y las disciplinas relacionadas. Un caso solo aparece cuando su estado es
`published` y `approvedForPublication` es verdadero.

## Proyectos

Cada archivo de `src/content/projects` separa los datos verificables de su presentación. El esquema
completo vive en `src/content.config.ts` y contempla:

- URL editorial, título, encabezado y resumen;
- disciplina principal y disciplinas relacionadas;
- estado editorial y autorización de publicación;
- año, ubicación y cliente cuando puedan divulgarse;
- necesidad, alcance, metodología y resultados;
- herramientas, normas y criterios;
- imágenes, videos, planos derivados y documentos;
- texto alternativo, pies de imagen, subtítulos o transcripción según el medio.

Los proyectos publicados deben tener encabezado, año, necesidad, alcance, metodología y resultados.
Las imágenes requieren dimensiones; los videos requieren subtítulos o transcripción. Los medios se
sirven desde `/public/media/projects/<slug>/` y usan rutas que comienzan con `/`.

El índice se genera en `src/pages/proyectos/index.astro`; la ficha se genera desde
`src/pages/proyectos/[slug].astro`. Búsqueda y filtros actúan sobre el HTML ya generado, sin enviar
datos técnicos a un servicio externo.

## Política de publicación

Antes de publicar se verifica autorización, confidencialidad, derechos de autor, datos personales,
coordenadas sensibles y legibilidad de rótulos en planos. Los originales se conservan fuera del
repositorio; la web recibe copias redimensionadas y comprimidas.

Los borradores no generan rutas, no aparecen en especialidades y no entran al sitemap. La guía
operativa está en `docs/ADDING_PROJECTS.md`.
