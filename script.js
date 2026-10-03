const progress = document.querySelector('.scroll-progress span');
const updateProgress = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max ? (window.scrollY / max) * 100 : 0}%`;
};
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.mobile-menu');

const openMenu = () => {
  if (!toggle || !menu) return;
  toggle.setAttribute('aria-expanded', 'true');
  menu.classList.add('is-open');
  document.body.classList.add('menu-open');
};

const closeMenu = () => {
  if (!toggle || !menu) return;
  toggle.setAttribute('aria-expanded', 'false');
  menu.classList.remove('is-open');
  document.body.classList.remove('menu-open');
};

if (toggle && menu) {
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      closeMenu();
    }
  });

  document.addEventListener('click', (e) => {
    if (menu.classList.contains('is-open') && !menu.contains(e.target) && !toggle.contains(e.target)) {
      closeMenu();
    }
  });
}

// Lenis keeps wheel and trackpad scrolling smooth without blocking native input.
let lenisInstance = null;
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && typeof Lenis !== 'undefined') {
  document.documentElement.style.scrollBehavior = 'auto';
  lenisInstance = new Lenis({
    duration: 1.05,
    smoothWheel: true,
    syncTouch: false,
    lerp: 0.09,
  });

  const frame = (time) => {
    lenisInstance.raf(time);
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

// Smooth scroll handler for anchor links
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const hash = link.getAttribute('href');
    if (!hash || hash === '#') return;
    const target = document.querySelector(hash);
    if (!target) return;

    closeMenu();

    const headerOffset = window.innerWidth <= 700 ? 76 : 95;

    if (lenisInstance) {
      event.preventDefault();
      lenisInstance.scrollTo(target, { offset: -headerOffset, duration: 1.1 });
    } else if ('scrollBehavior' in document.documentElement.style) {
      // Native scroll behavior with offset
      event.preventDefault();
      const elementPosition = target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - headerOffset,
        behavior: 'smooth'
      });
    }
  });
});

// A restrained first-load reveal gives the template a more considered finish.
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && typeof gsap !== 'undefined') {
  gsap.from('.site-header > :not(.mobile-menu)', { y: -10, opacity: 0, duration: 0.55, stagger: 0.07, ease: 'power2.out' });
  gsap.from('.hero-copy > *', { y: 18, opacity: 0, duration: 0.7, stagger: 0.09, delay: 0.12, ease: 'power3.out' });
}
