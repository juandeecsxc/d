import { getLeader, setLeader, isLeader } from '../auth/leaderSession.js';
import { loadAlertsFromStorage, createAlert, updateAlert, deleteAlert, getAlertsByAuthor, getAlertsStats } from '../modules/alertManager.js';
import { SECCIONES, SECCIONES_MAP } from '../constants.js';

// Función para detectar y convertir menciones @Sección en enlaces
function procesarMenciones(texto) {
  // Regex para detectar menciones @Sección (case insensitive)
  const regex = /@([a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+)/g;
  
  return texto.replace(regex, (match, seccion) => {
    const seccionLower = seccion.toLowerCase().trim();
    const seccionKey = SECCIONES_MAP[seccionLower];
    
    if (seccionKey) {
      // Crear enlace funcional
      return `<a href="#" class="seccion-link" data-seccion="${seccionKey}" style="color: #2563eb; text-decoration: underline; font-weight: 500;">@${seccion}</a>`;
    } else {
      // Si no es una sección válida, mantener el texto original
      return match;
    }
  });
}

// Función para formatear fecha legible
function formatearFecha(fechaISO) {
  try {
    const fecha = new Date(fechaISO);
    const ahora = new Date();
    const diffMs = ahora - fecha;
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDias === 0) {
      return 'Hoy';
    } else if (diffDias === 1) {
      return 'Ayer';
    } else if (diffDias < 7) {
      return `Hace ${diffDias} días`;
    } else {
      return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  } catch (error) {
    return fechaISO;
  }
}

// Función para agrupar alertas por autor
function agruparAlertasPorAutor(alertas) {
  const grupos = {};
  
  alertas.forEach(alerta => {
    if (!grupos[alerta.autor]) {
      grupos[alerta.autor] = [];
    }
    grupos[alerta.autor].push(alerta);
  });
  
  // Ordenar alertas por fecha (más reciente primero) dentro de cada grupo
  Object.keys(grupos).forEach(autor => {
    grupos[autor].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  });
  
  return grupos;
}

export function renderAlertas() {
  setTimeout(() => {
    // Configurar clics en enlaces de sección después de que se renderice el contenido
    const enlacesSeccion = document.querySelectorAll('.seccion-link');
    
    enlacesSeccion.forEach(enlace => {
      enlace.addEventListener('click', function(e) {
        e.preventDefault();
        const seccion = this.getAttribute('data-seccion');
        
        // Buscar la función cargarSeccion en el scope global o en main.js
        if (typeof window.cargarSeccion === 'function') {
          window.cargarSeccion(seccion);
        } else {
          // Si no está disponible globalmente, intentar navegar manualmente
          const menuItem = document.querySelector(`[data-section="${seccion}"]`);
          if (menuItem) {
            menuItem.click();
          } else {
            console.warn(`No se pudo navegar a la sección: ${seccion}`);
          }
        }
      });
    });
  }, 100);

  // Cargar todas las alertas del localStorage
  const alertas = loadAlertsFromStorage();
  const stats = getAlertsStats();
  
  if (alertas.length === 0) {
    return `
      <section class="dashboard-section">
        <h2>Alertas</h2>
        <img src="app/images/alertas/icono.png" alt="Icono de Alertas" class="indicador-img mx-auto my-4">
        
        <div style="text-align: center; padding: 60px 20px; color: #666;">
          <div style="font-size: 3rem; margin-bottom: 16px;">📭</div>
          <h3>No hay alertas disponibles</h3>
          <p>Las alertas creadas por los líderes aparecerán aquí agrupadas por autor.</p>
          <p style="margin-top: 16px; font-size: 0.9rem; color: #888;">
            Para crear alertas, haz clic en el botón "Líder" en la esquina inferior derecha.
          </p>
        </div>
      </section>
    `;
  }
  
  // Agrupar alertas por autor
  const grupos = agruparAlertasPorAutor(alertas);
  const autores = Object.keys(grupos).sort();
  
  // Generar HTML para cada grupo
  const gruposHTML = autores.map(autor => {
    const alertasDelAutor = grupos[autor];
    const alertasHTML = alertasDelAutor.map(alerta => {
      const mensajeProcesado = procesarMenciones(alerta.mensaje);
      const fechaFormateada = formatearFecha(alerta.fecha);
      
      return `
        <div class="alerta-item" style="
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        ">
          <div class="alerta-mensaje" style="
            font-size: 1rem;
            line-height: 1.5;
            margin-bottom: 8px;
            word-wrap: break-word;
          ">${mensajeProcesado}</div>
          <div class="alerta-meta" style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.875rem;
            color: #64748b;
          ">
            <span class="alerta-fecha">📅 ${fechaFormateada}</span>
            ${alerta.seccion ? `<span class="alerta-seccion" style="
              background: #eff6ff;
              color: #2563eb;
              padding: 2px 8px;
              border-radius: 12px;
              font-size: 0.75rem;
              font-weight: 500;
            ">${alerta.seccion}</span>` : ''}
            ${alerta.editado ? `<span style="
              background: #fef3c7;
              color: #92400e;
              padding: 2px 8px;
              border-radius: 12px;
              font-size: 0.75rem;
              font-weight: 500;
            ">✏️ Editado</span>` : ''}
          </div>
        </div>
      `;
    }).join('');
    
    return `
      <div class="grupo-lider" style="
        background: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        margin-bottom: 24px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      ">
        <div class="grupo-header" style="
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 16px 20px;
          font-weight: 600;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          gap: 8px;
        ">
          <span>👤</span>
          <span>${autor}</span>
          <span style="
            background: rgba(255,255,255,0.2);
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.8rem;
            margin-left: auto;
          ">${alertasDelAutor.length} alerta${alertasDelAutor.length !== 1 ? 's' : ''}</span>
        </div>
        <div class="grupo-content" style="padding: 20px;">
          ${alertasHTML}
        </div>
      </div>
    `;
  }).join('');

  return `
    <section class="dashboard-section">
      <h2>Alertas</h2>
      <img src="app/images/alertas/icono.png" alt="Icono de Alertas" class="indicador-img mx-auto my-4">
      
      <div style="
        background: #f0f9ff;
        border: 1px solid #bae6fd;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 24px;
        font-size: 0.9rem;
        color: #0369a1;
      ">
        <strong>💡 Información:</strong> Esta vista muestra todas las alertas agrupadas por líder. 
        Las menciones como <code>@Saldos</code>, <code>@Cartera Vigente</code>, etc. son enlaces 
        que te llevarán directamente a esa sección del dashboard.
      </div>
      
      <div class="alertas-grupos">
        ${gruposHTML}
      </div>
      
      <div style="
        text-align: center;
        margin-top: 32px;
        padding: 20px;
        background: #f8fafc;
        border-radius: 8px;
        color: #64748b;
        font-size: 0.9rem;
      ">
        <strong>Total:</strong> ${stats.total} alerta${stats.total !== 1 ? 's' : ''} de ${autores.length} líder${autores.length !== 1 ? 'es' : ''}
        ${stats.recientes > 0 ? ` • ${stats.recientes} recientes (últimos 7 días)` : ''}
      </div>
    </section>
  `;
} 