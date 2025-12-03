import fs from 'fs';

function parse(str) {
  return str
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
}

function solve(lines, preferHigh) {
  if (lines.length === 0) return '';
  const width = lines[0].length,
    cols = Array.from({ length: width }, () => new Map());
  for (const line of lines) {
    for (let i = 0; i < width; i++) {
      const ch = line[i];
      cols[i].set(ch, (cols[i].get(ch) || 0) + 1);
    }
  }
  let out = '';
  for (const m of cols) {
    const arr = [...m.entries()];
    arr.sort((a, b) => {
      if (preferHigh) {
        if (b[1] !== a[1]) return b[1] - a[1];
      } else if (a[1] !== b[1]) return a[1] - b[1];
      return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0;
    });
    out += arr[0][0];
  }
  return out;
}

export function part1(input) {
  return solve(parse(input), true);
}

export function part2(input) {
  return solve(parse(input), false);
}

const input = fs.readFileSync(new URL('./input.txt', import.meta.url), 'utf8').trim();
console.log(part1(input));
console.log(part2(input));
