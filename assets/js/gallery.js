const gallery = document.querySelector("#technical-gallery");
const filter = document.querySelector("#gallery-filter");
const search = document.querySelector("#gallery-search");
const count = document.querySelector("#visible-count");
const empty = document.querySelector("#gallery-empty");
const archiveMap = document.querySelector("#archive-map");

const labels = {
  "00-portada-y-general": "Portada y material general",
  "01-marco-teorico": "Marco teórico",
  "02-modelacion-etabs": "Modelación ETABS",
  "03-analisis-tiempo-historia": "Análisis tiempo-historia",
  "04-abaqus-lrb": "ABAQUS: aislador LRB",
  "05-abaqus-deslizador": "ABAQUS: deslizador POT",
  "07-diseno-aisladores": "Diseño de aisladores",
  "08-ensayos-y-validacion": "Ensayos y validación",
  "09-verificacion-capacidad": "Verificación de capacidad",
  "10-planos-fabricacion": "Planos de fabricación"
};

let catalog = [];

function getFolder(item) {
  const parts = item.path.split("/");
  return parts[parts.length - 2];
}

function render(items) {
  gallery.innerHTML = "";
  const fragment = document.createDocumentFragment();

  items.forEach((item) => {
    const folder = getFolder(item);
    const card = document.createElement("article");
    card.className = "archive-card";
    card.tabIndex = 0;
    card.innerHTML = `
      <img loading="lazy" src="${item.path}" alt="${item.caption || "Figura técnica"}">
      <div>
        <small>${String(item.sequence).padStart(3, "0")} · ${labels[folder] || folder}</small>
        <p>${item.caption || item.subsection || "Recurso gráfico de la tesis"}</p>
      </div>
    `;

    const activate = () => {
      const image = card.querySelector("img");
      window.portfolioLightbox?.(image, item.caption || item.subsection);
    };
    card.addEventListener("click", activate);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        activate();
      }
    });
    fragment.appendChild(card);
  });

  gallery.appendChild(fragment);
  count.textContent = String(items.length);
  empty.hidden = items.length !== 0;
}

function applyFilters() {
  const folder = filter.value;
  const term = search.value.trim().toLocaleLowerCase("es");
  const items = catalog.filter((item) => {
    const folderMatch = folder === "all" || getFolder(item) === folder;
    const text = `${item.caption} ${item.chapter} ${item.section} ${item.subsection}`.toLocaleLowerCase("es");
    return folderMatch && (!term || text.includes(term));
  });
  render(items);
}

async function loadCatalog() {
  try {
    const response = await fetch("assets/images/catalogo.json");
    if (!response.ok) throw new Error("No se pudo cargar el catálogo.");
    catalog = await response.json();

    const folderCounts = catalog.reduce((acc, item) => {
      const folder = getFolder(item);
      acc[folder] = (acc[folder] || 0) + 1;
      return acc;
    }, {});

    Object.keys(folderCounts).sort().forEach((folder) => {
      const option = document.createElement("option");
      option.value = folder;
      option.textContent = `${labels[folder] || folder} (${folderCounts[folder]})`;
      filter.appendChild(option);
    });

    archiveMap.innerHTML = Object.keys(folderCounts).sort().map(
      (folder) => `<span class="archive-chip">${labels[folder] || folder} · ${folderCounts[folder]}</span>`
    ).join("");

    render(catalog);
  } catch (error) {
    archiveMap.innerHTML = `<p>${error.message}</p>`;
    count.textContent = "0";
  }
}

filter.addEventListener("change", applyFilters);
search.addEventListener("input", applyFilters);
loadCatalog();
