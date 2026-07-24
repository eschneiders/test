/* ============================================================================
   Static site generator — produces one fully-rendered HTML page per language
   ( /index.html, /pt/index.html, /fr/index.html, /de/index.html ) plus
   sitemap.xml and robots.txt.

   Why: search engines (and social link previews) should see real content and a
   distinct URL per language, without running JavaScript. Content comes from
   js/i18n.js and js/data.js, so there's a single source of truth — never edit
   the generated HTML by hand; edit i18n.js / data.js and re-run `node build.js`.
   Netlify runs this automatically on every deploy.
   ============================================================================ */

const fs = require("fs");
const path = require("path");
const { I18N, LANGS, LANG_LABEL, LOCALE } = require("./js/i18n.js");
const { VILLA, HERO_SLIDES, GALLERY_SLIDES, AMENITY_KEYS } = require("./js/data.js");

const BASE = VILLA.siteUrl.replace(/\/+$/, "");
const OG_IMAGE = BASE + "/assets/og-image.jpg";   // add this file for social previews

const ICONS = {
  pool:  '<svg viewBox="0 0 24 24"><path d="M2 18c2 0 2-1.5 4-1.5S8 18 10 18s2-1.5 4-1.5S16 18 18 18s2-1.5 4-1.5"/><path d="M2 22c2 0 2-1.5 4-1.5S8 22 10 22s2-1.5 4-1.5S16 22 18 22s2-1.5 4-1.5"/><path d="M8 14V4a2 2 0 0 1 4 0M16 14V4"/></svg>',
  sea:   '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.2"/><path d="M2 16c2 0 2-1.4 4-1.4S8 16 10 16s2-1.4 4-1.4S16 16 18 16s2-1.4 4-1.4M2 20c2 0 2-1.4 4-1.4S8 20 10 20s2-1.4 4-1.4S16 20 18 20s2-1.4 4-1.4"/></svg>',
  chef:  '<svg viewBox="0 0 24 24"><path d="M6 13a4 4 0 1 1 1-7.9 4 4 0 0 1 10 0A4 4 0 1 1 18 13z"/><path d="M6 13v6a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-6"/></svg>',
  wifi:  '<svg viewBox="0 0 24 24"><path d="M5 12.5a10 10 0 0 1 14 0M8 15.5a6 6 0 0 1 8 0"/><circle cx="12" cy="19" r="1"/></svg>',
  ac:    '<svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="7" rx="2"/><path d="M6 15v1M10 15v2M14 15v1M18 15v2"/></svg>',
  car:   '<svg viewBox="0 0 24 24"><path d="M3 13l2-5a2 2 0 0 1 2-1.3h10A2 2 0 0 1 19 8l2 5v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H6v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><circle cx="7" cy="16" r="1"/><circle cx="17" cy="16" r="1"/></svg>',
  garden:'<svg viewBox="0 0 24 24"><path d="M12 22V9M12 9c0-3 2-5 5-5-1 3-3 5-5 5zM12 12C12 9 10 7 6 7c1 3 3 5 6 5z"/></svg>',
  beach: '<svg viewBox="0 0 24 24"><path d="M4 20h16M12 20V9M12 9a6 6 0 0 1 8 3M12 9a6 6 0 0 0-8 3"/></svg>',
};

const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const urlFor = l => (l === "en" ? "/" : `/${l}/`);
const absFor = l => BASE + urlFor(l);

/* --- head fragments -------------------------------------------------------- */

function hreflang() {
  return LANGS.map(l => `<link rel="alternate" hreflang="${l}" href="${absFor(l)}" />`).join("\n  ") +
    `\n  <link rel="alternate" hreflang="x-default" href="${absFor("en")}" />`;
}

function jsonLd(lang) {
  const S = I18N[lang];
  const data = {
    "@context": "https://schema.org",
    "@type": ["LodgingBusiness", "VacationRental"],
    name: VILLA.name,
    description: S.seo.description,
    url: absFor(lang),
    image: [OG_IMAGE],
    address: {
      "@type": "PostalAddress",
      addressLocality: VILLA.address.locality,
      addressRegion: VILLA.address.region,
      addressCountry: VILLA.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: VILLA.geo.lat, longitude: VILLA.geo.lng },
    numberOfRooms: VILLA.stats.bedrooms,
    amenityFeature: AMENITY_KEYS.map(k => ({
      "@type": "LocationFeatureSpecification", name: S.amenities[k].t, value: true,
    })),
    priceRange: "€€€€",
    checkinTime: "16:00",
    checkoutTime: "10:00",
    inLanguage: lang,
  };
  if (VILLA.phone && !VILLA.phone.includes("000 000 000")) data.telephone = VILLA.phone;
  return JSON.stringify(data);
}

/* --- body fragments -------------------------------------------------------- */

function langSwitch(cur) {
  return `<div class="lang-switch" role="group" aria-label="Language">` +
    LANGS.map(l => `<a href="${urlFor(l)}" hreflang="${l}"${l === cur ? ' class="active" aria-current="true"' : ""}>${LANG_LABEL[l]}</a>`).join("") +
    `</div>`;
}

function heroSlides() {
  return HERO_SLIDES.map((s, i) => s.image
    ? `<div class="hero-slide${i===0?" active":""}" style="background:url('${s.image}') center/cover"></div>`
    : `<div class="hero-slide ph${i===0?" active":""}" data-tone="${s.tone}"></div>`).join("");
}

function gallerySlides(lang) {
  const caps = I18N[lang].gallery.captions;
  return GALLERY_SLIDES.map((s, i) => s.image
    ? `<div class="gc-slide" style="background:url('${s.image}') center/cover"></div>`
    : `<div class="gc-slide ph" data-tone="${s.tone}"><span class="ph-label">${esc(caps[i]||"")}</span></div>`).join("");
}

function stats(lang) {
  const S = I18N[lang].stats;
  const rows = [
    [VILLA.stats.bedrooms, S.bedrooms], [VILLA.stats.bathrooms, S.bathrooms], [VILLA.stats.sleeps, S.sleeps],
  ];
  return rows.map(([n, lab]) => `<li><span class="num">${n}</span><span class="lab">${esc(lab)}</span></li>`).join("");
}

function amenities(lang) {
  const A = I18N[lang].amenities;
  return AMENITY_KEYS.map(k =>
    `<li class="amenity"><div class="ic">${ICONS[k]||""}</div><h3>${esc(A[k].t)}</h3><p>${esc(A[k].d)}</p></li>`).join("");
}

function highlights(lang) {
  return I18N[lang].location.highlights.map(h =>
    `<li><span class="place">${esc(h.p)}</span><span class="detail">${esc(h.d)}</span></li>`).join("");
}

function testimonials(lang) {
  return I18N[lang].testimonials.items.map((it, i) =>
    `<figure class="testimonial${i===0?" active":""}"><blockquote>“${esc(it.q)}”</blockquote><figcaption class="who">${esc(it.w)}</figcaption></figure>`).join("");
}

function contact() {
  let html = `<a href="mailto:${VILLA.ownerEmail}">${VILLA.ownerEmail}</a>`;
  if (VILLA.phone && !VILLA.phone.includes("000 000 000"))
    html += `<a href="tel:${VILLA.phone.replace(/\s/g,"")}">${esc(VILLA.phone)}</a>`;
  return html;
}

/* --- full page ------------------------------------------------------------- */

function page(lang) {
  const S = I18N[lang];
  const lede = S.intro.lede.replace("%NAME%", VILLA.name);
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(S.seo.title)}</title>
  <meta name="description" content="${esc(S.seo.description)}" />
  <link rel="canonical" href="${absFor(lang)}" />
  ${hreflang()}

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="${esc(VILLA.name)}" />
  <meta property="og:title" content="${esc(S.seo.title)}" />
  <meta property="og:description" content="${esc(S.seo.description)}" />
  <meta property="og:url" content="${absFor(lang)}" />
  <meta property="og:locale" content="${LOCALE[lang].replace("-", "_")}" />
  <meta property="og:image" content="${OG_IMAGE}" />
  <meta property="og:image:alt" content="${esc(S.seo.ogAlt)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(S.seo.title)}" />
  <meta name="twitter:description" content="${esc(S.seo.description)}" />
  <meta name="twitter:image" content="${OG_IMAGE}" />

  <script type="application/ld+json">${jsonLd(lang)}</script>

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/css/styles.css" />
</head>
<body>

  <header class="site-header" id="siteHeader">
    <div class="container header-inner">
      <a href="#top" class="brand">${esc(VILLA.name)}</a>
      <nav class="nav" id="nav">
        <a href="#villa">${esc(S.nav.villa)}</a>
        <a href="#gallery">${esc(S.nav.gallery)}</a>
        <a href="#availability">${esc(S.nav.availability)}</a>
        <a href="#location">${esc(S.nav.location)}</a>
        <a href="#enquire" class="nav-cta">${esc(S.nav.enquire)}</a>
        ${langSwitch(lang)}
      </nav>
      <button class="nav-toggle" id="navToggle" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>
    </div>
  </header>

  <section class="hero" id="top">
    <div class="hero-carousel" id="heroCarousel" aria-label="${esc(VILLA.name)}">${heroSlides()}</div>
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <p class="eyebrow">${esc(VILLA.locationShort)}</p>
      <h1 class="hero-title">${esc(VILLA.name)}</h1>
      <p class="hero-tagline">${esc(S.intro.title)}</p>
      <div class="hero-actions">
        <a href="#availability" class="btn btn-primary">${esc(S.hero.ctaCheck)}</a>
        <a href="#villa" class="btn btn-ghost">${esc(S.hero.ctaDiscover)}</a>
      </div>
    </div>
    <div class="hero-dots" id="heroDots" aria-hidden="true"></div>
    <a href="#villa" class="scroll-cue" aria-label="Scroll down"><span></span></a>
  </section>

  <section class="section intro" id="villa">
    <div class="container narrow center">
      <p class="eyebrow">${esc(S.intro.eyebrow)}</p>
      <h2 class="section-title">${esc(S.intro.title)}</h2>
      <p class="lede">${esc(lede)}</p>
      <ul class="stats">${stats(lang)}</ul>
    </div>
  </section>

  <section class="section amenities alt">
    <div class="container">
      <div class="section-head center">
        <p class="eyebrow">${esc(S.amenities.eyebrow)}</p>
        <h2 class="section-title">${esc(S.amenities.title)}</h2>
      </div>
      <ul class="amenity-grid">${amenities(lang)}</ul>
    </div>
  </section>

  <section class="section gallery" id="gallery">
    <div class="container">
      <div class="section-head center">
        <p class="eyebrow">${esc(S.gallery.eyebrow)}</p>
        <h2 class="section-title">${esc(S.gallery.title)}</h2>
      </div>
    </div>
    <div class="gallery-carousel">
      <button class="gc-arrow gc-prev" id="galPrev" aria-label="Previous photo">‹</button>
      <div class="gc-track" id="galleryTrack">${gallerySlides(lang)}</div>
      <button class="gc-arrow gc-next" id="galNext" aria-label="Next photo">›</button>
    </div>
    <div class="gallery-dots" id="galleryDots" aria-hidden="true"></div>
  </section>

  <section class="section availability alt" id="availability">
    <div class="container">
      <div class="section-head center">
        <p class="eyebrow">${esc(S.avail.eyebrow)}</p>
        <h2 class="section-title">${esc(S.avail.title)}</h2>
        <p class="section-sub">${esc(S.avail.sub)}</p>
      </div>
      <div class="cal-legend">
        <span class="lg lg-avail">${esc(S.avail.legendAvailable)}</span>
        <span class="lg lg-booked">${esc(S.avail.legendBooked)}</span>
        <span class="lg lg-selected">${esc(S.avail.legendSelected)}</span>
      </div>
      <div class="booking">
        <div class="cal" id="calendar"></div>
        <aside class="quote" id="quote"></aside>
      </div>
      <p class="cal-note">${esc(S.avail.note)}</p>
    </div>
  </section>

  <section class="section enquire" id="enquire">
    <div class="container narrow">
      <div class="section-head center">
        <p class="eyebrow">${esc(S.enquire.eyebrow)}</p>
        <h2 class="section-title">${esc(S.enquire.title)}</h2>
        <p class="section-sub">${esc(S.enquire.sub)}</p>
      </div>
      <form class="enquiry-form" id="enquiryForm" name="enquiry" method="POST" data-netlify="true" netlify-honeypot="bot-field">
        <input type="hidden" name="form-name" value="enquiry" />
        <p class="hp" aria-hidden="true"><label>Leave this empty <input name="bot-field" /></label></p>
        <input type="hidden" id="fCheckIn" name="check_in" />
        <input type="hidden" id="fCheckOut" name="check_out" />
        <input type="hidden" id="fNights" name="nights" />
        <input type="hidden" id="fTotal" name="estimated_total" />
        <input type="hidden" id="fDates" name="dates" value="${esc(S.enquire.datesFlexible)}" />
        <div class="field field-wide">
          <label>${esc(S.enquire.dates)}</label>
          <button type="button" class="dates-display" id="datesDisplay">${esc(S.enquire.datesFlexible)}</button>
        </div>
        <div class="field">
          <label for="fName">${esc(S.enquire.name)}</label>
          <input type="text" id="fName" name="name" required />
        </div>
        <div class="field">
          <label for="fEmail">${esc(S.enquire.email)}</label>
          <input type="email" id="fEmail" name="email" required />
        </div>
        <div class="field">
          <label for="fGuests">${esc(S.enquire.guests)}</label>
          <input type="number" id="fGuests" name="guests" min="1" max="20" value="2" />
        </div>
        <div class="field field-wide">
          <label for="fMessage">${esc(S.enquire.message)} <span class="opt">${esc(S.enquire.optional)}</span></label>
          <textarea id="fMessage" name="message" rows="4" placeholder="${esc(S.enquire.messagePh)}"></textarea>
        </div>
        <div class="field field-wide">
          <button type="submit" class="btn btn-primary btn-block">${esc(S.enquire.submit)}</button>
          <p class="form-hint">${esc(S.enquire.hint)}</p>
        </div>
      </form>
      <div class="form-success" id="formSuccess" hidden>
        <div class="fs-mark">✓</div>
        <h3>${esc(S.enquire.successTitle)}</h3>
        <p>${esc(S.enquire.successText)}</p>
      </div>
    </div>
  </section>

  <section class="section location alt" id="location">
    <div class="container location-inner">
      <div class="location-text">
        <p class="eyebrow">${esc(S.location.eyebrow)}</p>
        <h2 class="section-title">${esc(S.location.title)}</h2>
        <p class="lede">${esc(VILLA.locationLong)}</p>
        <p>${esc(S.location.prose)}</p>
        <ul class="highlights">${highlights(lang)}</ul>
      </div>
      <div class="location-map ph" data-tone="b"><span class="ph-label">${esc(S.location.map)}</span></div>
    </div>
  </section>

  <section class="section testimonials">
    <div class="container narrow center">
      <p class="eyebrow">${esc(S.testimonials.eyebrow)}</p>
      <div class="testimonial-carousel" id="testimonials">${testimonials(lang)}</div>
    </div>
  </section>

  <footer class="site-footer">
    <div class="container footer-inner">
      <div>
        <p class="footer-brand">${esc(VILLA.name)}</p>
        <p class="footer-loc">${esc(VILLA.locationShort)}</p>
      </div>
      <div class="footer-contact">${contact()}</div>
      <div class="footer-links">
        <a href="#availability">${esc(S.nav.availability)}</a>
        <a href="#enquire">${esc(S.nav.enquire)}</a>
        <a href="/admin.html" class="owner-link">${esc(S.footer.ownerLogin)}</a>
      </div>
    </div>
    <div class="container footer-bottom">
      <span>© ${year} ${esc(VILLA.name)}. ${esc(S.footer.rights)}</span>
    </div>
  </footer>

  <script src="/js/i18n.js"></script>
  <script src="/js/data.js"></script>
  <script src="/js/calendar.js"></script>
  <script src="/js/main.js"></script>
</body>
</html>
`;
}

/* --- sitemap + robots ------------------------------------------------------ */

function sitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const urls = LANGS.map(l => {
    const alts = LANGS.map(a => `    <xhtml:link rel="alternate" hreflang="${a}" href="${absFor(a)}" />`).join("\n") +
      `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${absFor("en")}" />`;
    return `  <url>\n    <loc>${absFor(l)}</loc>\n    <lastmod>${today}</lastmod>\n${alts}\n  </url>`;
  }).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
}

function robots() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${BASE}/sitemap.xml\n`;
}

/* --- write everything ------------------------------------------------------ */

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log("  wrote", file);
}

console.log("Building site for:", BASE);
for (const l of LANGS) {
  write(l === "en" ? "index.html" : path.join(l, "index.html"), page(l));
}
write("sitemap.xml", sitemap());
write("robots.txt", robots());
console.log("Done.");
