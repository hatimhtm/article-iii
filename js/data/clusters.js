/**
 * The nine thematic movements of Article III.
 * Sections keep their constitutional order; the clusters are a reading aid,
 * not a division found in the text itself.
 */
export const CLUSTERS = {
  foundation: {
    id: 'foundation',
    name: 'The Foundation',
    blurb: 'The two clauses on which every other guarantee is built.',
    sections: [1],
    color: '#F6E7C4',
    color2: '#D9B871',
  },
  security: {
    id: 'security',
    name: 'Security of the Person',
    blurb: 'The state may not enter your body, your home, or your correspondence at will.',
    sections: [2, 3],
    color: '#7EC6DC',
    color2: '#3F86A8',
  },
  conscience: {
    id: 'conscience',
    name: 'Voice & Conscience',
    blurb: 'What you may say, publish, believe, and gather to demand.',
    sections: [4, 5],
    color: '#F2C45E',
    color2: '#C98436',
  },
  civic: {
    id: 'civic',
    name: 'Movement, Knowledge, Association',
    blurb: 'The rights that let a citizen act on the world.',
    sections: [6, 7, 8],
    color: '#86CDAE',
    color2: '#3E9179',
  },
  property: {
    id: 'property',
    name: 'Property & Obligation',
    blurb: 'What the state must pay for, and what it must not rewrite.',
    sections: [9, 10],
    color: '#A99BDA',
    color2: '#6B5FAE',
  },
  access: {
    id: 'access',
    name: 'Access to Justice',
    blurb: 'A right you cannot afford to enforce is not a right.',
    sections: [11],
    color: '#D98FA6',
    color2: '#A95B78',
  },
  accused: {
    id: 'accused',
    name: 'The Rights of the Accused',
    blurb: 'Six sections written in direct answer to fourteen years of martial law.',
    sections: [12, 13, 14, 15, 16, 17],
    color: '#7C9DE0',
    color2: '#3F63B4',
  },
  dignity: {
    id: 'dignity',
    name: 'Human Dignity',
    blurb: 'Limits on what may be done to a person, even a guilty one.',
    sections: [18, 19, 20],
    color: '#E3906A',
    color2: '#B85837',
  },
  finality: {
    id: 'finality',
    name: 'Finality & Fair Warning',
    blurb: 'The state gets one attempt, and it must tell you the rules first.',
    sections: [21, 22],
    color: '#BFC96A',
    color2: '#8A9438',
  },
};

export const CLUSTER_ORDER = [
  'foundation', 'security', 'conscience', 'civic',
  'property', 'access', 'accused', 'dignity', 'finality',
];

/** section number -> cluster id */
export const CLUSTER_OF = (() => {
  const map = {};
  for (const id of CLUSTER_ORDER) {
    for (const n of CLUSTERS[id].sections) map[n] = id;
  }
  return map;
})();
