// Manejo del menú lateral y carga dinámica de secciones

document.addEventListener('DOMContentLoaded', function () {
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('toggleSidebar');
  const menuItems = document.querySelectorAll('.menu-item');
  const mainContainer = document.getElementById('mainContainer');

  // Cambia el estado expandido/colapsado del menú
  toggleBtn.addEventListener('click', function () {
    const isCollapsed = sidebar.classList.contains('collapsed');
    sidebar.classList.toggle('collapsed');
    
    // Actualizar aria-expanded para accesibilidad
    toggleBtn.setAttribute('aria-expanded', !isCollapsed);
    
    // Cambiar el ancho del sidebar
    if (isCollapsed) {
      sidebar.classList.remove('w-16');
      sidebar.classList.add('w-64');
    } else {
      sidebar.classList.remove('w-64');
      sidebar.classList.add('w-16');
    }
  });

  // Función para cargar la sección
  window.cargarSeccion = async function cargarSeccion(seccion) {
    mainContainer.innerHTML = '<div class="flex items-center justify-center h-64"><div class="text-lg text-gray-600">Cargando...</div></div>';
    
    // Mapeo de secciones a módulos y funciones
    const seccionMap = {
      'alertas': { modulo: 'alertasView', funcion: 'renderAlertas' },
      'alertas-todas': { modulo: 'alertListView', funcion: 'renderVistaGeneralAlertas' },
      'saldos': { modulo: 'saldosView', funcion: 'renderSaldos' },
      'embudo': { modulo: 'embudoView', funcion: 'renderEmbudo' },
      'canales': { modulo: 'canalesView', funcion: 'renderCanales' },
      'cartera-vigente': { modulo: 'carteraVigenteView', funcion: 'renderCarteraVigente' },
      'cartera-castigada': { modulo: 'carteraCastigadaView', funcion: 'renderCarteraCastigada' },
      'tacticos': { modulo: 'tacticosView', funcion: 'renderTacticos' },
      'historico': { modulo: 'historicoView', funcion: 'renderHistorico' },
      'cierre-junta': { modulo: 'cierreJuntaView', funcion: 'renderCierreJunta' },
      'finanzas': { modulo: 'finanzasView', funcion: 'renderFinanzas' },
      'rrhh': { modulo: 'rrhhView', funcion: 'renderRRHH' }
    };
    
    const info = seccionMap[seccion];
    if (!info) {
      mainContainer.innerHTML = `
        <div class="text-center py-12">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Sección no disponible</h2>
          <p class="text-gray-600 mb-6">La sección "${seccion}" no está implementada actualmente.</p>
          <button onclick="window.cargarSeccion('alertas')" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">Volver a Alertas</button>
        </div>
      `;
      return;
    }
    
    try {
      const modulo = await import(`./views/${info.modulo}.js`);
      if (typeof modulo[info.funcion] === 'function') {
        const html = await modulo[info.funcion]();
        mainContainer.innerHTML = html;
        
        // Configurar navegación para la vista de alertas general
        if (seccion === 'alertas-todas' && typeof modulo.configurarNavegacionAlertas === 'function') {
          modulo.configurarNavegacionAlertas();
        }
        
        // Actualizar título de la página para accesibilidad
        document.title = `Cubo Dashboard - ${seccion.charAt(0).toUpperCase() + seccion.slice(1)}`;
        
      } else {
        mainContainer.innerHTML = `
          <div class="text-center py-12">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">Error de renderizado</h2>
            <p class="text-gray-600 mb-6">No se pudo renderizar la sección "${seccion}".</p>
            <button onclick="window.cargarSeccion('alertas')" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">Volver a Alertas</button>
          </div>
        `;
      }
    } catch (e) {
      console.error('Error al cargar sección:', e);
      mainContainer.innerHTML = `
        <div class="text-center py-12">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Error de carga</h2>
          <p class="text-gray-600 mb-4">No se pudo cargar la sección "${seccion}".</p>
          <p class="text-sm text-gray-500 mb-6">Error: ${e.message}</p>
          <button onclick="window.cargarSeccion('alertas')" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">Volver a Alertas</button>
        </div>
      `;
    }
  }

  // Maneja el clic en los ítems del menú
  menuItems.forEach(item => {
    item.addEventListener('click', function () {
      // Remover clase active de todos los items
      document.querySelectorAll('.menu-item').forEach(menuItem => {
        menuItem.classList.remove('active', 'bg-blue-50', 'text-blue-700');
        menuItem.classList.add('text-menu-gray');
      });
      
      // Agregar clase active al item clickeado
      this.classList.add('active', 'bg-blue-50', 'text-blue-700');
      this.classList.remove('text-menu-gray');
      
      const seccion = this.getAttribute('data-section');
      cargarSeccion(seccion);
    });
    
    // Accesibilidad: permite navegación con teclado
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  // Carga la sección inicial (alertas)
  cargarSeccion('alertas');
});
