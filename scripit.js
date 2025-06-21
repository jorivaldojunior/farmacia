// Cart Functionality
const cartBtn = document.getElementById('cartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartShipping = document.getElementById('cartShipping');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');

// Carrega o carrinho do localStorage ao iniciar
let cart = JSON.parse(localStorage.getItem('pharmacity_cart')) || [];

// Simulated products data - você pode mover isso para um backend real posteriormente
const products = {
  1: { id: 1, name: 'Paracetamol 500mg', price: 10.00, originalPrice: 12.50 },
  2: { id: 2, name: 'Dipirona 300mg', price: 9.99, originalPrice: 9.99 },
  3: { id: 3, name: 'Amoxicilina 500mg', price: 35.00, originalPrice: 35.00 },
  4: { id: 4, name: 'Dorflex', price: 12.50, originalPrice: 15.00 },
  5: { id: 5, name: 'Vitamina C 1g', price: 22.00, originalPrice: 22.00 }
};

// Função para salvar o carrinho no localStorage
function saveCart() {
  localStorage.setItem('pharmacity_cart', JSON.stringify(cart));
}

// Atualiza o contador do carrinho
function updateCartCount() {
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = totalItems;
  
  if (totalItems > 0) {
    cartCount.classList.remove('hidden');
  } else {
    cartCount.classList.add('hidden');
  }
}

// Atualiza a exibição do carrinho
function updateCartDisplay() {
  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="text-center py-8 text-gray-500">
        <i class="fas fa-shopping-cart text-4xl mb-2"></i>
        <p>Seu carrinho está vazio</p>
      </div>
    `;
    checkoutBtn.disabled = true;
  } else {
    cartItems.innerHTML = cart.map(item => `
      <div class="flex items-start border-b border-gray-800 pb-4">
        <div class="flex-shrink-0 bg-gray-800 rounded-lg p-2 mr-4">
          <img src="https://placehold.co/80x80/1F1F1F/FFFFFF?text=${item.name.split(' ')[0]}" alt="${item.name}" class="w-16 h-16 object-cover">
        </div>
        <div class="flex-grow">
          <h4 class="font-medium">${item.name}</h4>
          <div class="flex items-center justify-between mt-1">
            <div class="flex items-center">
              <button onclick="updateQuantity(${item.id}, -1)" class="text-gray-400 hover:text-white px-2">
                <i class="fas fa-minus text-xs"></i>
              </button>
              <span class="mx-2">${item.quantity}</span>
              <button onclick="updateQuantity(${item.id}, 1)" class="text-gray-400 hover:text-white px-2">
                <i class="fas fa-plus text-xs"></i>
              </button>
            </div>
            <span class="font-bold">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
          </div>
        </div>
        <button onclick="removeFromCart(${item.id})" class="text-gray-400 hover:text-red-500 ml-2">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `).join('');
    
    checkoutBtn.disabled = false;
  }
  
  // Calculate totals
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  cartSubtotal.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
  
  // Simple shipping calculation
  const shipping = subtotal >= 100 ? 0 : 15;
  cartShipping.textContent = shipping === 0 ? 'Grátis' : `R$ ${shipping.toFixed(2).replace('.', ',')}`;
  
  const total = subtotal + shipping;
  cartTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// Adiciona produto ao carrinho
function addToCart(productId) {
  const product = products[productId];
  
  if (!product) return;
  
  // Check if product is already in cart
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }
  
  saveCart();
  updateCartCount();
  showAddedToCartNotification(product.name);
}

// Atualiza quantidade de um item no carrinho
function updateQuantity(productId, change) {
  const item = cart.find(item => item.id === productId);
  
  if (item) {
    item.quantity += change;
    
    if (item.quantity <= 0) {
      cart = cart.filter(item => item.id !== productId);
    }
    
    saveCart();
    updateCartCount();
    updateCartDisplay();
  }
}

// Remove item do carrinho
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartCount();
  updateCartDisplay();
}

// Finaliza a compra (simulado)
function checkout() {
  // Aqui você normalmente enviaria os dados para o backend
  console.log('Pedido enviado:', cart);
  
  // Limpa o carrinho após o pedido ser enviado
  cart = [];
  saveCart();
  updateCartCount();
  updateCartDisplay();
  
  // Mostra mensagem de sucesso
  alert('Pedido realizado com sucesso! Obrigado por comprar na Pharmacity.');
}

// Mostra notificação quando um produto é adicionado
function showAddedToCartNotification(productName) {
  const notification = document.createElement('div');
  notification.className = 'fixed bottom-20 right-6 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
  notification.innerHTML = `
    <div class="flex items-center">
      <i class="fas fa-check-circle mr-2"></i>
      <span>${productName} adicionado ao carrinho!</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.remove('animate-bounce');
    notification.classList.add('opacity-0', 'transition-opacity', 'duration-300');
    
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 2000);
}

// Event Listeners
cartBtn.addEventListener('click', () => {
  cartSidebar.classList.remove('translate-x-full');
  cartOverlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  updateCartDisplay();
});

closeCartBtn.addEventListener('click', () => {
  cartSidebar.classList.add('translate-x-full');
  cartOverlay.classList.add('hidden');
  document.body.style.overflow = '';
});

cartOverlay.addEventListener('click', () => {
  cartSidebar.classList.add('translate-x-full');
  cartOverlay.classList.add('hidden');
  document.body.style.overflow = '';
});

checkoutBtn.addEventListener('click', checkout);

// Inicializa o carrinho
updateCartCount();