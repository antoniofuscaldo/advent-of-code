import fs from 'fs';

function parse(str) {
  return str
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
}

function splitAddr(line) {
  const parts = line.split(/\[|\]/);
  const supernets = [];
  const hypernets = [];
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) supernets.push(parts[i]);
    else hypernets.push(parts[i]);
  }
  return { supernets, hypernets };
}

function hasABBA(s) {
  for (let i = 0; i + 3 < s.length; i++) {
    const a = s[i];
    const b = s[i + 1];
    const c = s[i + 2];
    const d = s[i + 3];
    if (a === d && b === c && a !== b) return true;
  }
  return false;
}

function getABAs(s) {
  const out = [];
  for (let i = 0; i + 2 < s.length; i++) {
    const a = s[i];
    const b = s[i + 1];
    const c = s[i + 2];
    if (a === c && a !== b) out.push(a + b + c);
  }
  return out;
}

function supportsTLS(line) {
  const { supernets, hypernets } = splitAddr(line);
  for (const h of hypernets) if (hasABBA(h)) return false;
  for (const s of supernets) if (hasABBA(s)) return true;
  return false;
}

function supportsSSL(line) {
  const { supernets, hypernets } = splitAddr(line);
  const abas = [];
  for (const s of supernets) abas.push(...getABAs(s));
  if (abas.length === 0) return false;
  const babs = new Set(abas.map((a) => a[1] + a[0] + a[1]));
  for (const h of hypernets) {
    for (const bab of babs) if (h.includes(bab)) return true;
  }
  return false;
}

export function part1(input) {
  const lines = parse(input);
  let count = 0;
  for (const line of lines) if (supportsTLS(line)) count++;
  return count;
}

export function part2(input) {
  const lines = parse(input);
  let count = 0;
  for (const line of lines) if (supportsSSL(line)) count++;
  return count;
}

const input = fs.readFileSync(new URL('./input.txt', import.meta.url), 'utf8').trim();
console.log(part1(input));
console.log(part2(input));
