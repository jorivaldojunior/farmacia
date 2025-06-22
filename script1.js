// script1.js
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('checkoutForm');
  
  const checkoutData = JSON.parse(localStorage.getItem('checkoutData'));

  if (!checkoutData) {
    window.location.href = 'index1.html';
    return;
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
      fullName: document.getElementById('fullName').value,
      phone: document.getElementById('phone').value,
      address: document.getElementById('address').value,
      paymentMethod: document.getElementById('paymentMethod').value,
      notes: document.getElementById('notes').value
    };

    if (!formData.fullName || !formData.phone || !formData.address || !formData.paymentMethod) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    // Mensagem simplificada sem emojis
    let message = `*NOVO PEDIDO - FÁRMACIA MULTIMEDIC*%0A%0A`;
    
    // Dados do cliente
    message += `*DADOS DO CLIENTE*%0A`;
    message += `Nome: ${encodeURIComponent(formData.fullName)}%0A`;
    message += `WhatsApp: ${encodeURIComponent(formData.phone)}%0A`;
    message += `Endereço: ${encodeURIComponent(formData.address)}%0A`;
    message += `Pagamento: ${encodeURIComponent(formData.paymentMethod)}%0A`;
    message += `Observações: ${formData.notes ? encodeURIComponent(formData.notes) : 'Nenhuma'}%0A%0A`;
    
    // Itens do pedido
    message += `*ITENS DO PEDIDO*%0A`;
    checkoutData.items.forEach(item => {
      message += `- ${encodeURIComponent(item.name)} (${item.quantity}x): R$ ${item.total.toFixed(2)}%0A`;
    });
    
    // Totais
    message += `%0A*TOTAIS*%0A`;
    message += `Subtotal: R$ ${checkoutData.subtotal.toFixed(2)}%0A`;
    message += `${encodeURIComponent(checkoutData.shipping.message)}%0A`;
    message += `*TOTAL: R$ ${checkoutData.total.toFixed(2)}*%0A%0A`;
    
    // Tempo de entrega
    message += `Entrega em aproximadamente ${checkoutData.deliveryTime.split(' ')[3]} minutos%0A%0A`;
    message += `Por favor, confirme o recebimento deste pedido.`;

    // WhatsApp URL
    const whatsappUrl = `https://wa.me/5581991152307?text=${message}`;
    window.open(whatsappUrl, '_blank');

    // Limpar dados
    localStorage.removeItem('cart');
    localStorage.removeItem('checkoutData');
  });
});

