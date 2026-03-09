# Changelog - Update Final v1.0.0 - 9 de Marzo, 2026

Listado de cambios técnicos y funcionales realizados en la última sesión de desarrollo previo al cierre de la versión 1.0.0:

### 🚀 Nuevas Funcionalidades
- **Sistema de Edición de Secciones:** Se añadió la capacidad de renombrar y modificar descripciones de secciones existentes. Se implementó una lógica de vinculación persistente mediante IDs únicos para no perder datos.
- **Modo Chat Iterativo:** Implementación de conversación multi-turno. Ahora es posible repreguntar sobre un mismo resultado para refinar la respuesta de la IA.
- **Compactación Dinámica de Logs:** Se añadió un sistema de agrupado (Details/Summary) en la consola para ocultar ejecuciones previas y centrar la vista en el resultado actual.
- **Auto-descubrimiento para Claude:** Se extendió el sistema de fallback inteligente a la API de Anthropic (Claude).

### 🔧 Mejoras Técnicas y UI
- **Handshake Fallback Handler:** Refactorización de la lógica de conexión para Gemini y GPT-4o, mejorando la detección de cuotas excedidas o modelos no encontrados.
- **Bloqueo Visual de Interfaz (Processing State):** Nuevo efecto de overlay con desenfoque (blur) y bloqueo de puntero durante las llamadas a la API para evitar conflictos de ejecución.
- **Corrección de Transparencia del Modal:** Ajuste de estilos CSS para evitar que el fondo del dashboard se transparente a través del modal de procesamiento.
- **Migración de Datos Huérfanos:** Script de compatibilidad para asignar automáticamente casos de uso antiguos a la categoría "Demos Rápidas".
- **Limpieza de UI de Ejecución:** Eliminación de bloques descriptivos de modelos innecesarios para un flujo de usuario más ágil.

### 🐛 Bugfixes
- Reparado error de renderizado que ocultaba la sección "Mis Proyectos" en el Dashboard.
- Corregida la variable `--bg-card-rgb` para permitir efectos de transparencia interna sin afectar la estructura principal.

---
*Cierre de ciclo de desarrollo v1.0.0*
