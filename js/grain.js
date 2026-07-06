// js/grain.js
// Draws a noisy red oval: smooth radial gradient with film-grain texture.
//
// TUNING KNOBS (search for these constants):
//   GRAIN        — grain intensity. Higher = more visible texture. Try 25–55.
//   GRAIN_TAPER  — how much grain reduces toward center (0 = uniform grain,
//                  1 = grain-free center fading to full grain at edge). Try 0.6–1.
//   EDGE_POWER   — controls softness of the edge fade.
//                  Lower (<1) = very soft, spreads wide.
//                  Higher (>1) = sharper, more concentrated oval.
//                  Try 0.4 (very soft) … 1.5 (sharp).
// These are also the three values to share with the user for live tuning.

(function () {
  var canvas = document.getElementById("grainOval");
  if (!canvas || !canvas.getContext) return;

  var ctx = canvas.getContext("2d");

  function hash(ix, iy) {
    var n = Math.sin(ix * 127.1 + iy * 311.7) * 43758.5453123;
    return n - Math.floor(n);
  }

  function parseHex(str) {
    str = (str || "").replace(/\s/g, "");
    if (str[0] === "#" && str.length === 7) {
      return {
        r: parseInt(str.slice(1, 3), 16),
        g: parseInt(str.slice(3, 5), 16),
        b: parseInt(str.slice(5, 7), 16),
      };
    }
    return { r: 228, g: 64, b: 42 };
  }

  function clamp(v) {
    return v < 0 ? 0 : v > 255 ? 255 : v;
  }

  function draw() {
    // ── Tuning knobs ──────────────────────────────────────────────────────────
    var GRAIN = 150; // grain brightness swing ±N out of 255
    var GRAIN_TAPER = 1; // how much grain fades toward center (0=uniform, 1=none at center)
    var EDGE_POWER = 2; // alpha falloff exponent — lower = longer, softer fade
    // ─────────────────────────────────────────────────────────────────────────

    var dpr = window.devicePixelRatio || 1;
    var rect = canvas.getBoundingClientRect();
    var cssW = rect.width;
    var cssH = rect.height;
    if (!cssW || !cssH) return;

    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);

    var W = canvas.width;
    var H = canvas.height;

    var accentStr = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-accent")
      .trim();
    var rgb = parseHex(accentStr);

    var imageData = ctx.createImageData(W, H);
    var data = imageData.data;

    var cx = W * 0.5;
    var cy = H * 0.5;
    // Oval fills the full canvas — the EDGE_POWER curve controls how quickly
    // it fades, so the canvas edges naturally become the fade zone.
    var rx = W * 0.5;
    var ry = H * 0.5;

    for (var py = 0; py < H; py++) {
      for (var px = 0; px < W; px++) {
        var dx = (px - cx) / rx;
        var dy = (py - cy) / ry;
        var dist = Math.sqrt(dx * dx + dy * dy);

        // Smooth alpha falloff from center (1.0) to edge (0).
        // EDGE_POWER < 1 keeps high alpha further out → softer, wider fade.
        var alpha = Math.max(0, Math.pow(Math.max(0, 1.0 - dist), EDGE_POWER));

        if (alpha <= 0) continue;

        // Grain: reduce toward center so white text is legible there.
        // GRAIN_TAPER = 0 → uniform grain. = 1 → zero grain at center.
        var grainScale = GRAIN_TAPER * dist + (1 - GRAIN_TAPER);
        var n = hash(px, py);
        var grain = (n - 0.5) * GRAIN * 2 * grainScale;

        var i = (py * W + px) * 4;
        data[i] = clamp(rgb.r + grain);
        data[i + 1] = clamp(rgb.g + grain);
        data[i + 2] = clamp(rgb.b + grain);
        data[i + 3] = Math.round(alpha * 255);
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", draw);
  } else {
    draw();
  }

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(draw, 120);
  });

  var _orig = window.toggleThemeMode;
  window.toggleThemeMode = function () {
    if (_orig) _orig();
    draw();
  };
})();
