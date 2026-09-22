/* ============================================================
   MÓDULO 02 · CASOS PENALES — DATOS, CATÁLOGOS Y PERMISOS
   Modelo: Case · Client · User · Document · Evidence · Action
           Task · AIAnalysis · Report · AuditLog
   Extiende los CASES existentes (modulo02.js) sin alterar sus campos.
   ============================================================ */

/* ---------- utilidades de fecha / formato ---------- */
const CP_HOY = (()=>{ const d=new Date(); d.setHours(0,0,0,0); return d; })();
function isoDate(d){ return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
function dOff(n){ const d=new Date(CP_HOY); d.setDate(d.getDate()+n); return isoDate(d); }
function tsAgo(min){ return new Date(Date.now()-min*60000).toISOString(); }
function nowIso(){ return new Date().toISOString(); }
function parseDate(s){ const [y,m,d]=String(s).slice(0,10).split('-').map(Number); return new Date(y,m-1,d); }
function diasHasta(s){ return Math.round((parseDate(s)-CP_HOY)/86400000); }
function fmtFecha(s){ if(!s) return '—'; return parseDate(s).toLocaleDateString('es-CO',{day:'2-digit',month:'short',year:'numeric'}); }
function fmtFechaHora(iso){ const d=new Date(iso); return d.toLocaleDateString('es-CO',{day:'2-digit',month:'2-digit',year:'numeric'})+' · '+d.toLocaleTimeString('es-CO',{hour:'2-digit',minute:'2-digit'}); }
function fmtSize(b){ if(!b) return '—'; return b>1048576 ? (b/1048576).toFixed(1)+' MB' : Math.max(1,Math.round(b/1024))+' KB'; }
function esc(s){ return String(s??'').replace(/[&<>"']/g, ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
function uid(p){ return p+'-'+Date.now().toString(36).slice(-4).toUpperCase()+Math.random().toString(36).slice(2,5).toUpperCase(); }
function fakeHash(str){
  let out='', h=2166136261;
  for(let r=0;r<8;r++){
    for(let i=0;i<str.length;i++){ h^=str.charCodeAt(i)+r; h=Math.imul(h,16777619)>>>0; }
    out+=h.toString(16).padStart(8,'0');
  }
  return out;
}
function tipoDesdeNombre(n){
  const ext=(String(n).split('.').pop()||'').toLowerCase();
  if(ext==='pdf') return 'PDF';
  if(['doc','docx'].includes(ext)) return 'Word';
  if(['xls','xlsx','csv'].includes(ext)) return 'Excel';
  if(['png','jpg','jpeg','gif','webp'].includes(ext)) return 'Imagen';
  if(['zip','eml','msg','pst'].includes(ext)) return 'Correo / ZIP';
  if(['mp3','mp4','wav','mov'].includes(ext)) return 'Audio / Video';
  return 'PDF';
}

/* ---------- usuarios (User) ---------- */
const PEOPLE = [
  {id:'u-socio', nombre:'Juliana Restrepo', rol:'socio', ini:'JR'},
  {id:'u-dir',   nombre:'Martín Gaviria',   rol:'director', ini:'MG'},
  {id:'u-abo',   nombre:'Laura Ospina',     rol:'abogado', ini:'LO'},
  {id:'u-abo2',  nombre:'Santiago Mejía',   rol:'abogado', ini:'SM'},
  {id:'u-adm',   nombre:'Andrés Molina',    rol:'administrativo', ini:'AM'},
  {id:'u-adm2',  nombre:'Paula Cárdenas',   rol:'administrativo', ini:'PC'},
  {id:'u-cli',   nombre:'Portal del cliente', rol:'cliente', ini:'CL'},
];
const USER_BY_ROLE = {socio:'u-socio', director:'u-dir', abogado:'u-abo', administrativo:'u-adm', cliente:'u-cli'};
const personById = id => PEOPLE.find(p=>p.id===id);
function pName(id){ const p=personById(id); return p ? p.nombre : '—'; }
function currentUser(){ return personById(USER_BY_ROLE[currentRoleId]); }
const INTERNOS = PEOPLE.filter(p=>p.rol!=='cliente');
const CLIENTE_DEMO = 'Constructora Andina S.A.S.'; // cliente externo del perfil de demostración

/* ---------- catálogos ---------- */
const WF = [
  {id:'borrador', label:'Borrador'},
  {id:'revision', label:'En revisión'},
  {id:'aprobado', label:'Aprobado'},
  {id:'cerrado', label:'Cerrado'},
  {id:'archivado', label:'Archivado'},
];
const wfLabel = id => (WF.find(w=>w.id===id)||{}).label || id;
const WF_NEXT = {borrador:'revision', revision:'aprobado', aprobado:'cerrado', cerrado:'archivado'};
const WF_ACTION = {
  borrador:{label:'Enviar a revisión', roles:['director','abogado']},
  revision:{label:'Aprobar caso', roles:['director','socio']},
  aprobado:{label:'Cerrar caso', roles:['director','socio']},
  cerrado:{label:'Archivar caso', roles:['director','socio']},
};
const WF_ESTADO_TXT = {borrador:'Borrador', revision:'En revisión', aprobado:'Aprobado · En ejecución', cerrado:'Cerrado / Aprobado', archivado:'Archivado'};
const WF_CLIENTE_TXT = {
  revision:'El equipo jurídico está revisando la estrategia del caso.',
  aprobado:'La estrategia fue aprobada y el equipo está ejecutando las actuaciones.',
  cerrado:'El caso fue cerrado. Puedes consultar el reporte final autorizado.',
  archivado:'El caso se encuentra archivado. La información autorizada sigue disponible para consulta.',
};
const ETAPAS = ['Indagación preliminar','Investigación','Imputación','Acusación','Juicio oral','Recursos','Ejecución de sentencia'];
const AREAS = ['Delitos contra la administración pública','Lavado de activos','Delitos económicos y financieros','Corrupción privada','Delitos contra la fe pública','Delitos contra el patrimonio económico'];
const TIPOS_CASO = ['Defensa técnica','Representación de víctima','Investigación interna','Asesoría penal preventiva'];
const RIESGOS = [{id:'critico',label:'Crítico'},{id:'alto',label:'Alto'},{id:'medio',label:'Medio'},{id:'bajo',label:'Bajo'}];
const PRIORIDADES = [{id:'critica',label:'Crítica'},{id:'alta',label:'Alta'},{id:'media',label:'Media'},{id:'baja',label:'Baja'}];
const riskLabel = id => (RIESGOS.find(r=>r.id===id)||{}).label || id;
const prioLabel = id => (PRIORIDADES.find(r=>r.id===id)||{}).label || id;
const CONFIDENCIALIDAD = ['Interna','Confidencial','Reservada'];
const SENSIBILIDAD = ['Interna','Confidencial','Reservada'];
const DOC_CATEGORIAS = ['Contractual','Financiero','Pericial','Procesal','Comunicaciones','Societario','Testimonial','Aportado por el cliente'];
const DOC_TIPOS = ['PDF','Word','Excel','Imagen','Correo / ZIP','Audio / Video'];
const ACT_TIPOS = ['Revisión de expediente','Reunión con cliente','Solicitud probatoria','Memorial / escrito','Audiencia','Entrevista','Derecho de petición'];
const ACT_ESTADOS = ['Pendiente','Programada','Realizada','Cancelada'];
const TAREA_ESTADOS = ['Pendiente','En curso','Bloqueada','Completada'];
const ENT_LABEL = {Case:'Caso', Document:'Documento', Evidence:'Evidencia', Task:'Tarea', Action:'Actuación', AIAnalysis:'Análisis IA', Report:'Reporte', Request:'Solicitud al cliente'};
const AI_STATUS = {pendiente:'Pendiente de revisión humana', aprobado:'Aprobado', modificado:'Aprobado con modificaciones', rechazado:'Rechazado', info:'Más información solicitada'};
const AI_SALIDA = {
  gestion:'Teoría del caso · actuaciones · argumentos · documentos necesarios',
  probatorio:'Checklist probatorio · matriz documental · hechos extraídos · dudas para escalar',
  recomendacion:'Resumen ejecutivo · riesgos · decisiones pendientes · recomendación procesal',
};

/* ---------- permisos por rol (además se filtra por caso, equipo y sensibilidad) ---------- */
const CP_PERMS = {
  socio:         {crearCaso:0, editarCaso:0, docs:0, evidencias:0, verificarEvid:0, actuaciones:0, tareas:0, estadoTareas:0, ia:1, revisarIA:1, reportes:1, autorizarCliente:1, auditoria:1, ejecutiva:1, verSensible:1},
  director:      {crearCaso:1, editarCaso:1, docs:1, evidencias:1, verificarEvid:1, actuaciones:1, tareas:1, estadoTareas:1, ia:1, revisarIA:1, reportes:1, autorizarCliente:1, auditoria:1, ejecutiva:1, verSensible:1},
  abogado:       {crearCaso:0, editarCaso:1, docs:1, evidencias:1, verificarEvid:1, actuaciones:1, tareas:1, estadoTareas:1, ia:1, revisarIA:1, reportes:1, autorizarCliente:0, auditoria:1, ejecutiva:0, verSensible:1},
  administrativo:{crearCaso:0, editarCaso:0, docs:1, evidencias:1, verificarEvid:0, actuaciones:0, tareas:0, estadoTareas:1, ia:1, revisarIA:0, reportes:0, autorizarCliente:0, auditoria:0, ejecutiva:0, verSensible:0},
  cliente:       {},
};
const CP_WRITE = ['editarCaso','docs','evidencias','verificarEvid','actuaciones','tareas','estadoTareas','ia','revisarIA'];
const TABS_POR_ROL = {
  administrativo:['resumen','expediente','documentos','evidencias','actuaciones','tareas','ia'],
};

/* ---------- fuentes jurídicas sugeridas (trazabilidad de la IA) ---------- */
function fuentesLegales(c){
  const t=(c.tipo+' '+c.area+' '+c.titulo).toLowerCase(); const f=[];
  if(/peculado|administración pública/.test(t)) f.push('Código Penal (Ley 599 de 2000), art. 397 — Peculado por apropiación');
  if(/lavado/.test(t)) f.push('Código Penal (Ley 599 de 2000), art. 323 — Lavado de activos');
  if(/corrupción privada/.test(t)) f.push('Código Penal (Ley 599 de 2000), art. 250A — Corrupción privada');
  if(/estafa|patrimonio/.test(t)) f.push('Código Penal (Ley 599 de 2000), art. 246 — Estafa');
  if(/falsedad|fe pública/.test(t)) f.push('Código Penal (Ley 599 de 2000), art. 289 — Falsedad en documento privado');
  f.push('Código de Procedimiento Penal (Ley 906 de 2004), arts. 372–376 — Fines, libertad, pertinencia y admisibilidad de la prueba');
  return f;
}

/* ============================================================
   SEMILLA: extiende los casos existentes y agrega casos de ejemplo
   ============================================================ */
function mkDoc(c, o){
  const versiones = o.versiones.map((v,i)=>({v:i+1, ts:v.ts, por:v.por, checksum:fakeHash(c.id+o.nombre+i), size:v.size || (180000 + (parseInt(fakeHash(o.nombre).slice(0,5),16)%3800000))}));
  const last = versiones[versiones.length-1];
  return {
    id:o.id, nombre:o.nombre, tipo:tipoDesdeNombre(o.nombre), categoria:o.categoria, fecha:o.fecha,
    version:versiones.length, versiones, sensibilidad:o.sens, descripcion:o.desc||'',
    storage_url:`repositorio://expedientes/${c.id}/${o.id}/v${versiones.length}/${o.nombre}`,
    checksum:last.checksum, size:last.size, cargadoPor:last.por,
    estadoIA:o.estadoIA||'Analizado', compartidoCliente:!!o.compartido,
  };
}

function cpBaseCase(c, ext){
  Object.assign(c, {
    codigo:c.id, cliente:ext.cliente || c.nombre, titulo:ext.titulo, tipoCaso:ext.tipoCaso, area:ext.area,
    etapa:ext.etapa, riesgo:ext.riesgo, prioridad:ext.prioridad, wf:ext.wf,
    resp:ext.resp, fechas:ext.fechas, descripcion:ext.descripcion||'', contexto:ext.contexto||'',
    observaciones:ext.observaciones||'', infoSensible:ext.infoSensible||'', config:ext.config,
    situacion:ext.situacion||{actual:'',bloqueado:''},
    creadoPor:ext.creadoPor||'u-dir', creadoTs:ext.creadoTs, ultimoEditor:ext.ultimoEditor||ext.creadoPor||'u-dir',
    documentos:[], actuaciones:[], tareas:[], ia:[], reportes:[], reportesCliente:[], solicitudes:[], auditoria:[],
  });
  (ext.matrizExt||[]).forEach((m,i)=>{ if(c.matriz[i]) Object.assign(c.matriz[i], m); });
  c.matriz.forEach((m,i)=>{ if(!m.id) m.id=`EV-${c.id.slice(-4)}-${String(i+1).padStart(2,'0')}`; if(m.sens===undefined) m.sens='Confidencial'; if(m.docId===undefined) m.docId=''; if(m.fecha===undefined) m.fecha=''; });
}

function seedAudit(c, ts, userId, accion, entidad, entidadId, detalle, meta){
  const p = personById(userId);
  c.auditoria.push({id:uid('AU'), ts, usuario: p ? p.nombre : userId, rol: p ? (roleById(p.rol)||{nombre:'Sistema'}).nombre : 'Sistema', accion, entidad, entidadId, detalle, meta:meta||{}});
}

/* genera auditoría coherente a partir de los datos sembrados */
function seedAuditFromData(c, extras){
  seedAudit(c, c.creadoTs, c.creadoPor, 'Creación del caso', 'Case', c.id, `Caso ${c.id} registrado en estado Borrador`, {cliente:c.cliente});
  seedAudit(c, c.creadoTs, c.creadoPor, 'Asignación de responsables', 'Case', c.id, `Abogado: ${pName(c.resp.abogado)} · Director: ${pName(c.resp.director)} · Socio: ${pName(c.resp.socio)}`);
  c.documentos.forEach(d=> d.versiones.forEach(v=> seedAudit(c, v.ts, v.por, v.v===1?'Carga de documento':'Nueva versión de documento', 'Document', d.id, `${d.nombre} · v${v.v}`, {checksum:v.checksum.slice(0,16)+'…', sensibilidad:d.sensibilidad})));
  c.actuaciones.forEach(a=> seedAudit(c, a.ts, a.creadoPor, 'Registro de actuación', 'Action', a.id, `${a.tipo}: ${a.titulo}`, {estado:a.estado}));
  c.tareas.forEach(t=> seedAudit(c, t.ts, t.creadoPor, 'Creación de tarea', 'Task', t.id, `${t.titulo} → ${pName(t.resp)}`, {prioridad:prioLabel(t.prioridad), fecha:t.fecha}));
  c.ia.forEach(a=>{
    seedAudit(c, a.ts, a.solicitadoPor, 'Solicitud de análisis IA', 'AIAnalysis', a.id, `${AGENTS[a.agentId].nombre} · ${a.docIds.length} documentos, ${a.evIds.length} evidencias`);
    if(a.revision) seedAudit(c, a.revision.ts, a.revision.por, 'Revisión de análisis IA', 'AIAnalysis', a.id, `${AI_STATUS[a.estado]} · ${AGENTS[a.agentId].nombre}`, {comentario:a.revision.comentario});
  });
  c.reportesCliente.forEach(r=> seedAudit(c, r.ts, r.por, 'Reporte autorizado para cliente', 'Report', r.id, r.titulo));
  (extras||[]).forEach(e=> seedAudit(c, ...e));
  c.auditoria.sort((a,b)=> a.ts.localeCompare(b.ts));
}

function cpSeedData(){
  /* casos adicionales de ejemplo (borrador y archivado) para completar el flujo de estados */
  CASES.push(
    {id:'CP-2026-0152', nombre:'Transportes del Valle S.A.', tipo:'Presunta estafa agravada · Denuncia de socio minoritario',
     estado:'Borrador', responsableRole:'director', fecha:dOff(-1), ultimaActividad:'Ayer', progreso:8, matriz:[]},
    {id:'CP-2025-0210', nombre:'Inversiones La Sabana S.A.S.', tipo:'Falsedad en documento privado · Caso archivado',
     estado:'Archivado', responsableRole:'socio', fecha:'2025-11-04', ultimaActividad:'Hace 2 meses', progreso:100,
     matriz:[{ev:'Dictamen grafológico', tipo:'Pericial', pretende:'Descartar la alteración de la firma en el pagaré.', hecho:'H4', fuente:'Laboratorio de grafología forense privado', estado:'verificada', relev:'alta', resp:'abogado', obs:'Soporte de la decisión de archivo.'}]}
  );

  /* ---------- CP-2026-0143 · Constructora Andina ---------- */
  let c = caseById('CP-2026-0143');
  cpBaseCase(c, {
    titulo:'Defensa en proceso por peculado y lavado de activos — Contrato 045-2024', tipoCaso:'Defensa técnica',
    area:'Delitos contra la administración pública', etapa:'Investigación', riesgo:'alto', prioridad:'alta', wf:'revision',
    resp:{socio:'u-socio', director:'u-dir', abogado:'u-abo', equipo:['u-abo2'], admin:'u-adm'},
    fechas:{creacion:c.fecha, inicio:dOff(-45), proximoHito:{label:'Audiencia de formulación de imputación', fecha:dOff(9)},
      vencimientos:[{label:'Término para radicar solicitud probatoria', fecha:dOff(3)},{label:'Entrega del informe pericial definitivo', fecha:dOff(15)}],
      relevantes:'Suscripción del contrato: 15/03/2024 · Denuncia de la Contraloría: 02/07/2026'},
    descripcion:'Defensa técnica de la constructora y de su representante legal en la investigación por presunto peculado por apropiación y lavado de activos derivados de la ejecución del contrato de obra pública No. 045-2024 con el municipio de Sabaneta.',
    contexto:'La Fiscalía investiga diferencias entre lo facturado y lo ejecutado en obra. El cliente sostiene que los desembolsos corresponden a mayores cantidades de obra aprobadas por la interventoría.',
    observaciones:'Priorizar la conciliación financiera antes de la audiencia de imputación.',
    infoSensible:'Los correos internos (ene–mar 2025) mencionan a dos directivos. Uso restringido al equipo jurídico; no compartir con terceros ni en reportes al cliente.',
    config:{conf:'Reservada', autorizados:['u-socio','u-dir','u-abo','u-abo2','u-adm'], visibleCliente:true, reglas:'Correos internos sujetos a reserva. El cliente solo accede a reportes y documentos autorizados.'},
    situacion:{actual:'Se está conciliando la evidencia financiera con la facturación del contrato y preparando la solicitud probatoria.', bloqueado:''},
    creadoPor:'u-dir', creadoTs:tsAgo(9*60), ultimoEditor:'u-abo',
    matrizExt:[
      {id:'EV-0143-01', fecha:'2024-03-15', docId:'DOC-0143-01', sens:'Confidencial'},
      {id:'EV-0143-02', fecha:'2025-06-30', docId:'DOC-0143-02', sens:'Confidencial'},
      {id:'EV-0143-03', fecha:'', docId:'DOC-0143-05', sens:'Confidencial'},
      {id:'EV-0143-04', fecha:dOff(-12), docId:'DOC-0143-03', sens:'Confidencial'},
      {id:'EV-0143-05', fecha:'2025-03-31', docId:'DOC-0143-04', sens:'Reservada'},
      {id:'EV-0143-06', fecha:'', docId:'', sens:'Interna'},
    ],
  });
  c.documentos = [
    mkDoc(c,{id:'DOC-0143-01', nombre:'Contrato_obra_publica_045-2024.pdf', categoria:'Contractual', fecha:'2024-03-15', sens:'Confidencial', desc:'Copia auténtica del contrato suscrito con el municipio de Sabaneta.', versiones:[{ts:tsAgo(8*60+40), por:'u-adm'}], compartido:true}),
    mkDoc(c,{id:'DOC-0143-02', nombre:'Extractos_Banco_Occidente_ene-jun_2025.pdf', categoria:'Financiero', fecha:'2025-06-30', sens:'Confidencial', desc:'Extractos de la cuenta empresarial aportados por el cliente.', versiones:[{ts:tsAgo(8*60+30), por:'u-adm'}]}),
    mkDoc(c,{id:'DOC-0143-03', nombre:'Informe_pericial_contable_preliminar.pdf', categoria:'Pericial', fecha:dOff(-12), sens:'Confidencial', desc:'Informe del perito contable independiente.', versiones:[{ts:tsAgo(8*60+20), por:'u-adm'},{ts:tsAgo(3*60), por:'u-adm'}]}),
    mkDoc(c,{id:'DOC-0143-04', nombre:'Correos_internos_ene-mar_2025.zip', categoria:'Comunicaciones', fecha:'2025-03-31', sens:'Reservada', desc:'Correos internos aportados voluntariamente por el cliente. Sujetos a reserva.', versiones:[{ts:tsAgo(8*60+10), por:'u-abo'}]}),
    mkDoc(c,{id:'DOC-0143-05', nombre:'Declaracion_Testigo_Interventor.docx', categoria:'Testimonial', fecha:dOff(-2), sens:'Confidencial', desc:'Borrador de declaración del interventor de obra (testigo X).', versiones:[{ts:tsAgo(50), por:'u-abo2'}], estadoIA:'En cola OCR/IA'}),
    mkDoc(c,{id:'DOC-0143-06', nombre:'Poder_especial_defensa.pdf', categoria:'Procesal', fecha:dOff(-44), sens:'Interna', desc:'Poder especial otorgado a la firma para la defensa.', versiones:[{ts:tsAgo(8*60+50), por:'u-dir'}], compartido:true}),
  ];
  c.actuaciones = [
    {id:'ACT-0143-01', tipo:'Revisión de expediente', titulo:'Revisión integral del expediente y de los hechos denunciados', fecha:dOff(-20), resp:'u-abo', estado:'Realizada', desc:'Lectura de la denuncia, del contrato y de los soportes aportados.', docIds:['DOC-0143-01','DOC-0143-02'], evIds:['EV-0143-01'], resultado:'Se identifican cuatro hechos (H1–H4) y se define una línea de defensa preliminar.', compartirCliente:true, ts:tsAgo(8*60), creadoPor:'u-abo'},
    {id:'ACT-0143-02', tipo:'Reunión con cliente', titulo:'Reunión de vinculación y solicitud formal de documentos', fecha:dOff(-15), resp:'u-abo', estado:'Realizada', desc:'Reunión con el representante legal y el área financiera.', docIds:['DOC-0143-06'], evIds:[], resultado:'El cliente se compromete a aportar extractos, correos internos y certificación societaria.', compartirCliente:true, ts:tsAgo(7*60+50), creadoPor:'u-abo'},
    {id:'ACT-0143-03', tipo:'Revisión de expediente', titulo:'Revisión del informe pericial contable (v2)', fecha:dOff(-3), resp:'u-abo', estado:'Realizada', desc:'Contraste de la versión 2 del informe con la facturación del contrato.', docIds:['DOC-0143-03'], evIds:['EV-0143-04'], resultado:'El informe v2 no evidencia apropiación de recursos; persisten diferencias menores a conciliar.', compartirCliente:false, ts:tsAgo(2*60+40), creadoPor:'u-abo'},
    {id:'ACT-0143-04', tipo:'Solicitud probatoria', titulo:'Radicar memorial de solicitud probatoria ante la Fiscalía', fecha:dOff(3), resp:'u-abo2', estado:'Programada', desc:'Solicitud de práctica de prueba pericial y testimonial.', docIds:['DOC-0143-03'], evIds:['EV-0143-03','EV-0143-04'], resultado:'', compartirCliente:false, ts:tsAgo(2*60), creadoPor:'u-abo'},
    {id:'ACT-0143-05', tipo:'Entrevista', titulo:'Entrevista al interventor de obra', fecha:dOff(6), resp:'u-abo', estado:'Pendiente', desc:'Sujeta a autorización del cliente para el contacto con terceros.', docIds:['DOC-0143-05'], evIds:['EV-0143-03'], resultado:'', compartirCliente:false, ts:tsAgo(100), creadoPor:'u-abo'},
    {id:'ACT-0143-06', tipo:'Audiencia', titulo:'Audiencia de formulación de imputación', fecha:dOff(9), resp:'u-abo', estado:'Programada', desc:'Asistencia a la audiencia ante juez de control de garantías.', docIds:[], evIds:[], resultado:'', compartirCliente:true, ts:tsAgo(95), creadoPor:'u-dir'},
  ];
  c.tareas = [
    {id:'T-0143-01', titulo:'Revisar declaración del testigo X (interventor de obra)', desc:'Contrastar la declaración con las actas de obra antes de la entrevista.', resp:'u-abo', fecha:dOff(8), prioridad:'alta', estado:'Pendiente', docId:'DOC-0143-05', actId:'ACT-0143-05', comentarios:[{por:'u-dir', ts:tsAgo(45), texto:'Priorizar antes de la entrevista con el interventor.'}], adjuntos:[], ts:tsAgo(48), creadoPor:'u-dir'},
    {id:'T-0143-02', titulo:'Conciliar extractos bancarios con la facturación del contrato', desc:'Cruzar desembolsos ene–jun 2025 con las facturas del contrato 045-2024.', resp:'u-abo', fecha:dOff(2), prioridad:'critica', estado:'En curso', docId:'DOC-0143-02', actId:'', comentarios:[], adjuntos:[{nombre:'cruce_preliminar.xlsx', size:48200}], ts:tsAgo(7*60), creadoPor:'u-dir'},
    {id:'T-0143-03', titulo:'Cargar certificación de movimientos societarios', desc:'Clasificar y vincular la certificación de Cámara de Comercio a la matriz (H4).', resp:'u-adm', fecha:dOff(-1), prioridad:'media', estado:'Bloqueada', docId:'', actId:'', comentarios:[{por:'u-adm', ts:tsAgo(3*60+20), texto:'En espera de que el cliente cargue el documento en el portal.'}], adjuntos:[], ts:tsAgo(6*60+30), creadoPor:'u-abo'},
    {id:'T-0143-04', titulo:'Preparar memorial de solicitud probatoria', desc:'Redactar el memorial con base en el informe pericial v2.', resp:'u-abo2', fecha:dOff(3), prioridad:'alta', estado:'Pendiente', docId:'DOC-0143-03', actId:'ACT-0143-04', comentarios:[], adjuntos:[], ts:tsAgo(2*60), creadoPor:'u-dir'},
    {id:'T-0143-05', titulo:'Validar versión 2 del informe pericial', desc:'', resp:'u-abo', fecha:dOff(-4), prioridad:'media', estado:'Completada', docId:'DOC-0143-03', actId:'ACT-0143-03', comentarios:[], adjuntos:[], ts:tsAgo(6*60), creadoPor:'u-dir'},
    {id:'T-0143-06', titulo:'Clasificar correos internos por hecho (H3)', desc:'Etiquetar los correos relevantes para el conocimiento directivo.', resp:'u-adm', fecha:dOff(5), prioridad:'media', estado:'En curso', docId:'DOC-0143-04', actId:'', comentarios:[], adjuntos:[], ts:tsAgo(5*60), creadoPor:'u-abo'},
  ];
  c.solicitudes = [
    {id:'SOL-0143-01', doc:'Certificación de movimientos societarios (Cámara de Comercio)', fecha:dOff(-10), limite:dOff(2), estado:'pendiente', evId:'EV-0143-06', taskId:'T-0143-03'},
    {id:'SOL-0143-02', doc:'Autorización escrita para contactar a la interventoría', fecha:dOff(-10), limite:dOff(4), estado:'pendiente', evId:'EV-0143-03', taskId:''},
    {id:'SOL-0143-03', doc:'Extractos bancarios ene–jun 2025', fecha:dOff(-15), limite:dOff(-8), estado:'entregado', docId:'DOC-0143-02'},
  ];
  const ia1 = generarAnalisis(c, 'probatorio', ['DOC-0143-01','DOC-0143-02','DOC-0143-03'], ['EV-0143-01','EV-0143-02','EV-0143-03','EV-0143-04'], 'u-adm', tsAgo(6*60));
  ia1.estado='aprobado'; ia1.revision={por:'u-abo', ts:tsAgo(5*60), comentario:'Validado. Conciliar extractos antes del memorial.', decision:'aprobado'};
  const ia2 = generarAnalisis(c, 'gestion', c.documentos.map(d=>d.id), c.matriz.map(m=>m.id), 'u-abo', tsAgo(70));
  c.ia = [ia2, ia1];
  c.reportesCliente = [{id:'REP-0143-01', tipo:'ejecutivo', titulo:'Reporte de avance para el cliente', ts:tsAgo(4*60), por:'u-dir', html:buildReportHtml(c,'ejecutivo','cliente', 'u-dir')}];
  seedAuditFromData(c, [
    [tsAgo(8*60+55), 'u-dir', 'Vinculación con cliente', 'Case', c.id, 'Cliente: Constructora Andina S.A.S.'],
    [tsAgo(6*60+10), 'u-abo', 'Cambio de estado', 'Case', c.id, 'Borrador → En revisión', {comentario:'Expediente completo para revisión jurídica.'}],
    [tsAgo(3*60+5), 'u-dir', 'Actualización de documento', 'Document', 'DOC-0143-01', 'Contrato_obra_publica_045-2024.pdf compartido con el cliente'],
    [tsAgo(55), 'u-abo2', 'Descarga de documento', 'Document', 'DOC-0143-02', 'Extractos_Banco_Occidente_ene-jun_2025.pdf · v1'],
    [tsAgo(20), 'u-socio', 'Acceso al caso', 'Case', c.id, 'Consulta del expediente'],
  ]);

  /* ---------- CP-2026-0098 · Sociedad Minera del Cauca ---------- */
  c = caseById('CP-2026-0098');
  const d98 = diasHasta(c.fecha) * -1; // días desde la apertura
  cpBaseCase(c, {
    titulo:'Defensa en indagación por presunto lavado de activos — Título minero 12-2023', tipoCaso:'Defensa técnica',
    area:'Lavado de activos', etapa:'Indagación preliminar', riesgo:'critico', prioridad:'alta', wf:'revision',
    resp:{socio:'u-socio', director:'u-dir', abogado:'u-abo', equipo:[], admin:'u-adm'},
    fechas:{creacion:c.fecha, inicio:c.fecha, proximoHito:{label:'Entrevista con la Fiscalía especializada', fecha:dOff(12)},
      vencimientos:[{label:'Respuesta al requerimiento de información de la UIAF', fecha:dOff(1)}], relevantes:'ROS reportado por la entidad financiera en 2025.'},
    descripcion:'Acompañamiento a la sociedad en la indagación preliminar derivada de un reporte de operaciones sospechosas asociado al título minero 12-2023.',
    contexto:'La UIAF reportó operaciones inusuales en cuentas vinculadas al proyecto minero.',
    observaciones:'Caso de riesgo crítico: requiere aprobación del Socio antes de responder a la UIAF.',
    infoSensible:'Posible vinculación de un tercero con antecedentes en listas restrictivas.',
    config:{conf:'Reservada', autorizados:['u-socio','u-dir','u-abo','u-adm'], visibleCliente:false, reglas:'Sin visibilidad para el cliente hasta aprobar la estrategia.'},
    situacion:{actual:'El equipo analiza el ROS y prepara la respuesta al requerimiento de información.', bloqueado:'Falta la autorización del Socio para definir la ruta procesal.'},
    creadoPor:'u-dir', creadoTs:tsAgo(d98*1440 - 9*60), ultimoEditor:'u-abo',
    matrizExt:[{id:'EV-0098-01', fecha:'2023-05-10', docId:'DOC-0098-01', sens:'Confidencial'},{id:'EV-0098-02', fecha:'2025-11-20', docId:'DOC-0098-02', sens:'Reservada'}],
  });
  c.documentos = [
    mkDoc(c,{id:'DOC-0098-01', nombre:'Contrato_exploracion_minera_12-2023.pdf', categoria:'Contractual', fecha:'2023-05-10', sens:'Confidencial', desc:'Título minero y condiciones de exploración.', versiones:[{ts:tsAgo(d98*1440-10*60), por:'u-adm'}]}),
    mkDoc(c,{id:'DOC-0098-02', nombre:'Reporte_ROS_UIAF_2025.pdf', categoria:'Financiero', fecha:'2025-11-20', sens:'Reservada', desc:'Reporte de operaciones sospechosas.', versiones:[{ts:tsAgo(d98*1440-11*60), por:'u-abo'}]}),
  ];
  c.actuaciones = [
    {id:'ACT-0098-01', tipo:'Revisión de expediente', titulo:'Revisión inicial del ROS y del título minero', fecha:dOff(-30), resp:'u-abo', estado:'Realizada', desc:'', docIds:['DOC-0098-01','DOC-0098-02'], evIds:['EV-0098-01','EV-0098-02'], resultado:'Se identifican operaciones que requieren soporte documental del cliente.', compartirCliente:false, ts:tsAgo(30*1440), creadoPor:'u-abo'},
    {id:'ACT-0098-02', tipo:'Derecho de petición', titulo:'Derecho de petición a la Agencia Nacional de Minería', fecha:dOff(5), resp:'u-abo', estado:'Programada', desc:'Solicitud de certificación de producción reportada.', docIds:[], evIds:[], resultado:'', compartirCliente:false, ts:tsAgo(10*1440), creadoPor:'u-dir'},
  ];
  c.tareas = [
    {id:'T-0098-01', titulo:'Analizar el reporte de operaciones sospechosas (ROS)', desc:'', resp:'u-abo', fecha:dOff(-2), prioridad:'alta', estado:'En curso', docId:'DOC-0098-02', actId:'', comentarios:[], adjuntos:[], ts:tsAgo(20*1440), creadoPor:'u-dir'},
    {id:'T-0098-02', titulo:'Preparar la respuesta al requerimiento de la UIAF', desc:'', resp:'u-abo', fecha:dOff(1), prioridad:'critica', estado:'Pendiente', docId:'', actId:'', comentarios:[], adjuntos:[], ts:tsAgo(5*1440), creadoPor:'u-dir'},
  ];
  c.ia = [generarAnalisis(c, 'recomendacion', ['DOC-0098-01','DOC-0098-02'], ['EV-0098-01','EV-0098-02'], 'u-socio', tsAgo(2*1440))];
  seedAuditFromData(c, [[tsAgo(3*1440), 'u-abo', 'Cambio de estado', 'Case', c.id, 'Borrador → En revisión']]);

  /* ---------- CP-2026-0071 · Grupo Empresarial Ferretero (cerrado) ---------- */
  c = caseById('CP-2026-0071');
  const d71 = diasHasta(c.fecha) * -1;
  cpBaseCase(c, {
    titulo:'Defensa por corrupción privada — Cierre del caso', tipoCaso:'Defensa técnica', area:'Corrupción privada',
    etapa:'Acusación', riesgo:'bajo', prioridad:'baja', wf:'cerrado',
    resp:{socio:'u-socio', director:'u-dir', abogado:'u-abo2', equipo:['u-abo'], admin:'u-adm'},
    fechas:{creacion:c.fecha, inicio:c.fecha, proximoHito:{label:'', fecha:''}, vencimientos:[], relevantes:'Aprobación del cierre por el Socio.'},
    descripcion:'Defensa de la compañía frente a la denuncia por presuntos pagos irregulares a un proveedor.',
    contexto:'La Fiscalía solicitó preclusión tras el informe pericial financiero definitivo.',
    observaciones:'Caso cerrado con todos los pendientes resueltos.', infoSensible:'',
    config:{conf:'Confidencial', autorizados:['u-socio','u-dir','u-abo','u-abo2','u-adm'], visibleCliente:true, reglas:''},
    situacion:{actual:'Caso cerrado y aprobado por el Socio.', bloqueado:''},
    creadoPor:'u-dir', creadoTs:tsAgo(d71*1440 - 9*60), ultimoEditor:'u-socio',
    matrizExt:[{docId:'DOC-0071-01', fecha:'2024-12-15'},{docId:'DOC-0071-02', fecha:dOff(-40)},{docId:'DOC-0071-03', fecha:dOff(-22)}],
  });
  c.documentos = [
    mkDoc(c,{id:'DOC-0071-01', nombre:'Actas_junta_directiva_2024.pdf', categoria:'Societario', fecha:'2024-12-15', sens:'Confidencial', versiones:[{ts:tsAgo((d71-3)*1440), por:'u-adm'}]}),
    mkDoc(c,{id:'DOC-0071-02', nombre:'Informe_pericial_financiero_definitivo.pdf', categoria:'Pericial', fecha:dOff(-40), sens:'Confidencial', versiones:[{ts:tsAgo(45*1440), por:'u-adm'},{ts:tsAgo(40*1440), por:'u-adm'}]}),
    mkDoc(c,{id:'DOC-0071-03', nombre:'Resumen_ejecutivo_cierre.docx', categoria:'Procesal', fecha:dOff(-22), sens:'Interna', versiones:[{ts:tsAgo(22*1440), por:'u-dir'}], compartido:true}),
  ];
  c.actuaciones = [
    {id:'ACT-0071-01', tipo:'Audiencia', titulo:'Audiencia de solicitud de preclusión', fecha:dOff(-25), resp:'u-abo2', estado:'Realizada', desc:'', docIds:['DOC-0071-02'], evIds:[], resultado:'El juez decretó la preclusión de la investigación.', compartirCliente:true, ts:tsAgo(30*1440), creadoPor:'u-abo2'},
  ];
  c.tareas = [
    {id:'T-0071-01', titulo:'Preparar resumen ejecutivo de cierre', desc:'', resp:'u-abo2', fecha:dOff(-23), prioridad:'alta', estado:'Completada', docId:'DOC-0071-03', actId:'', comentarios:[], adjuntos:[], ts:tsAgo(26*1440), creadoPor:'u-dir'},
  ];
  const ia71 = generarAnalisis(c, 'recomendacion', c.documentos.map(d=>d.id), c.matriz.map(m=>m.id), 'u-socio', tsAgo(23*1440));
  ia71.estado='aprobado'; ia71.revision={por:'u-socio', ts:tsAgo(22*1440), comentario:'Se aprueba el cierre.', decision:'aprobado'};
  c.ia = [ia71];
  c.reportesCliente = [{id:'REP-0071-01', tipo:'ejecutivo', titulo:'Reporte final del caso', ts:tsAgo(21*1440), por:'u-socio', html:buildReportHtml(c,'ejecutivo','cliente','u-socio')}];
  seedAuditFromData(c, [
    [tsAgo(40*1440), 'u-abo2', 'Cambio de estado', 'Case', c.id, 'Borrador → En revisión'],
    [tsAgo(35*1440), 'u-socio', 'Cambio de estado', 'Case', c.id, 'En revisión → Aprobado'],
    [tsAgo(21*1440), 'u-socio', 'Cambio de estado', 'Case', c.id, 'Aprobado → Cerrado', {comentario:'Sin pendientes críticos.'}],
  ]);

  /* ---------- CP-2026-0152 · Transportes del Valle (borrador) ---------- */
  c = caseById('CP-2026-0152');
  cpBaseCase(c, {
    cliente:'Transportes del Valle S.A.', titulo:'Representación en denuncia por presunta estafa agravada', tipoCaso:'Defensa técnica',
    area:'Delitos contra el patrimonio económico', etapa:'Indagación preliminar', riesgo:'medio', prioridad:'media', wf:'borrador',
    resp:{socio:'u-socio', director:'u-dir', abogado:'u-abo2', equipo:[], admin:'u-adm2'},
    fechas:{creacion:c.fecha, inicio:c.fecha, proximoHito:{label:'Reunión de vinculación con el cliente', fecha:dOff(4)}, vencimientos:[], relevantes:''},
    descripcion:'Denuncia presentada por un socio minoritario por presunta estafa en la venta de acciones.',
    contexto:'', observaciones:'Pendiente completar la ficha del caso antes de enviarlo a revisión.', infoSensible:'',
    config:{conf:'Confidencial', autorizados:['u-socio','u-dir','u-abo2','u-adm2'], visibleCliente:false, reglas:''},
    situacion:{actual:'Caso en construcción: se está cargando la documentación inicial.', bloqueado:''},
    creadoPor:'u-dir', creadoTs:tsAgo(1440+120), ultimoEditor:'u-dir',
  });
  c.documentos = [ mkDoc(c,{id:'DOC-0152-01', nombre:'Denuncia_penal_socio_minoritario.pdf', categoria:'Procesal', fecha:dOff(-6), sens:'Confidencial', versiones:[{ts:tsAgo(1440+90), por:'u-dir'}], estadoIA:'Sin procesar'}) ];
  c.tareas = [
    {id:'T-0152-01', titulo:'Solicitar estados financieros 2024 al cliente', desc:'', resp:'u-abo2', fecha:dOff(4), prioridad:'alta', estado:'Pendiente', docId:'', actId:'', comentarios:[], adjuntos:[], ts:tsAgo(1440+60), creadoPor:'u-dir'},
  ];
  seedAuditFromData(c);

  /* ---------- CP-2025-0210 · Inversiones La Sabana (archivado) ---------- */
  c = caseById('CP-2025-0210');
  cpBaseCase(c, {
    titulo:'Defensa por falsedad en documento privado — Archivo de diligencias', tipoCaso:'Defensa técnica', area:'Delitos contra la fe pública',
    etapa:'Indagación preliminar', riesgo:'bajo', prioridad:'baja', wf:'archivado',
    resp:{socio:'u-socio', director:'u-dir', abogado:'u-abo', equipo:[], admin:'u-adm'},
    fechas:{creacion:c.fecha, inicio:c.fecha, proximoHito:{label:'',fecha:''}, vencimientos:[], relevantes:'Archivo de diligencias por atipicidad.'},
    descripcion:'Denuncia por presunta alteración de un pagaré. La Fiscalía archivó las diligencias.',
    config:{conf:'Confidencial', autorizados:['u-socio','u-dir','u-abo','u-adm'], visibleCliente:true, reglas:''},
    situacion:{actual:'Caso archivado con trazabilidad completa.', bloqueado:''},
    creadoPor:'u-dir', creadoTs:'2025-11-04T14:00:00.000Z', ultimoEditor:'u-socio',
    matrizExt:[{docId:'DOC-0210-01', fecha:'2025-12-01'}],
  });
  c.documentos = [ mkDoc(c,{id:'DOC-0210-01', nombre:'Dictamen_grafologico.pdf', categoria:'Pericial', fecha:'2025-12-01', sens:'Confidencial', versiones:[{ts:'2025-12-02T15:00:00.000Z', por:'u-adm'}], compartido:true}) ];
  seedAuditFromData(c, [
    ['2026-01-10T16:00:00.000Z', 'u-socio', 'Cambio de estado', 'Case', c.id, 'Aprobado → Cerrado'],
    ['2026-07-15T16:00:00.000Z', 'u-socio', 'Cambio de estado', 'Case', c.id, 'Cerrado → Archivado'],
  ]);
}
