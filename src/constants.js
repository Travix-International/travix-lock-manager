'use strict';

const NL = 1;
const CR = 2;
const CW = 4;
const PR = 8;
const PW = 16;
const EX = 32;

const CODES = [];
CODES[NL] = 'NL';
CODES[CR] = 'CR';
CODES[CW] = 'CW';
CODES[EX] = 'EX';
CODES[PR] = 'PR';
CODES[PW] = 'PW';

const COMPATIBILITIES = [];
COMPATIBILITIES[NL] = CR | CW | EX | NL | PR | PW;
COMPATIBILITIES[CR] = CR | CW | NL | PR | PW;
COMPATIBILITIES[CW] = CR | CW | NL;
COMPATIBILITIES[PR] = CR | NL | PR;
COMPATIBILITIES[PW] = CR | NL;
COMPATIBILITIES[EX] = NL;

const ESCALATIONS = [];
ESCALATIONS[CR] = CR;
ESCALATIONS[CW] = CW;
ESCALATIONS[EX] = CW;
ESCALATIONS[NL] = NL;
ESCALATIONS[PR] = CR;
ESCALATIONS[PW] = CW;

const MODES = [EX, PW, PR, CW, CR, NL];

const TYPES = [];
TYPES[CR] = 'Concurrent Read';
TYPES[CW] = 'Concurrent Write';
TYPES[EX] = 'Exclusive';
TYPES[NL] = 'Null';
TYPES[PR] = 'Protected Read';
TYPES[PW] = 'Protected Write';

export {
  CODES,
  COMPATIBILITIES,
  CR,
  CW,
  ESCALATIONS,
  EX,
  MODES,
  NL,
  PR,
  PW,
  TYPES
};
