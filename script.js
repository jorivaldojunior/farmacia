// =============================================
// SELEÇÃO DE ELEMENTOS DO DOM
// =============================================
const mobileMenu = document.querySelector('.mobile-menu');
const menuOverlay = document.getElementById('menuOverlay');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const closeMenuBtn = document.getElementById('closeMenuBtn');
const userBtn = document.getElementById('userBtn');
const mobileUserBtn = document.getElementById('mobileUserBtn');
const authModal = document.getElementById('authModal');
const closeAuthModal = document.getElementById('closeAuthModal');
const showRegisterBtn = document.getElementById('showRegisterBtn');
const showLoginBtn = document.getElementById('showLoginBtn');
const authForm = document.getElementById('authForm');
const registerForm = document.getElementById('registerForm');
const cartBtn = document.getElementById('cartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartItemsContainer = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');

// =============================================
// DADOS E CONFIGURAÇÕES
// =============================================
const products = [
  {
    id: 1,
    name: 'Paracetamol 500mg',
    price: 10.00,
    oldPrice: 12.50,
    image: 'https://placehold.co/300x300/1F1F1F/FFFFFF?text=Paracetamol',
    category: 'medicamentos'
  },
  {
    id: 2,
    name: 'Dipirona 300mg',
    price: 9.99,
    oldPrice: null,
    image: 'https://placehold.co/300x300/1F1F1F/FFFFFF?text=Dipirona',
    category: 'medicamentos'
  },
  {
    id: 3,
    name: 'Amoxicilina 500mg',
    price: 35.00,
    oldPrice: null,
    image: 'https://placehold.co/300x300/1F1F1F/FFFFFF?text=Amoxicilina',
    category: 'antibióticos'
  },
  {
    id: 4,
    name: 'Dorflex',
    price: 12.50,
    oldPrice: 15.00,
    image: 'https://placehold.co/300x300/1F1F1F/FFFFFF?text=Dorflex',
    category: 'analgésicos'
  },
  {
    id: 5,
    name: 'Vitamina C 1g',
    price: 22.00,
    oldPrice: null,
    image: 'https://placehold.co/300x300/1F1F1F/FFFFFF?text=Vitamina+C',
    category: 'vitaminas'
  }
];

// Configurações de frete
const SHIPPING_FREE_THRESHOLD = 100;
const SHIPPING_COST_PER_KM = 1;
const DEFAULT_SHIPPING_DISTANCE = 5; // Distância padrão em km

// Estado da aplicação
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
let userData = JSON.parse(localStorage.getItem('userData')) || null;

// =============================================
// FUNÇÕES DE PERSISTÊNCIA
// =============================================
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function saveAuthState() {
  localStorage.setItem('isLoggedIn', isLoggedIn);
  if (userData) {
    localStorage.setItem('userData', JSON.stringify(userData));
  }
}

// =============================================
// FUNÇÕES DE INTERFACE (UI)
// =============================================
function toggleMobileMenu() {
  mobileMenu.classList.toggle('translate-x-full');
  mobileMenu.classList.toggle('translate-x-0');
  menuOverlay.classList.toggle('hidden');
  document.body.classList.toggle('overflow-hidden');
}

function toggleAuthModal() {
  authModal.classList.toggle('hidden');
  document.body.classList.toggle('overflow-hidden');
}

function toggleAuthForms() {
  authForm.classList.toggle('hidden');
  registerForm.classList.toggle('hidden');
}

function toggleCart() {
  cartSidebar.classList.toggle('translate-x-full');
  cartOverlay.classList.toggle('hidden');
  document.body.classList.toggle('overflow-hidden');
}

// =============================================
// FUNÇÕES DE CÁLCULO
// =============================================
function calculateShipping(subtotal) {
  if (subtotal >= SHIPPING_FREE_THRESHOLD) {
    return { cost: 0, message: 'Frete Grátis' };
  }
  
  const cost = SHIPPING_COST_PER_KM * DEFAULT_SHIPPING_DISTANCE;
  return { 
    cost, 
    message: `Frete: R$ ${cost.toFixed(2)} (${DEFAULT_SHIPPING_DISTANCE}km)`
  };
}

function calculateDeliveryTime() {
  const baseTime = 30; // minutos base
  const additionalTime = DEFAULT_SHIPPING_DISTANCE * 2; // 2 minutos por km
  const totalTime = baseTime + additionalTime;
  
  return `Entrega em aproximadamente ${totalTime} minutos`;
}

// =============================================
// FUNÇÕES DO CARRINHO (COMPLETO)
// =============================================
function updateCart() {
  // Atualizar contador
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;

  // Atualizar lista de itens
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="text-center py-8 text-gray-500">
        <i class="fas fa-shopping-cart text-4xl mb-2"></i>
        <p>Seu carrinho está vazio</p>
      </div>
    `;
    checkoutBtn.classList.add('hidden');
  } else {
    cartItemsContainer.innerHTML = cart.map(item => {
      const imageSrc = item.image || 'https://placehold.co/300x300/1F1F1F/FFFFFF?text=Produto';
      
      return `
        <div class="flex items-start border-b border-gray-800 pb-4">
          <img src="${imageSrc}" alt="${item.name}" class="w-16 h-16 object-cover rounded mr-4"
               onerror="this.src='https://placehold.co/300x300/1F1F1F/FFFFFF?text=Produto'">
          <div class="flex-1">
            <h4 class="font-medium">${item.name}</h4>
            <div class="flex justify-between mt-1">
              <div class="flex items-center">
                <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})" class="text-gray-400 hover:text-white px-2">
                  <i class="fas fa-minus text-xs"></i>
                </button>
                <span class="mx-2">${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})" class="text-gray-400 hover:text-white px-2">
                  <i class="fas fa-plus text-xs"></i>
                </button>
              </div>
              <span class="font-bold">R$ ${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          </div>
          <button onclick="removeFromCart(${item.id})" class="text-gray-400 hover:text-red-500 ml-2">
            <i class="fas fa-times"></i>
          </button>
        </div>
      `;
    }).join('');
    checkoutBtn.classList.remove('hidden');
  }

  // Calcular totais
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping.cost;

  // Atualizar UI
  cartSubtotal.textContent = `R$ ${subtotal.toFixed(2)}`;
  document.getElementById('cartShipping').textContent = shipping.message;
  cartTotal.textContent = `R$ ${total.toFixed(2)}`;
  
  // Adicionar informação de tempo de entrega
  const deliveryInfo = document.getElementById('deliveryInfo') || document.createElement('div');
  deliveryInfo.id = 'deliveryInfo';
  deliveryInfo.className = 'text-sm text-gray-400 mt-2';
  deliveryInfo.textContent = calculateDeliveryTime();
  
  if (!document.getElementById('deliveryInfo')) {
    cartItemsContainer.appendChild(deliveryInfo);
  }

  // Salvar carrinho no localStorage
  saveCart();
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    console.error(`Produto com ID ${productId} não encontrado`);
    showNotification('Produto não encontrado', 'error');
    return;
  }

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ 
      ...product,
      quantity: 1 
    });
  }

  updateCart();
  showNotification(`${product.name} adicionado ao carrinho`, 'success');
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCart();
  showNotification('Item removido do carrinho', 'info');
}

function updateQuantity(productId, newQuantity) {
  const item = cart.find(item => item.id === productId);
  if (item && newQuantity > 0) {
    item.quantity = newQuantity;
    updateCart();
  } else if (item && newQuantity <= 0) {
    removeFromCart(productId);
  }
}

function prepareCheckoutData() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping.cost;
  
  return {
    items: cart.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      total: item.price * item.quantity
    })),
    subtotal: subtotal,
    shipping: shipping,
    total: total,
    deliveryTime: calculateDeliveryTime(),
    user: userData ? {
      name: userData.name,
      email: userData.email
    } : null
  };
}

function checkout() {
  if (cart.length === 0) {
    showNotification('Seu carrinho está vazio', 'error');
    return;
  }

  // Preparar dados do pedido
  const checkoutData = prepareCheckoutData();
  
  // Salvar os dados do pedido no localStorage para a página de finalização
  localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
  
  // Redirecionar para a página de finalização do pedido
  window.location.href = 'finalizar_pedido.html';
}

// =============================================
// FUNÇÕES DE AUTENTICAÇÃO
// =============================================
function login(email, password) {
  // Simulação de requisição AJAX
  setTimeout(() => {
    isLoggedIn = true;
    userData = { 
      name: email.split('@')[0], 
      email,
      token: 'simulated-token-' + Math.random().toString(36).substr(2)
    };
    
    document.getElementById('userName').textContent = userData.name;
    document.getElementById('mobileUserName').textContent = userData.name;
    
    saveAuthState();
    toggleAuthModal();
    
    showNotification('Login realizado com sucesso!', 'success');
  }, 500);
}

function register(name, email, password) {
  // Simulação de requisição AJAX
  setTimeout(() => {
    isLoggedIn = true;
    userData = { 
      name, 
      email,
      token: 'simulated-token-' + Math.random().toString(36).substr(2)
    };
    
    document.getElementById('userName').textContent = name;
    document.getElementById('mobileUserName').textContent = name;
    
    saveAuthState();
    toggleAuthModal();
    
    showNotification('Cadastro realizado com sucesso!', 'success');
  }, 500);
}

function logout() {
  isLoggedIn = false;
  userData = null;
  
  document.getElementById('userName').textContent = 'Entrar';
  document.getElementById('mobileUserName').textContent = 'Entrar/Cadastrar';
  
  saveAuthState();
  showNotification('Você saiu da sua conta', 'info');
}

// =============================================
// FUNÇÕES AUXILIARES
// =============================================
function showNotification(message, type = 'info') {
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  };
  
  const notification = document.createElement('div');
  notification.className = `fixed bottom-20 right-6 ${colors[type]} text-white px-4 py-2 rounded-lg shadow-lg z-50`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// =============================================
// EVENT LISTENERS
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  // Restaurar estado da autenticação
  if (isLoggedIn && userData) {
    document.getElementById('userName').textContent = userData.name;
    document.getElementById('mobileUserName').textContent = userData.name;
  }

  // Menu mobile
  mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  closeMenuBtn.addEventListener('click', toggleMobileMenu);
  menuOverlay.addEventListener('click', toggleMobileMenu);

  // Autenticação
  userBtn.addEventListener('click', () => {
    if (isLoggedIn) {
      logout();
    } else {
      toggleAuthModal();
    }
  });
  
  mobileUserBtn.addEventListener('click', () => {
    if (isLoggedIn) {
      logout();
    } else {
      toggleAuthModal();
    }
  });

  closeAuthModal.addEventListener('click', toggleAuthModal);
  showRegisterBtn.addEventListener('click', toggleAuthForms);
  showLoginBtn.addEventListener('click', toggleAuthForms);

  // Carrinho
  cartBtn.addEventListener('click', toggleCart);
  closeCartBtn.addEventListener('click', toggleCart);
  cartOverlay.addEventListener('click', toggleCart);
  checkoutBtn.addEventListener('click', checkout);

  // Formulários
  authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
      showNotification('Preencha todos os campos', 'error');
      return;
    }
    
    login(email, password);
  });

  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    
    if (!name || !email || !password || !confirmPassword) {
      showNotification('Preencha todos os campos', 'error');
      return;
    }
    
    if (password !== confirmPassword) {
      showNotification('As senhas não coincidem', 'error');
      return;
    }
    
    register(name, email, password);
  });

  // Inicialização
  updateCart();
});

// =============================================
// EXPORTAÇÃO PARA ESCOPO GLOBAL
// =============================================
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.toggleMobileMenu = toggleMobileMenu;
window.toggleAuthModal = toggleAuthModal;
window.checkout = checkout;







