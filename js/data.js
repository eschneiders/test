/* ============================================================================
   VILLA CONFIGURATION  —  edit the values here to make the site yours.
   Descriptive text (amenity wording, testimonials, etc.) lives in js/i18n.js,
   translated into every language. This file holds the facts: name, contact,
   prices and photos. Availability & prices are best managed from /admin.html.
   ============================================================================ */

const VILLA = {
  /* Identity ---------------------------------------------------------------- */
  name: "Casa da Luz",                     // ← your villa's name
  locationShort: "Praia da Luz · Lagos",
  locationLong: "Praia da Luz, Lagos — Western Algarve, Portugal",

  /* Where booking enquiries are sent --------------------------------------- */
  ownerEmail: "mpschneiders@gmail.com",    // ← enquiries + mailto fallback
  phone: "+351 000 000 000",               // ← optional; leave as-is to hide

  /* SEO / addressing — IMPORTANT: set siteUrl to your real address once live -*/
  siteUrl: "https://casa-da-luz.netlify.app",   // ← your live URL (no trailing slash)
  address: { locality: "Praia da Luz", region: "Lagos", country: "PT" },
  geo: { lat: 37.0879, lng: -8.7263 },     // approx Praia da Luz; refine if you like

  /* Key facts shown under the hero ----------------------------------------- */
  stats: { bedrooms: 5, bathrooms: 5, sleeps: 10 },

  /* Booking rules ----------------------------------------------------------- */
  // Guests choose any check-in and check-out date (not fixed weeks).
  minNights: 3,          // shortest stay you'll accept
  monthsAhead: 12,       // how many months of calendar to show

  /* Default seasonal PER-NIGHT rates (used when a night has no custom price) - */
  nightlyRates: {
    high: 950,   // Jul – Aug (peak summer)
    mid:  620,   // May, Jun, Sep, Oct
    low:  400,   // Nov – Apr
  },

  /* Owner login ------------------------------------------------------------- */
  // NOTE: this is light protection only (see README). Change it to your own.
  adminPassword: "algarve2026",
};

/* ----------------------------------------------------------------------------
   PLACEHOLDER PHOTO SLIDES
   Each slide is a styled placeholder for now. Later, drop a real photo into
   /assets and set  image: "assets/your-photo.jpg". Captions are translated in
   js/i18n.js (gallery.captions), matched to these slides by order.
   `tone` (a–f) just picks a placeholder colour.
   ---------------------------------------------------------------------------- */

const HERO_SLIDES = [
  { tone: "a", image: null },
  { tone: "b", image: null },
  { tone: "e", image: null },
];

const GALLERY_SLIDES = [
  { tone: "b", image: null },
  { tone: "c", image: null },
  { tone: "d", image: null },
  { tone: "a", image: null },
  { tone: "f", image: null },
  { tone: "c", image: null },
];

/* ----------------------------------------------------------------------------
   AMENITIES — order + icon only; the wording is translated in js/i18n.js
   (amenities.<key>). To add one, add a key here and the same key in i18n.
   ---------------------------------------------------------------------------- */

const AMENITY_KEYS = ["pool", "sea", "chef", "wifi", "ac", "car", "garden", "beach"];

/* ----------------------------------------------------------------------------
   DEMO BOOKINGS — a few date ranges blocked out of the box so the calendar
   looks alive. Each range blocks the nights from `start` up to (not including)
   `end` — i.e. `end` is the checkout day and stays bookable. These are cleared
   the moment you save anything in the owner panel. Offsets are days from today.
   ---------------------------------------------------------------------------- */

const DEMO_BOOKED_OFFSETS = [
  { startIn: 9,  nights: 7 },
  { startIn: 24, nights: 5 },
  { startIn: 45, nights: 9 },
];

/* Node (build script) access — ignored in the browser. */
if (typeof module !== "undefined" && module.exports) {
  module.exports = { VILLA, HERO_SLIDES, GALLERY_SLIDES, AMENITY_KEYS, DEMO_BOOKED_OFFSETS };
}
