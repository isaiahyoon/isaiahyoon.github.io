import { test } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createDevServer } from '../tools/dev-server.mjs';

test('pages, navigation, contact links, and replaceable résumé are served', async () => {
  const server = createDevServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  try {
    const base = `http://127.0.0.1:${server.address().port}`;
    for (const page of ['/', '/services/', '/resume/', '/contact/', '/services', '/resume', '/contact']) {
      const response = await fetch(`${base}${page}`);
      assert.equal(response.status, 200);
      const html = await response.text();
      assert.match(html, /href="\/assets\/apple-touch-icon\.png\?v=4"/);
      assert.match(html, /href="\/services"/);
      assert.match(html, /href="\/resume"/);
      assert.match(html, /href="\/contact"/);
      assert.match(html, /mailto:isaiahyoon22@gmail\.com/);
      assert.match(html, /property="og:image" content="https:\/\/isaiahyoon\.github\.io\/assets\/social-preview\.png\?v=1"/);
    }
    assert.equal((await fetch(`${base}/assets/social-preview.png`)).status, 200);
    for (const page of ['/services/', '/resume/', '/contact/']) {
      const redirect = await fetch(`${base}${page}?lang=ko`, { redirect: 'manual' });
      assert.equal(redirect.status, 301);
      assert.equal(redirect.headers.get('location'), `${page.slice(0, -1)}?lang=ko`);
    }
    const home = await (await fetch(base)).text();
    assert.match(home, /https:\/\/theamazingword\.org/);
    assert.match(home, /https:\/\/immanuelchurchofamerica\.org/);
    const resume = await (await fetch(`${base}/resume/`)).text();
    assert.match(resume, /<iframe src="\/assets\/resume\.pdf#view=FitH" title="Isaiah Yoon's résumé PDF"><\/iframe>/);
    assert.match(resume, /href="\/assets\/resume\.pdf#view=FitH" target="_blank" rel="noopener noreferrer">open the résumé PDF/);
    const pdf = await fetch(`${base}/assets/resume.pdf`);
    assert.equal(pdf.status, 200);
    assert.equal(pdf.headers.get('content-type'), 'application/pdf');
    assert.equal(Buffer.from(await pdf.arrayBuffer()).subarray(0, 5).toString(), '%PDF-');
    assert.equal((await fetch(`${base}/assets/apple-touch-icon.png?v=4`)).status, 200);
    assert.equal((await fetch(`${base}/missing.html`)).status, 404);
    assert.equal((await fetch(`${base}/missing/`)).status, 404);
  } finally {
    server.close();
    await once(server, 'close');
  }
});
