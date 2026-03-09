# Changelog - Día 4: 9 de Marzo, 2026 - Subsecciones y UI Fixes

Cuarto día de desarrollo enfocado en la corrección de errores de la interfaz gráfica y la implementación de una jerarquía organizativa más profunda para los Casos de Uso.

### 🚀 Nuevas Funcionalidades (Core)
- **Soportes para Sub-Secciones:** Implementación de categorización secundaria dentro de las Secciones principales.
- **Creación Masiva de Sub-Secciones:** Posibilidad de definir múltiples sub-secciones separadas por coma al momento de crear o editar una Sección principal.
- **Dropdown Dinámico de Asignación:** Al crear o editar un Caso de Uso, el formulario detecta la Sección seleccionada y despliega dinámicamente un menú con sus sub-secciones disponibles.
- **Asignación Automática:** Lógica de autoselección del primer valor del dropdown si el usuario omite la elección manual de sub-sección, previniendo datos huérfanos.
- **Renderizado por Grupos:** Reestructuración de la vista de Sección. Los Casos de Uso ahora se dibujan agrupados por su respectiva sub-sección, introducidos por un separador visual (`<hr>`) y un título jerárquico.

### 🔧 Mejoras de UI / UX
- **Rediseño de Tarjetas Prompts:** Ensanchamiento de las tarjetas (de 250px a 320px como mínimo) para evitar cortes en el texto y ofrecer una lectura más cómoda del nombre y reglas.
- **Botones Inline Flexibles:** Reestructuración CSS de los contenedores de botones. Uso de Flexbox con propiedades de `align-items` y `gap` forzado para asegurar que los iconos (emojis) permanezcan alineados horizontalmente junto al texto y jamás se apilen por falta de espacio.
- **Refinamiento de Textos (Micro-copy):**
  - Cambio de "+ Añadir" a "+ Añadir Sección" en la barra lateral.
  - Cambio de "Inicio (Dashboard)" a "Inicio" para mayor limpieza.
  - Cambio de "+ Añadir Proyecto Demo" a "+ Añadir Proyecto".

### 🐛 Bugfixes
- **Anidamiento de Modales Fantasma:** Solucionada una falla estructural crítica donde una etiqueta `</div>` faltante en el Modal de *"Ejecutar Caso de Uso"* provocaba que el modal de *"Añadir Sección"* y *"Editar Sección"* quedaran atrapados en el DOM como hijos invisibles de éste. Ahora todos los modales son entidades z-index independientes que se abren instantáneamente.

---
*Día 4: Refinando la experiencia del usuario y expandiendo las capacidades organizativas.*
