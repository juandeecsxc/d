import { LEADERS } from "../constants.js";

const STORAGE_KEY = "cubo_current_leader";

export function getCurrentLeader() {
  return localStorage.getItem(STORAGE_KEY) || null;
}

export function setCurrentLeader(name) {
  if (LEADERS.includes(name)) {
    localStorage.setItem(STORAGE_KEY, name);
    return true;
  }
  return false;
}

export function clearCurrentLeader() {
  localStorage.removeItem(STORAGE_KEY);
}
