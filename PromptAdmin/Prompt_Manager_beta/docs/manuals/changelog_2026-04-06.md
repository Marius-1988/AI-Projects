# Changelog - 06 de Abril de 2026

## 🚀 Nuevas Funcionalidades
- **Historial Descargable en formato `.md`:**
  - Se agregaron botones ("⬇️ Historial (.md)" y "⬇️ Última Res (.md)") en el modal de Terminal de Ejecución.
  - Permite documentar la conversación con la inteligencia artificial exportando la iteración completa (Reglas, Input de Usuario y Respuesta de IA) directamente a un archivo de texto en formato Markdown nativo.
- **Campo de Descripción en Casos de Uso:**
  - Se añadió la propiedad opcional `Descripción` (`desc`) durante la creación y edición de Casos de Uso, permitiendo resumir la funcionalidad del prompt.
  - La descripción es ahora visible dinámicamente en una etiqueta emergente (title/tooltip) al posar el mouse sobre las tarjetas en la pantalla inicial.
  - La descripción se imprime gráficamente bajo el título del prompt al momento de abrir el Modal de Ejecución para servir como recordatorio.

## 🐛 Correcciones de Errores & Mejoras Core
- **Optimización y Fiabilidad del "Zero Setup":**
  - **Detección Estricta de Falsos Positivos:** Se rediseñó totalmente la heurística de inyección. El antiguo atrapador genérico fue reemplazado por reglas estrictas que buscan firmas de nodos HTML puros (`<div`, `<body`, `<style`) para impedir que textos comunes aislados generen falsos positivos web.
  - **Auto-cierre y Detección de "Tokens Excedidos":** El sistema fue adiestrado para calcular cierres truncados. Cuando la IA agota sus tokens de respuesta a mitad del código (dejando expuestas etiquetas como `<style>`), el sistema inyecta cierres artificiales, y adicionalmente implementa un robusto mensaje de error interno ("⚠️ Ejecución Incompleta") pidiendo instrucción de continuidad. Se erradica por completo la incidencia de las infames "Pestañas/Tabs Blancas".
  - **Layout Posicional "Sube-Escaleras" para Zero Setup:** El gran botón dinámico verde y vibrante ("ABRIR APLICACIÓN GENERADA") fue deliberadamente reubicado al instante `0` de carga por sobre la cabecera del cuerpo de lectura del dom, anclándose fuertemente como el inicio textual indisputable.

## 🛠 Cambios Arquitectónicos / Technical Health
- **Sistema de Invalidador de Caché Intrusivo (`Cache Busting`):**
  - Forzamiento en los tags de importación nativos (versionado a `v2.6`). Al ajustar los headers de lectura principal (`app.js?v=2.6` y `styles.css?v=2.6`), se anularon los antiguos bucles de memoria fantasma que afectaban a los navegadores del cliente, provocando conflictos visuales donde el backend había insertado un ítem pero el HTML base permanecía cacheado.
- **Rendimiento sobre Motor Markdown DOM:**
  - El sistema de procesarlo fue simplificado y abstraído luego de garantizar el Blob. `marked.parse` es aplicado como pasaje de texto puro y no destructivo del renderizado originario.
