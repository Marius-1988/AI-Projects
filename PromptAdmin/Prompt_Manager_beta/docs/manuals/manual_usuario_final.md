# Manual de Usuario - Prompt Manager v1.0.0

Bienvenido al manual oficial de **Prompt Manager**. Esta guía le permitirá dominar todas las herramientas para la gestión, ejecución y refinamiento de inteligencia artificial.

---

## 1. Configuración de API Keys (Handshake Inicial)
Para que el sistema se comunique con las IAs (Gemini, Claude, GPT), primero debe configurar sus credenciales.

**Paso a paso:**
1. **Acción:** El usuario hace clic en el icon de **Tuerca (⚙️)** ubicado en la cabecera superior derecha.
2. **Respuesta:** El sistema abre el modal de "Configuración de API Keys".
3. **Acción:** Ingrese sus llaves privadas en los campos correspondientes (Gemini, Anthropic, OpenAI).
4. **Finalización:** Haga clic en el botón azul **"Guardar"**.
5. **Resultado:** El sistema emite un mensaje emergente (Toast): *"API Keys guardadas localmente de forma segura"*.

*Nota: Sus llaves nunca salen de su navegador; se guardan solo en su memoria local.*

---

## 2. Gestión de Secciones (Organización)
Las secciones permiten categorizar sus carpetas de trabajo en la barra lateral izquierda.

### 2.1 Crear Nueva Sección
1. **Acción:** Haga clic en el botón **`+ Añadir`** al final de la lista de SECCIONES en la barra lateral.
2. **Respuesta:** Se despliega el modal "Añadir Nueva Sección".
3. **Acción:** Complete el Nombre de la sección y su Descripción. Haga clic en **"Crear Sección"**.
4. **Resultado:** La nueva sección aparece instantáneamente en su menú de navegación lateral.

### 2.2 Editar Sección Existente (Renombrar)
1. **Acción:** Haga clic en el botón de **Lápiz (✏️)** al lado del botón añadir.
2. **Respuesta:** El sistema abre el selector de secciones para editar.
3. **Acción:** Elija la sección a modificar del menú desplegable. Los campos se autocompletarán con la información actual.
4. **Finalización:** Modifique el nombre o descripción y pulse **"Confirmar"**.
5. **Resultado:** El sistema actualiza el nombre en la barra lateral y en el encabezado de la sección sin perder los casos ya creados.

---

## 3. Gestión de Casos de Uso
Un Caso de Uso es la unidad mínima de ejecución (Instrucciones + Prompt).

### 3.1 Crear Caso de Uso
1. **Acción:** En la pantalla de Inicio (Dashboard) o dentro de una sección, pulse el botón azul **`+ Crear Caso de Uso`**.
2. **Respuesta:** El sistema abre el formulario de creación.
3. **Acción:** 
   - **Nombre:** Identifique su prompt (ej: "Optimizar Código JS").
   - **Reglas del Prompt:** Escriba las instrucciones de comportamiento para la IA.
   - **Sección:** Elija dónde guardarlo.
4. **Resultado:** El caso se guarda en la nube (Firestore) y aparece en su grilla.

### 3.2 Editar Caso de Uso
1. **Acción:** Localice la tarjeta del caso y haga clic en el icono de **Lápiz (✏️)** en la esquina superior derecha de la tarjeta.
2. **Respuesta:** El formulario se abre cargado con los datos del caso seleccionado.
3. **Acción:** Realice los cambios y pulse **"Guardar Caso"**.

---

## 4. Ejecución e Iteración (Modo Chat)
Esta es la funcionalidad core del sistema para pruebas interactivas.

### 4.1 Ejecutar Caso de Uso
1. **Acción:** En la tarjeta deseada, haga clic en el botón con el rayo **`⚡ Ejecutar`**.
2. **Respuesta:** Se abre el modal de ejecución. En la izquierda verá las "Reglas", en el centro el "Input" y en la derecha la "Terminal".
3. **Acción:** Ingrese su consulta en la caja de texto y seleccione el **"Modelo IA"** deseado. Haga clic en **"⚡ Ejecutar"**.
4. **Resultado:** Se bloquea la interfaz (Efecto Blur) y la terminal muestra el log: `> Estableciendo Handshake TLS...` hasta que aparece el resultado de la IA.

### 4.2 Iterar / Refinar (Chat Continuo)
1. **Situación:** Una vez recibida la primera respuesta, si desea ajustar el resultado:
2. **Acción:** Escriba su nueva instrucción en el mismo cuadro de texto abajo (ej: *"Hazlo más corto"*). El botón ahora dirá **"⚡ Iterar / Enviar"**.
3. **Respuesta:** El sistema compacta la respuesta anterior en un bloque desplegable (`📜 Ver Ejecución anterior...`) y envía su nueva orden con todo el contexto previo.

### 4.3 Magic Zero Setup (Vista Previa Web)
- **Detección:** Si el resultado de la IA contiene código HTML, el sistema detecta automáticamente un bloque ejecutable.
- **Acción:** El sistema inyecta un botón verde vibrante: **"👉 ABRIR APLICACIÓN GENERADA (index.html) 👈"**.
- **Resultado:** Al hacer clic, se abre su aplicación web funcional en una pestaña nueva del navegador.

---
*Fin del Manual de Usuario v1.0.0*
