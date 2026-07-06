// js/gallery.js
// Duplicates each .marquee-track so the loop is seamless.
// Pause-on-hover is handled in CSS (animation-play-state).

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.marquee').forEach(function (marquee) {
      var track = marquee.querySelector('.marquee-track');
      if (!track) return;

      // Clone the track so items loop without a gap or jump.
      var clone = track.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      marquee.appendChild(clone);
    });
  });
})();
