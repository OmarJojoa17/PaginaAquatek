import { readdir, readFile, stat } from 'node:fs/promises';
import { extname, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');
const publicDir = resolve(root, 'public');
const sourceDir = resolve(root, 'src');
const configuredBase = process.env.PUBLIC_BASE_PATH;
const expectedBase = configuredBase
  ? `/${configuredBase.replace(/^\/+|\/+$/g, '')}/`.replace('//', '/')
  : undefined;
const limits = {
  image: 200 * 1024,
  video: 6 * 1024 * 1024,
  totalMedia: 8 * 1024 * 1024,
};
const imageExtensions = new Set(['.avif', '.jpg', '.jpeg', '.png', '.webp']);
const videoExtensions = new Set(['.mp4', '.webm']);
const forbiddenPublicExtensions = new Set([
  '.doc',
  '.docx',
  '.dwg',
  '.dxf',
  '.pdf',
  '.rvt',
  '.xls',
  '.xlsx',
  '.zip',
]);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = resolve(directory, entry.name);
      return entry.isDirectory() ? walk(path) : [path];
    }),
  );
  return nested.flat();
}

const [distFiles, publicFiles, sourceFiles] = await Promise.all([
  walk(dist),
  walk(publicDir),
  walk(sourceDir),
]);
const failures = [];
const warnings = [];
const mediaFiles = distFiles.filter((file) =>
  new Set([...imageExtensions, ...videoExtensions]).has(extname(file).toLowerCase()),
);
let totalMedia = 0;

for (const file of mediaFiles) {
  const size = (await stat(file)).size;
  const extension = extname(file).toLowerCase();
  totalMedia += size;

  if (imageExtensions.has(extension) && size > limits.image) {
    failures.push(`${relative(dist, file)} supera 200 KiB (${Math.ceil(size / 1024)} KiB).`);
  }
  if (videoExtensions.has(extension) && size > limits.video) {
    failures.push(`${relative(dist, file)} supera 6 MiB (${(size / 1024 / 1024).toFixed(2)} MiB).`);
  }
}

if (totalMedia > limits.totalMedia) {
  failures.push(`Los medios suman ${(totalMedia / 1024 / 1024).toFixed(2)} MiB; límite: 8 MiB.`);
}

for (const file of publicFiles) {
  if (forbiddenPublicExtensions.has(extname(file).toLowerCase())) {
    failures.push(
      `Archivo fuente o descargable no permitido en public/: ${relative(publicDir, file)}.`,
    );
  }
}

const htmlFiles = distFiles.filter((file) => extname(file).toLowerCase() === '.html');
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const name = relative(dist, file);
  const h1Count = (html.match(/<h1(?:\s|>)/g) ?? []).length;
  const csp = html.match(
    /<meta[^>]+http-equiv="content-security-policy"[^>]+content="([^"]*)"/i,
  )?.[1];

  if (!/<title>[^<]+<\/title>/i.test(html)) failures.push(`${name}: falta un título.`);
  if (!/<meta[^>]+name="description"[^>]+content="[^"]+"/i.test(html)) {
    failures.push(`${name}: falta la descripción.`);
  }
  if (!/<meta[^>]+name="robots"[^>]+content="[^"]+"/i.test(html)) {
    failures.push(`${name}: falta la directiva robots.`);
  }
  if (h1Count !== 1) failures.push(`${name}: contiene ${h1Count} encabezados h1.`);
  if (!csp) failures.push(`${name}: falta Content Security Policy.`);
  if (csp?.includes("'unsafe-inline'") || csp?.includes("'unsafe-eval'")) {
    failures.push(`${name}: la CSP permite unsafe-inline o unsafe-eval.`);
  }
  if (!csp?.includes("object-src 'none'")) failures.push(`${name}: la CSP no bloquea object-src.`);
  if (!/<meta[^>]+name="referrer"[^>]+content="strict-origin-when-cross-origin"/i.test(html)) {
    failures.push(`${name}: falta una política de referrer restrictiva.`);
  }

  if (expectedBase) {
    const localUrls = [...html.matchAll(/(?:href|src)="(\/[^"#]*)"/g)].map((match) => match[1]);
    for (const url of localUrls) {
      if (!url.startsWith(expectedBase)) {
        failures.push(`${name}: la URL ${url} no respeta la base ${expectedBase}.`);
      }
    }
  }
}

const searchableSource = (
  await Promise.all(sourceFiles.map((file) => readFile(file, 'utf8').catch(() => '')))
).join('\n');
for (const file of publicFiles) {
  const filename = relative(publicDir, file).replaceAll('\\', '/');
  if (!filename.startsWith('media/')) continue;
  if (extname(file) && !filename.endsWith('.gitkeep') && !searchableSource.includes(filename)) {
    warnings.push(`Medio sin referencia desde src/: ${filename}.`);
  }
}

if (warnings.length) {
  console.warn(`Avisos de auditoría:\n- ${warnings.join('\n- ')}`);
}

if (failures.length) {
  throw new Error(`Auditoría técnica fallida:\n- ${failures.join('\n- ')}`);
}

console.log(
  `Auditoría técnica correcta: ${htmlFiles.length} páginas, ${mediaFiles.length} medios, ${(totalMedia / 1024 / 1024).toFixed(2)} MiB.`,
);
