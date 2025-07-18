import {
  getCurrentLeader,
  setCurrentLeader,
  clearCurrentLeader,
} from "../auth/leaderSession.js";
import { LEADERS } from "../constants.js";
import {
  addAlert,
  getAlertsByAuthor,
  updateAlert,
  deleteAlert,
} from "../modules/alertManager.js";
import { renderAlertas } from "./alertasView.js";

function showAuthModal() {
  const modal = document.getElementById("leader-auth-modal");
  if (!modal) return;
  modal.style.display = "flex";
}

function hideAuthModal() {
  const modal = document.getElementById("leader-auth-modal");
  if (!modal) return;
  modal.style.display = "none";
}

function setupAuth() {
  const btn = document.getElementById("leaderAuthBtn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const input = document.getElementById("leaderNameInput");
    const name = (input.value || "").trim();
    if (!LEADERS.includes(name)) {
      alert("Nombre de líder no válido");
      return;
    }
    setCurrentLeader(name);
    hideAuthModal();
    renderLeaderSection();
  });
}

function createAlertElement(alerta, leader) {
  const item = document.createElement("div");
  const text = document.createElement("p");
  text.innerHTML = alerta.mensaje;
  const info = document.createElement("small");
  info.textContent = new Date(alerta.fecha).toLocaleString();
  const editBtn = document.createElement("button");
  editBtn.textContent = "Editar";
  const delBtn = document.createElement("button");
  delBtn.textContent = "Eliminar";

  editBtn.addEventListener("click", () => {
    let nuevo = prompt("Editar alerta", alerta.mensaje);
    if (nuevo === null) return;
    if (!nuevo.trim()) {
      alert("El mensaje no puede estar vacío");
      return;
    }
    updateAlert(alerta.id, nuevo, leader);
    renderAlertsList();
  });

  delBtn.addEventListener("click", () => {
    deleteAlert(alerta.id, leader);
    renderAlertsList();
  });

  item.appendChild(text);
  item.appendChild(info);
  item.appendChild(editBtn);
  item.appendChild(delBtn);
  return item;
}

function renderAlertsList() {
  const leader = getCurrentLeader();
  const list = document.getElementById("alertList");
  if (!leader || !list) return;
  const datos = getAlertsByAuthor(leader);
  list.innerHTML = "";
  datos.forEach((a) => list.appendChild(createAlertElement(a, leader)));
}

function renderLeaderSection() {
  const container = document.getElementById("content");
  if (!container) return;
  const leader = getCurrentLeader();
  if (!leader) {
    showAuthModal();
    return;
  }
  container.innerHTML = `
    <section class="dashboard-section" id="leader-alerts-section">
      <h2>Mis Alertas</h2>
      <button id="exitLeaderBtn" style="margin-bottom:10px;">Salir</button>
      <div id="alertList"></div>
      <form id="alertForm">
        <div>Autor: <span id="alertAuthor">${leader}</span></div>
        <textarea id="alertMessage" style="width:100%;height:60px;"></textarea>
        <button type="submit">Agregar</button>
      </form>
    </section>
  `;
  document.getElementById("alertForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const msgInput = document.getElementById("alertMessage");
    const mensaje = msgInput.value.trim();
    if (!mensaje) {
      alert("El mensaje no puede estar vacío");
      return;
    }
    addAlert(mensaje, leader);
    msgInput.value = "";
    renderAlertsList();
  });
  document
    .getElementById("exitLeaderBtn")
    .addEventListener("click", () => {
      clearCurrentLeader();
      container.innerHTML = renderAlertas();
      attachLeaderButton();
    });
  renderAlertsList();
}

function attachLeaderButton() {
  const btn = document.getElementById("openLeaderBtn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const leader = getCurrentLeader();
    if (leader) {
      renderLeaderSection();
    } else {
      showAuthModal();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupAuth();
  const target = document.getElementById("content");
  if (target) {
    const observer = new MutationObserver(attachLeaderButton);
    observer.observe(target, { childList: true, subtree: true });
  }
  attachLeaderButton();
});
