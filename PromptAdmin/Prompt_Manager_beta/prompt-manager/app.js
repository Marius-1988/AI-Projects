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

// Array pre-cargado de Demos generados previamente en 3 rutas distintas (mismas que simulan 3 hostings diferentes)
const defaultDemos = [
    {
        id: "demo-progur-admin",
        name: "Prosegur Admin Panel",
        desc: "Panel de administración para la gestión de solicitudes y control de operaciones Vigil.",
        path: "/AI-Projects/PromptAdmin/Caso1-Alta_WEB/progur-admin/index.html",
        url: "https://github.com/Marius-1988/AI-Projects/tree/main/PromptAdmin/Caso1-Alta_WEB/progur-admin"
    },
    {
        id: "demo-farmacity",
        name: "Farmacity e-Commerce",
        desc: "Aplicación de comercio electrónico y pasarela de productos de farmacia.",
        path: "/AI-Projects/PromptAdmin/Caso1-Alta_WEB/farmacity-ecommerce/index.html",
        url: "https://github.com/Marius-1988/AI-Projects/tree/main/PromptAdmin/Caso1-Alta_WEB/farmacity-ecommerce"
    },
    {
        id: "demo-broker",
        name: "Broker Investments Rules",
        desc: "Plataforma de comparación y análisis algorítmico de productos financieros y fondos de inversión.",
        path: "/AI-Projects/PromptAdmin/Caso1-Alta_WEB/broker-investments-rules/index.html",
        url: "https://github.com/Marius-1988/AI-Projects/tree/main/PromptAdmin/Caso1-Alta_WEB/broker-investments-rules"
    }
];

// Se cargan los demos del LocalStorage, y si la lista está completamente vacía (por primera vez o borrada) carga los predeterminados.
let localDemos = JSON.parse(localStorage.getItem('prompt_manager_local_demos')) || defaultDemos;

const useCasesGrid = document.getElementById('use-cases-grid');
const emptyState = document.getElementById('empty-state');
const btnCreatePrompt = document.getElementById('btn-create-prompt');
const toast = document.getElementById('toast');
const debugLogs = document.getElementById('debug-logs');

// Demos DOM
const btnCreateDemo = document.getElementById('btn-create-demo');
const demosSection = document.getElementById('demos-section');
const demosGrid = document.getElementById('demos-grid');
const modalDemo = document.getElementById('modal-demo');
const formDemo = document.getElementById('form-demo');
const btnSaveDemo = document.getElementById('btn-save-demo');
const demoName = document.getElementById('demo-name');
const demoDesc = document.getElementById('demo-desc');
const demoPath = document.getElementById('demo-path');
const demoUrl = document.getElementById('demo-url');

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

// Modal Crear/Editar Contexto
const modalCreate = document.getElementById('modal-create');
const modalCreateTitle = document.getElementById('modal-create-title');
let editingUseCaseId = null;
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

const modelInfoBox = document.getElementById('model-info');
const modelVersionText = document.getElementById('model-version');
const modelDescText = document.getElementById('model-desc');

const btnEditRules = document.getElementById('btn-edit-rules');

// Inicialización: Cargar la base de datos de la nube
document.addEventListener('DOMContentLoaded', async () => {
    useCasesGrid.innerHTML = '<div class="empty-state">Conectando con la base de datos global... ⏳</div>';
    renderLocalDemos();
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
    editingUseCaseId = null;
    if (modalCreateTitle) modalCreateTitle.textContent = 'Nuevo Caso de Uso';
    openModal('modal-create');
});

btnSaveUseCase.addEventListener('click', async (e) => {
    e.preventDefault();
    if (formCreate.checkValidity()) {
        btnSaveUseCase.disabled = true;
        btnSaveUseCase.textContent = 'Guardando...';

        if (editingUseCaseId) {
            // Actualizar existente
            const ucIndex = useCases.findIndex(c => c.id === editingUseCaseId);
            if (ucIndex !== -1) {
                useCases[ucIndex].name = createName.value.trim();
                useCases[ucIndex].rules = createRules.value.trim();
                useCases[ucIndex].input = createInput.value.trim();
            }
            await saveCases();
            showToast('Caso de Uso actualizado exitosamente');
        } else {
            // Agregar nuevo y sincronizar
            const newCase = {
                id: Date.now().toString(),
                name: createName.value.trim(),
                rules: createRules.value.trim(),
                input: createInput.value.trim()
            };
            useCases.push(newCase);
            await saveCases();
            showToast('Caso de Uso global guardado exitosamente');
        }

        renderUseCases();
        closeModal('modal-create');

        btnSaveUseCase.disabled = false;
        btnSaveUseCase.textContent = 'Guardar';
        editingUseCaseId = null;
    } else {
        formCreate.reportValidity();
    }
});

// ---- Lógica Crear Proyecto Demo Local ----

btnCreateDemo.addEventListener('click', () => {
    formDemo.reset();
    openModal('modal-demo');
});

btnSaveDemo.addEventListener('click', (e) => {
    e.preventDefault();
    if (formDemo.checkValidity()) {
        const newDemo = {
            id: Date.now().toString(),
            name: demoName.value.trim(),
            desc: demoDesc.value.trim(),
            path: demoPath.value.trim(),
            url: demoUrl.value.trim()
        };

        // Guardado local
        localDemos.push(newDemo);
        localStorage.setItem('prompt_manager_local_demos', JSON.stringify(localDemos));

        renderLocalDemos();
        closeModal('modal-demo');
        showToast('Proyecto Demo guardado en tu dispositivo');
    } else {
        formDemo.reportValidity();
    }
});

// ---- Renderizar Grillas ----

function renderLocalDemos() {
    demosGrid.innerHTML = '';

    if (localDemos.length === 0) {
        demosSection.style.display = 'none';
    } else {
        demosSection.style.display = 'block';

        [...localDemos].reverse().forEach((demo) => {
            const card = document.createElement('div');
            card.className = 'usecase-card';

            card.innerHTML = `
                <div style="flex-grow: 1;">
                    <div style="font-size:0.75rem; color:#8b5cf6; margin-bottom:5px; font-weight:bold;">Proyecto Generado</div>
                    <h3 class="usecase-title">${demo.name}</h3>
                    ${demo.desc ? `<p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:10px;">${demo.desc}</p>` : ''}
                </div>
                <div style="margin-top:15px; display: flex; gap: 10px; align-items: center;">
                    <a href="${demo.path}" class="btn btn-primary" style="flex-grow: 1; font-size: 0.85rem; text-decoration: none; text-align:center;" title="Abrir Demo">🔗 Ver App</a>
                    <a href="${demo.url}" target="_blank" class="btn btn-outline" style="border-color: #64748b; color: #64748b; font-size: 0.85rem; text-decoration: none; text-align:center;" title="Ver en GitHub">GitHub</a>
                    <button class="btn btn-outline" style="border-color: #f59e0b; color: #f59e0b; padding: 10px;" onclick="deleteLocalDemo('${demo.id}', event)" title="Ocultar de mi PC">🗑️</button>
                </div>
            `;
            demosGrid.appendChild(card);
        });
    }
}

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
                    <button class="btn btn-outline" style="border-color: #10b981; color: #10b981; padding: 10px;" onclick="copyUseCase('${uc.id}', event)" title="Copiar Prompt">📋</button>
                    <button class="btn btn-outline" style="border-color: #ef4444; color: #ef4444; padding: 10px;" onclick="deleteUseCase('${uc.id}', event)" title="Eliminar Caso">🗑️</button>
                </div>
            `;
            useCasesGrid.appendChild(card);
        });
    }
}

window.editUseCase = (id, event) => {
    if (event) event.stopPropagation();
    const uc = useCases.find(c => c.id === id);
    if (!uc) return;

    editingUseCaseId = id;
    if (modalCreateTitle) modalCreateTitle.textContent = 'Editar Caso de Uso';

    createName.value = uc.name;
    createRules.value = uc.rules;
    createInput.value = uc.input || '';

    openModal('modal-create');
};

if (btnEditRules) {
    btnEditRules.addEventListener('click', (e) => {
        if (currentExecutingCase) {
            closeModal('modal-execute');
            window.editUseCase(currentExecutingCase.id, e);
        }
    });
}

window.copyUseCase = (id, event) => {
    event.stopPropagation(); // Evita abrir el modal principal
    const uc = useCases.find(c => c.id === id);
    if (!uc) return;

    let textToCopy = uc.rules;
    // Concatena solo si existe el input de forma segura
    if (uc.input && uc.input.trim() !== '') {
        textToCopy = `[REGLAS GENERALES]\n${uc.rules}\n\n[INPUT]\n${uc.input}`;
    }

    navigator.clipboard.writeText(textToCopy).then(() => {
        showToast('Prompt copiado al portapapeles');
    }).catch(err => {
        console.error('Error al copiar al portapapeles:', err);
        showToast('Error al copiar al portapapeles');
    });
};

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

window.deleteLocalDemo = (id, event) => {
    event.stopPropagation();
    if (confirm('¿Deseas ELIMINAR este enlace directamente de tu historial local?')) {
        localDemos = localDemos.filter(d => d.id !== id);
        localStorage.setItem('prompt_manager_local_demos', JSON.stringify(localDemos));
        renderLocalDemos();
        showToast('Enlace de Proyecto eliminado.');
    }
};

// ---- Lógica Ejecutar Caso de Uso ----

window.openExecuteModal = (id) => {
    const uc = useCases.find(c => c.id === id);
    if (!uc) return;

    currentExecutingCase = uc;

    execTitle.textContent = `Ejecutar: ${uc.name}`;
    execRules.value = uc.rules;
    execInput.value = uc.input || '';
    execModel.value = ''; // Reset modelo
    modelInfoBox.style.display = 'none';

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

    logToConsole(`> Inicializando conexión con: API de ${selectedModel}`, 'info');

    // Función asíncrona pura simulando un POST a un backend/API
    async function simulateAIApiCall(model, promtoData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let responseText = "";
                let tokens = Math.floor(Math.random() * 500) + 200;

                if (model === "Gemini") {
                    responseText = `[Respuesta de Gemini 1.5 Pro]\nHe procesado los ${tokens} tokens de tu prompt estructurado.\n\nResultado analítico: Todo está bajo control. La ventana de contexto expansiva permite captar el más mínimo detalle de tus reglas.`;
                } else if (model === "Cursor") {
                    responseText = `[Respuesta de Cursor (Claude 3.5 Sonnet)]\n<thought>\nAnalizando contexto de código...\n</thought>\nHe revisado tus instrucciones y variables. Adjunto las dependencias sugeridas y el refactor listo para ser integrado en el archivo principal.`;
                } else if (model === "MS Copilot") {
                    responseText = `[Respuesta de Microsoft Copilot (GPT-4o)]\n¡Hola! He generado el documento solicitado alineado con tus convenciones empresariales, optimizando la estructura para Microsoft 365.`;
                } else {
                    reject(new Error("Modelo desconocido"));
                    return;
                }

                resolve({
                    status: 200,
                    data: responseText,
                    tokens: tokens
                });
            }, 3000); // 3 segundos de latencia artificial de API
        });
    }

    const loadNode = logToConsole(`> Estableciendo Handshake TLS y enviando payload...`, 'loading');

    // Ejecuta la llamada a la pseudo-API
    simulateAIApiCall(selectedModel, finalPrompt)
        .then(response => {
            loadNode.classList.remove('loading');
            logToConsole(`> ✅ [HTTP ${response.status} OK] Conexión cerrada.`, 'success');
            logToConsole(`> 📊 Telemetría: Procesados ${response.tokens} tokens`, 'info');
            logToConsole(`--------------- RESULTADO DE LA API ---------------`, 'normal');

            // Imprimir la respuesta en líneas para mejorar legibilidad
            const lines = response.data.split('\\n');
            lines.forEach(l => logToConsole(l, 'text-muted'));

            logToConsole(`---------------------------------------------------`, 'normal');
        })
        .catch(error => {
            loadNode.classList.remove('loading');
            logToConsole(`> ❌ API Fetch Failed: ${error.message}`, 'error');
        })
        .finally(() => {
            btnRunPrompt.disabled = false;
        });
});

// Detalles de Modelos
const modelDetails = {
    'Gemini': {
        version: 'Gemini 1.5 Pro y 1.5 Flash',
        desc: 'La versión 1.5 Pro destaca por su ventana de contexto de hasta 2 millones de tokens.'
    },
    'Cursor': {
        version: 'v0.45.x',
        desc: 'El editor de código suele actualizarse cada pocos días; actualmente utiliza Claude 3.5 Sonnet como modelo por defecto.'
    },
    'MS Copilot': {
        version: 'GPT-4o',
        desc: 'Integrado en Windows y Microsoft 365, utiliza la infraestructura más reciente de OpenAI.'
    }
};

execModel.addEventListener('change', (e) => {
    const selected = e.target.value;
    if (modelDetails[selected]) {
        modelVersionText.textContent = modelDetails[selected].version;
        modelDescText.textContent = modelDetails[selected].desc;
        modelInfoBox.style.display = 'block';
    } else {
        modelInfoBox.style.display = 'none';
    }
});

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
