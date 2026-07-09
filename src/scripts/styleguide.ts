// Live sandbox for the house-style page: wires the accent control to CSS custom
// properties on :root so the whole page retints in real time. Removing an inline
// property lets it fall back to the stylesheet default (clean reset).
const root = document.documentElement;

const DEFAULT_ACCENT = '#1a3556'; // navy — the single brand / signal colour

const accent = document.querySelector<HTMLInputElement>('#sg-accent');
const reset = document.querySelector<HTMLButtonElement>('#sg-reset');

/** Mix an #rrggbb colour toward white by `amount` (0..1) -> rgb() string. */
function lighten(hex: string, amount: number): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const mix = (c: number) => Math.round(c + (255 - c) * amount);
  return `rgb(${mix((n >> 16) & 0xff)}, ${mix((n >> 8) & 0xff)}, ${mix(n & 0xff)})`;
}

/** Multiply an #rrggbb colour toward black by `amount` (0..1) -> rgb() string. */
function darken(hex: string, amount: number): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const f = 1 - amount;
  const c = (x: number) => Math.round(x * f);
  return `rgb(${c((n >> 16) & 0xff)}, ${c((n >> 8) & 0xff)}, ${c(n & 0xff)})`;
}

function applyAccent(hex: string): void {
  root.style.setProperty('--arc', hex);
  root.style.setProperty('--arc-deep', darken(hex, 0.18));
  root.style.setProperty('--arc-tint', lighten(hex, 0.88));
}

accent?.addEventListener('input', () => applyAccent(accent.value));

reset?.addEventListener('click', () => {
  ['--arc', '--arc-deep', '--arc-tint'].forEach((p) => root.style.removeProperty(p));
  if (accent) accent.value = DEFAULT_ACCENT;
});
