// Mobile nav toggle, back-to-top button and Help Center search.
// Same behavior as glowscroll.lixlink.com's main.js, plus: a link to a
// question's #id (e.g. from in-app help) opens that question.
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    links.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Back to top: appears once the page is scrolled past the first screen.
  const toTop = document.createElement('button');
  toTop.type = 'button';
  toTop.className = 'to-top';
  toTop.setAttribute('aria-label', 'Back to top');
  toTop.innerHTML =
    '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">' +
    '<path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round"/></svg>';
  document.body.appendChild(toTop);
  const updateToTop = () => {
    toTop.classList.toggle('visible', window.scrollY > Math.max(600, window.innerHeight));
  };
  window.addEventListener('scroll', updateToTop, { passive: true });
  window.addEventListener('resize', updateToTop);
  updateToTop();
  toTop.addEventListener('click', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'instant' : 'smooth' });
    document.querySelector('header a, main a')?.focus({ preventScroll: true });
  });

  // Open a linked question (faq.html#backup-on).
  const openFromHash = () => {
    const id = decodeURIComponent(location.hash.slice(1));
    const target = id && document.getElementById(id);
    if (target && target.tagName === 'DETAILS') {
      target.open = true;
      target.scrollIntoView();
    }
  };
  window.addEventListener('hashchange', openFromHash);
  openFromHash();

  // Help Center search (faq.html only).
  const search = document.getElementById('faq-search');
  if (!search) return;
  const groups = Array.from(document.querySelectorAll('.faq-group'));
  const empty = document.getElementById('faq-empty');

  search.addEventListener('input', () => {
    const query = search.value.trim().toLowerCase();
    let anyVisible = false;
    groups.forEach((group) => {
      let groupHasMatch = false;
      group.querySelectorAll('.faq-item').forEach((item) => {
        const matches = query === '' || item.textContent.toLowerCase().includes(query);
        item.hidden = !matches;
        if (matches) {
          groupHasMatch = true;
          anyVisible = true;
          if (query !== '') item.open = true;
        } else {
          item.open = false;
        }
      });
      group.hidden = !groupHasMatch;
    });
    if (empty) empty.style.display = anyVisible ? 'none' : 'block';
  });
});
