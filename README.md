# Nudge — marketing &amp; legal site

A small, static site for **Nudge**, the voice-first daily planner: a marketing
home page plus the Privacy Policy, Terms of Use, and Support pages required for
an app-store listing. No build step, no framework — just hand-written HTML, one
CSS file, and a few images. It is designed to be hosted for free on **GitHub
Pages**.

```
.
├── index.html          # marketing home (hero, features, how-it-works, privacy, CTA)
├── privacy.html        # Privacy Policy  (rendered from content/privacy.md)
├── terms.html          # Terms of Use    (rendered from content/terms.md)
├── support.html        # Support / FAQ   (rendered from content/support.md)
├── styles.css          # the entire design system (one stylesheet)
├── assets/
│   ├── icon.png             # app icon (the on-page visual + source for the rest)
│   ├── favicon.png          # 512×512 favicon
│   ├── favicon-32.png       # 32×32 favicon for crisp tabs
│   ├── apple-touch-icon.png # 180×180 iOS home-screen icon
│   └── og-image.png         # 1200×630 social share card
├── content/            # the source Markdown the legal pages were rendered from
│   ├── privacy.md
│   ├── terms.md
│   └── support.md
├── .nojekyll           # tells GitHub Pages to serve files as-is (no Jekyll)
└── README.md           # this file
```

> The `content/` Markdown is kept for reference. The published pages are the
> `*.html` files; if you edit the wording, update the matching `.html`.

---

## Owner details (all filled in)

The legal text resolves the obvious brand facts (app name **Nudge**, owner
**Nam Le**, contact **nudgeplannerapp@gmail.com**, last-updated date). The
jurisdiction-specific items have been filled in across both the rendered
`.html` pages and the source `content/*.md`:

- Governing-law jurisdiction (Privacy §11, Terms §9): **the State of Washington, United States**
- Where we operate from (Privacy §1): **the United States**
- Where Supabase hosts your data (Privacy §5 and §6): **the United States (us-east-1)**

If any of these change, update both the matching `.html` page and its
`content/*.md` source so the published page and its source stay in sync.

---

## Deploy to GitHub Pages (step by step)

1. **Create a new PUBLIC repository** named `nudge-site`.
   - On GitHub: **New repository** → Owner `NamLe05`, Repository name
     `nudge-site`, visibility **Public**, then **Create repository**.
   - GitHub Pages serves from public repos on the free plan, so the repo must be
     public.

2. **Push these files to the `main` branch** (run this from inside this folder).

   ```bash
   git init
   git add .
   git commit -m "Nudge marketing + legal site"
   git branch -M main
   git remote add origin https://github.com/NamLe05/nudge-site.git
   git push -u origin main
   ```

   > Make sure `index.html`, `styles.css`, the `assets/` folder, and the
   > hidden `.nojekyll` file all land at the **repository root** (not inside a
   > subfolder). `git add .` includes `.nojekyll` automatically.

3. **Enable GitHub Pages.**
   - In the repo, go to **Settings → Pages**.
   - Under **Build and deployment → Source**, choose **Deploy from a branch**.
   - Set **Branch** to `main` and the folder to **/ (root)**, then **Save**.

4. **Wait ~1 minute, then visit your site:**

   ```
   https://namle05.github.io/nudge-site/
   ```

   GitHub shows this URL at the top of the **Settings → Pages** screen once the
   first deploy finishes. Every later `git push` to `main` redeploys
   automatically.

---

## Updating the site later

Edit the files, then:

```bash
git add .
git commit -m "Update copy"
git push
```

Pages rebuilds within a minute. (Because of `.nojekyll`, files are served
exactly as committed — no Jekyll processing.)

---

## Adding a custom domain later (optional)

When you're ready to serve the site from your own domain (e.g.
`nudge.app` or `www.nudge.app`):

1. **Add a `CNAME` file** to the repo root containing only your domain, e.g.:

   ```
   www.nudge.app
   ```

   (Do **not** add this file now — it would override the
   `namle05.github.io/nudge-site/` URL. Add it only once you own the domain.)

2. **Point DNS at GitHub Pages** with your domain registrar:
   - For a subdomain like `www`, add a **CNAME** record pointing
     `www` → `namle05.github.io`.
   - For an apex/root domain like `nudge.app`, add **A** records to GitHub's
     Pages IPs (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`,
     `185.199.111.153`) and an **AAAA** set if you want IPv6.

3. In **Settings → Pages → Custom domain**, enter the same domain and save, then
   tick **Enforce HTTPS** once the certificate is issued.

GitHub's docs: <https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site>

---

Built as a static site — works offline, opens with a double-click, and costs
nothing to host.
