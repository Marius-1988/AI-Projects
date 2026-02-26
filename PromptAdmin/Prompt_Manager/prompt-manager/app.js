import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Configuración de Firebase enviada por el usuario
const firebaseConfig = {
    apiKey: "AIzaSyCB0bsybB4lvi_1SHXKBcZWnOBunY-zQN4",
    authDomain: "mariusiaproject.firebaseapp.com",
    projectId: "mariusiaproject",
    storageBucket: "mariusiaproject.firebasestorage.app",
    messagingSenderId: "557250572678",
    appId: "1:557250572678:web:44c6d371fa8c727d5b3c07",
    measurementId: "G-RVM1BFD4DN"
};

// Inicializar Firebase y Base de datos
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Referencia a nuestro único documento donde guardaremos todos los casos (Colección: "appData", Documento: "useCasesDoc")
const docRef = doc(db, "appData", "useCasesDoc");

// Variables globales
let useCases = [];
let currentExecutingCase = null;

// Elementos DOM Principales
const useCasesGrid = document.getElementById('use-cases-grid');
const emptyState = document.getElementById('empty-state');
const btnCreatePrompt = document.getElementById('btn-create-prompt');
const toast = document.getElementById('toast');
const debugLogs = document.getElementById('debug-logs');

// Función Global de Debug
function addLog(message, isError = false) {
    if (!debugLogs) return;
    const time = new Date().toLocaleTimeString();
    const line = document.createElement('div');
    line.className = `log-entry ${isError ? 'log-error' : 'log-success'}`;
    line.innerHTML = `<strong>[${time}]</strong> ${message}`;
    debugLogs.appendChild(line);
    debugLogs.scrollTop = debugLogs.scrollHeight;
}

// Modal Crear Contexto
const modalCreate = document.getElementById('modal-create');
const formCreate = document.getElementById('form-create');
const btnSaveUseCase = document.getElementById('btn-save-usecase');
const createName = document.getElementById('create-name');
const createRules = document.getElementById('create-rules');
const createInput = document.getElementById('create-input');

// Modal Ejecución Contexto
const modalExecute = document.getElementById('modal-execute');
const execTitle = document.getElementById('exec-title');
const execRules = document.getElementById('exec-rules');
const execInput = document.getElementById('exec-input');
const execModel = document.getElementById('exec-model');
const btnRunPrompt = document.getElementById('btn-run-prompt');
const consoleOutput = document.getElementById('console-output');

const errorInput = document.getElementById('error-input');
const errorModel = document.getElementById('error-model');

// Inicialización: Cargar la base de datos de la nube
document.addEventListener('DOMContentLoaded', async () => {
    useCasesGrid.innerHTML = '<div class="empty-state">Conectando con la base de datos global... ⏳</div>';
    await fetchCases();
    renderUseCases();
});

// Obtener los casos desde Firebase Firestore
async function fetchCases() {
    try {
        addLog("Conectando y descargando desde Firebase Firestore...");

        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            if (data && Array.isArray(data.useCases)) {
                useCases = data.useCases;
                addLog(`FETCH Firebase Exitoso: ${useCases.length} casos encontrados.`);
            } else {
                useCases = [];
                addLog("Atención: El documento existe pero no tiene el formato correcto.");
            }
        } else {
            addLog("El documento aún no existe en Firebase. Empezaremos desde cero.", true);
            useCases = [];
        }
    } catch (error) {
        addLog(`Error Crítico de Firebase (Fetch): ${error.message}`, true);
        console.error("Firebase Error:", error);
        useCases = [];
        showToast("Error al conectar con la base de datos.");
    }
}

// Guardar los casos en Firebase Firestore
async function saveCases() {
    try {
        addLog(`Subiendo actualización a Firebase (${useCases.length} items)...`);

        // setDoc sobreescribe el documento entero o lo crea si no existía
        await setDoc(docRef, { useCases: useCases });

        addLog(`GUARDADO en Firebase Exitoso.`);
    } catch (error) {
        addLog(`Error Crítico de Firebase (Save): ${error.message}`, true);
        console.error("Firebase Error:", error);
        showToast("Error al sincronizar con la nube.");
    }
}

// ---- Lógica Crear Caso de Uso ----

btnCreatePrompt.addEventListener('click', () => {
    formCreate.reset();
    openModal('modal-create');
});

btnSaveUseCase.addEventListener('click', async (e) => {
    e.preventDefault();
    if (formCreate.checkValidity()) {
        const newCase = {
            id: Date.now().toString(),
            name: createName.value.trim(),
            rules: createRules.value.trim(),
            input: createInput.value.trim()
        };

        btnSaveUseCase.disabled = true;
        btnSaveUseCase.textContent = 'Guardando...';

        // Agregar y sincronizar
        useCases.push(newCase);
        await saveCases();

        renderUseCases();
        closeModal('modal-create');
        showToast('Caso de Uso global guardado exitosamente');

        btnSaveUseCase.disabled = false;
        btnSaveUseCase.textContent = 'Guardar';
    } else {
        formCreate.reportValidity();
    }
});

// ---- Renderizar Grilla ----

function renderUseCases() {
    // Limpiar grilla exceptuando el empty state
    useCasesGrid.innerHTML = '';

    if (useCases.length === 0) {
        useCasesGrid.appendChild(emptyState);
        emptyState.style.display = 'block';
        emptyState.textContent = 'No tienes casos de uso creados todavía. La base global está vacía.';
    } else {
        emptyState.style.display = 'none';

        // Ordenar casos: del más reciente al más antiguo
        [...useCases].reverse().forEach((uc) => {
            const card = document.createElement('div');
            card.className = 'usecase-card';

            card.innerHTML = `
                <div onclick="openExecuteModal('${uc.id}')" style="flex-grow: 1; cursor: pointer;">
                    <h3 class="usecase-title">${uc.name}</h3>
                    <p class="usecase-desc">${uc.rules}</p>
                </div>
                <div style="margin-top:15px; display: flex; gap: 10px; align-items: center;">
                    <button class="btn btn-primary" style="flex-grow: 1; font-size: 0.85rem;" onclick="openExecuteModal('${uc.id}')">⚡ Ejecutar</button>
                    <button class="btn btn-outline" style="border-color: #ef4444; color: #ef4444; padding: 10px;" onclick="deleteUseCase('${uc.id}', event)" title="Eliminar Caso">🗑️</button>
                </div>
            `;
            useCasesGrid.appendChild(card);
        });
    }
}

// Acción de eliminar caso
window.deleteUseCase = async (id, event) => {
    event.stopPropagation(); // Evita abrir el modal
    if (confirm('¿Estás seguro/a que deseas ELIMINAR este Caso de Uso global de forma PERMANENTE?')) {
        const btn = event.currentTarget;
        btn.textContent = '⏳';
        btn.disabled = true;

        useCases = useCases.filter(uc => uc.id !== id);
        await saveCases();
        renderUseCases();
        showToast('Caso de Uso eliminado de la base de datos.');
    }
};

// ---- Lógica Ejecutar Caso de Uso ----

function openExecuteModal(id) {
    const uc = useCases.find(c => c.id === id);
    if (!uc) return;

    currentExecutingCase = uc;

    execTitle.textContent = `Ejecutar: ${uc.name}`;
    execRules.value = uc.rules;
    execInput.value = uc.input || '';
    execModel.value = ''; // Reset modelo

    errorInput.classList.add('hidden');
    errorModel.classList.add('hidden');
    btnRunPrompt.disabled = false;

    resetConsole();
    openModal('modal-execute');
}

function resetConsole() {
    consoleOutput.innerHTML = '<div class="console-line text-muted">A la espera de ejecución...</div>';
}

function logToConsole(message, type = 'normal') {
    const line = document.createElement('div');
    line.className = 'console-line';

    if (type === 'loading') line.classList.add('loading', 'text-info');
    else if (type === 'success') line.classList.add('text-success');
    else if (type === 'error') line.classList.add('text-danger');

    line.textContent = message;
    consoleOutput.appendChild(line);

    // Auto-scroll
    setTimeout(() => {
        consoleOutput.parentElement.scrollTop = consoleOutput.parentElement.scrollHeight;
    }, 50);

    return line; // Devuelve el nodo parar poder editarlo luego si requiere detener el "loading"
}

btnRunPrompt.addEventListener('click', () => {
    // Validaciones
    let isValid = true;
    errorInput.classList.add('hidden');
    errorModel.classList.add('hidden');

    if (!execInput.value.trim()) {
        errorInput.classList.remove('hidden');
        isValid = false;
    }
    if (!execModel.value) {
        errorModel.classList.remove('hidden');
        isValid = false;
    }

    if (!isValid) return;

    btnRunPrompt.disabled = true;
    resetConsole();

    const selectedModel = execModel.value;
    const rules = currentExecutingCase.rules;
    const userInput = execInput.value;

    // Crear el prompt final unificado
    const finalPrompt = `[REGLAS GENERALES]\n${rules}\n\n[INPUT]\n${userInput}`;

    logToConsole(`> Inicializando conexión con: ${selectedModel}`, 'info');

    setTimeout(() => {
        // Simulación de verificación de estado y loggeo
        const isLogged = Math.random() > 0.3; // 70% de chances de estar logueado

        if (!isLogged && (selectedModel === 'Cursor' || selectedModel === 'Antigravity')) {
            logToConsole(`> ❌ Error de Autenticación: No se detecta una sesión iniciada en ${selectedModel}.`, 'error');
            logToConsole(`> 👉 ACCIÓN REQUERIDA: Inicia sesión en la aplicación y presiona 'Ejecutar' nuevamente.`, 'normal');
            btnRunPrompt.disabled = false;
            return;
        }

        logToConsole(`> Autenticando... OK`, 'success');
        const loadNode = logToConsole(`> Procesando envío del Prompt...`, 'loading');

        // Copiar el prompt al portapapeles usando la API del navegador
        navigator.clipboard.writeText(finalPrompt).then(() => {
            setTimeout(() => {
                loadNode.classList.remove('loading');
                logToConsole(`> ✅ Prompt copiado al portapapeles del sistema exitosamente.`, 'success');

                // Redirecciones y apertura de aplicativos
                if (selectedModel === 'MS Copilot') {
                    logToConsole(`> 🌐 Abriendo Microsoft Copilot en una nueva pestaña...`, 'info');
                    logToConsole(`> 📌 Instrucción: El navegador intentará pre-cargar tu prompt. Si por seguridad Copilot lo bloquea, el prompt ya está copiado. Sólo presiona Ctrl+V para pegar.`, 'normal');

                    setTimeout(() => {
                        // Intentamos pasar el prompt por parámetro URL
                        const copilotUrl = `https://copilot.microsoft.com/?q=${encodeURIComponent(finalPrompt)}`;
                        window.open(copilotUrl, '_blank');
                    }, 1500);
                }
                else if (selectedModel === 'Cursor') {
                    logToConsole(`> 💻 Conectando con Cursor IDE...`, 'info');
                    logToConsole(`> 📌 Instrucción: Abre el panel de IA de Cursor (Ctrl+L o Cmd+L) y presiona Ctrl+V para pegar y ejecutar.`, 'normal');

                    // Intento de abrir la app mediante protocolo (funciona si la PC tiene registrado vscode:// o custom protocol)
                    setTimeout(() => {
                        // Fallback visual al ser una app web
                        showToast('Abre Cursor IDE y pega el prompt copiado');
                    }, 1500);
                }
                else if (selectedModel === 'Antigravity') {
                    logToConsole(`> 🚀 Conectando con el Agente Antigravity...`, 'info');
                    logToConsole(`> 📌 Instrucción: El prompt está copiado. Pégalo directamente (Ctrl+V) en esta misma ventana de nuestro chat para que yo lo ejecute!`, 'normal');
                }

                logToConsole(`--------------- PROMPT ARMADO ---------------`, 'normal');
                logToConsole(`${finalPrompt.substring(0, 80)}... [Revisar Portapapeles]`, 'text-muted');

                btnRunPrompt.disabled = false;
            }, 1000);
        }).catch(err => {
            loadNode.classList.remove('loading');
            logToConsole(`> ❌ Error: No se pudo copiar al portapapeles. Da permisos al navegador.`, 'error');
            btnRunPrompt.disabled = false;
        });

    }, 1200);
});

// Simulación de Respuestas basada en el prompt y modelo
function mockAIResponse(model, rules, input) {
    const responses = [
        "Entiendo el contexto y las reglas provistas. Aquí tienes el resultado basado en tu input...",
        "He estructurado la información siguiendo exactamente los parámetros solicitados.",
        "A continuación expongo la solución a tu requerimiento, respetando el formato indicado.",
        "Como Agente experto he procesado tu solicitud. Los archivos relevantes han sido marcados para actualización."
    ];
    const baseResponse = responses[Math.floor(Math.random() * responses.length)];
    const finalMessage = `${baseResponse} \n\n[Respuesta simulada generada por la API Dummy de ${model}] \n\n Input procesado: "${input.substring(0, 50)}..."`;

    logToConsole(finalMessage, 'success');
}

// ---- Utilidades Generales ----

window.openModal = (id) => {
    document.getElementById(id).classList.remove('hidden');
}

window.closeModal = (id) => {
    document.getElementById(id).classList.add('hidden');
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}
