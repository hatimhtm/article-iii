/**
 * What has already been read. This is a study tool used across weeks, not a
 * demo — the article has to remember where she got to.
 */
const KEY = 'article-iii:read';

let set = new Set();
try {
  const raw = localStorage.getItem(KEY);
  if (raw) set = new Set(JSON.parse(raw).filter((n) => Number.isInteger(n)));
} catch { /* private mode, or a corrupted value — start clean */ }

const listeners = new Set();

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify([...set]));
  } catch { /* nothing we can do, and nothing worth breaking the page over */ }
  for (const fn of listeners) fn(set);
}

export const readState = {
  has: (n) => set.has(n),
  get size() { return set.size; },
  mark(n, on = true) {
    if (on === set.has(n)) return;
    if (on) set.add(n); else set.delete(n);
    persist();
  },
  toggle(n) { this.mark(n, !set.has(n)); },
  clear() { set.clear(); persist(); },
  onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); },
};
