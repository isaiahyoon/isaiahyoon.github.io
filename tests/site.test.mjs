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
    for (const page of ['/', '/work/', '/services/', '/resume/', '/contact/', '/work', '/services', '/resume', '/contact']) {
      const response = await fetch(`${base}${page}`);
      assert.equal(response.status, 200);
      const html = await response.text();
      assert.match(html, /href="\/assets\/apple-touch-icon\.png\?v=4"/);
      assert.match(html, /href="\/services"/);
      assert.match(html, /href="\/work"/);
      assert.match(html, /href="\/resume"/);
      assert.match(html, /href="\/contact"/);
      assert.match(html, /<script\s+defer\s+src="https:\/\/cloud\.umami\.is\/script\.js"\s+data-website-id="bb736843-c36a-4bfa-b5e6-c80d36b1f134"\s*><\/script>/);
      assert.match(html, /mailto:isaiahyoon22@gmail\.com/);
      for (const name of ['og:image', 'og:image:secure_url', 'twitter:image']) {
        assert.match(html, new RegExp(`(?:property|name)="${name}"\\s+content="https://isaiahyoon\\.github\\.io/assets/social-preview\\.png\\?v=2"`));
      }
      assert.match(html, /property="og:image:width" content="1200"/);
      assert.match(html, /property="og:image:height" content="630"/);
      for (const name of ['og:image:alt', 'twitter:image:alt']) {
        assert.match(html, new RegExp(`(?:property|name)="${name}"\\s+content="Isaiah Yoon’s portrait beside the words A little more care in the digital world"`));
      }
    }
    const socialPreview = await fetch(`${base}/assets/social-preview.png?v=2`);
    assert.equal(socialPreview.status, 200);
    assert.equal(socialPreview.headers.get('content-type'), 'image/png');
    const png = Buffer.from(await socialPreview.arrayBuffer());
    assert.equal(png.readUInt32BE(16), 1200);
    assert.equal(png.readUInt32BE(20), 630);
    for (const page of ['/work/', '/services/', '/resume/', '/contact/']) {
      const redirect = await fetch(`${base}${page}?lang=ko`, { redirect: 'manual' });
      assert.equal(redirect.status, 301);
      assert.equal(redirect.headers.get('location'), `${page.slice(0, -1)}?lang=ko`);
    }
    const work = await (await fetch(`${base}/work`)).text();
    assert.match(work, /https:\/\/theamazingword\.org\/about/);
    assert.match(work, /https:\/\/immanuelchurchofamerica\.org/);
    assert.match(work, /https:\/\/davidsstonesgolfclub\.com\//);
    assert.match(work, /David’s Stones Golf Club/);
    assert.match(work, /https:\/\/humanrhythmrecords\.com\//);
    assert.match(work, /Human Rhythm Records/);
    const resume = await (await fetch(`${base}/resume/`)).text();
    assert.match(resume, /<iframe\s+src="\/assets\/resume\.pdf#view=FitH"\s+title="Isaiah Yoon's résumé PDF"\s*><\/iframe>/);
    assert.match(resume, /href="\/assets\/resume\.pdf#view=FitH"\s+target="_blank"\s+rel="noopener noreferrer"\s*>open the résumé PDF/);
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
