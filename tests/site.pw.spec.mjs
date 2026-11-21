import { test, expect } from '@playwright/test';
import { once } from 'node:events';
import { createDevServer } from '../tools/dev-server.mjs';

for (const viewport of [{ name: 'desktop', width: 1440, height: 900 }, { name: 'mobile', width: 375, height: 812 }, { name: 'mobile-wide', width: 400, height: 812 }]) {
  test(`${viewport.name}: navigation, résumé, and freelance contact work without horizontal overflow`, async ({ page }) => {
    const server = createDevServer();
    server.listen(0, '127.0.0.1');
    await once(server, 'listening');
    const base = `http://127.0.0.1:${server.address().port}`;
    try {
      await page.setViewportSize(viewport);
      await page.goto(base);
      await expect(page.getByRole('heading', { name: /a little more care/i })).toBeVisible();
      const heroBounds = await page.locator('.hero-section').evaluate(element => {
        const bounds = element.getBoundingClientRect();
        return { left: bounds.left, right: bounds.right, viewport: document.documentElement.clientWidth };
      });
      expect(heroBounds.left).toBe(0);
      expect(heroBounds.right).toBe(heroBounds.viewport);
      await expect(page.getByRole('link', { name: 'Visit The Amazing Word' })).toHaveAttribute('href', 'https://theamazingword.org');
      await expect(page.getByRole('link', { name: 'Visit the church website' })).toHaveAttribute('href', 'https://immanuelchurchofamerica.org');
      for (const name of ['Visit The Amazing Word', 'Visit the church website']) {
        const link = page.getByRole('link', { name });
        await expect(link).toHaveAttribute('target', '_blank');
        await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      }
      for (const route of ['/', '/services/', '/resume/', '/contact/']) {
        await page.goto(`${base}${route}`);
        const dimensions = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, viewport: document.documentElement.clientWidth }));
        expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.viewport);
        const footerEmail = page.locator('footer').getByRole('link', { name: 'isaiahyoon22@gmail.com' });
        await expect(footerEmail).toBeVisible();
        await expect(footerEmail).toHaveAttribute('href', 'mailto:isaiahyoon22@gmail.com');
        for (const name of ['GitHub', 'Instagram']) {
          const link = page.locator('footer').getByRole('link', { name, exact: true });
          await expect(link).toHaveAttribute('target', '_blank');
          await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        }
      }
      await page.goto(`${base}/resume/`);
      await expect(page.getByTitle("Isaiah Yoon's résumé PDF")).toHaveAttribute('src', '/assets/resume.pdf');
      await expect(page.getByRole('link', { name: /download résumé/i })).toHaveAttribute('download', '');
      await page.getByRole('link', { name: 'For businesses & nonprofits' }).click();
      await expect(page.getByRole('heading', { name: 'Small businesses' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Nonprofits' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Churches' })).toBeVisible();
      for (const name of ['Start a conversation', 'Tell me about your project']) {
        const link = page.getByRole('link', { name });
        await expect(link).toHaveAttribute('href', '/contact/');
        await link.click();
        await expect(page).toHaveURL(`${base}/contact/`);
        await page.goto(`${base}/services/`);
      }
      await expect(page.getByRole('link', { name: 'Email Isaiah' })).toHaveAttribute('href', /mailto:isaiahyoon22@gmail\.com/);
      await expect(page.getByRole('link', { name: '(323) 774-8524' })).toHaveAttribute('href', 'tel:+13237748524');
      await page.getByRole('link', { name: 'Let’s talk' }).click();
      await expect(page).toHaveURL(`${base}/contact/`);
      await expect(page.getByRole('heading', { name: 'Let’s start a conversation.' })).toBeVisible();
      await expect(page.locator('main').getByRole('link', { name: 'isaiahyoon22@gmail.com' })).toHaveAttribute('href', 'mailto:isaiahyoon22@gmail.com');
      await expect(page.locator('main').getByRole('link', { name: '(323) 774-8524' })).toHaveAttribute('href', 'tel:+13237748524');
    } finally {
      await page.close();
      const closed = once(server, 'close');
      server.close();
      server.closeAllConnections();
      await closed;
    }
  });
}
