# Documentación Técnica - Prompt Manager v1.0.0

## 1. Arquitectura del Proyecto
Prompt Manager es una Single Page Application (SPA) construida con tecnologías web estándar para garantizar máxima compatibilidad y velocidad de carga sin dependencias complejas.

### Stack Tecnológico:
- **Frontend:** HTML5 Semántico, CSS3 (Vanilla con variables modernas), JavaScript ES6.
- **Base de Datos:** Firebase Firestore (Google).
- **Control de Versiones:** Git / GitHub.
- **Modelos de IA:** Gemini 1.5, Claude 3.5 Sonnet, GPT-4o.

## 2. Configuración y Despliegue

### Requisitos Previos:
1. Una cuenta en Firebase con un proyecto activo.
2. API Keys de los proveedores de IA correspondientes.

### Configuración de Firebase:
El sistema utiliza una única colección denominada `appData` y un documento centralizado `useCasesDoc`.
- **Colección:** `appData`
- **Documento:** `useCasesDoc`
- **Estructura Interna:** Contiene dos arrays principales: `sections[]` y `useCases[]`.

### Seguridad de API Keys:
Las llaves se almacenan exclusivamente en el `localStorage` del navegador del usuario. Nunca viajan ni se guardan en Firebase, garantizando que el desarrollador no tenga acceso a las credenciales privadas del usuario.

## 3. Conectividad con IA (Backend-less)
La comunicación se realiza mediante `fetch` directo desde el cliente a los endpoints oficiales:
- **Google:** `https://generativelanguage.googleapis.com/v1beta/models/...`
- **Anthropic:** `https://api.anthropic.com/v1/messages`
- **OpenAI:** `https://api.openai.com/v1/chat/completions`

### Lógica de Fallback de Modelos:
El sistema incluye un algoritmo de auto-descubrimiento. Si el modelo configurado por defecto falla o no es soportado por la API Key del usuario, el script consulta el listado de modelos permitidos del proveedor y reintenta la conexión con la primera versión compatible detectada.

## 4. Estructura de Archivos
- `index.html`: Estructura base y Modales.
- `styles.css`: Sistema de diseño (Tokens, Grid, Dark overlays).
- `app.js`: Lógica de negocio, integración con Firebase y manejo de estados de IA.

---
*Generado por Antigravity AI - Marzo 2026*
