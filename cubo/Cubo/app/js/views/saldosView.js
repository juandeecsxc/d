import { getLeader, setLeader, isLeader } from '../auth/leaderSession.js';
import { loadAlertsFromStorage, createAlert, updateAlert, deleteAlert, getAlertsByAuthor } from '../modules/alertManager.js';

const SECCIONES = [
  { clave: '', nombre: 'Sin sección' },
  { clave: 'saldo', nombre: 'Saldo' },
  { clave: 'disponible', nombre: 'Disponible' },
  { clave: 'banco', nombre: 'Banco' }
];

export function renderSaldos() {
  setTimeout(() => {
    const box = document.querySelector('.dashboard-section .question-box');
    if (!box) return;
    let respuestaDiv = box.querySelector('.respuesta-texto, .mensaje-fallback');
    if (!respuestaDiv) {
      respuestaDiv = document.createElement('div');
      box.appendChild(respuestaDiv);
    }
    const input = box.querySelector('input');
    const btn = box.querySelector('button');
    btn.onclick = async () => {
      respuestaDiv.innerHTML = '<span style="opacity:0.6">Buscando...</span>';
      const { buscarRespuesta } = await import('../qna.js');
      const res = await buscarRespuesta('saldos', input.value);
      respuestaDiv.className = res.esFallback ? 'mensaje-fallback' : 'respuesta-texto';
      respuestaDiv.innerHTML = res.respuesta;
    };
  }, 100);
  return `
    <section class="dashboard-section">
      <h2>Saldos</h2>
      <img src="app/images/saldos/icono.png" alt="Icono de Saldos" class="indicador-img mx-auto my-4">
      <div class="question-box">
        <input type="text" placeholder="Escribe tu pregunta..." />
        <button>Preguntar</button>
      </div>
    </section>
  `;
} 