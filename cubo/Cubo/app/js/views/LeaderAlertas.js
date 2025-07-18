import { getLeader, setLeader, isLeader, clearLeader } from '../auth/leaderSession.js';
import { loadAlertsFromStorage, createAlert, updateAlert, deleteAlert, getAlertsByAuthor } from '../modules/alertManager.js';
import { SECCIONES } from '../constants.js';

const leaderBtn = document.getElementById('leader-alerts-btn');
const mainContainer = document.getElementById('mainContainer');
const leaderModal = document.getElementById('leader-auth-modal');
const leaderInput = document.getElementById('leaderNameInput');
const leaderAuthBtn = document.getElementById('leaderAuthBtn');

function showLeaderModal(cb) {
  leaderModal.style.display = 'block';
  leaderInput.value = '';
  leaderInput.placeholder = 'Ingresa tu nombre';
  leaderInput.focus();
  
  // Limpiar eventos previos
  leaderAuthBtn.onclick = null;
  
  leaderAuthBtn.onclick = () => {
    const name = leaderInput.value.trim();
    if (!name) {
      leaderInput.placeholder = 'Por favor, ingresa un nombre';
      leaderInput.style.borderColor = '#dc2626';
      return;
    }
    
    if (isLeader(name)) {
      setLeader(name);
      leaderModal.style.display = 'none';
      leaderInput.style.borderColor = '';
      cb(name);
    } else {
      leaderInput.value = '';
      leaderInput.placeholder = 'Nombre inválido - Intenta de nuevo';
      leaderInput.style.borderColor = '#dc2626';
    }
  };
  
  // Permitir cerrar con Escape
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      hideLeaderModal();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);
}

function hideLeaderModal() {
  leaderModal.style.display = 'none';
  leaderInput.style.borderColor = '';
  leaderInput.placeholder = 'Ingresa tu nombre';
}

function renderLeaderAlertasView(leader) {
  mainContainer.innerHTML = '';
  const alerts = getAlertsByAuthor(leader);

  // Título y botones de cerrar y salir
  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';
  header.innerHTML = `<h2 style="margin:0;">Alertas de ${leader}</h2>`;
  
  // Contenedor para los botones
  const buttonContainer = document.createElement('div');
  buttonContainer.style.display = 'flex';
  buttonContainer.style.gap = '8px';
  
  // Botón de Salir (cerrar sesión)
  const logoutBtn = document.createElement('button');
  logoutBtn.textContent = 'Salir';
  logoutBtn.style.background = '#dc2626';
  logoutBtn.style.color = 'white';
  logoutBtn.style.border = 'none';
  logoutBtn.style.borderRadius = '4px';
  logoutBtn.style.padding = '6px 14px';
  logoutBtn.style.cursor = 'pointer';
  logoutBtn.style.fontWeight = '500';
  logoutBtn.onclick = () => {
    clearLeader();
    mainContainer.innerHTML = '';
    // Cargar la vista de alertas principal
    if (typeof window.cargarSeccion === 'function') {
      window.cargarSeccion('alertas');
    } else {
      // Si no está disponible globalmente, intentar navegar manualmente
      const menuItem = document.querySelector('[data-section="alertas"]');
      if (menuItem) {
        menuItem.click();
      } else {
        console.warn('No se pudo navegar a la sección de alertas');
      }
    }
  };
  
  // Elimino el botón de Cerrar (solo cerrar vista)
  // const closeBtn = document.createElement('button');
  // closeBtn.textContent = 'Cerrar';
  // closeBtn.style.background = '#e5e7eb';
  // closeBtn.style.border = 'none';
  // closeBtn.style.borderRadius = '4px';
  // closeBtn.style.padding = '6px 14px';
  // closeBtn.style.cursor = 'pointer';
  // closeBtn.onclick = () => {
  //   mainContainer.innerHTML = '';
  // };
  
  buttonContainer.appendChild(logoutBtn);
  // buttonContainer.appendChild(closeBtn); // Eliminado
  header.appendChild(buttonContainer);
  mainContainer.appendChild(header);

  // Lista de alertas
  const list = document.createElement('ul');
  list.className = 'alert-list';
  alerts.forEach(alert => {
    const li = document.createElement('li');
    li.className = 'alert-item';
    li.innerHTML = `
      <span class="alert-msg" contenteditable="false">${alert.mensaje}</span>
      <span class="alert-date">${alert.fecha}</span>
      <span class="alert-section">${alert.seccion ? SECCIONES.find(s=>s.clave===alert.seccion)?.nombre || alert.seccion : ''}</span>
      <span class="alert-autor">${alert.autor}</span>
      <button class="edit-btn">✏️</button>
      <button class="delete-btn">🗑️</button>
    `;
    // Editar en línea
    li.querySelector('.edit-btn').onclick = () => {
      const msgSpan = li.querySelector('.alert-msg');
      msgSpan.contentEditable = true;
      msgSpan.focus();
      li.querySelector('.edit-btn').style.display = 'none';
      const saveBtn = document.createElement('button');
      saveBtn.textContent = '💾';
      saveBtn.className = 'save-btn';
      saveBtn.onclick = () => {
        const newMsg = msgSpan.textContent.trim();
        if (!newMsg) {
          alert('El mensaje no puede estar vacío');
          msgSpan.focus();
          return;
        }
        updateAlert(alert.id, newMsg, leader);
        renderLeaderAlertasView(leader);
      };
      li.insertBefore(saveBtn, li.querySelector('.delete-btn'));
    };
    // Eliminar
    li.querySelector('.delete-btn').onclick = () => {
      if (confirm('¿Eliminar esta alerta?')) {
        deleteAlert(alert.id, leader);
        renderLeaderAlertasView(leader);
      }
    };
    list.appendChild(li);
  });
  mainContainer.appendChild(list);

  // Formulario de nueva alerta
  const form = document.createElement('form');
  form.id = 'alertForm';
  form.style.marginTop = '32px';
  form.innerHTML = `
    <h3>Crear nueva alerta</h3>
    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
      <label for="alertLeader"><b>Líder:</b></label>
      <span style="font-weight:bold;color:#2563eb;padding:4px 8px;background:#eff6ff;border-radius:4px;">${leader}</span>
      <input type="text" id="alertMsg" placeholder="Mensaje de alerta" maxlength="120" required style="flex:2;min-width:180px;" />
      <select id="alertSection" style="flex:1;min-width:120px;">
        ${SECCIONES.map(s => `<option value="${s.clave}">${s.nombre}</option>`).join('')}
      </select>
      <button type="submit">Crear alerta</button>
    </div>
  `;
  form.onsubmit = e => {
    e.preventDefault();
    const mensaje = document.getElementById('alertMsg').value.trim();
    const seccion = document.getElementById('alertSection').value;
    if (!mensaje) {
      alert('El mensaje no puede estar vacío');
      document.getElementById('alertMsg').focus();
      return;
    }
    const alertaCreada = createAlert({ mensaje, seccion, autor: leader });
    if (alertaCreada) {
      document.getElementById('alertMsg').value = '';
      document.getElementById('alertSection').value = '';
      renderLeaderAlertasView(leader);
    } else {
      alert('Error al crear la alerta. Intenta de nuevo.');
    }
  };
  mainContainer.appendChild(form);
}

leaderBtn.addEventListener('click', () => {
  const leader = getLeader();
  if (!leader) {
    showLeaderModal(renderLeaderAlertasView);
  } else {
    renderLeaderAlertasView(leader);
  }
}); 