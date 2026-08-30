const menuButton = document.querySelector('.menu-button');
const header = document.querySelector('.site-header');

if (menuButton && header) {
  menuButton.addEventListener('click', () => {
    const isOpen = header.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });

  document.querySelectorAll('.site-header nav a').forEach((link) => {
    link.addEventListener('click', () => {
      header.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && !reducedMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('visible'));
}

const config = window.BASELINELAB_SITE_CONFIG || {};
const appStoreUrl = typeof config.appStoreUrl === 'string' ? config.appStoreUrl.trim() : '';

document.querySelectorAll('[data-app-store]').forEach((link) => {
  if (appStoreUrl) {
    link.href = appStoreUrl;
    link.textContent = config.appStoreLabel || 'Download on the App Store';
    link.classList.remove('is-coming-soon');
    link.removeAttribute('aria-disabled');
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener');
  } else {
    link.textContent = config.comingSoonLabel || 'Coming soon on the App Store';
    link.classList.add('is-coming-soon');
    link.setAttribute('aria-disabled', 'true');
    link.addEventListener('click', (event) => {
      if (link.getAttribute('href') === '#availability') event.preventDefault();
    });
  }
});

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
