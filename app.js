const CATALOGS = ["Messier", "Caldwell", "NGC", "IC", "Other"];

const state = {
  photos: [],
  activeCatalog: "All",
  query: "",
};

const galleryEl = document.getElementById("gallery");
const emptyStateEl = document.getElementById("empty-state");
const resultCountEl = document.getElementById("result-count");
const searchEl = document.getElementById("search");
const filtersEl = document.getElementById("catalog-filters");

const lightboxEl = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxBadges = document.getElementById("lightbox-badges");
const lightboxMeta = document.getElementById("lightbox-meta");
const lightboxNotes = document.getElementById("lightbox-notes");

init();

async function init() {
  try {
    const res = await fetch("data/photos.json");
    state.photos = await res.json();
  } catch (err) {
    console.error("Failed to load data/photos.json", err);
    state.photos = [];
  }
  renderFilters();
  render();

  searchEl.addEventListener("input", (e) => {
    state.query = e.target.value.trim().toLowerCase();
    render();
  });

  document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
  lightboxEl.querySelector(".lightbox-backdrop").addEventListener("click", closeLightbox);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
}

function renderFilters() {
  const present = new Set(state.photos.map((p) => p.catalog).filter(Boolean));
  const catalogs = CATALOGS.filter((c) => present.has(c)).concat(
    [...present].filter((c) => !CATALOGS.includes(c))
  );

  filtersEl.innerHTML = "";
  ["All", ...catalogs].forEach((catalog) => {
    const chip = document.createElement("button");
    chip.className = "chip" + (catalog === state.activeCatalog ? " active" : "");
    chip.textContent = catalog;
    chip.addEventListener("click", () => {
      state.activeCatalog = catalog;
      renderFilters();
      render();
    });
    filtersEl.appendChild(chip);
  });
}

function matchesQuery(photo, query) {
  if (!query) return true;
  const haystack = [
    photo.title,
    photo.catalog,
    ...(photo.designations || []),
    ...(photo.tags || []),
    photo.notes,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

function getFiltered() {
  return state.photos.filter((p) => {
    const catalogOk = state.activeCatalog === "All" || p.catalog === state.activeCatalog;
    return catalogOk && matchesQuery(p, state.query);
  });
}

function render() {
  const filtered = getFiltered();
  resultCountEl.textContent = `${filtered.length} photo${filtered.length === 1 ? "" : "s"}`;
  galleryEl.innerHTML = "";
  emptyStateEl.hidden = filtered.length > 0;

  filtered.forEach((photo) => {
    galleryEl.appendChild(buildCard(photo));
  });
}

function buildCard(photo) {
  const card = document.createElement("div");
  card.className = "card";
  card.addEventListener("click", () => openLightbox(photo));

  const img = document.createElement("img");
  img.className = "card-thumb";
  img.src = photo.file;
  img.alt = photo.title || "";
  img.loading = "lazy";
  img.onerror = () => { img.style.opacity = 0.15; };

  const body = document.createElement("div");
  body.className = "card-body";

  const title = document.createElement("h3");
  title.className = "card-title";
  title.textContent = photo.title || "Untitled";

  const badges = document.createElement("div");
  badges.className = "badges";
  badges.append(...buildBadges(photo));

  body.append(title, badges);
  card.append(img, body);
  return card;
}

function buildBadges(photo) {
  const els = [];
  if (photo.catalog) {
    const b = document.createElement("span");
    b.className = `badge catalog-${photo.catalog}`;
    b.textContent = photo.catalog;
    els.push(b);
  }
  (photo.designations || []).forEach((d) => {
    const b = document.createElement("span");
    b.className = "badge";
    b.textContent = d;
    els.push(b);
  });
  return els;
}

function openLightbox(photo) {
  lightboxImg.src = photo.file;
  lightboxImg.alt = photo.title || "";
  lightboxTitle.textContent = photo.title || "Untitled";

  lightboxBadges.innerHTML = "";
  lightboxBadges.append(...buildBadges(photo));
  (photo.tags || []).forEach((tag) => {
    const b = document.createElement("span");
    b.className = "badge";
    b.textContent = tag;
    lightboxBadges.appendChild(b);
  });

  lightboxMeta.innerHTML = "";
  addMeta("Date", photo.date);
  addMeta("Equipment", photo.equipment);

  lightboxNotes.innerHTML = "";
  if (photo.description) {
    const p = document.createElement("p");
    p.className = "description";
    p.textContent = photo.description;
    lightboxNotes.appendChild(p);
  }
  if (photo.notes) {
    const p = document.createElement("p");
    p.className = "notes-text";
    p.textContent = photo.notes;
    lightboxNotes.appendChild(p);
  }
  const wikiUrl = photo.wikipedia || wikipediaSearchUrl(photo);
  if (wikiUrl) {
    const link = document.createElement("a");
    link.className = "wiki-link";
    link.href = wikiUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Read more on Wikipedia →";
    lightboxNotes.appendChild(link);
  }

  lightboxEl.hidden = false;
  document.body.style.overflow = "hidden";
}

function addMeta(label, value) {
  if (!value) return;
  const dt = document.createElement("dt");
  dt.textContent = label;
  const dd = document.createElement("dd");
  dd.textContent = value;
  lightboxMeta.append(dt, dd);
}

function wikipediaSearchUrl(photo) {
  const query = (photo.designations && photo.designations[0]) || photo.title;
  if (!query) return null;
  return `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(query)}`;
}

function closeLightbox() {
  lightboxEl.hidden = true;
  lightboxImg.src = "";
  document.body.style.overflow = "";
}
