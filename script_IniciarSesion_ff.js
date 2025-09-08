        // Variables globales
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Función para mostrar/ocultar contraseña
        function togglePassword() {
            const passwordInput = document.getElementById('password');
            const eyeIcon = document.getElementById('eyeIcon');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                eyeIcon.classList.remove('fa-eye');
                eyeIcon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                eyeIcon.classList.remove('fa-eye-slash');
                eyeIcon.classList.add('fa-eye');
            }
        }

        // Función para mostrar mensajes
        function showMessage(message, type = 'error') {
            const errorEl = document.getElementById('errorMessage');
            const successEl = document.getElementById('successMessage');
            
            // Ocultar ambos mensajes
            errorEl.style.display = 'none';
            successEl.style.display = 'none';
            
            // Mostrar el mensaje correspondiente
            if (type === 'error') {
                errorEl.textContent = message;
                errorEl.style.display = 'block';
            } else {
                successEl.textContent = message;
                successEl.style.display = 'block';
            }
            
            // Ocultar mensaje después de 5 segundos
            setTimeout(() => {
                errorEl.style.display = 'none';
                successEl.style.display = 'none';
            }, 5000);
        }

        // Manejar envío del formulario
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember').checked;
            
            // Validación básica
            if (!email || !password) {
                showMessage('Por favor completa todos los campos');
                return;
            }
            
            // Buscar usuario
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Login exitoso
                const sessionData = {
                    userId: user.id,
                    email: user.email,
                    name: user.name,
                    loginTime: new Date().toISOString()
                };
                
                // Guardar sesión
                if (remember) {
                    localStorage.setItem('userSession', JSON.stringify(sessionData));
                } else {
                    sessionStorage.setItem('userSession', JSON.stringify(sessionData));
                }
                
                showMessage('¡Inicio de sesión exitoso! Redirigiendo...', 'success');
                
                // Redireccionar después de 2 segundos
                setTimeout(() => {
                    window.location.href = 'productos.html';
                }, 2000);
                
            } else {
                showMessage('Credenciales incorrectas. Verifica tu email y contraseña.');
            }
        });

        // Función para recuperar contraseña
        function forgotPassword() {
            const email = prompt('Ingresa tu correo electrónico para recuperar la contraseña:');
            
            if (email) {
                const user = users.find(u => u.email === email);
                
                if (user) {
                    showMessage('Se ha enviado un enlace de recuperación a tu correo electrónico', 'success');
                } else {
                    showMessage('No se encontró una cuenta con ese correo electrónico');
                }
            }
        }

        // Actualizar contador del carrito
        function updateCartCount() {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const count = cart.reduce((total, item) => total + item.quantity, 0);
            document.getElementById('cartCount').textContent = count;
        }

        // Cargar contador al iniciar
        document.addEventListener('DOMContentLoaded', function() {
            updateCartCount();
            
            // Verificar si ya hay una sesión activa
            const session = localStorage.getItem('userSession') || sessionStorage.getItem('userSession');
            if (session) {
                const userData = JSON.parse(session);
                showMessage(`Ya tienes una sesión activa como ${userData.name}`, 'success');
            }
        });

        // Actualizar periódicamente el contador del carrito
        setInterval(updateCartCount, 1000);
