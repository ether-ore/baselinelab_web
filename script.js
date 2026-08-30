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

const screenshotViewport = document.querySelector('.screenshot-viewport');
const screenshotSlides = Array.from(document.querySelectorAll('.screenshot-slide'));
const screenshotPrevious = document.querySelector('.screenshot-previous');
const screenshotNext = document.querySelector('.screenshot-next');
const screenshotCounter = document.querySelector('.screenshot-counter');

if (screenshotViewport && screenshotSlides.length && screenshotPrevious && screenshotNext && screenshotCounter) {
  let activeScreenshot = 0;
  let screenshotScrollFrame;

  const updateScreenshotControls = (index) => {
    activeScreenshot = Math.max(0, Math.min(index, screenshotSlides.length - 1));
    screenshotCounter.textContent = `${activeScreenshot + 1} / ${screenshotSlides.length}`;
    screenshotPrevious.disabled = activeScreenshot === 0;
    screenshotNext.disabled = activeScreenshot === screenshotSlides.length - 1;
  };

  const showScreenshot = (index) => {
    const nextIndex = Math.max(0, Math.min(index, screenshotSlides.length - 1));
    screenshotViewport.scrollTo({
      left: screenshotSlides[nextIndex].offsetLeft - screenshotSlides[0].offsetLeft,
      behavior: reducedMotion ? 'auto' : 'smooth'
    });
    updateScreenshotControls(nextIndex);
  };

  screenshotPrevious.addEventListener('click', () => showScreenshot(activeScreenshot - 1));
  screenshotNext.addEventListener('click', () => showScreenshot(activeScreenshot + 1));

  screenshotViewport.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showScreenshot(activeScreenshot - 1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      showScreenshot(activeScreenshot + 1);
    }
  });

  screenshotViewport.addEventListener('scroll', () => {
    window.cancelAnimationFrame(screenshotScrollFrame);
    screenshotScrollFrame = window.requestAnimationFrame(() => {
      const nearestIndex = screenshotSlides.reduce((nearest, slide, index) => {
        const firstSlideOffset = screenshotSlides[0].offsetLeft;
        const currentDistance = Math.abs(slide.offsetLeft - firstSlideOffset - screenshotViewport.scrollLeft);
        const nearestDistance = Math.abs(screenshotSlides[nearest].offsetLeft - firstSlideOffset - screenshotViewport.scrollLeft);
        return currentDistance < nearestDistance ? index : nearest;
      }, 0);
      updateScreenshotControls(nearestIndex);
    });
  }, { passive: true });

  updateScreenshotControls(0);
}
