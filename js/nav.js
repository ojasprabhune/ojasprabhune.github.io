// js/nav.js
// Right-edge hover zone reveals the glass nav.
// On touch devices (no hover), tapping the trigger zone toggles it.
// A small arrow hint fades in after 2s and dismisses once the nav is used.

(function () {
  var trigger = document.getElementById('navTrigger');
  var nav     = document.getElementById('glassNav');
  if (!trigger || !nav) return;

  var hideTimer = null;

  function show() {
    clearTimeout(hideTimer);
    nav.classList.add('is-visible');
  }

  function scheduleHide() {
    hideTimer = setTimeout(function () {
      nav.classList.remove('is-visible');
    }, 380);
  }

  // ---- Hint arrow ----
  var hint      = document.getElementById('navHint');
  var hintTimer = null;

  function dismissHint() {
    if (!hint || !hint.classList.contains('is-shown')) return;
    clearTimeout(hintTimer);

    // Freeze the element at its current animated position so the opacity
    // fade happens in-place rather than snapping back to translateX(0).
    var computed = window.getComputedStyle(hint).transform;
    if (computed && computed !== 'none') {
      hint.style.transform = computed;
    }

    // Kill pointer-events immediately so the cursor resets at once.
    hint.style.pointerEvents = 'none';
    hint.style.cursor = 'default';

    hint.classList.remove('is-shown');

    // After the opacity transition (0.8s) completes, clear the frozen transform.
    setTimeout(function () {
      hint.style.transform  = '';
      hint.style.pointerEvents = '';
      hint.style.cursor     = '';
    }, 900);
  }

  if (hint) {
    hintTimer = setTimeout(function () {
      hint.classList.add('is-shown');
    }, 2000);

    hint.addEventListener('click', function (e) {
      // Stop propagation so the document-level click handler below does NOT
      // see this event and immediately close the nav we just opened.
      e.stopPropagation();
      show();
      dismissHint();
    });
  }

  // ---- Nav trigger ----
  trigger.addEventListener('mouseenter', function () {
    show();
    dismissHint();
  });
  trigger.addEventListener('mouseleave', scheduleHide);
  nav.addEventListener('mouseenter', show);
  nav.addEventListener('mouseleave', scheduleHide);

  // Touch: tap trigger to toggle, tap elsewhere to close.
  trigger.addEventListener('click', function (e) {
    e.stopPropagation();
    if (nav.classList.contains('is-visible')) {
      nav.classList.remove('is-visible');
    } else {
      show();
    }
    dismissHint();
  });

  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target) && !trigger.contains(e.target)) {
      nav.classList.remove('is-visible');
    }
  });
})();
