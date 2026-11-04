import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('proyecto del acueducto veredal', () => {
  test('presenta el video y todos los derivados sin desbordamiento', async ({ page }, testInfo) => {
    await page.goto('/proyectos/optimizacion-acueducto-veredal/');

    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Estudios hidrológicos e hidráulicos para un sistema de captación, bombeo y conducción.',
      }),
    ).toBeVisible();
    await expect(page.locator('video source')).toHaveAttribute(
      'src',
      /optimizacion-acueducto-veredal-1080p\.mp4$/,
    );
    await expect(page.locator('video')).toHaveAttribute('preload', 'metadata');
    await expect(page.locator('.project-gallery img')).toHaveCount(15);

    const videoMetadata = await page.locator('video').evaluate(async (video) => {
      const media = video as HTMLVideoElement;
      if (media.readyState < HTMLMediaElement.HAVE_METADATA) {
        await new Promise<void>((resolve) => {
          media.addEventListener('loadedmetadata', () => resolve(), { once: true });
        });
      }
      return { duration: media.duration, width: media.videoWidth, height: media.videoHeight };
    });
    expect(videoMetadata.width).toBe(1920);
    expect(videoMetadata.height).toBe(1080);
    expect(videoMetadata.duration).toBeGreaterThan(69);
    expect(videoMetadata.duration).toBeLessThan(71);

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
      const images = page.locator('.project-gallery img');
      for (let index = 0; index < (await images.count()); index += 1) {
        const image = images.nth(index);
        await image.scrollIntoViewIfNeeded();
        await expect(image).toHaveJSProperty('complete', true);
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({
        path: `output/playwright/acueducto-draft-${testInfo.project.name}.png`,
        fullPage: true,
      });
    }
  });
});
