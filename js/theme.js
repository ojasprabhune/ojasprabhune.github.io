// js/theme.js
// Reads window.themeConfig, merges global + page override + dark mode,
// then writes everything as CSS custom properties on <html>.
// Runs in <head> to prevent FOUC.

(function () {
  function toKebab(str) {
    return str.replace(/([A-Z])/g, '-$1').toLowerCase();
  }

  function mergeDeep(base, override) {
    if (!override) return Object.assign({}, base);
    const result = Object.assign({}, base);
    for (const key of Object.keys(override)) {
      if (
        typeof override[key] === 'object' &&
        override[key] !== null &&
        !Array.isArray(override[key]) &&
        typeof base[key] === 'object' &&
        base[key] !== null
      ) {
        result[key] = mergeDeep(base[key], override[key]);
      } else {
        result[key] = override[key];
      }
    }
    return result;
  }

  function getPageName() {
    // Pages can override via a URL param: ?page=research
    // Used by post.html to inherit a page's accent color.
    const param = new URLSearchParams(window.location.search).get('page');
    if (param) return param;
    return document.documentElement.dataset.page || 'home';
  }

  function isDark() {
    const saved = localStorage.getItem('theme-mode');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function applyConfig(cfg, dark) {
    const root = document.documentElement;
    const colors = dark && cfg.darkMode
      ? mergeDeep(cfg.colors, cfg.darkMode)
      : cfg.colors;

    for (const [k, v] of Object.entries(colors)) {
      root.style.setProperty(`--color-${toKebab(k)}`, v);
    }

    root.style.setProperty('--font-heading', cfg.fonts.heading);
    root.style.setProperty('--font-body',    cfg.fonts.body);
    root.style.setProperty('--font-mono',    cfg.fonts.mono);

    for (const [tag, styles] of Object.entries(cfg.headingStyles)) {
      for (const [prop, val] of Object.entries(styles)) {
        root.style.setProperty(`--${tag}-${toKebab(prop)}`, val);
      }
    }

    root.style.setProperty('--body-size',        cfg.bodyStyle.size);
    root.style.setProperty('--body-weight',      String(cfg.bodyStyle.weight));
    root.style.setProperty('--body-line-height', String(cfg.bodyStyle.lineHeight));

    root.dataset.theme = dark ? 'dark' : 'light';
  }

  function init() {
    const config = window.themeConfig;
    const page   = getPageName();
    const pageOverride = config.pages[page] || {};
    const merged = mergeDeep(config.global, pageOverride);
    applyConfig(merged, isDark());
  }

  // Exposed globally so any page can add a toggle button.
  window.toggleThemeMode = function () {
    const next = isDark() ? 'light' : 'dark';
    localStorage.setItem('theme-mode', next);
    init();
  };

  init();

  // Re-apply if the OS preference changes (only when no manual choice saved).
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
    if (!localStorage.getItem('theme-mode')) init();
  });
})();
