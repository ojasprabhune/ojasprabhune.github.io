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
  });
