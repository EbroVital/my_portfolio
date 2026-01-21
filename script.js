
        // Typed text animation
        const phrases = [
            'Développeur',
            'Spécialiste Laravel & Django',
            'Passionné de Code'
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typedTextElement = document.getElementById('typed-text');
        
        function typeText() {
            const currentPhrase = phrases[phraseIndex];
            
            if (isDeleting) {
                typedTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typedTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
            }
            
            if (!isDeleting && charIndex === currentPhrase.length) {
                setTimeout(() => { isDeleting = true; }, 2000);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
            }
            
            const typingSpeed = isDeleting ? 50 : 100;
            setTimeout(typeText, typingSpeed);
        }
        
        setTimeout(typeText, 1000);

        // Navbar scroll effect
        window.addEventListener('scroll', function() {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Form submission with Formspree
        const form = document.getElementById('contact-form');
        const formStatus = document.getElementById('form-status');
        
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            // Ajoute ton access key Web3Forms ici
            formData.append('access_key', '473089ca-722e-4439-8e1c-ce42329bc540');
            formData.append('from_name', formData.get('name'));
            formData.append('subject', 'Nouveau message depuis ton portfolio');
            
            const button = form.querySelector('button[type="submit"]');
            const originalButtonText = button.innerHTML;
            
            // Change button state
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
            button.disabled = true;
            
            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                if (data.success) {
                    formStatus.className = 'form-status success';
                    formStatus.textContent = '✓ Message envoyé avec succès ! Je vous répondrai sous peu.';
                    form.reset();
                    
                    setTimeout(() => {
                        formStatus.style.display = 'none';
                    }, 5000);
                } else {
                    throw new Error('Erreur lors de l\'envoi');
                }
            } catch (error) {
                formStatus.className = 'form-status error';
                formStatus.textContent = '✗ Erreur lors de l\'envoi. Veuillez réessayer ou me contacter directement par email.';
            } finally {
                button.innerHTML = originalButtonText;
                button.disabled = false;
            }
        });

        // Animate elements on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all cards and sections
        document.querySelectorAll('.skill-category, .project-card, .timeline-item, .stat-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    