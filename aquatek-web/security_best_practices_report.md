# Auditoría de seguridad web

Fecha: 28 de septiembre de 2026

Alcance: código de `aquatek-web`, contenido público, proceso de compilación y flujo de CI.

Fuera de alcance: configuración HTTP del proveedor, DNS y dominio, porque todavía no existe un
despliegue público definitivo.

## Resumen ejecutivo

El sitio tiene una superficie de ataque baja: se genera de forma estática, no recibe formularios,
no autentica usuarios, no guarda datos en el navegador y no carga JavaScript de terceros. La
consulta al registro de npm no reportó vulnerabilidades conocidas en dependencias de producción ni
de desarrollo.

Durante la auditoría se corrigió el hallazgo de mayor valor: ahora cada página incluye una Content
Security Policy generada por Astro con hashes SHA-256 y sin `unsafe-inline` ni `unsafe-eval`. También
se fijaron las versiones de todas las dependencias, se agregó seguimiento mensual mediante
Dependabot y se incorporó una comprobación de seguridad al build.

No quedan hallazgos altos ni medios en el código revisado. Queda un punto bajo asociado a las
cabeceras que GitHub Pages no permite configurar directamente.

## Hallazgos abiertos

### SEC-002 — Cabeceras limitadas por GitHub Pages

- Rule ID: `JS-CSP-001`
- Severidad: baja
- Ubicación: respuesta pública de `https://omarjojoa17.github.io/PaginaAquatek/`.
- Evidencia: la comprobación posterior al despliegue confirmó HTTPS y
  `Strict-Transport-Security: max-age=31556952`. GitHub Pages no entrega
  `X-Content-Type-Options`, `Permissions-Policy` ni una CSP como cabecera HTTP.
- Impacto: faltan capas complementarias contra interpretación incorrecta de MIME y uso innecesario
  de capacidades del navegador. `frame-ancestors` no se puede aplicar mediante metaetiqueta.
- Corrección recomendada: configurar las cabeceras faltantes en la capa DNS/CDN cuando se conecte el
  dominio propio.
- Mitigación actual: CSP estricta con hashes, `object-src 'none'`, `frame-src 'none'`,
  `base-uri 'self'`, política de referencia restrictiva y ausencia de operaciones sensibles.
- Posible falso positivo: bajo; la respuesta pública fue inspeccionada después del despliegue.

## Hallazgos corregidos

### SEC-R03 — Acciones de CI referenciadas mediante etiquetas mutables

- Rule ID: `JS-SUPPLY-001`
- Severidad original: baja
- Ubicación corregida: `../.github/workflows/web-ci.yml`
- Corrección aplicada: todas las acciones del flujo de verificación y GitHub Pages quedaron fijadas
  a hashes SHA completos, con su versión legible en comentarios. Los permisos de escritura de Pages
  existen únicamente en el trabajo de despliegue; las dependencias y pruebas se ejecutan con
  `contents: read`.

### SEC-R01 — Ausencia de Content Security Policy

- Rule ID: `JS-CSP-001`, `JS-CSP-002`
- Severidad original: media
- Ubicación corregida: `astro.config.mjs:9-25`
- Evidencia anterior: no existía configuración CSP.
- Corrección aplicada: Astro calcula hashes SHA-256 de sus scripts y estilos y agrega una política
  por página. La prueba en `tests/e2e/institutional.spec.ts` confirma que no aparecen
  `unsafe-inline` ni `unsafe-eval` y que el buscador sigue funcionando.

### SEC-R02 — Rangos de dependencia no deterministas

- Rule ID: `JS-SUPPLY-001`
- Severidad original: baja
- Ubicación corregida: `package.json:25-39`, `pnpm-lock.yaml`
- Evidencia anterior: varias dependencias usaban `latest` y dos usaban rangos con `^`.
- Corrección aplicada: todas las versiones son exactas, el CI conserva `--frozen-lockfile` y
  Dependabot revisa actualizaciones mensualmente.

## Revisiones sin hallazgo

- El único `set:html`, en `src/layouts/SiteLayout.astro:64`, serializa objetos controlados del sitio,
  escapa el carácter `<` y se usa solo para JSON-LD. No recibe HTML del visitante.
- No se encontraron `innerHTML`, `outerHTML`, `document.write`, `eval`, `new Function`,
  `javascript:`, manejadores de evento en cadena, `postMessage`, `localStorage` ni `sessionStorage`.
- No existen scripts, iframes, fuentes o estilos cargados desde terceros.
- Los enlaces que abren otra pestaña usan `rel="noopener"`.
- No hay archivos fuente `.pdf`, `.dwg`, `.docx`, `.xlsx`, `.rvt` o `.zip` dentro de `public/`.
- `pnpm audit` y `pnpm audit --prod`: cero vulnerabilidades conocidas al 28 de septiembre de 2026.

## Criterio para el siguiente control

Repetir la auditoría después del despliegue provisional y antes de activar el dominio. Esa segunda
pasada debe incluir cabeceras HTTP, HTTPS, redirecciones, URL canónica, archivos reales publicados y
permisos del repositorio.
