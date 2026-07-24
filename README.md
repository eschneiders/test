# Casa da Luz — Algarve villa booking site

A fast, elegant one-page website to advertise a luxury holiday home and take
booking enquiries, with a private owner panel for managing availability and
prices. Pure HTML/CSS/JavaScript — no build step, no server, no monthly fees.

**Highlights**
- **Flexible dates** — guests pick any check-in and check-out (not fixed weeks),
  with a live price quote and booked nights blocked out.
- **Four languages** — English, Portuguese, French, German, with a switcher.
  Dates and prices format automatically for each language.
- **Owner panel** — block date ranges, set seasonal nightly rates and custom
  prices, all from `/admin.html`.

## What's here

| File | What it is |
|------|------------|
| `index.html` | The public site guests see |
| `admin.html` | Private owner login & booking manager (`/admin.html`) |
| `css/styles.css` | All public-site styling |
| `css/admin.css` | Owner-panel styling |
| `js/data.js` | **Your facts** — villa name, email, `siteUrl`, nightly rates, photos |
| `js/i18n.js` | **Translations** — all wording, in 4 languages |
| `build.js` | Generates the per-language pages, sitemap & robots |
| `js/calendar.js` | Availability engine (per-night, shared) |
| `js/main.js` | Public-site behaviour |
| `js/admin.js` | Owner-panel behaviour |
| `assets/` | Drop your photos here (incl. `og-image.jpg`) |

The pages guests see — `index.html` (English) and `pt/` `fr/` `de/` — plus
`sitemap.xml` and `robots.txt` are **generated** by `build.js`. Don't edit them
by hand; edit `js/i18n.js` / `js/data.js` and run `node build.js` (Netlify does
this automatically on every deploy).

## Quick start

1. Open `index.html` in a browser to see the site.
2. Edit `js/data.js` to make it yours — the top of the file is all plain-English
   settings: villa name, tagline, location, your booking email, seasonal prices,
   and the owner password.

## Making it yours

**Facts & prices** — the top of `js/data.js` holds the villa name, location,
`ownerEmail` (where enquiries go), `stats`, nightly `seasonRates`, `minNights`,
and the photo slots.

**Wording & translations** — all visible text lives in `js/i18n.js`, with an
`en` / `pt` / `fr` / `de` block each. Edit a phrase in the language you want, or
add a new language by copying a block. Month names, weekdays and currency format
themselves per language.

**Managing bookings & prices** — use the owner panel (below); no need to edit
code for day-to-day availability.

**Photos** — the gallery and hero currently show styled placeholders. To use a
real photo, drop it into `assets/` and set its path on the matching slide in
`js/data.js`, e.g.:

```js
const HERO_SLIDES = [
  { tone: "a", label: "The villa at golden hour", image: "assets/hero-1.jpg" },
  ...
];
```

Any slide with `image: null` stays a placeholder, so you can add photos one at a
time.

## Managing bookings (owner panel)

Go to **`/admin.html`** and sign in with the password from `js/data.js`
(`adminPassword`, default `algarve2026` — change it).

From there you can:

- **Block date ranges** — enter a first night and checkout day to mark those
  nights unavailable (the checkout day stays bookable). Remove any block later.
- **Set nightly rates** per season (high / mid / low).
- **Add custom pricing** for a specific date range (e.g. a special week).
- **Preview** how the calendar looks to guests.

Changes save instantly **in your browser**, so you can preview them right away.

### Publishing changes to visitors

Because this is a static site (no database), your saved edits live in your own
browser. To make them visible to everyone, use the **Publish** section of the
owner panel — "Copy data" or "Download JSON" — and update the site's files, then
re-upload. If you'd like edits to go live automatically without this step, that
needs a small backend (a database + a login API); it's a straightforward next
step to add.

## Booking enquiries

When a guest picks their dates and submits the form, the enquiry — including the
chosen check-in/check-out, number of nights and estimated total — is sent through
**Netlify Forms**: it's saved in your Netlify dashboard and (once you switch on
notifications) emailed straight to **mpschneiders@gmail.com** — the guest doesn't
need an email app. See `DEPLOY.md` for the one-minute step to enable email
notifications.

If the site is ever opened somewhere without Netlify Forms (e.g. a plain local
file), the form automatically falls back to opening the guest's email app with
the details pre-filled, addressed to your `ownerEmail`.

## A note on the owner password

The login is **light protection** — enough to keep casual visitors out of the
panel, but because everything runs in the browser, it is not strong security.
Don't store anything sensitive here. For real access control you'd add a backend
login; happy to set that up if you want it.

## SEO & languages

The site is built for search visibility:

- **A real page per language** — `/`, `/pt/`, `/fr/`, `/de/` — each with its
  content in the HTML (not just JavaScript), so Google can read and rank it in
  each market. `hreflang` tags link the versions together.
- **Rich link previews** — Open Graph / Twitter tags, so sharing the link on
  WhatsApp, Facebook, etc. shows a photo, title and description.
- **Structured data** (schema.org `VacationRental`) describing the property,
  address, amenities and location — helps Google understand it's a place to stay.
- **`sitemap.xml` + `robots.txt`** for complete indexing.

**Two things you must do for SEO to work:**

1. Set **`siteUrl`** in `js/data.js` to your real address (e.g.
   `https://casadaluz.com`) — the canonical, hreflang and sitemap URLs depend on
   it. Then rebuild/redeploy.
2. Add an **`assets/og-image.jpg`** (a nice wide photo of the villa, ~1200×630)
   so shared links show an image.

Then, once live: add the site to **Google Search Console** and submit
`sitemap.xml`. Realistically, a single villa ranks best for its own name and
specific long-tail phrases — the bulk of early bookings will come from listing
on Airbnb/Vrbo and luxury villa portals, with this site as your brand anchor and
commission-free direct-booking channel.

## Hosting

This site is set up for **Netlify** (free tier) — see **`DEPLOY.md`** for the
short step-by-step. It auto-redeploys whenever code is pushed to the connected
branch, running `node build.js` to regenerate the language pages. Any other
static host works too, but it would need to run the same build step.
