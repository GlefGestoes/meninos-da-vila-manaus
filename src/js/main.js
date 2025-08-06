// --- JAVASCRIPT DO MENU FLUTUANTE ---
const menuToggle = document.getElementById('menu-toggle');
const floatingNav = document.getElementById('floating-nav');
const navItems = document.querySelectorAll('.nav-item');

menuToggle.addEventListener('click', (event) => {
    event.stopPropagation(); 
    floatingNav.classList.toggle('menu-active');
});

navItems.forEach(item => {
    item.addEventListener('click', () => {
        floatingNav.classList.remove('menu-active');
    });
});

document.addEventListener('click', (event) => {
    const isClickInsideMenu = floatingNav.contains(event.target);
    const isMenuOpen = floatingNav.classList.contains('menu-active');

    if (isMenuOpen && !isClickInsideMenu) {
        floatingNav.classList.remove('menu-active');
    }
});


// --- CÓDIGO DA ANIMAÇÃO 3D ---
let scene, camera, renderer, particles;
let time = 0;
const colors = [0x000000, 0xFFFFFF];

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 4;
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    document.getElementById('canvas-container').appendChild(renderer.domElement);
    createSoccerBall();
    window.addEventListener('resize', onWindowResize);
}

function createSoccerBall() {
    const particleCount = 8000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const radius = 2;
    const particleColors = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
        const phi = Math.acos(-1 + (2 * i) / particleCount);
        const theta = Math.sqrt(particleCount * Math.PI) * phi;
        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(phi);
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        const isPentagon = (i % 12 < 5);
        const color = new THREE.Color(isPentagon ? colors[1] : colors[0]);
        particleColors[i * 3] = color.r;
        particleColors[i * 3 + 1] = color.g;
        particleColors[i * 3 + 2] = color.b;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    const material = new THREE.PointsMaterial({
        size: 0.035,
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        map: createStarTexture(),
        depthWrite: false,
        opacity: 0.9
    });
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

function createStarTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.5)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

function animate() {
    requestAnimationFrame(animate);
    time += 0.01;
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
    if(particles) {
        particles.rotation.y += 0.002;
        particles.rotation.x = scrollPercent * Math.PI * 0.5;
    }
    renderer.render(scene, camera);
}

// Inicializa tudo quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    init();
    animate();
});

// Slaid de telas

// --- SLIDESHOW PARA A SEÇÃO 1 ---
document.addEventListener('DOMContentLoaded', function() {
    const section1 = document.getElementById('secao-1');
    if (!section1) return;

    // Cria o container para as imagens de fundo
    const bgContainer = document.createElement('div');
    bgContainer.className = 'background-images';
    
    // Move as imagens para dentro do container de fundo
    const images = section1.querySelectorAll('.section-image');
    images.forEach(img => {
        img.classList.remove('section-image');
        img.classList.add('background-image');
        bgContainer.appendChild(img);
    });
    
    // Insere o container de fundo no início da seção
    section1.insertBefore(bgContainer, section1.firstChild);
    
    // Configura o slideshow
    const bgImages = bgContainer.querySelectorAll('.background-image');
    if (bgImages.length < 1) return;
    
    let currentIndex = 0;
    bgImages[currentIndex].classList.add('active');
    
    function nextSlide() {
        bgImages[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % bgImages.length;
        bgImages[currentIndex].classList.add('active');
    }
    
    // Inicia o slideshow com intervalo de 5 segundos
    if (bgImages.length > 1) {
        setInterval(nextSlide, 5000);
    }
    
    // Ajusta o tamanho das imagens
    function resizeImages() {
        bgImages.forEach(img => {
            const sectionHeight = section1.offsetHeight;
            img.style.maxHeight = `${sectionHeight * 0.8}px`;
        });
    }
    
    window.addEventListener('load', resizeImages);
    window.addEventListener('resize', resizeImages);
    resizeImages();
});

// --- Slideshow com Zoom para o Header - início---
// --- Slideshow com Zoom para o Header - Corrigido ---
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.header-slideshow .slide');
    if (slides.length === 0) return;
    
    let currentIndex = 0;
    const slideDuration = 5000; // 5 segundos por slide
    let slideInterval;
    
    function showSlide(index) {
        // Remove a classe active de todos os slides
        slides.forEach(slide => slide.classList.remove('active'));
        
        // Adiciona a classe active ao slide atual
        slides[index].classList.add('active');
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    }
    
    function startSlideshow() {
        showSlide(currentIndex);
        if (slides.length > 1) {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, slideDuration);
        }
    }
    
    // Inicia o slideshow
    startSlideshow();
    
    // Reinicia o slideshow quando o usuário interage com a página
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            startSlideshow();
        }
    });
    
    // Ajusta o tamanho do slideshow quando a janela for redimensionada
    function resizeSlideshow() {
        const header = document.querySelector('header');
        const slideshow = document.querySelector('.header-slideshow');
        if (header && slideshow) {
            slideshow.style.height = `${header.offsetHeight}px`;
        }
    }
    
    window.addEventListener('load', resizeSlideshow);
    window.addEventListener('resize', resizeSlideshow);
    resizeSlideshow();
});

// Ajusta dinamicamente a posição das imagens baseado na proporção
function adjustImagePositions() {
    const slides = document.querySelectorAll('.header-slideshow .slide');
    const header = document.querySelector('header');
    
    slides.forEach(slide => {
        const img = new Image();
        img.src = slide.style.backgroundImage.replace('url("', '').replace('")', '');
        
        img.onload = function() {
            const imgRatio = img.width / img.height;
            const headerRatio = header.offsetWidth / header.offsetHeight;
            
            // Se a imagem for mais larga que o header, ajusta para mostrar o topo
            if (imgRatio > headerRatio) {
                slide.style.backgroundPosition = 'center top';
            } else {
                slide.style.backgroundPosition = 'center center';
            }
        };
    });
}

// Executa ao carregar e ao redimensionar
window.addEventListener('load', adjustImagePositions);
window.addEventListener('resize', adjustImagePositions);

// --- Slideshow com Zoom para o Header - fim ---

// --- Calendário - início ---

document.addEventListener('DOMContentLoaded', function() {
    // 1. Efeito de hover nos cards (substitui o :hover do CSS para maior controle)
    const mesCards = document.querySelectorAll('#secao-2 .mes-card');
    
    mesCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.querySelector('.mes-header').style.backgroundColor = '#FFD700';
            card.querySelector('.mes-header').style.color = '#000';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.querySelector('.mes-header').style.backgroundColor = '#000';
            card.querySelector('.mes-header').style.color = '#FFD700';
        });
    });

    // 2. Botão "Ver Calendário Completo" (exemplo de ação)
    const calendarioButton = document.querySelector('#secao-2 .calendario-button');
    
    calendarioButton.addEventListener('click', () => {
        alert('Redirecionar para uma página com o calendário detalhado ou abrir um modal.');
        // Exemplo prático: window.location.href = '/calendario-completo';
    });
});

    // Interatividade com hover
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.mes-card');
        
     cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.borderColor = this.querySelector('.mes-header').style.getPropertyValue('--mes-cor');
        });
            
        card.addEventListener('mouseleave', function() {
            this.style.borderColor = '#000';
        });
    });
});

// --- Calendário - fim ---

// --- Jogadores - Início ---

    document.addEventListener('DOMContentLoaded', function() {
        const carrossel = document.querySelector('.carrossel-horizontal');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const jogadores = document.querySelectorAll('.jogador');
        
        // Controles de navegação
        nextBtn.addEventListener('click', () => {
            carrossel.scrollBy({ left: 200, behavior: 'smooth' });
        });
        
        prevBtn.addEventListener('click', () => {
            carrossel.scrollBy({ left: -200, behavior: 'smooth' });
        });
        
        // Rolagem automática
        let autoScroll = setInterval(() => {
            if (isElementInViewport(carrossel)) {
                carrossel.scrollBy({ left: 200, behavior: 'smooth' });
                
                // Verifica se chegou ao final
                if (carrossel.scrollLeft + carrossel.clientWidth >= carrossel.scrollWidth - 50) {
                    setTimeout(() => {
                        carrossel.scrollTo({ left: 0, behavior: 'smooth' });
                    }, 1000);
                }
            }
        }, 3000);
        
        // Pausa no hover
        carrossel.addEventListener('mouseenter', () => {
            clearInterval(autoScroll);
        });
        
        carrossel.addEventListener('mouseleave', () => {
            autoScroll = setInterval(() => {
                if (isElementInViewport(carrossel)) {
                    carrossel.scrollBy({ left: 200, behavior: 'smooth' });
                    
                    if (carrossel.scrollLeft + carrossel.clientWidth >= carrossel.scrollWidth - 50) {
                        setTimeout(() => {
                            carrossel.scrollTo({ left: 0, behavior: 'smooth' });
                        }, 1000);
                    }
                }
            }, 3000);
        });
        
        // Verifica se o elemento está visível
        function isElementInViewport(el) {
            const rect = el.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }
    });
	
// --- Carrossel Automático de Jogadores início---

// --- Carrossel Automático de Jogadores ---
// --- Carrossel de Jogadores Otimizado ---

document.addEventListener('DOMContentLoaded', function() {
    const carrossel = document.querySelector('#secao-4 .carrossel-horizontal');
    const prevBtn = document.querySelector('#secao-4 .prev-btn');
    const nextBtn = document.querySelector('#secao-4 .next-btn');
    const jogadores = document.querySelectorAll('#secao-4 .jogador');
    const wrapper = document.querySelector('#secao-4 .carrossel-wrapper');
    
    if (!carrossel || !prevBtn || !nextBtn) return;

    let currentIndex = 0;
    let isUserInteracting = false;
    let interactionTimeout;
    const jogadorWidth = 180 + 24; // Largura fixa (180px + gap)

    // Função para movimento suave do carrossel
    function moveCarrossel(direction) {
        const currentTransform = carrossel.style.transform;
        const currentX = currentTransform ? 
            parseFloat(currentTransform.match(/translateX\(([^)]+)px\)/)?.[1] || 0) : 0;
        
        const moveDistance = jogadorWidth * 1.5;
        let newX = direction === 'next' ? currentX - moveDistance : currentX + moveDistance;
        
        // Limitar movimentação
        const containerWidth = wrapper.offsetWidth;
        const totalCarrosselWidth = jogadores.length * jogadorWidth;
        const maxTranslateX = 0;
        const minTranslateX = -(totalCarrosselWidth - containerWidth);
        newX = Math.max(minTranslateX, Math.min(maxTranslateX, newX));
        
        carrossel.style.transition = 'transform 0.6s ease-out';
        carrossel.style.transform = `translateX(${newX}px)`;
        carrossel.style.animation = 'none';
    }

    // Função para centralizar jogador
    function centerPlayer(index) {
        if (index < 0 || index >= jogadores.length) return;
        
        currentIndex = index;
        const containerWidth = wrapper.offsetWidth;
        const totalCarrosselWidth = jogadores.length * jogadorWidth;
        
        let translateX = -(index * jogadorWidth) + (containerWidth / 2) - (jogadorWidth / 2);
        translateX = Math.max(-(totalCarrosselWidth - containerWidth), Math.min(0, translateX));
        
        carrossel.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        carrossel.style.transform = `translateX(${translateX}px)`;
        carrossel.style.animation = 'none';
        
        updatePlayerState(index);
    }

    function updatePlayerState(activeIndex) {
        jogadores.forEach((jogador, index) => {
            jogador.classList.toggle('active', index === activeIndex);
        });
    }

    function startInteraction() {
        isUserInteracting = true;
        clearTimeout(interactionTimeout);
        carrossel.classList.add('paused');
    }

    function endInteraction() {
        isUserInteracting = false;
        interactionTimeout = setTimeout(() => {
            if (!isUserInteracting) {
                resumeAutoScroll();
            }
        }, 2000);
    }

    function resumeAutoScroll() {
        carrossel.classList.remove('paused');
        carrossel.style.animation = 'autoScroll 40s infinite linear';
        carrossel.style.transition = 'none';
        updatePlayerState(-1);
        currentIndex = 0;
    }

    // Eventos dos jogadores
    jogadores.forEach((jogador, index) => {
        jogador.addEventListener('mouseenter', () => {
            startInteraction();
            centerPlayer(index);
        });

        jogador.addEventListener('mouseleave', endInteraction);

        jogador.addEventListener('click', (e) => {
            e.preventDefault();
            startInteraction();
            centerPlayer(index);
        });

        jogador.addEventListener('touchstart', () => {
            startInteraction();
            centerPlayer(index);
        });

        jogador.addEventListener('touchend', endInteraction);
    });

    // Eventos dos botões
    nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        startInteraction();
        moveCarrossel('next');
        endInteraction();
    });

    prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        startInteraction();
        moveCarrossel('prev');
        endInteraction();
    });

    // Swipe para mobile
    let touchStartX = 0;
    carrossel.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });

    carrossel.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > 50) {
            startInteraction();
            moveCarrossel(diff > 0 ? 'next' : 'prev');
            endInteraction();
        }
    });

    // Inicialização
    carrossel.style.animation = 'autoScroll 40s infinite linear';
});
// --- Carrossel Automático de Jogadores fim ---

// --- Seção viagens início ---

document.addEventListener('DOMContentLoaded', function() {
    const destinations = document.querySelectorAll('#secao-3 .orange3-destination');
    const bgElement = document.querySelector('#secao-3 .orange3-bg');
    
    // Função para trocar a imagem de fundo
    function changeBackground(imageUrl) {
        bgElement.style.backgroundImage = `url('${imageUrl}')`;
    }
    
    // Configuração inicial (usa a imagem do botão ativo)
    const activeDest = document.querySelector('#secao-3 .orange3-destination.active');
    if(activeDest) {
        changeBackground(activeDest.dataset.bgImage);
    }
    
    // Event listeners para cada botão
    destinations.forEach(dest => {
        dest.addEventListener('click', function() {
            // Remove a classe 'active' de todos
            destinations.forEach(d => d.classList.remove('active'));
            // Adiciona apenas no clicado
            this.classList.add('active');
            // Muda o background
            changeBackground(this.dataset.bgImage);
        });
    });
});

// --- Seção viagens Fim ---

// --- Seção botão social Início ---

// --- Botão Flutuante de Rede Social ---
document.addEventListener('DOMContentLoaded', function() {
    const socialBall = document.getElementById('social-ball');
    const icons = document.querySelectorAll('.social-icon');
    let currentIcon = 0;
    let rotationInterval;
    let isHovered = false;
    
    function startRotation() {
        rotationInterval = setInterval(() => {
            if (!isHovered) {
                rotateIcons();
            }
        }, 5000);
    }
    
    function rotateIcons() {
        icons.forEach(icon => icon.classList.remove('active'));
        currentIcon = (currentIcon + 1) % icons.length;
        icons[currentIcon].classList.add('active');
        
        socialBall.classList.add('pulse');
        setTimeout(() => socialBall.classList.remove('pulse'), 1000);
    }
    
    function handleIconClick(e) {
        e.preventDefault();
        const socialType = this.classList.contains('whatsapp') ? 'WhatsApp' : 
                          this.classList.contains('instagram') ? 'Instagram' :
                          this.classList.contains('youtube') ? 'YouTube' : 'Telefone';
        
        if (confirm(`Deseja entrar em contato pelo ${socialType}?`)) {
            window.open(this.href, '_blank');
        }
    }
    
    // Event listeners permanecem iguais
    socialBall.addEventListener('mouseenter', () => {
        isHovered = true;
        clearInterval(rotationInterval);
        socialBall.classList.add('pulse');
    });
    
    socialBall.addEventListener('mouseleave', () => {
        isHovered = false;
        socialBall.classList.remove('pulse');
        startRotation();
    });
    
    icons.forEach(icon => {
        icon.addEventListener('click', handleIconClick);
    });
    
    icons[0].classList.add('active');
    startRotation();
});

// --- Seção botão social Fim ---

// --- Início de slide vídeo Início ---

document.addEventListener('DOMContentLoaded', function() {
    const videos = document.querySelectorAll('.video-slide');
    let currentVideo = 0;
    const videoDuration = 8000; // 8 segundos para cada vídeo
    
    function nextVideo() {
        // Remove a classe 'active' do vídeo atual
        videos[currentVideo].classList.remove('active');
        
        // Avança para o próximo vídeo
        currentVideo = (currentVideo + 1) % videos.length;
        
        // Adiciona a classe 'active' ao próximo vídeo
        videos[currentVideo].classList.add('active');
        
        // Reinicia o vídeo
        videos[currentVideo].currentTime = 0;
        videos[currentVideo].play();
        
        // Agenda a próxima transição
        setTimeout(nextVideo, videoDuration);
    }
    
    // Inicia o primeiro vídeo
    if (videos.length > 0) {
        videos[0].classList.add('active');
        videos[0].play();
        
        // Inicia o ciclo de transição
        setTimeout(nextVideo, videoDuration);
    }
    
    // Garante que os vídeos continuem em loop
    videos.forEach(video => {
        video.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        });
    });
});

// --- Início de slide vídeo Fim ---

// --- Início de Estrelas e coroa Início ---

    // Faz a animação ocorrer automaticamente após 3 segundos

    document.addEventListener('DOMContentLoaded', function() {
        // Configura posições iniciais das estrelas para a animação
        const starLeft = document.querySelector('.star-left');
        const starRight = document.querySelector('.star-right');
        
        starLeft.style.setProperty('--start-pos', '-20%');
        starRight.style.setProperty('--start-pos', '20%');
    });

// --- Início de Estrelas e coroa Fim ---