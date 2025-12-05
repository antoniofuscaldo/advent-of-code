import fs from 'fs';

function parseDatabase(str) {
  const lines = str.split('\n').map((l) => l.trim());
  const ranges = [];
  let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (l === '') break;
    const [a, b] = l.split('-');
    ranges.push([Number(a), Number(b)]);
    i += 1;
  }
  while (i < lines.length && lines[i] === '') i += 1;
  const ids = [];
  for (; i < lines.length; i++) {
    const l = lines[i];
    if (!l) continue;
    ids.push(Number(l));
  }
  return { ranges, ids };
}

function mergeRanges(ranges) {
  if (ranges.length === 0) return [];
  ranges.sort((r1, r2) => (r1[0] !== r2[0] ? r1[0] - r2[0] : r1[1] - r2[1]));
  const out = [ranges[0].slice()];
  for (let i = 1; i < ranges.length; i++) {
    const [a, b] = ranges[i];
    const last = out[out.length - 1];
    if (a <= last[1]) {
      if (b > last[1]) last[1] = b;
    } else out.push([a, b]);
  }
  return out;
}

export function part1(input) {
  const { ranges, ids } = parseDatabase(input);
  const merged = mergeRanges(ranges);
  const starts = merged.map((r) => r[0]);
  let fresh = 0;
  for (const id of ids) {
    let lo = 0,
      hi = starts.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (starts[mid] <= id) lo = mid + 1;
      else hi = mid;
    }
    const idx = lo - 1;
    if (idx >= 0 && id <= merged[idx][1]) fresh += 1;
  }
  return fresh;
}

export function part2(input) {
  const { ranges } = parseDatabase(input);
  const merged = mergeRanges(ranges);
  let total = 0;
  for (const [a, b] of merged) total += b - a + 1;
  return total;
}

const test = fs.readFileSync(new URL('./test.txt', import.meta.url), 'utf8').trim();
console.log('Test part 1:', part1(test));
console.log('Test part 2:', part2(test));

const input = fs.readFileSync(new URL('./input.txt', import.meta.url), 'utf8').trim();
console.log('Solution part 1:', part1(input));
console.log('Solution part 2:', part2(input));
