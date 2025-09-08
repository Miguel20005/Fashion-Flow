        // Datos de productos expandidos
        const products = [
            {
                id: 1,
                name: "Camisa Elegante Blanca",
                category: "camisas",
                price: 45.990,
                originalPrice: 59.990,
                description: "Camisa formal de algodón premium, perfecta para ocasiones especiales",
                icon: "fas fa-shirt",
                rating: 4.5,
                reviews: 128,
                isNew: true,
                discount: 23
            },
            {
                id: 2,
                name: "Pantalón Casual Azul",
                category: "pantalones",
                price: 59.990,
                description: "Pantalón cómodo de tela suave, ideal para uso diario",
                icon: "fas fa-person",
                rating: 4.2,
                reviews: 95
            },
            {
                id: 3,
                name: "Zapatillas Deportivas",
                category: "zapatos",
                price: 89.990,
                originalPrice: 119.990,
                description: "Zapatillas de alta tecnología con amortiguación superior",
                icon: "fas fa-shoe-prints",
                rating: 4.8,
                reviews: 203,
                discount: 25
            },
            {
                id: 4,
                name: "Reloj Inteligente",
                category: "accesorios",
                price: 129.990,
                description: "Smartwatch con múltiples funciones y diseño elegante",
                icon: "fas fa-clock",
                rating: 4.6,
                reviews: 167,
                isNew: true
            },
            {
                id: 5,
                name: "Camisa Casual Azul",
                category: "camisas",
                price: 35.990,
                description: "Camisa informal de manga corta, perfecta para el verano",
                icon: "fas fa-shirt",
                rating: 4.3,
                reviews: 87
            },
            {
                id: 6,
                name: "Jeans Premium Negro",
                category: "pantalones",
                price: 79.990,
                originalPrice: 99.990,
                description: "Jeans de mezclilla premium con corte moderno",
                icon: "fas fa-person",
                rating: 4.7,
                reviews: 156,
                discount: 20
            },
            {
                id: 7,
                name: "Zapatos Formales",
                category: "zapatos",
                price: 95.990,
                description: "Zapatos de cuero genuino para ocasiones formales",
                icon: "fas fa-shoe-prints",
                rating: 4.4,
                reviews: 112
            },
            {
                id: 8,
                name: "Gafas de Sol",
                category: "accesorios",
                price: 45.990,
                originalPrice: 65.990,
                description: "Gafas de sol con protección UV y diseño moderno",
                icon: "fas fa-glasses",
                rating: 4.1,
                reviews: 73,
                discount: 30
            },
            {
                id: 9,
                name: "Polo Deportivo",
                category: "camisas",
                price: 28.990,
                description: "Polo de material transpirable para actividades deportivas",
                icon: "fas fa-shirt",
                rating: 4.0,
                reviews: 64,
                isNew: true
            },
            {
                id: 10,
                name: "Shorts de Verano",
                category: "pantalones",
                price: 32.990,
                description: "Shorts ligeros y cómodos para la temporada de calor",
                icon: "fas fa-person",
                rating: 4.2,
                reviews: 91
            },
            {
                id: 11,
                name: "Sandalias Casual",
                category: "zapatos",
                price: 42.990,
                description: "Sandalias cómodas para uso casual y relajado",
                icon: "fas fa-shoe-prints",
                rating: 4.3,
                reviews: 56
            },
            {
                id: 12,
                name: "Mochila Moderna",
                category: "accesorios",
                price: 67.990,
                originalPrice: 85.990,
                description: "Mochila espaciosa con diseño moderno y múltiples compartimentos",
                icon: "fas fa-backpack",
                rating: 4.5,
                reviews: 134,
                discount: 21
            }
        ];

        // Variables globales
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        let filteredProducts = [...products];
        let currentCategory = 'all';
        let currentSort = 'name-asc';
        let searchTerm = '';

        // Inicialización
        document.addEventListener('DOMContentLoaded', function() {
            displayProducts(filteredProducts);
            setupEventListeners();
            updateCartCount();
        });

        // Event Listeners
        function setupEventListeners() {
            // Filtros por categoría
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    
                    currentCategory = this.dataset.category;
                    filterProducts();
                });
            });

            // Cerrar modal al hacer click fuera
            window.addEventListener('click', function(e) {
                const modal = document.getElementById('cartModal');
                if (e.target === modal) {
                    cerrarCarrito();
                }
            });
        }

        // Filtrar productos
        function filterProducts() {
            filteredProducts = products.filter(product => {
                const matchesCategory = currentCategory === 'all' || product.category === currentCategory;
                const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    product.description.toLowerCase().includes(searchTerm.toLowerCase());
                return matchesCategory && matchesSearch;
            });
            
            sortProducts();
        }

        // Buscar productos
        function buscarProductos() {
            searchTerm = document.getElementById('searchInput').value;
            filterProducts();
        }

        // Ordenar productos
        function sortProducts() {
            const sortBy = document.getElementById('sortSelect').value;
            
            filteredProducts.sort((a, b) => {
                switch (sortBy) {
                    case 'name-asc':
                        return a.name.localeCompare(b.name);
                    case 'name-desc':
                        return b.name.localeCompare(a.name);
                    case 'price-asc':
                        return a.price - b.price;
                    case 'price-desc':
                        return b.price - a.price;
                    case 'rating-desc':
                        return b.rating - a.rating;
                    default:
                        return 0;
                }
            });
            
            displayProducts(filteredProducts);
        }

        // Mostrar productos
        function displayProducts(productsToShow) {
            const grid = document.getElementById('productsGrid');
            const noResults = document.getElementById('noResults');
            
            if (productsToShow.length === 0) {
                grid.style.display = 'none';
                noResults.style.display = 'block';
                return;
            }
            
            grid.style.display = 'grid';
            noResults.style.display = 'none';
            grid.innerHTML = '';

            productsToShow.forEach((product, index) => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.style.opacity = '0';
                productCard.style.transform = 'translateY(20px)';
                
                const badge = product.isNew ? 'new' : (product.discount ? 'sale' : '');
                const badgeText = product.isNew ? 'NUEVO' : (product.discount ? `-${product.discount}%` : '');
                
                const originalPriceHTML = product.originalPrice ? 
                    `<span class="original-price">${product.originalPrice}</span>
                     ${product.discount ? `<span class="discount">-${product.discount}%</span>` : ''}` : '';

                const starsHTML = Array.from({length: 5}, (_, i) => 
                    `<i class="fas fa-star${i < Math.floor(product.rating) ? '' : (i < product.rating ? '-half-alt' : ' far')}"></i>`
                ).join('');
                
                productCard.innerHTML = `
                    <div class="product-badge ${badge}">${badgeText}</div>
                    <div class="product-image">
                        <i class="${product.icon} fa-3x"></i>
                    </div>
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <div class="product-rating">
                            ${starsHTML}
                            <span class="rating-text">(${product.reviews || 0})</span>
                        </div>
                        <div class="product-price">
                            <span class="current-price">${product.price}</span>
                            ${originalPriceHTML}
                        </div>
                        <button class="add-to-cart" onclick="addToCart(${product.id})">
                            <i class="fas fa-cart-plus"></i> Agregar al Carrito
                        </button>
                    </div>
                `;
                
                grid.appendChild(productCard);

                // Animación escalonada
                setTimeout(() => {
                    productCard.style.transition = 'all 0.5s ease';
                    productCard.style.opacity = '1';
                    productCard.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }

        // Agregar al carrito
        function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            const existingItem = cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({...product, quantity: 1});
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            showNotification(`${product.name} agregado al carrito`);
        }

        // Actualizar contador del carrito
        function updateCartCount() {
            const count = cart.reduce((total, item) => total + item.quantity, 0);
            document.getElementById('cartCount').textContent = count;
            
            // Animación del contador
            const cartIcon = document.querySelector('.cart-icon');
            cartIcon.style.transform = 'scale(1.2)';
            setTimeout(() => {
                cartIcon.style.transform = 'scale(1)';
            }, 200);
        }

        // Abrir carrito
        function openCart() {
            displayCartItems();
            document.getElementById('cartModal').style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        // Cerrar carrito
        function cerrarCarrito() {
            document.getElementById('cartModal').style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        // Mostrar items del carrito
        function displayCartItems() {
            const cartItemsContainer = document.getElementById('cartItems');
            const cartTotal = document.getElementById('cartTotal');
            const cartTotalSection = document.getElementById('cartTotalSection');
            const cartActions = document.getElementById('cartActions');
            
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = `
                    <div class="empty-cart">
                        <i class="fas fa-shopping-cart"></i>
                        <h3>Tu carrito está vacío</h3>
                        <p>¡Agrega algunos productos increíbles!</p>
                    </div>
                `;
                cartTotalSection.style.display = 'none';
                cartActions.style.display = 'none';
                return;
            }

            cartTotalSection.style.display = 'block';
            cartActions.style.display = 'flex';
            cartItemsContainer.innerHTML = '';
            let total = 0;

            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <div class="cart-item-price">${item.price}</div>
                    </div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                cartItemsContainer.appendChild(cartItem);
                total += item.price * item.quantity;
            });

            cartTotal.textContent = total.toFixed(2);
        }

        // Actualizar cantidad
        function updateQuantity(productId, change) {
            const item = cart.find(item => item.id === productId);
            if (item) {
                item.quantity += change;
                if (item.quantity <= 0) {
                    removeFromCart(productId);
                    return;
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCount();
                displayCartItems();
            }
        }

        // Eliminar del carrito
        function removeFromCart(productId) {
            cart = cart.filter(item => item.id !== productId);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            displayCartItems();
            
            const product = products.find(p => p.id === productId);
            showNotification(`${product.name} eliminado del carrito`);
        }

        // Vaciar carrito
        function vaciarCarrito() {
            if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
                cart = [];
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCount();
                displayCartItems();
                showNotification('Carrito vaciado');
            }
        }

        // Checkout
        function checkout() {
            if (cart.length === 0) {
                showNotification('El carrito está vacío');
                return;
            }

            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
            
            showNotification(`¡Compra realizada! ${itemCount} productos por ${total.toFixed(2)}`);
            
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            displayCartItems();
            
            setTimeout(() => {
                cerrarCarrito();
            }, 2000);
        }

        // Mostrar notificación
        function showNotification(message) {
            // Remover notificación existente
            const existingNotification = document.querySelector('.notification');
            if (existingNotification) {
                existingNotification.remove();
            }

            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            `;

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.classList.add('hide');
                setTimeout(() => notification.remove(), 500);
            }, 3000);
        }
