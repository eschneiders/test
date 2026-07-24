/* ============================================================================
   VILLA CONFIGURATION  —  edit the values here to make the site yours.
   These are the only things you normally need to touch by hand; everything
   else (prices per week, booked weeks) can be managed from the owner login
   at  /admin.html.
   ============================================================================ */

const VILLA = {
  /* Identity ---------------------------------------------------------------- */
  name: "Casa da Luz",                     // ← your villa's name
  tagline: "A private Algarve retreat, moments from the sea",
  locationShort: "Praia da Luz · Lagos",
  locationLong: "Praia da Luz, Lagos — Western Algarve, Portugal",

  /* Where booking enquiries are sent --------------------------------------- */
  ownerEmail: "bookings@example.com",      // ← your email for enquiries
  phone: "+351 000 000 000",               // ← optional; leave as-is to hide

  /* Key facts shown under the hero ----------------------------------------- */
  stats: { bedrooms: 5, bathrooms: 5, sleeps: 10 },

  /* Booking rules ----------------------------------------------------------- */
  // Weeks run changeover-day to changeover-day. 6 = Saturday (Algarve norm).
  changeoverDay: 6,
  // How many weeks of availability to show / generate ahead (~14 months).
  weeksAhead: 60,

  /* Default seasonal weekly rates (used when a week has no custom price) ----- */
  // You can override any individual week's price from the owner panel.
  seasonRates: {
    high: 6500,   // Jul – Aug (peak summer)
    mid:  4200,   // May, Jun, Sep, Oct
    low:  2800,   // Nov – Apr
  },

  /* Owner login ------------------------------------------------------------- */
  // NOTE: this is light protection only (see README). Change it to your own.
  adminPassword: "algarve2026",
};

/* ----------------------------------------------------------------------------
   PLACEHOLDER GALLERY SLIDES
   Each slide is currently a styled placeholder. Later, drop a real photo into
   /assets and set  image: "assets/your-photo.jpg"  on the slide.
   `tone` (a–f) just picks a different placeholder colour for variety.
   ---------------------------------------------------------------------------- */

const HERO_SLIDES = [
  { tone: "a", label: "The villa at golden hour",        image: null },
  { tone: "b", label: "Infinity pool & sea view",         image: null },
  { tone: "e", label: "Sunset from the terrace",          image: null },
];

const GALLERY_SLIDES = [
  { tone: "b", label: "Pool & sun terrace",               image: null },
  { tone: "c", label: "Open-plan living room",            image: null },
  { tone: "d", label: "Master suite",                     image: null },
  { tone: "a", label: "Al fresco dining",                 image: null },
  { tone: "f", label: "Evening on the terrace",           image: null },
  { tone: "c", label: "Designer kitchen",                 image: null },
];

/* ----------------------------------------------------------------------------
   AMENITIES  —  edit freely. `icon` maps to a line-icon defined in main.js.
   ---------------------------------------------------------------------------- */

const AMENITIES = [
  { icon: "pool",    title: "Heated infinity pool",  text: "Private 12m pool overlooking the Atlantic." },
  { icon: "sea",     title: "Panoramic sea views",   text: "Uninterrupted views across the bay." },
  { icon: "chef",    title: "Chef's kitchen",        text: "Fully equipped, with optional private chef." },
  { icon: "wifi",    title: "Fast Wi-Fi",            text: "Fibre broadband throughout the house." },
  { icon: "ac",      title: "Air conditioning",      text: "Climate control in every bedroom." },
  { icon: "car",     title: "Private parking",       text: "Gated driveway for up to three cars." },
  { icon: "garden",  title: "Landscaped gardens",    text: "Mature Mediterranean gardens & lawn." },
  { icon: "beach",   title: "5 min to the beach",    text: "A short stroll to Praia da Luz." },
];

/* ----------------------------------------------------------------------------
   LOCATION HIGHLIGHTS  —  what's nearby.
   ---------------------------------------------------------------------------- */

const HIGHLIGHTS = [
  { place: "Praia da Luz beach",   detail: "5 min walk" },
  { place: "Lagos old town",       detail: "12 min drive" },
  { place: "Championship golf",    detail: "15 min drive" },
  { place: "Faro airport",         detail: "1 hr drive" },
];

/* ----------------------------------------------------------------------------
   GUEST WORDS  —  placeholder testimonials.
   ---------------------------------------------------------------------------- */

const TESTIMONIALS = [
  { quote: "The most beautiful place we have ever stayed. We are already planning our return.", name: "— A guest from London" },
  { quote: "Impeccable in every detail. The views at sunset are simply unforgettable.",         name: "— A family from Paris" },
  { quote: "A true home from home, with every comfort you could wish for.",                     name: "— Guests from Berlin" },
];

/* ----------------------------------------------------------------------------
   DEMO DATA — a few weeks marked as booked out of the box so the calendar
   looks alive. These are cleared the moment you save changes in the owner
   panel. Numbers are week positions from today (0 = this week).
   ---------------------------------------------------------------------------- */

const DEMO_BOOKED_INDEXES = [1, 2, 6, 11];
