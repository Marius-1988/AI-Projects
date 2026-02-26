const state = {
    isAuthenticated: false,
    user: null,
    currentView: 'dashboard', // dashboard, construction
    currentFilter: 'Todos',
};

// Mock Data
const entities = [
    { id: 1, name: 'Mercado Pago', type: 'Fintech', assets: {
        'FCI': { tna: '90.5%', ter: '1.5%', tim: '2.4%', cer: 'No' },
        'Crypto': { tna: '-', ter: '2%', tim: '-', cer: 'No' }
    }},
    { id: 2, name: 'Ualá', type: 'Fintech', assets: {
        'FCI': { tna: '88.0%', ter: '1.2%', tim: '2.1%', cer: 'No' },
        'Dólar MEP': { tna: '-', ter: '1%', tim: '-', cer: 'No' }
    }},
    { id: 3, name: 'Naranja X', type: 'Fintech', assets: {
        'Remunerada': { tna: '100%', ter: '0%', tim: '3.1%', cer: 'No' },
    }},
    { id: 4, name: 'Personal Pay', type: 'Fintech', assets: {
        'FCI': { tna: '94.2%', ter: '1.5%', tim: '2.5%', cer: 'No' },
    }},
    { id: 5, name: 'Banco Galicia', type: 'Banco', assets: {
        'Plazo Fijo': { tna: '110%', ter: '0%', tim: '3.5%', cer: 'No' },
        'FCI': { tna: '85%', ter: '2.1%', tim: '2.0%', cer: 'No' },
        'Dólar MEP': { tna: '-', ter: '1.5%', tim: '-', cer: 'No' }
    }},
    { id: 6, name: 'Santander', type: 'Banco', assets: {
        'Plazo Fijo': { tna: '110%', ter: '0%', tim: '3.5%', cer: 'No' },
        'FCI': { tna: '83%', ter: '2.5%', tim: '1.9%', cer: 'No' }
    }},
    { id: 7, name: 'BBVA', type: 'Banco', assets: {
        'Plazo Fijo': { tna: '110%', ter: '0%', tim: '3.5%', cer: 'No' },
        'FCI': { tna: '86%', ter: '1.8%', tim: '2.1%', cer: 'No' },
        'Acciones': { tna: 'VAR', ter: '1.2%', tim: '-', cer: 'No' }
    }},
    { id: 8, name: 'Balanz', type: 'Broker', assets: {
        'Cauciones': { tna: '98%', ter: '0.5%', tim: '3.0%', cer: 'No' },
        'FCI': { tna: '95%', ter: '1.0%', tim: '2.6%', cer: 'No' },
        'Dólar MEP': { tna: '-', ter: '0.5%', tim: '-', cer: 'No' },
        'Renta Fija': { tna: '150%', ter: '0.8%', tim: '4.5%', cer: 'Sí' },
        'Acciones': { tna: 'VAR', ter: '0.8%', tim: '-', cer: 'No' }
    }},
    { id: 9, name: 'Bull Market', type: 'Broker', assets: {
        'Cauciones': { tna: '97.5%', ter: '0.5%', tim: '2.9%', cer: 'No' },
        'FCI': { tna: '92%', ter: '1.1%', tim: '2.5%', cer: 'No' },
        'Dólar Cable': { tna: '-', ter: '0.8%', tim: '-', cer: 'No' },
        'Renta Fija': { tna: '145%', ter: '0.7%', tim: '4.2%', cer: 'Sí' }
    }},
    { id: 10, name: 'InvertirOnline (IOL)', type: 'Broker', assets: {
        'Cauciones': { tna: '99%', ter: '0.6%', tim: '3.1%', cer: 'No' },
        'FCI': { tna: '93%', ter: '0.9%', tim: '2.5%', cer: 'No' },
        'Dólar MEP': { tna: '-', ter: '0.4%', tim: '-', cer: 'No' },
        'Acciones': { tna: 'VAR', ter: '0.5%', tim: '-', cer: 'No' }
    }},
    { id: 11, name: 'Cocos Capital', type: 'Broker', assets: {
        'Cauciones': { tna: '96%', ter: '0%', tim: '2.8%', cer: 'No' },
        'FCI': { tna: '91%', ter: '0%', tim: '2.4%', cer: 'No' },
        'Dólar MEP': { tna: '-', ter: '0%', tim: '-', cer: 'No' },
        'Acciones': { tna: 'VAR', ter: '0%', tim: '-', cer: 'No' },
        'Dólar Cable': { tna: '-', ter: '0%', tim: '-', cer: 'No' }
    }}
];

const assetTypes = ['Todos', 'FCI', 'Plazo Fijo', 'Cauciones', 'Dólar MEP', 'Acciones', 'Renta Fija', 'Crypto', 'Dólar Cable', 'Remunerada'];

// Main App Controller
function render() {
    const app = document.getElementById('app');
    
    if (!state.isAuthenticated) {
        app.innerHTML = renderAuth();
        bindAuthEvents();
    } else {
        app.innerHTML = renderAppLayout();
        bindDashboardEvents();
    }
}

// Auth Components
function renderAuth() {
    return `
        <div class="auth-container">
            <div class="auth-box">
                <div class="brand auth-title">Broker Rules</div>
                <div class="auth-subtitle">Encuentra la mejor inversión al instante</div>
                
                <form id="loginForm">
                    <div class="input-group">
                        <label>Correo Electrónico</label>
                        <input type="email" id="email" value="demo@brokerrules.com" required>
                    </div>
                    <div class="input-group">
                        <label>Contraseña</label>
                        <input type="password" id="password" value="password123" required>
                    </div>
                    <div id="authError" class="error-msg">Credenciales incorrectas</div>
                    <button type="submit" class="btn-primary" style="margin-top: 1rem;">Ingresar a la plataforma</button>
                    
                    <div class="switch-auth">
                        ¿No tienes cuenta? <a href="#" id="toSignup">Regístrate</a>
                    </div>
                </form>
            </div>
        </div>
    `;
}

function bindAuthEvents() {
    const form = document.getElementById('loginForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const pass = document.getElementById('password').value;
        
        // Mock Login
        if (email && pass) {
            state.isAuthenticated = true;
            state.user = { name: email.split('@')[0], email };
            render();
        } else {
            document.getElementById('authError').style.display = 'block';
        }
    });
}

// Dashboard Components
function renderAppLayout() {
    return `
        <div class="dashboard">
            <div class="sidebar">
                <div class="brand">Broker Rules</div>
                <div class="nav-item active" data-view="dashboard">
                    📊 Comparador de Tasas
                </div>
                <div class="nav-item" data-view="construction">
                    💼 Mi Portfolio
                </div>
                <div class="nav-item" data-view="construction">
                    🔔 Alertas Mercado
                </div>
                <div class="nav-item" data-view="construction">
                    ⚙️ Configuración
                </div>
                <div style="margin-top: auto;">
                    <button class="btn-outline" style="width: 100%;" id="logoutBtn">Cerrar Sesión</button>
                </div>
            </div>
            
            <div class="main-content">
                <div class="header">
                    <div>
                        <h1 style="font-size: 2rem; margin-bottom: 0.5rem; font-weight:800;">Hola, ${state.user.name}</h1>
                        <p style="color: var(--text-secondary);">Compara y decide tu próxima inversión hoy.</p>
                    </div>
                    <div class="user-profile">
                        <div class="avatar">${state.user.name.charAt(0).toUpperCase()}</div>
                    </div>
                </div>
                
                ${state.currentView === 'dashboard' ? renderDashboardContent() : renderConstruction()}
            </div>
        </div>
        
        <div class="modal-overlay" id="modalOverlay">
            <div class="modal" id="modalContent"></div>
        </div>
    `;
}

function renderConstruction() {
    return `
        <div class="glass-panel" style="text-align: center; padding: 5rem 2rem;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">🚧</div>
            <h2 style="font-size: 2rem; margin-bottom: 1rem; color: var(--accent-1);">Sección en Construcción</h2>
            <p style="color: var(--text-secondary);">Esta funcionalidad está siendo desarrollada para la próxima versión.</p>
        </div>
    `;
}

function renderDashboardContent() {
    let html = `
        <div class="glass-panel">
            <h3 style="margin-bottom: 1rem;">Filtros por Activo</h3>
            <div class="filters">
    `;
    
    assetTypes.forEach(type => {
        const active = state.currentFilter === type ? 'active' : '';
        html += `<button class="filter-btn ${active}" data-filter="${type}">${type}</button>`;
    });
    
    html += `
            </div>
        </div>
        
        <div class="glass-panel">
            <h3 style="margin-bottom: 1rem; color: var(--accent-2);">Tasas en Tiempo Real</h3>
            <div style="overflow-x: auto;">
            <table>
                <thead>
                    <tr>
                        <th>Entidad</th>
                        <th>Tipo</th>
                        <th>Activo Disponible</th>
                        <th>Tasa Nominal Anual (TNA)</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
    `;

    entities.forEach(ent => {
        Object.keys(ent.assets).forEach(assetName => {
            if (state.currentFilter === 'Todos' || state.currentFilter === assetName) {
                const data = ent.assets[assetName];
                const typeColor = ent.type === 'Fintech' ? 'var(--accent-green)' : ent.type === 'Banco' ? 'var(--accent-1)' : 'var(--accent-2)';
                
                html += `
                    <tr>
                        <td>
                            <div class="entity-name">
                                <div class="entity-icon" style="color: ${typeColor}">${ent.name.charAt(0)}</div>
                                <span>${ent.name}</span>
                            </div>
                        </td>
                        <td><span style="color: ${typeColor}; font-size: 0.8rem; border: 1px solid ${typeColor}; padding: 0.2rem 0.6rem; border-radius: 20px;">${ent.type}</span></td>
                        <td style="font-weight: 600;">${assetName}</td>
                        <td class="${data.tna.includes('-') || data.tna.includes('VAR') ? '' : 'rate-up'}">${data.tna}</td>
                        <td>
                            <button class="btn-outline view-details" data-entity="${ent.id}" data-asset="${assetName}">Ver Detalles</button>
                        </td>
                    </tr>
                `;
            }
        });
    });

    html += `
                </tbody>
            </table>
            </div>
        </div>
    `;
    
    return html;
}

function bindDashboardEvents() {
    // Nav routing
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            // Remove active classes
            document.querySelectorAll('.nav-item').forEach(nav => {
                nav.style.background = 'transparent';
                nav.style.color = 'var(--text-secondary)';
                nav.style.borderLeft = 'none';
            });
            
            // Set active
            e.currentTarget.style.background = 'rgba(0, 240, 255, 0.1)';
            e.currentTarget.style.color = 'var(--accent-1)';
            e.currentTarget.style.borderLeft = '3px solid var(--accent-1)';
            
            state.currentView = e.currentTarget.getAttribute('data-view');
            
            // Re-render main content portion without full re-render
            document.querySelector('.main-content').innerHTML = `
                <div class="header">
                    <div>
                        <h1 style="font-size: 2rem; margin-bottom: 0.5rem; font-weight:800;">Hola, ${state.user.name}</h1>
                        <p style="color: var(--text-secondary);">Compara y decide tu próxima inversión hoy.</p>
                    </div>
                    <div class="user-profile">
                        <div class="avatar">${state.user.name.charAt(0).toUpperCase()}</div>
                    </div>
                </div>
                ${state.currentView === 'dashboard' ? renderDashboardContent() : renderConstruction()}
            `;
            
            if (state.currentView === 'dashboard') bindDashboardSpecificEvents();
        });
    });
    
    document.getElementById('logoutBtn').addEventListener('click', () => {
        state.isAuthenticated = false;
        state.user = null;
        render();
    });
    
    if (state.currentView === 'dashboard') bindDashboardSpecificEvents();
}

function bindDashboardSpecificEvents() {
    // Filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            state.currentFilter = e.currentTarget.getAttribute('data-filter');
            // Quick re-render of just dashboard to keep state
            render(); 
        });
    });

    // Details Modal
    document.querySelectorAll('.view-details').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const entityId = parseInt(e.currentTarget.getAttribute('data-entity'));
            const assetName = e.currentTarget.getAttribute('data-asset');
            
            const entity = entities.find(x => x.id === entityId);
            const data = entity.assets[assetName];
            
            showModal(entity.name, assetName, data);
        });
    });
    
    // Close modal on click outside
    document.getElementById('modalOverlay').addEventListener('click', (e) => {
        if (e.target.id === 'modalOverlay') {
            closeModal();
        }
    });
}

function showModal(entityName, assetName, data) {
    const overlay = document.getElementById('modalOverlay');
    const content = document.getElementById('modalContent');
    
    content.innerHTML = `
        <div class="modal-header">
            <div>
                <h2 style="font-size: 1.8rem; background: linear-gradient(135deg, var(--accent-1), var(--accent-2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${entityName}</h2>
                <div style="color: var(--text-secondary); margin-top: 5px;">Detalles para: <strong style="color: #fff;">${assetName}</strong></div>
            </div>
            <button class="close-btn" onclick="closeModal()">×</button>
        </div>
        
        <div class="details-grid">
            <div class="detail-card">
                <div class="detail-label">Tasa Nominal Anual (TNA)</div>
                <div class="detail-value rate-up">${data.tna}</div>
            </div>
            <div class="detail-card">
                <div class="detail-label">Tasa Efectiva Anual (TEA/TER)</div>
                <div class="detail-value" style="color: var(--accent-2)">${data.ter}</div>
            </div>
            <div class="detail-card">
                <div class="detail-label">Tasa de Interés Mensual (TIM)</div>
                <div class="detail-value" style="color: #fff;">${data.tim}</div>
            </div>
            <div class="detail-card">
                <div class="detail-label">Ajuste por CER</div>
                <div class="detail-value" style="color: ${data.cer === 'Sí' ? 'var(--accent-green)' : 'var(--text-secondary)'}">${data.cer}</div>
            </div>
        </div>
        
        <div style="margin-top: 2rem;">
            <button class="btn-primary" onclick="alert('Funcionalidad de inversión directa en construcción')">Invertir Ahora</button>
        </div>
    `;
    
    overlay.classList.add('active');
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
}

// Init
render();
