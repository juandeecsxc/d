import { getLeader, setLeader, isLeader } from '../auth/leaderSession.js';
import { loadAlertsFromStorage, createAlert, updateAlert, deleteAlert, getAlertsByAuthor } from '../modules/alertManager.js';
import { SECCIONES } from '../constants.js';

export function renderFinanzas() {
  setTimeout(() => {
    const box = document.querySelector('.dashboard-section .question-box');
    if (!box) return;
    
    let respuestaDiv = box.querySelector('.respuesta-texto, .mensaje-fallback');
    if (!respuestaDiv) {
      respuestaDiv = document.createElement('div');
      respuestaDiv.className = 'respuesta-texto';
      box.appendChild(respuestaDiv);
    }
    
    const input = box.querySelector('input');
    const btn = box.querySelector('button');
    
    // Configurar búsqueda de respuestas
    btn.onclick = async () => {
      if (!input.value.trim()) {
        respuestaDiv.innerHTML = '<span style="color: #dc2626;">Por favor, ingresa una pregunta.</span>';
        return;
      }
      
      respuestaDiv.innerHTML = '<span style="opacity:0.6">Buscando...</span>';
      
      try {
        const { buscarRespuesta } = await import('../qna.js');
        const res = await buscarRespuesta('finanzas', input.value);
        respuestaDiv.className = res.esFallback ? 'mensaje-fallback' : 'respuesta-texto';
        respuestaDiv.innerHTML = res.respuesta;
      } catch (error) {
        respuestaDiv.className = 'mensaje-fallback';
        respuestaDiv.innerHTML = `
          <div style="text-align: center; padding: 20px;">
            <p>Error al buscar respuesta: ${error.message}</p>
            <p>Intenta de nuevo o contacta al administrador.</p>
          </div>
        `;
      }
    };
    
    // Permitir búsqueda con Enter
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        btn.click();
      }
    });
  }, 100);
  
  return `
    <section class="dashboard-section">
      <h2>Finanzas</h2>
      <img src="app/images/finanzas/balance_anual.png" alt="Balance Anual Financiero" class="indicador-img" style="max-width: 100%; height: auto; margin-bottom: 24px;">
      
      <div style="
        background: #f0f9ff;
        border: 1px solid #bae6fd;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 24px;
        font-size: 0.9rem;
        color: #0369a1;
      ">
        <strong>💡 Información:</strong> Esta sección contiene información financiera detallada. 
        Puedes hacer preguntas específicas sobre balances, flujos de caja, presupuestos y métricas financieras.
      </div>
      
      <div class="question-box" style="
        background: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 24px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      ">
        <h3 style="margin-top: 0; color: #374151;">Consulta Financiera</h3>
        <div style="display: flex; gap: 12px; margin-bottom: 16px;">
          <input type="text" placeholder="Ej: balance anual, flujo de caja, presupuesto..." 
                 style="flex: 1; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 1rem;" />
          <button style="
            background: #2563eb;
            color: white;
            border: none;
            border-radius: 6px;
            padding: 12px 24px;
            font-size: 1rem;
            cursor: pointer;
            transition: background 0.2s;
          ">Buscar</button>
        </div>
        <div class="respuesta-texto" style="
          min-height: 60px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 6px;
          border-left: 4px solid #2563eb;
        "></div>
      </div>
      
      <div style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        margin-top: 32px;
      ">
        <div style="
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        ">
          <h4 style="margin-top: 0; color: #374151;">📊 Indicadores Clave</h4>
          <ul style="list-style: none; padding: 0;">
            <li style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">💰 Balance General</li>
            <li style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">📈 Estado de Resultados</li>
            <li style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">💸 Flujo de Caja</li>
            <li style="padding: 8px 0;">📋 Presupuesto Anual</li>
          </ul>
        </div>
        
        <div style="
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        ">
          <h4 style="margin-top: 0; color: #374151;">🎯 Métricas Financieras</h4>
          <ul style="list-style: none; padding: 0;">
            <li style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">📊 ROE (Retorno sobre Capital)</li>
            <li style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">📈 Margen de Utilidad</li>
            <li style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">💼 Ratio de Liquidez</li>
            <li style="padding: 8px 0;">📉 Ratio de Endeudamiento</li>
          </ul>
        </div>
      </div>
    </section>
  `;
} 