/* ============================================================================
   Owner panel — manage nightly rates, blocked date ranges and custom pricing.
   State is shared with the public site via calendar.js (loadState/saveState).
   Edits persist in this browser; "Publish" exports them for the live site.
   ============================================================================ */

const SESSION_KEY = "villa.admin.session";

/* --- login ----------------------------------------------------------------- */

function initLogin() {
  document.querySelectorAll("[data-villa-name]").forEach(el => el.textContent = VILLA.name);
  if (sessionStorage.getItem(SESSION_KEY) === "1") return openPanel();

  document.getElementById("loginForm").addEventListener("submit", e => {
    e.preventDefault();
    if (document.getElementById("pw").value === VILLA.adminPassword) {
      sessionStorage.setItem(SESSION_KEY, "1");
      openPanel();
    } else {
      document.getElementById("loginError").hidden = false;
    }
  });
}

function openPanel() {
  document.getElementById("loginScreen").hidden = true;
  document.getElementById("panel").hidden = false;
  initPanel();
}

/* --- state helpers --------------------------------------------------------- */

// Until the owner saves anything, start from a clean slate (no demo bookings).
function currentState() {
  if (hasOwnerData()) return loadState();
  return { bookedRanges: [], priceRanges: [], nightlyRates: { ...VILLA.nightlyRates } };
}

function commit(state) {
  // normalise: sort ranges by start
  state.bookedRanges.sort((a, b) => a.start.localeCompare(b.start));
  state.priceRanges.sort((a, b) => a.start.localeCompare(b.start));
  saveState(state);
  renderAll();
}

/* --- panel ----------------------------------------------------------------- */

function initPanel() {
  document.getElementById("logoutBtn").addEventListener("click", () => {
    sessionStorage.removeItem(SESSION_KEY);
    location.reload();
  });

  // nightly rates
  const rateIds = { high: "rateHigh", mid: "rateMid", low: "rateLow" };
  Object.entries(rateIds).forEach(([k, id]) => {
    document.getElementById(id).addEventListener("input", e => {
      const v = Number(e.target.value);
      if (Number.isNaN(v) || v <= 0) return;
      const s = currentState();
      s.nightlyRates[k] = v;
      commit(s);
    });
  });

  document.getElementById("blockAdd").addEventListener("click", addBlock);
  document.getElementById("priceAdd").addEventListener("click", addPrice);

  document.getElementById("whyLink").addEventListener("click", e => {
    e.preventDefault();
    const t = document.getElementById("whyText"); t.hidden = !t.hidden;
  });
  document.getElementById("copyBtn").addEventListener("click", copyData);
  document.getElementById("downloadBtn").addEventListener("click", downloadData);
  document.getElementById("resetBtn").addEventListener("click", resetAll);

  // sensible date input minimums (today)
  const todayKey = keyOf(today());
  ["blockFrom","blockTo","priceFrom","priceTo"].forEach(id => document.getElementById(id).min = todayKey);

  renderAll();
}

function renderAll() {
  const s = currentState();
  document.getElementById("rateHigh").value = s.nightlyRates.high;
  document.getElementById("rateMid").value  = s.nightlyRates.mid;
  document.getElementById("rateLow").value  = s.nightlyRates.low;
  renderBookedList(s);
  renderPriceList(s);
  renderPreview(s);
  document.getElementById("publishOut").value = JSON.stringify(s, null, 2);
}

/* --- blocked ranges -------------------------------------------------------- */

function addBlock() {
  const from = document.getElementById("blockFrom").value;
  const to   = document.getElementById("blockTo").value;
  const err  = document.getElementById("blockError");
  if (!from || !to) return showErr(err, "Please choose both dates.");
  if (to <= from)   return showErr(err, "The checkout date must be after the first night.");
  err.hidden = true;

  const s = currentState();
  s.bookedRanges.push({ start: from, end: to });
  commit(s);
  document.getElementById("blockFrom").value = "";
  document.getElementById("blockTo").value = "";
}

function renderBookedList(s) {
  const list = document.getElementById("bookedList");
  if (!s.bookedRanges.length) { list.innerHTML = `<li class="range-empty">No blocked dates yet.</li>`; return; }
  list.innerHTML = s.bookedRanges.map((r, i) => {
    const n = daysBetween(parseKey(r.start), parseKey(r.end));
    return `<li>
      <span>${fmtDate(parseKey(r.start))} → ${fmtDate(parseKey(r.end))} <em>(${n} night${n===1?"":"s"})</em></span>
      <button type="button" data-i="${i}" class="range-remove" aria-label="Remove">Unblock</button>
    </li>`;
  }).join("");
  list.querySelectorAll(".range-remove").forEach(b => b.addEventListener("click", () => {
    const s2 = currentState(); s2.bookedRanges.splice(Number(b.dataset.i), 1); commit(s2);
  }));
}

/* --- custom price ranges --------------------------------------------------- */

function addPrice() {
  const from = document.getElementById("priceFrom").value;
  const to   = document.getElementById("priceTo").value;
  const val  = Number(document.getElementById("priceVal").value);
  const err  = document.getElementById("priceError");
  if (!from || !to) return showErr(err, "Please choose both dates.");
  if (to <= from)   return showErr(err, "The end date must be after the start date.");
  if (!val || val <= 0) return showErr(err, "Please enter a nightly price.");
  err.hidden = true;

  const s = currentState();
  s.priceRanges.push({ start: from, end: to, nightly: val });
  commit(s);
  ["priceFrom","priceTo","priceVal"].forEach(id => document.getElementById(id).value = "");
}

function renderPriceList(s) {
  const list = document.getElementById("priceList");
  if (!s.priceRanges.length) { list.innerHTML = `<li class="range-empty">No custom prices — seasonal rates apply.</li>`; return; }
  const fmt = moneyFmt("en");
  list.innerHTML = s.priceRanges.map((r, i) => `
    <li>
      <span>${fmtDate(parseKey(r.start))} → ${fmtDate(parseKey(r.end))} · <strong>${fmt.format(r.nightly)}</strong> / night</span>
      <button type="button" data-i="${i}" class="range-remove" aria-label="Remove">Remove</button>
    </li>`).join("");
  list.querySelectorAll(".range-remove").forEach(b => b.addEventListener("click", () => {
    const s2 = currentState(); s2.priceRanges.splice(Number(b.dataset.i), 1); commit(s2);
  }));
}

/* --- read-only preview ----------------------------------------------------- */

function renderPreview(s) {
  const months = buildMonths(6);
  const wk = ["Mo","Tu","We","Th","Fr","Sa","Su"];
  document.getElementById("preview").innerHTML = months.map(mo => {
    const title = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(new Date(mo.year, mo.month, 1));
    const cells = mo.cells.map(c => {
      if (!c) return `<span class="day empty"></span>`;
      const booked = isNightBooked(c.date, s);
      const cls = c.past ? "is-past" : booked ? "is-booked" : "is-open";
      return `<span class="day ${cls}">${c.date.getDate()}</span>`;
    }).join("");
    return `<div class="cal-month"><h3>${title}</h3>
      <div class="cal-dow">${wk.map(d => `<span>${d}</span>`).join("")}</div>
      <div class="cal-grid">${cells}</div></div>`;
  }).join("");
}

/* --- publish / export ------------------------------------------------------ */

function copyData() {
  const ta = document.getElementById("publishOut");
  ta.select();
  navigator.clipboard.writeText(ta.value).then(
    () => flash("copyBtn", "Copied ✓"),
    () => flash("copyBtn", "Press Ctrl/Cmd+C")
  );
}

function downloadData() {
  const blob = new Blob([document.getElementById("publishOut").value], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "villa-availability.json"; a.click();
  URL.revokeObjectURL(url);
}

function resetAll() {
  if (!confirm("Reset all availability and price changes on this device?")) return;
  localStorage.removeItem(STATE_KEY);
  renderAll();
}

/* --- utilities ------------------------------------------------------------- */

function showErr(el, msg) { el.textContent = msg; el.hidden = false; }

function flash(id, text) {
  const btn = document.getElementById(id);
  const old = btn.textContent;
  btn.textContent = text;
  setTimeout(() => (btn.textContent = old), 1600);
}

document.addEventListener("DOMContentLoaded", initLogin);
