import alertasData from "../data/js/respuestas_alertas.js";
import saldosData from "../data/js/respuestas_saldos.js";
import embudoData from "../data/js/respuestas_embudo.js";
import canalesData from "../data/js/respuestas_canales.js";
import carteraVigenteData from "../data/js/respuestas_cartera_vigente.js";
import carteraCastigadaData from "../data/js/respuestas_cartera_castigada.js";
import tacticosData from "../data/js/respuestas_tacticos.js";
import historicoData from "../data/js/respuestas_historico.js";
import cierreData from "../data/js/respuestas_cierre_de_junta.js";

export const FALLBACK =
  "No encontr\u00e9 datos para tu b\u00fasqueda actual. \u00bfQuieres revisar el" +
  " informe general del \u00e1rea? \nAbrir informe general. O contacta directamente" +
  " a Carlos Mart\u00ednez, creador del informe.";

const RESPUESTAS = {
  alertas: alertasData,
  saldos: saldosData,
  embudo: embudoData,
  canales: canalesData,
  cartera_vigente: carteraVigenteData,
  cartera_castigada: carteraCastigadaData,
  tacticos: tacticosData,
  historico: historicoData,
  cierre_de_junta: cierreData,
};

export async function buscarRespuesta(seccion, pregunta) {
  const datos = RESPUESTAS[seccion] || [];
  const texto = (pregunta || "").toLowerCase();
  for (const par of datos) {
    if (texto.includes(par.clave.toLowerCase())) {
      return par.respuesta;
    }
  }
  return FALLBACK;
}
