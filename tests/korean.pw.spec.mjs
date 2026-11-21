import { test, expect } from '@playwright/test';
import { once } from 'node:events';
import { createDevServer } from '../tools/dev-server.mjs';

for (const width of [1440, 320]) {
  test(`Korean pages preserve language and layout at ${width}px`, async ({ page }) => {
    const server = createDevServer();
    server.listen(0, '127.0.0.1');
    await once(server, 'listening');
    const base = `http://127.0.0.1:${server.address().port}`;
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    try {
      await page.setViewportSize({ width, height: 900 });
      for (const route of ['/', '/services', '/resume', '/contact']) {
        await page.goto(`${base}${route}?source=test#main`);
        const korean = page.getByRole('link', { name: '한국어로 보기' });
        await expect(korean).toBeVisible();
        const bounds = await page.locator('.site-header').evaluate(header => {
          const brand = header.querySelector('.brand').getBoundingClientRect();
          const toggle = header.querySelector('.language-switch').getBoundingClientRect();
          return { brandRight: brand.right, toggleLeft: toggle.left, toggleRight: toggle.right, toggleHeight: toggle.height };
        });
        expect(bounds.brandRight).toBeLessThanOrEqual(bounds.toggleLeft);
        expect(bounds.toggleRight).toBeLessThanOrEqual(width);
        expect(bounds.toggleHeight).toBeGreaterThanOrEqual(44);
        await korean.click();
        await expect(page).toHaveURL(`${base}${route}?source=test&lang=ko#main`);
        await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
        await page.getByRole('link', { name: 'View in English' }).click();
        await expect(page).toHaveURL(`${base}${route}?source=test#main`);
        await expect(page.locator('html')).toHaveAttribute('lang', 'en');
      }
      await page.goto(`${base}/?source=test`);
      await page.getByRole('link', { name: 'Explore selected work' }).click();
      await page.getByRole('link', { name: '한국어로 보기' }).click();
      await expect(page).toHaveURL(`${base}/?source=test&lang=ko#work`);
      for (const [route, heading] of [
        ['/', /디지털 세상에/],
        ['/services/', /당신의 공간에/],
        ['/resume/', /작업을 뒷받침하는/],
        ['/contact/', /함께 이야기를/]
      ]) {
        await page.goto(`${base}${route}?source=test&lang=ko`);
        await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
        await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
        await expect(page.locator('nav')).toHaveAttribute('aria-label', '주 메뉴');
        await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /[가-힣]/);
        const dimensions = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, viewport: document.documentElement.clientWidth }));
        expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.viewport);
        for (const link of await page.locator('nav a').all()) {
          expect(new URL(await link.getAttribute('href'), base).searchParams.get('lang')).toBe('ko');
        }
      }
      await page.getByRole('link', { name: '주요 작업' }).click();
      await expect(page).toHaveURL(`${base}/?lang=ko#work`);
      await expect(page.getByRole('heading', { name: /의미를 담은/ })).toBeVisible();
      await expect(page.getByRole('link', { name: 'The Amazing Word 방문하기' })).toHaveAttribute('href', 'https://theamazingword.org');
      await page.getByRole('link', { name: '이력서', exact: true }).click();
      await expect(page).toHaveURL(`${base}/resume?lang=ko`);
      await expect(page.getByText('아래 이력서는 영문입니다.', { exact: false })).toBeVisible();
      await expect(page.getByRole('link', { name: '영문 이력서 PDF 열기' })).toHaveAttribute('href', '/assets/resume.pdf');
      await page.getByRole('link', { name: '기업 · 비영리 단체' }).click();
      await expect(page.getByRole('heading', { name: '소규모 기업' })).toBeVisible();
      await expect(page.getByRole('link', { name: /문자 보내기/ })).toHaveAttribute('href', 'sms:+13237748524');
      await page.getByRole('link', { name: '이야기 나누기' }).click();
      await expect(page).toHaveURL(`${base}/contact?lang=ko`);
      await expect(page.getByRole('heading', { name: '이메일' })).toBeVisible();
      await page.goto(`${base}/?lang=en`);
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
      await expect(page.getByRole('heading', { name: /a little more care/i })).toBeVisible();
      expect(errors).toEqual([]);
    } finally {
      await page.close();
      const closed = once(server, 'close');
      server.close();
      server.closeAllConnections();
      await closed;
    }
  });
}
