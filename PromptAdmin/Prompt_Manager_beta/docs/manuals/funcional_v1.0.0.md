# Manual Funcional - Prompt Manager v1.0.0

## 1. Introducción
Prompt Manager es una herramienta avanzada para la gestión, prueba y ejecución de Casos de Uso integrados con Modelos de Lenguaje (IA). La aplicación permite centralizar y organizar conocimiento de ingeniería de prompts en un entorno colaborativo y persistente.

## 2. Funcionalidades Principales

### Gestión de Secciones
Las secciones permiten agrupar los Casos de Uso por temática o proyecto.
- **Creación:** Nuevo botón `+ Añadir` en la barra lateral.
- **Edición:** Botón de `Lápiz` (Pencil) permite renombrar y cambiar la descripción sin perder los casos vinculados.
- **Migración Automática:** Ante nuevas actualizaciones, los casos sin clasificar se agrupan en "Demos Rápidas".

### Ejecución e Iteración (Chat)
- **Selección de Modelos:** Integración con Gemini, Claude y GPT-4o.
- **Interacción Contextual:** El sistema conserva el historial de la conversación. Las nuevas instrucciones se envían junto con las respuestas previas de la IA para un refinamiento continuo.
- **Detección de Código (Magic Zero Setup):** Si la IA responde con código HTML, el sistema detecta el bloque y genera un botón para abrir la aplicación generada en una pestaña independiente.

### Dashboard (Panel de Inicio)
- **Top 5 Populares:** Muestra los casos más ejecutados en tiempo real.
- **Mis Proyectos:** Enlaces directos a resultados previos guardados en local.

## 3. Flujos de Trabajo (VPA)

### Flujo de Creación:
1. Definir una `Sección`.
2. Crear un `Caso de Uso` y asignarlo a dicha sección.
3. El sistema sincroniza automáticamente con Firebase Firestore.

### Flujo de Ejecución:
1. Seleccionar un caso -> Abrir modal.
2. Ingresar el `Input` del usuario.
3. Seleccionar `Modelo IA`.
4. Visualizar log de la consola.
5. `Iterar` (Chat) para refinar el resultado si fuese necesario.

## 4. Diagramas de flujo (Simbolizados)
- **Usuario** -> [Ingresa Input] -> **Prompt Manager** -> [Construye Prompt con Reglas] -> **IA Cloud** -> [Procesa] -> **Prompt Manager** -> [Muestra Log / Ofrece Iteración].

---
*Generado por Antigravity AI - Marzo 2026*
