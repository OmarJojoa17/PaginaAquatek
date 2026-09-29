# Cómo agregar un proyecto

## 1. Preparar el material

Conservar los archivos originales fuera del repositorio. Crear únicamente derivados web revisados:

- fotografías e imágenes en WebP o AVIF cuando sea posible;
- planos sin firmas, identificaciones, coordenadas ni datos reservados;
- videos comprimidos con subtítulos WebVTT o transcripción;
- documentos PDF optimizados y autorizados.

Ubicar los derivados en `public/media/projects/<slug>/`. El `slug` usa minúsculas, números y guiones.

## 2. Crear el archivo editorial

Copiar este encabezado en `src/content/projects/<slug>.md` y mantenerlo como borrador mientras se
revisa la información:

```yaml
---
slug: nombre-del-proyecto
title: Nombre técnico y comprensible
headline: Decisión principal o problema que explica el caso
summary: Resumen breve del problema, el análisis y el resultado.
discipline: hydrology
relatedDisciplines:
  - river-engineering
publicationStatus: draft
approvedForPublication: false
featured: false
year: 2026
need: Descripción clara de la pregunta de ingeniería que debía resolverse.
scope:
  - Actividad o componente verificable incluido en el alcance.
  - Segunda actividad o componente verificable del estudio.
methodology:
  - Información empleada y forma en que se organizó para el análisis.
  - Modelo, comprobación o criterio utilizado para comparar alternativas.
results:
  - Decisión, entregable o efecto técnico que puede comunicarse públicamente.
tools:
  - Herramienta utilizada
standards:
  - Norma o criterio aplicable
media: []
---
Contexto adicional aprobado para publicación.
```

Los valores permitidos para `discipline` están en `src/utils/disciplines.ts`.

## 3. Agregar medios

Ejemplo de imagen:

```yaml
media:
  - type: image
    src: /media/projects/nombre-del-proyecto/modelo.webp
    alt: Vista del modelo hidráulico con niveles calculados en el tramo analizado.
    caption: Comparación del nivel para el escenario de diseño seleccionado.
    width: 1600
    height: 900
```

Ejemplo de video accesible:

```yaml
media:
  - type: video
    src: /media/projects/nombre-del-proyecto/recorrido.mp4
    poster: /media/projects/nombre-del-proyecto/recorrido.webp
    captionsSrc: /media/projects/nombre-del-proyecto/recorrido-es.vtt
    alt: Recorrido explicado por el modelo y las decisiones principales.
    caption: Síntesis audiovisual del análisis.
```

Los planos y documentos usan `type: plan` o `type: document`, una ruta `src`, `alt` descriptivo y
un `caption` opcional.

## 4. Revisar y publicar

1. Ejecutar `pnpm run ci`.
2. Revisar la ficha en móvil y escritorio.
3. Confirmar autorización y ausencia de información reservada.
4. Cambiar `publicationStatus` a `published`.
5. Cambiar `approvedForPublication` a `true`.
6. Ejecutar nuevamente las pruebas.

Solo entonces Astro genera la ruta, la relación con especialidades y la entrada del sitemap.
