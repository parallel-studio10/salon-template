// STUDIO/81 Luxury Salon - Interactive Behaviors, Lenis Smooth Scroll & GSAP Animations

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. Lenis Smooth Scrolling Initialization
  // =========================================================================
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 2,
      infinite: false,
    });

    // Request animation frame loop for Lenis
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Synchronize Lenis with GSAP ScrollTrigger if available
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  }

  // =========================================================================
  // 2. Scroll Progress Bar & Sticky Header
  // =========================================================================
  const scrollProgressFill = document.getElementById('scrollProgressFill');
  const header = document.getElementById('header');

  const onScroll = () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Update Progress Bar
    if (scrollProgressFill && scrollHeight > 0) {
      const progressPercent = Math.min(100, Math.max(0, (scrollY / scrollHeight) * 100));
      scrollProgressFill.style.width = `${progressPercent}%`;
    }

    // Update Header Background
    if (header) {
      if (scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // =========================================================================
  // 3. Smooth Anchor Link Scrolling
  // =========================================================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        toggleMobileMenu(false);
        if (lenis) {
          lenis.scrollTo(targetElement, { offset: -70, duration: 1.2 });
        } else {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // =========================================================================
  // 4. GSAP Stagger & ScrollTrigger Reveal Animations
  // =========================================================================
  if (typeof gsap !== 'undefined') {
    // Header Initial Entrance
    gsap.from('.site-header', {
      y: -30,
      opacity: 0,
      duration: 1.0,
      ease: 'power3.out',
      delay: 0.2,
    });

    // Hero Content Stagger Reveal
    gsap.from('.hero-title-welcome', {
      y: 40,
      opacity: 0,
      duration: 1.1,
      ease: 'power3.out',
      delay: 0.4,
    });

    gsap.from('.hero-title-studio', {
      y: 40,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.6,
    });

    gsap.from('.hero-description', {
      y: 30,
      opacity: 0,
      duration: 1.0,
      ease: 'power3.out',
      delay: 0.8,
    });

    gsap.from('.hero-social-sidebar', {
      x: 30,
      opacity: 0,
      duration: 1.0,
      ease: 'power3.out',
      delay: 1.0,
    });

    // Section ScrollTrigger Animations
    if (typeof ScrollTrigger !== 'undefined') {
      const sections = document.querySelectorAll('.reveal-section');
      sections.forEach((section) => {
        gsap.from(section.querySelectorAll('.section-top-row'), {
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          y: 35,
          opacity: 0,
          duration: 0.9,
          ease: 'power2.out',
        });

        const cards = section.querySelectorAll(
          '.service-tile, .salon-interior-banner, .showcase-cell, .social-review-card, .blog-item'
        );
        if (cards.length > 0) {
          gsap.from(cards, {
            scrollTrigger: {
              trigger: section,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
            y: 45,
            opacity: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: 'power3.out',
          });
        }
      });
    }
  }

  // =========================================================================
  // 5. Mobile Drawer Menu
  // =========================================================================
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const mobileBookBtn = document.getElementById('mobileBookBtn');

  function toggleMobileMenu(isOpen) {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
    if (isOpen) {
      mobileMenu.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    } else {
      mobileMenu.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      toggleMobileMenu(!isExpanded);
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => toggleMobileMenu(false));
    });
  }

  // =========================================================================
  // 6. Interactive Social Testimonial Likes
  // =========================================================================
  const heartButtons = document.querySelectorAll('.like-button');
  heartButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.social-review-card');
      const counter = card.querySelector('.likes-count');
      const baseLikes = parseInt(btn.getAttribute('data-likes'), 10) || 0;
      const isLiked = btn.classList.toggle('is-liked');

      if (isLiked) {
        const newCount = baseLikes + 1;
        counter.textContent = `${newCount} likes`;
        btn.setAttribute('aria-label', 'Unlike testimonial');
      } else {
        counter.textContent = `${baseLikes} likes`;
        btn.setAttribute('aria-label', 'Like testimonial');
      }
    });
  });

  // =========================================================================
  // 7. Booking Modal
  // =========================================================================
  const bookModal = document.getElementById('bookModal');
  const openBookModalBtn = document.getElementById('openBookModalBtn');
  const closeBookModalBtn = document.getElementById('closeBookModalBtn');
  const bookingForm = document.getElementById('bookingForm');
  const bookingConfirmation = document.getElementById('bookingConfirmation');

  const openModal = () => {
    toggleMobileMenu(false);
    if (!bookModal) return;
    bookModal.classList.add('is-open');
    bookModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const dateInput = document.getElementById('bookingDate');
    if (dateInput && !dateInput.value) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateInput.value = tomorrow.toISOString().split('T')[0];
    }
  };

  const closeModal = () => {
    if (!bookModal) return;
    bookModal.classList.remove('is-open');
    bookModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (openBookModalBtn) openBookModalBtn.addEventListener('click', openModal);
  if (mobileBookBtn) mobileBookBtn.addEventListener('click', openModal);
  if (closeBookModalBtn) closeBookModalBtn.addEventListener('click', closeModal);

  if (bookModal) {
    bookModal.addEventListener('click', (e) => {
      if (e.target === bookModal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bookModal && bookModal.classList.contains('is-open')) {
      closeModal();
    }
  });

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      bookingForm.style.display = 'none';
      if (bookingConfirmation) bookingConfirmation.style.display = 'block';
      setTimeout(() => {
        closeModal();
        setTimeout(() => {
          bookingForm.reset();
          bookingForm.style.display = 'flex';
          if (bookingConfirmation) bookingConfirmation.style.display = 'none';
        }, 400);
      }, 3500);
    });
  }

  // =========================================================================
  // 8. Newsletter Subscription Form Handler
  // =========================================================================
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterEmail = document.getElementById('newsletterEmail');
  const newsletterStatus = document.getElementById('newsletterStatus');

  if (newsletterForm && newsletterEmail && newsletterStatus) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterEmail.value.trim();
      if (email) {
        newsletterStatus.textContent = 'Thank you for subscribing to the STUDIO/81 dispatch.';
        newsletterStatus.style.color = '#c5a059';
        newsletterForm.reset();
        setTimeout(() => {
          newsletterStatus.textContent = '';
        }, 5000);
      }
    });
  }
});
