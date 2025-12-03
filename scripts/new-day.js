import fs from 'fs';
import path from 'path';

function getArg(flag) {
  const i = process.argv.indexOf(flag);
  return i !== -1 ? process.argv[i + 1] : undefined;
}

function pad(n) {
  return String(n).padStart(2, '0');
}

function listYears(srcRoot) {
  if (!fs.existsSync(srcRoot)) return [];
  return fs
    .readdirSync(srcRoot, { withFileTypes: true })
    .filter((d) => d.isDirectory() && /^\d{4}$/.test(d.name))
    .map((d) => Number(d.name))
    .sort((a, b) => b - a);
}

function nextDayForYear(srcRoot, year) {
  const yearDir = path.join(srcRoot, String(year));
  if (!fs.existsSync(yearDir)) return 1;
  const days = fs
    .readdirSync(yearDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && /^day\d{2}$/.test(d.name))
    .map((d) => Number(d.name.slice(3)))
    .sort((a, b) => b - a);
  return days.length ? days[0] + 1 : 1;
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function writeFile(p) {
  if (!fs.existsSync(p)) fs.writeFileSync(p, '');
}

function main() {
  const cwd = process.cwd(),
    srcRoot = path.join(cwd, 'src'),
    yearArg = getArg('--year');
  let year = yearArg ? Number(yearArg) : undefined;
  if (!year) {
    const years = listYears(srcRoot);
    year = years.length ? years[0] : new Date().getFullYear();
  }
  const day = nextDayForYear(srcRoot, year),
    dd = pad(day),
    targetDir = path.join(srcRoot, String(year), `day${dd}`);
  ensureDir(targetDir);
  writeFile(path.join(targetDir, 'solution.js'));
  writeFile(path.join(targetDir, 'puzzle.txt'));
  writeFile(path.join(targetDir, 'input.txt'));
  writeFile(path.join(targetDir, 'test.txt'));
  process.stdout.write(`Created src/${year}/day${dd}\n`);
}

main();
