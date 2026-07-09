// Mobile navigation toggle for both chromes.
const toggle = document.querySelector<HTMLButtonElement>('.nav-toggle');
const header = document.querySelector<HTMLElement>('.site-header');

toggle?.addEventListener('click', () => {
  const open = header?.classList.toggle('nav-open') ?? false;
  toggle.setAttribute('aria-expanded', String(open));
});

// Docs sidebar collapse toggle (mobile only).
const sidebarToggle = document.querySelector<HTMLButtonElement>('.sidebar-toggle');
const sidebar = document.querySelector<HTMLElement>('.docs-sidebar');

const normalizePath = (value: string): string => {
  const normalized = value.replace(/\/+$/, '');
  return normalized === '' ? '/' : normalized;
};

const scrollActiveDocsLinkIntoView = (): void => {
  if (!sidebar) return;

  const activeLinks = Array.from(sidebar.querySelectorAll<HTMLAnchorElement>('.docs-nav a.is-active'));
  if (activeLinks.length === 0) return;

  const currentPath = normalizePath(window.location.pathname);
  const target =
    activeLinks.find((link) => normalizePath(new URL(link.href, window.location.origin).pathname) === currentPath)
    ?? activeLinks[activeLinks.length - 1];

  if (!target) return;

  const sidebarStyles = window.getComputedStyle(sidebar);
  const sidebarCanScrollInternally =
    (sidebarStyles.overflowY === 'auto' || sidebarStyles.overflowY === 'scroll')
    && sidebar.scrollHeight > sidebar.clientHeight + 1;

  if (!sidebarCanScrollInternally) {
    target.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
      behavior: 'auto',
    });
    return;
  }

  const sidebarRect = sidebar.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const inset = 24;
  const visibleTop = sidebarRect.top + inset;
  const visibleBottom = sidebarRect.bottom - inset;

  if (targetRect.top >= visibleTop && targetRect.bottom <= visibleBottom) return;

  const nextScrollTop = sidebar.scrollTop + (targetRect.top - sidebarRect.top) - inset;
  sidebar.scrollTo({
    top: Math.max(0, nextScrollTop),
    behavior: 'auto',
  });
};

if (sidebar) {
  window.addEventListener('load', () => {
    const sidebarStyles = window.getComputedStyle(sidebar);
    const sidebarCanScrollInternally =
      (sidebarStyles.overflowY === 'auto' || sidebarStyles.overflowY === 'scroll')
      && sidebar.scrollHeight > sidebar.clientHeight + 1;
    if (sidebarCanScrollInternally) {
      requestAnimationFrame(scrollActiveDocsLinkIntoView);
    }
  }, { once: true });
}

sidebarToggle?.addEventListener('click', () => {
  const open = sidebar?.classList.toggle('is-open') ?? false;
  sidebarToggle.setAttribute('aria-expanded', String(open));
  if (open) {
    requestAnimationFrame(scrollActiveDocsLinkIntoView);
  }
});
