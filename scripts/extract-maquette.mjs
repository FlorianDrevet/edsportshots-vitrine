import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const args = new Map();
for (let index = 2; index < process.argv.length; index += 1) {
  const key = process.argv[index];
  const value = process.argv[index + 1];
  if (key.startsWith("--") && value && !value.startsWith("--")) {
    args.set(key, value);
    index += 1;
  }
}

const source = path.resolve(args.get("--source") ?? "./Site vitrine EDSPORTSHOTS.html");
const direction = (args.get("--direction") ?? "a").toLowerCase();
const output = path.resolve(args.get("--output") ?? ".");

if (!fs.existsSync(source)) {
  throw new Error(`Maquette introuvable : ${source}`);
}
if (!["a", "c"].includes(direction)) {
  throw new Error("--direction doit valoir a ou c");
}

const sourceText = fs.readFileSync(source, "utf8");

function scriptContent(text, type) {
  const marker = `<script type="${type}">`;
  const start = text.indexOf(marker);
  if (start < 0) throw new Error(`Bloc ${type} introuvable`);
  const contentStart = start + marker.length;
  const contentEnd = text.indexOf("</script>", contentStart);
  return text.slice(contentStart, contentEnd);
}

function unpack(entry) {
  const bytes = Buffer.from(entry.data, "base64");
  return entry.compressed ? zlib.gunzipSync(bytes) : bytes;
}

function extensionForMime(mime) {
  return {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "font/woff2": "woff2",
    "font/woff": "woff",
    "font/ttf": "ttf",
  }[mime] ?? "bin";
}

const outerManifest = JSON.parse(scriptContent(sourceText, "__bundler/manifest"));
const pageOrder = JSON.parse(scriptContent(sourceText, "__bundler/page_order"));
const pages = direction === "a"
  ? [
      [0, "index.html"],
      [1, "galerie.html"],
      [2, "reportage.html"],
      [3, "prestations.html"],
    ]
  : [
      [5, "index.html"],
      [6, "galerie.html"],
      [7, "reportage.html"],
      [8, "prestations.html"],
    ];

const accent = direction === "a" ? "#E4572E" : "#D8FF3E";
const routeMap = {
  "Main.dc.html": "index.html",
  "Chrono.dc.html": "index.html",
  "A-Galerie.dc.html": "galerie.html",
  "C-Galerie.dc.html": "galerie.html",
  "A-Reportage.dc.html": "reportage.html",
  "C-Reportage.dc.html": "reportage.html",
  "A-Prestations.dc.html": "prestations.html",
  "C-Prestations.dc.html": "prestations.html",
};

const assetDirectory = path.join(output, "assets", "maquette");
fs.mkdirSync(assetDirectory, { recursive: true });
const assetPaths = new Map();

function materializeAsset(id, entry) {
  if (assetPaths.has(id)) return assetPaths.get(id);

  const bytes = unpack(entry);
  const digest = crypto.createHash("sha256").update(bytes).digest("hex").slice(0, 20);
  const filename = `${digest}.${extensionForMime(entry.mime)}`;
  const absolutePath = path.join(assetDirectory, filename);
  if (!fs.existsSync(absolutePath)) fs.writeFileSync(absolutePath, bytes);

  const relativePath = path.posix.join("assets", "maquette", filename);
  assetPaths.set(id, relativePath);
  return relativePath;
}

for (const [pageIndex, filename] of pages) {
  const pageId = pageOrder[pageIndex];
  const pageText = unpack(outerManifest[pageId]).toString("utf8");
  const nestedManifest = JSON.parse(scriptContent(pageText, "__bundler/manifest"));
  let template = JSON.parse(scriptContent(pageText, "__bundler/template"));

  template = template.replace(/<script\b[^>]*\bsrc="[^"]+"[^>]*><\/script>/gi, "");
  template = template.replace(/<script\b[^>]*type="text\/x-dc"[^>]*>[\s\S]*?<\/script>/gi, "");
  template = template.replaceAll("<x-dc>", "").replaceAll("</x-dc>", "");
  template = template.replaceAll("<helmet>", "").replaceAll("</helmet>", "");
  template = template.replaceAll("{{accent}}", accent);

  for (const [from, to] of Object.entries(routeMap)) template = template.replaceAll(from, to);

  const references = new Set(
    template.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g) ?? [],
  );
  for (const id of references) {
    const entry = nestedManifest[id];
    if (!entry || entry.mime === "text/javascript") continue;
    template = template.replaceAll(id, materializeAsset(id, entry));
  }

  fs.writeFileSync(path.join(output, filename), `${template.trim()}\n`, "utf8");
  console.log(`generated ${filename}`);
}

console.log(`extracted ${assetPaths.size} assets for direction ${direction.toUpperCase()}`);
