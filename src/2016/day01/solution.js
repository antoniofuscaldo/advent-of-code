import fs from 'fs';

function parse(str) {
  return str
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((tok) => ({ turn: tok[0], steps: Number(tok.slice(1)) }));
}

function walk(instructions) {
  let dir = 0,
    x = 0,
    y = 0;
  const seen = new Set(['0,0']);
  let repeat = null;
  for (const inst of instructions) {
    dir = inst.turn === 'R' ? (dir + 1) % 4 : (dir + 3) % 4;
    for (let i = 0; i < inst.steps; i++) {
      if (dir === 0) y += 1;
      else if (dir === 1) x += 1;
      else if (dir === 2) y -= 1;
      else x -= 1;
      const key = `${x},${y}`;
      if (!repeat) {
        if (seen.has(key)) repeat = { x, y };
        else seen.add(key);
      }
    }
  }
  return {
    dist: Math.abs(x) + Math.abs(y),
    repeatDist: repeat ? Math.abs(repeat.x) + Math.abs(repeat.y) : null,
  };
}

export function part1(input) {
  const instructions = parse(input);
  return walk(instructions).dist;
}

export function part2(input) {
  const instructions = parse(input);
  return walk(instructions).repeatDist;
}

const input = fs.readFileSync(new URL('./input.txt', import.meta.url), 'utf8').trim();
console.log(part1(input));
console.log(part2(input));
