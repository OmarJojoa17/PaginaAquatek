import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const pages = [
  {
    path: '/empresa/',
    title: /Empresa \| Aquatek/,
    heading: 'Ingeniería del agua, explicada con claridad.',
  },
  {
    path: '/capacidades/',
    title: /Capacidades técnicas \| Aquatek/,
    heading: 'Convertimos información en decisiones de diseño.',
  },
  {
    path: '/contacto/',
    title: /Contacto \| Aquatek/,
    heading: 'Hablemos de su estudio o diseño hidráulico.',
  },
] as const;

for (const item of pages) {
  test(`${item.path} tiene título, descripción y un solo h1`, async ({ page }, testInfo) => {
    await page.goto(item.path);

    await expect(page).toHaveTitle(item.title);
    await expect(page.getByRole('heading', { level: 1, name: item.heading })).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex, nofollow',
    );
    await expect(page.locator('.page-hero__lockup img')).toHaveAttribute(
      'src',
      /logo-aquatek-recursos-hidricos\.png$/,
    );

    const brandMarkWidth = await page
      .locator('.page-hero__lockup img')
      .evaluate((mark) => mark.getBoundingClientRect().width);
    expect(brandMarkWidth).toBeGreaterThanOrEqual(168);

    if (process.env.CAPTURE_MILESTONES && testInfo.project.name === 'desktop-chromium') {
      const name = item.path.replaceAll('/', '') || 'inicio';
      await page.screenshot({ path: `output/playwright/module-2-${name}.png`, fullPage: true });

      if (item.path === '/contacto/') {
        await page.screenshot({
          path: 'output/playwright/module-6-2-contacto-brand.png',
          fullPage: false,
        });
      }
    }

    if (
      process.env.CAPTURE_MILESTONES &&
      testInfo.project.name === 'mobile-chromium' &&
      item.path === '/capacidades/'
    ) {
      await page.screenshot({
        path: 'output/playwright/module-2-capacidades-mobile.png',
        fullPage: true,
      });
    }

    if (
      process.env.CAPTURE_MILESTONES &&
      testInfo.project.name === 'mobile-chromium' &&
      item.path === '/contacto/'
    ) {
      await page.screenshot({
        path: 'output/playwright/module-6-2-contacto-brand-mobile.png',
        fullPage: false,
      });
    }
  });
}

test('navega desde inicio hasta las páginas institucionales', async ({ page }, testInfo) => {
  await page.goto('/');

  if (testInfo.project.name === 'mobile-chromium') {
    await page.getByText('Menú', { exact: true }).click();
    await page
      .getByRole('navigation', { name: 'Navegación móvil' })
      .getByRole('link', { name: 'Empresa' })
      .click();
  } else {
    await page
      .getByRole('navigation', { name: 'Navegación principal' })
      .getByRole('link', { name: 'Empresa' })
      .click();
  }

  await expect(page).toHaveURL(/\/empresa\/$/);
  await expect(page.locator('a[aria-current="page"]', { hasText: 'Empresa' })).toHaveCount(2);
});

test('aplica una política de seguridad sin permisos inseguros', async ({ page }) => {
  await page.goto('/proyectos/');

  const csp = await page
    .locator('meta[http-equiv="content-security-policy"]')
    .getAttribute('content');
  expect(csp).toContain("default-src 'self'");
  expect(csp).toContain("object-src 'none'");
  expect(csp).not.toContain("'unsafe-inline'");
  expect(csp).not.toContain("'unsafe-eval'");
  await expect(page.locator('meta[name="referrer"]')).toHaveAttribute(
    'content',
    'strict-origin-when-cross-origin',
  );

  await page.getByLabel('Buscar').fill('sin coincidencias');
  await expect(
    page.getByRole('heading', { name: 'No hay proyectos con esos filtros.' }),
  ).toBeVisible();
});

test('páginas institucionales no presentan fallos serios de accesibilidad', async ({ page }) => {
  for (const item of pages) {
    await page.goto(item.path);
    const results = await new AxeBuilder({ page }).analyze();
    const seriousViolations = results.violations.filter(
      (violation) => violation.impact === 'serious' || violation.impact === 'critical',
    );
    expect(seriousViolations, `${item.path}: ${JSON.stringify(seriousViolations)}`).toEqual([]);
  }
});

test('contacto publica únicamente el correo aprobado', async ({ page }, testInfo) => {
  await page.goto('/contacto/');

  await expect(page.getByRole('link', { name: 'aquatek@gmail.com' })).toHaveAttribute(
    'href',
    'mailto:aquatek@gmail.com',
  );
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(1);
  await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);
  await expect(page.locator('a[href*="wa.me"]')).toHaveCount(0);

  if (process.env.CAPTURE_MILESTONES && testInfo.project.name === 'desktop-chromium') {
    await page.screenshot({
      path: 'output/playwright/module-6-1-contacto.png',
      fullPage: true,
    });
  }
});

test('vista previa bloquea indexación y publica sitemap técnico', async ({ request }) => {
  const robots = await request.get('/robots.txt');
  expect(await robots.text()).toContain('Disallow: /');

  const sitemap = await request.get('/sitemap.xml');
  const xml = await sitemap.text();
  expect(xml).toContain('https://aquatek.invalid/empresa/');
  expect(xml).toContain('https://aquatek.invalid/capacidades/');
  expect(xml).toContain('https://aquatek.invalid/contacto/');
});
