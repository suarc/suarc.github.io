(() => {
  'use strict';
  const nav = document.querySelector('nav');
  const form = nav.querySelector('.searchBar');
  const query = form.querySelector('input');
  const submit = form.querySelector('button');
  const panel = document.querySelector('#search-results');
  const status = panel.querySelector('.searchStatus');
  const results = panel.querySelector('.searchItems');
  const assetPrefix = nav.querySelector('.title').href;
  const menu = nav.querySelector('.mobile-links');
  menu?.addEventListener('click', event => {
    if (event.target.closest('a')) menu.open = false;
  });
  const refreshNav = () => nav.classList.toggle('light', window.scrollY !== 0);
  window.addEventListener('scroll', refreshNav, { passive: true });
  refreshNav();

  const normalize = text => text.normalize('NFKC').toLowerCase();
  const entries = (window.CODEDESK_SEARCH_INDEX ?? []).map(item => ({
    ...item, titleKey: normalize(item.title), tagsKey: normalize([...item.tags,item.category].join(' ')),
    textKey: normalize(item.text),
  }));

  function snippet(item, terms) {
    const match = terms.map(term => item.textKey.indexOf(term)).filter(index => index >= 0);
    const start = match.length ? Math.max(0, Math.min(...match) - 20) : 0;
    const trimmed = item.text.slice(start,start + 105);
    return (start ? '…' : '') + trimmed + (start + trimmed.length < item.text.length ? '…' : '');
  }
  function render() {
    const terms = [...new Set(normalize(query.value).trim().split(/\s+/).filter(Boolean))];
    results.replaceChildren();
    if (!terms.length) {
      panel.hidden = true;
      submit.setAttribute('aria-expanded', 'false');
      status.textContent = '';
      return;
    }
    panel.hidden = false;
    submit.setAttribute('aria-expanded', 'true');
    const matches = entries.map(item => ({
      item, score: terms.reduce((score, term) => {
        if (score < 0) return score;
        if (item.titleKey.includes(term)) return score + 8;
        if (item.tagsKey.includes(term)) return score + 4;
        if (item.textKey.includes(term)) return score + 1;
        return -1;
      }, 0),
    })).filter(match => match.score >= 0).sort((a,b) => b.score - a.score);
    status.textContent = matches.length ? '找到 ' + matches.length + ' 篇笔记' : '没有找到匹配的笔记。';
    for (const {item} of matches) {
      const link = document.createElement('a');
      link.className = 'item';
      link.href = new URL(item.target, assetPrefix).href;
      const image = document.createElement('img');
      image.alt = '';
      image.src = new URL('assets/img/' + item.cover, assetPrefix).href;
      const copy = document.createElement('div');
      copy.className = 'textArea';
      const title = document.createElement('span');
      title.textContent = item.title;
      const summary = document.createElement('span');
      summary.textContent = snippet(item,terms) || item.category;
      copy.append(title,summary);
      link.append(image,copy);
      results.append(link);
    }
  }
  function open() {
    if (menu) menu.open = false;
    nav.classList.add('searching');
    form.classList.add('active');
    render();
  }
  function close() {
    nav.classList.remove('searching');
    form.classList.remove('active');
    panel.hidden = true;
    submit.setAttribute('aria-expanded', 'false');
  }
  form.addEventListener('focusin', open);
  query.addEventListener('click', open);
  query.addEventListener('input', open);
  form.addEventListener('submit', event => {
    event.preventDefault();
    open();
    if (query.value.trim()) results.querySelector('a')?.focus();
    else query.focus();
  });
  for (const eventName of ['pointerdown','focusin']) {
    document.addEventListener(eventName, event => {
      if (!form.contains(event.target) && !panel.contains(event.target)) close();
      if (menu?.open && !menu.contains(event.target)) menu.open = false;
    });
  }
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu?.open && menu.contains(event.target)) {
      menu.open = false;
      menu.querySelector('summary').focus();
    }
    if (!form.contains(event.target) && !panel.contains(event.target)) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      if (event.target !== query) query.focus({preventScroll:true});
      close();
    } else if (!panel.hidden && ['ArrowUp','ArrowDown'].includes(event.key)) {
      const links = [...results.querySelectorAll('a')];
      const i = links.indexOf(document.activeElement);
      const next = i + (event.key === 'ArrowDown' ? 1 : -1);
      if (links.length) {
        event.preventDefault();
        (next < 0 ? query : links[Math.min(next, links.length-1)]).focus();
      }
    } else if (event.target === query && event.key.length === 1 && !nav.classList.contains('searching')) {
      open();
    }
  });
})();
