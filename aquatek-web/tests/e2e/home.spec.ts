import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('presenta el alcance técnico sin desbordamiento horizontal', async ({ page }, testInfo) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Aquatek/);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Estudios y diseños para proyectos hidráulicos.' }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Consultar un proyecto' }).first()).toBeVisible();
  await expect(page.getByText('Julián Pasuy', { exact: true })).toBeVisible();
  await expect(page.getByText('Omar David Jojoa', { exact: true })).toBeVisible();
  await expect(page.getByText('25202213839 CND', { exact: true })).toBeVisible();
  await expect(page.getByText('091037-0622737 CND', { exact: true })).toBeVisible();
  await expect(page.locator('#especialidades').getByRole('listitem')).toHaveCount(7);
  await expect(page.getByText('Redes contra incendio', { exact: true })).toBeVisible();
  await expect(page.getByText('Redes hidrosanitarias', { exact: true })).toBeVisible();
  await expect(
    page.getByRole('heading', {
      name: 'Quienes atienden también diseñan y firman.',
    }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', {
      name: 'Servicios para diseñar y controlar el agua adecuadamente.',
    }),
  ).toBeVisible();
  await expect(page.locator('#team-title')).toHaveText(
    'Quienes atienden también diseñan y firman.',
  );
  await expect(page.locator('.technical-team__intro > p')).not.toContainText('Julián Pasuy');
  await expect(page.locator('.technical-team__intro > p')).not.toContainText('Omar David Jojoa');
  await expect(page.locator('#scope-title')).toHaveText(
    'Servicios para diseñar y controlar el agua adecuadamente.',
  );
  await expect(page.getByText('Sitio técnico de Aquatek')).toBeVisible();
  await expect(page.getByText('Portafolio técnico en desarrollo')).toHaveCount(0);

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);

  if (process.env.CAPTURE_MILESTONES) {
    await page.screenshot({
      path: `output/playwright/module-1-${testInfo.project.name}.png`,
      fullPage: true,
    });
  }
});

test('permite saltar al contenido con teclado', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Ir al contenido' })).toBeFocused();
});

test('abre el menú móvil y expone navegación principal', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'Recorrido exclusivo de móvil');
  await page.goto('/');

  await page.getByText('Menú', { exact: true }).click();
  const mobileNavigation = page.getByRole('navigation', { name: 'Navegación móvil' });
  await expect(mobileNavigation).toBeVisible();
  await expect(mobileNavigation.getByRole('link', { name: 'Inicio' })).toBeVisible();
  await expect(mobileNavigation.getByRole('link', { name: 'Proyectos' })).toBeVisible();
  await expect(mobileNavigation.getByRole('link', { name: 'Contacto' })).toBeVisible();

  if (process.env.CAPTURE_MILESTONES) {
    await page.screenshot({
      path: 'output/playwright/module-1-navigation-mobile.png',
      fullPage: false,
    });
  }
});

test('no presenta fallos automáticos serios de accesibilidad', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  const seriousViolations = results.violations.filter(
    (violation) => violation.impact === 'serious' || violation.impact === 'critical',
  );

  expect(seriousViolations).toEqual([]);
});
