const DESIGN_WIDTH = 1320;

document.querySelectorAll<HTMLElement>('[data-lifecycle-stage]').forEach((stage) => {
  const accordion = stage.querySelector<HTMLElement>('[data-lifecycle-accordion]');
  if (!accordion) return;

  const panels = Array.from(accordion.querySelectorAll<HTMLElement>('.lifecycle-panel'));
  const tabs = Array.from(accordion.querySelectorAll<HTMLButtonElement>('.lifecycle-trigger'));
  let activeIndex = Math.max(0, panels.findIndex((panel) => panel.classList.contains('is-active')));

  const scaleAccordion = () => {
    const scale = Math.min(1, stage.clientWidth / DESIGN_WIDTH);
    accordion.style.setProperty('--lifecycle-scale', String(scale));
  };

  const measureStageTitles = () => {
    accordion.classList.remove('titles-ready');

    panels.forEach((panel) => {
      const copy = panel.querySelector<HTMLElement>('.lifecycle-copy');
      const heading = copy?.querySelector<HTMLElement>('h3');
      if (!copy || !heading) return;

      const centerX = copy.offsetLeft + heading.offsetLeft + (heading.offsetWidth / 2);
      const centerY = copy.offsetTop + heading.offsetTop + (heading.offsetHeight / 2);
      panel.style.setProperty('--lifecycle-title-open-x', `${centerX}px`);
      panel.style.setProperty('--lifecycle-title-open-y', `${centerY}px`);
    });

    requestAnimationFrame(() => accordion.classList.add('titles-ready'));
  };

  const syncTabs = (index: number, shouldFocus: boolean) => {
    tabs.forEach((tab, tabIndex) => {
      const isActive = tabIndex === index;
      tab.setAttribute('aria-selected', String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
    });

    if (shouldFocus) tabs[index]?.focus();
  };

  const activate = (index: number, shouldFocus = false) => {
    activeIndex = (index + panels.length) % panels.length;

    panels.forEach((panel, panelIndex) => {
      const isActive = panelIndex === activeIndex;
      panel.classList.toggle('is-active', isActive);
      panel.querySelector<HTMLElement>('.lifecycle-copy')?.setAttribute('aria-hidden', String(!isActive));
    });

    syncTabs(activeIndex, shouldFocus);
  };

  scaleAccordion();
  measureStageTitles();

  new ResizeObserver(scaleAccordion).observe(stage);

  document.fonts?.ready.then(measureStageTitles);

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activate(Number(tab.dataset.lifecycleIndex)));
    tab.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        activate(activeIndex + 1, true);
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        activate(activeIndex - 1, true);
      } else if (event.key === 'Home') {
        event.preventDefault();
        activate(0, true);
      } else if (event.key === 'End') {
        event.preventDefault();
        activate(panels.length - 1, true);
      }
    });
  });

  // The outer corner clip leaves small transparent pockets across the first
  // rotated label. Treat those pockets as part of the first tab's hit target
  // without stealing clicks from the neighbouring tab.
  accordion.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('.lifecycle-trigger')) return;

    const firstTitle = panels[0]?.querySelector<HTMLElement>('.lifecycle-stage-title');
    if (!firstTitle) return;

    const bounds = firstTitle.getBoundingClientRect();
    if (
      event.clientX >= bounds.left &&
      event.clientX <= bounds.right &&
      event.clientY >= bounds.top &&
      event.clientY <= bounds.bottom
    ) {
      activate(0);
    }
  });
});
