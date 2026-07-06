// js/scroll.js
// Scroll-triggered reveal (.reveal → .is-visible via IntersectionObserver)
// and optional parallax (data-parallax="0.3" on any element).

(function () {
  // ---- Scroll reveal ----
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' });

    els.forEach(function (el) { observer.observe(el); });
  }

  // ---- Parallax ----
  function initParallax() {
    var els = Array.from(document.querySelectorAll('[data-parallax]'));
    if (!els.length) return;

    // Respect prefers-reduced-motion.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    function tick() {
      var scrollY = window.scrollY;
      els.forEach(function (el) {
        var speed = parseFloat(el.dataset.parallax) || 0.3;
        el.style.transform = 'translateY(' + (scrollY * speed) + 'px)';
      });
    }

    window.addEventListener('scroll', tick, { passive: true });
    tick();
  }

  // Expose so markdown.js can re-run after dynamic content loads.
  window.ScrollReveal = { init: initReveal };

  document.addEventListener('DOMContentLoaded', function () {
    initReveal();
    initParallax();
  });
})();
