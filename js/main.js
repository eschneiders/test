/* ============================================================================
   Public site behaviour. Content and per-language text are baked into the HTML
   by build.js, so this script only ENHANCES the page: carousels, the flexible
   date-range picker, the live price quote and the enquiry form. The active
   language is read from <html lang>.
   ============================================================================ */

let LANG = document.documentElement.lang || "en";
let sel = { checkIn: null, checkOut: null };   // Date objects
let hoverKey = null;

document.addEventListener("DOMContentLoaded", () => {
  initHero();
  initGallery();
  initCalendarEvents();
  initChrome();
  initForm();
  initTestimonialRotation();
  renderCalendar();
  updateSelectionOutputs();
});

/* --- hero carousel (enhances baked slides) --------------------------------- */

function initHero() {
  const track = document.getElementById("heroCarousel");
  const slides = [...track.querySelectorAll(".hero-slide")];
  const dots = document.getElementById("heroDots");
  dots.innerHTML = slides.map((_, i) => `<button aria-label="Slide ${i+1}"></button>`).join("");
  const dotEls = [...dots.children];

  let i = 0;
  const show = n => {
    slides.forEach((s, k) => s.classList.toggle("active", k === n));
    dotEls.forEach((d, k) => d.classList.toggle("active", k === n));
    i = n;
  };
  dotEls.forEach((d, k) => d.addEventListener("click", () => show(k)));
  show(0);
  if (slides.length > 1) setInterval(() => show((i + 1) % slides.length), 5500);
}

/* --- gallery carousel (enhances baked slides) ------------------------------ */

function initGallery() {
  const track = document.getElementById("galleryTrack");
  const slides = [...track.querySelectorAll(".gc-slide")];
  const dots = document.getElementById("galleryDots");
  dots.innerHTML = slides.map((_, i) => `<button aria-label="Photo ${i+1}"></button>`).join("");
  const dotEls = [...dots.children];

  dotEls.forEach((d, k) => d.addEventListener("click", () =>
    slides[k].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })));
  document.getElementById("galPrev").addEventListener("click", () => track.scrollBy({ left: -track.clientWidth * 0.7, behavior: "smooth" }));
  document.getElementById("galNext").addEventListener("click", () => track.scrollBy({ left:  track.clientWidth * 0.7, behavior: "smooth" }));

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const k = slides.indexOf(e.target);
        dotEls.forEach((d, j) => d.classList.toggle("active", j === k));
      }
    });
  }, { root: track, threshold: 0.6 });
  slides.forEach(s => io.observe(s));
}

/* --- date-range picker ----------------------------------------------------- */

function weekdayHeaders() {
  const loc = LOCALE[LANG] || "en-GB";
  const fmt = new Intl.DateTimeFormat(loc, { weekday: "short" });
  const monday = new Date(2024, 0, 1);                 // a Monday
  // Trim to 3 chars so columns stay tidy across languages (e.g. pt "segunda").
  return [...Array(7)].map((_, i) => fmt.format(addDays(monday, i)).replace(/\.$/, "").slice(0, 3));
}

function renderCalendar() {
  const state = loadState();
  const months = buildMonths(VILLA.monthsAhead);
  const wk = weekdayHeaders();
  const loc = LOCALE[LANG] || "en-GB";

  document.getElementById("calendar").innerHTML = months.map(mo => {
    const title = new Intl.DateTimeFormat(loc, { month: "long", year: "numeric" }).format(new Date(mo.year, mo.month, 1));
    const cells = mo.cells.map(c => {
      if (!c) return `<span class="day empty"></span>`;
      const booked = isNightBooked(c.date, state);
      const open = !c.past && !booked;
      const cls = c.past ? "is-past" : booked ? "is-booked" : "is-open";
      return `<button type="button" class="day ${cls}" data-key="${c.key}" ${open ? "" : "disabled tabindex='-1'"}>${c.date.getDate()}</button>`;
    }).join("");
    return `<div class="cal-month"><h3>${title}</h3>
      <div class="cal-dow">${wk.map(d => `<span>${d}</span>`).join("")}</div>
      <div class="cal-grid">${cells}</div></div>`;
  }).join("");

  paintSelection();
}

function initCalendarEvents() {
  const cal = document.getElementById("calendar");
  cal.addEventListener("click", e => {
    const b = e.target.closest(".day.is-open");
    if (b) onDayClick(b.dataset.key);
  });
  cal.addEventListener("mouseover", e => {
    const b = e.target.closest(".day.is-open");
    if (b) { hoverKey = b.dataset.key; paintSelection(); }
  });
  cal.addEventListener("mouseleave", () => { hoverKey = null; paintSelection(); });
}

function onDayClick(key) {
  const d = parseKey(key);
  const state = loadState();

  if (!sel.checkIn || (sel.checkIn && sel.checkOut)) {
    sel = { checkIn: d, checkOut: null };
  } else {
    if (d <= sel.checkIn) {
      sel = { checkIn: d, checkOut: null };
    } else if (isRangeAvailable(sel.checkIn, d, state)) {
      sel.checkOut = d;
    } else {
      flashCalMessage(t("avail.unavailable", LANG));
      sel = { checkIn: d, checkOut: null };
    }
  }
  hoverKey = null;
  paintSelection();
  updateSelectionOutputs();
}

function previewOut(state) {
  if (sel.checkIn && !sel.checkOut && hoverKey) {
    const h = parseKey(hoverKey);
    if (h > sel.checkIn && isRangeAvailable(sel.checkIn, h, state)) return h;
  }
  return sel.checkOut;
}

function paintSelection() {
  const state = loadState();
  const inD = sel.checkIn;
  const outD = previewOut(state);
  document.querySelectorAll("#calendar .day[data-key]").forEach(el => {
    const d = parseKey(el.dataset.key);
    el.classList.toggle("is-checkin",  inD  && +d === +inD);
    el.classList.toggle("is-checkout", outD && +d === +outD);
    el.classList.toggle("in-range",    inD && outD && d > inD && d < outD);
  });
}

function flashCalMessage(text) {
  const q = document.getElementById("quote");
  const note = document.createElement("div");
  note.className = "quote-flash";
  note.textContent = text;
  q.prepend(note);
  setTimeout(() => note.remove(), 3200);
}

/* --- quote panel + form outputs -------------------------------------------- */

function updateSelectionOutputs() {
  const state = loadState();
  const fmt = moneyFmt(LANG);
  const q = document.getElementById("quote");
  const belowMin = sel.checkIn && sel.checkOut && quote(sel.checkIn, sel.checkOut, state).nights < VILLA.minNights;

  if (!sel.checkIn) {
    q.innerHTML = `<div class="quote-empty">
      <span class="quote-ic">📅</span>
      <p>${t("avail.pickPrompt", LANG)}</p>
      <p class="quote-min">${t("avail.minStay", LANG).replace("%N", VILLA.minNights)}</p>
    </div>`;
  } else if (!sel.checkOut) {
    q.innerHTML = `
      <div class="quote-line"><span>${t("avail.checkIn", LANG)}</span><strong>${fmtDate(sel.checkIn, LANG)}</strong></div>
      <p class="quote-prompt">${t("avail.pickCheckout", LANG)}</p>
      ${clearBtn()}`;
  } else {
    const { nights: n, total, avg } = quote(sel.checkIn, sel.checkOut, state);
    q.innerHTML = `
      <div class="quote-line"><span>${t("avail.checkIn", LANG)}</span><strong>${fmtDate(sel.checkIn, LANG)}</strong></div>
      <div class="quote-line"><span>${t("avail.checkOut", LANG)}</span><strong>${fmtDate(sel.checkOut, LANG)}</strong></div>
      <div class="quote-line quote-nights"><span>${nights(n, LANG)}</span><span>${fmt.format(avg)} · ${t("avail.perNight", LANG)}</span></div>
      <div class="quote-total"><span>${t("avail.total", LANG)}</span><strong>${fmt.format(total)}</strong></div>
      ${belowMin ? `<p class="quote-warn">${t("avail.tooShort", LANG).replace("%N", VILLA.minNights)}</p>` : ""}
      <button type="button" class="btn btn-primary btn-block" id="quoteEnquire" ${belowMin ? "disabled" : ""}>${t("avail.enquireBtn", LANG)}</button>
      ${clearBtn()}`;
    if (!belowMin) {
      document.getElementById("quoteEnquire").addEventListener("click", () =>
        document.getElementById("enquire").scrollIntoView({ behavior: "smooth" }));
    }
  }
  const clr = document.getElementById("clearDates");
  if (clr) clr.addEventListener("click", clearSelection);

  const display = document.getElementById("datesDisplay");
  const setHidden = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; };
  if (sel.checkIn && sel.checkOut && !belowMin) {
    const { nights: n, total } = quote(sel.checkIn, sel.checkOut, state);
    const readable = `${fmtRange(sel.checkIn, sel.checkOut, LANG)} · ${nights(n, LANG)}`;
    display.textContent = readable;
    display.classList.add("has-dates");
    setHidden("fCheckIn", keyOf(sel.checkIn));
    setHidden("fCheckOut", keyOf(sel.checkOut));
    setHidden("fNights", n);
    setHidden("fTotal", total);
    setHidden("fDates", `${readable} (~${fmt.format(total)})`);
  } else {
    display.textContent = t("enquire.datesFlexible", LANG);
    display.classList.remove("has-dates");
    ["fCheckIn","fCheckOut","fNights","fTotal"].forEach(id => setHidden(id, ""));
    setHidden("fDates", t("enquire.datesFlexible", LANG));
  }
}

function clearBtn() {
  return `<button type="button" class="quote-clear" id="clearDates">${t("avail.clear", LANG)}</button>`;
}

function clearSelection() {
  sel = { checkIn: null, checkOut: null };
  hoverKey = null;
  paintSelection();
  updateSelectionOutputs();
}

/* --- enquiry form ---------------------------------------------------------- */

function initForm() {
  const form = document.getElementById("enquiryForm");

  document.getElementById("datesDisplay").addEventListener("click", () =>
    document.getElementById("availability").scrollIntoView({ behavior: "smooth" }));

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const data = new FormData(form);
    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data).toString(),
      });
      if (!res.ok) throw new Error("form endpoint unavailable");
      showSuccess();
    } catch (err) {
      openMailto();
    }
  });
}

function showSuccess() {
  document.getElementById("enquiryForm").hidden = true;
  document.getElementById("formSuccess").hidden = false;
  document.getElementById("formSuccess").scrollIntoView({ behavior: "smooth", block: "center" });
}

function openMailto() {
  const val = id => document.getElementById(id).value.trim();
  const dates = val("fDates") || t("enquire.datesFlexible", LANG);
  const subject = `Booking enquiry — ${VILLA.name}`;
  const body =
    `Hello,\n\nI'd like to enquire about staying at ${VILLA.name}.\n\n` +
    `Name: ${val("fName")}\n` +
    `Email: ${val("fEmail")}\n` +
    `Dates: ${dates}\n` +
    `Guests: ${val("fGuests")}\n\n` +
    `${val("fMessage") || "(no message)"}\n\n` +
    `Sent from the ${VILLA.name} website.`;
  window.location.href =
    `mailto:${VILLA.ownerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/* --- header + mobile nav --------------------------------------------------- */

function initChrome() {
  const header = document.getElementById("siteHeader");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open);
  });
  nav.querySelectorAll("a").forEach(a => {
    if (a.closest(".lang-switch")) return;      // language links navigate away — leave them
    a.addEventListener("click", () => {
      nav.classList.remove("open"); toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", false);
    });
  });
}

/* --- testimonials rotation ------------------------------------------------- */

function initTestimonialRotation() {
  let i = 0;
  setInterval(() => {
    const items = [...document.querySelectorAll("#testimonials .testimonial")];
    if (items.length < 2) return;
    items[i % items.length]?.classList.remove("active");
    i = (i + 1) % items.length;
    items[i].classList.add("active");
  }, 6000);
}
