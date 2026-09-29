import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('presenta el primer proyecto publicado', async ({ page }, testInfo) => {
  await page.goto('/proyectos/');

  await expect(page).toHaveTitle(/Proyectos de ingeniería del agua/);
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Estudios, modelos y decisiones que se pueden revisar.',
    }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Portafolio técnico' })).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Diseño hidráulico de la nueva PTAP de San Francisco' }),
  ).toBeVisible();

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);

  if (process.env.CAPTURE_MILESTONES) {
    await page.screenshot({
      path: `output/playwright/module-4-proyectos-${testInfo.project.name}.png`,
      fullPage: true,
    });
  }
});

test('marca proyectos como sección actual', async ({ page }, testInfo) => {
  await page.goto('/proyectos/');

  if (testInfo.project.name === 'mobile-chromium') {
    await page.getByText('Menú', { exact: true }).click();
  }

  const navigationName =
    testInfo.project.name === 'mobile-chromium' ? 'Navegación móvil' : 'Navegación principal';
  await expect(
    page.getByRole('navigation', { name: navigationName }).getByRole('link', { name: 'Proyectos' }),
  ).toHaveAttribute('aria-current', 'page');
});

test('el proyecto genera una ruta pública y entra al sitemap', async ({ request }) => {
  const projectResponse = await request.get('/proyectos/ptap-san-francisco/');
  expect(projectResponse.status()).toBe(200);

  const sitemap = await (await request.get('/sitemap.xml')).text();
  expect(sitemap).toContain('https://aquatek.invalid/proyectos/');
  expect(sitemap).toContain('/proyectos/ptap-san-francisco/');
});

test('la ficha abre con portada y luego presenta el video', async ({ page }, testInfo) => {
  await page.goto('/proyectos/ptap-san-francisco/');

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Diseño hidráulico y modelación BIM de una PTAP convencional para 16 L/s.',
    }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'El proyecto en 60 segundos' })).toBeVisible();
  await expect(page.locator('video source')).toHaveAttribute(
    'src',
    /ptap-san-francisco-720p\.mp4$/,
  );
  await expect(page.locator('video')).toHaveAttribute('preload', 'metadata');
  const galleryLoadingModes = await page
    .locator('.project-gallery img')
    .evaluateAll((images) => images.map((image) => image.getAttribute('loading')));
  expect(galleryLoadingModes).toEqual(Array(8).fill('lazy'));
  await expect(page.getByText('Lectura rápida del proyecto')).toBeVisible();
  await expect(page.locator('.project-results')).toHaveCSS('background-color', 'rgb(51, 70, 168)');
  await expect(page.getByText('Manuales técnicos CEPIS')).toHaveCount(0);
  await expect(page.locator('img[src*="memoria-caudales"]')).toHaveCount(0);
  await expect(page.locator('img[src*="memoria-mezcla-rapida"]')).toHaveCount(0);

  const evidenceSources = await page
    .locator('.project-gallery img')
    .evaluateAll((images) => images.map((image) => image.getAttribute('src')?.split('/').at(-1)));
  expect(evidenceSources).toEqual([
    'modelo-general.webp',
    'modelo-unidades-en-corte.webp',
    'modelo-implantacion-topografia.webp',
    'plano-implantacion.webp',
    'plano-tren-tratamiento.webp',
    'plano-corte-unidades.webp',
    'memoria-portada.webp',
    'hidrologia-precipitacion.webp',
  ]);

  const order = await page.evaluate(() => {
    const hero = document.querySelector('.project-hero');
    const film = document.querySelector('.project-film');
    const facts = document.querySelector('.project-facts');
    return [hero, film, facts].map((element) => element?.getBoundingClientRect().top ?? -1);
  });
  expect(order[0]).toBeLessThan(order[1]);
  expect(order[1]).toBeLessThan(order[2]);

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);

  if (process.env.CAPTURE_MILESTONES) {
    const evidenceImages = page.locator('.project-gallery img');
    for (let index = 0; index < (await evidenceImages.count()); index += 1) {
      const image = evidenceImages.nth(index);
      await image.scrollIntoViewIfNeeded();
      await expect(image).toHaveJSProperty('complete', true);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
      path: `output/playwright/module-5-ptap-${testInfo.project.name}.png`,
      fullPage: true,
    });
  }
});

test('el índice no presenta fallos automáticos serios de accesibilidad', async ({ page }) => {
  await page.goto('/proyectos/');
  const results = await new AxeBuilder({ page }).analyze();
  const seriousViolations = results.violations.filter(
    (violation) => violation.impact === 'serious' || violation.impact === 'critical',
  );

  expect(seriousViolations).toEqual([]);
});

test('la ficha del proyecto no presenta fallos automáticos serios de accesibilidad', async ({
  page,
}) => {
  await page.goto('/proyectos/ptap-san-francisco/');
  const results = await new AxeBuilder({ page }).analyze();
  const seriousViolations = results.violations.filter(
    (violation) => violation.impact === 'serious' || violation.impact === 'critical',
  );

  expect(seriousViolations).toEqual([]);
});
