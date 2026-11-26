const carousel = document.querySelector('.featured-work');
const track = carousel.querySelector('.featured-grid');
const slides = Array.from(track.querySelectorAll('.featured-project'));
const controls = carousel.querySelector('.carousel-controls');
const previous = controls.querySelector('.carousel-previous');
const next = controls.querySelector('.carousel-next');
const position = controls.querySelector('.carousel-position');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const korean = document.documentElement.lang === 'ko';
const labels = korean
  ? {
      region: '작업 모음',
      carousel: '캐러셀',
      previous: '이전 작업',
      next: '다음 작업',
      position: (index, total, title) => `${total}개 중 ${index}번째 작업: ${title}`
    }
  : {
      region: 'Selected work',
      carousel: 'carousel',
      previous: 'Previous project',
      next: 'Next project',
      position: (index, total, title) => `Project ${index} of ${total}: ${title}`
    };

let active = 0;
let scrollTimer;
let pendingIndex = null;

function update() {
  const title = slides[active].querySelector('h2').textContent;
  position.textContent = `${String(active + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  position.setAttribute('aria-label', labels.position(active + 1, slides.length, title));
}

function goTo(index) {
  clearTimeout(scrollTimer);
  active = (index + slides.length) % slides.length;
  pendingIndex = active;
  update();
  const trackBounds = track.getBoundingClientRect();
  const slideBounds = slides[active].getBoundingClientRect();
  track.scrollTo({
    left: track.scrollLeft + slideBounds.left - trackBounds.left - (track.clientWidth - slideBounds.width) / 2,
    behavior: reducedMotion.matches ? 'instant' : 'smooth'
  });
}

carousel.setAttribute('role', 'region');
carousel.setAttribute('aria-roledescription', labels.carousel);
carousel.setAttribute('aria-label', labels.region);
previous.setAttribute('aria-label', labels.previous);
next.setAttribute('aria-label', labels.next);
carousel.classList.add('is-carousel');
controls.hidden = false;
update();

previous.addEventListener('click', () => {
  goTo(active - 1);
});
next.addEventListener('click', () => {
  goTo(active + 1);
});
function handleInteraction() {
  pendingIndex = null;
}

track.addEventListener('pointerdown', handleInteraction);
track.addEventListener('wheel', handleInteraction, { passive: true });
track.addEventListener('focusin', () => { pendingIndex = null; });
track.addEventListener('scroll', () => {
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => {
    const center = track.getBoundingClientRect().left + track.clientWidth / 2;
    const closest = slides.reduce((closest, slide, index) => {
      const bounds = slide.getBoundingClientRect();
      const distance = Math.abs(bounds.left + bounds.width / 2 - center);
      return distance < closest.distance ? { index, distance } : closest;
    }, { index: 0, distance: Infinity }).index;
    if (pendingIndex !== null && closest !== pendingIndex) return;
    pendingIndex = null;
    active = closest;
    update();
  }, 100);
}, { passive: true });
