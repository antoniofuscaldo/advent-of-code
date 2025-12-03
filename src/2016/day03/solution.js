import fs from 'fs';

function parseRows(str) {
  return str
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.split(/\s+/).map((n) => Number(n)));
}

function valid(a, b, c) {
  const m = Math.max(a, b, c);
  return a + b + c - m > m;
}

export function part1(input) {
  const rows = parseRows(input);
  let count = 0;
  for (const [a, b, c] of rows) if (valid(a, b, c)) count++;
  return count;
}

export function part2(input) {
  const rows = parseRows(input);
  let count = 0;
  for (let i = 0; i < rows.length; i += 3) {
    const r1 = rows[i],
      r2 = rows[i + 1],
      r3 = rows[i + 2];
    if (!r3) break;
    if (valid(r1[0], r2[0], r3[0])) count++;
    if (valid(r1[1], r2[1], r3[1])) count++;
    if (valid(r1[2], r2[2], r3[2])) count++;
  }
  return count;
}

const input = fs.readFileSync(new URL('./input.txt', import.meta.url), 'utf8').trim();
console.log(part1(input));
console.log(part2(input));
