// 文章目录使用真实锚点，复制链接或浏览器前进/后退也可定位。
(() => {
  'use strict';
  const links = [...document.querySelectorAll('.content > .aside > a.tab')];
  function sync() {
    const active = location.hash ? links.find(link => link.hash === location.hash) : links[0];
    for (const link of links) {
      link.classList.toggle('active', link === active);
      if (link === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }
  window.addEventListener('hashchange', sync);
  sync();

  const highlighter = window.hljs;
  if (highlighter) {
    for (const code of document.querySelectorAll('.content > .main pre > code')) {
      const language = [...code.classList].find(name => name.startsWith('language-'))?.slice(9);
      if (!language || language === 'text' || !highlighter.getLanguage(language)) code.className = 'hljs language-plaintext';
      else highlighter.highlightElement(code);
    }
  }
})();
