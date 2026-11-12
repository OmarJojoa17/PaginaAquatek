import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('protección de estribo publicada', () => {
  test('expone la ficha pública sin fallos graves de accesibilidad', async ({ page }) => {
    const response = await page.goto('/proyectos/proteccion-estribo-macizo-rocoso/');

    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Entender el cauce para proteger el estribo.',
    );

    const results = await new AxeBuilder({ page }).analyze();
    expect(
      results.violations.filter(
        (violation) => violation.impact === 'serious' || violation.impact === 'critical',
      ),
    ).toEqual([]);
  });
});
