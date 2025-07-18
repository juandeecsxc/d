import { loadAlertsFromStorage, saveAlertsToStorage } from '../modules/alertManager.js';

// Mapeo de secciones para navegación
const SECCIONES_MAP = {
  'saldos': 'saldos',
  'cartera vigente': 'cartera-vigente',
  'cartera castigada': 'cartera-castigada',
  'embudo': 'embudo',
  'canales': 'canales',
  'tacticos': 'tacticos',
  'historico': 'historico',
  'cierre junta': 'cierre-junta',
  'cierre de junta': 'cierre-junta'
};

// Función para crear datos de prueba si no hay alertas
function crearDatosPrueba() {
  const alertas = loadAlertsFromStorage();
  if (alertas.length === 0) {
    const datosPrueba = [
      {
        id: '1',
        autor: 'Tatiana',
        mensaje: 'Revisar @Saldos pendientes del mes anterior. Hay inconsistencias en @Cartera Vigente que requieren atención inmediata.',
        fecha: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 16),
        seccion: 'riesgo'
      },
      {
        id: '2',
        autor: 'Adriana',
        mensaje: 'Actualización importante en @Embudo de ventas. Los @Canales están funcionando correctamente.',
        fecha: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 16),
        seccion: 'alerta'
      },
      {
        id: '3',
        autor: 'Lina',
        mensaje: 'Reunión programada para revisar @Tacticos del próximo trimestre. También revisar @Historico de rendimiento.',
        fecha: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 16),
        seccion: 'incidente'
      },
      {
        id: '4',
        autor: 'Juan',
        mensaje: 'Preparar presentación para @Cierre de Junta. Incluir datos de @Saldos y @Cartera Castigada.',
        fecha: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 16),
        seccion: 'alerta'
      },
      {
        id: '5',
        autor: 'Tatiana',
        mensaje: 'Seguimiento pendiente en @Cartera Vigente. Los indicadores muestran mejoría en @Embudo.',
        fecha: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 16),
        seccion: 'riesgo'
      },
      {
        id: '6',
        autor: 'Adriana',
        mensaje: 'Nuevos @Canales implementados exitosamente. Revisar impacto en @Tacticos generales.',
        fecha: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 16),
        seccion: 'alerta'
      }
    ];
    
    saveAlertsToStorage(datosPrueba);
    return datosPrueba;
  }
  return alertas;
}

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

// Función principal para renderizar la vista general de alertas
export function renderVistaGeneralAlertas() {
  // Cargar todas las alertas del localStorage (crear datos de prueba si no hay)
  const alertas = crearDatosPrueba();
  
  if (alertas.length === 0) {
    return `
      <section class="dashboard-section">
        <h2>📋 Vista General de Alertas</h2>
        <div style="text-align: center; padding: 60px 20px; color: #666;">
          <div style="font-size: 3rem; margin-bottom: 16px;">📭</div>
          <h3>No hay alertas disponibles</h3>
          <p>Las alertas creadas por los líderes aparecerán aquí agrupadas por autor.</p>
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
      <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      ">
        <h2>📋 Vista General de Alertas</h2>
        <button onclick="window.cargarSeccion('alertas')" style="
          background: #64748b;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 8px 16px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        " onmouseover="this.style.background='#475569'" onmouseout="this.style.background='#64748b'">
          ← Volver a Alertas
        </button>
      </div>
      
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
        <strong>Total:</strong> ${alertas.length} alerta${alertas.length !== 1 ? 's' : ''} de ${autores.length} líder${autores.length !== 1 ? 'es' : ''}
      </div>
    </section>
  `;
}

// Función para configurar los event listeners de navegación
export function configurarNavegacionAlertas() {
  // Configurar clics en enlaces de sección después de que se renderice el contenido
  setTimeout(() => {
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
} 