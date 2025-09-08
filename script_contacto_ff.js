        // FAQ Functionality
        document.addEventListener('DOMContentLoaded', function() {
            const faqQuestions = document.querySelectorAll('.faq-question');
            
            faqQuestions.forEach(question => {
                question.addEventListener('click', function() {
                    const answer = this.nextElementSibling;
                    const isActive = this.classList.contains('active');
                    
                    // Cerrar todas las preguntas
                    faqQuestions.forEach(q => {
                        q.classList.remove('active');
                        q.nextElementSibling.classList.remove('active');
                    });
                    
                    // Abrir la pregunta clickeada si no estaba activa
                    if (!isActive) {
                        this.classList.add('active');
                        answer.classList.add('active');
                    }
                });
            });
            
            updateCartCount();
        });

        // Contact Form Functionality
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = {};
            
            // Recopilar datos del formulario
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            
            // Validación básica
            if (!data.firstName || !data.lastName || !data.email || !data.subject || !data.message) {
                showMessage('Por favor completa todos los campos obligatorios', 'error');
                return;
            }
            
            // Simular envío del formulario
            showMessage('', 'success');
            
            // Limpiar formulario
            this.reset();
            
            // Guardar consulta (simulado)
            const consultation = {
                id: Date.now(),
                ...data,
                date: new Date().toISOString(),
                status: 'pending'
            };
            
            // En una aplicación real, aquí enviarías los datos al servidor
            console.log('Consulta enviada:', consultation);
        });

        // Function to show messages
        function showMessage(message, type) {
            const successMsg = document.getElementById('successMessage');
            const errorMsg = document.getElementById('errorMessage');
            
            // Ocultar ambos mensajes
            successMsg.style.display = 'none';
            errorMsg.style.display = 'none';
            
            if (type === 'success') {
                successMsg.style.display = 'block';
            } else if (type === 'error') {
                errorMsg.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
                errorMsg.style.display = 'block';
            }
            
            // Scroll to top of form
            document.querySelector('.contact-form').scrollIntoView({ behavior: 'smooth' });
            
            // Hide message after 5 seconds
            setTimeout(() => {
                successMsg.style.display = 'none';
                errorMsg.style.display = 'none';
            }, 5000);
        }

        // Update cart count
        function updateCartCount() {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const count = cart.reduce((total, item) => total + item.quantity, 0);
            document.getElementById('cartCount').textContent = count;
        }

        // Update cart count periodically
        setInterval(updateCartCount, 1000);
