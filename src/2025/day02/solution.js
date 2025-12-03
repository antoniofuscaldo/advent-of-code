import fs from 'fs';

function parseRanges(str) {
  return str
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => {
      const [a, b] = t.split('-');
      return [Number(a), Number(b)];
    });
}

function buildDoubles(max) {
  const out = [],
    maxDigits = String(max).length;
  for (let k = 1; k <= Math.floor(maxDigits / 2); k++) {
    const pow = 10 ** k,
      start = 10 ** (k - 1),
      end = pow - 1;
    for (let y = start; y <= end; y++) {
      const v = y * pow + y;
      if (v > max) break;
      out.push(v);
    }
  }
  out.sort((a, b) => a - b);
  return out;
}

function buildRepeats(max) {
  const set = new Set(),
    maxDigits = String(max).length;
  for (let k = 1; k <= Math.floor(maxDigits / 2); k++) {
    const start = 10 ** (k - 1),
      end = 10 ** k - 1,
      maxRepeat = Math.floor(maxDigits / k);
    for (let r = 2; r <= maxRepeat; r++) {
      for (let y = start; y <= end; y++) {
        const v = Number(String(y).repeat(r));
        if (v > max) break;
        set.add(v);
      }
    }
  }
  const out = [...set];
  out.sort((a, b) => a - b);
  return out;
}

function lowerBound(arr, x) {
  let lo = 0,
    hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] < x) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

function upperBound(arr, x) {
  let lo = 0,
    hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] <= x) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

export function part1(input) {
  const ranges = parseRanges(input);
  if (ranges.length === 0) return 0;
  const max = ranges.reduce((m, r) => (r[1] > m ? r[1] : m), 0),
    doubles = buildDoubles(max),
    pref = new Array(doubles.length + 1);
  pref[0] = 0;
  for (let i = 0; i < doubles.length; i++) pref[i + 1] = pref[i] + doubles[i];
  let sum = 0;
  for (const [a, b] of ranges) {
    const lo = lowerBound(doubles, a),
      hi = upperBound(doubles, b);
    sum += pref[hi] - pref[lo];
  }
  return sum;
}

export function part2(input) {
  const ranges = parseRanges(input);
  if (ranges.length === 0) return 0;
  const max = ranges.reduce((m, r) => (r[1] > m ? r[1] : m), 0),
    repeats = buildRepeats(max),
    pref = new Array(repeats.length + 1);
  pref[0] = 0;
  for (let i = 0; i < repeats.length; i++) pref[i + 1] = pref[i] + repeats[i];
  let sum = 0;
  for (const [a, b] of ranges) {
    const lo = lowerBound(repeats, a),
      hi = upperBound(repeats, b);
    sum += pref[hi] - pref[lo];
  }
  return sum;
}

const input = fs.readFileSync(new URL('./input.txt', import.meta.url), 'utf8').trim();
console.log('Part 1:', part1(input));
console.log('Part 2:', part2(input));
