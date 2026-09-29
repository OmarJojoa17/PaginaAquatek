# Instrucciones de trabajo

## Objetivo

Construir un sitio profesional de ingeniería hídrica que demuestre el trabajo mediante proyectos
reales, sin copiar estructura, contenido ni identidad de otros sitios.

## Reglas técnicas

- Mantener TypeScript en modo estricto y preferir generación estática.
- Reutilizar componentes solo cuando exista una repetición real.
- Mantener el contenido técnico en `src/content`, separado de la presentación.
- No publicar planos, clientes, ubicaciones, datos o imágenes sin aprobación explícita.
- No agregar originales pesados al repositorio; usar derivados web optimizados.
- No agregar JavaScript al cliente si HTML y CSS son suficientes.
- Ejecutar `pnpm run ci` antes de dar por terminado un módulo.
- Si cambia una interacción crítica, actualizar su prueba E2E.

## Diseño y accesibilidad

- Diseñar primero para pantallas pequeñas y ampliar progresivamente.
- Conservar foco visible, HTML semántico, contraste suficiente y movimiento reducido.
- Evitar tarjetas repetitivas, efectos gratuitos y lenguaje comercial vacío.
- Usar el sistema definido en `docs/DESIGN_SYSTEM.md`.

## Documentación

Registrar cambios de arquitectura, contenido, pruebas o decisiones visuales en `docs/`.
