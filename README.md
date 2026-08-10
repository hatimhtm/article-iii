<div align="center">

# Article III — The Bill of Rights

*A scholarly reading of Article III of the 1987 Constitution of the Republic of the
Philippines: all twenty-two sections, verbatim, with the doctrines, landmark cases
and history behind each one.*

**[→ Open the reading](https://hatimhtm.github.io/article-iii/)**

[![Live](https://img.shields.io/badge/live-hatimhtm.github.io%2Farticle--iii-8C6A28?style=flat-square&labelColor=23201B)](https://hatimhtm.github.io/article-iii/)
[![Stack](https://img.shields.io/badge/stack-vanilla%20JS%2C%20no%20build-8C6A28?style=flat-square&labelColor=23201B)](#-stack)
[![License](https://img.shields.io/badge/license-MIT-8C6A28?style=flat-square&labelColor=23201B)](LICENSE)

</div>

---

### `/// BRIEF`

A statute book, set on paper. The design language comes from the physical world of
Philippine law — the ivory of the gazette page, narra from the bench, matte brass,
banker's-lamp green, the oxblood of a law-book spine — grounded in the neoclassical
Supreme Court building on Padre Faura and the courtroom's own grammar: the elevated
bench, the seal, the bar rail, and behind the whole story, the cell.

The history of 1972–1987 is told from inside that cell: a dark band of the page where
light falls through bars, before the document emerges onto paper at ratification.

### `/// THE DOCUMENT`

- **A title page** with an engraved eight-rayed sun and the three stars
- **The cell** — seven beats from Proclamation No. 1081 to ratification
- **Nine chapters** of law, each opened by an engraved chapter plate:
  the scales, the threshold, the open book, the compass rose, the boundary stone,
  the courthouse door, the bench, the broken chain, the sealed book
- **Twenty-two sections**, each carrying: the verbatim text set as a statute block
  with hanging subsection marks · a plain-English reading · the drafting history ·
  numbered doctrines · landmark cases with year badges · a concrete scenario ·
  the limits of the right
- **A closing** — what the whole article teaches, sources, and the dedication

### `/// STUDY FEATURES`

- A sticky **case index** with per-section read marks and a progress bar
- **Mark as read**, persisted in `localStorage`; dwelling on a section long enough
  marks it read automatically
- A searchable **index overlay** across the text, doctrines and cases
- A **recall test**: fifteen scenarios, name the section each one turns on
- Deep links (`#s12`), keyboard navigation (`j`/`k`, `1`–`9`, `I`, `T`), print styles
- Reduced-motion respected throughout; the only animation is paper settling

### `/// SOURCES`

The constitutional text was reconciled across three transcriptions:
[ChanRobles Virtual Law Library](https://chanrobles.com/article3.htm),
[The LawPhil Project](https://lawphil.net/consti/cons1987.html), and the
[University of Minnesota Human Rights Library](https://hrlibrary.umn.edu/research/Philippines/PHILIPPINE%20CONSTITUTION.pdf).
Where the ratified wording reads oddly — §12(4) — it is reproduced as it stands,
with a textual note. Commentary and case notes are study aids, not legal advice.

### `/// STACK`

Vanilla ES modules, zero dependencies, zero build step. The whole experience is one
HTML document, one stylesheet, and a few small modules. Engraved ornaments are inline
SVG. Native scroll — nothing is hijacked.

```
index.html          the shell: masthead, index rail, document, overlays
css/main.css        the design system — paper, ink, narra, brass, green
js/
  main.js           boot, index rail, observers, keyboard
  ui/document.js    renders the entire document from the data
  ui/ornaments.js   the engraved seal, bars, and chapter plates
  ui/overlays.js    the searchable index and the recall test
  core/read.js      what has been read, persisted
  core/util.js      small helpers
  data/             sections, movements, prologue, quiz, dedication
```

### `/// LOCAL`

```bash
python3 -m http.server 8000   # any static server
```

### `/// STATUS`

Live at **[hatimhtm.github.io/article-iii](https://hatimhtm.github.io/article-iii/)**,
deployed from `main` by GitHub Actions.

---

<div align="center">
<sub>Built for a political science student.</sub>
</div>
