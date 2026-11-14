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

  // Small helpers shared by back-to-top and the screenshot carousel.
  const iconButton = (className, label, pathD, size) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = className;
    btn.setAttribute('aria-label', label);
    btn.innerHTML =
      `<svg viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true">` +
      `<path d="${pathD}" fill="none" stroke="currentColor" stroke-width="2" ` +
      'stroke-linecap="round" stroke-linejoin="round"/></svg>';
    return btn;
  };
  const scrollBehavior = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';

  // Back to top: appears once the page is scrolled past the first screen.
  const toTop = iconButton('to-top', 'Back to top', 'M12 19V5M5 12l7-7 7 7', 20);
  document.body.appendChild(toTop);
  const updateToTop = () => {
    toTop.classList.toggle('visible', window.scrollY > Math.max(600, window.innerHeight));
  };
  window.addEventListener('scroll', updateToTop, { passive: true });
  window.addEventListener('resize', updateToTop);
  updateToTop();
  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
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

  // Hero lamp (index.html): it runs its self-check once on load (under 5s,
  // WCAG 2.2.2). Hovering or tapping the lamp replays it, lamp and legend
  // together, once the previous run has finished.
  const heroArt = document.querySelector('.hero-art');
  const heroLamp = heroArt && heroArt.querySelector('.telltale');
  if (heroLamp && typeof heroArt.getAnimations === 'function') {
    const replay = () => {
      const runs = heroArt.getAnimations({ subtree: true });
      if (!runs.length || runs.some((a) => a.playState !== 'finished')) return;
      runs.forEach((a) => { a.currentTime = 0; a.play(); });
    };
    heroLamp.addEventListener('pointerenter', replay);
    heroLamp.addEventListener('click', replay);
  }

  // Screenshot carousel (index.html): arrow buttons step one screen at a
  // time, hide at either end, and the track fades on the side with more.
  document.querySelectorAll('.carousel').forEach((carousel) => {
    const track = carousel.querySelector('.shots');
    const items = track ? Array.from(track.children) : [];
    if (!items.length) return;
    const prev = iconButton('carousel-btn prev', 'Previous screenshot', 'M15 18l-6-6 6-6', 22);
    const next = iconButton('carousel-btn next', 'Next screenshot', 'M9 18l6-6-6-6', 22);
    [prev, next].forEach((btn) => {
      if (track.id) btn.setAttribute('aria-controls', track.id);
      carousel.appendChild(btn);
    });

    const maxScroll = () => track.scrollWidth - track.clientWidth;
    const offsetOf = (i) => items[i].offsetLeft - items[0].offsetLeft;
    const nearest = () => {
      let best = 0;
      items.forEach((_, i) => {
        if (Math.abs(offsetOf(i) - track.scrollLeft) < Math.abs(offsetOf(best) - track.scrollLeft)) best = i;
      });
      return best;
    };
    // While a smooth scroll is running, step from where it's heading, not
    // from where it is, so quick repeated clicks each move one screen.
    let target = null;
    let settle;
    const go = (sign) => {
      let i = Math.min(items.length - 1, Math.max(0, (target ?? nearest()) + sign));
      // Past the last reachable position, more steps don't move the track.
      while (i > 0 && offsetOf(i - 1) >= maxScroll()) i--;
      target = i;
      track.scrollTo({ left: offsetOf(i), behavior: scrollBehavior() });
    };
    prev.addEventListener('click', () => go(-1));
    next.addEventListener('click', () => go(1));

    const update = () => {
      const before = track.scrollLeft > 2;
      const after = track.scrollLeft < maxScroll() - 2;
      // A disabled button drops focus to <body>; hand it to the other arrow.
      const focused = document.activeElement;
      prev.disabled = !before;
      next.disabled = !after;
      if (focused === prev && prev.disabled && !next.disabled) next.focus();
      if (focused === next && next.disabled && !prev.disabled) prev.focus();
      carousel.classList.toggle('more-before', before);
      carousel.classList.toggle('more-after', after);
    };
    track.addEventListener('scroll', () => {
      update();
      clearTimeout(settle);
      settle = setTimeout(() => { target = null; }, 150);
    }, { passive: true });
    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(update);
      ro.observe(track);
      items.forEach((item) => ro.observe(item));
    } else {
      window.addEventListener('resize', update);
      window.addEventListener('load', update);
    }
    carousel.classList.add('is-enhanced');
    update();
  });

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
