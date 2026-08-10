import { SECTIONS } from '../data/sections.js';
import { CLUSTERS, CLUSTER_ORDER } from '../data/clusters.js';
import { state } from '../core/state.js';
import { goToSection, goToProgress, step, goToPhase } from '../core/scroll.js';
import { make, clamp } from '../core/util.js';

export function createHud(root, actions) {
  const bar = make('header', 'hud hud--top', `
    <button class="mark" type="button" data-act="home" aria-label="Back to the beginning">
      <span class="mark__num">III</span>
      <span class="mark__txt"><b>Article III</b><i>Bill of Rights · 1987</i></span>
    </button>
    <div class="hud__mid"><span class="hud__phase"></span></div>
    <nav class="hud__tools">
      <button type="button" data-act="map" title="Map of all 22 sections (M)"><svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg><span>Map</span></button>
      <button type="button" data-act="quiz" title="Test yourself (T)"><svg viewBox="0 0 24 24"><path d="M9 9a3 3 0 114 2.8V13"/><circle cx="12" cy="17" r="1"/></svg><span>Test</span></button>
      <button type="button" data-act="sound" title="Ambient sound" aria-pressed="false"><svg viewBox="0 0 24 24"><path d="M5 10v4h3l4 3V7L8 10H5z"/><path class="wave" d="M16 9.5a4 4 0 010 5"/></svg><span class="sr">Sound</span></button>
      <button type="button" data-act="motion" title="Reduce motion" aria-pressed="false"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7"/><path d="M12 5v14"/></svg><span class="sr">Reduce motion</span></button>
    </nav>
  `);

  /* ── the rail: 22 ticks, grouped into the nine movements ─────────── */
  const railGroups = CLUSTER_ORDER.map((id) => {
    const cl = CLUSTERS[id];
    return `<div class="rail__group" data-cluster="${id}" style="--c:${cl.color}">
      ${cl.sections.map((n) => {
        const s = SECTIONS[n - 1];
        return `<button class="rail__tick" type="button" data-go="${n - 1}"
          aria-label="Section ${n}: ${s.title}">
          <i></i><span class="rail__tip"><b>§${n}</b> ${s.short}</span>
        </button>`;
      }).join('')}
    </div>`;
  }).join('');

  const rail = make('nav', 'hud rail', `
    <div class="rail__line"><span class="rail__fill"></span></div>
    <div class="rail__groups">${railGroups}</div>
  `);

  const foot = make('footer', 'hud hud--bottom', `
    <button class="nav-btn" type="button" data-act="prev" aria-label="Previous"><svg viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg></button>
    <div class="hud__pos">
      <span class="hud__poslabel"></span>
      <span class="hud__bar"><i></i></span>
    </div>
    <button class="nav-btn" type="button" data-act="next" aria-label="Next"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></button>
  `);

  root.append(bar, rail, foot);

  const railFill = rail.querySelector('.rail__fill');
  const ticks = [...rail.querySelectorAll('[data-go]')];
  const phaseLabel = bar.querySelector('.hud__phase');
  const posLabel = foot.querySelector('.hud__poslabel');
  const posBar = foot.querySelector('.hud__bar i');

  ticks.forEach((t) => t.addEventListener('click', () => goToSection(+t.dataset.go)));

  // Delegated on the document, not on `root`: the hero's "Begin" button and the
  // epilogue's actions live in #stage, not in the HUD, and must reach here too.
  document.addEventListener('click', (e) => {
    const b = e.target.closest?.('[data-act]');
    if (!b) return;
    const a = b.dataset.act;
    if (a === 'home') goToProgress(0);
    else if (a === 'prev') step(-1);
    else if (a === 'next') step(1);
    else if (a === 'begin') goToPhase('prologue');
    else if (a === 'restart') goToProgress(0);
    else actions[a]?.(b);
  });

  let lastLabel = '';
  let lastIdx = -2;

  function update() {
    const p = state.progress;
    railFill.style.transform = `scaleY(${clamp(p).toFixed(4)})`;

    if (state.sectionIndex !== lastIdx) {
      lastIdx = state.sectionIndex;
      ticks.forEach((t, i) => {
        t.classList.toggle('is-on', i === lastIdx);
        t.classList.toggle('is-past', i < lastIdx);
      });
    }

    let label = '';
    let pos = '';
    if (state.phase === 'hero') { label = 'Overture'; pos = 'Begin'; }
    else if (state.phase === 'prologue') {
      label = '1972 – 1987 · How the article was earned';
      pos = `Prologue ${Math.max(1, state.prologueIndex + 1)} / 7`;
    } else if (state.phase === 'colonnade') {
      const s = SECTIONS[state.sectionIndex] || SECTIONS[0];
      label = CLUSTERS[s.cluster].name;
      pos = `Section ${s.n} / 22`;
    } else { label = 'The charter, assembled'; pos = 'Epilogue'; }

    if (label !== lastLabel) { phaseLabel.textContent = label; lastLabel = label; }
    posLabel.textContent = pos;
    posBar.style.transform = `scaleX(${clamp(p).toFixed(4)})`;

    document.body.dataset.phase = state.phase;
  }

  function setToggle(actName, on) {
    const b = bar.querySelector(`[data-act="${actName}"]`);
    if (b) b.setAttribute('aria-pressed', String(on));
  }

  return { update, setToggle, bar, rail, foot };
}
