import { buscarRespuesta, FALLBACK } from "../qna.js";

export function renderCarteraVigente() {
  setTimeout(() => {
    const box = document.querySelector(".cartera-vigente-section .question-box");
    if (!box) return;
    const input = box.querySelector("input");
    const button = box.querySelector("button");
    const respuesta = document.createElement("div");
    box.appendChild(respuesta);
    button.addEventListener("click", async () => {
      const texto = input.value.trim();
      const resultado = await buscarRespuesta("cartera_vigente", texto);
      respuesta.textContent = resultado;
      respuesta.className =
        resultado === FALLBACK ? "mensaje-fallback" : "respuesta-texto";
    });
  });

  return `
    <section class="dashboard-section cartera-vigente-section">
      <h2>Cartera Vigente</h2>
      <img src="app/images/indicadores/indicador1.png" alt="Indicador de Cartera Vigente" class="indicador-img">
      <div class="question-box">
        <input type="text" placeholder="Escribe tu pregunta..." />
        <button>Preguntar</button>
      </div>
    </section>
  `;
}
