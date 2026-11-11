# autoease.lixlink.com

Marketing and support site for **AutoEase** (working title), published by THE LIX GROUP LLC. The app lives in [`bitPimps/autoease`](https://github.com/bitPimps/autoease). Static site, no build step, no framework, built the same way as `glowscroll.lixlink.com` and `steady.lixlink.com`.

## Status

Repo scaffolding only. No pages yet.

The privacy policy is needed first: the Google OAuth consent screen (Google Drive backup) can't be published without a home page and privacy policy URL, and both stores require one because the app asks for camera and location access.

## Planned pages

- `index.html`: landing page: what AutoEase does, privacy, pricing, download
- `privacy.html`: privacy policy (Google OAuth consent screen, App Store and Google Play require its URL)
- `faq.html`: Help Center, with stable section ids so in-app help can link to them
- `delete-data.html`: how to delete on-device data and backups
- `404.html`: not-found page
- `llms.txt`, `sitemap.xml`: discovery files (`robots.txt` is in place)

## Deployment

GitHub Pages, **Settings → Pages → Deploy from a branch**: `main`, `/ (root)`. Every push to `main` publishes.

Custom domain (manual, account owner):
1. At the DNS provider for `lixlink.com`, add `CNAME autoease → bitpimps.github.io`.
2. In this repo's **Settings → Pages**, set the custom domain to `autoease.lixlink.com` (already in the `CNAME` file) and tick **Enforce HTTPS** once the certificate is issued.

## Checks

`.github/workflows/check.yml` runs [lychee](https://github.com/lycheeverse/lychee) on every PR and push to `main` and fails on a broken internal link, image or `#anchor` (skipped while there are no pages). Locally:

```
lychee --offline --root-dir "$PWD" --index-files index.html --include-fragments '*.html'
```

Dependabot opens a monthly PR to bump GitHub Actions versions.
