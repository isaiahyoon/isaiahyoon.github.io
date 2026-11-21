# Isaiah Yoon

Personal portfolio and freelance website for small businesses, nonprofits, and churches. The site includes selected projects, a résumé, and a contact page.

Home showcases selected work, Services explains the offer and process, Résumé documents experience, and Contact collects email, text, and social channels. Services directs inquiries to Contact; shared footer links remain available on every page.

## Run locally

Requires Node.js 20 or later. No installation or build step is required to run the site.

```sh
node tools/dev-server.mjs
```

Open [http://localhost:8002](http://localhost:8002). Run the server checks with `npm test`. For browser checks, run `npm install`, install the Playwright browser with `npx playwright install chromium` if needed, and run `npm run test:all`.

CI runs on pull requests, pushes to `main`, and manual dispatches. Feature-branch pushes do not trigger a second run alongside the pull-request checks.

Use the language switch in the header or add `?lang=ko` to any page URL for the Korean version. Internal navigation preserves the language; the résumé PDF remains in English. Korean localization requires JavaScript.

Navigation uses Work, Résumé, Services, and Contact on desktop and mobile. On mobile, a compact brand and language row sits above the single row of links. Browser tests check this layout in English and Korean at iPhone 17 (402px) and Galaxy S23 (360px) viewport widths.

## Update the résumé

Replace `assets/resume.pdf` with the latest PDF, keeping the same filename and preserving its clickable links. The embedded PDF requests fit-to-width (`#view=FitH`); viewer behavior varies by browser, and a direct link is available when embedding is unsupported. The PDF is public when the site is deployed, so check its contents before publishing.

## Publishing

The site is static: deploy `index.html` and the `resume/`, `services/`, `contact/`, `assets/`, and `styles/` directories to a static host that serves directory index files. The local server is for development only.

## License

All rights reserved. See [LICENSE](LICENSE).
