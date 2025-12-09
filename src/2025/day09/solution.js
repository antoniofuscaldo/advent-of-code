import fs from 'fs';

function parse(str) {
  return str
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.split(',').map((t) => Number(t)));
}

export function part1(input) {
  const pts = parse(input);
  const n = pts.length;
  if (n < 2) return 0;
  let best = 0;
  for (let i = 0; i < n; i++) {
    const [xi, yi] = pts[i];
    for (let j = i + 1; j < n; j++) {
      const [xj, yj] = pts[j];
      const area = (Math.abs(xi - xj) + 1) * (Math.abs(yi - yj) + 1);
      if (area > best) best = area;
    }
  }
  return best;
}

export function part2(input) {
  const pts = parse(input);
  const n = pts.length;
  if (n < 2) return 0;
  const edges = [];
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[j];
    const minX = x1 < x2 ? x1 : x2;
    const maxX = x1 > x2 ? x1 : x2;
    const minY = y1 < y2 ? y1 : y2;
    const maxY = y1 > y2 ? y1 : y2;
    edges.push([minX, maxX, minY, maxY]);
  }
  function insidePoly(cx, cy) {
    let inside = false;
    for (let i = 0, j = n - 1; i < n; j = i++) {
      const [xi, yi] = pts[i];
      const [xj, yj] = pts[j];
      const intersect = yi > cy !== yj > cy && cx < ((xj - xi) * (cy - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  }
  function onBoundary(px, py) {
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const [x1, y1] = pts[i];
      const [x2, y2] = pts[j];
      if (x1 === x2) {
        const minY = y1 < y2 ? y1 : y2;
        const maxY = y1 > y2 ? y1 : y2;
        if (px === x1 && py >= minY && py <= maxY) return true;
      } else if (y1 === y2) {
        const minX = x1 < x2 ? x1 : x2;
        const maxX = x1 > x2 ? x1 : x2;
        if (py === y1 && px >= minX && px <= maxX) return true;
      }
    }
    return false;
  }
  let best = 0;
  for (let i = 0; i < n; i++) {
    const [xi0, yi0] = pts[i];
    for (let j = i + 1; j < n; j++) {
      const [xj0, yj0] = pts[j];
      const xi = xi0 < xj0 ? xi0 : xj0;
      const xj = xi0 < xj0 ? xj0 : xi0;
      const yi = yi0 < yj0 ? yi0 : yj0;
      const yj = yi0 < yj0 ? yj0 : yi0;
      const area = (xj - xi + 1) * (yj - yi + 1);
      if (area <= best) continue;
      const cx = (xi + xj) / 2;
      const cy = (yi + yj) / 2;
      if (!insidePoly(cx, cy)) continue;
      const c1in = insidePoly(xi, yi) || onBoundary(xi, yi);
      const c2in = insidePoly(xi, yj) || onBoundary(xi, yj);
      const c3in = insidePoly(xj, yi) || onBoundary(xj, yi);
      const c4in = insidePoly(xj, yj) || onBoundary(xj, yj);
      if (!(c1in && c2in && c3in && c4in)) continue;
      let inside = true;
      for (let k = 0; k < edges.length; k++) {
        const e = edges[k];
        if (e[1] > xi && e[0] < xj && e[3] > yi && e[2] < yj) {
          inside = false;
          break;
        }
      }
      if (inside && area > best) best = area;
    }
  }
  return best;
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
