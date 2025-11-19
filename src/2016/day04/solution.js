import fs from 'fs';

function parseLine(line) {
  const m = line.match(/^([a-z-]+)-(\d+)\[([a-z]+)\]$/);
  if (!m) return null;
  return { name: m[1], sector: Number(m[2]), checksum: m[3] };
}

function computeChecksum(name) {
  const counts = new Map();
  for (const ch of name) {
    if (ch === '-') continue;
    counts.set(ch, (counts.get(ch) || 0) + 1);
  }
  const arr = [...counts.entries()];
  arr.sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0;
  });
  return arr
    .slice(0, 5)
    .map(([ch]) => ch)
    .join('');
}

function isReal(room) {
  return computeChecksum(room.name) === room.checksum;
}

function decrypt(name, sector) {
  const shift = sector % 26;
  let out = '';
  for (const ch of name) {
    if (ch === '-') out += ' ';
    else {
      const code = ch.charCodeAt(0) - 97;
      out += String.fromCharCode(97 + ((code + shift) % 26));
    }
  }
  return out;
}

export function part1(input) {
  const lines = input
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  let sum = 0;
  for (const line of lines) {
    const room = parseLine(line);
    if (room && isReal(room)) sum += room.sector;
  }
  return sum;
}

export function part2(input) {
  const lines = input
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  for (const line of lines) {
    const room = parseLine(line);
    if (!room || !isReal(room)) continue;
    const name = decrypt(room.name, room.sector);
    if (name.includes('northpole')) return room.sector;
  }
  return null;
}

const input = fs.readFileSync(new URL('./input.txt', import.meta.url), 'utf8').trim();
console.log(part1(input));
console.log(part2(input));
