// Configuration
const WHATSAPP_NUMBER = '5511999999999';
const SHIPPING_FEE = 9.99;
const FREE_SHIPPING_THRESHOLD = 100;

// State
let products = [];
let cart = [];
let filters = {
    category: [],
    priceRange: [0, 200],
    onlyDiscount: false
};

// DOM Elements
const loadingScreen = document.getElementById('loadingScreen');
const loadingProgress = document.getElementById('loadingProgress');
const productsContainer = document.getElementById('productsContainer');
const cartButton = document.getElementById('cartButton');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const emptyCart = document.getElementById('emptyCart');
const cartBadge = document.getElementById('cartBadge');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartShipping = document.getElementById('cartShipping');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const searchInput = document.getElementById('searchInput');
const clearSearch = document.getElementById('clearSearch');
const filterBtn = document.getElementById('filterBtn');
const filterPanel = document.getElementById('filterPanel');
const categoriesBtn = document.getElementById('categoriesBtn');
const categoriesDropdown = document.getElementById('categoriesDropdown');
const userBtn = document.getElementById('userBtn');
const userModal = document.getElementById('userModal');
const closeUserModal = document.getElementById('closeUserModal');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const toastIcon = document.getElementById('toastIcon');

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Simulate loading products
    simulateLoading();
    
    // Setup event listeners
    setupEventListeners();
});

// Simulate loading products with progress
function simulateLoading() {
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                loadProducts();
            }, 500);
        }
        loadingProgress.firstElementChild.style.width = `${progress}%`;
    }, 200);
}

// Load products (mock data for demonstration)
function loadProducts() {
    // Mock data - in a real app, this would come from an API
    products = [
        { id: 1, name: 'Paracetamol 500mg', price: 12.50, discountPrice: 10.00, category: 'medicamentos', image: 'https://placehold.co/300x300/1F1F1F/FFFFFF?text=Paracetamol', hasDiscount: true },
        { id: 2, name: 'Dipirona 300mg', price: 9.99, category: 'medicamentos', image: 'https://placehold.co/300x300/1F1F1F/FFFFFF?text=Dipirona' },
        { id: 3, name: 'Amoxicilina 500mg', price: 35.00, category: 'medicamentos', image: 'https://placehold.co/300x300/1F1F1F/FFFFFF?text=Amoxicilina' },
        { id: 4, name: 'Dorflex', price: 15.00, discountPrice: 12.50, category: 'medicamentos', image: 'https://placehold.co/300x300/1F1F1F/FFFFFF?text=Dorflex', hasDiscount: true },
        { id: 5, name: 'Vitamina C 1g', price: 22.00, category: 'vitaminas', image: 'https://placehold.co/300x300/1F1F1F/FFFFFF?text=Vitamina+C' },
        { id: 6, name: 'Ômega 3', price: 45.00, discountPrice: 39.90, category: 'vitaminas', image: 'https://placehold.co/300x300/1F1F1F/FFFFFF?text=Omega+3', hasDiscount: true },
        { id: 7, name: 'Shampoo Anti-queda', price: 28.90, category: 'higiene', image: 'https://placehold.co/300x300/1F1F1F/FFFFFF?text=Shampoo' },
        { id: 8, name: 'Creme Dental Colgate', price: 5.50, category: 'higiene', image: 'https://placehold.co/300x300/1F1F1F/FFFFFF?text=Creme+Dental' },
        { id: 9, name: 'Protetor Solar FPS 50', price: 60.00, discountPrice: 54.90, category: 'higiene', image: 'https://placehold.co/300x300/1F1F1F/FFFFFF?text=Protetor+Solar', hasDiscount: true },
        { id: 10, name: 'Sabonete Líquido', price: 18.00, category: 'higiene', image: 'https://placehold.co/300x300/1F1F1F/FFFFFF?text=Sabonete' },
        { id: 11, name: 'Complexo B', price: 30.00, category: 'vitaminas', image: 'https://placehold.co/300x300/1F1F1F/FFFFFF?text=Complexo+B' },
        { id: 12, name: 'Magnésio Dimalato', price: 55.00, category: 'vitaminas', image: 'https://placehold.co/300x300/1F1F1F/FFFFFF?text=Magnesio' },
        { id: 13, name: 'Termômetro Digital', price: 25.00, discountPrice: 19.90, category: 'equipamentos', image: 'https://placehold.co/300x300/1F1F1F/FFFFFF?text=Termometro', hasDiscount: true },
        { id: 14, name: 'Álcool em Gel 70%', price: 8.00, category: 'higiene', image: 'https://placehold.co/300x300/1F1F1F/FFFFFF?text=Alcool+Gel' },
        { id: 15, name: 'Band-aid', price: 6.50, category: 'primeiros-socorros', image: 'https://placehold.co/300x300/1F1F1F/FFFFFF?text=Band-aid' }
    ];
    
    renderProducts(products);
}

// Render products to the DOM
function renderProducts(productsToRender) {
    productsContainer.innerHTML = '';
    
    if (productsToRender.length === 0) {
        productsContainer.innerHTML = `
            <div class="col-span-full text-center py-10">
                <i class="fas fa-search text-4xl text-gray-600 mb-4"></i>
                <p class="text-gray-400">Nenhum produto encontrado</p>
            </div>
        `;
        return;
    }
    
    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card bg-gray-800 rounded-lg overflow-hidden shadow-md border border-gray-700';
        productCard.innerHTML = `
            <div class="relative">
                <img src="${product.image}" alt="${product.name}" class="w-full h-40 object-cover" onerror="this.onerror=null;this.src='https://placehold.co/300x300/1F1F1F/FFFFFF?text=Produto';">
                ${product.hasDiscount ? `<span class="discount-badge">${Math.round((1 - product.discountPrice/product.price)*100)}% OFF</span>` : ''}
                <button class="absolute bottom-2 right-2 bg-primary hover:bg-primary-dark text-white p-2 rounded-full shadow-lg transition" onclick="addToCart(${product.id})">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <div class="p-4">
                <h4 class="text-sm font-semibold text-white mb-1 truncate">${product.name}</h4>
                <div class="flex items-center">
                    ${product.hasDiscount ? `
                        <span class="text-primary font-bold">R$ ${product.discountPrice.toFixed(2).replace('.', ',')}</span>
                        <span class="text-xs text-gray-400 line-through ml-2">R$ ${product.price.toFixed(2).replace('.', ',')}</span>
                    ` : `
                        <span class="text-white font-bold">R$ ${product.price.toFixed(2).replace('.', ',')}</span>
                    `}
                </div>
            </div>
        `;
        productsContainer.appendChild(productCard);
    });
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.product.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            product: product,
            quantity: 1
        });
    }
    
    updateCart();
    showToast('Produto adicionado ao carrinho', 'success');
}

// Update cart UI
function updateCart() {
    // Update badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
    
    if (totalItems > 0) {
        cartBadge.classList.remove('hidden');
        if (totalItems > 9) cartBadge.classList.add('badge-pulse');
        else cartBadge.classList.remove('badge-pulse');
    } else {
        cartBadge.classList.add('hidden');
    }
    
    // Update cart items
    if (cart.length === 0) {
        emptyCart.classList.remove('hidden');
        cartItems.innerHTML = '';
        cartItems.appendChild(emptyCart);
        checkoutBtn.disabled = true;
    } else {
        emptyCart.classList.add('hidden');
        
        cartItems.innerHTML = '';
        let subtotal = 0;        cart.forEach(item => {
            const price = item.product.hasDiscount ? item.product.discountPrice : item.product.price;
            subtotal += price * item.quantity;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'bg-gray-800 rounded-lg p-3 flex items-start';
            cartItem.innerHTML = `
                <img src="${item.product.image}" alt="${item.product.name}" class="w-16 h-16 object-cover rounded mr-3" onerror="this.onerror=null;this.src='https://placehold.co/100x100/1F1F1F/FFFFFF?text=Produto';">
                <div class="flex-grow">
                    <h5 class="font-medium text-white">${item.product.name}</h5>
                    <p class="text-sm text-gray-400">${item.product.hasDiscount ? 
                        `R$ ${item.product.discountPrice.toFixed(2).replace('.', ',')}` : 
                        `R$ ${item.product.price.toFixed(2).replace('.', ',')}`}</p>
                    <div class="flex items-center mt-2">
                        <button class="quantity-btn bg-gray-700 text-white rounded w-6 h-6 flex items-center justify-center" onclick="updateQuantity(${item.product.id}, 'decrease')">
                            <i class="fas fa-minus text-xs"></i>
                        </button>
                        <span class="mx-2 text-white">${item.quantity}</span>
                        <button class="quantity-btn bg-primary text-white rounded w-6 h-6 flex items-center justify-center" onclick="updateQuantity(${item.product.id}, 'increase')">
                            <i class="fas fa-plus text-xs"></i>
                        </button>
                        <button class="ml-auto text-gray-400 hover:text-red-500" onclick="removeFromCart(${item.product.id})">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
        
        // Calculate shipping
        const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
        const total = subtotal + shipping;
        
        // Update totals
        cartSubtotal.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        cartShipping.textContent = shipping === 0 ? 'Grátis' : `R$ ${shipping.toFixed(2).replace('.', ',')}`;
        cartTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        
        checkoutBtn.disabled = false;
    }
}

// Update item quantity in cart
function updateQuantity(productId, action) {
    const itemIndex = cart.findIndex(item => item.product.id === productId);
    if (itemIndex === -1) return;
    
    if (action === 'increase') {
        cart[itemIndex].quantity++;
    } else if (action === 'decrease') {
        cart[itemIndex].quantity--;
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
    }
    
    updateCart();
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.product.id !== productId);
    updateCart();
    showToast('Produto removido do carrinho', 'warning');
}

// Show toast notification
function showToast(message, type) {
    toastMessage.textContent = message;
    
    // Set icon and color based on type
    switch(type) {
        case 'success':
            toastIcon.className = 'fas fa-check-circle mr-2';
            toast.className = 'toast bg-green-600';
            break;
        case 'error':
            toastIcon.className = 'fas fa-exclamation-circle mr-2';
            toast.className = 'toast bg-red-600';
            break;
        case 'warning':
            toastIcon.className = 'fas fa-exclamation-triangle mr-2';
            toast.className = 'toast bg-yellow-600';
            break;
        default:
            toastIcon.className = 'fas fa-info-circle mr-2';
            toast.className = 'toast bg-blue-600';
    }
    
    toast.classList.remove('hidden');
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.classList.add('hidden'), 300);
    }, 3000);
}

// Setup event listeners
function setupEventListeners() {
    // Cart toggle
    cartButton.addEventListener('click', () => {
        cartSidebar.classList.toggle('translate-x-full');
        cartSidebar.classList.toggle('translate-x-0');
    });
    
    closeCart.addEventListener('click', () => {
        cartSidebar.classList.add('translate-x-full');
        cartSidebar.classList.remove('translate-x-0');
    });
    
    // Checkout button
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) return;
        
        let message = 'Olá, gostaria de fazer o seguinte pedido:\n\n';
        let subtotal = 0;
        
        cart.forEach(item => {
            const price = item.product.hasDiscount ? item.product.discountPrice : item.product.price;
            const itemTotal = price * item.quantity;
            subtotal += itemTotal;
            
            message += `- ${item.product.name} (${item.quantity}x) - R$ ${itemTotal.toFixed(2).replace('.', ',')}\n`;
        });
        
        const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
        const total = subtotal + shipping;
        
        message += `\nSubtotal: R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
        message += `Frete: ${shipping === 0 ? 'Grátis' : `R$ ${shipping.toFixed(2).replace('.', ',')}`}\n`;
        message += `Total: R$ ${total.toFixed(2).replace('.', ',')}\n\n`;
        message += 'Por favor, confirme a disponibilidade e o prazo de entrega.';
        
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
    });
    
    // Search functionality
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        clearSearch.classList.toggle('hidden', searchTerm === '');
        
        if (searchTerm === '') {
            renderProducts(products);
            return;
        }
        
        const filtered = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.category.toLowerCase().includes(searchTerm)
        );
        
        renderProducts(filtered);
    });
    
    clearSearch.addEventListener('click', () => {
        searchInput.value = '';
        clearSearch.classList.add('hidden');
        renderProducts(products);
    });
    
    // Filter panel toggle
    filterBtn.addEventListener('click', () => {
        filterPanel.classList.toggle('hidden');
    });
    
    // Categories dropdown toggle
    categoriesBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        categoriesDropdown.classList.toggle('hidden');
    });
    
    // Close categories dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!categoriesDropdown.contains(e.target) && e.target !== categoriesBtn) {
            categoriesDropdown.classList.add('hidden');
        }
    });
    
    // User modal toggle
    userBtn.addEventListener('click', () => {
        userModal.classList.remove('hidden');
    });
    
    closeUserModal.addEventListener('click', () => {
        userModal.classList.add('hidden');
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === userModal) {
            userModal.classList.add('hidden');
        }
    });
}

// Expose functions to global scope for inline event handlers
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;