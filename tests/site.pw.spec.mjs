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
      await expect(page.locator('.hero-intro')).toContainText('software engineer');
      await expect(page.locator('.hero-intro')).toContainText('websites');
      await expect(page.locator('.hero-note svg')).toHaveAttribute('aria-hidden', 'true');
      const heroServices = page.locator('.hero-copy').getByRole('link', { name: 'Explore website services' });
      await heroServices.click();
      await expect(page).toHaveURL(`${base}/services`);
      await page.goto(base);
      if (viewport.name === 'galaxy-s23' || viewport.name === 'iphone-17') {
        const workTop = await page.locator('#work').evaluate(element => element.getBoundingClientRect().top + window.scrollY);
        expect(workTop, 'Selected work is closer to the top on mobile').toBeLessThan(950);
      }
      const heroBounds = await page.locator('.hero-section').evaluate(element => {
        const bounds = element.getBoundingClientRect();
        return { left: bounds.left, right: bounds.right, viewport: document.documentElement.clientWidth };
      });
      expect(heroBounds.left).toBe(0);
      expect(heroBounds.right).toBe(heroBounds.viewport);
      await expect(page.getByRole('link', { name: 'Visit The Amazing Word' })).toHaveAttribute('href', 'https://theamazingword.org/about');
      const instagram = page.locator('.word-card').getByRole('link', { name: 'Instagram', exact: true });
      await expect(instagram).toHaveAttribute('href', 'https://instagram.com/theamazingwordapp');
      await expect(instagram).toHaveAttribute('target', '_blank');
      await expect(instagram).toHaveAttribute('rel', 'noopener noreferrer');
      const churchInstagram = page.locator('.church-card').getByRole('link', { name: 'Instagram', exact: true });
      await expect(churchInstagram).toHaveAttribute('href', 'https://instagram.com/immanuelchurchofamerica');
      await expect(churchInstagram).toHaveAttribute('target', '_blank');
      await expect(churchInstagram).toHaveAttribute('rel', 'noopener noreferrer');
      await expect(page.getByRole('link', { name: 'Visit the church website' })).toHaveAttribute('href', 'https://immanuelchurchofamerica.org');
      await expect(page.getByRole('link', { name: 'Visit David’s Stones Golf Club' })).toHaveAttribute('href', 'https://davidsstonesgolfclub.com/');
      await expect(page.locator('.word-card .project-kicker')).toContainText('Creator & engineer');
      await expect(page.locator('.church-card .project-kicker')).toContainText('Web developer');
      await expect(page.locator('.stones-card .project-body > p:not(.project-kicker)')).toContainText('Korean-first website');
      const concepts = page.locator('#concepts');
      await expect(concepts).toContainText('not client projects');
      await expect(concepts.locator('.project-card')).toHaveCount(2);
      for (const [name, url] of [
        ['View Doan Math Academy concept', 'https://doan-math-academy-preview.pages.dev/'],
        ['View The Café concept', 'https://the-cafe-portfolio-preview.pages.dev/']
      ]) {
        const link = concepts.getByRole('link', { name });
        await expect(link).toHaveAttribute('href', url);
        await expect(link).toHaveAttribute('target', '_blank');
        await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      }
      for (const name of ['Visit The Amazing Word', 'Visit the church website', 'Visit David’s Stones Golf Club']) {
        const link = page.getByRole('link', { name });
        await expect(link).toHaveAttribute('target', '_blank');
        await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      }

      for (const route of ['/', '/services/', '/resume/', '/contact/']) {
        await page.goto(`${base}${route}`);
        await expect(page.locator('meta[name="viewport"]')).toHaveAttribute('content', 'width=device-width, initial-scale=1');
        await expect(page.locator('body')).not.toContainText(/\bneed(?:s|ed|ing)?\b/i);
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
      const preview = page.locator('.featured-work');
      const previewInstagram = preview.locator('.word-visual').getByRole('link', { name: 'Instagram', exact: true });
      await expect(previewInstagram).toHaveAttribute('href', 'https://instagram.com/theamazingwordapp');
      await expect(previewInstagram).toHaveAttribute('target', '_blank');
      await expect(previewInstagram).toHaveAttribute('rel', 'noopener noreferrer');
      const previewChurchInstagram = preview.locator('.church-visual').getByRole('link', { name: 'Instagram', exact: true });
      await expect(previewChurchInstagram).toHaveAttribute('href', 'https://instagram.com/immanuelchurchofamerica');
      await expect(previewChurchInstagram).toHaveAttribute('target', '_blank');
      await expect(previewChurchInstagram).toHaveAttribute('rel', 'noopener noreferrer');
      for (const [name, url] of [['Visit The Amazing Word', 'https://theamazingword.org/about'], ['Visit the church website', 'https://immanuelchurchofamerica.org'], ['Visit David’s Stones Golf Club', 'https://davidsstonesgolfclub.com/']]) {
        const previewLink = preview.getByRole('link', { name });
        await expect(previewLink).toBeVisible();
        await expect(previewLink).toHaveAttribute('href', url);
        await expect(previewLink).toHaveAttribute('target', '_blank');
        await expect(previewLink).toHaveAttribute('rel', 'noopener noreferrer');
        const destination = new URL(url).href;
        await page.context().route(destination, route => route.fulfill({ contentType: 'text/html', body: name }));
        const [projectTab] = await Promise.all([page.waitForEvent('popup'), previewLink.click()]);
        await expect(projectTab).toHaveURL(destination);
        await projectTab.close();
        await page.context().unroute(destination);
      }
      await expect(page).toHaveURL(`${base}/services`);
      if (viewport.width <= 402) {
        const layout = await page.evaluate(() => ({
          offerTop: document.querySelector('.service-section').getBoundingClientRect().top + window.scrollY,
          cards: [...document.querySelectorAll('.featured-project')].map(card => ({
            top: card.getBoundingClientRect().top,
            width: card.clientWidth,
            scroll: card.scrollWidth
          }))
        }));
        expect(layout.offerTop, 'The offer follows compact project previews on mobile').toBeLessThan(1100);
        expect(layout.cards[1].top).toBeGreaterThan(layout.cards[0].top);
        for (const card of layout.cards) expect(card.scroll).toBeLessThanOrEqual(card.width);
      }
      await expect(page.locator('.service-hero a[href="/contact"], .service-hero a[href="/#work"]')).toHaveCount(0);
      await expect(page.locator('.service-audiences li')).toHaveText(['Small businesses', 'Nonprofits', 'Churches', 'Other projects']);
      await page.getByRole('link', { name: 'Explore independent concept designs' }).click();
      await expect(page).toHaveURL(`${base}/#concepts`);
      await expect(page.locator('#concepts h2')).toBeVisible();
      await page.goto(`${base}/services`);
      await expect(page.getByRole('heading', { name: 'What your website can include' })).toBeVisible();
      await expect(page.locator('.approach-steps li')).toHaveCount(3);
      await expect(page.locator('main a[href="/contact"]')).toHaveCount(1);
      await expect(page.locator('main a[href^="mailto:"], main a[href^="sms:"]')).toHaveCount(0);
      const projectContact = page.locator('.invitation').getByRole('link', { name: 'Tell me about your project' });
      await expect(projectContact).toHaveAttribute('href', '/contact');
      await projectContact.click();
      await expect(page).toHaveURL(`${base}/contact`);
      await page.goto(`${base}/services`);
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
