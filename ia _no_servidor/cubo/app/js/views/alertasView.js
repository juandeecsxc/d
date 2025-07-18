import { buscarRespuesta, FALLBACK } from "../qna.js";

export function renderAlertas() {
  setTimeout(() => {
    const box = document.querySelector(".alertas-section .question-box");
    if (!box) return;
    const input = box.querySelector("input");
    const button = box.querySelector("button");
    const respuesta = document.createElement("div");
    box.appendChild(respuesta);
    button.addEventListener("click", async () => {
      const texto = input.value.trim();
      const resultado = await buscarRespuesta("alertas", texto);
      respuesta.textContent = resultado;
      respuesta.className =
        resultado === FALLBACK ? "mensaje-fallback" : "respuesta-texto";
    });
  });

  return `
    <section class="dashboard-section alertas-section">
      <h2>Alertas</h2>
      <img src="app/images/indicadores/indicador1.png" alt="Indicador de Alertas" class="indicador-img">
      <div class="question-box">
        <input type="text" placeholder="Escribe tu pregunta..." />
        <button>Preguntar</button>
      </div>
      <button id="openLeaderBtn" class="leader-btn" style="margin-top:10px;">Líder</button>
    </section>
  `;
}
