/* ============================================================
   ICONS
   ============================================================ */
const ICONS = {
  search:'<svg class="icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
  chip:'<svg class="icon" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2.5"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/></svg>',
  folder:'<svg class="icon" viewBox="0 0 24 24"><path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h4l2 2.5H19a1.5 1.5 0 0 1 1.5 1.5V18A1.5 1.5 0 0 1 19 19.5H4.5A1.5 1.5 0 0 1 3 18z"/></svg>',
  help:'<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9.3 9.2a2.7 2.7 0 1 1 3.9 2.4c-.9.5-1.2 1-1.2 2"/><path d="M12 17h.01"/></svg>',
  gear:'<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.2"/><path d="M19.4 13.5a7.5 7.5 0 0 0 0-3l1.8-1.4-2-3.4-2.1.7a7.4 7.4 0 0 0-2.6-1.5L14 2.5h-4l-.5 2.4a7.4 7.4 0 0 0-2.6 1.5l-2.1-.7-2 3.4L4.6 10.5a7.5 7.5 0 0 0 0 3L2.8 14.9l2 3.4 2.1-.7a7.4 7.4 0 0 0 2.6 1.5l.5 2.4h4l.5-2.4a7.4 7.4 0 0 0 2.6-1.5l2.1.7 2-3.4z"/></svg>',
  lifebuoy:'<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.4"/><path d="M6.3 6.3l3.3 3.3M18 6l-3.3 3.3M18 18l-3.3-3.3M6.3 18l3.3-3.3"/></svg>',
  chevDown:'<svg class="icon" viewBox="0 0 24 24" style="width:13px;height:13px;"><path d="M6 9l6 6 6-6"/></svg>',
  bell:'<svg class="icon" viewBox="0 0 24 24"><path d="M6 10a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 14 6 10z"/><path d="M10 19.5a2 2 0 0 0 4 0"/></svg>',
  paperclip:'<svg class="icon" viewBox="0 0 24 24" style="width:15px;height:15px;"><path d="M8 12.5l6.5-6.5a3 3 0 0 1 4.2 4.2L10 18.9a4.5 4.5 0 1 1-6.4-6.4L12.5 3.7"/></svg>',
  link:'<svg class="icon" viewBox="0 0 24 24" style="width:15px;height:15px;"><path d="M9.5 14.5l5-5"/><path d="M8.3 16.7 5.9 19a3 3 0 0 1-4.2-4.2l3.5-3.5a3 3 0 0 1 4.2 0"/><path d="M15.7 7.3 18 5a3 3 0 1 1 4.2 4.2l-3.5 3.5a3 3 0 0 1-4.2 0"/></svg>',
  wand:'<svg class="icon" viewBox="0 0 24 24" style="width:15px;height:15px;"><path d="M4 20l9-9"/><path d="M15.5 3.5l1 2 2 1-2 1-1 2-1-2-2-1 2-1z"/><path d="M19.5 12.5l.6 1.2 1.2.6-1.2.6-.6 1.2-.6-1.2-1.2-.6 1.2-.6z"/></svg>',
  up:'<svg class="icon" viewBox="0 0 24 24" style="width:15px;height:15px;stroke:#fff;"><path d="M12 19V6M6 11l6-6 6 6"/></svg>',
  briefcase:'<svg class="icon" viewBox="0 0 24 24"><rect x="3" y="7.5" width="18" height="12" rx="2"/><path d="M8 7.5V5.8A1.8 1.8 0 0 1 9.8 4h4.4A1.8 1.8 0 0 1 16 5.8V7.5"/><path d="M3 12.5h18"/></svg>',
  scale:'<svg class="icon" viewBox="0 0 24 24"><path d="M12 3v18M7 21h10"/><path d="M5 7h6M13 7h6"/><path d="M5 7l-3 6a3 3 0 0 0 6 0zM19 7l-3 6a3 3 0 0 0 6 0z"/></svg>',
  eval:'<svg class="icon" viewBox="0 0 24 24"><path d="M7 3h10v18H7z"/><path d="M10 8h4M10 12h4M10 16h2"/></svg>',
  users:'<svg class="icon" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.2"/><path d="M2.5 20c.6-3.4 3.2-5.5 6.5-5.5s5.9 2.1 6.5 5.5"/><circle cx="17.5" cy="8.5" r="2.6"/><path d="M15.5 14.6c2.6.3 4.6 2.2 5.1 5.4"/></svg>',
  shield:'<svg class="icon" viewBox="0 0 24 24"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/></svg>',
  bot:'<svg class="icon" viewBox="0 0 24 24" style="stroke:#fff;"><rect x="4" y="8" width="16" height="11" rx="3"/><circle cx="9" cy="13.5" r="1.2" fill="#fff"/><circle cx="15" cy="13.5" r="1.2" fill="#fff"/><path d="M12 8V4M9 4h6"/></svg>',
  check:'<svg class="icon" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>',
  eye:'<svg class="icon" viewBox="0 0 24 24"><path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="2.6"/></svg>',
  grid:'<svg class="icon" viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.5"/><rect x="13" y="3.5" width="7.5" height="7.5" rx="1.5"/><rect x="3.5" y="13" width="7.5" height="7.5" rx="1.5"/><rect x="13" y="13" width="7.5" height="7.5" rx="1.5"/></svg>',
  logout:'<svg class="icon" viewBox="0 0 24 24"><path d="M9 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H9"/><path d="M20 12H10.5"/><path d="M15.5 7.5L20 12l-4.5 4.5"/></svg>',
};
function I(name){return ICONS[name]||'';}
function setSlot(id, html){ const el=document.getElementById(id); if(el) el.innerHTML=html; }

/* ============================================================
   DATA — extraído de Agentes_IA_por_Modulo_y_Rol.docx (Módulo 2)
   y Documentacion_Modulos_Praias_Cadavid_Fase_1.docx (Módulo 2)
   ============================================================ */
const MODULE_DOC = {
  objetivo:'Analizar la gestión del caso penal, el expediente, el módulo probatorio y las decisiones procesales para convertir la información del caso en acciones jurídicas verificables.',
  responsabilidades:[
    'Identificar información crítica, vacíos e inconsistencias propias del caso.',
    'Consultar fuentes internas y jurídicas aplicables, explicando por qué cada fuente soporta o limita la recomendación.',
    'Generar resultados estructurados para pantalla: resumen, hallazgos, riesgos, responsables, próximos pasos y trazabilidad.',
    'Mantener memoria operativa del módulo con auditoría de documentos usados, decisiones sugeridas y validaciones humanas pendientes.'
  ],
  herramientas:['Búsqueda semántica','OCR','Repositorio jurídico','Calendario procesal','Motor de tareas','Plantillas','Auditoría'],
  infoGenera:['Resumen ejecutivo y hallazgos','Alertas y ranking de prioridad','Documento / JSON de respuesta con fuentes citadas y nivel de confianza','Próximos pasos sugeridos'],
  aprobacion:'La IA no puede cerrar, aprobar ni emitir conceptos definitivos sin revisión humana. Todo resultado debe ser revisado y aprobado por el rol correspondiente antes de incorporarse formalmente al expediente.'
};

const AGENTS = {
  gestion:{
    nombre:'Agente de Gestión de Casos Penales', especialidad:'Coordinación integral del expediente penal económico',
    queEs:'Asistente de IA del Módulo 02 que apoya la coordinación del expediente y la construcción de la teoría del caso, bajo supervisión humana.',
    tareas:['Analizar hechos, documentos y pruebas del expediente','Coordinar etapas, tareas y responsables del caso','Detectar bloqueos probatorios y proponer reasignaciones','Proponer teoría del caso, actuaciones y argumentos'],
    infoTrabaja:['Documentos y metadatos del expediente','Estado del caso, responsables y fechas','Matriz probatoria y evidencias asociadas','Reglas y fuentes jurídicas aplicables'],
  },
  probatorio:{
    nombre:'Agente Probatorio', especialidad:'Análisis y organización de evidencia probatoria',
    queEs:'Asistente de IA del Módulo 02 especializado en clasificar, verificar y organizar la evidencia dentro de la matriz probatoria, bajo supervisión humana.',
    tareas:['Clasificar y extraer datos de documentos y evidencias','Elaborar y actualizar el checklist probatorio','Detectar inconsistencias entre documentos','Presentar información autorizada en lenguaje claro cuando el usuario es un Cliente'],
    infoTrabaja:['Documentos aportados y matriz probatoria','Evidencias, su estado y relevancia','Datos extraídos pendientes de validación'],
  },
  recomendacion:{
    nombre:'Agente de Recomendación Procesal', especialidad:'Análisis estratégico y recomendación de rutas procesales',
    queEs:'Asistente de IA del Módulo 02 orientado a la lectura ejecutiva del caso y a la recomendación de rutas procesales para decisiones de alto nivel, bajo supervisión humana.',
    tareas:['Resumir el estado del caso a nivel ejecutivo','Comparar rutas procesales alternativas','Advertir riesgos estratégicos antes de una decisión','Preparar la recomendación procesal para aprobación'],
    infoTrabaja:['Resumen consolidado del caso','Riesgos, decisiones pendientes y matriz probatoria','Recomendaciones previas del equipo jurídico'],
  },
};

const SUGGESTIONS_BY_AGENT = {
  gestion:[
    {id:'analizar_caso', label:'Analizar el caso actual'},
    {id:'estado_caso', label:'Revisar el estado del caso'},
    {id:'info_faltante', label:'Identificar información faltante'},
    {id:'preparar_siguiente', label:'Preparar información para el siguiente rol'},
    {id:'resumir_docs', label:'Resumir documentos del expediente'},
  ],
  probatorio:[
    {id:'revisar_evidencia', label:'Revisar la evidencia'},
    {id:'analizar_matriz', label:'Analizar la Matriz Probatoria'},
    {id:'info_faltante', label:'Identificar información faltante'},
    {id:'resumir_docs', label:'Resumir documentos'},
    {id:'estado_caso', label:'Revisar el estado del caso'},
  ],
  recomendacion:[
    {id:'analizar_caso', label:'Analizar el caso actual'},
    {id:'estado_caso', label:'Revisar el estado del caso'},
    {id:'analizar_matriz', label:'Analizar la Matriz Probatoria'},
    {id:'preparar_siguiente', label:'Preparar recomendación para aprobación'},
  ],
};

/* sugerencias dinámicas: dependen de agente + rol + caso + etapa del caso */
function getSuggestions(agentId, roleId, c){
  const base = SUGGESTIONS_BY_AGENT[agentId].map(s=>({...s}));
  const nxt = nextRoleId(roleId);
  return base.map(s=>{
    if(s.id==='preparar_siguiente'){
      if(!nxt || (c && c.progreso>=100)) return {...s, label:'Revisar el cierre del caso'};
      return {...s, label:`Preparar información para ${roleById(nxt).nombre}`};
    }
    if(s.id==='estado_caso' && c){
      return {...s, label: c.progreso>=100 ? 'Revisar el estado del caso (cerrado)' : '¿Qué debería revisar a continuación?'};
    }
    return s;
  });
}

/* 5 roles exclusivos (item 8 documento fuente) */
const ROLES = [
  {
    id:'director', order:1, icon:'scale', code:'DI',
    nombre:'Director', detalle:'Director jurídico / Coordinador de caso',
    resumen:'Coordina el expediente, asigna responsables y controla el avance técnico del caso.',
    participacion:'Coordinación jurídica y control técnico',
    permisos:['Crear','Editar','Asignar','Revisar','Aprobar'],
    recibe:'Recibe el requerimiento inicial del cliente remitido por la firma; es quien crea el caso en la plataforma.',
    revisa:'Revisa la documentación de vinculación, el objeto del proceso penal económico y la disponibilidad de responsables.',
    gestiona:'Gestiona la apertura del expediente, la asignación del Abogado y la definición de plazos.',
    decisiones:'Decide quién asume el caso, la prioridad y cuándo escalar al Socio.',
    resultado:'Genera el registro inicial del caso, con estado "en curso" y tareas asignadas.',
    entrega:'Entrega el caso al Abogado para la ejecución operativa y el análisis jurídico.',
    recibePosterior:'Recibe del Abogado el estado de avance, alertas y bloqueos probatorios para coordinar el caso.',
    cuandoIA:'Consulta al Agente de Gestión de Casos Penales para tener visibilidad del estado por etapa y detectar bloqueos antes de reasignar tareas.',
    agentes:[{id:'gestion', funcion:'Coordina expediente, etapas, tareas y evidencia; detecta bloqueos probatorios y recomienda qué debe revisarse o reasignarse.', comoAyuda:'Le da al Director visibilidad inmediata del estado del caso por etapa, sin revisar manualmente cada documento.'}]
  },
  {
    id:'abogado', order:2, icon:'briefcase', code:'AB',
    nombre:'Abogado', detalle:'Ejecución operativa, análisis jurídico y revisión probatoria',
    resumen:'Ejecuta el análisis jurídico del caso y construye la teoría de defensa.',
    participacion:'Ejecución operativa y análisis jurídico',
    permisos:['Crear/editar asignados','Cargar documentos'],
    recibe:'Recibe el caso asignado por el Director, con la documentación inicial de vinculación del cliente.',
    revisa:'Revisa el contrato, los hechos denunciados, los documentos aportados y la matriz probatoria disponible.',
    gestiona:'Gestiona la solicitud de documentos al Cliente y delega en el Administrativo la clasificación y cargue documental.',
    decisiones:'Decide la línea de defensa preliminar y qué evidencia se solicita o descarta.',
    resultado:'Genera el análisis del expediente con teoría preliminar del caso y actuaciones sugeridas.',
    entrega:'Entrega la solicitud formal de documentos al Cliente y las tareas de organización documental al Administrativo.',
    recibePosterior:'Recibe del Cliente los documentos aportados y del Administrativo la matriz probatoria actualizada.',
    cuandoIA:'Usa el Agente de Gestión de Casos Penales para construir la teoría del caso y el Agente Probatorio para validar el estado de la evidencia.',
    agentes:[
      {id:'gestion', funcion:'Analiza hechos, documentos y pruebas del expediente para proponer teoría del caso, actuaciones, argumentos y documentos necesarios.', comoAyuda:'Ayuda al Abogado a construir la teoría del caso y a decidir qué actuaciones y documentos se necesitan.'},
      {id:'probatorio', funcion:'Revisa el estado de la matriz probatoria consolidada por el Administrativo y señala inconsistencias antes de validar la evidencia.', comoAyuda:'Ayuda al Abogado a validar rápidamente si la evidencia recaudada respalda la teoría del caso.'}
    ]
  },
  {
    id:'cliente', order:3, icon:'users', code:'CL',
    nombre:'Cliente', detalle:'Cliente autorizado',
    resumen:'Consulta el avance del caso y aporta la documentación solicitada.',
    participacion:'Consulta de avances autorizados',
    permisos:['Lectura restringida','Descarga controlada'],
    recibe:'Recibe del Abogado la solicitud formal de documentos (extractos bancarios, correos internos, certificaciones societarias).',
    revisa:'Revisa únicamente los avances y solicitudes autorizadas visibles en el portal, sin acceso a la estrategia interna.',
    gestiona:'Gestiona la recopilación y el cargue de los documentos solicitados dentro del portal seguro.',
    decisiones:'Decide qué documentación adicional entregar y puede autorizar el contacto con terceros.',
    resultado:'Genera el cargue de documentos autorizados y confirma solicitudes atendidas.',
    entrega:'Entrega los documentos aportados al Abogado y al Administrativo para continuar el análisis.',
    recibePosterior:'Recibe actualizaciones de avance autorizadas y mensajes seguros a través del portal.',
    cuandoIA:'Usa el Agente Probatorio para conocer, en lenguaje claro, qué documentos ya se incorporaron y cuáles siguen pendientes.',
    agentes:[{id:'probatorio', funcion:'Presenta únicamente la información autorizada del expediente probatorio en lenguaje claro, ocultando la estrategia interna del caso.', comoAyuda:'Le permite al Cliente saber, sin tecnicismos, qué avanzó y qué falta por entregar.'}]
  },
  {
    id:'administrativo', order:4, icon:'eval', code:'AD',
    nombre:'Administrativo', detalle:'Soporte documental y operativo',
    resumen:'Organiza, clasifica y mantiene actualizada la matriz probatoria del caso.',
    participacion:'Soporte documental y operativo',
    permisos:['Carga documental','Consulta limitada'],
    recibe:'Recibe del Abogado los documentos aportados por el Cliente para su organización y clasificación.',
    revisa:'Revisa extractos, contratos y certificaciones para clasificarlos y verificar que estén completos.',
    gestiona:'Gestiona el cargue, la clasificación y el checklist documental dentro del expediente.',
    decisiones:'Decide qué documentos están completos y cuáles deben reportarse como pendientes o inconsistentes.',
    resultado:'Genera un checklist documental y una matriz probatoria organizada y actualizada.',
    entrega:'Entrega la matriz probatoria actualizada y el checklist al Abogado.',
    recibePosterior:'Recibe validaciones o correcciones del Abogado sobre la matriz entregada.',
    cuandoIA:'Usa el Agente Probatorio para acelerar la clasificación de documentos y la detección de inconsistencias.',
    agentes:[{id:'probatorio', funcion:'Indica qué documentos revisar, qué datos extraer, cómo clasificar pruebas y qué inconsistencias reportar.', comoAyuda:'Acelera la clasificación documental y reduce el riesgo de omitir evidencia relevante.'}]
  },
  {
    id:'socio', order:5, icon:'shield', code:'SO',
    nombre:'Socio', detalle:'Socio administrador / Socio director',
    resumen:'Supervisa el caso a nivel estratégico y aprueba las decisiones de mayor impacto.',
    participacion:'Supervisión y aprobación estratégica',
    permisos:['Lectura global','Reportes','Aprobaciones'],
    recibe:'Recibe el informe consolidado del caso remitido por el Director y el Abogado, con la matriz probatoria y la teoría del caso.',
    revisa:'Revisa el resumen ejecutivo, los riesgos estratégicos y las decisiones pendientes de nivel directivo.',
    gestiona:'Gestiona la aprobación estratégica del caso y la eventual comunicación de alto nivel con el cliente.',
    decisiones:'Aprueba la estrategia procesal definitiva o solicita una nueva revisión.',
    resultado:'Genera la aprobación formal registrada en el expediente, con trazabilidad completa.',
    entrega:'Entrega la autorización formal al Director para ejecutar la estrategia aprobada, cerrando el ciclo del flujo.',
    recibePosterior:'Recibe reportes de seguimiento sobre la ejecución de lo aprobado.',
    cuandoIA:'Consulta al Agente de Recomendación Procesal antes de aprobar, para validar que no existan riesgos estratégicos no advertidos.',
    agentes:[{id:'recomendacion', funcion:'Resume el estado penal del caso, expone decisiones de alto impacto, compara rutas procesales y advierte riesgos estratégicos antes de aprobar acciones.', comoAyuda:'Le permite al Socio aprobar con una lectura ejecutiva del caso, sin revisar todo el expediente.'}]
  },
];
const roleById = id => ROLES.find(r=>r.id===id);
const FLOW_ORDER = ['director','abogado','cliente','administrativo','socio'];
function nextRoleId(id){ const i=FLOW_ORDER.indexOf(id); return i>=0 && i<FLOW_ORDER.length-1 ? FLOW_ORDER[i+1] : null; }

const HECHOS = { H1:'Ejecución del contrato', H2:'Manejo de recursos', H3:'Conocimiento directivo', H4:'Estructura societaria' };

const CASES = [
  {
    id:'CP-2026-0143', nombre:'Constructora Andina S.A.S.', tipo:'Peculado y lavado de activos · Contrato de obra pública No. 045-2024',
    estado:'En curso', responsableRole:'abogado', fecha:'2026-09-22', ultimaActividad:'Hoy', progreso:62,
    matriz:[
      {ev:'Contrato de obra pública No. 045-2024', tipo:'Documental', pretende:'Acreditar la existencia y condiciones del contrato suscrito con el municipio de Sabaneta.', hecho:'H1', fuente:'Secretaría de Infraestructura - Alcaldía de Sabaneta', estado:'verificada', relev:'alta', resp:'administrativo', obs:'Copia auténtica aportada por el cliente.'},
      {ev:'Extractos bancarios cuenta empresarial (ene–jun 2025)', tipo:'Documental financiera', pretende:'Establecer la trazabilidad de los desembolsos girados por el contrato.', hecho:'H2', fuente:'Banco de Occidente', estado:'revision', relev:'alta', resp:'abogado', obs:'Pendiente de conciliar con la facturación del contrato.'},
      {ev:'Declaración del interventor de obra', tipo:'Testimonial', pretende:'Contrastar la ejecución real de la obra frente a lo facturado.', hecho:'H1', fuente:'Interventoría externa', estado:'pendiente', relev:'media', resp:'administrativo', obs:'Requiere autorización previa del cliente para el contacto.'},
      {ev:'Informe pericial contable preliminar', tipo:'Pericial', pretende:'Determinar si existió apropiación de recursos públicos del contrato.', hecho:'H2', fuente:'Perito contable independiente', estado:'verificada', relev:'alta', resp:'administrativo', obs:'Incorporado tras análisis con Agente Probatorio, revisado y aprobado por el Abogado.'},
      {ev:'Correos internos de la constructora (ene–mar 2025)', tipo:'Documental digital', pretende:'Determinar el conocimiento previo de los directivos sobre presuntas irregularidades.', hecho:'H3', fuente:'Cliente (aportado voluntariamente)', estado:'verificada', relev:'media', resp:'cliente', obs:'Sujeto a reserva por confidencialidad.'},
      {ev:'Certificación de movimientos societarios', tipo:'Documental', pretende:'Establecer la estructura societaria y posibles terceros vinculados.', hecho:'H4', fuente:'Cámara de Comercio', estado:'pendiente', relev:'media', resp:'director', obs:'Solicitada al cliente, en espera de cargue en el portal.'},
    ]
  },
  {
    id:'CP-2026-0098', nombre:'Sociedad Minera del Cauca', tipo:'Presunto lavado de activos · Título minero No. 12-2023',
    estado:'En revisión técnica', responsableRole:'director', fecha:'2026-08-10', ultimaActividad:'Hace 3 días', progreso:40,
    matriz:[
      {ev:'Contrato de exploración minera No. 12-2023', tipo:'Documental', pretende:'Acreditar el título minero y sus condiciones.', hecho:'H1', fuente:'Agencia Nacional de Minería', estado:'verificada', relev:'alta', resp:'director', obs:'Aportado en la etapa de vinculación.'},
      {ev:'Reporte de operaciones sospechosas (ROS)', tipo:'Documental financiera', pretende:'Determinar el origen de los recursos reportados.', hecho:'H2', fuente:'UIAF', estado:'revision', relev:'alta', resp:'abogado', obs:'En análisis por el equipo jurídico.'},
    ]
  },
  {
    id:'CP-2026-0071', nombre:'Grupo Empresarial Ferretero S.A.', tipo:'Corrupción privada · Cierre de caso',
    estado:'Cerrado / Aprobado', responsableRole:'socio', fecha:'2026-06-02', ultimaActividad:'Hace 3 semanas', progreso:100,
    matriz:[
      {ev:'Actas de junta directiva 2024', tipo:'Documental', pretende:'Establecer conocimiento de directivos sobre pagos irregulares.', hecho:'H3', fuente:'Secretaría general de la empresa', estado:'verificada', relev:'alta', resp:'administrativo', obs:'Clasificadas y validadas.'},
      {ev:'Informe pericial financiero definitivo', tipo:'Pericial', pretende:'Cuantificar el beneficio económico irregular.', hecho:'H2', fuente:'Perito financiero', estado:'verificada', relev:'alta', resp:'abogado', obs:'Aprobado por el Socio.'},
      {ev:'Resumen ejecutivo de cierre', tipo:'Documental', pretende:'Consolidar la decisión final del caso.', hecho:'H4', fuente:'Dirección jurídica', estado:'verificada', relev:'media', resp:'socio', obs:'Caso aprobado y cerrado.'},
    ]
  },
];
const caseById = id => CASES.find(c=>c.id===id);

/* canned deep-analysis templates (agentId_roleId) reused for "analizar_caso" / "analizar_matriz" */
const DEEP_TEMPLATES = {
  gestion_director:{ resumen:'Bandeja de coordinación del caso {CASE}: avance general {PROG}%. Se identifican tareas críticas y posibles bloqueos probatorios que requieren tu atención.', hallazgos:['Hay evidencia en estado "En revisión" o "Pendiente de recaudo" que puede afectar el cronograma.','El Abogado reporta avances que deben validarse antes del siguiente comité de caso.'], recomendacion:'Prioriza la resolución de los bloqueos probatorios y confirma la asignación de responsables antes del próximo corte de seguimiento.' },
  gestion_abogado:{ resumen:'Los hechos documentados en el expediente de {CASE} permiten construir una teoría preliminar del caso, sujeta a validación de la evidencia pendiente.', hallazgos:['La documentación contractual respalda parcialmente la línea de defensa.','Persisten inconsistencias entre la evidencia financiera y la documental que deben conciliarse.'], recomendacion:'Solicita al Administrativo la conciliación de la evidencia pendiente antes de fijar la teoría definitiva del caso.' },
  probatorio_abogado:{ resumen:'Estado de la matriz probatoria de {CASE} desde la perspectiva de validación jurídica: {VER} de {TOTAL} evidencias verificadas.', hallazgos:['Existen evidencias de relevancia alta aún en revisión.','El Administrativo debe confirmar la clasificación de los documentos recientes.'], recomendacion:'Valida las evidencias marcadas como "Verificada" antes de incorporarlas formalmente a la teoría del caso.' },
  probatorio_administrativo:{ resumen:'Checklist probatorio de {CASE}: {VER} de {TOTAL} evidencias verificadas, {PEND} pendientes de recaudo o revisión.', hallazgos:['Se detectaron inconsistencias entre montos documentados que deben escalarse al Abogado.','Hay evidencia pendiente de cargue por parte del Cliente.'], recomendacion:'Escala al Abogado las inconsistencias detectadas y reitera al Cliente los documentos pendientes.' },
  probatorio_cliente:{ resumen:'Resumen para el cliente sobre {CASE}: parte de la documentación solicitada ya fue incorporada al expediente.', hallazgos:['Algunos documentos solicitados siguen pendientes de cargue.','La información interna del caso permanece reservada para tu perfil.'], recomendacion:'Carga los documentos pendientes en el portal seguro para agilizar el análisis del equipo jurídico.' },
  recomendacion_socio:{ resumen:'El caso {CASE} presenta un avance del {PROG}%. Se identifican riesgos estratégicos que conviene revisar antes de aprobar la siguiente actuación.', hallazgos:['La línea de defensa depende de evidencia que aún está en proceso de verificación.','Existen decisiones de alto impacto pendientes de tu aprobación.'], recomendacion:'Autoriza continuar solo si la evidencia crítica ha sido verificada; de lo contrario, solicita una nueva revisión al Director.' },
};

/* ============================================================
   STATE
   ============================================================ */
let currentRoleId = 'abogado';
let currentCaseId = 'CP-2026-0143';
let currentView = 'agentes';
let toastTimer;
let activeChatAgentId = null; // agente activo embebido en el Chat AI (no modal)
const CHAT_SESSIONS = {}; // key: agentId_roleId_caseId -> [{who:'user'|'agent', text, html}]

function currentCase(){ return caseById(currentCaseId); }
function currentRole(){ return roleById(currentRoleId); }

/* ============================================================
   ICON SLOTS (static chrome)
   ============================================================ */
setSlot('icon-slot-search', I('search')+'<span>Buscar en el caso</span>');
setSlot('icon-slot-modulos', I('grid')+'<span>Módulos</span>');
setSlot('icon-slot-agentes', I('chip')+'<span>Agentes</span>');
setSlot('icon-slot-casos', I('folder')+'<span>Casos Penales</span>');
setSlot('icon-slot-config', I('gear')+'<span>Configuración</span>');
setSlot('icon-slot-rschev', I('chevDown'));
setSlot('icon-slot-tbsearch', I('search'));
setSlot('icon-slot-tbbell', I('bell'));
setSlot('icon-slot-paperclip', I('paperclip'));
setSlot('icon-slot-link', I('link'));
setSlot('icon-slot-wand', I('wand'));
document.getElementById('promptSendBtn').innerHTML = I('up');

/* ============================================================
   SIDEBAR NAV
   ============================================================ */
document.querySelectorAll('.sb-nav li[data-view]').forEach(li=>{
  li.addEventListener('click', ()=>{
    document.querySelectorAll('.sb-nav li[data-view]').forEach(x=>x.classList.remove('active'));
    li.classList.add('active');
    showView(li.dataset.view);
  });
});
document.querySelectorAll('[data-view-btn]').forEach(b=>b.addEventListener('click',()=>{
  showView(b.dataset.viewBtn);
  document.querySelectorAll('.sb-nav li[data-view]').forEach(x=>x.classList.toggle('active', x.dataset.view===b.dataset.viewBtn));
}));

function showView(name){
  currentView = name;
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.getElementById('view-'+name).classList.add('active');
  document.querySelector('.app').classList.toggle('view-fill', name==='ejecutiva');
  document.querySelector('.sidebar').classList.toggle('in-modulo', name!=='modulos');
  window.scrollTo({top:0, behavior:'smooth'});
  if(name==='casos'){ backToCasosList(); }
  if(name==='alertas'){ renderAlertasView(); }   // casos-penales.js
  if(name==='ejecutiva'){ renderEjecutiva(); }    // casos-penales.js
  if(name==='modulos'){ buildModulosGrid(); }
  buildBreadcrumb();
}

/* ============================================================
   MÓDULOS (selector de plataforma)
   ============================================================ */
const MODULOS = [
  {n:1,  nombre:'Plataforma Integral de Investigación Defensiva'},
  {n:2,  nombre:'Sistema de Gestión de Casos Penales con Módulo Probatorio', activo:true},
  {n:3,  nombre:'Motor de Análisis de Riesgo Penal Corporativo'},
  {n:4,  nombre:'Repositorio Jurídico Inteligente'},
  {n:5,  nombre:'Plataforma de Evidencia Digital Forense'},
  {n:6,  nombre:'Portal Seguro para Clientes de Alto Perfil'},
  {n:7,  nombre:'Sistema de Control de Calidad Jurídica'},
  {n:8,  nombre:'Dashboard de Inteligencia Operativa'},
  {n:9,  nombre:'Plataforma de Capacitación Interna Penal'},
  {n:10, nombre:'Generador de Cápsulas Jurídicas Automatizado'},
  {n:11, nombre:'Sistema de Gestión Documental con IA'},
  {n:12, nombre:'IA para Análisis de Contradicciones en Testimonios'},
  {n:13, nombre:'IA para Análisis de Documentos Financieros'},
  {n:14, nombre:'Sistema de Gestión de Entrevistas con IA'},
  {n:15, nombre:'IA para Modelos de Estrategia Defensiva'},
  {n:16, nombre:'Plataforma de Gestión de Tareas Jurídicas'},
  {n:17, nombre:'IA para Análisis de Jurisprudencia Comparada'},
  {n:18, nombre:'Sistema de Alertas Procesales Inteligentes'},
  {n:19, nombre:'IA para Redacción Jurídica Avanzada'},
  {n:20, nombre:'Plataforma de Gestión de Evidencia Audiovisual'},
];
function buildModulosGrid(){
  const grid = document.getElementById('modulosGrid');
  grid.innerHTML = MODULOS.map(m=>`
    <div class="modulo-card ${m.activo?'activo':'disabled'}" data-modulo="${m.n}">
      <div class="mc-top"><span class="tag ${m.activo?'ok':''}">${m.activo?'Disponible':'Próximamente'}</span></div>
      <b class="mc-nombre">${esc(m.nombre)}</b>
    </div>`).join('');
  grid.querySelectorAll('.modulo-card').forEach(card=>{
    card.addEventListener('click', ()=>{
      const m = MODULOS.find(x=>x.n===+card.dataset.modulo);
      if(!m.activo){ showToast('Este módulo estará disponible próximamente.'); return; }
      goView('casos');
    });
  });
}

/* ============================================================
   TOP CASE CHIP
   ============================================================ */
function renderCaseChip(){
  const c = currentCase();
  document.getElementById('topCaseChip').innerHTML = `<span class="dot"></span>Caso <b>${c.id}</b> · ${c.estado}`;
}
document.getElementById('topCaseChip').addEventListener('click', ()=>{ showView('casos'); document.querySelectorAll('.sb-nav li[data-view]').forEach(x=>x.classList.toggle('active', x.dataset.view==='casos')); });

/* ============================================================
   ROLE SWITCHER
   ============================================================ */
const roleMenu = document.getElementById('roleMenu');
const roleMenuList = document.getElementById('roleMenuList');
function buildRoleMenu(){
  roleMenuList.innerHTML = '';
  ROLES.slice().sort((a,b)=>a.order-b.order).forEach(r=>{
    const b = document.createElement('button');
    b.className = r.id===currentRoleId ? 'active' : '';
    b.innerHTML = `<span class="rm-av">${r.code}</span><span><b style="display:block;">${r.nombre}</b><span class="rm-desc">${r.participacion}</span></span>${r.id===currentRoleId ? '<span class="rm-check">'+I('check')+'</span>' : ''}`;
    b.addEventListener('click', ()=>{ setRole(r.id); roleMenu.classList.remove('open'); });
    roleMenuList.appendChild(b);
  });
}
document.getElementById('roleSwitchBtn').addEventListener('click', (e)=>{ e.stopPropagation(); buildRoleMenu(); roleMenu.classList.toggle('open'); });
document.addEventListener('click', (e)=>{ if(!roleMenu.contains(e.target) && e.target.id!=='roleSwitchBtn' && !document.getElementById('roleSwitchBtn').contains(e.target)) roleMenu.classList.remove('open'); });

/* ============================================================
   MIGA DE PAN (breadcrumb)
   ============================================================ */
// Sub-vistas que no viven en el sidebar pero sí necesitan reflejar en dónde está el usuario
// (p.ej. el formulario de caso, que cuelga de "Casos Penales").
const BC_SUBVIEWS = {
  casoform: { parent:'casos', label: ()=> (typeof cfMode!=='undefined' && cfMode==='editar') ? 'Editar caso' : 'Nuevo caso' },
};
document.addEventListener('click', (e)=>{
  const menu = document.getElementById('bcMenu');
  if(menu && menu.classList.contains('open') && !menu.contains(e.target) && !e.target.closest('#bcCurrentBtn')) menu.classList.remove('open');
});
function buildBreadcrumb(){
  const bar = document.getElementById('breadcrumbBar');
  const items = [...document.querySelectorAll('#sbSubnav li[data-view]')].filter(li=>!li.classList.contains('hidden-by-role'));
  const current = items.find(li=>li.dataset.view===currentView);
  const sub = BC_SUBVIEWS[currentView];
  // La miga de pan solo aplica al contenido propio del módulo (anidado bajo "Módulos"),
  // no a las secciones transversales (Agentes, Vista ejecutiva, FAQ, Configuración, Ayuda).
  if(!current && !sub){ bar.classList.add('hidden'); bar.innerHTML = ''; return; }
  bar.classList.remove('hidden');

  if(current){
    bar.innerHTML = `<button class="bc-item" id="bcModulos">Módulos</button><span class="bc-sep">/</span>
      <div class="bc-current-wrap"><button class="bc-current" id="bcCurrentBtn"><span>${current.querySelector('span')?.textContent||''}</span><span class="bc-chev">${I('chevDown')}</span></button>
      <div class="bc-menu" id="bcMenu"></div></div>`;
    document.getElementById('bcModulos').addEventListener('click', ()=> goView('modulos'));
    const bcMenu = document.getElementById('bcMenu');
    document.getElementById('bcCurrentBtn').addEventListener('click', (e)=>{ e.stopPropagation(); bcMenu.classList.toggle('open'); });
    bcMenu.innerHTML = items.map(li=>`<button data-view="${li.dataset.view}" class="${li.dataset.view===currentView?'active':''}">${li.innerHTML}</button>`).join('');
    bcMenu.querySelectorAll('button[data-view]').forEach(b=> b.addEventListener('click', ()=>{ goView(b.dataset.view); bcMenu.classList.remove('open'); }));
  } else if(sub){
    const parentLi = items.find(li=>li.dataset.view===sub.parent);
    bar.innerHTML = `<button class="bc-item" id="bcModulos">Módulos</button><span class="bc-sep">/</span>
      <button class="bc-item" id="bcParent">${parentLi ? parentLi.querySelector('span')?.textContent : ''}</button><span class="bc-sep">/</span>
      <span class="bc-current-label">${sub.label()}</span>`;
    document.getElementById('bcModulos').addEventListener('click', ()=> goView('modulos'));
    document.getElementById('bcParent').addEventListener('click', ()=> goView(sub.parent));
  }
}

function setRole(id){
  currentRoleId = id;
  const r = currentRole();
  document.getElementById('roleAvatar').textContent = r.code;
  document.getElementById('roleLabelName').textContent = r.nombre;
  if(activeChatAgentId && !r.agentes.some(a=>a.id===activeChatAgentId)){
    activeChatAgentId = null;
  }
  renderAgentesView();
  buildFlow();
  buildStepper();
  onRoleChangeCP(); // casos-penales.js: permisos, navegación y vistas dependientes del rol
  showToast('Rol activo: ' + r.nombre);
}

/* ============================================================
   AGENTES VIEW
   ============================================================ */
function renderAgentesView(){
  const r = currentRole();
  const c = currentCase();
  const heroTitle = document.getElementById('agHeroTitle');
  const heroSub = document.getElementById('agHeroSub');
  const avatar = document.getElementById('heroAgentAvatar');
  const backBtn = document.getElementById('heroBackBtn');
  const ctxLine = document.getElementById('chatContextLine');
  const thread = document.getElementById('chatThread');
  const input = document.getElementById('promptInput');
  const inputWrap = document.getElementById('chatInputWrap');

  if(activeChatAgentId){
    // el cuadro principal (promptbox) SE CONVIERTE en el Chat AI del agente activo;
    // el chat ocupa la parte inferior de la interfaz: el hilo crece con la página y
    // el campo de entrada queda acoplado (sticky) al fondo mientras se conversa.
    const meta = AGENTS[activeChatAgentId];
    heroTitle.textContent = meta.nombre;
    heroSub.textContent = meta.especialidad;
    avatar.innerHTML = I('bot').replace('style="stroke:#fff;"','');
    avatar.style.display = 'flex';
    backBtn.style.display = 'inline-flex';
    ctxLine.style.display = 'block';
    ctxLine.innerHTML = `<b>${c.id}</b> · ${c.nombre} — ${c.tipo}. Consultando como <b>${r.nombre}</b>. ${MODULE_DOC.aprobacion}`;
    input.placeholder = `Escribe tu pregunta para ${meta.nombre}...`;
    thread.style.display = 'flex';
    inputWrap.classList.add('docked');
    if(!CHAT_SESSIONS[sessionKey()]){
      CHAT_SESSIONS[sessionKey()] = [{who:'agent', html:`<b>${meta.nombre}</b>Hola, soy el ${meta.nombre}. Trabajo con ${r.nombre} en el caso ${c.id}. Elige una sugerencia o escribe tu pregunta.`}];
    }
    renderThread();
  } else {
    heroTitle.textContent = `Hola, ${r.nombre}. Estos son tus AI Agents`;
    heroSub.textContent = `Módulo 02 · ${r.detalle}. Los agentes que ves a continuación corresponden únicamente a las responsabilidades de este rol.`;
    avatar.style.display = 'none';
    backBtn.style.display = 'none';
    ctxLine.style.display = 'none';
    input.placeholder = 'Escribe tu pregunta y se enviará al agente principal de tu rol...';
    thread.style.display = 'none';
    thread.innerHTML = '';
    inputWrap.classList.remove('docked');
  }

  document.getElementById('agSectionTitle').textContent = `Agentes para ${r.nombre}`;
  document.getElementById('suggestionPillsHolder').style.display = activeChatAgentId ? 'none' : 'flex';
  renderSuggestionsMain();

  // mientras hay un agente activo en el Chat AI, se oculta toda la lista de agentes:
  // solo queda el chat. Al volver, reaparecen todos los agentes del rol.
  const listSection = document.getElementById('agentsListSection');
  listSection.style.display = activeChatAgentId ? 'none' : 'block';

  const grid = document.getElementById('agentGrid');
  grid.innerHTML = '';
  if(!activeChatAgentId){
    r.agentes.forEach(a=>{
      const meta = AGENTS[a.id];
      const card = document.createElement('div');
      card.className = 'role-card';
      card.innerHTML = `
        <div class="r-top">
          <div class="role-icon">${I('bot').replace('style="stroke:#fff;"','')}</div>
          <span class="role-count">${r.nombre}</span>
        </div>
        <h3>${meta.nombre}</h3>
        <div class="fi-actions">
          <button class="btn primary sm" data-usar="${a.id}">Usar agente</button>
          <button class="btn sm" data-doc="${a.id}">Ver cómo funciona</button>
        </div>
      `;
      card.querySelector('[data-doc]').addEventListener('click', ()=> openAgentDoc(a.id));
      card.querySelector('[data-usar]').addEventListener('click', ()=> activateAgent(a.id));
      grid.appendChild(card);
    });
  }
}

/* sugerencias del cuadro principal: agente activo si hay chat abierto, si no el agente
   principal del rol (dependen de rol + agente + caso + etapa) */
function renderSuggestionsMain(){
  const r = currentRole();
  const c = currentCase();
  const agentId = activeChatAgentId || r.agentes[0].id;
  const pillsHolder = document.getElementById('suggestionPillsHolder');
  pillsHolder.innerHTML = '';
  getSuggestions(agentId, currentRoleId, c).forEach(s=>{
    const p = document.createElement('button');
    p.className = 'role-pill';
    p.textContent = s.label;
    p.addEventListener('click', ()=>{
      if(!activeChatAgentId) activateAgent(agentId, s.id);
      else runSuggestion(s);
    });
    pillsHolder.appendChild(p);
  });
}

/* el cuadro principal ES el Chat AI: si no hay agente activo, el primer envío activa
   el agente principal del rol; si ya hay uno activo, el mensaje se envía a ese mismo chat */
function handleMainSend(){
  const val = document.getElementById('promptInput').value.trim();
  if(!val) return;
  if(!activeChatAgentId){
    activateAgent(currentRole().agentes[0].id);
    setTimeout(()=> sendUserMessage(val), 150);
  } else {
    sendUserMessage(val);
  }
}
document.getElementById('promptSendBtn').addEventListener('click', handleMainSend);
document.getElementById('promptInput').addEventListener('keydown', (e)=>{
  if(e.key==='Enter' && !e.shiftKey){
    e.preventDefault();
    handleMainSend();
  }
});
document.getElementById('heroBackBtn').addEventListener('click', deactivateAgent);

/* ============================================================
   AGENT DOCUMENTATION DRAWER
   ============================================================ */
const drawer = document.getElementById('agentDrawer');
const drawerOverlay = document.getElementById('drawerOverlay');
let drawerAgentId = null;

function rolesForAgent(agentId){
  return ROLES.filter(r=> r.agentes.some(a=>a.id===agentId));
}

function openAgentDoc(agentId){
  drawerAgentId = agentId;
  const meta = AGENTS[agentId];
  const roles = rolesForAgent(agentId);
  document.getElementById('drawerIcon').innerHTML = I('bot').replace('style="stroke:#fff;"','');
  document.getElementById('drawerName').textContent = meta.nombre;
  document.getElementById('drawerSpec').textContent = meta.especialidad;
  document.getElementById('docQueEs').textContent = meta.queEs;
  document.getElementById('docObjetivo').textContent = MODULE_DOC.objetivo;
  document.getElementById('docResponsabilidades').innerHTML = MODULE_DOC.responsabilidades.map(x=>`<li>${x}</li>`).join('');
  document.getElementById('docTareas').innerHTML = meta.tareas.map(x=>`<li>${x}</li>`).join('');
  document.getElementById('docRoles').innerHTML = roles.map(r=>`<span class="perm-tag">${r.nombre}</span>`).join('');
  document.getElementById('docInfoAnaliza').innerHTML = meta.infoTrabaja.map(x=>`<li>${x}</li>`).join('');
  document.getElementById('docInfoGenera').innerHTML = MODULE_DOC.infoGenera.map(x=>`<li>${x}</li>`).join('');
  document.getElementById('docHerramientas').innerHTML = MODULE_DOC.herramientas.map(x=>`<span class="perm-tag">${x}</span>`).join('');
  document.getElementById('docSugerir').innerHTML = getSuggestions(agentId, currentRoleId, currentCase()).map(x=>`<li>${x.label}</li>`).join('');
  document.getElementById('docAprobacion').textContent = MODULE_DOC.aprobacion;
  document.getElementById('docFlujo').innerHTML = roles.map(r=>`<li><b>${r.nombre}:</b> recibe → ${r.recibe} Entrega → ${r.entrega}</li>`).join('');
  document.getElementById('docCuando').innerHTML = roles.map(r=>`<li><b>${r.nombre}:</b> ${r.cuandoIA}</li>`).join('');
  document.getElementById('docEjemplos').innerHTML = getSuggestions(agentId, currentRoleId, currentCase())
    .map(s=>`<li>"${s.label}"</li>`).join('');
  document.getElementById('docMatrizRel').textContent = agentId==='probatorio'
    ? 'Es el agente que trabaja de forma directa con la Matriz Probatoria: revisa, clasifica y valida evidencia, y puede señalar inconsistencias o vacíos antes de que el usuario los apruebe.'
    : 'Consulta la Matriz Probatoria como referencia para sus recomendaciones, pero no la modifica directamente; cualquier cambio a la matriz lo realiza el usuario.';
  drawer.classList.add('open');
  drawerOverlay.classList.add('show');
}
function closeDrawer(){ drawer.classList.remove('open'); drawerOverlay.classList.remove('show'); }
document.getElementById('drawerCloseBtn').addEventListener('click', closeDrawer);
drawerOverlay.addEventListener('click', closeDrawer);
document.getElementById('drawerOpenChat').addEventListener('click', ()=>{ closeDrawer(); activateAgent(drawerAgentId); });

/* ============================================================
   STEPPER + FLOW LIST (por caso)
   ============================================================ */
const stepperHolder = document.getElementById('stepperHolder');
const flowList = document.getElementById('flowList');

function buildStepper(){
  const c = currentCase();
  const currentOrder = roleById(c.responsableRole).order;
  stepperHolder.innerHTML = '';
  ROLES.slice().sort((a,b)=>a.order-b.order).forEach(r=>{
    const st = document.createElement('div');
    const cls = c.progreso>=100 ? 'done' : (r.order < currentOrder ? 'done' : r.order===currentOrder ? 'current' : '');
    st.className = 'step ' + cls;
    st.innerHTML = `<div class="sc">${cls==='done' ? I('check').replace('class="icon"','class="icon" style="width:14px;height:14px;stroke:#fff;"') : r.order}</div><div class="sl">${r.nombre}</div>`;
    stepperHolder.appendChild(st);
  });
}

function buildFlow(){
  const c = currentCase();
  const currentOrder = roleById(c.responsableRole).order;
  document.getElementById('cdFlowNote').textContent = c.progreso>=100
    ? 'Este caso completó el flujo entre los cinco roles y fue aprobado por el Socio.'
    : `El caso inicia con el Director y actualmente se encuentra en el rol: ${roleById(c.responsableRole).nombre}.`;
  flowList.innerHTML = '';
  ROLES.slice().sort((a,b)=>a.order-b.order).forEach(r=>{
    const status = c.progreso>=100 ? 'ok' : (r.order < currentOrder ? 'ok' : r.order===currentOrder ? 'now' : 'pending');
    const label = status==='ok' ? 'Completado' : status==='now' ? 'En curso' : 'Pendiente';
    const item = document.createElement('div');
    item.className = 'flow-item' + (status==='now' ? ' current' : '');
    item.innerHTML = `
      <div class="fi-head">
        <div class="fi-role">
          <div class="fi-num">${r.order}</div>
          <div><h4>${r.nombre}</h4><span>${r.participacion}</span></div>
        </div>
        <span class="badge ${status}">${label}</span>
      </div>
      <div class="fi-grid">
        <div class="fi-block"><h5>Recibe / de quién</h5><p>${r.recibe}</p></div>
        <div class="fi-block"><h5>Revisa</h5><p>${r.revisa}</p></div>
        <div class="fi-block"><h5>Gestiona manualmente</h5><p>${r.gestiona}</p></div>
        <div class="fi-block"><h5>Decisiones</h5><p>${r.decisiones}</p></div>
        <div class="fi-block"><h5>Resultado / entrega a</h5><p>${r.resultado} ${r.entrega}</p></div>
        <div class="fi-block"><h5>Recibe posteriormente</h5><p>${r.recibePosterior}</p></div>
      </div>
      <div class="fi-actions">
        <button class="btn sm" data-open-role="${r.id}">Ver agente(s) de este rol</button>
      </div>
    `;
    item.querySelector('[data-open-role]').addEventListener('click', ()=>{
      setRole(r.id);
      document.querySelectorAll('.sb-nav li[data-view]').forEach(x=>x.classList.toggle('active', x.dataset.view==='agentes'));
      showView('agentes');
    });
    flowList.appendChild(item);
  });
}

/* ============================================================
   CASOS ACTIVOS
   ============================================================ */
const casosBody = document.getElementById('casosBody');
function buildCasosList(){
  // el Cliente externo no entra al listado interno: ve su portal restringido (casos-penales.js)
  if(currentRoleId==='cliente'){ renderClientePortal(); return; }
  document.getElementById('clientePortalWrap').style.display='none';
  document.getElementById('casosListWrap').style.display='block';
  const lista = cpCasosFiltrados(); // filtrado por permisos del rol + búsqueda + filtros
  renderCasosDashboard(lista);
  casosBody.innerHTML = '';
  lista.forEach(c=>{
    const tr = document.createElement('tr');
    tr.className='clickable';
    tr.innerHTML = `
      <td style="font-weight:700;">${c.id}</td>
      <td style="max-width:260px;"><b>${c.nombre}</b><br><span style="color:var(--text-muted);font-size:11.8px;">${c.tipo}</span></td>
      <td>${c.etapa}</td>
      <td><span class="pill-state ${c.progreso>=100?'verificada':(c.estado.includes('curso')?'revision':'pendiente')}">${c.estado}</span><div style="margin-top:5px;">${wfBadge(c.wf)}</div></td>
      <td>${roleById(c.responsableRole).nombre}<br><span style="color:var(--text-muted);font-size:11.5px;">${personaDeRol(c, c.responsableRole)}</span></td>
      <td>${riskPill(c.riesgo)}</td>
      <td>${c.fecha}</td>
      <td>${c.ultimaActividad}</td>
      <td><div class="case-progress"><div class="bar"><i style="width:${c.progreso}%;"></i></div><span style="font-size:11.5px;color:var(--text-muted);">${c.progreso}%</span></div></td>
      <td>${c.matriz.length}</td>
      <td>${proximoVencimientoHtml(c)}</td>
    `;
    tr.addEventListener('click', ()=> openCaseDetail(c.id));
    casosBody.appendChild(tr);
  });
  if(!lista.length){
    casosBody.innerHTML = `<tr><td colspan="11" style="text-align:center;color:var(--text-muted);padding:28px;">No hay casos que coincidan con la búsqueda o los filtros.</td></tr>`;
  }
}

function openCaseDetail(caseId){
  currentCaseId = caseId;
  renderCaseChip();
  document.getElementById('casosListWrap').style.display='none';
  document.getElementById('casoDetailWrap').style.display='block';
  const c = currentCase();
  document.getElementById('cdTitle').textContent = `${c.id} · ${c.nombre}`;
  document.getElementById('cdSub').textContent = c.tipo + ' · Responsable actual: ' + roleById(c.responsableRole).nombre;
  buildStepper();
  buildFlow();
  buildMatriz();
  cpOnOpenCase(); // casos-penales.js: encabezado, pestañas y auditoría de acceso
}
document.getElementById('btnBackCasos').addEventListener('click', backToCasosList);
function backToCasosList(){
  document.getElementById('casoDetailWrap').style.display='none';
  document.getElementById('casosListWrap').style.display='block';
  buildCasosList();
}

/* ============================================================
   MATRIZ PROBATORIA (por caso)
   ============================================================ */
const matrizBody = document.getElementById('matrizBody');
const matrizCount = document.getElementById('matrizCount');
function stateLabel(s){ return {verificada:'Verificada', revision:'En revisión', pendiente:'Pendiente de recaudo'}[s]; }
function relevLabel(s){ return {alta:'Alta', media:'Media', baja:'Baja'}[s]; }

function buildMatriz(){
  const c = currentCase();
  matrizBody.innerHTML = '';
  c.matriz.forEach(row=>{
    const tr = document.createElement('tr');
    tr.className = 'clickable';
    tr.addEventListener('click', ()=> openEvidenceDetail(row)); // ficha + trazabilidad (casos-penales.js)
    tr.innerHTML = `
      <td style="font-weight:600;max-width:180px;">${row.ev}</td>
      <td>${row.tipo}</td>
      <td style="max-width:220px;">${row.pretende}</td>
      <td><span class="hecho-tag">${row.hecho} · ${HECHOS[row.hecho]}</span></td>
      <td>${row.fuente}</td>
      <td><span class="pill-state ${row.estado}">${stateLabel(row.estado)}</span></td>
      <td><span class="pill-relev ${row.relev}">${relevLabel(row.relev)}</span></td>
      <td>${roleById(row.resp).nombre}</td>
      <td style="max-width:200px;color:var(--text-muted);">${row.obs}</td>
    `;
    matrizBody.appendChild(tr);
  });
  matrizCount.textContent = c.matriz.length + ' elementos registrados';
}

/* matriz modal */
const matrizModal = document.getElementById('matrizModal');
const fResponsable = document.getElementById('fResponsable');
ROLES.slice().sort((a,b)=>a.order-b.order).forEach(r=>{
  const o = document.createElement('option'); o.value=r.id; o.textContent=r.nombre; fResponsable.appendChild(o);
});
document.getElementById('btnAddEvidencia').addEventListener('click', ()=> matrizModal.classList.add('show'));
document.getElementById('matrizCloseBtn').addEventListener('click', ()=> matrizModal.classList.remove('show'));
document.getElementById('matrizCancelBtn').addEventListener('click', ()=> matrizModal.classList.remove('show'));
document.getElementById('matrizSaveBtn').addEventListener('click', ()=>{
  const ev = document.getElementById('fEvidencia').value.trim();
  if(!ev){ showToast('Ingresa el nombre de la evidencia.'); return; }
  currentCase().matriz.unshift({
    ev, tipo:document.getElementById('fTipo').value,
    pretende:document.getElementById('fPretende').value || '—',
    hecho:document.getElementById('fHecho').value,
    fuente:document.getElementById('fFuente').value || '—',
    estado:document.getElementById('fEstado').value,
    relev:document.getElementById('fRelev').value,
    resp:document.getElementById('fResponsable').value,
    obs:document.getElementById('fObs').value || '—',
    id:'EV-'+Date.now().toString(36).toUpperCase(),
    fecha:document.getElementById('fFecha').value || '',
    docId:document.getElementById('fDocumento').value || '',
    sens:document.getElementById('fSensibilidad').value,
  });
  buildMatriz();
  matrizModal.classList.remove('show');
  ['fEvidencia','fPretende','fFuente','fObs'].forEach(id=>document.getElementById(id).value='');
  showToast('Evidencia agregada y vinculada al caso.');
  cpOnEvidenceSaved(currentCase().matriz[0]); // auditoría + refresco de pestañas (casos-penales.js)
});

/* ============================================================
   CHAT AI — es el MISMO cuadro principal (promptbox) de arriba.
   Al activar un agente, ese cuadro se convierte en su chat:
   historial + sugerencias + campo de conversación, sin modal
   ni pantalla nueva. Funcional y contextual por rol + agente + caso.
   ============================================================ */
const chatThread = document.getElementById('chatThread');

function sessionKey(){ return `${activeChatAgentId}_${currentRoleId}_${currentCaseId}`; }

/* "Usar agente": oculta su tarjeta y lo activa dentro del Chat AI principal */
function activateAgent(agentId, autoSuggestionId){
  activeChatAgentId = agentId;
  document.querySelectorAll('.sb-nav li[data-view]').forEach(x=>x.classList.toggle('active', x.dataset.view==='agentes'));
  showView('agentes');
  renderAgentesView();
  window.scrollTo({top:0, behavior:'smooth'});
  document.getElementById('promptInput').focus();
  if(autoSuggestionId){
    const s = getSuggestions(agentId, currentRoleId, currentCase()).find(x=>x.id===autoSuggestionId);
    if(s) setTimeout(()=> runSuggestion(s), 200);
  }
}

/* "Volver a agentes": el agente reaparece en su tarjeta; su historial se conserva */
function deactivateAgent(){
  activeChatAgentId = null;
  renderAgentesView();
}

function renderThread(){
  chatThread.innerHTML = '';
  (CHAT_SESSIONS[sessionKey()]||[]).forEach(m=>{
    const div = document.createElement('div');
    div.className = 'msg ' + (m.who==='user' ? 'user' : 'agent');
    div.innerHTML = m.html;
    chatThread.appendChild(div);
  });
  renderFollowups();
  window.scrollTo({top: document.body.scrollHeight, behavior:'smooth'});
}

/* sugerencias del agente activo, mostradas como "Seguimientos" dentro del propio
   hilo de la conversación (para iniciar rápidamente la siguiente interacción) */
function renderFollowups(){
  const session = CHAT_SESSIONS[sessionKey()] || [];
  const last = session[session.length-1];
  if(!activeChatAgentId || !last || last.who!=='agent') return;
  const box = document.createElement('div');
  box.className = 'chat-followups';
  box.innerHTML = `<div class="fu-label">Seguimientos</div>`;
  getSuggestions(activeChatAgentId, currentRoleId, currentCase()).forEach(s=>{
    const b = document.createElement('button');
    b.className = 'followup-item';
    b.textContent = s.label;
    b.addEventListener('click', ()=> runSuggestion(s));
    box.appendChild(b);
  });
  chatThread.appendChild(box);
}

function sendUserMessage(text){
  CHAT_SESSIONS[sessionKey()].push({who:'user', html:text});
  document.getElementById('promptInput').value='';
  renderThread();
  showTyping();
  setTimeout(()=>{
    hideTyping();
    const html = buildReply(activeChatAgentId, currentRoleId, currentCase(), null, text);
    CHAT_SESSIONS[sessionKey()].push({who:'agent', html});
    renderThread();
  }, 900 + Math.random()*500);
}

function runSuggestion(s){
  CHAT_SESSIONS[sessionKey()].push({who:'user', html:s.label});
  renderThread();
  showTyping();
  setTimeout(()=>{
    hideTyping();
    const html = buildReply(activeChatAgentId, currentRoleId, currentCase(), s.id, s.label);
    CHAT_SESSIONS[sessionKey()].push({who:'agent', html});
    renderThread();
  }, 900 + Math.random()*500);
}

function showTyping(){
  const div = document.createElement('div');
  div.className = 'msg agent typing-msg';
  div.id = 'typingBubble';
  div.innerHTML = `<div class="typing-dots"><span></span><span></span><span></span></div>`;
  chatThread.appendChild(div);
  window.scrollTo({top: document.body.scrollHeight, behavior:'smooth'});
}
function hideTyping(){ const t=document.getElementById('typingBubble'); if(t) t.remove(); }

/* ---- reply engine ---- */
function fmt(str, vars){ return str.replace(/\{(\w+)\}/g, (_,k)=> vars[k] !== undefined ? vars[k] : ''); }

function matrizStats(c){
  const total = c.matriz.length;
  const ver = c.matriz.filter(m=>m.estado==='verificada').length;
  const rev = c.matriz.filter(m=>m.estado==='revision').length;
  const pend = c.matriz.filter(m=>m.estado==='pendiente').length;
  return {total, ver, rev, pend};
}

function buildReply(agentId, roleId, c, suggestionId, rawText){
  const meta = AGENTS[agentId];
  const role = roleById(roleId);
  const stats = matrizStats(c);
  const tag = `<b>${meta.nombre}</b>`;

  // route free text to a suggestion type via keywords when no explicit suggestionId
  let type = suggestionId;
  if(!type){
    const t = rawText.toLowerCase();
    if(t.includes('matriz')) type='analizar_matriz';
    else if(t.includes('evidenc')) type='revisar_evidencia';
    else if(t.includes('falta') || t.includes('pendient')) type='info_faltante';
    else if(t.includes('resum') || t.includes('document')) type='resumir_docs';
    else if(t.includes('siguiente') || t.includes('entreg')) type='preparar_siguiente';
    else if(t.includes('estado') || t.includes('avance') || t.includes('progreso')) type='estado_caso';
    else if(t.includes('analiza') || t.includes('caso')) type='analizar_caso';
  }

  switch(type){
    case 'analizar_caso': {
      const key = agentId+'_'+roleId;
      const d = DEEP_TEMPLATES[key];
      if(d){
        const vars = {CASE:c.id, PROG:c.progreso, VER:stats.ver, TOTAL:stats.total, PEND:stats.pend};
        return `${tag}${fmt(d.resumen, vars)}<ul>${d.hallazgos.map(h=>`<li>${fmt(h,vars)}</li>`).join('')}</ul><p style="margin-top:8px;"><b>Recomendación:</b> ${fmt(d.recomendacion,vars)}</p><span class="conf-tag">Confianza ${78 + (stats.ver*3)}%</span>`;
      }
      return `${tag}He analizado el caso ${c.id} (${c.nombre}) desde la perspectiva de ${role.nombre}. Progreso general: ${c.progreso}%. Evidencias verificadas: ${stats.ver} de ${stats.total}.`;
    }
    case 'analizar_matriz':
    case 'revisar_evidencia': {
      const rows = c.matriz.slice(0,4).map(m=>`<li><b>${m.ev}</b> — ${stateLabel(m.estado)} (${relevLabel(m.relev)}), responsable: ${roleById(m.resp).nombre}</li>`).join('');
      return `${tag}Matriz probatoria de ${c.id}: ${stats.total} elementos — ${stats.ver} verificadas, ${stats.rev} en revisión, ${stats.pend} pendientes.<ul>${rows}</ul>`;
    }
    case 'info_faltante': {
      const faltan = c.matriz.filter(m=>m.estado!=='verificada');
      if(faltan.length===0) return `${tag}No hay vacíos probatorios activos en ${c.id}: toda la evidencia registrada está verificada.`;
      return `${tag}Información pendiente en ${c.id}:<ul>${faltan.map(m=>`<li><b>${m.ev}</b> — ${stateLabel(m.estado)}. ${m.obs}</li>`).join('')}</ul>`;
    }
    case 'resumir_docs': {
      return `${tag}Documentos del caso ${c.id}:<ul>${c.matriz.map(m=>`<li>${m.ev} (${m.tipo})</li>`).join('')}</ul>Todos vinculados a los hechos H1–H4 del caso.`;
    }
    case 'preparar_siguiente': {
      const nxt = nextRoleId(roleId);
      if(!nxt) return `${tag}${role.nombre} es el último rol del flujo en este módulo; no hay un siguiente rol al cual preparar entrega. Corresponde registrar la aprobación final.`;
      const nr = roleById(nxt);
      return `${tag}Para entregar a ${nr.nombre}, prepara: ${role.resultado} ${role.entrega}<p style="margin-top:6px;"><b>${nr.nombre} recibirá:</b> ${nr.recibe}</p>`;
    }
    case 'estado_caso': {
      return `${tag}Estado de ${c.id}: <b>${c.estado}</b>. Progreso: ${c.progreso}%. Responsable actual: ${roleById(c.responsableRole).nombre}. Última actividad: ${c.ultimaActividad}.`;
    }
    default:
      return `${tag}Como ${meta.nombre} (${meta.especialidad}) trabajando con ${role.nombre}, aún no tengo una respuesta específica para "${rawText}" dentro de ${c.id}. Prueba con una sugerencia o pregunta por evidencia, matriz probatoria, estado del caso o el siguiente rol.`;
  }
}

/* ============================================================
   FAQ
   ============================================================ */
const FAQ = [
  {cat:'Uso de AI Agents', q:'¿Cómo sé qué AI Agent usar?', a:'La plataforma muestra únicamente los agentes que corresponden a tu rol activo, de modo que no tengas que elegir entre herramientas que no te aplican. Selecciona tu rol en el avatar superior derecho ("Cambiar rol") y entra a la vista "Agentes" en el menú lateral: allí verás solo las tarjetas de los agentes habilitados para tus responsabilidades. Cada tarjeta indica el rol al que pertenece y, con "Ver cómo funciona", puedes leer su documentación completa (qué información usa, qué puede sugerir y qué no) antes de activarlo con "Usar agente".'},
  {cat:'Uso de AI Agents', q:'¿El AI Agent puede tomar decisiones por mí?', a:'No. El agente es un asistente de apoyo, no un sustituto del criterio profesional. La IA puede analizar información del expediente, identificar patrones, redactar borradores o resumir evidencia, pero no puede cerrar un caso, aprobar una evidencia, emitir un concepto jurídico definitivo ni modificar el expediente por sí misma. Todo resultado que genera queda marcado como propuesta y debe ser revisado, corregido si hace falta y aprobado explícitamente por el rol correspondiente (Abogado, Director o Socio, según la etapa) antes de incorporarse formalmente al caso.'},
  {cat:'Gestión de casos', q:'¿Cómo abro un caso activo?', a:'Ve a "Casos Penales" en el menú lateral: allí aparece el listado completo de casos visibles para tu rol, con filtros por estado, responsable, riesgo y fecha. Haz clic sobre cualquier fila de la tabla para abrir el detalle del caso, donde encontrarás la información general (cliente, tipo de proceso, etapa), el flujo de trabajo entre roles, la Matriz Probatoria, las actuaciones registradas y el historial de cambios. Desde ese mismo detalle puedes activar un AI Agent con el contexto del caso ya cargado.'},
  {cat:'Gestión de casos', q:'¿Quién puede crear un caso nuevo?', a:'La creación de un caso nuevo corresponde al Director jurídico o al Coordinador de caso, quien recibe el requerimiento inicial del cliente o de la firma y lo registra en la plataforma usando el botón "+ Nuevo caso" en "Casos Penales". Al crearlo se definen datos básicos como cliente, tipo de proceso, equipo asignado y nivel de sensibilidad; a partir de ahí el caso queda disponible para que los demás roles (Abogado, Administrativo, Cliente, Socio) trabajen según sus permisos.'},
  {cat:'Matriz Probatoria', q:'¿Qué es la Matriz Probatoria?', a:'Es el registro central y estructurado de toda la evidencia asociada a un caso penal. Por cada elemento probatorio guarda: el documento o soporte, el tipo de prueba (testimonial, documental, pericial, etc.), el hecho específico que pretende demostrar, su fuente u origen, su estado de verificación, su nivel de relevancia para la teoría del caso, el responsable de gestionarla y observaciones adicionales. Sirve como columna vertebral del expediente: todos los roles la consultan para entender qué se ha probado, qué falta por recaudar y qué tan sólida es la evidencia disponible.'},
  {cat:'Matriz Probatoria', q:'¿Cómo agrego una evidencia?', a:'Dentro del detalle de un caso, en la pestaña de la Matriz Probatoria, usa el botón "+ Agregar evidencia". Se abrirá un formulario donde debes indicar el tipo de prueba, el hecho que sustenta, la fuente, el estado inicial (por ejemplo "Pendiente de recaudo") y el responsable de darle seguimiento. Una vez guardada, la evidencia queda visible en la matriz para todos los roles con acceso al caso, y puede actualizarse a medida que avanza su verificación.'},
  {cat:'Evidencias', q:'¿Qué significan los estados de evidencia?', a:'Cada evidencia de la Matriz Probatoria pasa por tres estados posibles: "Verificada" significa que el elemento ya fue confirmado, contrastado y está listo para sustentar la teoría del caso o presentarse formalmente; "En revisión" indica que se encuentra en proceso de validación (por ejemplo, siendo cotejada con otras fuentes o analizada por el Agente Probatorio); "Pendiente de recaudo" señala que todavía no ha sido obtenida, solicitada o cargada al expediente. Estos estados permiten priorizar el trabajo y detectar rápidamente vacíos probatorios del caso.'},
  {cat:'Documentos', q:'¿Quién carga los documentos del cliente?', a:'El Cliente es quien carga los documentos que se le solicitan a través del portal seguro habilitado para su rol (contratos, comunicaciones, soportes de pago, identificaciones, etc.). Una vez cargados, el rol Administrativo se encarga de revisarlos, clasificarlos por tipo de prueba y organizarlos dentro de la Matriz Probatoria del caso correspondiente, de modo que queden correctamente vinculados al hecho que sustentan y disponibles para el Abogado y el Socio en el análisis posterior.'},
  {cat:'Flujo entre roles', q:'¿Cómo pasa el caso entre los roles?', a:'El caso avanza siguiendo un flujo de trabajo secuencial pensado para reflejar la operación real de la firma: el Director inicia el caso y define su alcance; el Abogado analiza los hechos, construye la teoría del caso y solicita la evidencia necesaria; el Cliente aporta los documentos requeridos a través de su portal; el Administrativo organiza y clasifica esa evidencia dentro de la Matriz Probatoria; y finalmente el Socio revisa y aprueba las recomendaciones antes de que el caso avance a la siguiente etapa procesal. Este recorrido, con el estado de cada etapa, puede verse en el detalle de cada caso.'},
  {cat:'Uso del Chat AI', q:'¿El Chat AI recuerda el caso y el rol?', a:'Sí. Cada conversación del Chat AI queda anclada al caso activo (visible en el chip superior de la pantalla) y al rol que tienes seleccionado en ese momento. Esto significa que las respuestas, sugerencias y análisis del agente siempre se generan con ese contexto específico, sin mezclar información de otros casos ni de roles distintos, y que puedes retomar la conversación más adelante sin perder ese contexto mientras el caso y el rol no cambien.'},
  {cat:'Uso del Chat AI', q:'¿Qué son las sugerencias del chat?', a:'Son preguntas y acciones rápidas predefinidas que aparecen al iniciar una conversación con un agente, pensadas para ahorrarte tener que escribir la solicitud desde cero. Cambian según tu rol, el agente activo y el caso seleccionado; por ejemplo, pueden incluir "Analizar el caso actual", "Revisar la evidencia", "Identificar información faltante" o "Preparar información para el Cliente". Puedes hacer clic en cualquiera de ellas para lanzarla directamente, o ignorarlas y escribir tu propia pregunta en el campo de texto.'},
  {cat:'Acciones del agente', q:'¿Qué puede sugerir cada agente?', a:'Cada agente tiene un alcance definido y documentado de antemano: solo puede generar los tipos de análisis, resúmenes o recomendaciones descritos en su ficha técnica, visible en la sección "Qué puede sugerir" dentro de "Ver cómo funciona" en su tarjeta. Esto evita que el agente se salga de su función (por ejemplo, que un agente probatorio intente dar una recomendación procesal) y da transparencia sobre qué esperar antes de activarlo con "Usar agente".'},
  {cat:'Uso de AI Agents', q:'¿Qué es un AI Agent?', a:'Es un asistente de inteligencia artificial especializado del Módulo 02, diseñado para apoyar tareas concretas de gestión de casos penales y análisis probatorio. Cada agente lee la información disponible del caso activo (expediente, matriz probatoria, documentos, actuaciones) y, a partir de ahí, propone hallazgos, resúmenes, clasificaciones o recomendaciones. Su función es acelerar el trabajo del equipo jurídico, no reemplazarlo: siempre opera bajo supervisión humana y sus resultados requieren revisión y aprobación antes de tener efecto en el expediente.'},
  {cat:'Uso de AI Agents', q:'¿Cómo selecciono un agente?', a:'Entra a la vista "Agentes" desde el menú lateral. Verás tarjetas con los agentes disponibles para tu rol activo; cada una muestra su nombre, una breve descripción y dos botones: "Usar agente", que lo activa dentro del Chat AI con el contexto del caso actual cargado, y "Ver cómo funciona", que abre su documentación detallada antes de decidir usarlo. Una vez activado, el chat aparece en la parte inferior de la misma vista, sin necesidad de navegar a otra pantalla.'},
  {cat:'Uso de AI Agents', q:'¿Cómo sé qué agente utilizar?', a:'La plataforma filtra automáticamente y muestra solo los agentes vinculados a tu rol activo, así que no es necesario decidir entre todos los agentes del sistema, únicamente entre los que aplican a tus funciones. Si aun así tienes dudas sobre cuál conviene usar para una tarea específica, revisa "Ver cómo funciona" en cada tarjeta: ahí se describe su propósito, la información que analiza y el tipo de resultado que entrega, lo que te permite elegir el más adecuado antes de activarlo.'},
  {cat:'Uso de AI Agents', q:'¿Qué diferencia existe entre los agentes?', a:'Cada agente cubre una responsabilidad distinta dentro del proceso penal: el Agente de Gestión de Casos Penales coordina el expediente en su conjunto, apoya la construcción de la teoría del caso y ayuda a identificar información faltante; el Agente Probatorio se especializa en revisar, clasificar y validar la evidencia registrada en la Matriz Probatoria, detectando inconsistencias o vacíos probatorios; y el Agente de Recomendación Procesal genera una lectura ejecutiva del estado del caso, pensada para que el Socio la revise y apruebe antes de una decisión procesal importante. Usar el agente correcto según la tarea evita análisis incompletos o fuera de alcance.'},
  {cat:'Uso del Chat AI', q:'¿Cómo funciona el Chat AI?', a:'Al hacer clic en "Usar agente" sobre una tarjeta, el chat se despliega en la parte inferior de la misma vista de Agentes, sin salir de la pantalla. Muestra primero las sugerencias rápidas relacionadas con tu rol y el caso activo; puedes hacer clic en una de ellas o escribir tu propia pregunta en el campo de texto y enviarla con el botón de envío. El agente responde usando el contexto del caso y del rol seleccionados, y toda la conversación queda registrada mientras el agente permanezca activo, para que puedas retomarla más adelante.'},
  {cat:'Uso de AI Agents', q:'¿Qué información puede analizar un agente?', a:'Cada agente solo tiene acceso a la información definida explícitamente en su documentación, nunca a todo el sistema sin restricción: esto puede incluir los documentos del expediente, los registros de la Matriz Probatoria, el estado y relevancia de las evidencias, las actuaciones procesales y los datos generales del caso activo, según corresponda a su función. Esta limitación intencional evita que un agente analice información fuera de su alcance o de la sensibilidad autorizada para el rol que lo está usando.'},
  {cat:'Uso de AI Agents', q:'¿Puede el agente modificar información del caso?', a:'No directamente. El agente únicamente propone hallazgos, resúmenes o recomendaciones dentro del chat; no tiene permisos para editar, aprobar ni eliminar nada en el expediente, la Matriz Probatoria o las actuaciones del caso. Cualquier cambio real sobre la información del caso debe hacerlo el usuario de forma manual, usando los formularios y controles correspondientes de la plataforma, típicamente después de revisar y validar lo que el agente sugirió.'},
  {cat:'Acciones del agente', q:'¿Quién aprueba las recomendaciones del agente?', a:'La aprobación siempre queda en manos de una persona, nunca del agente. Dependiendo de la etapa y el tipo de recomendación, el rol responsable de revisarla y aprobarla puede ser el Abogado (análisis y teoría del caso), el Director (decisiones de coordinación) o el Socio (aprobación final antes de una actuación relevante). Solo después de esa revisión humana el resultado de la IA puede incorporarse formalmente al expediente o a la Matriz Probatoria.'},
  {cat:'Matriz Probatoria', q:'¿Cómo trabaja el agente con la Matriz Probatoria?', a:'El Agente Probatorio es el encargado de revisar, clasificar y validar la evidencia registrada en la matriz: identifica el tipo de prueba, evalúa su relevancia frente a los hechos del caso y señala posibles inconsistencias o elementos pendientes de recaudo. Los demás agentes (Gestión de Casos y Recomendación Procesal) pueden consultar la matriz como referencia para su propio análisis, pero no tienen permitido modificarla directamente; cualquier cambio sobre la matriz lo realiza un usuario humano, con o sin apoyo del Agente Probatorio.'},
  {cat:'Evidencias', q:'¿Cómo analiza evidencias?', a:'Dentro del Chat AI, usa la sugerencia "Revisar la evidencia" o "Analizar la Matriz Probatoria" (según el agente activo) para que el sistema genere un resumen del estado, relevancia y responsable de cada evidencia asociada al caso activo. El agente puede además señalar evidencias pendientes de recaudo, elementos en revisión que llevan tiempo sin actualizarse, o inconsistencias entre distintas pruebas, ayudando a priorizar el trabajo del equipo antes de una audiencia o entrega al cliente.'},
  {cat:'Documentos', q:'¿Cómo utiliza los documentos del caso?', a:'Los agentes no acceden a archivos sueltos fuera del sistema; trabajan sobre los documentos que ya fueron cargados y registrados en la Matriz Probatoria del caso activo por el Cliente y organizados por el Administrativo. Desde el Chat AI puedes usar la sugerencia "Resumir documentos del expediente" para obtener un listado rápido de los documentos disponibles, su tipo y a qué hecho o evidencia están vinculados, útil para preparar una reunión o una entrega.'},
  {cat:'Uso del Chat AI', q:'¿Cómo se mantiene el contexto del caso?', a:'El Chat AI toma automáticamente como referencia el caso que aparece activo en el chip superior de la pantalla y el rol que tienes seleccionado en ese momento; ambos datos se muestran también en el encabezado de la conversación mientras hablas con el agente, para que siempre tengas claridad sobre qué caso y qué rol está usando la IA para responder. Si necesitas analizar otro caso, debes cambiarlo explícitamente desde "Casos Penales" o el chip superior antes de continuar la conversación.'},
  {cat:'Flujo entre roles', q:'¿Qué ocurre cuando cambio de rol?', a:'Al cambiar de rol desde el selector superior, la plataforma actualiza automáticamente qué agentes, vistas y sugerencias están disponibles, mostrando únicamente lo que corresponde a las responsabilidades del nuevo rol. Si el agente que tenías activo también existe para el nuevo rol, la conversación del Chat AI continúa sin interrupciones; si el agente no aplica a ese rol, la vista regresa automáticamente a las tarjetas de agentes disponibles para que elijas uno válido.'},
  {cat:'Flujo entre roles', q:'¿Cómo se relacionan los agentes con los cinco roles?', a:'El acceso a cada agente está definido según las responsabilidades de cada rol dentro del proceso penal: el Director y el Abogado usan el Agente de Gestión de Casos Penales para coordinar el expediente y construir la teoría del caso; el Abogado, el Administrativo y el Cliente usan el Agente Probatorio para revisar y organizar evidencia (cada uno con el nivel de información que le corresponde); y el Socio usa el Agente de Recomendación Procesal para obtener una lectura ejecutiva antes de aprobar decisiones importantes. Ningún rol ve agentes fuera de esta asignación.'},
  {cat:'Uso de AI Agents', q:'¿Cómo puedo revisar qué hace un agente antes de utilizarlo?', a:'Antes de activar cualquier agente, haz clic en "Ver cómo funciona" dentro de su tarjeta en la vista "Agentes". Se abrirá su documentación completa: para qué sirve, qué información del caso puede analizar, qué tipo de hallazgos o recomendaciones puede sugerir y qué no está autorizado a hacer. Revisar esta ficha antes de usar "Usar agente" te permite anticipar el tipo de resultado que obtendrás y evita activarlo para una tarea que no le corresponde.'},
  {cat:'Uso del Chat AI', q:'¿Cómo regreso a la vista de agentes?', a:'Dentro de una conversación activa del Chat AI, usa el botón "← Volver a agentes" ubicado en la parte superior del chat. Esto te devuelve a la vista de tarjetas de agentes sin cerrar ni perder la conversación: el historial queda guardado, de modo que si vuelves a activar el mismo agente para el mismo caso y rol, puedes continuar donde la dejaste en lugar de empezar de nuevo.'},
  {cat:'Uso del Chat AI', q:'¿Qué puedo preguntarle al AI Agent?', a:'Puedes usar las sugerencias rápidas que aparecen al abrir el chat, o escribir libremente cualquier pregunta relacionada con el caso activo dentro del alcance del agente: por ejemplo, sobre el estado general del caso, la evidencia disponible, el contenido de la Matriz Probatoria, qué documentos siguen pendientes de recaudo, o qué información conviene preparar para el siguiente rol en el flujo de trabajo. El agente no responderá preguntas ajenas al caso activo ni fuera de su documentación.'},
  {cat:'Acciones del agente', q:'¿Qué tareas requieren revisión humana?', a:'Todas, sin excepción. Ningún resultado generado por un AI Agent se cierra, aprueba o incorpora automáticamente al expediente o a la Matriz Probatoria: siempre debe pasar por la revisión del rol correspondiente (Abogado, Director o Socio, según la etapa del caso) antes de tener cualquier efecto formal. Esta revisión humana obligatoria es lo que permite usar la IA como apoyo ágil sin comprometer la responsabilidad profesional ni la seguridad jurídica del proceso.'},
];
function buildFaq(){
  const list = document.getElementById('faqList');
  list.innerHTML = '';
  FAQ.forEach((f,i)=>{
    const item = document.createElement('div');
    item.className = 'flow-item faq-item';
    item.innerHTML = `
      <div class="faq-q">
        <div><p class="faq-cat">${f.cat}</p><h4>${f.q}</h4></div>
        <span class="faq-chev">${I('chevDown')}</span>
      </div>
      <div class="faq-a">${f.a}</div>
    `;
    item.addEventListener('click', ()=> item.classList.toggle('open'));
    list.appendChild(item);
  });
}

/* ============================================================
   CONFIGURACIÓN
   ============================================================ */
const CONFIG_GROUPS = [
  {title:'Preferencias generales', rows:[
    {label:'Modo compacto', desc:'Reduce el espaciado de las tarjetas y tablas.', on:false},
    {label:'Guardar último rol usado', desc:'Recuerda el último rol seleccionado al volver a entrar.', on:true},
  ]},
  {title:'Notificaciones', rows:[
    {label:'Alertas de vencimientos', desc:'Notifica sobre evidencia o tareas próximas a vencer.', on:true},
    {label:'Resumen diario del caso', desc:'Envía un resumen del estado del caso cada día.', on:false},
  ]},
  {title:'Configuración del Chat AI', rows:[
    {label:'Mostrar sugerencias automáticas', desc:'Muestra chips de preguntas sugeridas al abrir un agente.', on:true},
    {label:'Requerir aprobación antes de incorporar resultados', desc:'Exige revisión manual antes de guardar un resultado de IA en el expediente.', on:true},
  ]},
  {title:'Información del usuario', rows:[
    {label:'Perfil visible para el equipo', desc:'Comparte tu nombre y rol activo con el equipo del caso.', on:true},
    {label:'Acceso multi-rol', desc:'Permite cambiar de rol desde el mismo usuario (uso de demostración).', on:true},
  ]},
];
function buildConfig(){
  const grid = document.getElementById('configGrid');
  grid.innerHTML='';
  CONFIG_GROUPS.forEach(g=>{
    const card = document.createElement('div');
    card.className='role-card';
    card.innerHTML = `<h3 style="margin-bottom:4px;">${g.title}</h3>` + g.rows.map((r,idx)=>`
      <div class="setting-row">
        <div class="sr-label"><b>${r.label}</b><span>${r.desc}</span></div>
        <button class="switch ${r.on?'on':''}" data-cfg="${g.title}-${idx}"><span class="knob"></span></button>
      </div>
    `).join('');
    card.querySelectorAll('.switch').forEach(sw=>sw.addEventListener('click', ()=>{ sw.classList.toggle('on'); }));
    grid.appendChild(card);
  });
  const ayudaCard = document.createElement('div');
  ayudaCard.className = 'role-card clickable';
  ayudaCard.innerHTML = `<div class="r-top"><div class="role-icon">${I('lifebuoy')}</div></div><h3>Ayuda</h3><p>Guías rápidas y preguntas frecuentes del Módulo 02.</p>`;
  ayudaCard.addEventListener('click', ()=> goView('ayuda'));
  grid.appendChild(ayudaCard);
}

/* ============================================================
   AYUDA
   ============================================================ */
const AYUDA = [
  {icon:'chip', title:'Cómo utilizar los AI Agents', desc:'Selecciona tu rol en el avatar superior, entra a "Agentes" y verás únicamente los agentes de tu rol. Usa "Ver cómo funciona" para conocerlo o "Usar agente" para activarlo.'},
  {icon:'folder', title:'Cómo seleccionar un caso', desc:'Ve a "Casos Penales", revisa el listado con estado, responsable y progreso, y haz clic en un caso para abrir su flujo y matriz probatoria.'},
  {icon:'bot', title:'Cómo utilizar el Chat AI', desc:'Al hacer clic en "Usar agente", la tarjeta se oculta y el Chat AI se activa en la misma vista de Agentes, abajo. Usa las sugerencias o escribe tu pregunta.'},
  {icon:'help', title:'Preguntas frecuentes', desc:'Respuestas rápidas sobre agentes, casos, evidencias y flujo entre roles.', view:'faq'},
  {icon:'lifebuoy', title:'Guía rápida del módulo', desc:'El Módulo 02 gestiona casos penales con módulo probatorio: Director inicia, Abogado analiza, Cliente aporta, Administrativo organiza y Socio aprueba.'},
  {icon:'shield', title:'Información de soporte', desc:'Para dudas adicionales sobre el Módulo 02, contacta al equipo de coordinación jurídica de la firma.'},
];
function buildAyuda(){
  const grid = document.getElementById('ayudaGrid');
  grid.innerHTML='';
  AYUDA.forEach(a=>{
    const card = document.createElement('div');
    card.className='role-card' + (a.view ? ' clickable' : '');
    card.innerHTML = `<div class="r-top"><div class="role-icon">${I(a.icon)}</div></div><h3>${a.title}</h3><p>${a.desc}</p>`;
    if(a.view) card.addEventListener('click', ()=> goView(a.view));
    grid.appendChild(card);
  });
}

/* ============================================================
   INIT
   ============================================================ */
function init(){
  // el rol y la vista inicial pueden llegar desde la entrada de la plataforma (../index.html)
  const params = new URLSearchParams(location.search);
  const rolInicial = roleById(params.get('rol')) ? params.get('rol') : 'abogado';
  const vistaInicial = document.getElementById('view-'+params.get('vista')) ? params.get('vista') : 'agentes';
  setRole(rolInicial);
  renderCaseChip();
  buildCasosList();
  buildFaq();
  buildConfig();
  buildAyuda();
  showView(vistaInicial);
  document.querySelectorAll('.sb-nav li[data-view]').forEach(x=>x.classList.toggle('active', x.dataset.view===vistaInicial));
}
/* init() se invoca desde js/main.js, después de cargar casos-penales.js */

/* ============================================================
   TOAST
   ============================================================ */
function showToast(msg){
  const t = document.getElementById('toast');
  t.innerHTML = I('check').replace('class="icon"','class="icon" style="width:14px;height:14px;stroke:#fff;"') + '<span>'+msg+'</span>';
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> t.classList.remove('show'), 2600);
}
