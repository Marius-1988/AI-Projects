# Manual de Usuario - Prompt Manager v1.1.0

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

### 2.1 Crear Nueva Sección (y Sub-secciones)
1. **Acción:** Haga clic en el botón **`+ Añadir Sección`** al final de la lista de SECCIONES en la barra lateral.
2. **Respuesta:** Se despliega el modal "Nueva Sección".
3. **Acción:** Complete el Nombre de la sección, su Descripción y, opcionalmente, escriba múltiples **Sub-secciones** separadas por coma (ej: *Logística, Inventario, HR*).
4. **Finalización:** Haga clic en **"Guardar"**.
5. **Resultado:** La nueva sección aparece en su menú de navegación lateral. Las sub-secciones se guardarán internamente para ser utilizadas al momento de clasificar nuevos Prompts.

### 2.2 Editar Sección Existente (Renombrar y Sub-secciones)
1. **Acción:** Haga clic en el botón de **Lápiz (✏️)** ubicado en la zona inferior de la barra lateral, junto a Añadir Sección.
2. **Respuesta:** El sistema abre el rápido selector de edición.
3. **Acción:** Elija la sección a modificar. Los campos se autocompletarán instantáneamente.
4. **Finalización:** Modifique el nombre, la descripción o inyecte nuevas **Sub-secciones** separadas por coma en la caja final. Pulse **"Confirmar"**.
5. **Resultado:** La plataforma re-nombra la etiqueta de la carpeta lateral de inmediato conservando íntegro el linaje de datos de todos los casos previamente creados allí.

---

## 3. Gestión de Casos de Uso
Un Caso de Uso es la unidad mínima de ejecución (Instrucciones + Prompt).

### 3.1 Crear Caso de Uso (Clasificación Avanzada)
1. **Acción:** En la pantalla **Inicio** (Dashboard) o dentro de cualquier sección de trabajo activa, presione el botón macizo azul de cabecera **`+ Crear Caso de Uso`**.
2. **Respuesta:** Emergerá el formulario "Nuevo Caso de Uso" (un popup).
3. **Acción:** 
   - **Nombre:** Identifique su directriz brevemente (ej. "Generador de Copywriting").
   - **Sección:** Despliegue el selector. ¡Una vez elegida su métrica principal, nacerá justo debajo un nuevo selector de **Sub-Sección**! 
   - **Sub-Sección:** Señale la carpeta interna de agrupación. Si omite este paso, el motor pre-seleccionará automáticamente el primer rubro disponible.
   - **Reglas del Prompt:** Digite el comportamiento macro e inmutable destinado a la IA.
4. **Resultado:** Tras el **"Guardar"**, su modelo será transmitido a Firestore Cloud. Al ingresar desde el panel lateral a su Sección de trabajo, experimentará que todos los Casos de Uso ahora se subdividen ordenadamente en el lienzo de forma horizontal con elásticos separadores de título, facilitando el recorrido ágil por proyectos complejos.

### 3.2 Editar Caso de Uso (Reglas Subyacentes)
1. **Acción:** Localice presencialmente la tarjeta de su caso en la UI, luego presione su botón central **`⚡ Ejecutar`** apuntando hacia su respectiva consola de manipulación pre-test.
2. **Respuesta:** En la columna de ajustes izquierdos de dicho modal recién abierto, y paralelo a la etiqueta de "Reglas generales del prompt", atisbará un sutil botón azul contentivo a un pictograma de **Lápiz (✏️)**. Púlselo.
3. **Acción:** Su modalidad es interrumpida; el sistema solapará en primer plano el "Editar Caso de Uso", ya pre-cargado desde sus metadatos vitales. Alterne la Sección, Sub-sección o tuneé el Prompt, y finalice percutiendo en **"Guardar"**.

---

## 4. Ejecución e Iteración (Modo Chat)
Esta es la funcionalidad core del sistema para pruebas interactivas.

### 4.1 Ejecutar Caso de Uso (Flujo Principal)
1. **Acción:** Frente a un componente tarjeta, accione vía ratón sobre **`⚡ Ejecutar`**.
2. **Respuesta:** Se levanta de súbito el modal principal, el cual ha sido curado visualmente de sobrepasos (efectos de fondo traslúcido rectificados). 
3. **Acción:** Digite sus variables en el recuadro "Input" y estipule al **"Modelo IA"** orquestador en su listboxes final. Percuta **"⚡ Ejecutar"**.
4. **Resultado:** El contenedor vital interpone una placa brumada (Efecto Blur o .processing-state interno) erradicando la capacidad de comisiones concurrentes. Entretanto, el log reportará la transaccionalidad TLS externa.

### 4.2 Iterar / Refinar (Chat Loop Autocentrado)
1. **Situación:** Reibida de manera síncrona la respuesta uno-a-uno del ente IA.
2. **Acción:** Emancipe su nueva directiva de corrección en la idéntica celda inferior de Input (ej: *"Reformular empleando modismos españoles"*). Comprobará visualmente en retrospectiva que su selector de IA ha sido engrisado (.disabled) protegiendo el Scope perimetral cruzado. Abata entonces la reescritura dictando clic sobre **"⚡ Iterar / Enviar"**.
3. **Respuesta:** La interfaz minifica programáticamente iteración vetusta aglomerando en un contenedor colapsable (`📜 Ver Ejecución anterior...`), y empuja la novedosa encomienda integrando subyacentemente al historial JSON puro en forma compacta y continua.

### 4.3 Magic Zero Setup (Vista Previa Web)
- **Detección:** Si el resultado de la IA contiene código HTML, el sistema detecta automáticamente un bloque ejecutable.
- **Acción:** El sistema inyecta un botón verde vibrante: **"👉 ABRIR APLICACIÓN GENERADA (index.html) 👈"**.
- **Resultado:** Al hacer clic, se abre su aplicación web funcional en una pestaña nueva del navegador.

---

## 5. Trabajo en Equipo y Colaboración

### 5.1 Asignaciones de Prompt
Para facilitar la división de responsabilidades, ahora la tarjeta permite etiquetar a un encargado visualmente:
1. **Acción:** Ubique, en la tarjeta, el icono circular `(+)` pegado a la pestaña de Estado.
2. **Respuesta:** Emergirá un pequeño Modal con la instrucción "Asignar a...".
3. **Acción:** Escriba el nombre en el campo de texto (o borre para desestimar) y de clic en "Guardar Asignación".
4. **Resultado:** De manera reactiva y con aviso en vivo, el indicador con el nombre se posará en la tarjerta.

### 5.2 Estados de Ciclo de Vida
Cada tarjeta ostenta una pastilla indicativa superior-derecha evaluando su etapa en la red:
- **Estados:** *En construcción, Refinamiento, Pruebas, Validado, Publicado.*
- **Cambio Ágil:** Es una etiqueta-botón. Haga un solo clic sobre el estatus actual para desplegar la lista de red. El sistema almacenará automáticamente su dictamen.

---

## 6. Explorador de Repositorio (GitHub)

Desde su ambiente web, el sistema le permite cotejar la raíz documental del proyecto técnico sin clonar repositorios:
1. **Ruta:** Pulse **"Repositorio"** desde la barra lateral izquierda `INICIO`.
2. **Acción:** Inspeccione todo el árbol de carpetas oficiales provenientes de `main` en panel izquierdo.
3. **Previsualización Inteligente:** Del lado derecho, la pantalla reproducirá al instante archivos `.md` de manera idéntica a manuales pulcros (fuentes, negritas). Los archivos en texto informático los proveerá con mono-espaciado, y las extensiones atípicas le obsequiarán, en defecto, el control primario de descarga completa.

---
*Fin del Manual de Usuario v1.1.0*
