// Módulo para manejo de indicadores y métricas

/**
 * Clase para gestionar indicadores del dashboard
 */
export class IndicadoresManager {
  constructor() {
    this.indicadores = new Map();
    this.observers = [];
  }

  /**
   * Registra un nuevo indicador
   * @param {string} id - Identificador único del indicador
   * @param {Object} config - Configuración del indicador
   */
  registrarIndicador(id, config) {
    this.indicadores.set(id, {
      ...config,
      valor: config.valorInicial || 0,
      timestamp: Date.now()
    });
    this.notificarCambios();
  }

  /**
   * Actualiza el valor de un indicador
   * @param {string} id - Identificador del indicador
   * @param {any} nuevoValor - Nuevo valor
   */
  actualizarIndicador(id, nuevoValor) {
    const indicador = this.indicadores.get(id);
    if (indicador) {
      indicador.valor = nuevoValor;
      indicador.timestamp = Date.now();
      this.notificarCambios();
    }
  }

  /**
   * Obtiene un indicador por ID
   * @param {string} id - Identificador del indicador
   * @returns {Object|null} - Indicador o null si no existe
   */
  obtenerIndicador(id) {
    return this.indicadores.get(id) || null;
  }

  /**
   * Obtiene todos los indicadores
   * @returns {Array} - Array de indicadores
   */
  obtenerTodos() {
    return Array.from(this.indicadores.values());
  }

  /**
   * Suscribe un observador para cambios
   * @param {Function} callback - Función a ejecutar cuando cambien los indicadores
   */
  suscribir(callback) {
    this.observers.push(callback);
  }

  /**
   * Notifica cambios a todos los observadores
   */
  notificarCambios() {
    this.observers.forEach(callback => {
      try {
        callback(this.obtenerTodos());
      } catch (error) {
        console.error('Error en observador de indicadores:', error);
      }
    });
  }
}

// Instancia global del gestor de indicadores
export const indicadoresManager = new IndicadoresManager();

/**
 * Función para calcular métricas básicas
 * @param {Array} datos - Array de datos numéricos
 * @returns {Object} - Métricas calculadas
 */
export function calcularMetricas(datos) {
  if (!Array.isArray(datos) || datos.length === 0) {
    return { promedio: 0, maximo: 0, minimo: 0, total: 0 };
  }

  const suma = datos.reduce((acc, val) => acc + val, 0);
  const promedio = suma / datos.length;
  const maximo = Math.max(...datos);
  const minimo = Math.min(...datos);

  return {
    promedio: Math.round(promedio * 100) / 100,
    maximo,
    minimo,
    total: suma
  };
}

/**
 * Función para formatear números como moneda
 * @param {number} valor - Valor a formatear
 * @param {string} moneda - Código de moneda (default: 'MXN')
 * @returns {string} - Valor formateado
 */
export function formatearMoneda(valor, moneda = 'MXN') {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: moneda
  }).format(valor);
}

/**
 * Función para formatear porcentajes
 * @param {number} valor - Valor a formatear
 * @param {number} decimales - Número de decimales (default: 2)
 * @returns {string} - Porcentaje formateado
 */
export function formatearPorcentaje(valor, decimales = 2) {
  return `${(valor * 100).toFixed(decimales)}%`;
}

/**
 * Función para obtener el color según el valor del indicador
 * @param {number} valor - Valor del indicador
 * @param {number} umbralBajo - Umbral para color bajo
 * @param {number} umbralAlto - Umbral para color alto
 * @returns {string} - Clase CSS de color
 */
export function obtenerColorIndicador(valor, umbralBajo = 50, umbralAlto = 80) {
  if (valor < umbralBajo) return 'indicador-bajo';
  if (valor > umbralAlto) return 'indicador-alto';
  return 'indicador-medio';
}
