import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('la portada usa la dirección Atlas cobalto y conserva su estructura responsive', async ({
  page,
}, testInfo) => {
  await page.goto('/');

  const atlas = page.getByRole('img', {
    name: 'Proceso de un estudio de ingeniería del agua',
  });
  await expect(atlas).toBeVisible();
  await expect(page.locator('.atlas__step')).toHaveCount(5);
  await expect(page.locator('.atlas figcaption')).toHaveCount(0);

  const tokens = await page.evaluate(() => {
    const styles = getComputedStyle(document.documentElement);
    return {
      navy: styles.getPropertyValue('--ref-blue-950').trim(),
      cobalt: styles.getPropertyValue('--ref-blue-800').trim(),
      indigo: styles.getPropertyValue('--ref-indigo-700').trim(),
      paper: styles.getPropertyValue('--ref-blue-050').trim(),
    };
  });

  expect(tokens).toEqual({
    navy: '#071e3d',
    cobalt: '#174ea6',
    indigo: '#3346a8',
    paper: '#f4f7fb',
  });

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);

  const results = await new AxeBuilder({ page }).analyze();
  const seriousViolations = results.violations.filter(
    (violation) => violation.impact === 'serious' || violation.impact === 'critical',
  );
  expect(seriousViolations).toEqual([]);

  if (process.env.CAPTURE_MILESTONES) {
    await page.screenshot({
      path: `output/playwright/module-3-5-atlas-${testInfo.project.name}.png`,
      fullPage: true,
    });
  }
});

test('la especialidad muestra el acento índigo sin desbordamiento', async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== 'desktop-chromium',
    'Una captura representativa es suficiente',
  );
  await page.goto('/especialidades/hidraulica-ingenieria-rios/');

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);

  if (process.env.CAPTURE_MILESTONES) {
    await page.screenshot({
      path: 'output/playwright/module-3-5-especialidad-indigo.png',
      fullPage: true,
    });
  }
});
