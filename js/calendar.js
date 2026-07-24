/* ============================================================================
   Availability engine — shared by the public site (main.js) and the owner
   panel (admin.js).

   Model
   -----
   • The season is a list of weeks. Each week starts on the changeover day
     (Saturday by default) and lasts 7 nights.
   • A week is identified by the ISO date of its start (YYYY-MM-DD) — its "key".
   • For every week we can know two things: its PRICE and its STATUS
     ("available" | "booked").
   • Defaults come from VILLA.seasonRates (+ the demo booked weeks). The owner
     can override any week's price/status; overrides are stored in the browser
     under OVERRIDE_KEY and merged on top of the defaults.
   ============================================================================ */

const OVERRIDE_KEY = "villa.availability.v1";

const money = new Intl.NumberFormat("en-GB", {
  style: "currency", currency: "EUR", maximumFractionDigits: 0,
});

/* --- date helpers ---------------------------------------------------------- */

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

// The changeover day (Saturday) on or before `date`.
function weekStart(date) {
  const d = startOfDay(date);
  const diff = (d.getDay() - VILLA.changeoverDay + 7) % 7;
  d.setDate(d.getDate() - diff);
  return d;
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function keyOf(date) {
  const d = startOfDay(date);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

const MONTHS = ["January","February","March","April","May","June",
                "July","August","September","October","November","December"];

function fmtDay(date)   { return date.getDate(); }
function fmtShort(date) { return `${date.getDate()} ${MONTHS[date.getMonth()].slice(0,3)}`; }

// "Sat 5 Jul – Sat 12 Jul 2026"
function weekLabel(week) {
  const s = week.start, e = week.end;
  const dow = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  return `${dow[s.getDay()]} ${fmtShort(s)} – ${dow[e.getDay()]} ${fmtShort(e)} ${e.getFullYear()}`;
}

/* --- season / default pricing --------------------------------------------- */

function seasonForMonth(monthIndex) {
  if (monthIndex === 6 || monthIndex === 7) return "high";            // Jul, Aug
  if ([4, 5, 8, 9].includes(monthIndex))    return "mid";             // May,Jun,Sep,Oct
  return "low";                                                       // Nov–Apr
}

function defaultPriceFor(date) {
  return VILLA.seasonRates[seasonForMonth(date.getMonth())];
}

/* --- overrides (owner edits) ---------------------------------------------- */

function loadOverrides() {
  try { return JSON.parse(localStorage.getItem(OVERRIDE_KEY)) || {}; }
  catch { return {}; }
}

function saveOverrides(obj) {
  localStorage.setItem(OVERRIDE_KEY, JSON.stringify(obj));
}

// Has the owner ever saved anything? If so we ignore the demo booked weeks.
function hasOwnerData() {
  return localStorage.getItem(OVERRIDE_KEY) !== null;
}

/* --- the week list --------------------------------------------------------- */

// Build the list of upcoming weeks with merged price + status.
function buildWeeks() {
  const overrides = loadOverrides();
  const ownerActive = hasOwnerData();
  const weeks = [];
  let cursor = weekStart(new Date());

  for (let i = 0; i < VILLA.weeksAhead; i++) {
    const start = new Date(cursor);
    const end = addDays(start, 7);            // next changeover day
    const key = keyOf(start);

    // Base defaults
    let status = "available";
    if (!ownerActive && DEMO_BOOKED_INDEXES.includes(i)) status = "booked";
    let price = defaultPriceFor(start);
    let custom = false;

    // Apply owner overrides
    const o = overrides[key];
    if (o) {
      if (o.status) status = o.status;
      if (o.price != null && o.price !== "") { price = Number(o.price); custom = true; }
    }

    weeks.push({ key, index: i, start, end, price, status, custom });
    cursor = addDays(cursor, 7);
  }
  return weeks;
}

// Group weeks by the month/year of their start date, preserving order.
function groupByMonth(weeks) {
  const groups = [];
  let current = null;
  for (const w of weeks) {
    const label = `${MONTHS[w.start.getMonth()]} ${w.start.getFullYear()}`;
    if (!current || current.label !== label) {
      current = { label, month: w.start.getMonth(), year: w.start.getFullYear(), weeks: [] };
      groups.push(current);
    }
    current.weeks.push(w);
  }
  return groups;
}
