import { test, expect } from '@playwright/test';
import { once } from 'node:events';
import { createDevServer } from '../tools/dev-server.mjs';

for (const viewport of [{ name: 'desktop', width: 1440, height: 900 }, { name: 'mobile-small', width: 320, height: 812 }, { name: 'galaxy-s23', width: 360, height: 780 }, { name: 'mobile', width: 375, height: 812 }, { name: 'iphone-17', width: 402, height: 874 }, { name: 'mobile-wide', width: 400, height: 812 }]) {
  test(`${viewport.name}: navigation, résumé, and freelance contact work without horizontal overflow`, async ({ page }) => {
    const server = createDevServer();
    server.listen(0, '127.0.0.1');
    await once(server, 'listening');
    const base = `http://127.0.0.1:${server.address().port}`;
    try {
      await page.setViewportSize(viewport);
      await page.goto(base);
      await expect(page.getByRole('heading', { name: /a little more care/i })).toBeVisible();
      await expect(page.locator('.hero-note svg')).toHaveAttribute('aria-hidden', 'true');
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
        await expect(page.locator('meta[name="viewport"]')).toHaveAttribute('content', 'width=device-width, initial-scale=1');
        const dimensions = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, viewport: document.documentElement.clientWidth }));
        expect(dimensions.scroll, `${route} at ${viewport.width}px`).toBeLessThanOrEqual(dimensions.viewport);
        const navContact = page.locator('nav').getByRole('link', { name: 'Contact', exact: true });
        await expect(page.locator('nav a')).toHaveText(['Work', 'Résumé', 'Services', 'Contact']);
        await expect(navContact).toBeVisible();
        await expect(navContact).toHaveCSS('border-top-width', '0px');
        await expect(navContact).toHaveCSS('border-radius', '0px');
        await expect(navContact).toHaveCSS('padding-left', '0px');
        if (viewport.width <= 980) {
          await expect(page.locator('.brand small')).toBeHidden();
          const navLinks = await page.locator('nav a').evaluateAll(links => links.map(link => {
            const rect = link.getBoundingClientRect();
            return { left: rect.left, right: rect.right, top: rect.top, height: rect.height, scroll: link.scrollWidth, width: link.clientWidth };
          }));
          for (const [index, link] of navLinks.entries()) {
            expect(link.top).toBe(navLinks[0].top);
            expect(link.height).toBeGreaterThanOrEqual(44);
            expect(link.left).toBeGreaterThanOrEqual(0);
            expect(link.right).toBeLessThanOrEqual(viewport.width);
            expect(link.scroll).toBeLessThanOrEqual(link.width);
            if (index > 0) expect(navLinks[index - 1].right).toBeLessThanOrEqual(link.left);
          }
        }
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
      const viewer = page.locator('iframe[title="Isaiah Yoon\'s résumé PDF"]');
      await expect(viewer).toBeVisible();
      await expect(viewer).toHaveAttribute('src', '/assets/resume.pdf#view=FitH');
      const viewerSize = await viewer.boundingBox();
      expect(viewerSize.width).toBeLessThanOrEqual(viewport.width);
      expect(viewerSize.height).toBeGreaterThanOrEqual(480);
      if (viewport.name === 'iphone-17' || viewport.name === 'galaxy-s23') {
        expect(viewerSize.y, 'Résumé preview starts within the initial viewport').toBeLessThanOrEqual(viewport.height * 0.65);
      }
      const pdfLink = page.getByRole('link', { name: 'open the résumé PDF' });
      await expect(pdfLink).toHaveAttribute('href', '/assets/resume.pdf#view=FitH');
      await expect(pdfLink).toHaveAttribute('target', '_blank');
      await expect(pdfLink).toHaveAttribute('rel', 'noopener noreferrer');
      // Headless Chromium cannot display PDFs; use HTML to verify the new-tab navigation.
      await page.context().route('**/assets/resume.pdf', route => route.fulfill({ contentType: 'text/html', body: 'Résumé PDF' }));
      const [pdfTab] = await Promise.all([page.waitForEvent('popup'), pdfLink.click()]);
      await expect(pdfTab).toHaveURL(`${base}/assets/resume.pdf#view=FitH`);
      await pdfTab.close();
      await page.context().unroute('**/assets/resume.pdf');
      await page.locator('nav').getByRole('link', { name: 'Services', exact: true }).click();
      const servicesBackground = await page.locator('.page-hero-background').evaluate(container => {
        const bounds = container.getBoundingClientRect();
        return {
          left: bounds.left,
          right: bounds.right,
          viewport: document.documentElement.clientWidth,
          background: getComputedStyle(container).backgroundImage,
          heroBackground: getComputedStyle(container.querySelector('.page-hero')).backgroundImage
        };
      });
      expect(servicesBackground.left).toBe(0);
      expect(servicesBackground.right).toBe(servicesBackground.viewport);
      expect(servicesBackground.background).toContain('radial-gradient');
      expect(servicesBackground.heroBackground).toBe('none');
      await expect(page.getByRole('heading', { name: 'Small businesses' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Nonprofits' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Churches' })).toBeVisible();
      await expect(page.locator('main a[href="/contact"]')).toHaveCount(2);
      await expect(page.locator('main a[href^="mailto:"], main a[href^="sms:"]')).toHaveCount(0);
      for (const name of ['Contact', 'Tell me about your project']) {
        const link = page.locator('main').getByRole('link', { name });
        await expect(link).toHaveAttribute('href', '/contact');
        await link.click();
        await expect(page).toHaveURL(`${base}/contact`);
        await page.goto(`${base}/services`);
      }
      await page.locator('nav').getByRole('link', { name: 'Contact', exact: true }).click();
      await expect(page).toHaveURL(`${base}/contact`);
      await expect(page.getByRole('heading', { name: 'Let’s start a conversation.' })).toBeVisible();
      const contactBackground = await page.locator('main').evaluate(main => {
        const bounds = main.getBoundingClientRect();
        return {
          left: bounds.left,
          right: bounds.right,
          viewport: document.documentElement.clientWidth,
          background: getComputedStyle(main).backgroundImage,
          heroBackground: getComputedStyle(main.querySelector('.page-hero')).backgroundImage
        };
      });
      expect(contactBackground.left).toBe(0);
      expect(contactBackground.right).toBe(contactBackground.viewport);
      expect(contactBackground.background).toContain('radial-gradient');
      expect(contactBackground.heroBackground).toBe('none');
      await expect(page.locator('main h1, main h2')).toHaveCount(1);
      await expect(page.locator('main').getByRole('link', { name: 'isaiahyoon22@gmail.com' })).toHaveAttribute('href', 'mailto:isaiahyoon22@gmail.com');
      await expect(page.locator('main').getByRole('link', { name: '(323) 774-8524' })).toHaveAttribute('href', 'sms:+13237748524');
      const contactRows = await page.locator('.contact-list article').evaluateAll(rows => rows.map(row => {
        const rect = row.getBoundingClientRect();
        return { left: rect.left, height: rect.height, scroll: row.scrollWidth, width: row.clientWidth };
      }));
      expect(contactRows).toHaveLength(3);
      for (const row of contactRows) {
        expect(row.left).toBe(contactRows[0].left);
        expect(row.height).toBeLessThanOrEqual(100);
        expect(row.scroll).toBeLessThanOrEqual(row.width);
      }
      if (viewport.width === 320) {
        await page.addStyleTag({ content: '.footer div { font-size: 16px; }' });
        const { scroll, width } = await page.locator('.footer').evaluate(footer => ({
          scroll: footer.scrollWidth, width: footer.clientWidth
        }));
        expect(scroll, 'Footer with larger text at 320px').toBeLessThanOrEqual(width);
      }
    } finally {
      await page.close();
      const closed = once(server, 'close');
      server.close();
      server.closeAllConnections();
      await closed;
    }
  });
}
