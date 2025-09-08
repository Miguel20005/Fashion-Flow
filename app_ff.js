
        // Datos de productos
        const products = [
            {
                id: 1,
                name: "Camisa Elegante",
                category: "camisas",
                price: 45.990,
                description: "Camisa formal de algodón premium",
                icon: "fas fa-shirt"
            },
            {
                id: 2,
                name: "Pantalón Casual",
                category: "pantalones",
                price: 59.990,
                description: "Pantalón cómodo para el día a día",
                icon: "fas fa-person"
            },
            {
                id: 3,
                name: "Zapatos Deportivos",
                category: "zapatos",
                price: 89.990,
                description: "Zapatillas de alta calidad",
                icon: "fas fa-shoe-prints"
            },
            {
                id: 4,
                name: "Reloj Moderno",
                category: "accesorios",
                price: 129.990,
                description: "Reloj elegante y funcional",
                icon: "fas fa-clock"
            },
            {
                id: 5,
                name: "Camisa Casual",
                category: "camisas",
                price: 35.990,
                description: "Camisa informal de manga corta",
                icon: "fas fa-shirt"
            },
            {
                id: 6,
                name: "Jeans Premium",
                category: "pantalones",
                price: 79.990,
                description: "Jeans de mezclilla de alta calidad",
                icon: "fas fa-person"
            }
        ];

        // Variables globales
        let cart = [];
        let filteredProducts = products;

        // Inicialización
        document.addEventListener('DOMContentLoaded', function() {
            displayProducts(products);
            setupEventListeners();
            animateOnScroll();
        });

        // Event Listeners
        function setupEventListeners() {
            // Filtros
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    
                    const category = this.dataset.category;
                    filteredProducts = category === 'all' ? products : products.filter(p => p.category === category);
                    displayProducts(filteredProducts);
                });
            });

            // Carrito
            document.querySelector('.cart-icon').addEventListener('click', openCart);
            document.querySelector('.close').addEventListener('click', closeCart);
            
            // Cerrar modal al hacer click fuera
            window.addEventListener('click', function(e) {
                const modal = document.getElementById('cartModal');
                if (e.target === modal) {
                    closeCart();
                }
            });

            // Scroll suave para navegación
            document.querySelectorAll('.nav a').forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            });
        }

        // Mostrar productos
        function displayProducts(productsToShow) {
            const grid = document.getElementById('productsGrid');
            grid.innerHTML = '';

            productsToShow.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.style.opacity = '0';
                productCard.style.transform = 'translateY(20px)';
                
                productCard.innerHTML = `
                    <div class="product-image">
                        <i class="${product.icon} fa-3x"></i>
                    </div>
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="product-price">$${product.price}</div>
                    <button class="add-to-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Agregar al Carrito
                    </button>
                `;
                
                grid.appendChild(productCard);

                // Animación de aparición
                setTimeout(() => {
                    productCard.style.transition = 'all 0.5s ease';
                    productCard.style.opacity = '1';
                    productCard.style.transform = 'translateY(0)';
                }, Math.random() * 200);
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

            updateCartCount();
            showNotification('Producto agregado al carrito');
        }

        // Actualizar contador del carrito
        function updateCartCount() {
            const count = cart.reduce((total, item) => total + item.quantity, 0);
            document.querySelector('.cart-count').textContent = count;
            
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
        }

        // Cerrar carrito
        function closeCart() {
            document.getElementById('cartModal').style.display = 'none';
        }

        // Mostrar items del carrito
        function displayCartItems() {
            const cartItemsContainer = document.getElementById('cartItems');
            const cartTotal = document.getElementById('cartTotal');
            
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p>El carrito está vacío</p>';
                cartTotal.textContent = '0';
                return;
            }

            cartItemsContainer.innerHTML = '';
            let total = 0;

            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div>
                        <h4>${item.name}</h4>
                        <p>$${item.price} x ${item.quantity}</p>
                    </div>
                    <div>
                        <button onclick="removeFromCart(${item.id})" style="background: #ff4757; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItem);
                total += item.price * item.quantity;
            });

            cartTotal.textContent = total.toFixed(2);
        }

        // Eliminar del carrito
        function removeFromCart(productId) {
            cart = cart.filter(item => item.id !== productId);
            updateCartCount();
            displayCartItems();
            showNotification('Producto eliminado del carrito');
        }

        // Vaciar carrito
        function clearCart() {
            cart = [];
            updateCartCount();
            displayCartItems();
            showNotification('Carrito vaciado');
        }

        // Checkout
        function checkout() {
            if (cart.length === 0) {
                showNotification('El carrito está vacío');
                return;
            }

            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            showNotification(`¡Compra realizada! Total: $${total.toFixed(2)}`);
            clearCart();
            closeCart();
        }

        // Mostrar notificación
        function showNotification(message) {
            const notification = document.createElement('div');
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: linear-gradient(45deg, #667eea, #764ba2);
                color: white;
                padding: 15px 25px;
                border-radius: 25px;
                z-index: 3000;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                animation: slideInRight 0.5s ease;
            `;

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.animation = 'slideOutRight 0.5s ease';
                setTimeout(() => notification.remove(), 500);
            }, 3000);
        }

        // Scroll suave a productos
        function scrollToProducts() {
            document.getElementById('productos').scrollIntoView({ behavior: 'smooth' });
        }

        // Animaciones en scroll
        function animateOnScroll() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                    }
                });
            });

            document.querySelectorAll('.product-card, .footer-section').forEach(el => {
                observer.observe(el);
            });
        }

        // Añadir animaciones CSS adicionales
        const additionalStyles = `
            @keyframes slideInRight {
                from { transform: translateX(300px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(300px); opacity: 0; }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = additionalStyles;
        document.head.appendChild(styleSheet);


