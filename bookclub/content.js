function inline(text) {
  const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return escaped.replace(/\*(.+?)\*/g, '<em>$1</em>');
}

function parse(text) {
  const site = { sections: {} };
  let section = site;
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const heading = line.match(/^==\s*(.+?)\s*==$/);
    if (heading) {
      section = site.sections[heading[1]] = { rows: [] };
      continue;
    }
    if (section !== site && (line.includes('|') || !line.includes(':'))) {
      section.rows.push(line.split('|').map(s => s.trim()));
      continue;
    }
    const i = line.indexOf(':');
    section[line.slice(0, i).trim().toLowerCase()] = line.slice(i + 1).trim();
  }
  return site;
}

function fill(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

fetch('content.txt', { cache: 'no-cache' })
  .then(r => r.text())
  .then(text => {
    const site = parse(text);
    const page = document.body.dataset.page;
    const s = site.sections[page] || { rows: [] };

    document.title = page === 'Home' ? site['club name'] : `${page} - ${site['club name']}`;
    fill('club', inline(site['club name']));
    fill('subtitle', inline(site.subtitle));
    fill('heading', inline(s.heading || ''));
    fill('welcome', inline(s.welcome || ''));
    fill('intro', inline(s.intro || ''));

    fill('members', s.rows.map(([name, photo, fact]) => `
      <div class="member">
        <img src="${photo}" alt="${name}">
        <div>
          <h3>${inline(name)}</h3>
          <p>${inline(fact || '')}</p>
        </div>
      </div>`).join(''));

    fill('schedule', s.rows.map(row => row.length === 1
      ? `<tr class="break"><td colspan="3">${inline(row[0])}</td></tr>`
      : `<tr><td>#${inline(row[0])}</td><td>${inline(row[1])}</td><td>${inline(row[2] || '')}</td></tr>`
    ).join(''));

    // Meeting minutes: every row of the section becomes one card, first row
    // first, so the newest meeting goes at the top of the list in content.txt.
    const reel = document.getElementById('minutes-reel');
    if (reel) {
      const topics = ['DISCUSSION', 'TRACKING THEMES/MOTIFS'];
      reel.innerHTML = s.rows.filter(r => r.length >= 3).map(([title, p1, p2, t1, t2]) => `
        <article class="minutes">
          <h3>${inline(title)}</h3>
          <figure>
            <figcaption>Handout Side 1<br>${inline(t1 || topics[0])}</figcaption>
            <button class="zoom" type="button"><img src="${p1}" alt="${inline(title)} handout, side 1" loading="lazy"></button>
          </figure>
          <figure>
            <figcaption>Handout Side 2<br>${inline(t2 || topics[1])}</figcaption>
            <button class="zoom" type="button"><img src="${p2}" alt="${inline(title)} handout, side 2" loading="lazy"></button>
          </figure>
        </article>`).join('');
    }

    // Reel arrows and counter; they stay hidden until there is a second
    // meeting to flip to.
    const nav = document.getElementById('reelNav');
    if (reel && nav && reel.querySelectorAll('.minutes').length >= 2) {
      const counter = document.getElementById('counter');
      const prev = document.getElementById('prev');
      const next = document.getElementById('next');
      const count = () => reel.querySelectorAll('.minutes').length;
      const index = () => Math.round(reel.scrollLeft / reel.clientWidth);
      const show = (i) => {
        const n = count();
        reel.scrollTo({ left: Math.max(0, Math.min(n - 1, i)) * reel.clientWidth, behavior: 'smooth' });
      };
      const update = () => {
        const i = index(), n = count();
        counter.textContent = `${i + 1} / ${n}`;
        prev.disabled = i <= 0;
        next.disabled = i >= n - 1;
      };
      nav.hidden = false;
      prev.addEventListener('click', () => show(index() - 1));
      next.addEventListener('click', () => show(index() + 1));
      let raf = 0;
      reel.addEventListener('scroll', () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(update);
      }, { passive: true });
      window.addEventListener('resize', update);
      update();
    }

    // Lightbox: a handout fills the screen; click it or anywhere else to put
    // it back. The fade only runs one way in, so closing is a quick release.
    const lightbox = document.getElementById('lightbox');
    if (reel && lightbox) {
      const lightboxImg = document.getElementById('lightboxImg');
      let hideTimer = 0;
      const open = (img) => {
        clearTimeout(hideTimer);
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => lightbox.classList.add('on'));
      };
      const close = () => {
        lightbox.classList.remove('on');
        document.body.style.overflow = '';
        hideTimer = setTimeout(() => {
          lightbox.hidden = true;
          lightboxImg.src = '';
        }, 200);
      };
      reel.querySelectorAll('.zoom').forEach((btn) => {
        btn.addEventListener('click', () => open(btn.querySelector('img')));
      });
      lightbox.addEventListener('click', close);
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !lightbox.hidden) close();
      });
    }
  });
