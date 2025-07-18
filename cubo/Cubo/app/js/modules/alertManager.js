// Módulo de gestión de alertas
import { safeGetItem, safeSetItem } from '../utils/storageUtil.js';
import { APP_CONFIG } from '../constants.js';

const ALERTS_KEY = 'cubo_alertas';

function generateUUID() {
  // Simple UUID v4 generator
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function loadAlertsFromStorage() {
  return safeGetItem(ALERTS_KEY, []);
}

export function saveAlertsToStorage(alerts) {
  return safeSetItem(ALERTS_KEY, alerts);
}

export function createAlert({ mensaje, seccion, autor }) {
  // Validación mejorada
  if (!mensaje || typeof mensaje !== 'string' || mensaje.trim().length === 0) {
    console.error('Mensaje inválido para crear alerta');
    return null;
  }
  
  if (mensaje.length > APP_CONFIG.maxAlertLength) {
    console.error(`Mensaje demasiado largo. Máximo ${APP_CONFIG.maxAlertLength} caracteres.`);
    return null;
  }
  
  if (!autor || typeof autor !== 'string' || autor.trim().length === 0) {
    console.error('Autor inválido para crear alerta');
    return null;
  }
  
  if (autor.length > APP_CONFIG.maxLeaderNameLength) {
    console.error(`Nombre de autor demasiado largo. Máximo ${APP_CONFIG.maxLeaderNameLength} caracteres.`);
    return null;
  }
  
  const fecha = new Date().toISOString().replace('T', ' ').substring(0, 16);
  const alert = {
    id: generateUUID(),
    autor: sanitize(autor),
    mensaje: sanitize(mensaje),
    fecha,
    seccion: seccion ? sanitize(seccion) : '',
    editado: false,
    fechaEdicion: null
  };
  
  const alerts = loadAlertsFromStorage();
  alerts.push(alert);
  
  if (saveAlertsToStorage(alerts)) {
    return alert;
  } else {
    console.error('Error al guardar alerta en almacenamiento');
    return null;
  }
}

export function updateAlert(id, mensaje, autor) {
  if (!mensaje || typeof mensaje !== 'string' || mensaje.trim().length === 0) {
    console.error('Mensaje inválido para actualizar alerta');
    return false;
  }
  
  if (mensaje.length > APP_CONFIG.maxAlertLength) {
    console.error(`Mensaje demasiado largo. Máximo ${APP_CONFIG.maxAlertLength} caracteres.`);
    return false;
  }
  
  const alerts = loadAlertsFromStorage();
  const idx = alerts.findIndex(a => a.id === id);
  
  if (idx === -1) {
    console.error('Alerta no encontrada');
    return false;
  }
  
  if (alerts[idx].autor !== autor) {
    console.error('Solo el autor puede editar su alerta');
    return false;
  }
  
  alerts[idx].mensaje = sanitize(mensaje);
  alerts[idx].editado = true;
  alerts[idx].fechaEdicion = new Date().toISOString().replace('T', ' ').substring(0, 16);
  
  return saveAlertsToStorage(alerts);
}

export function deleteAlert(id, autor) {
  let alerts = loadAlertsFromStorage();
  const idx = alerts.findIndex(a => a.id === id);
  
  if (idx === -1) {
    console.error('Alerta no encontrada');
    return false;
  }
  
  if (alerts[idx].autor !== autor) {
    console.error('Solo el autor puede eliminar su alerta');
    return false;
  }
  
  alerts.splice(idx, 1);
  return saveAlertsToStorage(alerts);
}

export function getAlertsByAuthor(autor) {
  if (!autor) return [];
  return loadAlertsFromStorage().filter(a => a.autor === autor);
}

export function getAlertsBySection(seccion) {
  if (!seccion) return loadAlertsFromStorage();
  return loadAlertsFromStorage().filter(a => a.seccion === seccion);
}

export function getRecentAlerts(limit = 10) {
  const alerts = loadAlertsFromStorage();
  return alerts
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, limit);
}

export function getAlertsStats() {
  const alerts = loadAlertsFromStorage();
  const stats = {
    total: alerts.length,
    porAutor: {},
    porSeccion: {},
    recientes: alerts.filter(a => {
      const fecha = new Date(a.fecha);
      const ahora = new Date();
      const diffDias = (ahora - fecha) / (1000 * 60 * 60 * 24);
      return diffDias <= 7;
    }).length
  };
  
  alerts.forEach(alerta => {
    // Contar por autor
    stats.porAutor[alerta.autor] = (stats.porAutor[alerta.autor] || 0) + 1;
    
    // Contar por sección
    const seccion = alerta.seccion || 'Sin sección';
    stats.porSeccion[seccion] = (stats.porSeccion[seccion] || 0) + 1;
  });
  
  return stats;
}

export function clearAllAlerts() {
  return saveAlertsToStorage([]);
}

function sanitize(str) {
  if (!str || typeof str !== 'string') return '';
  // Elimina etiquetas HTML y recorta espacios
  return String(str)
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
} 