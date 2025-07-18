# Cubo Dashboard

Un dashboard interactivo para gestión de alertas y métricas empresariales, diseñado para funcionar 100% offline.

## 🚀 Características

- **Sistema de Alertas**: Gestión de alertas por líderes con autenticación segura
- **Q&A Inteligente**: Sistema de preguntas y respuestas por sección con búsqueda avanzada
- **Navegación Dinámica**: Carga de módulos bajo demanda con menú lateral expandible
- **Almacenamiento Seguro**: Utilidades para manejo seguro de localStorage con validación
- **Indicadores**: Sistema de métricas y KPIs con imágenes dinámicas
- **Responsive**: Diseño adaptable a diferentes dispositivos
- **Accesibilidad**: Navegación por teclado y soporte para lectores de pantalla
- **Funcionamiento Offline**: 100% funcional sin conexión a internet

## 📁 Estructura del Proyecto

```
Cubo/
├── index.html                 # Página principal con favicon integrado
├── app/
│   ├── css/
│   │   └── style.css         # Estilos principales con mejoras de accesibilidad
│   ├── js/
│   │   ├── main.js           # Lógica principal con manejo de errores mejorado
│   │   ├── qna.js            # Motor de Q&A con búsqueda avanzada
│   │   ├── constants.js      # Constantes y configuración del sistema
│   │   ├── auth/
│   │   │   └── leaderSession.js  # Autenticación de líderes con sesiones
│   │   ├── modules/
│   │   │   └── alertManager.js   # Gestor de alertas con estadísticas
│   │   ├── utils/
│   │   │   └── storageUtil.js    # Utilidades de almacenamiento seguro
│   │   └── views/            # Vistas de cada sección
│   │       ├── alertasView.js
│   │       ├── saldosView.js
│   │       ├── embudoView.js
│   │       ├── canalesView.js
│   │       ├── carteraVigenteView.js
│   │       ├── carteraCastigadaView.js
│   │       ├── tacticosView.js
│   │       ├── historicoView.js
│   │       ├── cierreJuntaView.js
│   │       ├── finanzasView.js      # Nueva sección
│   │       ├── rrhhView.js          # Nueva sección
│   │       └── LeaderAlertas.js
│   ├── data/                 # Datos JSON para Q&A
│   │   ├── alertas.json
│   │   ├── respuestas_saldos.json
│   │   ├── respuestas_embudo.json
│   │   ├── respuestas_canales.json
│   │   ├── respuestas_carteraVigente.json
│   │   ├── respuestas_carteraCastigada.json
│   │   ├── respuestas_tacticos.json
│   │   ├── respuestas_historico.json
│   │   ├── respuestas_cierreJunta.json
│   │   ├── respuestas_finanzas.json  # Nuevo archivo
│   │   └── respuestas_rrhh.json      # Nuevo archivo
│   └── images/               # Imágenes e indicadores
│       ├── indicadores/
│       ├── finanzas/
│       ├── rrhh/
│       └── ventas/
└── README.md
```

## 🛠️ Instalación y Uso

### Requisitos
- Navegador moderno con soporte para ES6 modules
- No requiere servidor web (funciona con file://)

### Ejecutar el Proyecto

**Opción 1: Directo (Recomendado)**
```bash
# Simplemente abre el archivo index.html en tu navegador
# Funciona 100% offline
```

**Opción 2: Con servidor local (para desarrollo)**
```bash
# Con Python 3
cd Cubo
python3 -m http.server 8000

# Con Node.js
cd Cubo
npx http-server -p 8000

# Con PHP
cd Cubo
php -S localhost:8000
```

Abrir navegador en: `http://localhost:8000` o directamente `file:///ruta/al/archivo/index.html`

## 👥 Líderes Autorizados

- Tatiana
- Adriana
- Lina
- Juan

## 🔧 Funcionalidades Principales

### 1. Sistema de Alertas de Líderes
- **Autenticación segura** con sesiones de 24 horas
- **CRUD completo**: Crear, editar y eliminar alertas
- **Categorización** por secciones (Riesgo, Incidente, Alerta, etc.)
- **Persistencia** en localStorage con validación
- **Seguridad**: Solo el autor puede editar/eliminar sus alertas
- **Estadísticas**: Conteo de alertas por autor y sección

### 2. Q&A por Secciones
- **Búsqueda inteligente** con coincidencias exactas y parciales
- **Sugerencias automáticas** cuando no hay coincidencias
- **Respuestas basadas** en archivos JSON específicos por sección
- **Manejo robusto de errores** con mensajes informativos
- **Búsqueda en múltiples secciones** simultáneamente

### 3. Navegación Mejorada
- **Menú lateral colapsable** con animaciones suaves
- **Carga dinámica** de módulos bajo demanda
- **Navegación por teclado** completa
- **Diseño responsive** para móviles y tablets
- **Accesibilidad** con roles ARIA y focus visible

### 4. Nuevas Secciones
- **Finanzas**: Balance, flujo de caja, presupuestos, métricas financieras
- **RRHH**: Organigrama, nómina, capacitación, políticas de personal

### 5. Mejoras de Seguridad
- **Sanitización** de datos de entrada
- **Validación** de autenticación en cada operación
- **Manejo seguro** de localStorage con try-catch
- **Prevención de XSS** con escape de HTML
- **Límites** en longitud de mensajes y nombres

### 6. Accesibilidad
- **Navegación por teclado** completa
- **Roles ARIA** para lectores de pantalla
- **Focus visible** para elementos interactivos
- **Contraste** adecuado en colores
- **Reducción de movimiento** para usuarios sensibles

## 📊 Secciones Disponibles

1. **Alertas** - Gestión de alertas y Q&A
2. **Saldos** - Información financiera básica
3. **Embudo** - Métricas de ventas
4. **Canales** - Análisis de canales
5. **Cartera Vigente** - Cartera activa
6. **Cartera Castigada** - Cartera en mora
7. **Tácticos** - Indicadores tácticos
8. **Histórico** - Datos históricos
9. **Cierre de Junta** - Resúmenes ejecutivos
10. **Finanzas** - Información financiera detallada ✨
11. **RRHH** - Recursos humanos y estructura organizacional ✨

## 🔒 Seguridad y Validación

- **Sanitización** de todos los datos de entrada
- **Validación** de autenticación en cada operación crítica
- **Manejo seguro** de localStorage con utilidades especializadas
- **Prevención de XSS** con escape de caracteres especiales
- **Límites** configurados en longitud de mensajes (500 chars) y nombres (30 chars)
- **Sesiones** con timeout automático de 24 horas

## 🐛 Solución de Problemas

### Error de CORS
Si hay problemas de CORS, usa un servidor web local o abre directamente el archivo HTML.

### Módulos no cargan
Verifica que el navegador soporte ES6 modules y que los archivos JavaScript estén en las rutas correctas.

### Alertas no se guardan
Verifica que localStorage esté habilitado en el navegador y que no esté lleno.

### Sesión expirada
Las sesiones expiran automáticamente después de 24 horas. Vuelve a autenticarte.

## 📝 Personalización

### Agregar Nuevas Secciones
1. Crear archivo en `app/js/views/` (ej: `nuevaSeccionView.js`)
2. Agregar entrada en `main.js` seccionMap
3. Crear datos JSON correspondiente en `app/data/respuestas_nuevaSeccion.json`
4. Agregar entrada en el menú del `index.html`

### Modificar Líderes
Editar array `LEADERS` en `app/js/constants.js`

### Cambiar Configuración
Modificar `APP_CONFIG` en `app/js/constants.js`

### Cambiar Estilos
Modificar `app/css/style.css`

## 🆕 Mejoras Implementadas (v1.1.0)

### Nuevas Funcionalidades
- ✅ **Secciones Finanzas y RRHH** completamente funcionales
- ✅ **Favicon integrado** con emoji de gráfico
- ✅ **Estadísticas de alertas** con conteo por autor y sección
- ✅ **Sesiones de líderes** con timeout automático
- ✅ **Búsqueda avanzada** en Q&A con sugerencias
- ✅ **Mejor manejo de errores** con mensajes informativos

### Mejoras de Usabilidad
- ✅ **Accesibilidad mejorada** con roles ARIA y navegación por teclado
- ✅ **Diseño responsive** optimizado para móviles
- ✅ **Animaciones suaves** con reducción de movimiento
- ✅ **Validación de formularios** mejorada
- ✅ **Mensajes de ayuda** contextuales

### Mejoras de Seguridad
- ✅ **Sanitización mejorada** de datos de entrada
- ✅ **Validación de sesiones** con verificación de expiración
- ✅ **Límites de caracteres** configurados
- ✅ **Manejo seguro** de localStorage

### Mejoras Técnicas
- ✅ **Código modular** mejor organizado
- ✅ **Manejo de errores** robusto en todos los módulos
- ✅ **Constantes centralizadas** para configuración
- ✅ **Utilidades reutilizables** para almacenamiento
- ✅ **Eliminación de datos de prueba** automáticos

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Autor

Carlos Martínez - Creador del sistema de informes

---

**Versión**: 1.1.0  
**Última actualización**: Enero 2024  
**Compatibilidad**: Navegadores modernos con ES6 modules  
**Funcionamiento**: 100% offline
