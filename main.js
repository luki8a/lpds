// Hero Slider Functionality con deslizamiento
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del slider
    const sliderContainer = document.querySelector('.slider-container');
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    
    // Variables para el gesto de deslizamiento
    let startX;
    let endX;
    let isDragging = false;
    let threshold = 100; // Cantidad mínima para cambiar slide
    let dragOffset = 0; // Nuevo: para seguimiento de arrastre
    
    // Estado inicial
    let currentSlide = 0;
    let slideInterval;
    let autoPlayEnabled = true;
    
    // Función para asegurar que el contenido esté centrado
    function ensureCentered(slideElement) {
        if (!slideElement) return;
        
        // Asegurar centrado del slide
        slideElement.style.display = 'flex';
        slideElement.style.justifyContent = 'center';
        slideElement.style.alignItems = 'center';
        
        // Asegurar centrado del contenido
        const slideContent = slideElement.querySelector('.slide-content');
        if (slideContent) {
            slideContent.style.margin = '0 auto';
            slideContent.style.maxWidth = '1200px';
            slideContent.style.width = '100%';
        }
    }
    
    // Mostrar slide activo con transición mejorada y centrado
    function showSlide(index, direction = null) {
        // Remover clase active de todos los slides e indicadores
        slides.forEach(slide => {
            slide.classList.remove('active');
            slide.classList.remove('slide-left');
            slide.classList.remove('slide-right');
            
            // Resetear estilos inline
            slide.style.removeProperty('transform');
            slide.style.removeProperty('left');
            slide.style.removeProperty('right');
            slide.style.removeProperty('margin');
        });
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Validar índice
        if (index < 0) {
            currentSlide = slides.length - 1;
        } else if (index >= slides.length) {
            currentSlide = 0;
        } else {
            currentSlide = index;
        }
        
        const slideToShow = slides[currentSlide];
        
        // Asegurarse de que el contenido está centrado incluso durante la animación
        ensureCentered(slideToShow);
        
        // Aplicar clase de dirección si se proporciona
        if (direction === 'left') {
            slideToShow.classList.add('slide-left');
        } else if (direction === 'right') {
            slideToShow.classList.add('slide-right');
        }
        
        // Activar slide actual e indicador después de un corto período
        // para garantizar que las clases de dirección se apliquen primero
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                slideToShow.classList.add('active');
                indicators[currentSlide].classList.add('active');
            });
        });
    }
    
    // Funciones para cambiar slides
    function prevSlide() {
        showSlide(currentSlide - 1, 'left');
    }
    
    function nextSlide() {
        showSlide(currentSlide + 1, 'right');
    }
    
    // Función para iniciar el intervalo automático
    function startSlideInterval() {
        if (autoPlayEnabled) {
            slideInterval = setInterval(nextSlide, 5000);
        }
    }
    
    // Función para resetear el intervalo
    function resetSlideInterval() {
        clearInterval(slideInterval);
        startSlideInterval();
    }
      // Eventos para deslizamiento táctil con mejor centrado
    sliderContainer.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        dragOffset = 0;
        autoPlayEnabled = false; // Detener autoplay cuando el usuario interactúa
        clearInterval(slideInterval);
        
        // Asegurar centrado del slide actual
        const activeSlide = document.querySelector('.slide.active');
        ensureCentered(activeSlide);
    }, { passive: true });
    
    sliderContainer.addEventListener('touchmove', function(e) {
        if (!startX) return;
        endX = e.touches[0].clientX;
        dragOffset = endX - startX;
        
        // Si es un arrastre significativo, podríamos aplicar una transformación visual suave
        if (Math.abs(dragOffset) > 20) {
            const activeSlide = document.querySelector('.slide.active');
            if (activeSlide) {
                // Movimiento sutil durante el arrastre, pero mantiene el centrado
                const limitedOffset = dragOffset * 0.3; // Limitamos el movimiento para que sea sutil
                activeSlide.style.transform = `translateX(${limitedOffset}px)`;
            }
        }
    }, { passive: true });
    
    sliderContainer.addEventListener('touchend', function(e) {
        if (!startX || !endX) return;
        
        const diffX = startX - endX;
        
        // Restaurar la posición del slide actual si no llegamos al umbral
        const activeSlide = document.querySelector('.slide.active');
        if (activeSlide) {
            activeSlide.style.transform = '';
        }
        
        // Cambiar slide si la distancia es suficiente
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                nextSlide(); // Deslizar a la izquierda = siguiente slide
            } else {
                prevSlide(); // Deslizar a la derecha = slide anterior
            }
        }
        
        // Reiniciar variables
        startX = null;
        endX = null;
        dragOffset = 0;
    }, { passive: true });
    
    // Eventos para deslizamiento con mouse con mejor centrado
    sliderContainer.addEventListener('mousedown', function(e) {
        startX = e.clientX;
        isDragging = true;
        dragOffset = 0;
        autoPlayEnabled = false; // Detener autoplay cuando el usuario interactúa
        clearInterval(slideInterval);
        
        // Asegurar centrado del slide actual
        const activeSlide = document.querySelector('.slide.active');
        ensureCentered(activeSlide);
        
        e.preventDefault();
    });
    
    sliderContainer.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        endX = e.clientX;
        dragOffset = endX - startX;
        
        // Si es un arrastre significativo, podríamos aplicar una transformación visual suave
        if (Math.abs(dragOffset) > 20) {
            const activeSlide = document.querySelector('.slide.active');
            if (activeSlide) {
                // Movimiento sutil durante el arrastre, pero mantiene el centrado
                const limitedOffset = dragOffset * 0.3; // Limitamos el movimiento para que sea sutil
                activeSlide.style.transform = `translateX(${limitedOffset}px)`;
            }
        }
        
        e.preventDefault();
    });
    
    sliderContainer.addEventListener('mouseup', function(e) {
        if (!isDragging) return;
        
        const diffX = startX - endX;
        
        // Restaurar la posición del slide actual si no llegamos al umbral
        const activeSlide = document.querySelector('.slide.active');
        if (activeSlide) {
            activeSlide.style.transform = '';
        }
        
        // Cambiar slide si la distancia es suficiente
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                nextSlide(); // Arrastrar a la izquierda = siguiente slide
            } else {
                prevSlide(); // Arrastrar a la derecha = slide anterior
            }
        }
        
        // Reiniciar variables
        isDragging = false;
        startX = null;
        endX = null;
        dragOffset = 0;
    });
    
    // Cancelar el arrastre si el mouse sale del slider
    sliderContainer.addEventListener('mouseleave', function() {
        if (isDragging) {
            const activeSlide = document.querySelector('.slide.active');
            if (activeSlide) {
                activeSlide.style.transform = '';
            }
            
            isDragging = false;
            startX = null;
            endX = null;
            dragOffset = 0;
        }
    });
    
    // Configurar los indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            showSlide(index);
            resetSlideInterval();
        });
    });
    
    // Inicializar el slider
    showSlide(0);
    startSlideInterval();
});

// Funcionalidad para secciones de servicios
document.addEventListener('DOMContentLoaded', function() {
    // Para el botón CTA "Descubrí más servicios"
    const serviciosCta = document.getElementById('servicios-cta');
    if (serviciosCta) {
        serviciosCta.addEventListener('click', function() {
            // Simular carga de más servicios
            alert('¡Pronto agregaremos más servicios! Visita nuestras sucursales para conocer más.');
        });
    }

    // Mejorar las animaciones para las secciones de servicios
    const servicioCards = document.querySelectorAll('.servicio-card');
    const pagoItems = document.querySelectorAll('.pagos-list li');
    const colectivoCards = document.querySelectorAll('.colectivo-card');
    
    // Función para animar elementos secuencialmente
    function animateElementsSequentially(elements, delayBetween = 150) {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        // Añadir un retraso secuencial para cada elemento
                        setTimeout(() => {
                            entry.target.classList.add('visible');
                        }, index * delayBetween);
                        
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.2,
                rootMargin: '0px 0px -50px 0px'
            });

            elements.forEach(element => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                observer.observe(element);
            });
        }
    }

    // Aplicar animaciones secuenciales
    animateElementsSequentially(servicioCards);
    animateElementsSequentially(pagoItems, 100);
    animateElementsSequentially(colectivoCards, 200);
      // Añadir estilos para la animación
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .visible {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
              @keyframes subtle-pulse {
                0% { box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08); }
                50% { box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15); }
                100% { box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08); }
            }
            
            .servicio-card.visible {
                animation: subtle-pulse 4s ease-in-out infinite;
                animation-delay: 1s;
            }
            
            .servicio-card.visible:hover {
                animation-play-state: paused;
            }
        </style>
    `);

    // Efecto mejorado para los medios de pago
    pagoItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.pago-icon');
            icon.style.transform = 'scale(1.2) rotate(10deg)';
            icon.style.transition = 'transform 0.3s ease';
        });

        item.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.pago-icon');
            icon.style.transform = 'scale(1) rotate(0)';
        });
    });

    // Efecto para los botones CTA
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('mouseover', function() {
            this.style.transition = 'all 0.3s ease';
            this.style.transform = 'translateY(-3px)';
        });
        
        button.addEventListener('mouseout', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Kiosco Cards Animation
document.addEventListener('DOMContentLoaded', function() {
    // Elementos de las tarjetas de kioscos
    const kioscoCards = document.querySelectorAll('.kiosco-card');
    
    // Función para animar las tarjetas al hacer scroll
    function animateKioscoCards() {
        // Usar IntersectionObserver para detectar cuando las tarjetas son visibles
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.2,
                rootMargin: '0px 0px -50px 0px'
            });

            // Observar todas las tarjetas
            kioscoCards.forEach(card => {
                observer.observe(card);
            });
        } else {
            // Fallback para navegadores que no soportan IntersectionObserver
            kioscoCards.forEach(card => {
                card.classList.add('visible');
            });
        }
    }

    // Añadir estilos de animación para las tarjetas
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .kiosco-card {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            .kiosco-card.visible {
                opacity: 1;
                transform: translateY(0);
            }
            
            @media (prefers-reduced-motion: reduce) {
                .kiosco-card {
                    transition: none;
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        </style>
    `);

    // Iniciar animaciones
    animateKioscoCards();
    
    // Agregar interactividad a los features de los kioscos
    const features = document.querySelectorAll('.feature');
    features.forEach(feature => {
        feature.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
            this.style.transform = 'scale(1.05)';
            this.style.backgroundColor = 'rgba(153, 204, 0, 0.2)';
        });
        
        feature.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.backgroundColor = 'rgba(153, 204, 0, 0.1)';
        });
    });
});

// Navegación responsive
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del navbar
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');
    
    // Función para toggle del menú
    function toggleMenu() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    }
    
    // Event listener para el botón de hamburguesa
    if (navToggle) {
        navToggle.addEventListener('click', toggleMenu);
    }
    
    // Cerrar el menú al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
    
    // Cambiar estilo del navbar al hacer scroll
    function scrollFunction() {
        if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    // Event listener para el scroll
    window.addEventListener('scroll', scrollFunction);
    
    // Añadir la clase 'no-scroll' al body cuando el menú está activo
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .no-scroll {
                overflow: hidden;
            }
        </style>
    `);
});
