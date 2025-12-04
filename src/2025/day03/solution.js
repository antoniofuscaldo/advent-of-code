import fs from 'fs';

function parse(str) {
  return str
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
}

function maxPairValue(line) {
  let bestT = -1,
    bestU = -1,
    maxRight = -1;
  for (let i = line.length - 1; i >= 0; i--) {
    const d = line.charCodeAt(i) - 48;
    if (maxRight !== -1) {
      if (d > bestT || (d === bestT && maxRight > bestU)) {
        bestT = d;
        bestU = maxRight;
      }
    }
    if (d > maxRight) maxRight = d;
  }
  if (bestT === -1) return 0;
  return bestT * 10 + bestU;
}

function maxSubseqValue(line, k) {
  const n = line.length;
  let out = 0,
    start = 0;
  for (let p = 0; p < k; p++) {
    const end = n - (k - p);
    let best = -1,
      idx = -1;
    for (let i = start; i <= end; i++) {
      const d = line.charCodeAt(i) - 48;
      if (d > best) {
        best = d;
        idx = i;
        if (best === 9) break;
      }
    }
    out = out * 10 + best;
    start = idx + 1;
  }
  return out;
}

export function part1(input) {
  const lines = parse(input);
  let sum = 0;
  for (const line of lines) sum += maxPairValue(line);
  return sum;
}

export function part2(input) {
  const lines = parse(input);
  let sum = 0;
  for (const line of lines) sum += maxSubseqValue(line, 12);
  return sum;
}

const test = fs.readFileSync(new URL('./test.txt', import.meta.url), 'utf8').trim();
console.log('Test part 1:', part1(test));
console.log('Test part 2:', part2(test));

const input = fs.readFileSync(new URL('./input.txt', import.meta.url), 'utf8').trim();
console.log('Solution part 1:', part1(input));
console.log('Solution part 2:', part2(input));
