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
    link.textContent = config.appStoreLabel || 'Download for Mac and iPad on the App Store';
    link.classList.remove('is-coming-soon');
    link.removeAttribute('aria-disabled');
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener');
  } else {
    link.textContent = config.comingSoonLabel || 'Coming soon on the App Store for Mac and iPad';
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

const screenshotOpenButtons = document.querySelectorAll('.screenshot-open');
const screenshotLightbox = document.querySelector('.screenshot-lightbox');
const lightboxImage = document.querySelector('.lightbox-image');
const lightboxTitle = document.querySelector('#lightbox-title');
const lightboxDescription = document.querySelector('#lightbox-description');
const lightboxStage = document.querySelector('.lightbox-stage');
const lightboxZoom = document.querySelector('.lightbox-zoom');
const lightboxClose = document.querySelector('.lightbox-close');

if (screenshotOpenButtons.length && screenshotLightbox && lightboxImage && lightboxTitle && lightboxDescription && lightboxStage && lightboxZoom && lightboxClose) {
  const setLightboxZoom = (isZoomed) => {
    lightboxStage.classList.toggle('is-zoomed', isZoomed);
    lightboxZoom.setAttribute('aria-pressed', String(isZoomed));
    lightboxZoom.textContent = isZoomed ? 'Fit to window' : 'View actual size';
  };

  const toggleLightboxZoom = () => {
    setLightboxZoom(!lightboxStage.classList.contains('is-zoomed'));
  };

  screenshotOpenButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const image = button.querySelector('img');
      const caption = button.closest('.screenshot-slide')?.querySelector('figcaption');
      const title = caption?.querySelector('b')?.textContent.trim() || 'BaselineLab screenshot';
      const description = caption?.querySelector('span')?.textContent.trim() || '';

      if (!image) return;

      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt;
      lightboxTitle.textContent = title;
      lightboxDescription.textContent = description;
      setLightboxZoom(false);
      screenshotLightbox.showModal();
      document.body.classList.add('lightbox-open');
      lightboxClose.focus();
    });
  });

  lightboxZoom.addEventListener('click', toggleLightboxZoom);
  lightboxImage.addEventListener('click', toggleLightboxZoom);
  lightboxClose.addEventListener('click', () => screenshotLightbox.close());

  screenshotLightbox.addEventListener('click', (event) => {
    if (event.target === screenshotLightbox) screenshotLightbox.close();
  });

  screenshotLightbox.addEventListener('close', () => {
    document.body.classList.remove('lightbox-open');
    setLightboxZoom(false);
  });
}
