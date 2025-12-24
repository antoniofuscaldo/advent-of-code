import fs from 'fs';

function parseMachines(str) {
  const lines = str.split('\n').map((l) => l.trim()),
    machines = [],
    seen = new Set();
  for (const l of lines) {
    if (!l) continue;
    if (seen.has(l)) continue;
    seen.add(l);
    const bm = l.match(/\[([.#]+)\]/);
    if (!bm) continue;
    const targetStr = bm[1],
      n = targetStr.length;
    let target = 0n;
    for (let i = 0; i < n; i++) {
      if (targetStr[i] === '#') target |= 1n << BigInt(i);
    }
    const masks = [],
      pm = [...l.matchAll(/\(([^)]*)\)/g)];
    for (const m of pm) {
      const nums = m[1].match(/\d+/g);
      if (!nums) continue;
      let mask = 0n;
      for (const s of nums) {
        const idx = Number(s);
        if (idx >= 0 && idx < n) mask |= 1n << BigInt(idx);
      }
      if (mask !== 0n) masks.push(mask);
    }
    let weights = [];
    const wm = l.match(/\{([^}]*)\}/);
    if (wm) {
      const nums = wm[1].match(/\d+/g);
      if (nums) weights = nums.map((s) => Number(s));
    }
    if (weights.length !== n) weights = Array(n).fill(0);
    if (masks.length > 0) machines.push({ target, masks, lights: n, weights });
  }
  return machines;
}

function minPressesBFS(target, masks) {
  if (target === 0n) return 0;
  const uniq = new Set(),
    dedup = [];
  for (const m of masks) {
    if (m === 0n) continue;
    const k = m.toString();
    if (!uniq.has(k)) {
      uniq.add(k);
      dedup.push(m);
    }
  }
  const q = [],
    dist = new Map(),
    start = 0n;
  q.push(start);
  dist.set(start, 0);
  for (let qi = 0; qi < q.length; qi++) {
    const cur = q[qi],
      d = dist.get(cur);
    for (const m of dedup) {
      const nxt = cur ^ m;
      if (nxt === target) return d + 1;
      if (!dist.has(nxt)) {
        dist.set(nxt, d + 1);
        q.push(nxt);
      }
    }
  }
  return -1;
}

function minPressesCounters(b, masks) {
  const uniq = new Set(),
    dedup = [],
    n = b.length;
  for (const m of masks) {
    if (m === 0n) continue;
    const k = m.toString();
    if (!uniq.has(k)) {
      uniq.add(k);
      dedup.push(m);
    }
  }
  for (let i = 0; i < n; i++) {
    if (b[i] > 0) {
      let ok = false;
      for (const m of dedup)
        if ((m >> BigInt(i)) & 1n) {
          ok = true;
          break;
        }
      if (!ok) return -1;
    }
  }
  const start = new Array(n).fill(0),
    key = (arr) => arr.join(','),
    targetKey = key(b),
    q = [],
    dist = new Map();
  q.push(start);
  dist.set(key(start), 0);
  for (let qi = 0; qi < q.length; qi++) {
    const cur = q[qi],
      d = dist.get(key(cur));
    for (const m of dedup) {
      const nxt = cur.slice();
      let overshoot = false;
      for (let i = 0; i < n; i++) {
        if ((m >> BigInt(i)) & 1n) {
          const v = nxt[i] + 1;
          if (v > b[i]) {
            overshoot = true;
            break;
          }
          nxt[i] = v;
        }
      }
      if (overshoot) continue;
      const k2 = key(nxt);
      if (k2 === targetKey) return d + 1;
      if (!dist.has(k2)) {
        dist.set(k2, d + 1);
        q.push(nxt);
      }
    }
  }
  return -1;
}

export function part1(input) {
  const machines = parseMachines(input);
  let total = 0;
  for (const { target, masks } of machines) {
    const v = minPressesBFS(target, masks);
    if (v >= 0) total += v;
  }
  return total;
}

export function part2(input) {
  const machines = parseMachines(input);
  let total = 0;
  for (const { masks, weights } of machines) {
    const v = minPressesCounters(weights, masks);
    if (v >= 0) total += v;
  }
  return total;
}

const test = fs.readFileSync(new URL('./test.txt', import.meta.url), 'utf8').trim();
if (test) {
  console.log('Test part 1:', part1(test));
  console.log('Test part 2:', part2(test));
}

const input = fs.readFileSync(new URL('./input.txt', import.meta.url), 'utf8').trim();
if (input) {
  console.log('Solution part 1:', part1(input));
  console.log('Solution part 2:', part2(input));
}
