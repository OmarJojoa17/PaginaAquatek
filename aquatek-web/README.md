# Aquatek | Ingeniería de Recursos Hídricos

Sitio corporativo y portafolio técnico de Aquatek. La marca conserva «Ingeniería de Recursos
Hídricos» y el contenido emplea también «Ingeniería del Agua» para explicar el trabajo con claridad.
El proyecto está construido con Astro y
TypeScript, con generación estática para facilitar rendimiento, SEO y despliegues reproducibles.

## Requisitos

- Node.js 24 (mínimo compatible con el proyecto: 22.12).
- pnpm 11.

## Comandos

```sh
pnpm install
pnpm dev
pnpm check
pnpm test:unit
pnpm test:e2e:install
pnpm test:e2e
pnpm build
```

`pnpm run ci` ejecuta formato, comprobación de Astro/TypeScript, pruebas unitarias y compilación.

## Despliegue provisional

El workflow `.github/workflows/web-ci.yml` verifica el proyecto y publica la rama `main` en GitHub
Pages. La vista previa usa:

```text
PUBLIC_SITE_URL=https://omarjojoa17.github.io/aquatek-web/
PUBLIC_BASE_PATH=/aquatek-web/
PUBLIC_ALLOW_INDEXING=false
```

La URL pública funciona, pero las etiquetas `robots` y el archivo `robots.txt` bloquean la
indexación mientras el sitio siga en revisión. Para abrir el sitio a buscadores se debe cambiar
explícitamente `PUBLIC_ALLOW_INDEXING` a `true` después de aprobar contenido, dominio y SEO.

## Estructura

```text
src/components/       Componentes reutilizables
src/content/          Servicios y proyectos validados por esquema
src/layouts/          Estructuras compartidas de página
src/pages/            Rutas públicas
src/styles/           Tokens y estilos globales
src/utils/            Lógica pura que puede probarse unitariamente
tests/unit/           Pruebas de utilidades y reglas de contenido
tests/e2e/            Pruebas de navegación en navegador real
docs/                 Decisiones de producto, diseño y arquitectura
```

## Contenido multimedia

Los originales de video, imágenes de render y planos no se guardan en este repositorio. Solo se
publican derivados optimizados, sin información confidencial y con autorización para divulgación.
Consulta [docs/CONTENT_MODEL.md](docs/CONTENT_MODEL.md).
