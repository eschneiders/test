/* ============================================================================
   Owner panel behaviour — login, editing weeks/rates, and publishing.
   Edits are stored in localStorage (this browser). "Publish" produces a data
   snapshot to paste into js/data.js so changes reach every visitor.
   ============================================================================ */

const SESSION_KEY = "villa.admin.session";

/* --- login ----------------------------------------------------------------- */

function initLogin() {
  document.querySelectorAll("[data-villa-name]").forEach(el => el.textContent = VILLA.name);

  // stay logged in for the browser session
  if (sessionStorage.getItem(SESSION_KEY) === "1") return openPanel();

  const form = document.getElementById("loginForm");
  form.addEventListener("submit", e => {
    e.preventDefault();
    const pw = document.getElementById("pw").value;
    if (pw === VILLA.adminPassword) {
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

/* --- panel ----------------------------------------------------------------- */

function initPanel() {
  document.getElementById("logoutBtn").addEventListener("click", () => {
    sessionStorage.removeItem(SESSION_KEY);
    location.reload();
  });

  // season rate inputs (preview only, on this device)
  const rates = { high: "rateHigh", mid: "rateMid", low: "rateLow" };
  Object.entries(rates).forEach(([k, id]) => {
    const input = document.getElementById(id);
    input.value = VILLA.seasonRates[k];
    input.addEventListener("input", () => {
      const v = Number(input.value);
      if (!Number.isNaN(v) && v > 0) { VILLA.seasonRates[k] = v; renderWeeks(); refreshPublish(); }
    });
  });

  document.getElementById("weekFilter").addEventListener("input", renderWeeks);

  // publish controls
  document.getElementById("whyLink").addEventListener("click", e => {
    e.preventDefault();
    const t = document.getElementById("whyText");
    t.hidden = !t.hidden;
  });
  document.getElementById("copyBtn").addEventListener("click", copyData);
  document.getElementById("downloadBtn").addEventListener("click", downloadData);
  document.getElementById("resetBtn").addEventListener("click", resetAll);

  renderWeeks();
  refreshPublish();
}

/* --- render editable weeks ------------------------------------------------- */

function renderWeeks() {
  const filter = document.getElementById("weekFilter").value.trim().toLowerCase();
  const weeks = buildWeeks();
  const groups = groupByMonth(weeks);
  const table = document.getElementById("weekTable");

  let html = "";
  for (const g of groups) {
    if (filter && !g.label.toLowerCase().includes(filter)) continue;
    html += `<div class="wk-month-head">${g.label}</div>`;
    for (const w of g.weeks) {
      const booked = w.status === "booked";
      html += `
        <div class="wk-row ${booked ? "is-booked" : ""}" data-key="${w.key}">
          <div class="wk-range">${weekLabel(w)}<span class="wk-key">${w.key}</span></div>
          <div class="price-input">
            <span>€</span>
            <input type="number" class="wk-price-in ${w.custom ? "custom" : ""}"
                   value="${w.custom ? w.price : ""}" placeholder="${defaultPriceFor(w.start)}" data-key="${w.key}" />
          </div>
          <div class="status-toggle" data-key="${w.key}">
            <button type="button" data-status="available" class="${!booked ? "on-avail" : ""}">Available</button>
            <button type="button" data-status="booked" class="${booked ? "on-booked" : ""}">Booked</button>
          </div>
        </div>`;
    }
  }
  table.innerHTML = html || `<p class="muted">No weeks match “${filter}”.</p>`;

  // wire price inputs
  table.querySelectorAll(".wk-price-in").forEach(inp => {
    inp.addEventListener("change", () => setPrice(inp.dataset.key, inp.value));
  });
  // wire status toggles
  table.querySelectorAll(".status-toggle button").forEach(btn => {
    btn.addEventListener("click", () => setStatus(btn.parentElement.dataset.key, btn.dataset.status));
  });
}

/* --- mutations ------------------------------------------------------------- */

function updateOverride(key, patch) {
  const o = loadOverrides();
  o[key] = { ...(o[key] || {}), ...patch };
  // prune empty entries
  if (o[key].price == null || o[key].price === "") delete o[key].price;
  if (!o[key].status) delete o[key].status;
  if (Object.keys(o[key]).length === 0) delete o[key];
  saveOverrides(o);
  renderWeeks();
  refreshPublish();
}

function setPrice(key, value) {
  const v = value === "" ? "" : Number(value);
  updateOverride(key, { price: v === "" || Number.isNaN(v) ? "" : v });
}

function setStatus(key, status) {
  updateOverride(key, { status });
}

/* --- publish / export ------------------------------------------------------ */

function exportSnapshot() {
  // Only export weeks that differ from defaults, keyed by date.
  return {
    seasonRates: { ...VILLA.seasonRates },
    overrides: loadOverrides(),
    exportedAt: new Date().toISOString(),
  };
}

function snapshotText() {
  const snap = exportSnapshot();
  return JSON.stringify(snap, null, 2);
}

function refreshPublish() {
  document.getElementById("publishOut").value = snapshotText();
}

function copyData() {
  const ta = document.getElementById("publishOut");
  ta.select();
  navigator.clipboard.writeText(ta.value).then(
    () => flash("copyBtn", "Copied ✓"),
    () => flash("copyBtn", "Press Ctrl/Cmd+C")
  );
}

function downloadData() {
  const blob = new Blob([snapshotText()], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "villa-availability.json";
  a.click();
  URL.revokeObjectURL(url);
}

function resetAll() {
  if (!confirm("Reset all availability and price changes on this device?")) return;
  localStorage.removeItem(OVERRIDE_KEY);
  renderWeeks();
  refreshPublish();
}

function flash(id, text) {
  const btn = document.getElementById(id);
  const old = btn.textContent;
  btn.textContent = text;
  setTimeout(() => (btn.textContent = old), 1600);
}

/* --- boot ------------------------------------------------------------------ */

document.addEventListener("DOMContentLoaded", initLogin);
