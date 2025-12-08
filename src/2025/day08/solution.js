import fs from 'fs';

function parse(str) {
  return str
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.split(',').map((t) => Number(t)));
}

function productTop3(sizes) {
  if (sizes.length === 0) return 0;
  sizes.sort((a, b) => b - a);
  let out = 1;
  for (let i = 0; i < 3 && i < sizes.length; i++) out *= sizes[i];
  return out;
}

function part1(input, k = 1000) {
  const pts = parse(input);
  const n = pts.length;
  if (n === 0) return 0;
  const parent = new Array(n);
  const size = new Array(n);
  for (let i = 0; i < n; i++) {
    parent[i] = i;
    size[i] = 1;
  }
  function find(x) {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }
  function union(a, b) {
    a = find(a);
    b = find(b);
    if (a === b) return false;
    if (size[a] < size[b]) {
      const t = a;
      a = b;
      b = t;
    }
    parent[b] = a;
    size[a] += size[b];
    return true;
  }
  const pairs = [];
  for (let i = 0; i < n; i++) {
    const [xi, yi, zi] = pts[i];
    for (let j = i + 1; j < n; j++) {
      const [xj, yj, zj] = pts[j];
      const dx = xi - xj;
      const dy = yi - yj;
      const dz = zi - zj;
      const d2 = dx * dx + dy * dy + dz * dz;
      pairs.push([d2, i, j]);
    }
  }
  pairs.sort((a, b) => (a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1] || a[2] - b[2]));
  const limit = Math.min(k, pairs.length);
  for (let t = 0; t < limit; t++) {
    const [, i, j] = pairs[t];
    union(i, j);
  }
  const comps = [];
  for (let i = 0; i < n; i++) {
    const r = find(i);
    if (r === i) comps.push(size[i]);
  }
  return productTop3(comps);
}

function part2(input) {
  const pts = parse(input);
  const n = pts.length;
  if (n === 0) return 0;
  const parent = new Array(n);
  const size = new Array(n);
  for (let i = 0; i < n; i++) {
    parent[i] = i;
    size[i] = 1;
  }
  function find(x) {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }
  function union(a, b) {
    a = find(a);
    b = find(b);
    if (a === b) return false;
    if (size[a] < size[b]) {
      const t = a;
      a = b;
      b = t;
    }
    parent[b] = a;
    size[a] += size[b];
    return true;
  }
  const pairs = [];
  for (let i = 0; i < n; i++) {
    const [xi, yi, zi] = pts[i];
    for (let j = i + 1; j < n; j++) {
      const [xj, yj, zj] = pts[j];
      const dx = xi - xj;
      const dy = yi - yj;
      const dz = zi - zj;
      const d2 = dx * dx + dy * dy + dz * dz;
      pairs.push([d2, i, j]);
    }
  }
  pairs.sort((a, b) => (a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1] || a[2] - b[2]));
  let comps = n;
  for (let t = 0; t < pairs.length; t++) {
    const [, i, j] = pairs[t];
    if (union(i, j)) {
      comps -= 1;
      if (comps === 1) return pts[i][0] * pts[j][0];
    }
  }
  return 0;
}

export { part1, part2 };

const test = fs.readFileSync(new URL('./test.txt', import.meta.url), 'utf8').trim();
if (test) {
  console.log('Test part 1:', part1(test, 10));
  console.log('Test part 2:', part2(test));
}

const input = fs.readFileSync(new URL('./input.txt', import.meta.url), 'utf8').trim();
if (input) {
  console.log('Solution part 1:', part1(input));
  console.log('Solution part 2:', part2(input));
}
