# Documentación de Ingeniería - Prompt Manager v1.1.0

> ***"Una arquitectura de software no es más que el conjunto de decisiones de diseño que resultan costosas de cambiar."*** — *Fundamentals of Software Architecture (Mark Richards & Neal Ford).*

Este documento detalla exhaustivamente las decisiones de diseño arquitectónico, el modelo de datos, la lógica subyacente y las integraciones de API que potencian **Prompt Manager v1.1.0**. Concebida para la transferencia de conocimiento ágil y transparente hacia nuevos ingenieros de software, esta guía se estructura enfocándose en la claridad, la extensibilidad y la resiliencia del código.

---

## 1. Visión Arquitectónica y Topología

Prompt Manager está diseñado bajo el patrón **Serverless Single Page Application (SPA)**, apoyado en un modelo de **Backend-as-a-Service (BaaS)** proporcionado por Google Firebase.

### 1.1 Decisiones de Diseño (Trade-offs)
Se optó por utilizar **HTML5/Vanilla JavaScript (ES6 Modules)** en lugar de un framework como React o Angular.
*   **Ventaja:** Permite una aplicación extremadamente liviana, con tiempo de inicialización casi nulo (Zero-bundle), sin dependencias transitorias vulneables y con despliegue directo estático.
*   **Gestión de Estado:** El estado se mantiene globalmente en memoria (Arrays `useCases`, `sections`, etc.) y se sincroniza reactivamente con las funciones de renderizado del DOM (`renderUseCases`, `renderPopularCases`).
*   **Seguridad:** Al no existir un backend propio que ofusque las credenciales de inteligencias artificiales, se implementó un patrón de "Bóveda Local", forzando a que las API Keys residan exclusivamente en el `localStorage` del cliente.

### 1.2 Flujo de Datos General (Data Flow)
1.  **Inicialización (`DOMContentLoaded`):** El cliente realiza un `fetchCases()` contra Firestore.
2.  **Reconciliación y Bootstrapping:** Se evalúan casos huérfanos (compatibilidad legacy), se hidrata la memoria global y se reconstruye el menú de la Barra Lateral (`renderSectionsMenu`) y el Dashboard.
3.  **Event-Driven Interaction:** Clics en la UI disparan mutaciones de estado, seguidas inmediatamente por un `await saveCases()` (Single Source of Truth) y una re-inyección en el DOM interno correspondiente.

---

## 2. Modelo de Datos y Persistencia

La aplicación reparte su persistencia en dos dominios estrictos basados en riesgos de seguridad y necesidades de sincronización.

### 2.1 Dominio Cloud: Firebase Firestore
Maneja el conocimiento global, estructural y colaborativo. Se estructuró bajo el patrón *"Single Meta-Document"* para evitar la complejidad de lecturas/escrituras masivas, optimizando la cuota gratuita del plan Spark.

*   **Colección:** `appData`
*   **Documento Único:** `useCasesDoc`
*   **Schema (JSON representation):**
    ```json
    {
      "sections": [
        {
          "id": "sec_17099234123", // Timestamp-based UID
          "name": "Frontend",
          "desc": "Prompts de UI",
          "subsections": ["React", "Vue", "CSS"] // Array opcional
        }
      ],
      "useCases": [
        {
          "id": "17099994123",     // Timestamp-based UID
          "name": "Generador de Nav",
          "rules": "Eres experto en Tailwind...",
          "input": "Menú responsive dark mode",
          "sectionId": "sec_17099234123", // FK a Section
          "subsection": "React",          // Agrupación visual dinámica
          "executeCount": 15,             // Metadato para el Dashboard "Top 5 Populares"
          "status": "Validado",           // Ciclo de vida del prompt (En construcción, Refinamiento, etc)
          "assignedTo": "Mariana"         // Persona responsable a cargo (Frontend tagging)
        }
      ]
    }
    ```

### 2.2 Dominio Local: Local Storage
Almacena secretos de usuario y preferencias de la máquina local.
*   `prompt_manager_key_gemini`: Credencial en texto plano (AIzaSy...).
*   `prompt_manager_key_anthropic`: Credencial en texto plano (sk-ant-...).
*   `prompt_manager_key_openai`: Credencial en texto plano (sk-proj...).
*   `prompt_manager_local_demos`: Array JSON de aplicaciones locales del desarrollador. No se envían a la nube ya que los "paths" locales (ej. `C:/dev/...`) varían por máquina computacional.

---

## 3. Integración de APIs de Inteligencia Artificial (LLMs)

El componente más crítico de software. Basado en las guías de *"Design of Web APIs"*, la función `executeAIApiCall(model, apiKey, messagesHistory)` actúa como un patrón **Fassade / Gateway** que abstrae al cliente interno de las profundas diferencias entre los endpoints de Google, Anthropic y OpenAI.

### 3.1 Google Gemini (Generative Language API)
*   **Endpoint:** `https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent`
*   **Autenticación:** Vía Query Parameter (`?key=API_KEY`).
*   **Adaptación de Historial (Iterativo):** Mapea el array `messagesHistory` al formato estricto de Gemini: `role: "user"` y `role: "model"` (notar que Gemini usa "model" en lugar de "assistant").
*   **Fallback Strategy:** 
    1.  Intenta `gemini-1.5-flash-latest`.
    2.  Si retorna `404` o falla, decae automáticamente a la versión legacy mundial: `gemini-pro`.

### 3.2 Anthropic Claude (Messages API)
*   **Endpoint:** `https://api.anthropic.com/v1/messages`
*   **Autenticación:** Vía Headers (`x-api-key: API_KEY`). Requiere el header de versionado (`anthropic-version: 2023-06-01`).
*   **Seguridad Frontend:** Requiere inyectar el header `anthropic-dangerous-direct-browser-access: true`, de lo contrario, Anthropic bloquea las llamadas directas desde preflight CORS.
*   **Fallback Auto-Discovery:** Si el modelo default (`claude-3-5-sonnet-20241022`) no existe para la tier del usuario, realiza un request `GET /v1/models`, filtra la respuesta buscando IDs que incluyan "claude" y reintenta con el primero compatible hallado.

### 3.3 OpenAI GPT (Chat Completions API)
*   **Endpoint:** `https://api.openai.com/v1/chat/completions`
*   **Autenticación:** Vía Headers (`Authorization: Bearer API_KEY`).
*   **Adaptación de Historial:** Mapeo nativo `role: "user" | "assistant"`.
*   **Fallback Auto-Discovery:** Al igual que Anthropic, si `gpt-4o` resulta en un `404`, el catch realiza un `GET /v1/models`, busca el primer string que comience con `gpt-` y reitera la petición garantizando la ejecución exitosa frente al usuario.

---

## 4. Lógicas Core Funcionales (Mecánica de Procesos)

### 4.1 Ciclo de Vida: Conversación Iterativa (Memoria de Estado)
Al ejecutar el botón "⚡ Ejecutar":
1.  **Arranque Original:** Concatenación del prompt: `[REGLAS GENERALES]\n...\n\n[INPUT]\n...`. 
2.  **Registro y Bloqueo:** El payload formatado se inyecta en array de estado `currentMessagesHistory`. El select `<select>` del Modeo IAM se deshabilita preventivamente (Atributo `disabled`) para "bloquear" al usuario dentro de la misma canalización de infraestructura en turnos subsecuentes.
3.  **Chat Secuencial:** El usuario escribe un nuevo input y presiona `Iterar`. El sistema realiza una limpieza visual manipulando el DOM de la Consola, metiendo las lineas generadas previas (`div.console-line`) dentro de un tag nativo HTML5 `<details><summary>📜 Ver Ejecución anterior...</summary></details>`. Esto provee UX limpia (compactación histórica) sin borrar nodos reales. Luego, anexa el nuevo string e invoca nuevamente al Facade.

### 4.2 Proyección "Magic Zero Setup" On-The-Fly
Implementa una Expresión Regular (`/```html\s*([\s\S]*?)```/`) que actúa como middleware de intercepción visual (Hook):
1.  Si el string devengado de la IA hace match en la RegEx, extrae el Grupo 1 (El código fuente subyacente crudo).
2.  Instancia un Blob de tipo MIME `text/html`: `new Blob([htmlContent], { type: 'text/html' })`.
3.  Genera una URL temporal ramificada usando API nativa del navegador: `URL.createObjectURL(blob)`.
4.  Inyecta un DOM Node `<a>` forzando un `target="_blank"`. Esto confiere al usuario una vista renderizada de un prototipo en una micro-fracción temporal sin necesidad de IDEs externos ni servidores web.

### 4.3 Algoritmos de Renderizado Jerárquico (Sub-Secciones Opcionales)
El renderizador `renderUseCases()` utiliza heurísticas de agrupación en tiempo polinomial *O(n)*:
1.  Recorre `useCases`. Usa objetos (`let groups = {}`) a modo de HashMap clasificando los casos de uso por su propiedad estructural `subsection` respectiva.
2.  Si el Caso de Uso omitió tener sub-sección predefinida, lo indexa como "General".
3.  Imprime secuencialmente un tag HTML horizontal (`<hr>`) combinando interpolación JavaScript para recrear encabezados estilizados antes de inyectar las `.usecase-card`. 

---

## 5. Arquitectura del User Interface (Estilos & DOM)

La hoja de cascada `styles.css` adhiere a métricas progresivas.

*   **Grid System Automático:** Se apoya en especificaciones intrínsecas del navegador: `grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));`. Esto elude complejas Media Queries ofreciendo adaptabilidad responsiva inherente mediante *CSS Math*.
*   **Seguridad de Modales (Z-Index Hierarchy):** Una sola clase CSS (`.modal` envuelta como "hidden" u "open") en conjunción con variables RGB (`--bg-card-rgb`) para procesar blureos superpuestos con Pseudo-Elementos (`::after` + `backdrop-filter`). Al establecer `pointer-events: none !important;` durante las resoluciones asincrónicas de Promesas JS (el estado "loading"), se cancelan matemáticamente acciones de multi-click corruptivas a la base de datos sin necesitar de listeners JS anulativos.
*   **Estrategia Flex-Button:** Se emplea `display: flex; gap: 5px; flex-wrap: nowrap` para que los iconos de los botones no colisionen (clip) contra las cajas delimitadoras de texto en pantallas reducidas.

---

## 6. Integración de Sistemas Externos

### 6.1 Explorador de Repositorio (GitHub API REST)
A partir de la versión 1.1.0, el sistema incluye un módulo `loadRepo()` acoplado a la API pública de GitHub. No requiere de personal API Tokens para operar su límite estándar público:
1.  **Exploración Recursiva (`fetchRepoDir`):** Invoca metadatos del árbol de directorios obteniendo en vivo los contenidos mediante `GET /repos/{owner}/{repo}/contents/{path}` mapeándolos como nodos jerárquicos.
2.  **Preview Markdown Nativo:** Identifica formato `.md` y apalanca la librería `marked.js` inyectada en capa HTML. Transforma *Abstract Syntax Trees (AST)* a DOM renderizable insertando de forma segura código enriquecido.

---
*Fin Documentación de Ingeniería v1.1.0. Revisado Marzo 2026. Antigravity AI & Marius.*
