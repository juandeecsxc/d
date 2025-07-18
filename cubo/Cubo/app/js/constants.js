// Constantes del sistema
export const LEADERS = ['Tatiana', 'Adriana', 'Lina', 'Juan'];

export const SECCIONES = [
  { clave: '', nombre: 'Sin sección' },
  { clave: 'riesgo', nombre: 'Riesgo' },
  { clave: 'incidente', nombre: 'Incidente' },
  { clave: 'alerta', nombre: 'Alerta' },
  { clave: 'financiero', nombre: 'Financiero' },
  { clave: 'operativo', nombre: 'Operativo' }
];

// Mapeo de secciones para navegación
export const SECCIONES_MAP = {
  'saldos': 'saldos',
  'cartera vigente': 'cartera-vigente',
  'cartera castigada': 'cartera-castigada',
  'embudo': 'embudo',
  'canales': 'canales',
  'tacticos': 'tacticos',
  'historico': 'historico',
  'cierre junta': 'cierre-junta',
  'cierre de junta': 'cierre-junta',
  'finanzas': 'finanzas',
  'rrhh': 'rrhh'
};

// Configuración de la aplicación
export const APP_CONFIG = {
  name: 'Cubo Dashboard',
  version: '1.1.0',
  author: 'Carlos Martínez',
  maxAlertLength: 500,
  maxLeaderNameLength: 30,
  defaultTimeout: 5000
}; 