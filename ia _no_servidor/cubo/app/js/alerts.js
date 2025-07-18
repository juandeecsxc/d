
const STORAGE_KEY = "cubo_alerts";

const SECTION_MAP = {
  "Alertas": "alertas",
  "Saldos": "saldos",
  "Embudo": "embudo",
  "Canales": "canales",
  "Cartera Vigente": "cartera_vigente",
  "Cartera Castigada": "cartera_castigada",
  "Tácticos": "tacticos",
  "Histórico": "historico",
  "Cierre de Junta": "cierre_de_junta",
};

function loadAllAlerts() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return data && typeof data === "object" ? data : {};
  } catch {
    return {};
  }
}

function linkifyMensaje(texto) {
  let result = texto;
  for (const [nombre, seccion] of Object.entries(SECTION_MAP)) {
    const pattern = new RegExp(`@${nombre.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, "g");
    result = result.replace(
      pattern,
      `<a href="#" data-section="${seccion}" class="alert-section-link">@${nombre}</a>`
    );
  }
  return result;
}

export function renderVistaGeneralAlertas() {
  const container = document.getElementById("content");
  if (!container) return;

  const prev = document.getElementById("alertas-general-section");
  if (prev) prev.remove();

  const data = loadAllAlerts();
  const section = document.createElement("section");
  section.className = "dashboard-section";
  section.id = "alertas-general-section";

  const header = document.createElement("h2");
  header.textContent = "Vista General de Alertas";
  section.appendChild(header);

  for (const autor of Object.keys(data)) {
    const group = document.createElement("div");
    group.className = "alert-group";

    const h3 = document.createElement("h3");
    h3.textContent = autor;
    group.appendChild(h3);

    const alerts = (data[autor] || []).slice().sort((a, b) => {
      return new Date(b.fecha) - new Date(a.fecha);
    });

    alerts.forEach((a) => {
      const card = document.createElement("div");
      card.className = "alert-card";

      const p = document.createElement("p");
      p.innerHTML = linkifyMensaje(a.mensaje);
      const time = document.createElement("small");
      time.textContent = new Date(a.fecha).toLocaleString();

      card.appendChild(p);
      card.appendChild(time);
      group.appendChild(card);
    });

    section.appendChild(group);
  }

  container.appendChild(section);

  section.querySelectorAll("a[data-section]").forEach((lnk) => {
    lnk.addEventListener("click", (ev) => {
      ev.preventDefault();
      const sec = lnk.getAttribute("data-section");
      if (typeof loadSection === "function") {
        loadSection(sec);
      }
    });
  });
}

function checkSectionLoad() {
  const cont = document.getElementById("content");
  if (!cont) return;
  const h2 = cont.querySelector("h2");
  if (
    h2 &&
    h2.textContent.trim() === "Alertas" &&
    !document.getElementById("alertas-general-section")
  ) {
    renderVistaGeneralAlertas();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const target = document.getElementById("content");
  if (target) {
    const observer = new MutationObserver(checkSectionLoad);
    observer.observe(target, { childList: true, subtree: true });
  }
  checkSectionLoad();
});
