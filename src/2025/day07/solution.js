import fs from 'fs';

function parse(str) {
  return str
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
}

function lowerBound(arr, x) {
  let lo = 0,
    hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] <= x) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

function countSplits(lines) {
  const h = lines.length;
  if (h === 0) return 0;
  const w = lines.reduce((m, l) => (l.length > m ? l.length : m), 0),
    cols = Array.from({ length: w }, () => []);
  let sr = -1,
    sc = -1;
  for (let r = 0; r < h; r++) {
    const row = lines[r];
    for (let c = 0; c < row.length; c++) {
      const ch = row[c];
      if (ch === '^') cols[c].push(r);
      else if (ch === 'S') {
        sr = r;
        sc = c;
      }
    }
  }
  if (sr === -1) return 0;
  const q = [[sr, sc]],
    seen = new Set([`${sr},${sc}`]),
    used = new Set();
  let splits = 0;
  while (q.length) {
    const [r, c] = q.shift();
    if (c < 0 || c >= w) continue;
    const arr = cols[c];
    if (arr.length === 0) continue;
    const idx = lowerBound(arr, r);
    if (idx >= arr.length) continue;
    const nr = arr[idx],
      key = `${nr},${c}`;
    if (used.has(key)) continue;
    used.add(key);
    splits += 1;
    const left = `${nr},${c - 1}`,
      right = `${nr},${c + 1}`;
    if (!seen.has(left) && c - 1 >= 0) {
      seen.add(left);
      q.push([nr, c - 1]);
    }
    if (!seen.has(right) && c + 1 < w) {
      seen.add(right);
      q.push([nr, c + 1]);
    }
  }
  return splits;
}

export function part1(input) {
  return countSplits(parse(input));
}

function countTimelines(lines) {
  const h = lines.length;
  if (h === 0) return 0;
  const w = lines.reduce((m, l) => (l.length > m ? l.length : m), 0),
    cols = Array.from({ length: w }, () => []);
  let sr = -1,
    sc = -1;
  for (let r = 0; r < h; r++) {
    const row = lines[r];
    for (let c = 0; c < row.length; c++) {
      const ch = row[c];
      if (ch === '^') cols[c].push(r);
      else if (ch === 'S') {
        sr = r;
        sc = c;
      }
    }
  }
  if (sr === -1) return 0;
  const memo = new Map();
  function key(r, c) {
    return `${r},${c}`;
  }
  function dfs(r, c) {
    if (c < 0 || c >= w) return 1;
    const arr = cols[c];
    if (arr.length === 0) return 1;
    const idx = lowerBound(arr, r);
    if (idx >= arr.length) return 1;
    const nr = arr[idx],
      k1 = key(nr, c - 1),
      k2 = key(nr, c + 1);
    let left, right;
    if (memo.has(k1)) left = memo.get(k1);
    else {
      left = dfs(nr, c - 1);
      memo.set(k1, left);
    }
    if (memo.has(k2)) right = memo.get(k2);
    else {
      right = dfs(nr, c + 1);
      memo.set(k2, right);
    }
    return left + right;
  }
  return dfs(sr, sc);
}

export function part2(input) {
  return countTimelines(parse(input));
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
