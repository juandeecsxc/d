// Utilidades para el manejo seguro del almacenamiento local

/**
 * Guarda datos en localStorage con manejo de errores
 * @param {string} key - Clave del almacenamiento
 * @param {any} data - Datos a guardar
 * @returns {boolean} - True si se guardó correctamente
 */
export function safeSetItem(key, data) {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
    return true;
  } catch (error) {
    console.error('Error al guardar en localStorage:', error);
    return false;
  }
}

/**
 * Obtiene datos de localStorage con manejo de errores
 * @param {string} key - Clave del almacenamiento
 * @param {any} defaultValue - Valor por defecto si no existe
 * @returns {any} - Datos recuperados o valor por defecto
 */
export function safeGetItem(key, defaultValue = null) {
  try {
    const data = localStorage.getItem(key);
    if (data === null) return defaultValue;
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al leer de localStorage:', error);
    return defaultValue;
  }
}

/**
 * Elimina un elemento de localStorage
 * @param {string} key - Clave a eliminar
 * @returns {boolean} - True si se eliminó correctamente
 */
export function safeRemoveItem(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error al eliminar de localStorage:', error);
    return false;
  }
}

/**
 * Limpia todo el localStorage
 * @returns {boolean} - True si se limpió correctamente
 */
export function clearAllStorage() {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error al limpiar localStorage:', error);
    return false;
  }
}

/**
 * Verifica si localStorage está disponible
 * @returns {boolean} - True si está disponible
 */
export function isStorageAvailable() {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Obtiene el tamaño del localStorage en bytes
 * @returns {number} - Tamaño en bytes
 */
export function getStorageSize() {
  try {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return total;
  } catch (error) {
    return 0;
  }
}
