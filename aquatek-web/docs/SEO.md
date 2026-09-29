# SEO

## Comportamiento seguro

La vista previa se publica con `noindex, nofollow`. `robots.txt` también bloquea el rastreo cuando
`PUBLIC_SITE_URL` está vacío. Esto evita que Google indexe una URL temporal o contenido incompleto.

Al definir `PUBLIC_SITE_URL`, el build activa:

- URL canónica por página.
- `index, follow`.
- URL pública en Open Graph.
- Imagen social `og-default.png`.
- Sitemap con rutas absolutas.
- Referencia al sitemap desde `robots.txt`.
- Datos estructurados de organización y tipo de página.

## Configuración

```env
PUBLIC_SITE_URL=https://dominio-elegido.com/
```

Si GitHub Pages usa una subruta, debe incluirse completa:

```env
PUBLIC_SITE_URL=https://usuario.github.io/aquatek-web/
```

## Reglas editoriales

- Responder preguntas reales. No repetir palabras clave.
- Usar un `h1` claro por página.
- Escribir títulos y descripciones distintos.
- Relacionar servicios con proyectos relevantes.
- Describir imágenes y planos por la información que contienen.
- No crear páginas locales vacías o duplicadas.
- No publicar proyectos sin autorización.
- Cada proyecto aprobado usa datos estructurados `CreativeWork` y se incorpora al sitemap.
- Los borradores no generan URL pública, datos estructurados ni enlaces desde especialidades.

## Pendiente para lanzamiento

- Confirmar dominio y URL canónica.
- Registrar el dominio en Search Console.
- Enviar el sitemap.
- Revisar resultados enriquecidos con datos reales de empresa y contacto.
