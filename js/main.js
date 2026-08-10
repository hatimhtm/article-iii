import { renderDocument, renderIndex } from './ui/document.js';
import { createOverlays } from './ui/overlays.js';
import { readState } from './core/read.js';

const doc = document.querySelector('#doc');
const tocEl = document.querySelector('#toc');

renderDocument(doc);
const toc = renderIndex(tocEl);
const overlays = createOverlays(document.querySelector('#overlays'));

/* ── masthead ──────────────────────────────────────────────────────── */
const mast = document.querySelector('#masthead');
mast.innerHTML = `
  <a class="mast__mark" href="#top">
    <b>III</b><span>Article III · Bill of Rights</span>
  </a>
  <div class="mast__progress" aria-hidden="true"><i></i></div>
  <nav class="mast__nav">
    <span class="mast__read">0/22</span>
    <button type="button" data-act="index" title="Search the article (I)">Index</button>
    <button type="button" data-act="quiz" title="Test yourself (T)">Test</button>
    <button class="mast__toc" type="button" data-act="toc" aria-label="Contents" aria-expanded="false">
      <svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
    </button>
  </nav>`;
const mastBar = mast.querySelector('.mast__progress i');
const mastRead = mast.querySelector('.mast__read');
readState.onChange(() => { mastRead.textContent = `${readState.size}/22`; });
mastRead.textContent = `${readState.size}/22`;

/* ── actions ───────────────────────────────────────────────────────── */
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-act]');
  if (b) {
    const a = b.dataset.act;
    if (a === 'quiz') overlays.open('quiz');
    else if (a === 'index') overlays.open('map');
    else if (a === 'toc') toggleToc();
    return;
  }
  // tapping an index link on mobile closes the drawer
  if (e.target.closest('#toc a')) closeToc();
});

function toggleToc() {
  const open = document.documentElement.classList.toggle('toc-open');
  mast.querySelector('.mast__toc').setAttribute('aria-expanded', String(open));
}
function closeToc() {
  document.documentElement.classList.remove('toc-open');
  mast.querySelector('.mast__toc').setAttribute('aria-expanded', 'false');
}

/* ── scroll position: progress bar + current section + auto-read ───── */
const laws = [...doc.querySelectorAll('.law')];
let current = -1;

const seen = new Map(); // n -> timestamp the section entered the viewport
const watcher = new IntersectionObserver((entries) => {
  for (const en of entries) {
    const n = +en.target.dataset.n;
    if (en.isIntersecting) {
      seen.set(n, performance.now());
      if (n !== current) { current = n; toc.setCurrent(n); }
    } else if (seen.has(n)) {
      // dwelling on a section for a while is reading it
      if (performance.now() - seen.get(n) > 20000) readState.mark(n, true);
      seen.delete(n);
    }
  }
}, { rootMargin: '-20% 0px -55% 0px' });
laws.forEach((el) => watcher.observe(el));

/* gentle reveals — content settles like paper, never flies */
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const reveal = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (en.isIntersecting) {
        en.target.classList.add('is-in');
        reveal.unobserve(en.target);
      }
    }
  }, { rootMargin: '0px 0px -8% 0px' });
  doc.querySelectorAll('.law, .chapter__head, .beat, .closing__note, .frontis > *')
    .forEach((el) => { el.classList.add('will-reveal'); reveal.observe(el); });
}

let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const h = document.documentElement.scrollHeight - innerHeight;
    mastBar.style.transform = `scaleX(${h ? (scrollY / h).toFixed(4) : 0})`;
    document.documentElement.classList.toggle('scrolled', scrollY > 40);
    ticking = false;
  });
}, { passive: true });

/* ── keyboard ──────────────────────────────────────────────────────── */
const goTo = (n) => document.querySelector(`#s${n}`)?.scrollIntoView({
  behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
  block: 'start',
});

window.addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const tag = document.activeElement?.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA') return;
  if (overlays.isOpen()) return;

  switch (e.key) {
    case 'j': case 'ArrowRight':
      e.preventDefault(); goTo(Math.min((current < 1 ? 0 : current) + 1, 22)); break;
    case 'k': case 'ArrowLeft':
      e.preventDefault(); goTo(Math.max((current < 1 ? 2 : current) - 1, 1)); break;
    case 'i': case 'I': case 'm': case 'M':
      e.preventDefault(); overlays.open('map'); break;
    case 't': case 'T':
      e.preventDefault(); overlays.open('quiz'); break;
    default:
      if (/^[1-9]$/.test(e.key)) { e.preventDefault(); goTo(+e.key); }
  }
});

/* deep links like #s12 work natively; nothing to do but let them land */
requestAnimationFrame(() => document.documentElement.classList.add('is-ready'));
