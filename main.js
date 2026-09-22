/**
 * Lógica e interactividad de la Landing Page: Condominio La Morada
 * Bioesfera Desarrollo Inmobiliario SAC
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 1. Menú móvil tipo Drawer
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const closeMenuBtn = document.getElementById('close-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const openDrawer = () => {
    mobileDrawer.classList.remove('translate-x-full');
    drawerOverlay.classList.remove('opacity-0', 'pointer-events-none');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    mobileDrawer.classList.add('translate-x-full');
    drawerOverlay.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = '';
  };

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openDrawer);
  if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // 2. Carrusel Multimedia (Swiper) si existe en la página
  const swiperElem = document.querySelector('.media-swiper');
  if (swiperElem && typeof Swiper !== 'undefined') {
    new Swiper('.media-swiper', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      autoplay: {
        delay: 4500,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
          spaceBetween: 24,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 28,
        }
      }
    });
  }

  // 3. Modal Lightbox de Multimedia / Video
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxContent = document.getElementById('lightbox-content');
  const closeLightboxBtn = document.getElementById('close-lightbox');
  const videoTriggers = document.querySelectorAll('.trigger-lightbox');

  const openLightbox = (title, description, src) => {
    lightboxContent.innerHTML = `
      <div class="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl bg-black">
        <iframe class="w-full h-full" src="${src}" title="${title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
      <div class="mt-4 text-center">
        <h4 class="text-xl font-bold text-white">${title}</h4>
        <p class="text-purple-200 text-sm mt-1">${description}</p>
      </div>
    `;
    lightboxModal.classList.remove('hidden');
    lightboxModal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightboxModal.classList.add('hidden');
    lightboxModal.classList.remove('flex');
    lightboxContent.innerHTML = '';
    document.body.style.overflow = '';
  };

  videoTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const title = btn.dataset.title || 'Video del Proyecto La Morada';
      const desc = btn.dataset.desc || 'Avances de obra y vistas aéreas en Uchumayo';
      const src = btn.dataset.src || 'https://www.youtube.com/embed/1DRjMPvM5H4?autoplay=1';
      openLightbox(title, desc, src);
    });
  });

  if (closeLightboxBtn) closeLightboxBtn.addEventListener('click', closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  // 4. Modal Tour Virtual 360
  const tourModal = document.getElementById('tour-modal');
  const tourTrigger = document.getElementById('trigger-tour-360');
  const closeTourBtn = document.getElementById('close-tour');

  if (tourTrigger && tourModal) {
    tourTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      tourModal.classList.remove('hidden');
      tourModal.classList.add('flex');
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeTourBtn && tourModal) {
    closeTourBtn.addEventListener('click', () => {
      tourModal.classList.add('hidden');
      tourModal.classList.remove('flex');
      document.body.style.overflow = '';
    });
  }

  // 5. Calculadora Financiera de Lotes Interactiva
  const lotAreaSelect = document.getElementById('lot-area');
  const paymentPlanSelect = document.getElementById('payment-plan');
  const initialPercentSelect = document.getElementById('initial-percent');
  const calcTotalSpan = document.getElementById('calc-total');
  const calcInitialSpan = document.getElementById('calc-initial');
  const calcQuotaSpan = document.getElementById('calc-quota');
  const calcDiscountAlert = document.getElementById('calc-discount-alert');

  function calculateFinancing() {
    if (!lotAreaSelect || !paymentPlanSelect) return;

    const area = parseFloat(lotAreaSelect.value) || 200;
    const pricePerM2 = 240; // aprox $48,000 para 200m2 o S/. equivalente
    let totalBase = area * pricePerM2;
    const plan = paymentPlanSelect.value;
    const initialPercent = parseFloat(initialPercentSelect.value) || 0.30;

    let finalTotal = totalBase;
    let initialAmount = 0;
    let monthlyQuota = 0;

    if (plan === 'contado') {
      // Descuento máximo por pago al contado: USD 5,000
      finalTotal = Math.max(0, totalBase - 5000);
      initialAmount = finalTotal;
      monthlyQuota = 0;
      if (calcDiscountAlert) calcDiscountAlert.classList.remove('hidden');
    } else {
      if (calcDiscountAlert) calcDiscountAlert.classList.add('hidden');
      initialAmount = finalTotal * initialPercent;
      const remainingBalance = finalTotal - initialAmount;
      const months = parseInt(plan, 10) || 36;
      monthlyQuota = remainingBalance / months;
    }

    if (calcTotalSpan) calcTotalSpan.textContent = `US$ ${finalTotal.toLocaleString('en-US')}`;
    if (calcInitialSpan) calcInitialSpan.textContent = `US$ ${Math.round(initialAmount).toLocaleString('en-US')}`;
    if (calcQuotaSpan) {
      calcQuotaSpan.textContent = plan === 'contado' 
        ? 'Pago único (Sin cuotas)' 
        : `US$ ${Math.round(monthlyQuota).toLocaleString('en-US')} / mes`;
    }
  }

  if (lotAreaSelect) lotAreaSelect.addEventListener('change', calculateFinancing);
  if (paymentPlanSelect) paymentPlanSelect.addEventListener('change', calculateFinancing);
  if (initialPercentSelect) initialPercentSelect.addEventListener('change', calculateFinancing);
  calculateFinancing();

  // 6. Selector Interactivo de Lotes (Plano Maestro)
  const lotCards = document.querySelectorAll('.lot-item-card');
  const selectedLotDisplay = document.getElementById('selected-lot-label');
  const selectedLotInput = document.getElementById('input-lote-interes');

  lotCards.forEach(card => {
    card.addEventListener('click', () => {
      lotCards.forEach(c => c.classList.remove('ring-4', 'ring-purple-400', 'bg-purple-900/60'));
      card.classList.add('ring-4', 'ring-purple-400', 'bg-purple-900/60');
      
      const lotName = card.dataset.lot || 'Lote Estándar';
      const lotM2 = card.dataset.m2 || '200';
      if (selectedLotDisplay) {
        selectedLotDisplay.innerHTML = `Has seleccionado el <strong>${lotName} (${lotM2} m²)</strong>. Completa tus datos abajo para reservarlo por S/ 300 o $300.`;
      }
      if (selectedLotInput) {
        selectedLotInput.value = `${lotName} - ${lotM2}m2`;
      }
    });
  });

  // 7. Formulario de Captura de Información (CF7 Style con envío y WhatsApp)
  const contactForm = document.getElementById('leads-form');
  const formSuccess = document.getElementById('form-success-msg');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nombres = document.getElementById('form-nombres').value.trim();
      const apellidos = document.getElementById('form-apellidos').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const telefono = document.getElementById('form-telefono').value.trim();
      const horario = document.getElementById('form-horario').value;
      const loteInteres = selectedLotInput ? selectedLotInput.value : 'Lote en Condominio La Morada';

      // Simular feedback inmediato
      if (formSuccess) {
        formSuccess.classList.remove('hidden');
        contactForm.reset();
      }

      // Preparar enlace de WhatsApp automático
      const mensaje = `Hola Biosfera Inmobiliaria, deseo información y cotización del proyecto *CONDOMINIO LA MORADA* en Uchumayo.%0A%0A*Mis Datos:*%0A- Nombre: ${nombres} ${apellidos}%0A- Teléfono: ${telefono}%0A- Correo: ${email}%0A- Horario de contacto: ${horario}%0A- Interés: ${loteInteres}`;
      
      const waUrl = `https://api.whatsapp.com/send?phone=51966030329\u0026text=${mensaje}`;
      
      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 900);
    });
  }

  // 8. Header scroll effect
  const mainHeader = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      mainHeader.classList.add('shadow-md', 'py-2.5');
      mainHeader.classList.remove('py-3.5');
    } else {
      mainHeader.classList.remove('shadow-md', 'py-2.5');
      mainHeader.classList.add('py-3.5');
    }
  });

  // 9. Transición Suave entre Páginas (Smooth Page Transitions)
  // Crear overlay de transición si no existe
  let overlay = document.querySelector('.page-transition-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    document.body.appendChild(overlay);
  }

  // Interceptar clics en enlaces locales para fundido suave
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    // Solo enlaces locales HTML sin hash exclusivo
    if (href.endsWith('.html') && !href.startsWith('http') && !link.hasAttribute('target')) {
      link.addEventListener('click', (e) => {
        // Permitir nueva pestaña si se pulsa Ctrl o Cmd
        if (e.metaKey || e.ctrlKey) return;
        
        e.preventDefault();
        overlay.classList.add('active');
        setTimeout(() => {
          window.location.href = href;
        }, 280);
      });
    }
  });

  // 10. Animaciones al hacer Scroll (Intersection Observer)
  const revealElements = document.querySelectorAll(
    'section > div, .amenity-card-light, .lot-item-card, form, footer, .bg-white.rounded-morada-lg, .bg-white.rounded-morada-xl'
  );

  revealElements.forEach(el => {
    if (!el.classList.contains('reveal-on-scroll')) {
      el.classList.add('reveal-on-scroll');
    }
  });

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.12
  };

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => scrollObserver.observe(el));
});

