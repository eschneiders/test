/* ============================================================================
   Public site behaviour — i18n, carousels, flexible date-range picker,
   live price quote, and the enquiry form.
   ============================================================================ */

/* --- tiny line-icon set for amenities -------------------------------------- */
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

let LANG = getLang();
let sel = { checkIn: null, checkOut: null };   // Date objects
let hoverKey = null;

/* --- boot ------------------------------------------------------------------ */

document.addEventListener("DOMContentLoaded", () => {
  setLang(LANG);
  buildLangSwitch();
  initHero();
  initGallery();
  initCalendarEvents();
  initChrome();
  initForm();
  initTestimonialRotation();
  renderAll();
});

/* --- render everything for the current language ---------------------------- */

function renderAll() {
  applyStatic();
  renderStats();
  renderAmenities();
  renderHighlights();
  renderTestimonials();
  setGalleryCaptions();
  renderFooterContact();
  renderCalendar();
  updateSelectionOutputs();
}

function applyStatic() {
  document.documentElement.lang = LANG;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const v = t(el.getAttribute("data-i18n"));
    if (v) el.textContent = v;
  });
  document.querySelectorAll("[data-villa-name]").forEach(el => el.textContent = VILLA.name);
  document.querySelectorAll("[data-villa-location]").forEach(el => el.textContent = VILLA.locationShort);
  document.querySelectorAll("[data-villa-location-long]").forEach(el => el.textContent = VILLA.locationLong);

  document.getElementById("introLede").textContent = t("intro.lede").replace("%NAME%", VILLA.name);
  const msg = document.getElementById("fMessage");
  if (msg) msg.placeholder = t("enquire.messagePh");

  document.title = `${VILLA.name} — Luxury Algarve Villa`;
  document.getElementById("year").textContent = new Date().getFullYear();
}

/* --- language switch ------------------------------------------------------- */

function buildLangSwitch() {
  const box = document.getElementById("langSwitch");
  box.innerHTML = LANGS.map(l =>
    `<button type="button" data-lang="${l}" class="${l === LANG ? "active" : ""}">${LANG_LABEL[l]}</button>`).join("");
  box.querySelectorAll("button").forEach(b => b.addEventListener("click", () => changeLang(b.dataset.lang)));
}

function changeLang(l) {
  if (l === LANG) return;
  LANG = l;
  setLang(l);
  document.querySelectorAll("#langSwitch button").forEach(b => b.classList.toggle("active", b.dataset.lang === l));
  renderAll();
}

/* --- content blocks -------------------------------------------------------- */

function renderStats() {
  const items = [
    { num: VILLA.stats.bedrooms,  lab: t("stats.bedrooms") },
    { num: VILLA.stats.bathrooms, lab: t("stats.bathrooms") },
    { num: VILLA.stats.sleeps,    lab: t("stats.sleeps") },
  ];
  document.getElementById("stats").innerHTML =
    items.map(i => `<li><span class="num">${i.num}</span><span class="lab">${i.lab}</span></li>`).join("");
}

function renderAmenities() {
  document.getElementById("amenityGrid").innerHTML = AMENITY_KEYS.map(key => `
    <li class="amenity">
      <div class="ic">${ICONS[key] || ""}</div>
      <h3>${t("amenities." + key + ".t")}</h3>
      <p>${t("amenities." + key + ".d")}</p>
    </li>`).join("");
}

function renderHighlights() {
  const hl = t("location.highlights") || [];
  document.getElementById("highlights").innerHTML = hl.map(h => `
    <li><span class="place">${h.p}</span><span class="detail">${h.d}</span></li>`).join("");
}

function renderTestimonials() {
  const wrap = document.getElementById("testimonials");
  const items = t("testimonials.items") || [];
  wrap.innerHTML = items.map((it, i) => `
    <figure class="testimonial ${i === 0 ? "active" : ""}">
      <blockquote>“${it.q}”</blockquote>
      <figcaption class="who">${it.w}</figcaption>
    </figure>`).join("");
}

function renderFooterContact() {
  let html = `<a href="mailto:${VILLA.ownerEmail}">${VILLA.ownerEmail}</a>`;
  if (VILLA.phone && !VILLA.phone.includes("000 000 000")) {
    html += `<a href="tel:${VILLA.phone.replace(/\s/g,"")}">${VILLA.phone}</a>`;
  }
  document.getElementById("footerContact").innerHTML = html;
}

/* --- placeholder / image slide markup -------------------------------------- */

function slideMarkup(slide, extraClass, label) {
  if (slide.image) {
    return `<div class="${extraClass}" style="background:url('${slide.image}') center/cover"></div>`;
  }
  return `<div class="${extraClass} ph" data-tone="${slide.tone}"><span class="ph-label">${label || ""}</span></div>`;
}

/* --- hero carousel --------------------------------------------------------- */

function initHero() {
  const track = document.getElementById("heroCarousel");
  const dots = document.getElementById("heroDots");
  track.innerHTML = HERO_SLIDES.map(s => slideMarkup(s, "hero-slide")).join("");
  const slides = [...track.children];
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

/* --- gallery carousel ------------------------------------------------------ */

function initGallery() {
  const track = document.getElementById("galleryTrack");
  const dots = document.getElementById("galleryDots");
  track.innerHTML = GALLERY_SLIDES.map(s => slideMarkup(s, "gc-slide")).join("");
  const slides = [...track.children];
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

function setGalleryCaptions() {
  const caps = t("gallery.captions") || [];
  document.querySelectorAll("#galleryTrack .gc-slide .ph-label").forEach((el, i) => {
    if (caps[i]) el.textContent = caps[i];
  });
}

/* --- date-range picker ----------------------------------------------------- */

function weekdayHeaders() {
  const loc = LOCALE[LANG] || "en-GB";
  const fmt = new Intl.DateTimeFormat(loc, { weekday: "short" });
  const monday = new Date(2024, 0, 1);                 // a Monday
  return [...Array(7)].map((_, i) => fmt.format(addDays(monday, i)));
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

// Delegated calendar interactions (attached once).
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

  // Starting a fresh selection (nothing chosen, or a full range already set).
  if (!sel.checkIn || (sel.checkIn && sel.checkOut)) {
    sel = { checkIn: d, checkOut: null };
  } else {
    // We have a check-in and are choosing the check-out.
    if (d <= sel.checkIn) {
      sel = { checkIn: d, checkOut: null };            // restart earlier
    } else if (isRangeAvailable(sel.checkIn, d, state)) {
      sel.checkOut = d;
    } else {
      flashCalMessage(t("avail.unavailable"));         // range crosses booked nights
      sel = { checkIn: d, checkOut: null };
    }
  }
  hoverKey = null;
  paintSelection();
  updateSelectionOutputs();
}

// Preview end date while hovering during the check-out phase (if valid).
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
  const prev = q.dataset.flash;
  q.dataset.flash = "1";
  const note = document.createElement("div");
  note.className = "quote-flash";
  note.textContent = text;
  q.prepend(note);
  setTimeout(() => { note.remove(); delete q.dataset.flash; }, 3200);
  if (prev) return;
}

/* --- quote panel + form outputs -------------------------------------------- */

function updateSelectionOutputs() {
  const state = loadState();
  const fmt = moneyFmt(LANG);
  const q = document.getElementById("quote");
  const belowMin = sel.checkIn && sel.checkOut && quote(sel.checkIn, sel.checkOut, state).nights < VILLA.minNights;

  // Quote panel
  if (!sel.checkIn) {
    q.innerHTML = `<div class="quote-empty">
      <span class="quote-ic">📅</span>
      <p>${t("avail.pickPrompt")}</p>
      <p class="quote-min">${t("avail.minStay").replace("%N", VILLA.minNights)}</p>
    </div>`;
  } else if (!sel.checkOut) {
    q.innerHTML = `
      <div class="quote-line"><span>${t("avail.checkIn")}</span><strong>${fmtDate(sel.checkIn, LANG)}</strong></div>
      <p class="quote-prompt">${t("avail.pickCheckout")}</p>
      ${clearBtn()}`;
  } else {
    const { nights: n, total, avg } = quote(sel.checkIn, sel.checkOut, state);
    q.innerHTML = `
      <div class="quote-line"><span>${t("avail.checkIn")}</span><strong>${fmtDate(sel.checkIn, LANG)}</strong></div>
      <div class="quote-line"><span>${t("avail.checkOut")}</span><strong>${fmtDate(sel.checkOut, LANG)}</strong></div>
      <div class="quote-line quote-nights"><span>${nights(n, LANG)}</span><span>${fmt.format(avg)} · ${t("avail.perNight")}</span></div>
      <div class="quote-total"><span>${t("avail.total")}</span><strong>${fmt.format(total)}</strong></div>
      ${belowMin ? `<p class="quote-warn">${t("avail.tooShort").replace("%N", VILLA.minNights)}</p>` : ""}
      <button type="button" class="btn btn-primary btn-block" id="quoteEnquire" ${belowMin ? "disabled" : ""}>${t("avail.enquireBtn")}</button>
      ${clearBtn()}`;
    if (!belowMin) {
      document.getElementById("quoteEnquire").addEventListener("click", () =>
        document.getElementById("enquire").scrollIntoView({ behavior: "smooth" }));
    }
  }
  const clr = document.getElementById("clearDates");
  if (clr) clr.addEventListener("click", clearSelection);

  // Enquiry form fields
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
    display.textContent = t("enquire.datesFlexible");
    display.classList.remove("has-dates");
    ["fCheckIn","fCheckOut","fNights","fTotal"].forEach(id => setHidden(id, ""));
    setHidden("fDates", t("enquire.datesFlexible"));
  }
}

function clearBtn() {
  return `<button type="button" class="quote-clear" id="clearDates">${t("avail.clear")}</button>`;
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
  const dates = val("fDates") || t("enquire.datesFlexible");
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
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("open"); toggle.classList.remove("open");
    toggle.setAttribute("aria-expanded", false);
  }));
}

/* --- testimonials rotation (reads current DOM each tick) ------------------- */

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
