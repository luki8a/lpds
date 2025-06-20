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
    }    // Mejorar las animaciones para las secciones de servicios    const servicioCards = document.querySelectorAll('.servicio-card');
    const pagoItems = document.querySelectorAll('.pago-item');
    
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
    }    // Aplicar animaciones secuenciales
    animateElementsSequentially(servicioCards);
    animateElementsSequentially(pagoItems, 100);
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



// Mapa interactivo moderno
document.addEventListener('DOMContentLoaded', function() 
    // Verificar si la sección de mapa existe
    const mapaInteractivo = document.getElementById('mapa-interactivo');
    if (!mapaInteractivo) return;

    // Cargar el script de Google Maps API
    const mapScript = document.createElement('script');
    mapScript.src = 'https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap';
    mapScript.defer = true;
    mapScript.async = true;
    
    // Definir coordenadas de los kioscos
    const locations = [
        {
            id: 1,
            title: "La Parada del Sol 1",
            address: "Av. Rodríguez Peña 4706, B1672 Villa Lynch, Provincia de Buenos Aires",
            position: { lat: -34.5753, lng: -58.4818 }, // villa lynch
            url: "https://www.google.com/maps?sca_esv=df20c8600aa448fe&output=search&q=la+parada+del+sol",
            color: "#4CAF50" // Verde para Villa Devoto
        },
        {
            id: 2,
            title: "La Parada del Sol 2",
            address: "Santiago Bonifacini 3795, B1676 Santos Lugares, Provincia de Buenos Aires",
            position: { lat: -34.5895, lng: -58.4835 }, // Villa del Parque
            url: "https://www.google.com/maps/place/La+parada+del+sol+2/@-34.6000657,-58.5505683,17z/data=!3m1!4b1!4m6!3m5!1s0x95bcb72ef7db9051:0xdd8247c6c2993d5e!8m2!3d-34.6000701!4d-58.5479934!16s%2Fg%2F11ycbbrgm2?entry=ttu&g_ep=EgoyMDI1MDYxNy4wIKXMDSoASAFQAw%3D%3D",
            color: "#2196F3" // Azul para Villa del Parque
        },
        {
            id: 3,
            title: "La Parada del Sol 3",
            address: "Dr. Amadeo Sabattini 4251, B1676BAI Caseros, 1675 Santos Lugares, Provincia de Buenos Aires",
            position: { lat: -34.5710, lng: -58.4954 }, // Villa Pueyrredón
            url: "https://www.google.com/maps/place/La+Parada+Del+Sol+3+Kiosco+24+hs/@-34.6024568,-58.5577301,17z/data=!3m1!4b1!4m6!3m5!1s0x95bcb9aaee09fac9:0x3b494a6a98261f25!8m2!3d-34.6024612!4d-58.5551552!16s%2Fg%2F11w_ns6by7?entry=ttu&g_ep=EgoyMDI1MDYxNy4wIKXMDSoASAFQAw%3D%3D",
            color: "#FF9800" // Naranja para Villa Pueyrredón
        },
        {
            id: 4,
            title: "La Parada del Sol 4",
            address: "Av. Rivadavia 4800, Agronomía",
            position: { lat: -34.5865, lng: -58.5087 }, // Agronomía
            url: "https://maps.google.com?q=kiosco+caballito+rivadavia+4800+buenos+aires",
            color: "#F44336" // Rojo para Agronomía
        }
    ];
    
        // Elimina la duplicación del código y mantén solo una versión
    
    // Mapa interactivo moderno - Versión corregida
    document.addEventListener('DOMContentLoaded', function() {
        // Verificar si la sección de mapa existe (buscar tanto mapa-interactivo como otros posibles IDs)
        const mapaContainer = document.getElementById('mapa-interactivo') || 
                              document.querySelector('.map-container') || 
                              document.querySelector('.mapa-wrapper');
        
        if (!mapaContainer) {
            console.error('No se encontró el contenedor del mapa');
            return;
        }
        
        // Definir coordenadas de los kioscos
        const locations = [
            {
                id: 1,
                title: "La Parada del Sol 1",
                address: "Av. Rodríguez Peña 4706, B1672 Villa Lynch, Provincia de Buenos Aires",
                position: { lat: -34.5753, lng: -58.4818 }, // Villa Lynch
                url: "https://www.google.com/maps?sca_esv=df20c8600aa448fe&output=search&q=la+parada+del+sol",
                color: "#4CAF50", // Verde para Villa Lynch
                barrio: "Villa Lynch"
            },
            {
                id: 2,
                title: "La Parada del Sol 2",
                address: "Santiago Bonifacini 3795, B1676 Santos Lugares, Provincia de Buenos Aires",
                position: { lat: -34.5895, lng: -58.4835 }, // Santos Lugares
                url: "https://www.google.com/maps/place/La+parada+del+sol+2/@-34.6000657,-58.5505683,17z/data=!3m1!4b1!4m6!3m5!1s0x95bcb72ef7db9051:0xdd8247c6c2993d5e!8m2!3d-34.6000701!4d-58.5479934!16s%2Fg%2F11ycbbrgm2",
                color: "#2196F3", // Azul para Santos Lugares
                barrio: "Santos Lugares"
            },
            {
                id: 3,
                title: "La Parada del Sol 3",
                address: "Dr. Amadeo Sabattini 4251, B1676BAI Caseros, 1675 Santos Lugares, Provincia de Buenos Aires",
                position: { lat: -34.5710, lng: -58.4954 }, // Caseros
                url: "https://www.google.com/maps/place/La+Parada+Del+Sol+3+Kiosco+24+hs/@-34.6024568,-58.5577301,17z/data=!3m1!4b1!4m6!3m5!1s0x95bcb9aaee09fac9:0x3b494a6a98261f25!8m2!3d-34.6024612!4d-58.5551552!16s%2Fg%2F11w_ns6by7",
                color: "#FF9800", // Naranja para Caseros
                barrio: "Caseros"
            },
            {
                id: 4,
                title: "La Parada del Sol 4",
                address: "Av. Rivadavia 4800, Agronomía",
                position: { lat: -34.5865, lng: -58.5087 }, // Agronomía
                url: "https://maps.google.com?q=kiosco+caballito+rivadavia+4800+buenos+aires",
                color: "#F44336", // Rojo para Agronomía
                barrio: "Agronomía"
            }
        ];
        
        // Mostrar directamente la alternativa con iframe para no depender de la API KEY
        mostrarMapaAlternativo();
        
        // Función para mostrar un iframe con Google Maps
        function mostrarMapaAlternativo() {
            // Crear iframe con mapa embebido centrado en las coordenadas de los kioscos
            const centerLat = -34.5827;
            const centerLng = -58.4932;
            
            mapaContainer.innerHTML = `
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d26284.73197913275!2d-58.49821123863535!3d-34.58271035732748!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1skiosco%20la%20parada%20del%20sol!5e0!3m2!1ses-419!2sar!4v1687911234567!5m2!1ses-419!2sar"
                    width="100%" 
                    height="100%" 
                    style="border:0;" 
                    allowfullscreen="" 
                    loading="lazy" 
                    referrerpolicy="no-referrer-when-downgrade"
                    title="Ubicaciones de kioscos La Parada del Sol en Buenos Aires">
                </iframe>
            `;
            
            // Añadir marcadores con un overlay HTML
            const markerOverlay = document.createElement('div');
            markerOverlay.className = 'marker-overlay';
            markerOverlay.style.position = 'absolute';
            markerOverlay.style.top = '0';
            markerOverlay.style.left = '0';
            markerOverlay.style.width = '100%';
            markerOverlay.style.height = '100%';
            markerOverlay.style.pointerEvents = 'none';
            
            // Agregar el overlay al contenedor del mapa
            mapaContainer.style.position = 'relative';
            mapaContainer.appendChild(markerOverlay);
            
            // Activar los puntos de ruta para simular interactividad
            document.querySelectorAll('.ruta-punto').forEach((punto, index) => {
                punto.addEventListener('click', function() {
                    // Eliminar clase active de todos los puntos
                    document.querySelectorAll('.ruta-punto').forEach(p => {
                        p.classList.remove('active');
                    });
                    // Agregar clase active al punto clickeado
                    this.classList.add('active');
                });
            });
        }
        
        // Evento para los puntos de la ruta superior
        document.querySelectorAll('.ruta-punto').forEach((punto, index) => {
            punto.addEventListener('click', function() {
                // Seleccionar todos los puntos y remover la clase active
                document.querySelectorAll('.ruta-punto').forEach(p => {
                    p.classList.remove('active');
                });
                // Añadir clase active al punto actual
                this.classList.add('active');
                
                // Si existe tooltip, mostrarlo
                const tooltips = document.querySelectorAll('.mapa-tooltip');
                if (tooltips.length > 0) {
                    tooltips.forEach(tooltip => {
                        tooltip.classList.remove('active');
                    });
                    const tooltip = document.getElementById(`tooltip-${index + 1}`);
                    if (tooltip) {
                        tooltip.classList.add('active');
                    }
                }
            });
        });
    });
// Animación de entrada para elementos de pago
document.addEventListener('DOMContentLoaded', function() {
    const pagoItems = document.querySelectorAll('.pago-item');
    
    // Función para animar los elementos cuando entran en el viewport
    function animatePagoItems() {
        pagoItems.forEach(item => {
            if (isElementInViewport(item) && !item.classList.contains('animated')) {
                const delay = parseInt(item.getAttribute('data-aos-delay') || 0);
                setTimeout(() => {
                    item.classList.add('animated');
                }, delay);
            }
        });
    }
    
    // Comprobar si un elemento está en el viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0 &&
            rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
            rect.right >= 0
        );
    }
    
    // Añadir evento de scroll
    window.addEventListener('scroll', animatePagoItems);
    
    // Iniciar animación en la carga
    animatePagoItems();
});