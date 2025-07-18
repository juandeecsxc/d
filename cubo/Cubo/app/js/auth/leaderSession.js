// Módulo para gestionar la sesión del líder
import { LEADERS, APP_CONFIG } from '../constants.js';
import { safeSetItem, safeGetItem, safeRemoveItem } from '../utils/storageUtil.js';

const LEADER_KEY = 'cubo_leader';
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

export function setLeader(leader) {
  if (!leader || typeof leader !== 'string' || leader.trim().length === 0) {
    console.error('Nombre de líder inválido');
    return false;
  }
  
  if (leader.length > APP_CONFIG.maxLeaderNameLength) {
    console.error(`Nombre de líder demasiado largo. Máximo ${APP_CONFIG.maxLeaderNameLength} caracteres.`);
    return false;
  }
  
  if (!isLeader(leader)) {
    console.error('Líder no autorizado');
    return false;
  }
  
  const sessionData = {
    leader: leader.trim(),
    timestamp: Date.now(),
    lastActivity: Date.now()
  };
  
  return safeSetItem(LEADER_KEY, sessionData);
}

export function getLeader() {
  const sessionData = safeGetItem(LEADER_KEY, null);
  
  if (!sessionData) {
    return null;
  }
  
  // Verificar si la sesión ha expirado
  const now = Date.now();
  if (now - sessionData.timestamp > SESSION_TIMEOUT) {
    console.log('Sesión expirada, limpiando datos');
    clearLeader();
    return null;
  }
  
  // Actualizar última actividad
  sessionData.lastActivity = now;
  safeSetItem(LEADER_KEY, sessionData);
  
  return sessionData.leader;
}

export function isLeader(name) {
  if (!name || typeof name !== 'string') {
    return false;
  }
  
  return LEADERS.includes(name.trim());
}

export function clearLeader() {
  return safeRemoveItem(LEADER_KEY);
}

export function getSessionInfo() {
  const sessionData = safeGetItem(LEADER_KEY, null);
  
  if (!sessionData) {
    return null;
  }
  
  const now = Date.now();
  const timeRemaining = SESSION_TIMEOUT - (now - sessionData.timestamp);
  
  return {
    leader: sessionData.leader,
    timestamp: sessionData.timestamp,
    lastActivity: sessionData.lastActivity,
    timeRemaining: Math.max(0, timeRemaining),
    isExpired: timeRemaining <= 0
  };
}

export function updateLastActivity() {
  const sessionData = safeGetItem(LEADER_KEY, null);
  
  if (sessionData) {
    sessionData.lastActivity = Date.now();
    safeSetItem(LEADER_KEY, sessionData);
  }
}

export function getAuthorizedLeaders() {
  return [...LEADERS];
}

export function validateLeaderSession() {
  const sessionInfo = getSessionInfo();
  
  if (!sessionInfo) {
    return { valid: false, reason: 'No hay sesión activa' };
  }
  
  if (sessionInfo.isExpired) {
    clearLeader();
    return { valid: false, reason: 'Sesión expirada' };
  }
  
  if (!isLeader(sessionInfo.leader)) {
    clearLeader();
    return { valid: false, reason: 'Líder no autorizado' };
  }
  
  return { valid: true, leader: sessionInfo.leader };
} 