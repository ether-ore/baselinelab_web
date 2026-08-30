# Deploying the BaselineLab website

## Preview locally

From the repository root, run:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## GitHub Pages

The workflow in `.github/workflows/pages.yml` deploys the repository root to GitHub Pages whenever `main` is updated.

1. Open **Settings → Pages** in the GitHub repository.
2. Select **GitHub Actions** as the publishing source.
3. Add the custom domain `baselinelab.app` if GitHub Pages does not detect it from `CNAME` automatically.
4. At the DNS provider, create the records recommended by GitHub for an apex domain.
5. Enable **Enforce HTTPS** after GitHub validates the DNS configuration.

All website links and assets use relative paths, so the site also works at the repository URL before the custom domain is connected.

## App Store link

The availability buttons are configured in `site-config.js`.

Before release, keep `appStoreUrl` empty. When the Mac and iPad App Store listing is live, set it to the full product URL. The buttons will become active and their labels will change automatically; no HTML edits are required.

## Privacy page

The public privacy-policy URL is:

<https://baselinelab.app/privacy.html>

Update the date and affected sections before releasing any version that changes how app or website data is handled.
