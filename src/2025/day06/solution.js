import fs from 'fs';

function parse(str) {
  const lines = str.split('\n'),
    width = lines.reduce((m, l) => (l.length > m ? l.length : m), 0);
  return lines.map((l) => l + ' '.repeat(width - l.length));
}

function splitBlocks(grid) {
  const h = grid.length;
  if (h === 0) return [];
  const w = grid[0].length,
    sep = new Array(w).fill(true);
  for (let c = 0; c < w; c++) {
    for (let r = 0; r < h; r++) {
      if (grid[r][c] !== ' ') {
        sep[c] = false;
        break;
      }
    }
  }
  const blocks = [];
  let c = 0;
  while (c < w) {
    while (c < w && sep[c]) c += 1;
    if (c >= w) break;
    const start = c;
    while (c < w && !sep[c]) c += 1;
    blocks.push([start, c - 1]);
  }
  return blocks;
}

function readNumber(row, start, end) {
  let out = '';
  for (let c = start; c <= end; c++) {
    const ch = row[c];
    if (ch >= '0' && ch <= '9') out += ch;
  }
  return Number(out);
}

function readOp(row, start, end) {
  for (let c = start; c <= end; c++) {
    const ch = row[c];
    if (ch === '+' || ch === '*') return ch;
  }
  return '+';
}

export function part1(input) {
  const grid = parse(input);
  if (grid.length === 0) return 0;
  const h = grid.length,
    opRow = grid[h - 1],
    blocks = splitBlocks(grid);
  let total = 0;
  for (const [start, end] of blocks) {
    const op = readOp(opRow, start, end);
    let acc = op === '+' ? 0 : 1;
    for (let r = 0; r < h - 1; r++) {
      const v = readNumber(grid[r], start, end);
      if (op === '+') acc += v;
      else acc *= v;
    }
    total += acc;
  }
  return total;
}

export function part2(input) {
  const grid = parse(input);
  if (grid.length === 0) return 0;
  const h = grid.length,
    opRow = grid[h - 1],
    blocks = splitBlocks(grid);
  let total = 0;
  for (const [start, end] of blocks) {
    const op = readOp(opRow, start, end);
    let acc = op === '+' ? 0 : 1;
    for (let c = end; c >= start; c--) {
      let s = '';
      for (let r = 0; r < h - 1; r++) {
        const ch = grid[r][c];
        if (ch >= '0' && ch <= '9') s += ch;
      }
      if (s.length === 0) continue;
      const v = Number(s);
      if (op === '+') acc += v;
      else acc *= v;
    }
    total += acc;
  }
  return total;
}

const test = fs.readFileSync(new URL('./test.txt', import.meta.url), 'utf8').trim();
if (test) {
  console.log('Test part 1:', part1(test));
  console.log('Test part 2:', part2(test));
}

const input = fs.readFileSync(new URL('./input.txt', import.meta.url), 'utf8').trim();
if (input) {
  console.log('Solution part 1:', part1(input));
  console.log('Solution part 2:', part2(input));
}
