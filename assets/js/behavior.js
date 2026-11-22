// 首页：保留原有逐字动画和标签页布局。
(() => {
  'use strict';
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  async function animType() {
    const letters = document.querySelectorAll('main > .title > span');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    for (const letter of letters) {
      letter.style.display = 'block';
      if (!reduced) await sleep(100);
    }
  }
  animType();

  const buttons = [...document.querySelectorAll('.content > .aside > [data-tab-id]')];
  for (const button of buttons) {
    button.addEventListener('click', () => {
      for (const tab of buttons) {
        const selected = tab === button;
        tab.classList.toggle('active', selected);
        tab.setAttribute('aria-pressed', String(selected));
        document.getElementById(tab.getAttribute('aria-controls'))?.classList.toggle('active', selected);
      }
    });
  }
})();
