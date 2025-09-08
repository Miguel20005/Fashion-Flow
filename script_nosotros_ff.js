
// Actualizar contador del carrito desde localStorage
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
    }

// Cargar contador al iniciar
document.addEventListener('DOMContentLoaded', updateCartCount);

// Actualizar periódicamente por si se modifica en otra página
setInterval(updateCartCount, 1000);
