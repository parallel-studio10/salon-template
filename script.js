const progress = document.querySelector('.scroll-progress span');
const updateProgress = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max ? (window.scrollY / max) * 100 : 0}%`;
};
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.mobile-menu');
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  menu.classList.toggle('is-open', !open);
});
menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  toggle.setAttribute('aria-expanded', 'false');
  menu.classList.remove('is-open');
}));

// CSS handles modern browsers. This animation keeps anchor links smooth in
// older browsers that do not support `scroll-behavior: smooth`.
if (!('scrollBehavior' in document.documentElement.style)) {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;

      event.preventDefault();
      const start = window.scrollY;
      const end = target.getBoundingClientRect().top + start;
      const duration = 650;
      const startedAt = performance.now();
      const easeOutCubic = (progress) => 1 - Math.pow(1 - progress, 3);

      const animate = (now) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        window.scrollTo(0, start + (end - start) * easeOutCubic(progress));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    });
  });
}

// Lenis keeps wheel and trackpad scrolling smooth without blocking native input.
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && typeof Lenis !== 'undefined') {
  document.documentElement.style.scrollBehavior = 'auto';
  const lenis = new Lenis({
    duration: 1.05,
    smoothWheel: true,
    syncTouch: false,
    lerp: 0.09,
  });

  const frame = (time) => {
    lenis.raf(time);
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { offset: 0, duration: 1.1 });
    });
  });
}

// A restrained first-load reveal gives the template a more considered finish.
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && typeof gsap !== 'undefined') {
  gsap.from('.site-header > :not(.mobile-menu)', { y: -10, opacity: 0, duration: .55, stagger: .07, ease: 'power2.out' });
  gsap.from('.hero-copy > *', { y: 18, opacity: 0, duration: .7, stagger: .09, delay: .12, ease: 'power3.out' });
}
