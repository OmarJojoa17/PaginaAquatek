# Sistema visual Atlas cobalto

Dirección aprobada en el Módulo 3.5. La identidad combina la precisión territorial de **Atlas
cobalto** con acentos editoriales de **Índigo fluvial**. El objetivo es que la página se sienta como
ingeniería del agua aplicada: clara para quien contrata y rigurosa para quien revisa técnicamente.

La firma visual conserva el descriptor oficial **Ingeniería de Recursos Hídricos**. En el cuerpo se
combina con **Ingeniería del Agua**, una expresión más directa que ayuda a explicar el alcance sin
reemplazar el nombre técnico de la marca.

## Paleta y arquitectura de tokens

Los componentes usan tokens semánticos; los colores de referencia solo se declaran en
`src/styles/global.css`. Así es posible ajustar la identidad sin reescribir cada componente.

| Referencia         | Color     | Función principal                                 |
| ------------------ | --------- | ------------------------------------------------- |
| Azul noche         | `#071E3D` | Marca, texto, redes y acciones principales        |
| Cobalto            | `#174EA6` | Enlaces, curvas de nivel y orientación            |
| Azul señal         | `#3D6FD8` | Cauces, foco y énfasis limitado                   |
| Índigo             | `#3346A8` | Proyectos, etapas de análisis y nodos de decisión |
| Índigo claro       | `#6878CF` | Acentos editoriales sobre fondos oscuros          |
| Línea cartográfica | `#C8D8EE` | Retículas, límites y separadores                  |
| Papel técnico      | `#F4F7FB` | Fondo general                                     |

La distribución orientativa es 60 % papel técnico, 30 % azules cobalto y 10 % índigo. El índigo no
compite con la marca: señala proyectos, modelos y decisiones.

Los pares de texto críticos se comprueban automáticamente con contraste WCAG AA en
`tests/unit/color.test.ts`. La accesibilidad completa también se revisa con Axe en las pruebas del
navegador.

## Tipografía

- Manrope Variable: títulos y navegación; aporta geometría sin imitar un plano literal.
- Source Sans 3 Variable: cuerpo, datos y notas; conserva legibilidad en explicaciones técnicas.

Las fuentes se sirven localmente para evitar dependencias de terceros.

## Lenguaje gráfico

La firma visual nace de tres capas que también explican el trabajo de Aquatek:

1. **Territorio:** curvas de nivel y cuencas.
2. **Sistema:** cauces, tuberías, conexiones y nodos.
3. **Decisión:** modelos, entregables y conclusiones verificables.

La portada usa una lámina Atlas, no una fotografía genérica ni ondas decorativas. Los proyectos
pueden usar fondos índigo para diferenciar la evidencia del contenido institucional.

```text
Móvil                     Escritorio
┌────────────────┐        ┌──────────────────────────────────┐
│ marca     menú │        │ marca      navegación   contacto │
├────────────────┤        ├───────────────┬──────────────────┤
│ mensaje claro  │        │ mensaje claro │ lámina Atlas     │
│ explicación    │        │ y acciones    │ territorio + red │
│ acciones       │        ├───────────────┴──────────────────┤
├────────────────┤        │ especialidades │ proyecto real   │
│ lámina Atlas   │        └──────────────────────────────────┘
├────────────────┤
│ especialidades│
│ proyecto real │
└────────────────┘
```

## Principios

- Los recursos visuales tienen significado técnico; no se agregan trazos por decoración.
- Los planos, modelos y videos reales serán protagonistas del portafolio.
- Los bordes y divisores comunican estructura.
- Movimiento solo como respuesta o para explicar un cambio.
- Texto directo: primero el problema comprensible, después el término técnico necesario.
- Líneas de texto menores de 80 caracteres.
- Foco visible, contraste comprobable y respeto por `prefers-reduced-motion`.
- Navegación móvil con HTML nativo; JavaScript solo cuando aporte una función necesaria.
- Los proyectos explican problema, proceso y resultado; no son tarjetas promocionales aisladas.
- La numeración se reserva para procesos secuenciales; las especialidades no se numeran.

## Componentes base

- `SiteHeader`: marca, navegación de escritorio y menú móvil.
- `SiteFooter`: contacto, mapa del sitio y estado editorial.
- `AtlasDiagram`: lectura conjunta de territorio, red y decisión en la portada.
- `SectionIntro`: relación estable entre título y explicación.
- `ProjectShowcase`: marco índigo para modelo o plano y narrativa técnica.
- `ServiceFlow`: secuencia comprensible del análisis especializado.
- Logo oficial: archivo de marca con el descriptor «Ingeniería de Recursos Hídricos».
