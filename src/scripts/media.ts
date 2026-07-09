// Lightweight media interactions: click-to-zoom for screenshots tagged with
// [data-lightbox]. Motion clips can be lazy-loaded here later.
export {};

document.querySelectorAll<HTMLElement>('[data-lightbox]').forEach((el) => {
  el.addEventListener('click', () => el.classList.toggle('is-zoomed'));
});
