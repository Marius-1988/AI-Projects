# Changelog - Prompt Manager

## [v2.3] - 2026-03-19

### ✨ Nuevas Funcionalidades
- **Estados de Casos de Uso**: 
  - Se añadieron nuevas etiquetas interactivas de ciclo de vida (*En construcción, Refinamiento, Pruebas, Validado, Publicado*).
  - Selector por defecto en el campo de creación de nuevos casos.
  - Edición en la cuadrícula de forma directa e interfaz con colores diferenciadores y auto-guardado en Firebase.
- **Módulo de Asignaciones**: 
  - Las tarjetas ahora cuentan con un indicador circular a la izquierda de la etiqueta de estado para visualizar el responsable asignado.
  - Se desarrolló un modal (popup) interactivo propio y orgánico al diseño para registrar y modificar las asignaciones, reemplazando las antiguas alertas nativas de Chrome.
- **Explorador Integrado de GitHub**:
  - Nueva visualización agregada en el panel de navegación (`Repositorio` bajo el menú lateral de *Inicio*).
  - Incluye visor de estructura de árbol (carpetas/archivos) conectada a la API en tiempo real del repositorio oficial del proyecto.
  - Previsualización nativa a la derecha de la pantalla de formatos de texto, JSON, código y más.
  - Renderizado nativo avanzado de archivos **Markdown (.md)** interpretando el estilo de forma enriquecida (como en GitHub).
  - Opción universal de descarga para formatos binarios/pesados no soportados por el lector web rápido.

### 💄 Diseño y UI
- **Redistribución de menú global**: El botón de "Añadir Proyecto" fue despromovido de la cabecera (Topbar) e integrado en la sección "Mis Proyectos" operando de forma redonda y discreta (icono `+`).

### 🐛 Bug Fixes & Optimizaciones
- **Eventos de Teclado (Reinicio Forzado)**: Se inhabilitó la actualización y pérdida de progreso de toda la página causada por presionar `Enter` en el input del modal de "Asignaciones".
- **Navegación Dinámica**: Resolución del problema silencioso que bloqueaba la navegación de los atajos dinámicos de sección en la barra lateral provocado por elementos DOM reacomodados en el HTML.
- **Invalidación de Caché Agresivo**: Se incorporó un sistema de control de versiones "Cache Busting" (`?v=2.x`) en los ficheros `app.js` y `styles.css` forzando actualizaciones seguras e inmediatas en GitHub Pages sin el arrastre perjudicial de cachés locales del navegador.
