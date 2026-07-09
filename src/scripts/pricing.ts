// --- Plan card tilt + spotlight ------------------------------------------------

const planCols = document.querySelectorAll<HTMLElement>('.plan-col');

planCols.forEach((card) => {
  let settling = false;

  card.addEventListener('mouseenter', (e) => {
    settling = true;
    const r = card.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width  / 2)) / (r.width  / 2);
    const dy = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2);
    // Ease into the correct entry angle — prevents the (0,0) → cursor snap glitch.
    card.style.transition = 'transform 0.2s cubic-bezier(0.2,0.7,0.2,1)';
    card.style.setProperty('--rx', `${(-(dy * 2)).toFixed(2)}deg`);
    card.style.setProperty('--ry', `${(  (dx * 3)).toFixed(2)}deg`);
  });

  card.addEventListener('mousemove', (e) => {
    if (settling) {
      settling = false;
      card.style.transition = 'none'; // switch to instant tracking after entry easing
    }
    const r = card.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width  / 2)) / (r.width  / 2);
    const dy = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2);
    const rx = (-(dy * 2)).toFixed(2);
    const ry =  ( (dx * 3)).toFixed(2);
    const sx = (((e.clientX - r.left) / r.width)  * 100).toFixed(1);
    const sy = (((e.clientY - r.top)  / r.height) * 100).toFixed(1);
    card.style.setProperty('--rx', `${rx}deg`);
    card.style.setProperty('--ry', `${ry}deg`);
    card.style.setProperty('--spotlight-x', `${sx}%`);
    card.style.setProperty('--spotlight-y', `${sy}%`);
  });

  card.addEventListener('mouseleave', () => {
    settling = false;
    card.style.transition = '';
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
  });

  card.addEventListener('click', (e) => {
    // Let links and buttons handle themselves; delegate everything else to the CTA.
    if ((e.target as Element).closest('a, button')) return;
    card.querySelector<HTMLAnchorElement>('.plan-cta a')?.click();
  });
});

// --- Pack size toggle (Team column only) --------------------------------------

const packOpts    = document.querySelectorAll<HTMLButtonElement>('.pack-opt');
const packAmounts = document.querySelectorAll<HTMLElement>('.plan-amount[data-five]');
const packNotes   = document.querySelectorAll<HTMLElement>('.plan-billing-note[data-five]');

packOpts.forEach((opt) => {
  opt.addEventListener('click', () => {
    packOpts.forEach((o) => o.classList.remove('is-active'));
    opt.classList.add('is-active');
    const pack = opt.dataset['pack'] ?? 'five';

    packAmounts.forEach((el) => {
      el.style.opacity = '0';
      setTimeout(() => {
        el.textContent = el.dataset[pack] ?? '';
        el.style.opacity = '1';
      }, 120);
    });

    packNotes.forEach((el) => {
      el.textContent = el.dataset[pack] ?? '';
    });
  });
});

// --- Billing toggle (individual plans only) -----------------------------------

const opts    = document.querySelectorAll<HTMLButtonElement>('.billing-opt');
const amounts = document.querySelectorAll<HTMLElement>('.plan-amount[data-monthly]');
const periods = document.querySelectorAll<HTMLElement>('.plan-period[data-monthly]');
const notes   = document.querySelectorAll<HTMLElement>('.plan-billing-note[data-monthly]');

opts.forEach((opt) => {
  opt.addEventListener('click', () => {
    opts.forEach((o) => o.classList.remove('is-active'));
    opt.classList.add('is-active');
    const billing = opt.dataset['billing'] ?? 'monthly';

    amounts.forEach((el) => {
      el.style.opacity = '0';
      setTimeout(() => {
        el.textContent = el.dataset[billing] ?? '';
        el.style.opacity = '1';
      }, 120);
    });

    periods.forEach((el) => {
      el.textContent = el.dataset[billing] ?? '';
    });

    notes.forEach((el) => {
      el.textContent = el.dataset[billing] ?? '';
    });
  });
});
