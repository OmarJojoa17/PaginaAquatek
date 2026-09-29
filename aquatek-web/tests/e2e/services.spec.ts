import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const services = [
  {
    slug: 'hidrologia',
    title: 'Hidrología',
    heading: 'Entender cómo llega y se mueve el agua en una cuenca.',
  },
  {
    slug: 'acueductos-redes-presion',
    title: 'Acueductos y redes a presión',
    heading: 'Llevar el agua con la presión y el caudal requeridos.',
  },
  {
    slug: 'alcantarillado-sanitario-pluvial',
    title: 'Alcantarillado sanitario y pluvial',
    heading: 'Conducir aguas residuales y lluvias con capacidad verificable.',
  },
  {
    slug: 'hidraulica-ingenieria-rios',
    title: 'Hidráulica e ingeniería de ríos',
    heading: 'Leer el cauce antes de definir una intervención.',
  },
  {
    slug: 'drenaje-vial',
    title: 'Drenaje vial',
    heading: 'Controlar la escorrentía que llega a la vía y sale de ella.',
  },
  {
    slug: 'redes-contra-incendio',
    title: 'Redes contra incendio',
    heading: 'Verificar que la red responda en la condición de demanda.',
  },
  {
    slug: 'redes-hidrosanitarias',
    title: 'Redes hidrosanitarias',
    heading: 'Coordinar el agua potable, el desagüe y la lluvia en la edificación.',
  },
] as const;

test('el índice enlaza las siete especialidades', async ({ page }, testInfo) => {
  await page.goto('/especialidades/');

  await expect(page).toHaveTitle(/Especialidades en ingeniería del agua/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  const list = page.getByRole('list');
  await expect(list.getByRole('listitem')).toHaveCount(7);

  for (const service of services) {
    await expect(
      list.getByRole('link', { name: `Ver alcance de ${service.title}` }),
    ).toHaveAttribute('href', `/especialidades/${service.slug}/`);
  }

  if (process.env.CAPTURE_MILESTONES && testInfo.project.name === 'desktop-chromium') {
    await page.screenshot({
      path: 'output/playwright/module-3-especialidades.png',
      fullPage: true,
    });
  }
});

for (const service of services) {
  test(`${service.title} usa la plantilla técnica`, async ({ page }, testInfo) => {
    await page.goto(`/especialidades/${service.slug}/`);

    await expect(page).toHaveTitle(new RegExp(`${service.title} \\| Aquatek`));
    await expect(page.getByRole('heading', { level: 1, name: service.heading })).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    const schemas = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((elements) => elements.map((element) => element.textContent ?? ''));
    expect(schemas.some((schema) => schema.includes('"@type":"Service"'))).toBe(true);
    const hasPtapProject =
      service.slug === 'hidrologia' || service.slug === 'acueductos-redes-presion';
    if (hasPtapProject) {
      await expect(
        page.getByRole('link', { name: 'Diseño hidráulico de la nueva PTAP de San Francisco' }),
      ).toHaveAttribute('href', '/proyectos/ptap-san-francisco/');
    } else {
      await expect(
        page.getByText(
          'Los casos públicos de esta especialidad se incorporarán cuando su información esté revisada y autorizada.',
        ),
      ).toBeVisible();
    }

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);

    if (
      process.env.CAPTURE_MILESTONES &&
      service.slug === 'hidrologia' &&
      testInfo.project.name === 'desktop-chromium'
    ) {
      await page.screenshot({
        path: 'output/playwright/module-3-hidrologia.png',
        fullPage: true,
      });
    }

    if (
      process.env.CAPTURE_MILESTONES &&
      service.slug === 'redes-contra-incendio' &&
      testInfo.project.name === 'mobile-chromium'
    ) {
      await page.screenshot({
        path: 'output/playwright/module-3-incendio-mobile.png',
        fullPage: true,
      });
    }
  });
}

test('la navegación reconoce la sección de especialidades', async ({ page }, testInfo) => {
  await page.goto('/especialidades/hidrologia/');

  const navigationName =
    testInfo.project.name === 'mobile-chromium' ? 'Navegación móvil' : 'Navegación principal';

  if (testInfo.project.name === 'mobile-chromium') {
    await page.getByText('Menú', { exact: true }).click();
  }

  await expect(
    page
      .getByRole('navigation', { name: navigationName })
      .getByRole('link', { name: 'Especialidades' }),
  ).toHaveAttribute('aria-current', 'page');
});

test('índice y plantilla no presentan fallos serios de accesibilidad', async ({ page }) => {
  for (const path of ['/especialidades/', '/especialidades/hidrologia/']) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    const seriousViolations = results.violations.filter(
      (violation) => violation.impact === 'serious' || violation.impact === 'critical',
    );
    expect(seriousViolations, `${path}: ${JSON.stringify(seriousViolations)}`).toEqual([]);
  }
});

test('el sitemap incluye el índice y las siete especialidades', async ({ request }) => {
  const response = await request.get('/sitemap.xml');
  const sitemap = await response.text();

  expect(sitemap).toContain('https://aquatek.invalid/especialidades/');
  for (const service of services) {
    expect(sitemap).toContain(`https://aquatek.invalid/especialidades/${service.slug}/`);
  }
});
