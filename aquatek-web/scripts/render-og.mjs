import { chromium } from '@playwright/test';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const input = pathToFileURL(resolve('public/og-default.svg')).href;
const output = resolve('public/og-default.png');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });

await page.goto(input);
await page.screenshot({ path: output });
await browser.close();
