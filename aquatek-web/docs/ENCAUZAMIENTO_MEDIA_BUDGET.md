# Presupuesto de medios — encauzamiento de cauce

## Decisión técnica

El caso se integra con un video H.264 de 87 segundos a 1920 × 1080 y 16 derivados
web de mapas, modelos y planos. El video se exportó con CRF 18 y pesa aproximadamente 42,6 MiB;
los derivados conservan resolución suficiente para distinguir curvas, secciones y líneas finas.

No se reduce adicionalmente el bitrate porque una compresión más agresiva perjudicaría la lectura
de los elementos técnicos. El presupuesto global auditado del sitio se amplía de 155 a 210 MiB,
manteniendo los límites individuales de 76 MiB por video y 7 MiB por imagen. El total medido tras
la integración permanece por debajo del nuevo límite.

## Alcance editorial

- Solo se publican derivados web; los PDF y archivos fuente permanecen fuera de `public/`.
- La ficha se publica con `publicationStatus: published` y `approvedForPublication: true` tras la
  aprobación explícita recibida.
- La publicación se valida mediante una ejecución completa de CI y E2E.
