# Módulo 6.3 — Despliegue provisional en GitHub Pages

## Objetivo

Publicar una vista revisable en `https://omarjojoa17.github.io/PaginaAquatek/` sin habilitar todavía
la indexación en buscadores.

## Controles aplicados

- Compilación estática con `base=/aquatek-web`.
- `PUBLIC_ALLOW_INDEXING=false` como valor seguro por defecto.
- Etiqueta `robots` con `noindex, nofollow` y `robots.txt` con `Disallow: /`.
- GitHub Actions con permisos separados por trabajo.
- Solo el trabajo de despliegue recibe `pages: write` e `id-token: write`.
- Acciones externas fijadas por SHA y documentadas con su versión mayor.
- Artefacto limitado a `aquatek-web/dist`.
- Archivos fuente y medios originales fuera del artefacto público.

## Publicación

1. Crear el repositorio público `OmarJojoa17/aquatek-web`.
2. Elegir **GitHub Actions** en **Settings > Pages > Build and deployment > Source**.
3. Subir la rama `main`.
4. Esperar los trabajos `verify`, `build-pages` y `deploy`.
5. Verificar la URL pública, enlaces, video, CSP y bloqueo de indexación.

## Apertura futura a buscadores

La indexación solo se habilitará después de aprobar dominio, contenido y SEO. El cambio debe ser
explícito: `PUBLIC_ALLOW_INDEXING=true`.
