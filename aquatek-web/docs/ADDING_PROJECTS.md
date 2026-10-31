# Guía para incorporar proyectos de Aquatek

Este es el procedimiento por defecto para cada caso nuevo. La PTAP de San Francisco y la red pluvial de Orito son referencias de **formato e identidad**, no plantillas para copiar datos técnicos. Antes de editar, revisar las fichas publicadas y sus videos completos.

## 1. Carpeta y originales

1. Crear una carpeta de trabajo privada junto a las de los proyectos anteriores, con subcarpetas `originales/video`, `originales/planos-pdf`, `originales/memoria`, `derivados`, `revision` y un `README.md` que enumere los materiales recibidos y los que se pueden mostrar.
2. Copiar los originales recibidos; no moverlos ni modificarlos. Conservar la ruta de origen en el README. No usar DWG cuando el material aprobado sea el PDF.
3. Mantener esa carpeta **fuera de `aquatek-web/public/` y fuera del control de Git**. Solo los derivados revisados entran en `aquatek-web/public/media/projects/<slug>/`.
4. Usar nombres de archivo claros y estables. El `slug` lleva minúsculas, números y guiones.

## 2. Selección editorial antes de diseñar

Preparar una ficha breve con: problema, ubicación publicable, año, alcance, decisiones de diseño, resultados que se pueden mostrar y materiales disponibles. Evitar publicar la metodología de cálculo completa; seleccionar resultados comprensibles, gráficas y alguna tabla solo si aporta claridad.

Orden de la página:

1. Portada del caso: título corto, resumen y datos esenciales, sin una columna exageradamente alta.
2. Video explicativo como primer medio.
3. Problema, alcance y resultados en lenguaje claro, con precisión técnica.
4. Evidencia del trabajo: modelo, planos en color, planta y perfil, estructuras o detalles; cada imagen con título y explicación útil.
5. Extractos seleccionados de la memoria al final, en parejas cuando haya dos columnas. Conservar la apariencia de página de documento, pero difuminar texto y datos ajenos a la figura elegida.

**Al agregar extractos finales, conservar las secciones anteriores de planos y modelos.** No eliminar medios existentes por interpretar una corrección puntual como un cambio de toda la galería. Revisar el orden completo contra la versión anterior.

## 3. Privacidad de los derivados

- Revisar cada fotograma, imagen y página para encontrar firmas, matrículas, nombres de terceros, cajetines, coordenadas, tablas reservadas y datos personales.
- Recortar o difuminar esos elementos **en el archivo exportado**. Una capa CSS o una superposición del reproductor no protege el archivo original.
- Si se muestra una gráfica de la memoria, dejar legibles su título, la gráfica y la fuente aprobada; difuminar el texto circundante. No usar una página completa si contiene información reservada.
- Marcar los planos derivados como «Vista web · No apto para construcción» cuando corresponda. Nunca subir PDF completo, DWG, DOCX, archivos de cálculo ni video maestro a `public/`.
- Comprobar el archivo final directamente, incluso fuera de la página. Todo medio servido por el navegador puede guardarse o capturarse; la protección depende de publicar solo el derivado revisado.

## 4. Video y marca

- Ver los videos existentes antes de escribir o animar uno nuevo: logo oficial exacto de `brand`, tipografía, azules, tarjetas de texto, ritmo, riel de etapas, música autorizada y cierre. Reutilizar estos elementos de marca con consistencia.
- Preparar guion de 45–75 segundos. Mostrar primero el problema visual, luego datos/territorio, modelo, planos o estructuras, resultado y cierre Aquatek. No llenar el video de fórmulas ni cantidades de obra.
- Anclar cualquier etiqueta al elemento que describe. Si la cámara o el plano se mueve y la etiqueta no puede seguirlo con precisión, **quitarla**. No señalar diámetros, áreas ni unidades sin verificar su ubicación.
- Renderizar el maestro a **1920 × 1080, 30 fps**. Exportar de él una copia web H.264/AAC a **1920 × 1080** con `faststart`; usar el póster WebP y `preload="metadata"`. No escalar un video pequeño y presentarlo como mejora real de nitidez.
- Revisar fotogramas de apertura, cada transición, todos los planos, resultados y cierre; reproducir el MP4 entero en el navegador y en un reproductor local. Comprobar que no haya bandas negras inesperadas, cortes abruptos, texto pequeño, imágenes ilegibles ni etiquetas que se separen del objeto.
- Conservar el maestro fuera de `public/`. Registrar resolución, duración, tamaño y ruta del derivado en el README del proyecto.

## 5. Página y medios

Crear `src/content/projects/<slug>.md` siguiendo el esquema de una ficha publicada. Empezar con `publicationStatus: draft` y `approvedForPublication: false`. Los valores de `discipline` están en `src/utils/disciplines.ts`; el contenido técnico va en este archivo y la presentación en componentes compartidos.

Los medios van en `public/media/projects/<slug>/`. Para imágenes, registrar `alt`, `caption`, `width` y `height` reales. Para video, usar `poster` y subtítulos WebVTT o `transcript`. Los planos se publican como **imágenes derivadas**, no como PDF original. `layout: wide` se reserva para el video o una figura que necesite todo el ancho.

Comprobar que la galería no tenga tarjetas vacías o estiradas: dos imágenes de una pareja deben equilibrarse; las tarjetas deben seguir la altura del contenido. Revisar portada, títulos, leyendas, espaciado y proporciones a 390 px y en escritorio. Mantener el video visible sin deformarlo.

## 6. Puertas de revisión y publicación

1. Comparar el caso completo con las fichas existentes: portada → video → problema → evidencia de planos/modelos → extractos de memoria.
2. Revisar todos los derivados de privacidad a tamaño original. Confirmar qué cifras, firmas y referencias pueden hacerse públicas.
3. Verificar resolución y audio del MP4 final, su reproducción completa y varios fotogramas representativos.
4. Ejecutar `pnpm run ci` en `aquatek-web` y las pruebas E2E de navegador. El auditor impide publicar originales y controla el tamaño de los medios; ajustar el presupuesto solo con tamaños medidos y una justificación.
5. Revisar en móvil y escritorio; corregir desbordamientos, alturas excesivas, recortes, contraste y legibilidad.
6. Registrar en `docs/` qué se publicó, qué se difuminó, qué quedó privado y la evidencia de pruebas.
7. Solo después de la revisión editorial y autorización de publicación, cambiar `publicationStatus` a `published` y `approvedForPublication` a `true`, publicar y verificar la URL de GitHub Pages.

Una solicitud de cambiar una imagen, un título o una sección se aplica a ese alcance. Antes de borrar o reemplazar otros elementos, comparar la galería con la versión publicada y conservar el resto del caso.
