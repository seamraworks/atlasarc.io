// Docs search — initialises the Pagefind UI when a #search container is present.
// The module is generated into /pagefind/ at build time; see pagefind.d.ts for
// the ambient declaration that keeps the strict tsc gate green.
import { PagefindUI } from '/pagefind/pagefind-ui.js';

const el = document.querySelector('#search');
if (el) {
  // eslint-disable-next-line no-new
  new PagefindUI({ element: '#search', showSubResults: true });
}
