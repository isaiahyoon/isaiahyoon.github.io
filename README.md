# Isaiah Yoon

Personal portfolio and freelance website for small businesses, nonprofits, and churches. The site includes selected projects, a résumé, and a contact page.

Home showcases selected work and independent concept designs, Services features a project preview, links to the concepts, and explains the offer and process, Résumé documents experience, and Contact collects email, text, and social channels. Services directs inquiries to Contact; shared footer links remain available on every page.

Services groups project pricing, payment schedule, and ongoing costs separately. Quotes specify included pages, features, and revision rounds; the hourly rate covers updates and additional work, not corrections to meet agreed requirements. Services lists the starting launch price, explains how project complexity can affect the quote, and discloses the hourly rate for post-launch work and potential third-party costs. It notes that simple sites can use $0/month hosting depending on provider and plan limits. Payment is 50% after signing and before work begins, then 50% after approval of a working website preview and before launch, with a $500/$500 example for a $1,000 project. It lists accepted payment methods without public payment handles and explains that scope, timing, price, and payment schedule are confirmed in a written agreement before work begins.

## Run locally

Requires Node.js 20 or later. No installation or build step is required to run the site.

```sh
node tools/dev-server.mjs
```

Open [http://localhost:8002](http://localhost:8002). Run the server checks with `npm test`. For browser checks, run `npm install`, install the Playwright browser with `npx playwright install chromium` if needed, and run `npm run test:all`.

CI runs on pull requests, pushes to `main`, and manual dispatches. Feature-branch pushes do not trigger a second run alongside the pull-request checks.

Use the language switch in the header or add `?lang=ko` to any page URL for the Korean version. Internal navigation preserves the language; the résumé PDF remains in English. Korean localization requires JavaScript.

Navigation uses Work, Résumé, Services, and Contact on desktop and mobile. On mobile, a compact brand and language row sits above the single row of links. Browser tests check this layout in English and Korean at iPhone 17 (402px) and Galaxy S23 (360px) viewport widths.

The site stays static without a build step, so headers and footers are repeated in the page HTML; keep them consistent when editing. Korean translations live in `assets/ko.js`; project translations identify cards by their project-specific classes rather than their position.

## Update the résumé

Run `npm run update:resume` from the repository root. The command selects the highest numeric version of `isaiah_yoon_resume_<number>.pdf` from an iCloud Drive folder. It copies that PDF to `assets/resume.pdf`, preserving its clickable links, and renders its first page to `assets/resume-preview.png`. If the highest version is duplicated or the PDF cannot be read, it reports an error instead. It requires Poppler's `pdftoppm` command (`brew install poppler` on macOS). Commit the updated assets through your normal workflow to publish them.

The embedded PDF requests fit-to-width (`#view=FitH`); viewer behavior varies by browser, and a direct link is available when embedding is unsupported. The preview image is generated for reuse but is not currently displayed on the résumé page. Both assets are public when the site is deployed, so check their contents before publishing.

## Publishing

The site is static: deploy `index.html` and the `resume/`, `services/`, `contact/`, `assets/`, and `styles/` directories to a static host that serves directory index files. The local server is for development only.

Umami Analytics tracks page views on all four pages using the website ID configured in each page’s `<head>`.

## License

All rights reserved. See [LICENSE](LICENSE).
