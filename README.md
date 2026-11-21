# autoease.lixlink.com

Marketing and support site for **AutoEase** (working title), published by THE LIX GROUP LLC. The app lives in [`bitPimps/autoease`](https://github.com/bitPimps/autoease). Static site, no build step, no framework, built the same way as `glowscroll.lixlink.com` and `steady.lixlink.com`.

## Pages

- `index.html`: landing page: hero, how it works (HowTo schema), features, status colors and starting schedule, screenshots, privacy, pricing, guides, download (coming soon)
- `faq.html`: searchable Help Center. Section ids (`#getting-started`, `#vin-scanning`, `#status`, `#reminders`, `#service-log`, `#fuel-log`, `#to-fix`, `#recalls`, `#weather`, `#backup-restore`, `#privacy-data`, `#troubleshooting`) and question ids (e.g. `#backup-on`) are stable so in-app help can link to them; a question's id opens it
- `guides/`: SEO/AEO articles: `find-your-vin.html`, `car-maintenance-schedule.html`, `check-car-recalls.html`, and an index
- `privacy.html`: privacy policy (Google OAuth consent screen, App Store and Google Play require its URL)
- `delete-data.html`: how to delete on-device data and backups
- `404.html`: not-found page
- `llms.txt`, `robots.txt`, `sitemap.xml`: discovery files. Update `llms.txt` and the sitemap when pages, features or pricing change

JSON-LD lives in each page's `<head>` (Organization, WebSite, MobileApplication, HowTo, FAQPage, Article, BreadcrumbList). The FAQPage schema must match the visible FAQ word for word; CI checks it (`.github/scripts/check_faq_schema.py`).

## Structure

```
assets/css/style.css   shared stylesheet; tokens match the app's design system (docs/design/README.md in the app repo)
assets/js/main.js      mobile nav, back to top, Help Center search, open a question from its #id, hero lamp replay, screenshot carousel
assets/fonts/          self-hosted Big Shoulders Display, IBM Plex Sans, IBM Plex Mono (OFL), latin subset
assets/img/            favicons, app icon, og-image.png (1200×630), badge-google-play.png, screens/*.webp (the App Store 6.3" screenshots)
```

Screenshots come from `store/app-store/screenshots/iphone-6.3/` in the app repo, resized to 460×1000 WebP. Refresh them when the store screenshots change, and check the alt text in `index.html`.

## Before launch

- **Analytics:** add the GTM container. Each page has two marker comments, `<!-- GTM head: … -->` (first thing in `<head>`) and `<!-- GTM body: … -->` (first thing in `<body>`); replace them with the container's `<script>` and `<noscript>` snippets. GA4 is configured in the container, not in the HTML. The privacy policy already describes GA4 on the site. Then add a CI check for the container id, as on glowscroll.lixlink.com
- **Store links:** Google Play is live: the download section has its badge (UTM-tagged link, like glowscroll.lixlink.com), `downloadUrl` in the MobileApplication JSON-LD, the FAQ answer and `llms.txt`. When the App Store listing is approved: replace the "coming soon" pill with `badge-app-store.svg` (from glowscroll.lixlink.com) linking to `https://apps.apple.com/app/apple-store/id<APP_ID>?pt=129534275&ct=site_download&mt=8`, add it to `downloadUrl`, add the Smart App Banner (`apple-itunes-app`) to every page except `404.html`, and update "Where can I download AutoEase?" in the FAQ and `llms.txt`
- **Still to check on a device:** the restore-on-a-new-phone flow (Welcome → Restore from a backup) the Help Center describes in `faq.html#restore`; it's in the app's `docs/uat-plan.md`

## Deployment

GitHub Pages, **Settings → Pages → Deploy from a branch**: `main`, `/ (root)`. Every push to `main` publishes.

Custom domain (manual, account owner):
1. At the DNS provider for `lixlink.com`, add `CNAME autoease → bitpimps.github.io`.
2. In this repo's **Settings → Pages**, set the custom domain to `autoease.lixlink.com` (already in the `CNAME` file) and tick **Enforce HTTPS** once the certificate is issued.

## Checks

`.github/workflows/check.yml` runs [lychee](https://github.com/lycheeverse/lychee) on every PR and push to `main` and fails on a broken internal link, image or `#anchor`. It also checks that FAQPage JSON-LD matches the visible FAQ. Locally:

```
lychee --offline --root-dir "$PWD" --index-files index.html --include-fragments '**/*.html'
```

Dependabot opens a monthly PR to bump GitHub Actions versions.
