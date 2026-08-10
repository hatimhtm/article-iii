/**
 * Each section's shaft behaves differently, and the behaviour is an argument
 * about what the section does. A colonnade where §2 and §10 differ only in
 * hue is decoration; this is the part that carries meaning.
 *
 *   foundation  two steady clauses, breathing together        §1
 *   scan        a light sweeping the shaft, looking for something
 *   broadcast   rings leaving the band and travelling outward
 *   carve       a wedge cut away and rotating
 *   cage        vertical bars, the interior held dark
 *   fracture    cracks, lit from inside
 *   balance     two marks converging and separating, like scales
 */
export const MOTIF_ID = {
  foundation: 0,
  scan: 1,
  broadcast: 2,
  carve: 3,
  cage: 4,
  fracture: 5,
  balance: 6,
};

export const MOTIF_OF = {
  1:  'foundation', // due process & equal protection — the two clauses
  2:  'scan',       // searches: being looked through
  3:  'scan',       // privacy of communication: being listened to
  4:  'broadcast',  // speech, press, assembly: projecting outward
  5:  'broadcast',  // religion: professed, and heard
  6:  'carve',      // abode & travel: movement cut away
  7:  'scan',       // information: the state looked through, for once
  8:  'broadcast',  // association: many voices, one body
  9:  'carve',      // eminent domain: property literally taken
  10: 'carve',      // impairment: terms cut out of an agreement
  11: 'balance',    // free access: the scales made reachable
  12: 'cage',       // custodial investigation
  13: 'cage',       // bail: the cage that must open before conviction
  14: 'balance',    // fair trial
  15: 'cage',       // habeas corpus: produce the body
  16: 'balance',    // speedy disposition
  17: 'scan',       // self-incrimination: the mind probed
  18: 'cage',       // political detention & servitude
  19: 'fracture',   // cruel punishment
  20: 'fracture',   // imprisonment for debt
  21: 'balance',    // double jeopardy: one attempt, weighed once
  22: 'balance',    // ex post facto: the rule fixed before the act
};

/** Per-motif behaviour for the dust field around the lit shaft. */
export const MOTIF_FIELD = {
  foundation: { pull: 0.30, turb: 0.85, rise: 1.0 },
  scan:       { pull: 0.10, turb: 0.35, rise: 0.4 },
  broadcast:  { pull: -0.34, turb: 1.5, rise: 1.5 },
  carve:      { pull: 0.42, turb: 0.7, rise: 0.2 },
  cage:       { pull: 0.06, turb: 0.30, rise: -1.1 },
  fracture:   { pull: -0.20, turb: 1.9, rise: 0.7 },
  balance:    { pull: 0.26, turb: 0.6, rise: 0.9 },
};
