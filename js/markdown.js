// js/markdown.js
// Fetches a Markdown file and renders it into a container using marked.js.
// Requires marked.js to be loaded first (CDN in the HTML).
//
// Usage:
//   MarkdownLoader.render(urlToMarkdownFile, '#container-selector')
//
// The markdown file path is relative to the page calling this function.
// Note: fetch() requires a server (http:// or https://) — it won't work
// when opening HTML files directly from the filesystem (file://). Use
// `python3 -m http.server` or any static server when developing locally.

window.MarkdownLoader = (function () {
  function render(url, containerSelector, titleSelector) {
    var container = document.querySelector(containerSelector);
    if (!container) return;

    container.innerHTML = '<p class="loading">Loading…</p>';

    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.text();
      })
      .then(function (text) {
        container.innerHTML = window.marked.parse(text);
        container.classList.add('prose');

        // Set the page title from the first H1, if a title selector was given.
        if (titleSelector) {
          var firstH1 = container.querySelector('h1');
          var titleEl = document.querySelector(titleSelector);
          if (firstH1 && titleEl) {
            titleEl.textContent = firstH1.textContent;
            document.title = firstH1.textContent + ' — ojasprabhune';
          }
        }

        // Wire up scroll-reveal on rendered elements.
        container.querySelectorAll('h2, h3, p, ul, ol, blockquote, pre, table').forEach(function (el) {
          el.classList.add('reveal');
        });
        if (window.ScrollReveal) window.ScrollReveal.init();
      })
      .catch(function (err) {
        container.innerHTML = '<p class="error">Could not load post (' + err.message + ').</p>';
      });
  }

  return { render: render };
})();
