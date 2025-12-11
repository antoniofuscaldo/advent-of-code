import fs from 'fs';

function parse(str) {
  const lines = str.split('\n').map((l) => l.trim());
  const adj = new Map();
  for (const l of lines) {
    if (!l) continue;
    const idx = l.indexOf(':');
    if (idx < 0) continue;
    const left = l.slice(0, idx).trim();
    if (!left) continue;
    const right = l.slice(idx + 1).trim();
    const toks = right ? right.split(/\s+/) : [];
    if (!adj.has(left)) adj.set(left, []);
    const arr = adj.get(left);
    for (const tok of toks) {
      if (tok) arr.push(tok);
    }
  }
  return adj;
}

function countPaths(adj, start, target) {
  const memo = new Map();
  const visiting = new Set();
  function dfs(node) {
    if (node === target) return 1;
    if (memo.has(node)) return memo.get(node);
    if (visiting.has(node)) return 0;
    visiting.add(node);
    const neighbors = adj.get(node) || [];
    let total = 0;
    for (const nxt of neighbors) total += dfs(nxt);
    visiting.delete(node);
    memo.set(node, total);
    return total;
  }
  return dfs(start);
}

export function part1(input) {
  const adj = parse(input);
  return countPaths(adj, 'you', 'out');
}

export function part2(input) {
  const adj = parse(input);
  const req = ['dac', 'fft'];
  const idx = new Map();
  for (let i = 0; i < req.length; i++) idx.set(req[i], i);
  const full = (1 << req.length) - 1;
  const memo = new Map();
  const visiting = new Set();
  function dfs(node, mask) {
    if (node === 'out') return mask === full ? 1 : 0;
    const key = node + '|' + mask;
    if (memo.has(key)) return memo.get(key);
    if (visiting.has(key)) return 0;
    visiting.add(key);
    const neighbors = adj.get(node) || [];
    let total = 0;
    for (const nxt of neighbors) {
      let m = mask;
      if (idx.has(nxt)) m |= 1 << idx.get(nxt);
      total += dfs(nxt, m);
    }
    visiting.delete(key);
    memo.set(key, total);
    return total;
  }
  return dfs('svr', 0);
}

const part1Test = fs.readFileSync(new URL('./part1_test.txt', import.meta.url), 'utf8').trim();
const part2Test = fs.readFileSync(new URL('./part2_test.txt', import.meta.url), 'utf8').trim();
if (part1Test && part2Test) {
  console.log('Test part 1:', part1(part1Test));
  console.log('Test part 2:', part2(part2Test));
}

const input = fs.readFileSync(new URL('./input.txt', import.meta.url), 'utf8').trim();
if (input) {
  console.log('Solution part 1:', part1(input));
  console.log('Solution part 2:', part2(input));
}
