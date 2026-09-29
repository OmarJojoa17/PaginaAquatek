import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';

const root = resolve(import.meta.dirname, '..');
const source = pathToFileURL(resolve(root, 'design-previews', 'hero-background-options.html')).href;
const output = resolve(root, 'output', 'playwright', 'hero-background-options.png');

await mkdir(resolve(root, 'output', 'playwright'), { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 1100 },
  deviceScaleFactor: 1,
});
await page.goto(source);
await page.screenshot({ path: output, fullPage: true });
await browser.close();

console.log(output);
