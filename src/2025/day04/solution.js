import fs from 'fs';

function parse(str) {
  return str
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
}

function accessibleCount(lines) {
  const h = lines.length;
  if (h === 0) return 0;
  let count = 0;
  for (let r = 0; r < h; r++) {
    const row = lines[r];
    for (let c = 0; c < row.length; c++) {
      if (row[c] !== '@') continue;
      let adj = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr,
            nc = c + dc;
          if (nr < 0 || nr >= h) continue;
          const nrow = lines[nr];
          if (nc < 0 || nc >= nrow.length) continue;
          if (nrow[nc] === '@') adj += 1;
        }
      }
      if (adj < 4) count += 1;
    }
  }
  return count;
}

export function part1(input) {
  return accessibleCount(parse(input));
}

export function part2(input) {
  const lines = parse(input),
    h = lines.length;
  if (h === 0) return 0;
  const widths = lines.map((l) => l.length),
    isRoll = lines.map((l) => Array.from(l, (ch) => ch === '@')),
    deg = lines.map((l) => Array(l.length).fill(0)),
    enq = lines.map((l) => Array(l.length).fill(false)),
    drs = [-1, -1, -1, 0, 0, 1, 1, 1],
    dcs = [-1, 0, 1, -1, 1, -1, 0, 1];
  function inBounds(r, c) {
    return r >= 0 && r < h && c >= 0 && c < widths[r];
  }
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < widths[r]; c++) {
      if (!isRoll[r][c]) continue;
      let d = 0;
      for (let k = 0; k < 8; k++) {
        const nr = r + drs[k],
          nc = c + dcs[k];
        if (inBounds(nr, nc) && isRoll[nr][nc]) d += 1;
      }
      deg[r][c] = d;
    }
  }
  const q = [];
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < widths[r]; c++) {
      if (!isRoll[r][c]) continue;
      if (deg[r][c] < 4) {
        q.push([r, c]);
        enq[r][c] = true;
      }
    }
  }
  let removed = 0;
  while (q.length) {
    const [r, c] = q.shift();
    if (!isRoll[r][c]) continue;
    isRoll[r][c] = false;
    removed += 1;
    for (let k = 0; k < 8; k++) {
      const nr = r + drs[k],
        nc = c + dcs[k];
      if (!inBounds(nr, nc)) continue;
      if (!isRoll[nr][nc]) continue;
      deg[nr][nc] -= 1;
      if (deg[nr][nc] < 4 && !enq[nr][nc]) {
        q.push([nr, nc]);
        enq[nr][nc] = true;
      }
    }
  }
  return removed;
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
