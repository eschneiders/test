# Casa da Luz — Algarve villa booking site

A fast, elegant one-page website to advertise a luxury holiday home and take
booking enquiries, with a private owner panel for managing availability and
prices. Pure HTML/CSS/JavaScript — no build step, no server, no monthly fees.

## What's here

| File | What it is |
|------|------------|
| `index.html` | The public site guests see |
| `admin.html` | Private owner login & booking manager (`/admin.html`) |
| `css/styles.css` | All public-site styling |
| `css/admin.css` | Owner-panel styling |
| `js/data.js` | **Your content** — villa name, prices, photos, contact |
| `js/calendar.js` | Availability engine (shared) |
| `js/main.js` | Public-site behaviour |
| `js/admin.js` | Owner-panel behaviour |
| `assets/` | Drop your photos here |

## Quick start

1. Open `index.html` in a browser to see the site.
2. Edit `js/data.js` to make it yours — the top of the file is all plain-English
   settings: villa name, tagline, location, your booking email, seasonal prices,
   and the owner password.

## Making it yours

**Text & prices** — everything you'd normally change lives at the top of
`js/data.js` (villa name, tagline, location, `ownerEmail`, `stats`,
`seasonRates`, amenities, highlights, testimonials).

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

- Mark any week **Available** or **Booked**.
- Set a **custom price** for any week (blank = the seasonal default).
- Preview seasonal rates.

Changes save instantly **in your browser**, so you can preview them right away.

### Publishing changes to visitors

Because this is a static site (no database), your saved edits live in your own
browser. To make them visible to everyone, use the **Publish** section of the
owner panel — "Copy data" or "Download JSON" — and update the site's files, then
re-upload. If you'd like edits to go live automatically without this step, that
needs a small backend (a database + a login API); it's a straightforward next
step to add.

## Booking enquiries

When a guest picks a week and submits the form, their email app opens with the
details pre-filled, addressed to your `ownerEmail`. No third-party service or
signup required. (If you'd prefer enquiries to arrive without the guest needing
an email app, a form service like Formspree can be dropped in later.)

## A note on the owner password

The login is **light protection** — enough to keep casual visitors out of the
panel, but because everything runs in the browser, it is not strong security.
Don't store anything sensitive here. For real access control you'd add a backend
login; happy to set that up if you want it.

## Hosting

Any static host works and most are free: GitHub Pages, Netlify, Cloudflare
Pages, or Vercel. Upload the whole folder and you're live.
