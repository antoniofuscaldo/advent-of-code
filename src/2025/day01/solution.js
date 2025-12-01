import fs from 'fs';

function parse(str) {
  return str
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
}

function solve(lines) {
  let pos = 50;
  let count = 0;
  for (const line of lines) {
    const dir = line[0];
    const dist = Number(line.slice(1));
    const step = dist % 100;
    if (dir === 'L') pos = (pos - step + 100) % 100;
    else pos = (pos + step) % 100;
    if (pos === 0) count += 1;
  }
  return count;
}

export function part1(input) {
  return solve(parse(input));
}

function solveClicks(lines) {
  let pos = 50;
  let count = 0;
  for (const line of lines) {
    const dir = line[0];
    const dist = Number(line.slice(1));
    if (dir === 'R') {
      count += Math.floor((pos + dist) / 100);
      const step = dist % 100;
      pos = (pos + step) % 100;
    } else {
      if (pos === 0) count += Math.floor(dist / 100);
      else if (dist >= pos) count += 1 + Math.floor((dist - pos) / 100);
      const step = dist % 100;
      pos = (pos - step + 100) % 100;
    }
  }
  return count;
}

export function part2(input) {
  return solveClicks(parse(input));
}

const input = fs.readFileSync(new URL('./input.txt', import.meta.url), 'utf8').trim();
console.log(part1(input));
console.log(part2(input));
