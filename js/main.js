/**
 * PORTFÓLIO DE DESENVOLVIMENTO DE SOFTWARE - LOGICA INTERATIVA
 * Stack: HTML5, CSS3, JavaScript, Bootstrap 5, MySQL, PostgreSQL
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initProjectFilters();
  initBudgetCalculator();
  initContactForm();
  initSmoothScroll();
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
  updateThemeIcon(savedTheme, themeIcon);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
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
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
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
   3. CALCULADORA INTERATIVA DE ORÇAMENTO (HIGH CONVERSION)
   ========================================================================== */
let selectedProjectType = { name: 'Sistema Web completo', price: 2500 };
let selectedFeatures = new Map();

function initBudgetCalculator() {
  const typeCards = document.querySelectorAll('.calc-type-card');
  const featureCheckboxes = document.querySelectorAll('.calc-feature-checkbox');
  const whatsappBtn = document.getElementById('calcSendWhatsapp');

  // Seleção de Tipo de Projeto
  typeCards.forEach(card => {
    card.addEventListener('click', () => {
      typeCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      
      const name = card.getAttribute('data-name');
      const price = parseInt(card.getAttribute('data-price'), 10);
      selectedProjectType = { name, price };
      
      calculateTotal();
    });
  });

  // Seleção de Funcionalidades Extras
  featureCheckboxes.forEach(chk => {
    chk.addEventListener('change', () => {
      const name = chk.getAttribute('data-name');
      const price = parseInt(chk.getAttribute('data-price'), 10);
      
      if (chk.checked) {
        selectedFeatures.set(name, price);
        chk.closest('.calc-option-card').classList.add('selected');
      } else {
        selectedFeatures.delete(name);
        chk.closest('.calc-option-card').classList.remove('selected');
      }
      
      calculateTotal();
    });
  });

  // Botão Enviar para WhatsApp
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      sendBudgetToWhatsapp();
    });
  }

  // Cálculo inicial
  calculateTotal();
}

function calculateTotal() {
  let total = selectedProjectType.price;
  selectedFeatures.forEach(price => {
    total += price;
  });

  const priceDisplay = document.getElementById('calcTotalPrice');
  const featureCountDisplay = document.getElementById('calcFeatureCount');

  if (priceDisplay) {
    priceDisplay.textContent = `R$ ${total.toLocaleString('pt-BR')},00`;
  }
  if (featureCountDisplay) {
    featureCountDisplay.textContent = selectedFeatures.size;
  }
}

function sendBudgetToWhatsapp() {
  const phoneNumber = '5511999999999'; // Número personalizável pelo usuário
  let message = `🚀 *Solicitação de Orçamento pelo Portfólio*\n\n`;
  message += `📌 *Tipo de Projeto:* ${selectedProjectType.name}\n`;
  
  if (selectedFeatures.size > 0) {
    message += `⚡ *Recursos Selecionados:*\n`;
    selectedFeatures.forEach((price, feature) => {
      message += ` • ${feature}\n`;
    });
  }
  
  const total = selectedProjectType.price + Array.from(selectedFeatures.values()).reduce((a, b) => a + b, 0);
  message += `\n💰 *Estimativa Aproximada:* R$ ${total.toLocaleString('pt-BR')},00\n\n`;
  message += `Olá! Gostaria de conversar mais detalhes sobre este projeto.`;

  const encodedUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(encodedUrl, '_blank');
}

/* ==========================================================================
   4. FORMULÁRIO DE CONTATO DIRETO
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('directContactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('contactName').value;
      const email = document.getElementById('contactEmail').value;
      const msg = document.getElementById('contactMessage').value;

      const phoneNumber = '5511999999999';
      const text = `📬 *Mensagem de Contato do Site*\n\n👤 *Nome:* ${name}\n📧 *E-mail:* ${email}\n\n💬 *Mensagem:* ${msg}`;
      
      window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`, '_blank');
      contactForm.reset();
    });
  }
}

/* ==========================================================================
   5. NAVEGAÇÃO E SCROLL SUAVE
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
