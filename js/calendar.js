/* ============================================================================
   Availability engine (per-night) — shared by the public site and owner panel.

   Model
   -----
   • Guests choose any check-in and check-out date. A stay covers the NIGHTS
     from check-in up to (not including) check-out.
   • Unavailability is stored as a list of booked ranges {start, end}, where the
     booked nights are [start, end) — so `end` is a checkout day and remains
     bookable as someone else's check-in.
   • Pricing is per night: a night's price is the owner's custom price if it
     falls in a price range, otherwise the seasonal nightly rate for its month.
   • Owner edits (booked ranges, price ranges, nightly rates) are stored in the
     browser under STATE_KEY and override the defaults.
   ============================================================================ */

const STATE_KEY = "villa.availability.v2";

/* --- date helpers ---------------------------------------------------------- */

function startOfDay(d) { const x = new Date(d); x.setHours(0,0,0,0); return x; }
function today()       { return startOfDay(new Date()); }
function addDays(date, n) { const d = new Date(date); d.setDate(d.getDate() + n); return d; }

function keyOf(date) {
  const d = startOfDay(date);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function parseKey(key) { const [y,m,d] = key.split("-").map(Number); return new Date(y, m-1, d); }
function daysBetween(a, b) { return Math.round((startOfDay(b) - startOfDay(a)) / 86400000); }

/* Locale-aware date formatting (falls back gracefully). */
function fmtDate(date, lang = (typeof getLang === "function" ? getLang() : "en")) {
  const loc = (typeof LOCALE !== "undefined" && LOCALE[lang]) || "en-GB";
  return new Intl.DateTimeFormat(loc, { day: "numeric", month: "short", year: "numeric" }).format(date);
}
function fmtRange(checkIn, checkOut, lang) {
  return `${fmtDate(checkIn, lang)} → ${fmtDate(checkOut, lang)}`;
}

/* --- season / default nightly pricing -------------------------------------- */

function seasonForMonth(m) {
  if (m === 6 || m === 7) return "high";        // Jul, Aug
  if ([4,5,8,9].includes(m)) return "mid";      // May, Jun, Sep, Oct
  return "low";                                 // Nov–Apr
}

/* --- persisted state ------------------------------------------------------- */

function hasOwnerData() { return localStorage.getItem(STATE_KEY) !== null; }

function demoBookedRanges() {
  const base = today();
  return DEMO_BOOKED_OFFSETS.map(o => ({
    start: keyOf(addDays(base, o.startIn)),
    end:   keyOf(addDays(base, o.startIn + o.nights)),
  }));
}

function loadState() {
  let stored = null;
  try { stored = JSON.parse(localStorage.getItem(STATE_KEY)); } catch { stored = null; }
  return {
    bookedRanges: stored?.bookedRanges ?? demoBookedRanges(),
    priceRanges:  stored?.priceRanges  ?? [],
    nightlyRates: { ...VILLA.nightlyRates, ...(stored?.nightlyRates || {}) },
  };
}

function saveState(state) {
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

/* --- availability & pricing queries ---------------------------------------- */

// Is the NIGHT beginning on `date` booked? (date in some [start, end))
function isNightBooked(date, state) {
  const d = startOfDay(date);
  return state.bookedRanges.some(r => {
    const s = parseKey(r.start), e = parseKey(r.end);
    return d >= s && d < e;
  });
}

// Price of the NIGHT beginning on `date`.
function nightlyPrice(date, state) {
  const d = startOfDay(date);
  for (const r of state.priceRanges) {
    if (d >= parseKey(r.start) && d < parseKey(r.end)) return Number(r.nightly);
  }
  return state.nightlyRates[seasonForMonth(d.getMonth())];
}

// Every night in [checkIn, checkOut) available, and in the future?
function isRangeAvailable(checkIn, checkOut, state) {
  if (daysBetween(checkIn, checkOut) < 1) return false;
  if (startOfDay(checkIn) < today()) return false;
  for (let d = startOfDay(checkIn); d < startOfDay(checkOut); d = addDays(d, 1)) {
    if (isNightBooked(d, state)) return false;
  }
  return true;
}

// { nights, total, avg } for a stay.
function quote(checkIn, checkOut, state) {
  let nights = 0, total = 0;
  for (let d = startOfDay(checkIn); d < startOfDay(checkOut); d = addDays(d, 1)) {
    nights++; total += nightlyPrice(d, state);
  }
  return { nights, total, avg: nights ? Math.round(total / nights) : 0 };
}

/* --- month grid for rendering (weeks start Monday) ------------------------- */

function buildMonths(count, fromDate = today()) {
  const months = [];
  let y = fromDate.getFullYear(), m = fromDate.getMonth();
  const firstToday = today();

  for (let i = 0; i < count; i++) {
    const first = new Date(y, m, 1);
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const lead = (first.getDay() + 6) % 7;           // Mon=0 … Sun=6
    const cells = [];
    for (let k = 0; k < lead; k++) cells.push(null);  // blanks before the 1st
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(y, m, day);
      cells.push({ date, key: keyOf(date), past: startOfDay(date) < firstToday });
    }
    months.push({ year: y, month: m, cells });
    m++; if (m > 11) { m = 0; y++; }
  }
  return months;
}
