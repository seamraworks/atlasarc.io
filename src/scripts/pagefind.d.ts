// Type surface for the Pagefind UI module, generated at build time into
// /pagefind/ and loaded by the browser at runtime. tsconfig `paths` maps the
// absolute runtime specifier `/pagefind/pagefind-ui.js` onto this file so
// search.ts type-checks under `strict` without Pagefind present at compile time.
export interface PagefindUIOptions {
  element: string;
  showSubResults?: boolean;
  [key: string]: unknown;
}

export class PagefindUI {
  constructor(options: PagefindUIOptions);
}
