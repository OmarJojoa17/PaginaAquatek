import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('proyecto de encauzamiento', () => {
  test('publica el video y los derivados técnicos sin desbordamiento', async ({
    page,
  }, testInfo) => {
    await page.goto('/proyectos/encauzamiento-cauce/');

    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Un cauce definido para conducir mejor el flujo.',
      }),
    ).toBeVisible();
    await expect(page.locator('video source')).toHaveAttribute(
      'src',
      /encauzamiento-cauce-1080p\.mp4$/,
    );
    await expect(page.locator('.project-gallery img')).toHaveCount(12);

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
    expect(metadata.duration).toBeGreaterThan(86);
    expect(metadata.duration).toBeLessThan(88);

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

    if (process.env.CAPTURE_MILESTONES) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({
        path: `output/revision-encauzamiento/portada-web-${testInfo.project.name}.png`,
      });
      const centeredMap = page.locator('.project-gallery__item--centered');
      await centeredMap.scrollIntoViewIfNeeded();
      await centeredMap.locator('img').evaluate(async (image) => {
        const element = image as HTMLImageElement;
        if (!element.complete) {
          await new Promise<void>((resolve) => {
            element.addEventListener('load', () => resolve(), { once: true });
          });
        }
      });
      await centeredMap.screenshot({
        path: `output/revision-encauzamiento/mapa-centrado-${testInfo.project.name}.png`,
      });
      const completeSection = page.locator('.project-gallery__item').last();
      await completeSection.scrollIntoViewIfNeeded();
      await completeSection.locator('img').evaluate(async (image) => {
        const element = image as HTMLImageElement;
        if (!element.complete) {
          await new Promise<void>((resolve) => {
            element.addEventListener('load', () => resolve(), { once: true });
          });
        }
      });
      await completeSection.screenshot({
        path: `output/revision-encauzamiento/seccion-completa-${testInfo.project.name}.png`,
      });
    }
  });
});
