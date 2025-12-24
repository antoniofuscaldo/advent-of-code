import fs from 'fs';

function parseInput(str) {
  const lines = str.split('\n').map((l) => l.trim()),
    shapes = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line) {
      i += 1;
      continue;
    }
    if (/^\d+:\s*$/.test(line)) {
      i += 1;
      const rows = [];
      while (i < lines.length) {
        const s = lines[i].trim();
        if (!s) {
          i += 1;
          break;
        }
        if (/^[#.]+$/.test(s)) {
          rows.push(s);
          i += 1;
        } else if (/^\d+:\s*$/.test(s) || /^\d+x\d+:/.test(s)) {
          break;
        } else {
          i += 1;
        }
      }
      if (rows.length > 0) shapes.push(rows);
      continue;
    }
    if (/^\d+x\d+:/.test(line)) break;
    i += 1;
  }
  const regions = [];
  for (; i < lines.length; i++) {
    const l = lines[i];
    if (!l) continue;
    const m = l.match(/^(\d+)x(\d+):\s*(.*)$/);
    if (!m) continue;
    const w = Number(m[1]),
      h = Number(m[2]),
      cnt = m[3]
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((x) => Number(x));
    regions.push({ w, h, counts: cnt });
  }
  return { shapes, regions };
}

function shapeOffsets(rows) {
  const r0 = Math.floor(rows.length / 2),
    c0 = Math.floor(rows[0].length / 2),
    offs = [];
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    for (let c = 0; c < row.length; c++) {
      if (row[c] === '#') offs.push([r - r0, c - c0]);
    }
  }
  return offs;
}

function rotate90([dr, dc]) {
  return [-dc, dr];
}
function reflectH([dr, dc]) {
  return [dr, -dc];
}

function canonicalKey(offs) {
  const sorted = offs.slice().sort((a, b) => (a[0] - b[0] !== 0 ? a[0] - b[0] : a[1] - b[1]));
  return sorted.map((p) => `${p[0]},${p[1]}`).join(';');
}

function transformVariants(offs) {
  const variants = [],
    seen = new Set();
  for (let rot = 0; rot < 4; rot++) {
    for (let ref = 0; ref < 2; ref++) {
      const cur = [];
      for (let i = 0; i < offs.length; i++) {
        let p = offs[i];
        for (let k = 0; k < rot; k++) p = rotate90(p);
        if (ref) p = reflectH(p);
        cur.push(p);
      }
      const key = canonicalKey(cur);
      if (!seen.has(key)) {
        seen.add(key);
        variants.push(cur);
      }
    }
  }
  return variants;
}

function placementMasksForShape(variants, w, h) {
  const masksSet = new Set();
  for (const offs of variants) {
    let minR = Infinity,
      maxR = -Infinity,
      minC = Infinity,
      maxC = -Infinity;
    for (const [dr, dc] of offs) {
      if (dr < minR) minR = dr;
      if (dr > maxR) maxR = dr;
      if (dc < minC) minC = dc;
      if (dc > maxC) maxC = dc;
    }
    const rStart = -minR,
      rEnd = h - 1 - maxR,
      cStart = -minC,
      cEnd = w - 1 - maxC;
    if (rStart > rEnd || cStart > cEnd) continue;
    for (let r = rStart; r <= rEnd; r++) {
      for (let c = cStart; c <= cEnd; c++) {
        let mask = 0n;
        for (const [dr, dc] of offs) {
          const rr = r + dr,
            cc = c + dc,
            idx = rr * w + cc;
          mask |= 1n << BigInt(idx);
        }
        masksSet.add(mask.toString());
      }
    }
  }
  const masks = [];
  for (const m of masksSet) masks.push(BigInt(m));
  return masks;
}

function canFitRegion(shapesRows, w, h, counts) {
  const nShapes = shapesRows.length,
    needed = counts.slice(0, nShapes);
  for (let i = counts.length; i < nShapes; i++) needed.push(0);
  const totalPieces = needed.reduce((a, b) => a + b, 0),
    totalArea = totalPieces * 7;
  if (totalArea > w * h) return false;
  if (w <= 0 || h <= 0) return false;
  const shapesOffs = shapesRows.map(shapeOffsets),
    variants = shapesOffs.map(transformVariants),
    placementsByShape = variants.map((vars) => placementMasksForShape(vars, w, h));
  for (let s = 0; s < nShapes; s++) {
    if (needed[s] > 0 && placementsByShape[s].length < needed[s]) return false;
  }
  const seq = [];
  for (let s = 0; s < nShapes; s++) {
    for (let k = 0; k < needed[s]; k++) seq.push(s);
  }
  seq.sort((a, b) => placementsByShape[a].length - placementsByShape[b].length);
  const memo = new Map();
  function dfs(idx, used) {
    if (idx === seq.length) return true;
    const key = `${idx}|${used.toString()}`;
    if (memo.has(key)) return memo.get(key);
    const s = seq[idx],
      list = placementsByShape[s];
    for (let i = 0; i < list.length; i++) {
      const m = list[i];
      if ((m & used) !== 0n) continue;
      if (dfs(idx + 1, used | m)) {
        memo.set(key, true);
        return true;
      }
    }
    memo.set(key, false);
    return false;
  }
  return dfs(0, 0n);
}

export function part1(input) {
  const { shapes, regions } = parseInput(input);
  if (shapes.length === 0 || regions.length === 0) return 0;
  let ok = 0;
  for (const { w, h, counts } of regions) {
    if (canFitRegion(shapes, w, h, counts)) ok += 1;
  }
  return ok;
}

export function part2(input) {
  return part1(input);
}

const testPath = new URL('./test.txt', import.meta.url);
let test = '';
if (fs.existsSync(testPath)) {
  test = fs.readFileSync(testPath, 'utf8').trim();
}
if (test) {
  console.log('Test part 1:', part1(test));
  console.log('Test part 2:', part2(test));
}

const inputPath = new URL('./input.txt', import.meta.url);
let input = '';
if (fs.existsSync(inputPath)) {
  input = fs.readFileSync(inputPath, 'utf8').trim();
}
if (input) {
  console.log('Solution part 1:', part1(input));
  console.log('Solution part 2:', part2(input));
}
