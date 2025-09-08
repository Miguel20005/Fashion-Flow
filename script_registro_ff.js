        // Variables globales
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Función para mostrar/ocultar contraseña
        function togglePassword(fieldId) {
            const passwordInput = document.getElementById(fieldId);
            const eyeIcon = document.getElementById(fieldId + 'Eye');
            
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
            
            // Scroll hacia arriba para mostrar el mensaje
            document.querySelector('.register-container').scrollTop = 0;
            
            // Ocultar mensaje después de 5 segundos
            setTimeout(() => {
                errorEl.style.display = 'none';
                successEl.style.display = 'none';
            }, 5000);
        }

        // Función para validar fortaleza de contraseña
        function checkPasswordStrength(password) {
            const strengthEl = document.getElementById('passwordStrength');
            let strength = 0;
            let feedback = '';

            if (password.length >= 8) strength++;
            if (password.match(/[a-z]/)) strength++;
            if (password.match(/[A-Z]/)) strength++;
            if (password.match(/[0-9]/)) strength++;
            if (password.match(/[^a-zA-Z0-9]/)) strength++;

            switch (strength) {
                case 0:
                case 1:
                    feedback = 'Contraseña muy débil';
                    strengthEl.className = 'password-strength strength-weak';
                    break;
                case 2:
                case 3:
                    feedback = 'Contraseña débil';
                    strengthEl.className = 'password-strength strength-medium';
                    break;
                case 4:
                    feedback = 'Contraseña fuerte';
                    strengthEl.className = 'password-strength strength-strong';
                    break;
                case 5:
                    feedback = 'Contraseña muy fuerte';
                    strengthEl.className = 'password-strength strength-strong';
                    break;
            }

            strengthEl.textContent = feedback;
            return strength >= 3;
        }

        // Función para validar campo individual
        function validateField(fieldId, value) {
            const field = document.getElementById(fieldId);
            const feedback = document.getElementById(fieldId + 'Feedback');
            let isValid = true;
            let message = '';

            field.classList.remove('field-error', 'field-success');
            
            switch (fieldId) {
                case 'firstName':
                case 'lastName':
                    if (!value || value.length < 2) {
                        isValid = false;
                        message = 'Debe tener al menos 2 caracteres';
                    }
                    break;
                
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        isValid = false;
                        message = 'Ingresa un correo válido';
                    } else if (users.some(u => u.email === value)) {
                        isValid = false;
                        message = 'Este correo ya está registrado';
                    }
                    break;
                
                case 'phone':
                    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
                    if (!phoneRegex.test(value)) {
                        isValid = false;
                        message = 'Ingresa un teléfono válido';
                    }
                    break;
                
                case 'birthDate':
                    const birthDate = new Date(value);
                    const today = new Date();
                    const age = today.getFullYear() - birthDate.getFullYear();
                    
                    if (age < 13) {
                        isValid = false;
                        message = 'Debes ser mayor de 13 años';
                    } else if (age > 120) {
                        isValid = false;
                        message = 'Ingresa una fecha válida';
                    }
                    break;
                
                case 'password':
                    if (!checkPasswordStrength(value)) {
                        isValid = false;
                        message = 'La contraseña debe tener al menos 8 caracteres, mayúsculas, minúsculas y números';
                    }
                    break;
                
                case 'confirmPassword':
                    const password = document.getElementById('password').value;
                    if (value !== password) {
                        isValid = false;
                        message = 'Las contraseñas no coinciden';
                    }
                    break;
            }

            // Actualizar clase y feedback
            if (isValid && value) {
                field.classList.add('field-success');
                feedback.className = 'field-feedback success';
                feedback.textContent = '✓';
            } else if (!isValid) {
                field.classList.add('field-error');
                feedback.className = 'field-feedback error';
                feedback.textContent = message;
            } else {
                feedback.textContent = '';
            }

            return isValid;
        }

        // Event listeners para validación en tiempo real
        document.addEventListener('DOMContentLoaded', function() {
            const fields = ['firstName', 'lastName', 'email', 'phone', 'birthDate', 'password', 'confirmPassword'];
            
            fields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                field.addEventListener('blur', function() {
                    validateField(fieldId, this.value);
                });
                
                if (fieldId === 'password') {
                    field.addEventListener('input', function() {
                        checkPasswordStrength(this.value);
                        // Revalidar confirmPassword si ya tiene valor
                        const confirmPassword = document.getElementById('confirmPassword');
                        if (confirmPassword.value) {
                            validateField('confirmPassword', confirmPassword.value);
                        }
                    });
                }
                
                if (fieldId === 'confirmPassword') {
                    field.addEventListener('input', function() {
                        validateField(fieldId, this.value);
                    });
                }
            });
            
            updateCartCount();
        });

        // Manejar envío del formulario
        document.getElementById('registerForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = {};
            
            // Recopilar datos del formulario
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            
            // Validar todos los campos
            const fields = ['firstName', 'lastName', 'email', 'phone', 'birthDate', 'gender', 'password', 'confirmPassword'];
            let isFormValid = true;
            
            fields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (!validateField(fieldId, field.value)) {
                    isFormValid = false;
                }
            });
            
            // Verificar términos y condiciones
            if (!document.getElementById('terms').checked) {
                showMessage('Debes aceptar los términos y condiciones');
                return;
            }
            
            if (!isFormValid) {
                showMessage('Por favor corrige los errores en el formulario');
                return;
            }
            
            // Crear usuario
            const newUser = {
                id: users.length + 1,
                name: `${data.firstName} ${data.lastName}`,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                birthDate: data.birthDate,
                gender: data.gender,
                password: data.password,
                newsletter: data.newsletter || false,
                createdAt: new Date().toISOString()
            };
            
            // Guardar usuario
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            showMessage('¡Cuenta creada exitosamente! Serás redirigido al login...', 'success');
            
            // Redireccionar después de 2 segundos
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        });

        // Funciones para mostrar términos y privacidad
        function showTerms() {
            alert('Términos y Condiciones:\n\n1. Al usar StyleHub aceptas nuestros términos de servicio.\n2. Nos comprometemos a proteger tu información personal.\n3. Las compras están sujetas a disponibilidad.\n4. Políticas de devolución aplicables según términos específicos.\n\n(Esta es una versión simplificada para la demo)');
        }

        function showPrivacy() {
            alert('Política de Privacidad:\n\n1. Recopilamos información para mejorar tu experiencia.\n2. No compartimos datos personales con terceros sin consentimiento.\n3. Usamos cookies para personalizar el contenido.\n4. Tienes derecho a solicitar eliminación de tus datos.\n\n(Esta es una versión simplificada para la demo)');
        }

        // Actualizar contador del carrito
        function updateCartCount() {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const count = cart.reduce((total, item) => total + item.quantity, 0);
            document.getElementById('cartCount').textContent = count;
        }

        // Actualizar periódicamente el contador del carrito
        setInterval(updateCartCount, 1000);
