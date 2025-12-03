import fs from 'fs';
import { createHash } from 'crypto';

function nextHash(door, i) {
  return createHash('md5')
    .update(door + i)
    .digest();
}

export function part1(input) {
  const door = input.trim();
  let i = 0,
    out = '';
  while (out.length < 8) {
    const buf = nextHash(door, i);
    if (buf[0] === 0 && buf[1] === 0 && (buf[2] & 0xf0) === 0) {
      out += (buf[2] & 0x0f).toString(16);
    }
    i += 1;
  }
  return out;
}

export function part2(input) {
  const door = input.trim();
  let i = 0;
  const pwd = Array(8).fill(null);
  let filled = 0;
  while (filled < 8) {
    const buf = nextHash(door, i);
    if (buf[0] === 0 && buf[1] === 0 && (buf[2] & 0xf0) === 0) {
      const pos = buf[2] & 0x0f;
      if (pos < 8 && pwd[pos] === null) {
        pwd[pos] = ((buf[3] & 0xf0) >> 4).toString(16);
        filled += 1;
      }
    }
    i += 1;
  }
  return pwd.join('');
}

const input = fs.readFileSync(new URL('./input.txt', import.meta.url), 'utf8').trim();
console.log(part1(input));
console.log(part2(input));
