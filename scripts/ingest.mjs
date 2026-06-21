// Reads data/source/collection.xlsx and writes structured JSON to src/data/generated.
// Re-run with `npm run ingest` whenever the spreadsheet or image folder is updated.
import XLSX from "xlsx";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SOURCE_FILE = path.join(ROOT, "data/source/collection.xlsx");
const IMAGES_DIR = path.join(ROOT, "data/source/images");
const OUT_DIR = path.join(ROOT, "src/data/generated");
const PUBLIC_IMAGES_DIR = path.join(ROOT, "public/images/toys");

function slugify(str) {
  return String(str)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function cell(row, i) {
  const v = row[i];
  if (v === undefined || v === null) return undefined;
  const s = String(v).trim();
  return s === "" ? undefined : s;
}

const LOWERCASE_WORDS = new Set(["and", "or", "the", "of", "a", "an", "in", "on", "for", "to"]);

// Cleans up category labels from the spreadsheet: fixes missing spaces around
// "/" and "&", and applies consistent title case (small connector words stay
// lowercase unless they open the label).
function normalizeLabel(str) {
  if (!str) return str;
  const spaced = str
    .replace(/\s*\/\s*/g, " / ")
    .replace(/\s*&\s*/g, " & ")
    .replace(/\s+/g, " ")
    .trim();

  return spaced
    .split(" ")
    .map((word, i) => {
      if (word === "/" || word === "&") return word;
      if (i > 0 && LOWERCASE_WORDS.has(word.toLowerCase())) return word.toLowerCase();
      if (/^[A-Z0-9]+$/.test(word)) return word; // keep acronyms as-is
      return word
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join("-");
    })
    .join(" ");
}

// Parses fragments like "17 (49) 35 (162)" into [{ refId: 17, note: "49" }, ...]
function parsePairs(raw) {
  if (!raw) return [];
  const out = [];
  const re = /(\d+)\s*\(([^)]*)\)/g;
  let m;
  while ((m = re.exec(raw))) {
    out.push({ refId: Number(m[1]), note: m[2].trim() });
  }
  return out;
}

// Maps lowercased filename -> actual on-disk filename, since source images use
// inconsistent extension casing (e.g. "PB190383.JPG") on a case-sensitive filesystem.
let imageFilesByLowerName = null;
function getImageFilesByLowerName() {
  if (!imageFilesByLowerName) {
    imageFilesByLowerName = new Map();
    if (fs.existsSync(IMAGES_DIR)) {
      for (const f of fs.readdirSync(IMAGES_DIR)) {
        imageFilesByLowerName.set(f.toLowerCase(), f);
      }
    }
  }
  return imageFilesByLowerName;
}

function findImage(photoId) {
  if (!photoId) return null;
  const exts = [".jpg", ".jpeg", ".png", ".webp"];
  const byLowerName = getImageFilesByLowerName();
  for (const ext of exts) {
    const actualName = byLowerName.get(`${photoId}${ext}`.toLowerCase());
    if (!actualName) continue;
    fs.mkdirSync(PUBLIC_IMAGES_DIR, { recursive: true });
    fs.copyFileSync(path.join(IMAGES_DIR, actualName), path.join(PUBLIC_IMAGES_DIR, actualName));
    return `/images/toys/${actualName}`;
  }
  return null;
}

function ingestBrinquedos(wb) {
  const ws = wb.Sheets["brinquedos"];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: undefined });
  const [, ...data] = rows;

  return data
    .filter((r) => r[0] !== undefined && r[1] !== undefined)
    .map((r) => {
      const id = Number(r[0]);
      const name = cell(r, 1);
      const photoIds = [cell(r, 22), cell(r, 23), cell(r, 24), cell(r, 25)].filter(Boolean);

      return {
        id,
        slug: `${id}-${slugify(name)}`,
        name,
        model: cell(r, 2),
        type: normalizeLabel(cell(r, 3)),
        topic: normalizeLabel(cell(r, 4)),
        description: cell(r, 5),
        mechanism: normalizeLabel(cell(r, 6)),
        movementDescription: cell(r, 7),
        materials: cell(r, 8),
        dimensions: cell(r, 9),
        trademark: cell(r, 10),
        condition: normalizeLabel(cell(r, 11)),
        firstYear: cell(r, 12),
        lastYear: cell(r, 13),
        boxDescription: cell(r, 14),
        bookRefs: parsePairs(cell(r, 19)).map((p) => ({ bookId: p.refId, pages: p.note })),
        research: cell(r, 20),
        notes: cell(r, 21),
        photoIds,
        photos: photoIds.map(findImage).filter(Boolean),
        // Private fields: stats-only, never rendered on public pages.
        private: {
          cost: cell(r, 15),
          purchaseDate: cell(r, 16),
          purchaseSource: cell(r, 17),
          valueRaw: cell(r, 18),
          valueEntries: parsePairs(cell(r, 18)).map((p) => ({ amount: p.refId, note: p.note })),
        },
      };
    });
}

function ingestLivros(wb) {
  const ws = wb.Sheets["livros"];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: undefined });
  const [, ...data] = rows;

  return data
    .filter((r) => r[0] !== undefined && r[1] !== undefined)
    .map((r) => {
      const id = Number(r[0]);
      const title = cell(r, 1);
      return {
        id,
        slug: `${id}-${slugify(title)}`,
        title,
        authors: cell(r, 2),
        year: cell(r, 3),
        publisher: cell(r, 4),
        location: cell(r, 5),
        pagesWithOurToys: cell(r, 6),
        notes: cell(r, 7),
      };
    });
}

const RESEARCH_FILE = path.join(ROOT, "data/research/manufacturers.json");
const TRANSLATIONS_FILE = path.join(ROOT, "data/research/translations.json");

function loadByLowerTrademark(file) {
  if (!fs.existsSync(file)) return new Map();
  const raw = JSON.parse(fs.readFileSync(file, "utf-8"));
  delete raw._readme;
  const byLowerTrademark = new Map();
  for (const [trademark, entry] of Object.entries(raw)) {
    byLowerTrademark.set(trademark.toLowerCase(), entry);
  }
  return byLowerTrademark;
}

function ingestFabricantes(wb) {
  const ws = wb.Sheets["fabricantes"];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: undefined });
  const [, ...data] = rows;
  const research = loadByLowerTrademark(RESEARCH_FILE);
  const translations = loadByLowerTrademark(TRANSLATIONS_FILE);

  return data
    .filter((r) => r[1] !== undefined)
    .map((r, idx) => {
      const trademark = cell(r, 1);
      const extra = trademark ? research.get(trademark.toLowerCase()) : undefined;
      const tr = trademark ? translations.get(trademark.toLowerCase()) : undefined;

      return {
        id: idx + 1,
        slug: slugify(trademark),
        logo: cell(r, 0),
        trademark,
        manufacturer: cell(r, 2),
        address: tr?.address ?? cell(r, 3),
        country: cell(r, 4) ?? extra?.country,
        startActivity: tr?.startActivity ?? cell(r, 5) ?? extra?.startActivity,
        endActivity: tr?.endActivity ?? cell(r, 6) ?? extra?.endActivity,
        founder: tr?.founder ?? cell(r, 7),
        history: tr?.history ?? cell(r, 8) ?? extra?.history,
        typesOfToys: tr?.typesOfToys ?? cell(r, 9),
        bibliography: cell(r, 10),
        sources: extra?.sources,
      };
    });
}

function main() {
  if (!fs.existsSync(SOURCE_FILE)) {
    console.error(`Missing spreadsheet at ${SOURCE_FILE}`);
    process.exit(1);
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const wb = XLSX.readFile(SOURCE_FILE);
  const toys = ingestBrinquedos(wb);
  const books = ingestLivros(wb);
  const manufacturers = ingestFabricantes(wb);

  const stats = {
    totalToys: toys.length,
    totalBooks: books.length,
    totalManufacturers: manufacturers.length,
    byType: countBy(toys, "type"),
    byTopic: countBy(toys, "topic"),
    byMechanism: countBy(toys, "mechanism"),
    byCondition: countBy(toys, "condition"),
    byTrademark: countBy(toys, "trademark"),
  };

  fs.writeFileSync(path.join(OUT_DIR, "toys.json"), JSON.stringify(toys, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, "books.json"), JSON.stringify(books, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, "manufacturers.json"), JSON.stringify(manufacturers, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, "stats.json"), JSON.stringify(stats, null, 2));

  console.log(
    `Ingested ${toys.length} toys, ${books.length} books, ${manufacturers.length} manufacturers.`
  );
}

function countBy(arr, key) {
  const out = {};
  for (const item of arr) {
    const v = item[key] || "Unspecified";
    out[v] = (out[v] || 0) + 1;
  }
  return out;
}

main();
