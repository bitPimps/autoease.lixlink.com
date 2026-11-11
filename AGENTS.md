# autoease.lixlink.com — rules for agents

Static site for the AutoEase app. Plain HTML/CSS, GitHub Pages from `main`: **every push to `main` publishes the live site.** See `README.md` for structure and checks.

# Code review before merges (always)

Same rule as the owner's other sites (`glowscroll.lixlink.com`, `steady.lixlink.com`): work on a branch, run `/code-review high` on it against `main`, and land it through a PR into `main`. Don't push straight to `main`: every push there goes live before CI has run. Fix each finding, or record why it isn't a bug in the commit message or the PR.

CI (`.github/workflows/check.yml`) checks every internal link, image and `#anchor` on each PR and push to `main`. Don't merge a PR while it's red.

# Content

Every claim must match what the app (`bitPimps/autoease`) actually does. Never advertise unshipped features. The app's product docs (`docs/` in the app repo) are the source of truth, in particular:

- `docs/security-privacy.md` and `docs/architecture.md` for the privacy policy: local-first, no accounts, no server-side copy of user data; backups go to the user's own iCloud / Google Drive (`drive.appdata` scope only).
- `docs/monetization.md` for anything about pricing: the first vehicle is free forever; no ads.

When an app feature ships or changes, update the matching pages here in the same piece of work.
