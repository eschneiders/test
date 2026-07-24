/* ============================================================================
   Internationalisation — English, Portuguese, French, German.
   All visible UI text lives here (the villa name, email and prices stay in
   data.js). Dates and money are formatted per-locale via Intl, so month and
   weekday names are never hand-translated.
   ============================================================================ */

const LANGS = ["en", "pt", "fr", "de"];
const LANG_LABEL = { en: "EN", pt: "PT", fr: "FR", de: "DE" };
const LOCALE = { en: "en-GB", pt: "pt-PT", fr: "fr-FR", de: "de-DE" };
const LANG_KEY = "villa.lang";

const I18N = {
  en: {
    nav: { villa: "The Villa", gallery: "Gallery", availability: "Availability", location: "Location", enquire: "Enquire" },
    hero: { ctaCheck: "Check availability", ctaDiscover: "Discover the villa" },
    intro: {
      eyebrow: "The Villa",
      title: "An elegant escape on the Atlantic",
      lede: "Set among mature Mediterranean gardens with sweeping views over the bay, %NAME% is a refined family retreat where light-filled interiors open onto sun-drenched terraces. Every detail has been considered for a truly restful stay.",
    },
    stats: { bedrooms: "Bedrooms", bathrooms: "Bathrooms", sleeps: "Sleeps" },
    amenities: {
      eyebrow: "Comfort", title: "Thoughtfully appointed",
      pool:   { t: "Heated infinity pool",   d: "Private 12m pool overlooking the Atlantic." },
      sea:    { t: "Panoramic sea views",     d: "Uninterrupted views across the bay." },
      chef:   { t: "Chef's kitchen",          d: "Fully equipped, with optional private chef." },
      wifi:   { t: "Fast Wi-Fi",              d: "Fibre broadband throughout the house." },
      ac:     { t: "Air conditioning",        d: "Climate control in every bedroom." },
      car:    { t: "Private parking",         d: "Gated driveway for up to three cars." },
      garden: { t: "Landscaped gardens",      d: "Mature Mediterranean gardens & lawn." },
      beach:  { t: "5 min to the beach",      d: "A short stroll to Praia da Luz." },
    },
    gallery: { eyebrow: "Gallery", title: "A glimpse inside",
      captions: ["Pool & sun terrace","Open-plan living room","Master suite","Al fresco dining","Evening on the terrace","Designer kitchen"] },
    avail: {
      eyebrow: "Availability & Rates", title: "Choose your dates",
      sub: "Select your arrival and departure — stays are flexible, from any day to any day.",
      legendAvailable: "Available", legendBooked: "Booked", legendSelected: "Your stay",
      note: "Rates are per night for the whole villa. Prices shown are indicative; your final quote is confirmed by email.",
      checkIn: "Check-in", checkOut: "Check-out", pickPrompt: "Select your arrival date",
      pickCheckout: "Now choose your departure date", total: "Total", perNight: "per night",
      clear: "Clear dates", minStay: "Minimum stay: %N nights",
      unavailable: "Those dates include booked nights — please choose another range.",
      tooShort: "Minimum stay is %N nights — please extend your dates.",
      enquireBtn: "Enquire about these dates",
    },
    enquire: {
      eyebrow: "Booking", title: "Request your stay",
      sub: "Send an enquiry and we'll confirm availability and the final price by email.",
      selected: "Your stay",
      name: "Full name", email: "Email", dates: "Dates", guests: "Guests", message: "Message", optional: "(optional)",
      messagePh: "Tell us a little about your trip…", datesFlexible: "Flexible / not sure yet",
      submit: "Send enquiry", hint: "We'll reply by email to confirm availability and the final price.",
      successTitle: "Thank you — your enquiry is on its way",
      successText: "We've received your request and will be in touch by email shortly to confirm availability and pricing. We look forward to welcoming you.",
    },
    location: {
      eyebrow: "Location", title: "The Western Algarve",
      prose: "A tranquil setting of golden cliffs, hidden coves and whitewashed villages, yet moments from the restaurants and marina of historic Lagos.",
      map: "Map placeholder — add an embedded map here",
      highlights: [
        { p: "Praia da Luz beach", d: "5 min walk" },
        { p: "Lagos old town",     d: "12 min drive" },
        { p: "Championship golf",  d: "15 min drive" },
        { p: "Faro airport",       d: "1 hr drive" },
      ],
    },
    testimonials: { eyebrow: "Guest words", items: [
      { q: "The most beautiful place we have ever stayed. We are already planning our return.", w: "— A guest from London" },
      { q: "Impeccable in every detail. The views at sunset are simply unforgettable.", w: "— A family from Paris" },
      { q: "A true home from home, with every comfort you could wish for.", w: "— Guests from Berlin" },
    ]},
    footer: { rights: "All rights reserved.", ownerLogin: "Owner login" },
    night: { one: "night", other: "nights" },
  },

  pt: {
    nav: { villa: "A Casa", gallery: "Galeria", availability: "Disponibilidade", location: "Localização", enquire: "Reservar" },
    hero: { ctaCheck: "Ver disponibilidade", ctaDiscover: "Descobrir a casa" },
    intro: {
      eyebrow: "A Casa",
      title: "Um refúgio elegante sobre o Atlântico",
      lede: "Rodeada por jardins mediterrânicos maduros e com vistas amplas sobre a baía, a %NAME% é um refúgio familiar requintado, onde interiores cheios de luz se abrem para terraços banhados pelo sol. Cada detalhe foi pensado para uma estadia verdadeiramente tranquila.",
    },
    stats: { bedrooms: "Quartos", bathrooms: "Casas de banho", sleeps: "Capacidade" },
    amenities: {
      eyebrow: "Conforto", title: "Pensada ao pormenor",
      pool:   { t: "Piscina infinita aquecida", d: "Piscina privada de 12m com vista para o Atlântico." },
      sea:    { t: "Vistas panorâmicas de mar",  d: "Vistas desafogadas sobre a baía." },
      chef:   { t: "Cozinha de chef",            d: "Totalmente equipada, com chef privado opcional." },
      wifi:   { t: "Wi-Fi rápido",               d: "Internet por fibra em toda a casa." },
      ac:     { t: "Ar condicionado",            d: "Climatização em todos os quartos." },
      car:    { t: "Estacionamento privado",     d: "Entrada fechada para até três carros." },
      garden: { t: "Jardins ajardinados",        d: "Jardins mediterrânicos maduros e relvado." },
      beach:  { t: "5 min da praia",             d: "A poucos passos da Praia da Luz." },
    },
    gallery: { eyebrow: "Galeria", title: "Um olhar pelo interior",
      captions: ["Piscina e terraço","Sala de estar","Suite principal","Refeições ao ar livre","Fim de tarde no terraço","Cozinha de design"] },
    avail: {
      eyebrow: "Disponibilidade e Preços", title: "Escolha as suas datas",
      sub: "Selecione a chegada e a partida — as estadias são flexíveis, de qualquer dia para qualquer dia.",
      legendAvailable: "Disponível", legendBooked: "Reservado", legendSelected: "A sua estadia",
      note: "Os preços são por noite para toda a casa. Os valores apresentados são indicativos; o orçamento final é confirmado por email.",
      checkIn: "Chegada", checkOut: "Partida", pickPrompt: "Selecione a data de chegada",
      pickCheckout: "Agora escolha a data de partida", total: "Total", perNight: "por noite",
      clear: "Limpar datas", minStay: "Estadia mínima: %N noites",
      unavailable: "Essas datas incluem noites reservadas — escolha outro período.",
      tooShort: "A estadia mínima é de %N noites — alargue as suas datas.",
      enquireBtn: "Pedir estas datas",
    },
    enquire: {
      eyebrow: "Reserva", title: "Peça a sua estadia",
      sub: "Envie um pedido e confirmaremos a disponibilidade e o preço final por email.",
      selected: "A sua estadia",
      name: "Nome completo", email: "Email", dates: "Datas", guests: "Hóspedes", message: "Mensagem", optional: "(opcional)",
      messagePh: "Conte-nos um pouco sobre a sua viagem…", datesFlexible: "Flexível / ainda não sei",
      submit: "Enviar pedido", hint: "Responderemos por email para confirmar a disponibilidade e o preço final.",
      successTitle: "Obrigado — o seu pedido está a caminho",
      successText: "Recebemos o seu pedido e entraremos em contacto por email em breve para confirmar a disponibilidade e o preço. Esperamos poder recebê-lo.",
    },
    location: {
      eyebrow: "Localização", title: "O Algarve Ocidental",
      prose: "Um cenário tranquilo de falésias douradas, enseadas escondidas e aldeias caiadas de branco, a poucos minutos dos restaurantes e da marina da histórica Lagos.",
      map: "Espaço para mapa — adicione aqui um mapa incorporado",
      highlights: [
        { p: "Praia da Luz",                d: "5 min a pé" },
        { p: "Centro histórico de Lagos",   d: "12 min de carro" },
        { p: "Golfe de campeonato",         d: "15 min de carro" },
        { p: "Aeroporto de Faro",           d: "1 h de carro" },
      ],
    },
    testimonials: { eyebrow: "Palavras dos hóspedes", items: [
      { q: "O sítio mais bonito onde já ficámos. Já estamos a planear voltar.", w: "— Um hóspede de Londres" },
      { q: "Impecável em cada detalhe. As vistas ao pôr do sol são simplesmente inesquecíveis.", w: "— Uma família de Paris" },
      { q: "Uma verdadeira casa longe de casa, com todo o conforto que se possa desejar.", w: "— Hóspedes de Berlim" },
    ]},
    footer: { rights: "Todos os direitos reservados.", ownerLogin: "Área do proprietário" },
    night: { one: "noite", other: "noites" },
  },

  fr: {
    nav: { villa: "La Villa", gallery: "Galerie", availability: "Disponibilités", location: "Emplacement", enquire: "Réserver" },
    hero: { ctaCheck: "Voir les disponibilités", ctaDiscover: "Découvrir la villa" },
    intro: {
      eyebrow: "La Villa",
      title: "Une élégante évasion sur l'Atlantique",
      lede: "Nichée dans des jardins méditerranéens matures offrant une vue panoramique sur la baie, %NAME% est un refuge familial raffiné où des intérieurs baignés de lumière s'ouvrent sur des terrasses ensoleillées. Chaque détail a été pensé pour un séjour véritablement reposant.",
    },
    stats: { bedrooms: "Chambres", bathrooms: "Salles de bain", sleeps: "Couchages" },
    amenities: {
      eyebrow: "Confort", title: "Aménagée avec soin",
      pool:   { t: "Piscine à débordement chauffée", d: "Piscine privée de 12 m surplombant l'Atlantique." },
      sea:    { t: "Vue mer panoramique",            d: "Une vue dégagée sur toute la baie." },
      chef:   { t: "Cuisine de chef",                d: "Entièrement équipée, chef privé en option." },
      wifi:   { t: "Wi-Fi rapide",                   d: "Fibre optique dans toute la maison." },
      ac:     { t: "Climatisation",                  d: "Climatisation dans chaque chambre." },
      car:    { t: "Parking privé",                  d: "Allée fermée pour jusqu'à trois voitures." },
      garden: { t: "Jardins paysagers",              d: "Jardins méditerranéens matures et pelouse." },
      beach:  { t: "5 min de la plage",              d: "À quelques pas de Praia da Luz." },
    },
    gallery: { eyebrow: "Galerie", title: "Un aperçu de l'intérieur",
      captions: ["Piscine et terrasse","Salon ouvert","Suite parentale","Repas en plein air","Soirée sur la terrasse","Cuisine design"] },
    avail: {
      eyebrow: "Disponibilités et Tarifs", title: "Choisissez vos dates",
      sub: "Sélectionnez votre arrivée et votre départ — les séjours sont flexibles, de n'importe quel jour à n'importe quel jour.",
      legendAvailable: "Disponible", legendBooked: "Réservé", legendSelected: "Votre séjour",
      note: "Les tarifs sont par nuit pour toute la villa. Les prix indiqués sont indicatifs ; votre devis final est confirmé par e-mail.",
      checkIn: "Arrivée", checkOut: "Départ", pickPrompt: "Sélectionnez votre date d'arrivée",
      pickCheckout: "Choisissez maintenant votre date de départ", total: "Total", perNight: "par nuit",
      clear: "Effacer", minStay: "Séjour minimum : %N nuits",
      unavailable: "Ces dates comprennent des nuits déjà réservées — veuillez choisir une autre période.",
      tooShort: "Le séjour minimum est de %N nuits — veuillez prolonger vos dates.",
      enquireBtn: "Demander ces dates",
    },
    enquire: {
      eyebrow: "Réservation", title: "Demandez votre séjour",
      sub: "Envoyez une demande et nous confirmerons la disponibilité et le prix final par e-mail.",
      selected: "Votre séjour",
      name: "Nom complet", email: "E-mail", dates: "Dates", guests: "Voyageurs", message: "Message", optional: "(facultatif)",
      messagePh: "Parlez-nous un peu de votre voyage…", datesFlexible: "Flexible / pas encore sûr",
      submit: "Envoyer la demande", hint: "Nous répondrons par e-mail pour confirmer la disponibilité et le prix final.",
      successTitle: "Merci — votre demande est en route",
      successText: "Nous avons bien reçu votre demande et vous contacterons par e-mail sous peu pour confirmer la disponibilité et le tarif. Au plaisir de vous accueillir.",
    },
    location: {
      eyebrow: "Emplacement", title: "L'Algarve occidental",
      prose: "Un cadre paisible de falaises dorées, de criques cachées et de villages blanchis à la chaux, à quelques minutes des restaurants et de la marina de la vieille ville de Lagos.",
      map: "Emplacement de la carte — ajoutez une carte intégrée ici",
      highlights: [
        { p: "Plage de Praia da Luz",   d: "5 min à pied" },
        { p: "Vieille ville de Lagos",  d: "12 min en voiture" },
        { p: "Golf de championnat",     d: "15 min en voiture" },
        { p: "Aéroport de Faro",        d: "1 h en voiture" },
      ],
    },
    testimonials: { eyebrow: "Avis des voyageurs", items: [
      { q: "Le plus bel endroit où nous ayons séjourné. Nous planifions déjà notre retour.", w: "— Un voyageur de Londres" },
      { q: "Impeccable dans les moindres détails. Les vues au coucher du soleil sont tout simplement inoubliables.", w: "— Une famille de Paris" },
      { q: "Un véritable second chez-soi, avec tout le confort que l'on peut souhaiter.", w: "— Des voyageurs de Berlin" },
    ]},
    footer: { rights: "Tous droits réservés.", ownerLogin: "Espace propriétaire" },
    night: { one: "nuit", other: "nuits" },
  },

  de: {
    nav: { villa: "Die Villa", gallery: "Galerie", availability: "Verfügbarkeit", location: "Lage", enquire: "Anfragen" },
    hero: { ctaCheck: "Verfügbarkeit prüfen", ctaDiscover: "Die Villa entdecken" },
    intro: {
      eyebrow: "Die Villa",
      title: "Ein elegantes Refugium am Atlantik",
      lede: "Eingebettet in gewachsene mediterrane Gärten mit weitem Blick über die Bucht ist %NAME% ein raffiniertes Familienrefugium, in dem lichtdurchflutete Innenräume auf sonnenverwöhnte Terrassen münden. Jedes Detail wurde für einen wahrhaft erholsamen Aufenthalt bedacht.",
    },
    stats: { bedrooms: "Schlafzimmer", bathrooms: "Badezimmer", sleeps: "Schlafplätze" },
    amenities: {
      eyebrow: "Komfort", title: "Mit Bedacht ausgestattet",
      pool:   { t: "Beheizter Infinity-Pool", d: "Privater 12-m-Pool mit Blick auf den Atlantik." },
      sea:    { t: "Panorama-Meerblick",       d: "Ungehinderter Blick über die Bucht." },
      chef:   { t: "Chefküche",                d: "Voll ausgestattet, auf Wunsch mit Privatkoch." },
      wifi:   { t: "Schnelles WLAN",           d: "Glasfaser-Internet im ganzen Haus." },
      ac:     { t: "Klimaanlage",              d: "Klimatisierung in jedem Schlafzimmer." },
      car:    { t: "Privatparkplatz",          d: "Abschließbare Einfahrt für bis zu drei Autos." },
      garden: { t: "Angelegte Gärten",         d: "Gewachsene mediterrane Gärten & Rasen." },
      beach:  { t: "5 Min. zum Strand",        d: "Ein kurzer Spaziergang zur Praia da Luz." },
    },
    gallery: { eyebrow: "Galerie", title: "Ein Blick ins Innere",
      captions: ["Pool & Sonnenterrasse","Offener Wohnraum","Master-Suite","Essen im Freien","Abend auf der Terrasse","Designerküche"] },
    avail: {
      eyebrow: "Verfügbarkeit & Preise", title: "Wählen Sie Ihre Daten",
      sub: "Wählen Sie An- und Abreise — Aufenthalte sind flexibel, von jedem Tag zu jedem Tag.",
      legendAvailable: "Verfügbar", legendBooked: "Belegt", legendSelected: "Ihr Aufenthalt",
      note: "Die Preise gelten pro Nacht für die gesamte Villa. Die angezeigten Preise sind Richtwerte; Ihr endgültiges Angebot wird per E-Mail bestätigt.",
      checkIn: "Anreise", checkOut: "Abreise", pickPrompt: "Wählen Sie Ihr Anreisedatum",
      pickCheckout: "Wählen Sie nun Ihr Abreisedatum", total: "Gesamt", perNight: "pro Nacht",
      clear: "Löschen", minStay: "Mindestaufenthalt: %N Nächte",
      unavailable: "Dieser Zeitraum enthält belegte Nächte — bitte wählen Sie einen anderen.",
      tooShort: "Der Mindestaufenthalt beträgt %N Nächte — bitte verlängern Sie Ihren Zeitraum.",
      enquireBtn: "Diese Daten anfragen",
    },
    enquire: {
      eyebrow: "Buchung", title: "Ihren Aufenthalt anfragen",
      sub: "Senden Sie eine Anfrage und wir bestätigen Verfügbarkeit und Endpreis per E-Mail.",
      selected: "Ihr Aufenthalt",
      name: "Vollständiger Name", email: "E-Mail", dates: "Zeitraum", guests: "Gäste", message: "Nachricht", optional: "(optional)",
      messagePh: "Erzählen Sie uns kurz von Ihrer Reise…", datesFlexible: "Flexibel / noch unsicher",
      submit: "Anfrage senden", hint: "Wir antworten per E-Mail, um Verfügbarkeit und Endpreis zu bestätigen.",
      successTitle: "Danke — Ihre Anfrage ist unterwegs",
      successText: "Wir haben Ihre Anfrage erhalten und melden uns in Kürze per E-Mail, um Verfügbarkeit und Preis zu bestätigen. Wir freuen uns auf Sie.",
    },
    location: {
      eyebrow: "Lage", title: "Die westliche Algarve",
      prose: "Eine ruhige Kulisse aus goldenen Klippen, versteckten Buchten und weiß getünchten Dörfern – und doch nur Minuten von den Restaurants und dem Yachthafen des historischen Lagos entfernt.",
      map: "Kartenplatzhalter — hier eine eingebettete Karte einfügen",
      highlights: [
        { p: "Strand Praia da Luz",   d: "5 Min. zu Fuß" },
        { p: "Altstadt von Lagos",    d: "12 Min. mit dem Auto" },
        { p: "Championship-Golf",     d: "15 Min. mit dem Auto" },
        { p: "Flughafen Faro",        d: "1 Std. mit dem Auto" },
      ],
    },
    testimonials: { eyebrow: "Gästestimmen", items: [
      { q: "Der schönste Ort, an dem wir je übernachtet haben. Wir planen bereits unsere Rückkehr.", w: "— Ein Gast aus London" },
      { q: "In jedem Detail makellos. Die Aussicht bei Sonnenuntergang ist einfach unvergesslich.", w: "— Eine Familie aus Paris" },
      { q: "Ein wahres Zuhause fern von Zuhause, mit allem Komfort, den man sich wünschen kann.", w: "— Gäste aus Berlin" },
    ]},
    footer: { rights: "Alle Rechte vorbehalten.", ownerLogin: "Eigentümer-Login" },
    night: { one: "Nacht", other: "Nächte" },
  },
};

/* --- language state -------------------------------------------------------- */

function getLang() {
  const saved = localStorage.getItem(LANG_KEY);
  if (saved && LANGS.includes(saved)) return saved;
  const nav = (navigator.language || "en").slice(0, 2).toLowerCase();
  return LANGS.includes(nav) ? nav : "en";
}

function setLang(lang) {
  if (!LANGS.includes(lang)) return;
  localStorage.setItem(LANG_KEY, lang);
  document.documentElement.lang = lang;
}

// Dot-path lookup: t("avail.title"). Returns "" if missing.
function t(path, lang = getLang()) {
  return path.split(".").reduce((o, k) => (o == null ? o : o[k]), I18N[lang]) ?? "";
}

// Locale-aware euro formatter for the current language.
function moneyFmt(lang = getLang()) {
  return new Intl.NumberFormat(LOCALE[lang], { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

// "3 nights" / "1 night" / "3 Nächte" …
function nights(n, lang = getLang()) {
  const w = n === 1 ? t("night.one", lang) : t("night.other", lang);
  return `${n} ${w}`;
}
