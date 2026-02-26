// Variables Globales
let useCases = JSON.parse(localStorage.getItem('prompt_usecases')) || [];
let currentExecutingCase = null;

// Elementos DOM Principales
const useCasesGrid = document.getElementById('use-cases-grid');
const emptyState = document.getElementById('empty-state');
const btnCreatePrompt = document.getElementById('btn-create-prompt');
const toast = document.getElementById('toast');

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

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    renderUseCases();
});

// Guardar los casos en LocalStorage
function saveCases() {
    localStorage.setItem('prompt_usecases', JSON.stringify(useCases));
}

// ---- Lógica Crear Caso de Uso ----

btnCreatePrompt.addEventListener('click', () => {
    formCreate.reset();
    openModal('modal-create');
});

btnSaveUseCase.addEventListener('click', (e) => {
    e.preventDefault();
    if (formCreate.checkValidity()) {
        const newCase = {
            id: Date.now().toString(),
            name: createName.value.trim(),
            rules: createRules.value.trim(),
            input: createInput.value.trim()
        };
        useCases.push(newCase);
        saveCases();
        renderUseCases();
        closeModal('modal-create');
        showToast('Caso de Uso guardado exitosamente');
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
    } else {
        emptyState.style.display = 'none';

        useCases.forEach((uc) => {
            const card = document.createElement('div');
            card.className = 'usecase-card';
            card.onclick = () => openExecuteModal(uc.id);

            card.innerHTML = `
                <div>
                    <h3 class="usecase-title">${uc.name}</h3>
                    <p class="usecase-desc">${uc.rules}</p>
                </div>
                <div style="margin-top:15px">
                    <button class="btn btn-outline" style="width:100%; font-size: 0.8rem;">⚙️ Configurar y Ejecutar</button>
                </div>
            `;
            useCasesGrid.appendChild(card);
        });
    }
}

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
