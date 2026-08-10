/**
 * Engraved ornaments, in the manner of statute-book chapter plates.
 * One consistent line language: 1.5px ink strokes, sparse hatching,
 * no fills except the gold of the seal.
 */

const S = 'fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';
const THIN = 'fill="none" stroke="currentColor" stroke-width="0.8" stroke-linecap="round"';

/** The eight-rayed sun with the three stars, engraved as a seal. */
export function sealSVG(size = 120) {
  const rays = [];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
    const x1 = 60 + Math.cos(a) * 22, y1 = 60 + Math.sin(a) * 22;
    const x2 = 60 + Math.cos(a) * 38, y2 = 60 + Math.sin(a) * 38;
    rays.push(`<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`);
    const b = a + Math.PI / 8;
    const x3 = 60 + Math.cos(b) * 22, y3 = 60 + Math.sin(b) * 22;
    const x4 = 60 + Math.cos(b) * 30, y4 = 60 + Math.sin(b) * 30;
    rays.push(`<line x1="${x3.toFixed(1)}" y1="${y3.toFixed(1)}" x2="${x4.toFixed(1)}" y2="${y4.toFixed(1)}"/>`);
  }
  const star = (cx, cy) => {
    let p = '';
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      const r = i % 1 === 0 ? 4.6 : 2;
      p += `${i ? 'L' : 'M'}${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)}`;
      const b = a + Math.PI / 5;
      p += `L${(cx + Math.cos(b) * 2).toFixed(1)} ${(cy + Math.sin(b) * 2).toFixed(1)}`;
    }
    return `<path d="${p}Z"/>`;
  };
  return `<svg viewBox="0 0 120 120" width="${size}" height="${size}" aria-hidden="true" ${S}>
    <circle cx="60" cy="60" r="56"/>
    <circle cx="60" cy="60" r="51"/>
    <circle cx="60" cy="60" r="14"/>
    ${rays.join('')}
    ${star(60, 14)} ${star(20, 92)} ${star(100, 92)}
  </svg>`;
}

/** Cell bars for the prologue — the darkness before the article. */
export function barsSVG() {
  const bars = [];
  for (let i = 0; i < 7; i++) {
    const x = 12 + i * 16;
    bars.push(`<line x1="${x}" y1="6" x2="${x}" y2="114"/>`);
  }
  return `<svg viewBox="0 0 120 120" aria-hidden="true" ${S}>
    <rect x="4" y="6" width="112" height="10"/>
    <rect x="4" y="104" width="112" height="10"/>
    ${bars.join('')}
  </svg>`;
}

/** Chapter emblems, keyed by cluster id. */
export const EMBLEMS = {
  /* the balance — §1 */
  foundation: `<svg viewBox="0 0 120 120" aria-hidden="true" ${S}>
    <line x1="60" y1="18" x2="60" y2="96"/>
    <line x1="22" y1="30" x2="98" y2="30"/>
    <circle cx="60" cy="18" r="4"/>
    <path d="M22 30 L12 58 M22 30 L32 58 M12 58 a10 10 0 0 0 20 0"/>
    <path d="M98 30 L88 58 M98 30 L108 58 M88 58 a10 10 0 0 0 20 0"/>
    <path d="M44 96 h32 M40 104 h40"/>
  </svg>`,
  /* the threshold — a door held shut, §2–3 */
  security: `<svg viewBox="0 0 120 120" aria-hidden="true" ${S}>
    <path d="M28 108 V36 a32 32 0 0 1 64 0 v72"/>
    <path d="M40 108 V40 a20 20 0 0 1 40 0 v68"/>
    <line x1="18" y1="108" x2="102" y2="108"/>
    <circle cx="72" cy="74" r="4"/>
    <line x1="40" y1="62" x2="80" y2="62" stroke-width="3"/>
  </svg>`,
  /* the press and the word — §4–5 */
  conscience: `<svg viewBox="0 0 120 120" aria-hidden="true" ${S}>
    <path d="M24 96 C40 88 80 88 96 96 M24 96 V34 C40 26 56 26 60 32 C64 26 80 26 96 34 V96"/>
    <line x1="60" y1="32" x2="60" y2="94"/>
    <g ${THIN}>
      <line x1="32" y1="44" x2="52" y2="41"/><line x1="32" y1="54" x2="52" y2="51"/>
      <line x1="32" y1="64" x2="52" y2="61"/><line x1="68" y1="41" x2="88" y2="44"/>
      <line x1="68" y1="51" x2="88" y2="54"/><line x1="68" y1="61" x2="88" y2="64"/>
    </g>
    <path d="M52 20 C56 12 64 12 68 20"/>
  </svg>`,
  /* the compass rose — §6–8 */
  civic: `<svg viewBox="0 0 120 120" aria-hidden="true" ${S}>
    <circle cx="60" cy="60" r="40"/>
    <circle cx="60" cy="60" r="5"/>
    <path d="M60 14 L66 54 L60 60 L54 54 Z"/>
    <path d="M60 106 L54 66 L60 60 L66 66 Z"/>
    <g ${THIN}><line x1="20" y1="60" x2="46" y2="60"/><line x1="74" y1="60" x2="100" y2="60"/>
    <line x1="32" y1="32" x2="47" y2="47"/><line x1="73" y1="73" x2="88" y2="88"/>
    <line x1="88" y1="32" x2="73" y2="47"/><line x1="47" y1="73" x2="32" y2="88"/></g>
  </svg>`,
  /* the boundary stone and deed — §9–10 */
  property: `<svg viewBox="0 0 120 120" aria-hidden="true" ${S}>
    <path d="M42 108 L46 54 L60 40 L74 54 L78 108 Z"/>
    <line x1="30" y1="108" x2="90" y2="108"/>
    <line x1="52" y1="70" x2="68" y2="70"/>
    <g ${THIN}><line x1="50" y1="82" x2="70" y2="82"/><line x1="50" y1="92" x2="70" y2="92"/></g>
    <path d="M60 40 V24 M52 30 h16"/>
  </svg>`,
  /* the open courthouse door — §11 */
  access: `<svg viewBox="0 0 120 120" aria-hidden="true" ${S}>
    <path d="M20 108 V44 L60 20 L100 44 V108"/>
    <line x1="12" y1="108" x2="108" y2="108"/>
    <line x1="20" y1="48" x2="100" y2="48"/>
    <line x1="34" y1="58" x2="34" y2="100"/><line x1="86" y1="58" x2="86" y2="100"/>
    <path d="M48 108 V66 h24 v42"/>
  </svg>`,
  /* the bench and the bar — §12–17 */
  accused: `<svg viewBox="0 0 120 120" aria-hidden="true" ${S}>
    <rect x="24" y="34" width="72" height="26"/>
    <line x1="18" y1="60" x2="102" y2="60"/>
    <line x1="30" y1="60" x2="30" y2="76"/><line x1="90" y1="60" x2="90" y2="76"/>
    <line x1="14" y1="90" x2="106" y2="90"/>
    <line x1="26" y1="90" x2="26" y2="106"/><line x1="60" y1="90" x2="60" y2="106"/><line x1="94" y1="90" x2="94" y2="106"/>
    <circle cx="60" cy="24" r="7"/>
    <g ${THIN}><line x1="34" y1="42" x2="86" y2="42"/><line x1="34" y1="50" x2="86" y2="50"/></g>
  </svg>`,
  /* the broken chain — §18–20 */
  dignity: `<svg viewBox="0 0 120 120" aria-hidden="true" ${S}>
    <path d="M26 34 a12 12 0 0 1 0 24 a12 12 0 0 1 0 -24 Z" transform="rotate(-30 32 46)"/>
    <path d="M52 52 a12 12 0 0 1 0 24 a12 12 0 0 1 0 -24 Z" transform="rotate(-30 58 64)"/>
    <path d="M88 74 a12 12 0 0 1 0 24 a12 12 0 0 1 0 -24 Z" transform="rotate(-30 94 86)"/>
    <path d="M70 62 L78 70 M84 58 L76 50" stroke-width="2"/>
  </svg>`,
  /* the closed book, sealed — §21–22 */
  finality: `<svg viewBox="0 0 120 120" aria-hidden="true" ${S}>
    <rect x="26" y="24" width="68" height="80" rx="4"/>
    <line x1="38" y1="24" x2="38" y2="104"/>
    <circle cx="70" cy="64" r="12"/>
    <path d="M70 58 v12 M64 64 h12"/>
    <g ${THIN}><line x1="48" y1="36" x2="84" y2="36"/><line x1="48" y1="94" x2="84" y2="94"/></g>
  </svg>`,
};
