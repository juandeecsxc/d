export function renderEmbudo() {
  setTimeout(() => {
    const box = document.querySelector('.dashboard-section .question-box');
    if (!box) return;
    let respuestaDiv = box.querySelector('.respuesta-texto, .mensaje-fallback');
    if (!respuestaDiv) {
      respuestaDiv = document.createElement('div');
      respuestaDiv.style.width = '100%';
      respuestaDiv.style.marginTop = '1.5rem';
      box.parentNode.appendChild(respuestaDiv); // Coloca la respuesta debajo de la pregunta
    }
    const input = box.querySelector('input');
    input.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter') {
        respuestaDiv.innerHTML = '<span style="opacity:0.6">Buscando...</span>';
        const { buscarRespuesta } = await import('../qna.js');
        const res = await buscarRespuesta('embudo', input.value);
        respuestaDiv.className = res.esFallback ? 'mensaje-fallback' : 'respuesta-texto';
        respuestaDiv.innerHTML = res.respuesta;
      }
    });
  }, 100);
  return `
    <section class="dashboard-section flex flex-col min-h-[80vh] w-full px-2 md:px-0">
      <h2 class="text-3xl font-bold mb-4 w-full text-center">Embudo</h2>
      <div class="w-full flex flex-col items-center">
        <div class="embudo-img-block w-full max-w-5xl mx-auto">
          <div class="w-full rounded-xl overflow-hidden shadow-lg bg-white flex items-center justify-center">
            <img src="app/images/embudo/imagenggg.png" alt="Icono de Embudo" class="w-full max-h-80 md:max-h-[28rem] object-contain" />
          </div>
        </div>
        <div class="question-box w-full max-w-3xl bg-blue-50 rounded-xl flex items-center gap-2 p-3 shadow-md mt-8 mx-auto">
          <input type="text" placeholder="Escribe tu pregunta..." class="flex-1 px-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" />
        </div>
        <!-- La respuesta aparecerá debajo de la barra de pregunta -->
      </div>
    </section>
  `;
} 