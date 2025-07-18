// Motor de preguntas y respuestas por sección mejorado con detección de intención
export async function buscarRespuesta(seccion, pregunta) {
  if (!pregunta || typeof pregunta !== 'string' || pregunta.trim().length === 0) {
    return {
      respuesta: 'Por favor, proporciona una pregunta válida.',
      esFallback: true
    };
  }

  if (!seccion || typeof seccion !== 'string') {
    return {
      respuesta: 'Sección no especificada para la búsqueda.',
      esFallback: true
    };
  }

  const preguntaNorm = pregunta.trim().toLowerCase();
  const ruta = `app/data/respuestas_${seccion}.json`;

  try {
    const resp = await fetch(ruta);
    if (!resp.ok) throw new Error(`No se pudo cargar el archivo de respuestas para ${seccion}.`);

    const data = await resp.json();
    if (!Array.isArray(data)) throw new Error('Formato de datos incorrecto en el archivo de respuestas.');

    const intencion = detectarIntencion(preguntaNorm);

    for (const item of data) {
      const claves = [...(item.palabras_clave || []), item.indicador || ''].map(p => p.toLowerCase());
      const coincidencia = claves.some(p => preguntaNorm.includes(p));

      if (coincidencia) {
        switch (intencion) {
          case 'estado':
            return { respuesta: item.respuesta, esFallback: false, fuente: seccion, clave: item.indicador };
          case 'valor':
            return { respuesta: `El valor actual de ${item.indicador} es ${item.valor_actual} ${item.unidad}.`, esFallback: false };
          case 'calculo':
            return { respuesta: `Se calcula así: ${item.como_se_construye}`, esFallback: false };
          case 'definicion':
            return { respuesta: `Definición: ${item.definicion}`, esFallback: false };
          default:
            return {
              respuesta: `📊 <strong>${item.indicador}</strong><br>
              Valor actual: ${item.valor_actual} ${item.unidad}<br>
              Meta: ${item.meta}<br>
              Estado: ${item.tendencia}<br>
              Cómo se construye: ${item.como_se_construye}<br>
              Definición: ${item.definicion}<br>
              Fecha de corte: ${item.fecha_corte}`,
              esFallback: false
            };
        }
      }
    }
  } catch (error) {
    console.error('Error en buscarRespuesta:', error);
    return {
      respuesta: 'Error al procesar la pregunta. Contacta al soporte.',
      esFallback: true
    };
  }

  return {
    respuesta: `
      <div style="text-align: center; padding: 20px;">
        <p>No encontré información específica para "<strong>${pregunta}</strong>" en la sección de ${seccion}.</p>
        <p>Puedes:</p>
        <ul style="text-align: left; display: inline-block;">
          <li>Reformular tu pregunta usando palabras clave específicas</li>
          <li>Revisar el informe general del área</li>
          <li>Contactar a Carlos Martínez, creador del informe</li>
        </ul>
        <button class='btn-informe' style="margin-top: 10px; padding: 8px 16px; background: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Abrir informe general
        </button>
      </div>
    `,
    esFallback: true
  };
}

function detectarIntencion(pregunta) {
  if (pregunta.includes('cumple') || pregunta.includes('meta') || pregunta.includes('va bien') || pregunta.includes('estado')) {
    return 'estado';
  }
  if (pregunta.includes('cuánto') || pregunta.includes('valor actual') || pregunta.includes('cuál es el valor')) {
    return 'valor';
  }
  if (pregunta.includes('cómo se calcula') || pregunta.includes('cómo se construye') || pregunta.includes('fórmula')) {
    return 'calculo';
  }
  if (pregunta.includes('qué es') || pregunta.includes('qué significa') || pregunta.includes('definición')) {
    return 'definicion';
  }
  return 'general';
}
