# BaselineLab website

The static marketing and privacy website for [baselinelab.app](https://baselinelab.app).

This repository contains only website files. The private BaselineLab application source is maintained separately.

## Preview locally

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## App Store availability

App Store buttons are controlled by `site-config.js`.

While the app is not yet listed, leave `appStoreUrl` empty. When the listing is live, paste its full App Store URL into that field. Every availability button will automatically change from “Coming soon on the App Store” to “Download on the App Store.”

## Deployment

GitHub Pages deployment and custom-domain instructions are in [DEPLOYMENT.md](DEPLOYMENT.md).
