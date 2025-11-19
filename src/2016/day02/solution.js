import fs from 'fs';

function parse(str) {
  return str
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
}

function codePart1(lines) {
  const grid = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
  ];
  let r = 1;
  let c = 1;
  let out = '';
  for (const line of lines) {
    for (const ch of line) {
      if (ch === 'U' && r > 0) r -= 1;
      else if (ch === 'D' && r < 2) r += 1;
      else if (ch === 'L' && c > 0) c -= 1;
      else if (ch === 'R' && c < 2) c += 1;
    }
    out += grid[r][c];
  }
  return out;
}

function codePart2(lines) {
  const grid = [
    [null, null, '1', null, null],
    [null, '2', '3', '4', null],
    ['5', '6', '7', '8', '9'],
    [null, 'A', 'B', 'C', null],
    [null, null, 'D', null, null],
  ];
  let r = 2;
  let c = 0;
  let out = '';
  for (const line of lines) {
    for (const ch of line) {
      let nr = r;
      let nc = c;
      if (ch === 'U') nr -= 1;
      else if (ch === 'D') nr += 1;
      else if (ch === 'L') nc -= 1;
      else if (ch === 'R') nc += 1;
      if (grid[nr] && grid[nr][nc]) {
        r = nr;
        c = nc;
      }
    }
    out += grid[r][c];
  }
  return out;
}

export function part1(input) {
  return codePart1(parse(input));
}

export function part2(input) {
  return codePart2(parse(input));
}

const input = fs.readFileSync(new URL('./input.txt', import.meta.url), 'utf8').trim();
console.log(part1(input));
console.log(part2(input));
