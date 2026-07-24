# Deploying Casa da Luz to Netlify

This site is ready to host on Netlify's free tier. It auto-redeploys every time
new code is pushed to your GitHub branch — no manual uploading, ever.

The repo is already prepped (`netlify.toml`, Netlify-ready enquiry form). You
just need to connect your account — about 5 clicks.

## One-time setup (~3 minutes)

1. Go to **https://app.netlify.com/signup** and sign up with **GitHub**
   (this lets Netlify see your repo).
2. Click **Add new site → Import an existing project → Deploy with GitHub**.
3. Choose the repository **`eschneiders/test`**.
4. When it asks which branch to deploy, pick
   **`claude/portugal-vacation-websites-11oyfo`** (or `main` once this is merged).
   Leave build command **empty** and publish directory **`.`** — the included
   `netlify.toml` already sets this, so you can just click **Deploy**.
5. Wait ~30 seconds. Your site is live at a URL like
   **`https://random-name-1234.netlify.app`**.

You can rename that subdomain any time under **Site configuration → Domain
management → Options → Edit site name** (e.g. `casa-da-luz.netlify.app`).

## Turn on enquiry emails (~1 minute) — important

The booking form uses **Netlify Forms**, so every enquiry is saved in your
Netlify dashboard automatically. To also get an email each time someone enquires:

1. In your site, go to **Forms** (you'll see a form named **`enquiry`** after the
   first deploy).
2. Open **Form notifications → Add notification → Email notification**.
3. Enter **mpschneiders@gmail.com**. Done — you'll now be emailed every booking
   enquiry (with the guest's chosen dates, nights and estimated total).

> Tip: Netlify's free plan includes 100 form submissions/month, which is plenty
> for a single villa.

## Making changes later

- **You** (owner panel): manage weeks/prices at `your-site.netlify.app/admin.html`.
  To publish those to visitors, use the panel's **Publish** button, then send me
  the file (or paste it back) and I'll push it — the site updates itself within a
  minute.
- **Content/photos**: whenever code is pushed to the connected branch, Netlify
  rebuilds automatically. Nothing else to do.

## Adding a custom domain later (optional)

When you're ready for a branded address (e.g. `casadaluz.com`):

1. Buy the domain (Netlify can sell you one, or use any registrar).
2. In Netlify: **Domain management → Add a domain** and follow the prompts.
   HTTPS is set up automatically and free.

I can walk you through this whenever you like.
