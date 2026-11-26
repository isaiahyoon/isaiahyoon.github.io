import { test, expect } from '@playwright/test';
import { once } from 'node:events';
import { createDevServer } from '../tools/dev-server.mjs';

for (const width of [1440, 320, 360, 402]) {
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
        ['/services/', /프로젝트를 위한/],
        ['/resume/', /작업을 뒷받침하는/],
        ['/contact/', /함께 이야기를/]
      ]) {
        await page.goto(`${base}${route}?source=test&lang=ko`);
        await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
        await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
        await expect(page.locator('nav')).toHaveAttribute('aria-label', '주 메뉴');
        await expect(page.locator('nav a')).toHaveText(['작업', '이력서', '서비스', '문의']);
        await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /[가-힣]/);
        await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute('content', '짙은 남색 배경의 빛나는 금색 큐브에 담긴 Isaiah Yoon 모노그램');
        await expect(page.locator('meta[name="twitter:image:alt"]')).toHaveAttribute('content', '짙은 남색 배경의 빛나는 금색 큐브에 담긴 Isaiah Yoon 모노그램');
        const dimensions = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, viewport: document.documentElement.clientWidth }));
        expect(dimensions.scroll, `${route}?lang=ko at ${width}px`).toBeLessThanOrEqual(dimensions.viewport);
        if (width <= 980) {
          const navLinks = await page.locator('nav a').evaluateAll(links => links.map(link => ({
            top: link.getBoundingClientRect().top,
            scroll: link.scrollWidth,
            width: link.clientWidth
          })));
          for (const link of navLinks) {
            expect(link.top).toBe(navLinks[0].top);
            expect(link.scroll).toBeLessThanOrEqual(link.width);
          }

        }
        for (const link of await page.locator('nav a').all()) {
          expect(new URL(await link.getAttribute('href'), base).searchParams.get('lang')).toBe('ko');
        }
      }
      await page.locator('nav').getByRole('link', { name: '작업', exact: true }).click();
      await expect(page).toHaveURL(`${base}/?lang=ko#work`);
      await expect(page.locator('.hero-note svg')).toHaveAttribute('aria-hidden', 'true');
      await expect(page.getByRole('heading', { name: /의미를 담은/ })).toBeVisible();
      await expect(page.getByRole('link', { name: 'The Amazing Word 방문하기' })).toHaveAttribute('href', 'https://theamazingword.org/about');
      await expect(page.locator('.word-card').getByRole('link', { name: 'Instagram', exact: true })).toHaveAttribute('href', 'https://instagram.com/theamazingwordapp');
      await expect(page.locator('.church-card').getByRole('link', { name: 'Instagram', exact: true })).toHaveAttribute('href', 'https://instagram.com/immanuelchurchofamerica');
      await expect(page.locator('.stones-card .project-body > p:not(.project-kicker)')).toContainText('한국어 중심 웹사이트');
      await expect(page.getByRole('link', { name: 'David’s Stones Golf Club 방문하기' })).toHaveAttribute('href', 'https://davidsstonesgolfclub.com/');
      await expect(page.getByRole('link', { name: 'Human Rhythm Records 방문하기' })).toHaveAttribute('href', 'https://humanrhythmrecords.com/');
      await expect(page.locator('.hrr-card').getByRole('link', { name: 'Instagram', exact: true })).toHaveAttribute('href', 'https://instagram.com/humanrhythmrecords');
      await expect(page.locator('#concepts .section-heading > p')).toContainText('실제 의뢰 작업이 아닌');
      await expect(page.getByRole('link', { name: 'Doan Math Academy 콘셉트 보기' })).toHaveAttribute('href', 'https://doan-math-academy-preview.pages.dev/');
      await expect(page.getByRole('link', { name: 'The Café 콘셉트 보기' })).toHaveAttribute('href', 'https://the-cafe-portfolio-preview.pages.dev/');
      await page.getByRole('link', { name: '이력서', exact: true }).click();
      await expect(page).toHaveURL(`${base}/resume?lang=ko`);
      await expect(page.getByText('아래 이력서는 영문입니다.', { exact: false })).toBeVisible();
      await expect(page.locator('iframe')).toHaveAttribute('title', 'Isaiah Yoon의 영문 이력서 PDF');
      if (width === 360 || width === 402) {
        const viewerSize = await page.locator('iframe').boundingBox();
        expect(viewerSize.y, 'Korean résumé preview starts within the initial viewport').toBeLessThanOrEqual(900 * 0.65);
      }
      await expect(page.getByRole('link', { name: '영문 이력서 PDF 열기' })).toHaveAttribute('href', '/assets/resume.pdf#view=FitH');
      await page.locator('nav').getByRole('link', { name: '서비스', exact: true }).click();
      const conceptLink = page.getByRole('link', { name: '독립적인 콘셉트 디자인 살펴보기' });
      await expect(conceptLink).toHaveAttribute('href', '/?lang=ko#concepts');
      await conceptLink.click();
      await expect(page).toHaveURL(`${base}/?lang=ko#concepts`);
      await page.goto(`${base}/services?lang=ko`);
      await expect(page.locator('.featured-project .project-kicker')).toHaveText(['성경 읽기 서비스', '교회 웹사이트', '골프 클럽 웹사이트', '독립 레이블']);
      await expect(page.locator('.featured-work').getByRole('link', { name: 'The Amazing Word 방문하기' })).toHaveAttribute('href', 'https://theamazingword.org/about');
      await expect(page.locator('.featured-work .word-visual').getByRole('link', { name: 'Instagram', exact: true })).toHaveAttribute('href', 'https://instagram.com/theamazingwordapp');
      await expect(page.locator('.featured-work .church-visual').getByRole('link', { name: 'Instagram', exact: true })).toHaveAttribute('href', 'https://instagram.com/immanuelchurchofamerica');
      await expect(page.locator('.featured-work').getByRole('link', { name: '교회 웹사이트 방문하기' })).toHaveAttribute('href', 'https://immanuelchurchofamerica.org');
      await expect(page.locator('.featured-work').getByRole('link', { name: 'David’s Stones Golf Club 방문하기' })).toHaveAttribute('href', 'https://davidsstonesgolfclub.com/');
      await expect(page.locator('.featured-work').getByRole('link', { name: 'Human Rhythm Records 방문하기' })).toHaveAttribute('href', 'https://humanrhythmrecords.com/');
      await expect(page.locator('.service-audiences li')).toHaveText(['소규모 기업', '비영리 단체', '교회', '그 밖의 프로젝트']);
      await expect(page.getByRole('heading', { name: '웹사이트에 담을 수 있는 내용' })).toBeVisible();
      await expect(page.getByRole('heading', { name: '웹사이트 제작 및 공개 비용은 $1,000부터 시작합니다.' })).toBeVisible();
      await expect(page.locator('.service-pricing')).toContainText('프로젝트 비용이 높아질 수 있습니다');
      await expect(page.locator('.service-pricing')).toContainText('시간당 $100');
      await expect(page.locator('.service-pricing')).toContainText('별도 비용');
      await expect(page.locator('.service-payment')).toHaveText('Venmo, Cash App, Zelle 또는 현금으로 결제하실 수 있습니다. 결제 정보는 프로젝트에 합의한 후 안내해 드립니다.');
      await expect(page.locator('.approach-steps li').nth(1)).toContainText('작업을 시작하기 전에 범위, 일정, 비용 및 결제 일정을 서면 계약으로 확정합니다.');
      await expect(page.locator('.approach-steps li')).toHaveCount(3);
      await expect(page.locator('main a[href="/contact?lang=ko"]')).toHaveCount(1);
      await page.locator('main').getByRole('link', { name: '프로젝트에 대해 알려주세요' }).click();
      await expect(page).toHaveURL(`${base}/contact?lang=ko`);
      await expect(page.getByRole('heading', { name: '이메일' })).toBeVisible();
      await expect(page.locator('main h1, main h2')).toHaveCount(1);
      await expect(page.locator('main').getByRole('link', { name: '(323) 774-8524' })).toHaveAttribute('href', 'sms:+13237748524');
      await page.goto(`${base}/?lang=ko`);
      await page.locator('.hero-copy').getByRole('link', { name: '웹사이트 제작 서비스 살펴보기' }).click();
      await expect(page).toHaveURL(`${base}/services?lang=ko`);
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

test('Korean project translations follow reordered cards and links', async ({ page }) => {
  const server = createDevServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    await page.route('**/assets/ko.js', async route => {
      const response = await route.fetch();
      const script = await response.text();
      const reorder = [
        "document.querySelector('.featured-grid').prepend(document.querySelector('.featured-project.church-visual'));",
        "document.querySelector('.featured-project.word-visual .project-links').prepend(document.querySelector('.featured-project.word-visual .instagram-link'));"
      ].join('\n');
      await route.fulfill({ response, body: `${reorder}\n${script}` });
    });
    await page.goto(`${base}/services?lang=ko`);
    await expect(page.locator('.featured-project').first()).toHaveClass(/church-visual/);
    await expect(page.locator('.featured-project.word-visual .project-kicker')).toHaveText('성경 읽기 서비스');
    await expect(page.locator('.featured-project.word-visual .project-link:not(.instagram-link)')).toContainText('The Amazing Word 방문하기');
    await expect(page.locator('.featured-project.word-visual .instagram-link')).toHaveText('Instagram');
    await expect(page.locator('.featured-project.church-visual .project-kicker')).toHaveText('교회 웹사이트');
    await expect(page.locator('.featured-project.church-visual .project-link:not(.instagram-link)')).toContainText('교회 웹사이트 방문하기');
  } finally {
    await page.close();
    const closed = once(server, 'close');
    server.close();
    server.closeAllConnections();
    await closed;
  }
});
