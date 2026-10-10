/**
 * PORTFÓLIO DE DESENVOLVIMENTO DE SOFTWARE - LOGICA INTERATIVA
 * Desenvolvedor: Mickael Dias Soares
 * Stack: Node.js, PostgreSQL, PWA, IA Facial, Cloudflare Workers, Bootstrap 5
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initProjectFilters();
  initSmoothScroll();
  initProjectGalleryModal();
});

/* ==========================================================================
   1. ALTERNADOR DE TEMA (DARK / LIGHT MODE)
   ========================================================================== */
function initThemeToggle() {
  const themeBtn = document.getElementById('themeToggleBtn');
  const themeIcon = themeBtn ? themeBtn.querySelector('i') : null;
  
  // Recupera preferência salva ou assume escuro por padrão
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  document.documentElement.setAttribute('data-bs-theme', savedTheme);
  updateThemeIcon(savedTheme, themeIcon);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      document.documentElement.setAttribute('data-bs-theme', newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
      updateThemeIcon(newTheme, themeIcon);
    });
  }
}

function updateThemeIcon(theme, iconElement) {
  if (!iconElement) return;
  if (theme === 'light') {
    iconElement.className = 'fa-solid fa-moon';
  } else {
    iconElement.className = 'fa-solid fa-sun';
  }
}

/* ==========================================================================
   2. FILTRO DE PROJETOS NO PORTFÓLIO
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Atualizar classe ativa
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        const matches = filterValue === 'all' || category.split(' ').includes(filterValue);
        if (matches) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ==========================================================================
   3. NAVEGAÇÃO E SCROLL SUAVE
   ========================================================================== */
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('.nav-link-custom');

  window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   4. GALERIA DE TELAS DOS PROJETOS (MODAL & CARROSSEL / PASSADOR)
   ========================================================================== */
const projectGalleries = {
  pontosmart: {
    title: 'PontoSmart — Ponto Eletrônico & IA Facial',
    category: 'SaaS • Biometria Facial',
    slides: [
      {
        src: 'assets/project_pontosmart.png',
        caption: 'Interface PWA de Marcação de Ponto Facial com Câmera e Geolocalização GPS'
      }
      /* Espaço reservado: adicione novos objetos { src: 'assets/...', caption: '...' } aqui quando desejar subir novas fotos reais */
    ]
  },
  portal_chamados: {
    title: 'Portal de Chamados & Service Desk',
    category: 'Helpdesk • Service Desk',
    slides: [
      {
        src: 'assets/project_portal_chamados.png',
        caption: 'Central de Atendimento & Helpdesk — Gestão de Tickets em Tempo Real e Controle de SLA'
      }
      /* Espaço reservado: adicione novos objetos { src: 'assets/...', caption: '...' } aqui quando desejar subir novas fotos reais */
    ]
  },
  health_monitor: {
    title: 'Central de Operações & Health Check — TI Suporte MS',
    category: 'DevOps • Observabilidade',
    slides: [
      {
        src: 'assets/project_health_monitor.png',
        caption: 'Serviços Web & APIs — Monitoramento Ativo de Rotas HTTP, Uptime e Latências em Tempo Real'
      },
      {
        src: 'assets/project_health_storage.png',
        caption: 'Bancos de Dados & Storage — Volumetria e Cotas em Tempo Real de PostgreSQL (Supabase) e Cloudflare R2'
      },
      {
        src: 'assets/project_health_ssl.png',
        caption: 'Segurança & Compliance — Inspeção Diária de Certificados SSL/TLS e do Certificado A1 ICP-Brasil (Portaria 671)'
      }
    ]
  },
  tisuportems: {
    title: 'Site & Landing Page — TI Suporte MS',
    category: 'Web • Alta Conversão',
    slides: [
      {
        src: 'assets/project_tisuportems.png',
        caption: 'Landing Page Corporativa B2B de Alta Conversão com Pontuação Máxima no Google Lighthouse'
      }
    ]
  }
};

function initProjectGalleryModal() {
  const modalEl = document.getElementById('projectGalleryModal');
  if (!modalEl) return;

  const modalTitle = document.getElementById('galleryModalLabel');
  const modalCategory = document.getElementById('galleryModalCategory');
  const slidesContainer = document.getElementById('gallerySlides');
  const indicatorsContainer = document.getElementById('galleryIndicators');
  const captionEl = document.getElementById('gallerySlideCaption');
  const counterEl = document.getElementById('gallerySlideCounter');
  const prevBtn = document.getElementById('galleryPrevBtn');
  const nextBtn = document.getElementById('galleryNextBtn');
  const carouselEl = document.getElementById('galleryCarousel');

  const galleryTriggers = document.querySelectorAll('[data-gallery-project]');
  let currentProjectSlides = [];

  galleryTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = trigger.getAttribute('data-gallery-project');
      const project = projectGalleries[projectId];
      if (!project) return;

      currentProjectSlides = project.slides;
      modalTitle.textContent = project.title;
      modalCategory.textContent = project.category;

      slidesContainer.innerHTML = '';
      indicatorsContainer.innerHTML = '';

      const totalSlides = project.slides.length;

      // Se tiver apenas 1 foto, esconde os botões do passador e os indicadores
      if (totalSlides <= 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        indicatorsContainer.style.display = 'none';
      } else {
        prevBtn.style.display = 'flex';
        nextBtn.style.display = 'flex';
        indicatorsContainer.style.display = 'flex';
      }

      project.slides.forEach((slide, idx) => {
        // Indicador
        const indicator = document.createElement('button');
        indicator.type = 'button';
        indicator.setAttribute('data-bs-target', '#galleryCarousel');
        indicator.setAttribute('data-bs-slide-to', idx.toString());
        indicator.setAttribute('aria-label', `Slide ${idx + 1}`);
        if (idx === 0) {
          indicator.classList.add('active');
          indicator.setAttribute('aria-current', 'true');
        }
        indicatorsContainer.appendChild(indicator);

        // Slide
        const slideItem = document.createElement('div');
        slideItem.className = `carousel-item ${idx === 0 ? 'active' : ''}`;
        slideItem.innerHTML = `
          <div class="gallery-carousel-item">
            <img src="${slide.src}" alt="${slide.caption}" class="img-fluid" loading="lazy">
          </div>
        `;
        slidesContainer.appendChild(slideItem);
      });

      // Legenda e contador inicial
      updateCaptionAndCounter(0, totalSlides, project.slides);

      // Instância do Carrossel do Bootstrap
      const carouselInstance = bootstrap.Carousel.getOrCreateInstance(carouselEl, {
        interval: false,
        wrap: true,
        keyboard: true
      });
      carouselInstance.to(0);

      // Abre o Modal do Bootstrap
      const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
      modalInstance.show();
    });
  });

  if (carouselEl) {
    carouselEl.addEventListener('slid.bs.carousel', (event) => {
      if (currentProjectSlides && currentProjectSlides.length > 0) {
        updateCaptionAndCounter(event.to, currentProjectSlides.length, currentProjectSlides);
      }
    });
  }

  function updateCaptionAndCounter(index, total, slides) {
    if (captionEl && slides && slides[index]) {
      captionEl.textContent = slides[index].caption;
    }
    if (counterEl) {
      counterEl.textContent = `${index + 1} de ${total}`;
    }
  }
}
