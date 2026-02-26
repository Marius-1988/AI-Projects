// Login Form Handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const pass = document.getElementById('password').value;
        
        if (username && pass) {
            // Mock authentication
            window.location.href = 'dashboard.html';
        }
    });
}

// Dashboard Form Handlers
function handleFormSubmit(event, successMessage) {
    event.preventDefault(); // Prevent page reload
    
    // Simulate API call and loading time
    const btn = event.target.querySelector('button');
    const originalText = btn.innerText;
    btn.innerText = 'Guardando...';
    btn.disabled = true;

    setTimeout(() => {
        btn.innerText = originalText;
        btn.disabled = false;
        event.target.reset(); // Clear the form
        showToast(successMessage);
    }, 800);
}

// Toast Notification
function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    
    toast.innerText = message;
    toast.className = "toast show";
    
    // After 3 seconds, hide the toast
    setTimeout(function(){ 
        toast.className = toast.className.replace("toast show", "toast"); 
    }, 3000);
}

// Navigation Highlights (Mock)
const navLinks = document.querySelectorAll('.sidebar-nav ul li a');
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        if(this.id !== 'logoutBtn') {
            e.preventDefault();
            navLinks.forEach(l => l.parentElement.classList.remove('active'));
            this.parentElement.classList.add('active');
            
            // Just for the demo, show "En construcción" for other tabs
            if(this.id !== 'nav-actions') {
                document.getElementById('content-area').innerHTML = `
                    <div style="text-align: center; width: 100%; padding: 50px;">
                        <h2 style="color: #666;">Sección en Construcción</h2>
                        <p style="margin-top: 10px; color: #999;">Esta funcionalidad estará disponible en futuras versiones de la demo.</p>
                    </div>
                `;
            } else {
                location.reload(); // Quick way to reset the demo page
            }
        }
    });
});
