import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('proyecto de encauzamiento hidráulico', () => {
  test('presenta el video y la evidencia técnica sin desbordamiento', async ({ page }) => {
    await page.goto('/proyectos/encauzamiento-hidraulico-uchupayaco/');

    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Modelar el cauce para ordenar el flujo.',
      }),
    ).toBeVisible();
    await expect(page.locator('video source')).toHaveAttribute(
      'src',
      /encauzamiento-hidraulico-uchupayaco-1080p\.mp4$/,
    );
    await expect(page.locator('video')).toHaveAttribute('preload', 'metadata');
    await expect(page.locator('.project-gallery img')).toHaveCount(11);

    const metadata = await page.locator('video').evaluate(async (video) => {
      const media = video as HTMLVideoElement;
      if (media.readyState < HTMLMediaElement.HAVE_METADATA) {
        await new Promise<void>((resolve) => {
          media.addEventListener('loadedmetadata', () => resolve(), { once: true });
        });
      }
      return { duration: media.duration, width: media.videoWidth, height: media.videoHeight };
    });
    expect(metadata.width).toBe(1920);
    expect(metadata.height).toBe(1080);
    expect(metadata.duration).toBeGreaterThan(82);
    expect(metadata.duration).toBeLessThan(84);

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);

    const results = await new AxeBuilder({ page }).analyze();
    expect(
      results.violations.filter(
        (violation) => violation.impact === 'serious' || violation.impact === 'critical',
      ),
    ).toEqual([]);
  });
});
