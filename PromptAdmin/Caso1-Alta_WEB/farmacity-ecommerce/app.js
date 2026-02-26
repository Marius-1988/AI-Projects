// Datos Mockeados
const MOCK_PRODUCTS = [
    {
        id: 1,
        name: "Ibuprofeno Actron 600mg x 10 Capsulas",
        price: 3450,
        stock: 50,
        image: "https://placehold.co/200x200/f4f6f8/333333?text=Actron+600"
    },
    {
        id: 2,
        name: "Crema Facial Nivea Q10 Anti-Arrugas 50ml",
        price: 15800,
        stock: 12,
        image: "https://placehold.co/200x200/f4f6f8/333333?text=Nivea+Q10"
    },
    {
        id: 3,
        name: "Shampoo Pantene Restauración 400ml",
        price: 4200,
        stock: 5,
        image: "https://placehold.co/200x200/f4f6f8/333333?text=Pantene"
    },
    {
        id: 4,
        name: "Protector Solar Dermaglós FPS 50 150g",
        price: 18900,
        stock: 25,
        image: "https://placehold.co/200x200/f4f6f8/333333?text=Dermaglos+FPS50"
    },
    {
        id: 5,
        name: "Paracetamol Tafirol 500mg x 10 Comprimidos",
        price: 2100,
        stock: 100,
        image: "https://placehold.co/200x200/f4f6f8/333333?text=Tafirol+500"
    },
    {
        id: 6,
        name: "Desodorante Dove Original Aerosol 150ml",
        price: 3100,
        stock: 0,
        image: "https://placehold.co/200x200/f4f6f8/333333?text=Dove+Aerosol"
    },
    {
        id: 7,
        name: "Pasta Dental Colgate Total 12 90g",
        price: 2600,
        stock: 40,
        image: "https://placehold.co/200x200/f4f6f8/333333?text=Colgate+Total"
    },
    {
        id: 8,
        name: "Agua Micelar Garnier Skin Active 400ml",
        price: 11500,
        stock: 18,
        image: "https://placehold.co/200x200/f4f6f8/333333?text=Garnier+Micelar"
    }
];

let cart = [];
let currentUser = null;

// Elementos del DOM
const loginModal = document.getElementById('login-modal');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const appContainer = document.getElementById('app');
const userDisplayName = document.getElementById('user-display-name');
const avatar = document.querySelector('.avatar');

const navHome = document.getElementById('nav-home');
const navCart = document.getElementById('nav-cart');
const navLogout = document.getElementById('nav-logout');
const viewDashboard = document.getElementById('dashboard-view');
const viewCart = document.getElementById('cart-view');
const pageTitle = document.getElementById('page-title');

const productList = document.getElementById('product-list');
const cartItemsList = document.getElementById('cart-items-list');
const cartBadge = document.getElementById('cart-badge');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartTotal = document.getElementById('cart-total');
const toast = document.getElementById('toast');
const btnEmptyCart = document.getElementById('btn-empty-cart');
const btnCheckout = document.getElementById('btn-checkout');

// Funciones de Formateo
const formatPrice = (price) => new Intl.NumberFormat('es-AR', { style: 'decimal', minimumFractionDigits: 2 }).format(price);

// Lógica de Login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email && password.length >= 6) {
        // Simulando un inicio de sesión exitoso
        currentUser = { email, name: email.split('@')[0] };
        loginModal.classList.add('hidden');
        appContainer.classList.remove('hidden');

        userDisplayName.textContent = currentUser.name;
        avatar.textContent = currentUser.name.charAt(0).toUpperCase();

        renderProducts();
    } else {
        loginError.textContent = "Campos inválidos. La contraseña debe tener al menos 6 caracteres.";
    }
});

// Navegación
navLogout.addEventListener('click', (e) => {
    e.preventDefault();
    currentUser = null;
    cart = [];
    updateCartIcon();
    appContainer.classList.add('hidden');
    loginModal.classList.remove('hidden');
    document.getElementById('password').value = '';
    loginError.textContent = '';
});

const switchView = (viewName) => {
    navHome.classList.remove('active');
    navCart.classList.remove('active');
    viewDashboard.classList.add('hidden');
    viewCart.classList.add('hidden');

    if (viewName === 'home') {
        navHome.classList.add('active');
        viewDashboard.classList.remove('hidden');
        pageTitle.textContent = "Productos Destacados";
        renderProducts();
    } else if (viewName === 'cart') {
        navCart.classList.add('active');
        viewCart.classList.remove('hidden');
        pageTitle.textContent = "Mi Carrito de Compras";
        renderCart();
    }
};

navHome.addEventListener('click', (e) => { e.preventDefault(); switchView('home'); });
navCart.addEventListener('click', (e) => { e.preventDefault(); switchView('cart'); });

// Renderizado de Productos
const renderProducts = () => {
    productList.innerHTML = '';

    MOCK_PRODUCTS.forEach(product => {
        const isOutOfStock = product.stock === 0;

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-img">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-stock ${isOutOfStock ? 'low-stock' : ''}">
                    ${isOutOfStock ? 'Sin stock' : `Stock disponible: ${product.stock}`}
                </div>
                <div class="product-price">$${formatPrice(product.price)}</div>
                <button class="btn btn-primary btn-block ${isOutOfStock ? 'hidden' : ''}" 
                        onclick="addToCart(${product.id})">
                    Agregar al carrito
                </button>
                <button class="btn btn-outline btn-block ${!isOutOfStock ? 'hidden' : ''}" disabled>
                    Agotado
                </button>
            </div>
        `;
        productList.appendChild(card);
    });
};

// Lógica de Carrito
window.addToCart = (productId) => {
    const product = MOCK_PRODUCTS.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        if (cartItem.qty < product.stock) {
            cartItem.qty += 1;
            showToast('Cantidad actualizada');
        } else {
            showToast('No hay más stock disponible');
            return;
        }
    } else {
        cart.push({ ...product, qty: 1 });
        showToast('Producto agregado al carrito');
    }

    updateCartIcon();
};

window.removeFromCart = (productId) => {
    cart = cart.filter(item => item.id !== productId);
    updateCartIcon();
    renderCart();
};

window.updateQty = (productId, change) => {
    const cartItem = cart.find(item => item.id === productId);
    const product = MOCK_PRODUCTS.find(p => p.id === productId);

    if (cartItem) {
        const newQty = cartItem.qty + change;
        if (newQty > 0 && newQty <= product.stock) {
            cartItem.qty = newQty;
            updateCartIcon();
            renderCart();
        } else if (newQty === 0) {
            removeFromCart(productId);
        } else {
            showToast('Máximo stock alcanzado');
        }
    }
};

const updateCartIcon = () => {
    const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
    cartBadge.textContent = totalItems;
};

const renderCart = () => {
    cartItemsList.innerHTML = '';

    if (cart.length === 0) {
        cartItemsList.innerHTML = '<div class="empty-cart-msg">Tu carrito está vacío. Agrega productos para comenzar.</div>';
        cartSubtotal.textContent = '0.00';
        cartTotal.textContent = '0.00';
        btnCheckout.disabled = true;
        btnEmptyCart.disabled = true;
        return;
    }

    btnCheckout.disabled = false;
    btnEmptyCart.disabled = false;

    let subtotal = 0;

    cart.forEach(item => {
        subtotal += item.price * item.qty;

        const cartItemEl = document.createElement('div');
        cartItemEl.className = 'cart-item';
        cartItemEl.innerHTML = `
            <div class="cart-item-img">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">$${formatPrice(item.price)} unidad</div>
            </div>
            <div class="cart-item-controls">
                <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
                <span>${item.qty}</span>
                <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
                <div style="width: 100px; text-align: right; font-weight: 600;">$${formatPrice(item.price * item.qty)}</div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">✖</button>
            </div>
        `;
        cartItemsList.appendChild(cartItemEl);
    });

    const envio = 1500;
    cartSubtotal.textContent = formatPrice(subtotal);
    cartTotal.textContent = formatPrice(subtotal + envio);
};

// Acciones de Resumen de Carrito
btnEmptyCart.addEventListener('click', () => {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        cart = [];
        updateCartIcon();
        renderCart();
    }
});

btnCheckout.addEventListener('click', () => {
    alert('🛒 ¡Simulación de pago exitosa! Gracias por probar la demo de Farmacity.');
    cart = [];
    updateCartIcon();
    switchView('home');
});

// Utilidad: Toast
const showToast = (message) => {
    toast.textContent = message;
    toast.classList.remove('hidden');

    // reset animation if triggered quickly
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 2500);
};
