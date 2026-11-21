# Isaiah Yoon

Personal portfolio and freelance website for small businesses, nonprofits, and churches. The site includes selected projects, a résumé, and a contact page.

## Run locally

Requires Node.js 20 or later. No installation or build step is required to run the site.

```sh
node tools/dev-server.mjs
```

Open [http://localhost:8002](http://localhost:8002). Run the server checks with `npm test`. For browser checks, run `npm install`, install the Playwright browser with `npx playwright install chromium` if needed, and run `npm run test:all`.

## Update the résumé

Replace `assets/resume.pdf` with the latest PDF, keeping the same filename. Both the preview and download link use this file. The PDF is public when the site is deployed, so check its contents before publishing.

## Publishing

The site is static: deploy `index.html` and the `resume/`, `services/`, `contact/`, `assets/`, and `styles/` directories to a static host that serves directory index files. The local server is for development only.

## License

All rights reserved. See [LICENSE](LICENSE).
