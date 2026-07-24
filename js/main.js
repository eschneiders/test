/* ============================================================================
   Public site behaviour — content injection, carousels, calendar, enquiry form.
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

/* --- content injection ----------------------------------------------------- */

function injectContent() {
  document.title = `${VILLA.name} — Luxury Algarve Villa`;
  document.querySelectorAll("[data-villa-name]").forEach(el => el.textContent = VILLA.name);
  document.querySelectorAll("[data-villa-tagline]").forEach(el => el.textContent = VILLA.tagline);
  document.querySelectorAll("[data-villa-location]").forEach(el => el.textContent = VILLA.locationShort);
  document.querySelectorAll("[data-villa-location-long]").forEach(el => el.textContent = VILLA.locationLong);

  // stats
  const stats = document.getElementById("stats");
  const items = [
    { num: VILLA.stats.bedrooms,  lab: "Bedrooms" },
    { num: VILLA.stats.bathrooms, lab: "Bathrooms" },
    { num: VILLA.stats.sleeps,    lab: "Sleeps" },
  ];
  stats.innerHTML = items.map(i => `<li><span class="num">${i.num}</span><span class="lab">${i.lab}</span></li>`).join("");

  // amenities
  document.getElementById("amenityGrid").innerHTML = AMENITIES.map(a => `
    <li class="amenity">
      <div class="ic">${ICONS[a.icon] || ""}</div>
      <h3>${a.title}</h3>
      <p>${a.text}</p>
    </li>`).join("");

  // highlights
  document.getElementById("highlights").innerHTML = HIGHLIGHTS.map(h => `
    <li><span class="place">${h.place}</span><span class="detail">${h.detail}</span></li>`).join("");

  // footer contact
  const fc = document.getElementById("footerContact");
  let contact = `<a href="mailto:${VILLA.ownerEmail}">${VILLA.ownerEmail}</a>`;
  if (VILLA.phone && !VILLA.phone.includes("000 000 000")) {
    contact += `<a href="tel:${VILLA.phone.replace(/\s/g,'')}">${VILLA.phone}</a>`;
  }
  fc.innerHTML = contact;

  document.getElementById("year").textContent = new Date().getFullYear();
}

/* --- placeholder / image slide markup -------------------------------------- */

function slideMarkup(slide, extraClass) {
  if (slide.image) {
    return `<div class="${extraClass}" style="background:url('${slide.image}') center/cover"></div>`;
  }
  return `<div class="${extraClass} ph" data-tone="${slide.tone}"><span class="ph-label">${slide.label}</span></div>`;
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

  const scrollTo = k => slides[k].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  dotEls.forEach((d, k) => d.addEventListener("click", () => scrollTo(k)));
  document.getElementById("galPrev").addEventListener("click", () => track.scrollBy({ left: -track.clientWidth * 0.7, behavior: "smooth" }));
  document.getElementById("galNext").addEventListener("click", () => track.scrollBy({ left: track.clientWidth * 0.7, behavior: "smooth" }));

  // sync active dot on scroll
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

/* --- availability calendar ------------------------------------------------- */

let selectedKey = null;

function initCalendar() {
  const weeks = buildWeeks();
  const groups = groupByMonth(weeks);
  const cal = document.getElementById("calendar");

  cal.innerHTML = groups.map(g => `
    <div class="cal-month">
      <h3>${g.label}</h3>
      <div class="cal-dow"><span>Sat</span><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span></div>
      ${g.weeks.map(w => weekMarkup(w, g.month)).join("")}
    </div>`).join("");

  // populate the enquiry dropdown with available weeks
  const sel = document.getElementById("fWeek");
  sel.innerHTML = `<option value="">Flexible / not sure yet</option>` +
    weeks.filter(w => w.status === "available")
         .map(w => `<option value="${w.key}">${weekLabel(w)} — ${money.format(w.price)}</option>`).join("");

  // wire clicks
  cal.querySelectorAll(".wk:not(.wk-booked)").forEach(btn => {
    btn.addEventListener("click", () => selectWeek(btn.dataset.key, weeks));
  });
}

function weekMarkup(w, monthIndex) {
  // 7 day cells starting at the week's Saturday
  let days = "";
  for (let d = 0; d < 7; d++) {
    const day = addDays(w.start, d);
    const out = day.getMonth() !== monthIndex ? " out" : "";
    days += `<span class="d${out}">${day.getDate()}</span>`;
  }
  const booked = w.status === "booked";
  return `
    <button class="wk ${booked ? "wk-booked" : ""}" data-key="${w.key}" ${booked ? "disabled" : ""}>
      <span class="wk-days">${days}</span>
      <span class="wk-meta">
        <span class="wk-price">${booked ? "" : money.format(w.price)}</span>
        <span class="wk-cta">${booked ? "Booked" : "Enquire"}</span>
      </span>
    </button>`;
}

function selectWeek(key, weeks) {
  selectedKey = key;
  const week = weeks.find(w => w.key === key);

  document.querySelectorAll(".wk").forEach(b => b.classList.toggle("wk-selected", b.dataset.key === key));

  const box = document.getElementById("selectedWeek");
  document.getElementById("selectedWeekText").textContent = `${weekLabel(week)} · ${money.format(week.price)}`;
  box.hidden = false;

  document.getElementById("fWeek").value = key;

  document.getElementById("enquire").scrollIntoView({ behavior: "smooth" });
}

function clearSelection() {
  selectedKey = null;
  document.querySelectorAll(".wk").forEach(b => b.classList.remove("wk-selected"));
  document.getElementById("selectedWeek").hidden = true;
  document.getElementById("fWeek").value = "";
}

/* --- enquiry form ---------------------------------------------------------- */

function initForm() {
  document.getElementById("clearWeek").addEventListener("click", clearSelection);

  document.getElementById("enquiryForm").addEventListener("submit", e => {
    e.preventDefault();
    const f = e.target;
    const name = f.name.value.trim();
    const email = f.email.value.trim();
    const guests = f.guests.value;
    const message = f.message.value.trim();
    const weekText = f.week.selectedOptions[0]?.text || "Flexible";

    const subject = `Booking enquiry — ${VILLA.name}`;
    const body =
      `Hello,\n\nI'd like to enquire about staying at ${VILLA.name}.\n\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Preferred week: ${weekText}\n` +
      `Guests: ${guests}\n\n` +
      `${message || "(no message)"}\n\n` +
      `Sent from the ${VILLA.name} website.`;

    window.location.href =
      `mailto:${VILLA.ownerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
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

/* --- testimonials ---------------------------------------------------------- */

function initTestimonials() {
  const wrap = document.getElementById("testimonials");
  wrap.innerHTML = TESTIMONIALS.map((t, i) => `
    <figure class="testimonial ${i === 0 ? "active" : ""}">
      <blockquote>“${t.quote}”</blockquote>
      <figcaption class="who">${t.name}</figcaption>
    </figure>`).join("");
  const items = [...wrap.children];
  if (items.length < 2) return;
  let i = 0;
  setInterval(() => {
    items[i].classList.remove("active");
    i = (i + 1) % items.length;
    items[i].classList.add("active");
  }, 6000);
}

/* --- boot ------------------------------------------------------------------ */

document.addEventListener("DOMContentLoaded", () => {
  injectContent();
  initHero();
  initGallery();
  initCalendar();
  initForm();
  initChrome();
  initTestimonials();
});
