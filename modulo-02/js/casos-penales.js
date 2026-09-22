/* ============================================================
   MÓDULO 02 · CASOS PENALES — VISTAS Y FLUJO
   Caso → expediente → documentos → evidencias → actuaciones → tareas
   → análisis IA → revisión jurídica → aprobación → seguimiento
   → reportes → cierre / archivo.
   Depende de modulo02.js (roles, agentes, chat, matriz) y casos-data.js.
   ============================================================ */

Object.assign(ICONS, {
  alert:'<svg class="icon" viewBox="0 0 24 24"><path d="M12 3.5l9 16H3z"/><path d="M12 10v4.2M12 17.2h.01"/></svg>',
  chart:'<svg class="icon" viewBox="0 0 24 24"><path d="M4 20V11M10 20V5M16 20v-6M21 20H3"/></svg>',
  file:'<svg class="icon" viewBox="0 0 24 24" style="width:15px;height:15px;"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>',
  lock:'<svg class="icon" viewBox="0 0 24 24" style="width:12px;height:12px;"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  back:'<svg class="icon" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>',
  x:'<svg class="icon" viewBox="0 0 24 24" style="width:11px;height:11px;stroke:#fff;"><path d="M6 6l12 12M18 6L6 18"/></svg>',
});

/* ---------- estado de la interfaz ---------- */
const cpState = {
  mode:'lista', search:'', quick:'', filtros:{wf:'', etapa:'', riesgo:'', prioridad:'', resp:''},
  tab:'resumen', pendingTab:null,
  ia:{agent:null, docs:new Set(), evs:new Set(), sel:null, running:false},
  rep:{tipo:'ejecutivo', aud:'director', html:null, id:null},
  alertTab:'criticas', audit:{accion:'', entidad:'', q:''},
  docFiltro:'', actFiltro:'', tareaFiltro:{estado:'', resp:'', mias:false},
  accesos:new Set(),
};

/* ============================================================
   HELPERS
   ============================================================ */
function can(p, c){
  const P = CP_PERMS[currentRoleId] || {};
  if(!P[p]) return false;
  if(c && CP_WRITE.includes(p) && !editable(c)) return false;
  if(c && p==='editarCaso' && currentRoleId==='abogado'){ const u=currentUser().id; return c.resp.abogado===u || c.resp.equipo.includes(u); }
  return true;
}
const editable = c => !['cerrado','archivado'].includes(c.wf);
const esActivo = c => !['cerrado','archivado'].includes(c.wf);
function tabsParaRol(){ return TABS_POR_ROL[currentRoleId] || CP_TABS.map(t=>t.id); }

function casosVisibles(){
  if(['socio','director'].includes(currentRoleId)) return CASES;
  if(currentRoleId==='cliente') return CASES.filter(c=> c.cliente===CLIENTE_DEMO && c.config.visibleCliente && c.wf!=='borrador');
  const u = currentUser().id;
  return CASES.filter(c=> c.config.autorizados.includes(u));
}
function docsVisibles(c){
  // la sensibilidad controla el acceso: el administrativo no abre documentos reservados
  return c.documentos.map(d=>({...d, _locked: d.sensibilidad==='Reservada' && !can('verSensible')}));
}
function personaDeRol(c, roleId){
  if(!c.resp) return '';
  if(roleId==='cliente') return c.cliente;
  return pName({socio:c.resp.socio, director:c.resp.director, abogado:c.resp.abogado, administrativo:c.resp.admin}[roleId]);
}
function wfBadge(wf){ return `<span class="wf ${wf}">${wfLabel(wf)}</span>`; }
function riskPill(r){ return `<span class="risk ${r}">${riskLabel(r)}</span>`; }
function prioTag(p){ return `<span class="tag ${p==='critica'?'danger':p==='alta'?'warn':''}">${prioLabel(p)}</span>`; }
function sensTag(s){ return `<span class="tag ${s==='Reservada'?'dark':s==='Confidencial'?'warn':''}">${s==='Reservada'?I('lock').replace('class="icon"','class="icon" style="width:11px;height:11px;display:inline;vertical-align:-1px;stroke:#fff;"')+' ':''}${esc(s)}</span>`; }
function estadoTareaTag(e){ return `<span class="tag ${e==='Completada'?'ok':e==='Bloqueada'?'danger':e==='En curso'?'accent':''}">${e}</span>`; }
function estadoActTag(e){ return `<span class="tag ${e==='Realizada'?'ok':e==='Cancelada'?'danger':e==='Programada'?'accent':'warn'}">${e}</span>`; }
function docName(c, id){ const d=c.documentos.find(x=>x.id===id); return d ? d.nombre : ''; }
function opts(list, sel, empty){
  return (empty!==undefined ? `<option value="">${esc(empty)}</option>` : '') + list.map(o=>{
    const v = typeof o==='string' ? o : o.id; const l = typeof o==='string' ? o : o.label;
    return `<option value="${esc(v)}" ${v===sel?'selected':''}>${esc(l)}</option>`;
  }).join('');
}
function ff(label, inner, o={}){ return `<div class="form-field ${o.full?'full':''}" ${o.id?`data-f="${o.id}"`:''}><label>${label}${o.req?' <span class="req">*</span>':''}</label>${inner}${o.hint?`<div class="hint">${o.hint}</div>`:''}</div>`; }
const sleep = ms => new Promise(r=>setTimeout(r, ms));
function cpDownload(blob, name){
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name;
  document.body.appendChild(a); a.click(); setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); }, 800);
}
function csvCell(v){ const s=String(v??''); return /[",;\n]/.test(s) ? '"'+s.replace(/"/g,'""')+'"' : s; }
function syncNav(view){ document.querySelectorAll('.sb-nav li[data-view]').forEach(x=>x.classList.toggle('active', x.dataset.view===view)); }
function goView(view){ showView(view); syncNav(view); }

/* ---------- auditoría (AuditLog) ---------- */
function logAudit(c, accion, entidad, entidadId, detalle, meta, override){
  const u = override || (currentRoleId==='cliente'
    ? {nombre:`Cliente · ${c.cliente}`, rol:'Cliente'}
    : {nombre:currentUser().nombre, rol:currentRole().nombre});
  c.auditoria.push({id:uid('AU'), ts:nowIso(), usuario:u.nombre, rol:u.rol, accion, entidad, entidadId, detalle, meta:meta||{}});
}
function registrarAcceso(c){
  const k = currentRoleId+'_'+c.id;
  if(cpState.accesos.has(k)) return;
  cpState.accesos.add(k);
  logAudit(c, 'Acceso al caso', 'Case', c.id, currentRoleId==='cliente' ? 'Consulta del portal del cliente' : 'Consulta del expediente');
}

/* ---------- vencimientos y alertas ---------- */
function proximoVencimiento(c){
  if(!esActivo(c)) return null;
  const items = [];
  c.tareas.filter(t=>t.estado!=='Completada').forEach(t=> items.push({label:t.titulo, fecha:t.fecha, tipo:'Tarea'}));
  (c.fechas.vencimientos||[]).forEach(v=> v.fecha && items.push({label:v.label, fecha:v.fecha, tipo:'Vencimiento'}));
  if(c.fechas.proximoHito && c.fechas.proximoHito.fecha) items.push({label:c.fechas.proximoHito.label, fecha:c.fechas.proximoHito.fecha, tipo:'Hito'});
  if(!items.length) return null;
  items.forEach(i=> i.dias = diasHasta(i.fecha));
  items.sort((a,b)=> a.dias-b.dias);
  return items[0];
}
function proximoVencimientoHtml(c){
  const v = proximoVencimiento(c);
  if(!v) return '<span class="muted">—</span>';
  const cls = v.dias<0 ? 'over' : v.dias<=3 ? 'soon' : '';
  const txt = v.dias<0 ? `Vencido hace ${-v.dias} d` : v.dias===0 ? 'Hoy' : `En ${v.dias} d · ${fmtFecha(v.fecha)}`;
  return `<div class="due ${cls}">${txt}<small>${esc(v.label)}</small></div>`;
}
const NIVEL_ORDEN = {rojo:0, naranja:1, amarillo:2, verde:3};
function alertasCaso(c){
  const out = [];
  if(c.wf==='archivado') return out;
  if(esActivo(c)){
    c.tareas.filter(t=>t.estado!=='Completada').forEach(t=>{
      const d = diasHasta(t.fecha);
      if(d<0) out.push({nivel:'rojo', tipo:'Tarea vencida', texto:`${t.titulo} · venció hace ${-d} día(s) · ${pName(t.resp)}`, fecha:t.fecha, tab:'tareas'});
      else if(d<=3 && ['critica','alta'].includes(t.prioridad)) out.push({nivel:'rojo', tipo:'Vencimiento crítico', texto:`${t.titulo} · ${d===0?'vence hoy':'vence en '+d+' día(s)'} · ${pName(t.resp)}`, fecha:t.fecha, tab:'tareas'});
      else if(d<=7) out.push({nivel:'naranja', tipo:'Próximo vencimiento', texto:`${t.titulo} · vence en ${d} día(s)`, fecha:t.fecha, tab:'tareas'});
      if(t.estado==='Bloqueada') out.push({nivel:'naranja', tipo:'Tarea bloqueada', texto:`${t.titulo}${t.comentarios.length?' · '+t.comentarios[t.comentarios.length-1].texto:''}`, fecha:null, tab:'tareas'});
    });
    (c.fechas.vencimientos||[]).forEach(v=>{
      if(!v.fecha) return; const d = diasHasta(v.fecha);
      if(d<0) out.push({nivel:'rojo', tipo:'Vencimiento procesal vencido', texto:v.label, fecha:v.fecha, tab:'expediente'});
      else if(d<=3) out.push({nivel:'rojo', tipo:'Vencimiento crítico', texto:`${v.label} · ${d===0?'hoy':'en '+d+' día(s)'}`, fecha:v.fecha, tab:'expediente'});
      else if(d<=10) out.push({nivel:'naranja', tipo:'Próximo vencimiento procesal', texto:`${v.label} · en ${d} días`, fecha:v.fecha, tab:'expediente'});
    });
    const h = c.fechas.proximoHito;
    if(h && h.fecha){ const d=diasHasta(h.fecha); if(d>=0 && d<=10) out.push({nivel:'naranja', tipo:'Próximo hito', texto:`${h.label} · en ${d} días`, fecha:h.fecha, tab:'expediente'}); }
    c.matriz.filter(m=>m.estado==='pendiente').forEach(m=> out.push({nivel:'naranja', tipo:'Documento pendiente', texto:`${m.ev} · ${m.obs}`, fecha:null, tab:'evidencias'}));
    c.solicitudes.filter(s=>s.estado==='pendiente').forEach(s=>{ const d=diasHasta(s.limite); out.push({nivel:d<0?'rojo':'naranja', tipo:'Pendiente del cliente', texto:`${s.doc} · ${d<0?'plazo vencido':'plazo: '+fmtFecha(s.limite)}`, fecha:s.limite, tab:'resumen'}); });
    c.matriz.filter(m=>m.estado!=='pendiente' && !m.docId).forEach(m=> out.push({nivel:'amarillo', tipo:'Evidencia sin clasificar', texto:`${m.ev} · sin documento soporte asociado`, fecha:null, tab:'evidencias'}));
    c.matriz.filter(m=>m.estado==='revision').forEach(m=> out.push({nivel:'amarillo', tipo:'Evidencia en revisión', texto:m.ev, fecha:null, tab:'evidencias'}));
    c.ia.filter(a=>a.estado==='pendiente').forEach(a=> out.push({nivel:'amarillo', tipo:'Análisis IA pendiente de revisión', texto:`${AGENTS[a.agentId].nombre} · solicitado por ${pName(a.solicitadoPor)}`, fecha:null, tab:'ia', ref:a.id}));
  }
  c.actuaciones.filter(a=>a.estado==='Realizada' && diasHasta(a.fecha)>=-7 && diasHasta(a.fecha)<=0).forEach(a=> out.push({nivel:'verde', tipo:'Actuación completada', texto:a.titulo, fecha:a.fecha, tab:'actuaciones'}));
  return out.sort((a,b)=> NIVEL_ORDEN[a.nivel]-NIVEL_ORDEN[b.nivel]);
}
function alertItemHtml(a, withCase){
  return `<div class="alert-item clickable" data-case="${a.c?a.c.id:''}" data-tab="${a.tab}" data-ref="${a.ref||''}">
    <span class="a-dot ${a.nivel}"></span>
    <div class="a-body"><div class="a-type">${a.tipo}${withCase?` · ${a.c.id} · ${esc(a.c.cliente)}`:''}</div>${esc(a.texto)}</div>
    ${a.fecha?`<span class="a-date">${fmtFecha(a.fecha)}</span>`:''}
  </div>`;
}
const esCritico = c => esActivo(c) && (c.riesgo==='critico' || alertasCaso(c).some(a=>a.nivel==='rojo'));

function updateBell(){
  const btn = document.getElementById('icon-slot-tbbell');
  let n;
  if(currentRoleId==='cliente') n = casosVisibles().reduce((s,c)=> s + c.solicitudes.filter(x=>x.estado==='pendiente').length, 0);
  else n = casosVisibles().reduce((s,c)=> s + alertasCaso(c).filter(a=>['rojo','naranja'].includes(a.nivel)).length, 0);
  btn.innerHTML = I('bell') + (n ? `<span class="bell-count">${n}</span>` : '');
  btn.title = currentRoleId==='cliente' ? 'Documentos solicitados pendientes' : 'Alertas y vencimientos';
  const crit = currentRoleId==='cliente' ? 0 : casosVisibles().reduce((s,c)=> s + alertasCaso(c).filter(a=>a.nivel==='rojo').length, 0);
  const nb = document.getElementById('navAlertBadge'); if(nb) nb.textContent = crit || '';
}

/* ============================================================
   MODAL / PANEL LATERAL GENÉRICOS
   ============================================================ */
const cpModal = document.getElementById('cpModal');
function openModal({title, sub='', body='', foot=[], size='mid', leftNote=''}){
  document.getElementById('cpModalTitle').textContent = title;
  document.getElementById('cpModalSub').textContent = sub;
  document.getElementById('cpModalBox').className = 'modal ' + size;
  document.getElementById('cpModalBody').innerHTML = body;
  setModalFoot(foot, leftNote);
  cpModal.classList.add('show');
  document.getElementById('cpModalBox').scrollTop = 0;
  return document.getElementById('cpModalBody');
}
function setModalFoot(foot, leftNote=''){
  const f = document.getElementById('cpModalFoot'); f.innerHTML = leftNote ? `<span class="mf-left">${leftNote}</span>` : '';
  foot.forEach(b=>{
    const el = document.createElement('button'); el.className = 'btn ' + (b.cls||''); el.textContent = b.label;
    if(b.id) el.id = b.id; if(b.disabled) el.disabled = true;
    el.addEventListener('click', b.onClick || closeModal); f.appendChild(el);
  });
}
function closeModal(){ cpModal.classList.remove('show'); }
document.getElementById('cpModalClose').addEventListener('click', closeModal);

const cpDrawer = document.getElementById('cpDrawer'), cpOverlay = document.getElementById('cpOverlay');
function openCpDrawer(kicker, title, html){
  document.getElementById('cpDrawerKicker').textContent = kicker;
  document.getElementById('cpDrawerTitle').textContent = title;
  const b = document.getElementById('cpDrawerBody'); b.innerHTML = html;
  cpDrawer.classList.add('open'); cpOverlay.classList.add('show'); cpDrawer.scrollTop = 0;
  return b;
}
function closeCpDrawer(){ cpDrawer.classList.remove('open'); cpOverlay.classList.remove('show'); }
document.getElementById('cpDrawerClose').addEventListener('click', closeCpDrawer);
cpOverlay.addEventListener('click', closeCpDrawer);

async function runProcess(container, steps, delay=230){
  container.innerHTML = `<div class="proc">${steps.map((s,i)=>`<div class="proc-step" data-i="${i}"><span class="ps-ico"></span><span>${esc(s)}</span></div>`).join('')}</div>`;
  for(let i=0;i<steps.length;i++){
    const el = container.querySelector(`[data-i="${i}"]`);
    el.classList.add('run'); await sleep(delay);
    el.classList.remove('run'); el.classList.add('done');
    el.querySelector('.ps-ico').innerHTML = I('check');
  }
}

/* ============================================================
   VISTA 01 · DASHBOARD DE CASOS (lista / kanban / KPIs / filtros)
   ============================================================ */
const KPI_DEFS = [
  {id:'activos',  label:'Casos activos',               cls:'',       test:c=>esActivo(c)},
  {id:'revision', label:'Casos en revisión',           cls:'accent', test:c=>c.wf==='revision'},
  {id:'criticos', label:'Casos críticos',              cls:'danger', test:esCritico},
  {id:'vencer',   label:'Próximos a vencimiento (7 d)',cls:'warn',   test:c=>{ const v=proximoVencimiento(c); return !!v && v.dias<=7; }},
  {id:'docs',     label:'Con documentos pendientes',   cls:'warn',   test:c=>esActivo(c) && (c.matriz.some(m=>m.estado==='pendiente') || c.solicitudes.some(s=>s.estado==='pendiente'))},
  {id:'alertas',  label:'Casos con alertas',           cls:'danger', test:c=>alertasCaso(c).some(a=>a.nivel!=='verde')},
  {id:'ia',       label:'Análisis IA pendientes de revisión', cls:'accent', test:c=>c.ia.some(a=>a.estado==='pendiente')},
];

function cpCasosFiltrados(){
  const s = cpState.search.trim().toLowerCase(), f = cpState.filtros;
  const quick = KPI_DEFS.find(k=>k.id===cpState.quick);
  return casosVisibles().filter(c=>{
    if(s){
      const hay = [c.id, c.cliente, c.titulo, c.tipo, c.etapa, c.area, wfLabel(c.wf), riskLabel(c.riesgo), pName(c.resp.abogado), pName(c.resp.director)].join(' ').toLowerCase();
      if(!hay.includes(s)) return false;
    }
    if(f.wf && c.wf!==f.wf) return false;
    if(f.etapa && c.etapa!==f.etapa) return false;
    if(f.riesgo && c.riesgo!==f.riesgo) return false;
    if(f.prioridad && c.prioridad!==f.prioridad) return false;
    if(f.resp && c.resp.abogado!==f.resp && !c.resp.equipo.includes(f.resp)) return false;
    if(quick && !quick.test(c)) return false;
    return true;
  });
}

function renderCasosDashboard(lista){
  const vis = casosVisibles();
  const k = document.getElementById('cpKpis'); k.innerHTML = '';
  KPI_DEFS.forEach(d=>{
    const b = document.createElement('button');
    b.className = `kpi ${d.cls} ${cpState.quick===d.id?'on':''}`;
    b.innerHTML = `<b>${vis.filter(d.test).length}</b><span>${d.label}</span>`;
    b.title = 'Filtrar la lista por este indicador';
    b.addEventListener('click', ()=>{ cpState.quick = cpState.quick===d.id ? '' : d.id; buildCasosList(); });
    k.appendChild(b);
  });
  document.getElementById('cpBtnNuevo').style.display = can('crearCaso') ? '' : 'none';
  const nf = Object.values(cpState.filtros).filter(Boolean).length + (cpState.quick?1:0);
  document.getElementById('cpFiltrosCount').textContent = nf || '';
  document.getElementById('cpListMode').style.display = cpState.mode==='lista' ? '' : 'none';
  const kb = document.getElementById('cpKanban');
  kb.style.display = cpState.mode==='kanban' ? 'grid' : 'none';
  document.querySelectorAll('#cpViewMode button').forEach(b=> b.classList.toggle('on', b.dataset.mode===cpState.mode));
  if(cpState.mode==='kanban'){
    kb.innerHTML = WF.map(w=>{
      const cs = lista.filter(c=>c.wf===w.id);
      return `<div class="kb-col"><div class="kb-col-head"><span>${w.label}</span><span class="tag">${cs.length}</span></div>
        ${cs.map(c=>`<div class="kb-card" data-open="${c.id}">
          <span class="kb-id">${c.id}</span>
          <span class="kb-title">${esc(c.cliente)}</span>
          <span class="muted small">${esc(c.titulo)}</span>
          <div class="kb-meta">${riskPill(c.riesgo)} <span>${esc(c.etapa)}</span></div>
          <div class="kb-meta">${esc(pName(c.resp.abogado))}</div>
          ${esActivo(c)?proximoVencimientoHtml(c):''}
        </div>`).join('') || '<div class="muted small" style="padding:6px 4px;">Sin casos</div>'}
      </div>`;
    }).join('') + `<p class="kb-note">Los cambios de estado se realizan desde el detalle del caso y respetan el flujo Borrador → En revisión → Aprobado → Cerrado → Archivado.</p>`;
    kb.querySelectorAll('[data-open]').forEach(el=> el.addEventListener('click', ()=> openCaseDetail(el.dataset.open)));
  }
}

function buildFiltersUI(){
  const box = document.getElementById('cpFilters');
  const abogados = PEOPLE.filter(p=>p.rol==='abogado');
  box.innerHTML = `
    ${ff('Estado', `<select data-flt="wf">${opts(WF,'', 'Todos')}</select>`)}
    ${ff('Etapa procesal', `<select data-flt="etapa">${opts(ETAPAS,'', 'Todas')}</select>`)}
    ${ff('Riesgo', `<select data-flt="riesgo">${opts(RIESGOS,'', 'Todos')}</select>`)}
    ${ff('Prioridad', `<select data-flt="prioridad">${opts(PRIORIDADES,'', 'Todas')}</select>`)}
    ${ff('Abogado responsable', `<select data-flt="resp">${opts(abogados.map(p=>({id:p.id,label:p.nombre})),'', 'Todos')}</select>`)}`;
  box.querySelectorAll('[data-flt]').forEach(s=> s.addEventListener('change', ()=>{ cpState.filtros[s.dataset.flt] = s.value; buildCasosList(); }));
}

function exportCasosCsv(){
  const lista = cpCasosFiltrados();
  const head = ['Código','Cliente','Título','Tipo de caso','Área penal','Etapa','Estado','Riesgo','Prioridad','Abogado responsable','Director','Progreso','Próximo vencimiento'];
  const rows = lista.map(c=>{ const v=proximoVencimiento(c); return [c.id,c.cliente,c.titulo,c.tipoCaso,c.area,c.etapa,wfLabel(c.wf),riskLabel(c.riesgo),prioLabel(c.prioridad),pName(c.resp.abogado),pName(c.resp.director),c.progreso+'%', v?`${v.fecha} · ${v.label}`:'']; });
  const csv = '﻿' + [head, ...rows].map(r=>r.map(csvCell).join(';')).join('\n');
  cpDownload(new Blob([csv], {type:'text/csv;charset=utf-8'}), `casos_penales_${isoDate(CP_HOY)}.csv`);
  lista.forEach(c=> logAudit(c, 'Exportación', 'Case', c.id, 'Incluido en la exportación del listado de casos (CSV)'));
  showToast(`${lista.length} casos exportados.`);
}

/* ============================================================
   VISTA 02 · CREAR / EDITAR CASO
   ============================================================ */
let cfMode = null;   // 'crear' | 'editar'
let cfRecord = null; // caso en edición, o null si es creación
function cfGoBack(){
  if(cfMode==='editar' && cfRecord){ abrirCasoEn(cfRecord.id, cpState.tab || 'resumen'); }
  else { goView('casos'); }
}
function nextCaseCode(){
  const y = CP_HOY.getFullYear();
  const max = CASES.filter(c=>c.id.startsWith(`CP-${y}-`)).reduce((m,c)=> Math.max(m, parseInt(c.id.split('-')[2],10)||0), 0);
  return `CP-${y}-${String(max+1).padStart(4,'0')}`;
}
function vencRowHtml(v={label:'',fecha:''}){
  return `<div class="form-grid venc-row" style="grid-template-columns:2fr 1fr auto;margin-bottom:8px;align-items:end;">
    <div class="form-field"><input class="fv-label" placeholder="Ej. Término para radicar recurso" value="${esc(v.label)}"></div>
    <div class="form-field"><input type="date" class="fv-fecha" value="${esc(v.fecha)}"></div>
    <button type="button" class="btn sm subtle fv-del">Quitar</button></div>`;
}
function openCaseForm(c){
  const edit = !!c;
  if(edit ? !can('editarCaso', c) : !can('crearCaso')){ showToast('Tu rol no tiene permiso para esta acción.'); return; }
  const today = isoDate(CP_HOY);
  const v = c || {id:nextCaseCode(), cliente:'', titulo:'', tipoCaso:'Defensa técnica', area:'', etapa:'Indagación preliminar', riesgo:'medio', prioridad:'media', wf:'borrador',
    resp:{socio:'u-socio', director:'u-dir', abogado:'', equipo:[], admin:''},
    fechas:{creacion:today, inicio:today, proximoHito:{label:'',fecha:''}, vencimientos:[], relevantes:''},
    descripcion:'', contexto:'', observaciones:'', infoSensible:'', config:{conf:'Confidencial', autorizados:[], visibleCliente:false, reglas:''}};
  const clientes = [...new Set(CASES.map(x=>x.cliente))];
  const byRol = r => PEOPLE.filter(p=>p.rol===r).map(p=>({id:p.id,label:p.nombre}));
  const body = `
    <div class="notice accent">${I('shield')}<span>Los campos con <b>*</b> son obligatorios. El estado inicial lo controla el sistema (<b>Borrador</b>) y solo cambia mediante el flujo Borrador → En revisión → Aprobado → Cerrado → Archivado.</span></div>
    <div class="form-section"><h4><i>A</i>Información general</h4>
      <div class="form-grid cols-3">
        ${ff('Código del caso', `<input id="fcCodigo" value="${esc(v.id)}" readonly>`, {hint:'Generado automáticamente'})}
        ${ff('Nombre / título', `<input id="fcTitulo" value="${esc(v.titulo)}" placeholder="Ej. Defensa por peculado — Contrato 045">`, {req:1, id:'fcTitulo'})}
        ${ff('Cliente', `<select id="fcCliente">${opts(clientes, v.cliente, 'Seleccionar...')}<option value="__nuevo">+ Nuevo cliente…</option></select><input id="fcClienteNuevo" placeholder="Razón social del nuevo cliente" style="display:none;margin-top:6px;">`, {req:1, id:'fcCliente'})}
        ${ff('Tipo de caso', `<select id="fcTipoCaso">${opts(TIPOS_CASO, v.tipoCaso, 'Seleccionar...')}</select>`, {req:1, id:'fcTipoCaso'})}
        ${ff('Área penal', `<select id="fcArea">${opts(AREAS, v.area, 'Seleccionar...')}</select>`, {req:1, id:'fcArea'})}
        ${ff('Etapa procesal', `<select id="fcEtapa">${opts(ETAPAS, v.etapa, 'Seleccionar...')}</select>`, {req:1, id:'fcEtapa'})}
        ${ff('Nivel de riesgo', `<select id="fcRiesgo">${opts(RIESGOS, v.riesgo)}</select>`, {req:1})}
        ${ff('Estado', `<input value="${esc(wfLabel(v.wf))}" readonly>`, {hint:'Controlado por el flujo del caso'})}
        ${ff('Prioridad', `<select id="fcPrioridad">${opts(PRIORIDADES, v.prioridad)}</select>`, {req:1})}
      </div></div>
    <div class="form-section"><h4><i>B</i>Responsables</h4>
      <div class="form-grid cols-3">
        ${ff('Socio responsable', `<select id="fcSocio">${opts(byRol('socio'), v.resp.socio, 'Seleccionar...')}</select>`, {req:1, id:'fcSocio'})}
        ${ff('Director / coordinador', `<select id="fcDirector">${opts(byRol('director'), v.resp.director, 'Seleccionar...')}</select>`, {req:1, id:'fcDirector'})}
        ${ff('Abogado responsable', `<select id="fcAbogado">${opts(byRol('abogado'), v.resp.abogado, 'Seleccionar...')}</select>`, {req:1, id:'fcAbogado'})}
        ${ff('Apoyo administrativo', `<select id="fcAdmin">${opts(byRol('administrativo'), v.resp.admin, 'Sin asignar')}</select>`)}
        ${ff('Equipo (abogados de apoyo)', `<div class="check-grid">${PEOPLE.filter(p=>p.rol==='abogado').map(p=>`<label class="check"><input type="checkbox" class="fcEquipo" value="${p.id}" ${v.resp.equipo.includes(p.id)?'checked':''}>${esc(p.nombre)}</label>`).join('')}</div>`, {full:0})}
      </div></div>
    <div class="form-section"><h4><i>C</i>Fechas</h4>
      <div class="form-grid cols-3">
        ${ff('Fecha de creación', `<input type="date" value="${esc(v.fechas.creacion)}" readonly>`, {hint:'Registrada por el sistema'})}
        ${ff('Fecha de inicio', `<input type="date" id="fcInicio" value="${esc(v.fechas.inicio)}">`, {req:1, id:'fcInicio'})}
        <div></div>
        ${ff('Próximo hito', `<input id="fcHitoLabel" value="${esc(v.fechas.proximoHito.label)}" placeholder="Ej. Audiencia de imputación">`)}
        ${ff('Fecha del próximo hito', `<input type="date" id="fcHitoFecha" value="${esc(v.fechas.proximoHito.fecha)}">`)}
        <div></div>
      </div>
      <label style="display:block;font-size:11.5px;font-weight:700;color:var(--text-faint);text-transform:uppercase;letter-spacing:.03em;margin:12px 0 6px;">Vencimientos</label>
      <div id="fcVencs">${(v.fechas.vencimientos.length? v.fechas.vencimientos : [{label:'',fecha:''}]).map(vencRowHtml).join('')}</div>
      <button type="button" class="btn sm" id="fcAddVenc">+ Agregar vencimiento</button>
      <div class="form-grid" style="margin-top:12px;">${ff('Fechas relevantes', `<textarea id="fcRelevantes" placeholder="Hechos con fecha, audiencias previas, etc.">${esc(v.fechas.relevantes)}</textarea>`, {full:1})}</div>
    </div>
    <div class="form-section"><h4><i>D</i>Información del caso</h4>
      <div class="form-grid">
        ${ff('Descripción', `<textarea id="fcDescripcion">${esc(v.descripcion)}</textarea>`, {full:1, req:1, id:'fcDescripcion'})}
        ${ff('Contexto', `<textarea id="fcContexto">${esc(v.contexto)}</textarea>`)}
        ${ff('Observaciones', `<textarea id="fcObs">${esc(v.observaciones)}</textarea>`)}
        ${ff(`${I('lock').replace('class="icon"','class="icon" style="display:inline;width:11px;height:11px;vertical-align:-1px;"')} Información sensible`, `<textarea id="fcSensible" placeholder="Solo visible para Socio, Director y Abogados autorizados">${esc(v.infoSensible)}</textarea>`, {full:1})}
      </div></div>
    <div class="form-section"><h4><i>E</i>Configuración de acceso</h4>
      <div class="form-grid">
        ${ff('Nivel de confidencialidad', `<select id="fcConf">${opts(CONFIDENCIALIDAD, v.config.conf)}</select>`)}
        ${ff('Visibilidad para cliente', `<label class="check" style="padding-top:8px;"><input type="checkbox" id="fcVisible" ${v.config.visibleCliente?'checked':''}>El cliente puede consultar reportes y documentos autorizados</label>`)}
        ${ff('Usuarios autorizados', `<div class="check-grid">${INTERNOS.map(p=>`<label class="check"><input type="checkbox" class="fcAut" value="${p.id}" ${v.config.autorizados.includes(p.id)?'checked':''}>${esc(p.nombre)} <small>· ${roleById(p.rol).nombre}</small></label>`).join('')}</div>`, {full:1, hint:'Los responsables asignados quedan autorizados automáticamente.'})}
        ${ff('Reglas de acceso', `<textarea id="fcReglas" placeholder="Ej. Correos internos sujetos a reserva">${esc(v.config.reglas)}</textarea>`, {full:1})}
      </div></div>`;
  cfMode = edit ? 'editar' : 'crear';
  cfRecord = c || null;
  document.getElementById('cfTitle').textContent = edit ? `Editar caso ${v.id}` : 'Crear nuevo caso penal';
  document.getElementById('cfSub').textContent = edit ? 'Los cambios quedan registrados en la auditoría' : 'VISTA 02 · El expediente se crea al guardar';
  document.getElementById('cfFoot').innerHTML = `<button class="btn" id="cfCancelBtn">Cancelar</button><button class="btn primary" id="cfSubmitBtn">${edit?'Guardar cambios':'Crear caso'}</button>`;
  document.getElementById('cfCancelBtn').addEventListener('click', cfGoBack);
  document.getElementById('cfSubmitBtn').addEventListener('click', ()=> submitCaseForm(c));
  const bodyEl = document.getElementById('cfBody');
  bodyEl.innerHTML = body;
  goView('casoform');
  const selCli = bodyEl.querySelector('#fcCliente');
  selCli.addEventListener('change', ()=>{ bodyEl.querySelector('#fcClienteNuevo').style.display = selCli.value==='__nuevo' ? 'block' : 'none'; });
  const vencs = bodyEl.querySelector('#fcVencs');
  const bindDel = ()=> vencs.querySelectorAll('.fv-del').forEach(b=> b.onclick = ()=> b.closest('.venc-row').remove());
  bindDel();
  bodyEl.querySelector('#fcAddVenc').addEventListener('click', ()=>{ vencs.insertAdjacentHTML('beforeend', vencRowHtml()); bindDel(); });
}

async function submitCaseForm(c){
  const edit = !!c, B = document.getElementById('cfBody');
  const val = id => (B.querySelector('#'+id)||{}).value?.trim() || '';
  let cliente = val('fcCliente'); if(cliente==='__nuevo') cliente = val('fcClienteNuevo');
  const data = {
    titulo:val('fcTitulo'), cliente, tipoCaso:val('fcTipoCaso'), area:val('fcArea'), etapa:val('fcEtapa'), riesgo:val('fcRiesgo'), prioridad:val('fcPrioridad'),
    resp:{socio:val('fcSocio'), director:val('fcDirector'), abogado:val('fcAbogado'), admin:val('fcAdmin'), equipo:[...B.querySelectorAll('.fcEquipo:checked')].map(x=>x.value)},
    inicio:val('fcInicio'), hito:{label:val('fcHitoLabel'), fecha:val('fcHitoFecha')},
    vencimientos:[...B.querySelectorAll('.venc-row')].map(r=>({label:r.querySelector('.fv-label').value.trim(), fecha:r.querySelector('.fv-fecha').value})).filter(v=>v.label && v.fecha),
    relevantes:val('fcRelevantes'), descripcion:val('fcDescripcion'), contexto:val('fcContexto'), observaciones:val('fcObs'), infoSensible:val('fcSensible'),
    conf:val('fcConf'), visibleCliente:B.querySelector('#fcVisible').checked, autorizados:[...B.querySelectorAll('.fcAut:checked')].map(x=>x.value), reglas:val('fcReglas'),
  };
  // 1. validar campos obligatorios
  const req = {fcTitulo:data.titulo, fcCliente:data.cliente, fcTipoCaso:data.tipoCaso, fcArea:data.area, fcEtapa:data.etapa, fcSocio:data.resp.socio, fcDirector:data.resp.director, fcAbogado:data.resp.abogado, fcInicio:data.inicio, fcDescripcion:data.descripcion};
  B.querySelectorAll('.form-field.invalid').forEach(x=>x.classList.remove('invalid'));
  const faltan = Object.entries(req).filter(([,v])=>!v).map(([k])=>k);
  if(faltan.length){
    faltan.forEach(k=>{ const f=B.querySelector(`[data-f="${k}"]`); if(f) f.classList.add('invalid'); });
    B.querySelector('.form-field.invalid')?.scrollIntoView({behavior:'smooth', block:'center'});
    showToast(`Completa los ${faltan.length} campos obligatorios marcados.`); return;
  }
  const autorizados = [...new Set([...data.autorizados, data.resp.socio, data.resp.director, data.resp.abogado, data.resp.admin, ...data.resp.equipo].filter(Boolean))];

  if(edit){
    const antes = {Título:c.titulo, Cliente:c.cliente, Etapa:c.etapa, Riesgo:riskLabel(c.riesgo), Prioridad:prioLabel(c.prioridad), 'Abogado responsable':pName(c.resp.abogado), Confidencialidad:c.config.conf, 'Visible para cliente':c.config.visibleCliente?'Sí':'No'};
    Object.assign(c, {titulo:data.titulo, cliente:data.cliente, nombre:data.cliente, tipoCaso:data.tipoCaso, area:data.area, etapa:data.etapa, riesgo:data.riesgo, prioridad:data.prioridad,
      resp:data.resp, descripcion:data.descripcion, contexto:data.contexto, observaciones:data.observaciones, infoSensible:data.infoSensible});
    c.fechas = {...c.fechas, inicio:data.inicio, proximoHito:data.hito, vencimientos:data.vencimientos, relevantes:data.relevantes};
    c.config = {conf:data.conf, autorizados, visibleCliente:data.visibleCliente, reglas:data.reglas};
    const despues = {Título:c.titulo, Cliente:c.cliente, Etapa:c.etapa, Riesgo:riskLabel(c.riesgo), Prioridad:prioLabel(c.prioridad), 'Abogado responsable':pName(c.resp.abogado), Confidencialidad:c.config.conf, 'Visible para cliente':c.config.visibleCliente?'Sí':'No'};
    const cambios = Object.keys(antes).filter(k=>antes[k]!==despues[k]).map(k=>`${k}: ${antes[k]} → ${despues[k]}`);
    logAudit(c, 'Edición del caso', 'Case', c.id, cambios.length ? cambios.join(' · ') : 'Actualización de información del caso', {campos:cambios.length});
    refreshCase(); showToast('Caso actualizado.');
    abrirCasoEn(c.id, cpState.tab || 'resumen');
    return;
  }

  // creación: validaciones + registro + expediente
  document.getElementById('cfFoot').innerHTML = '';
  const id = nextCaseCode();
  await runProcess(B, [
    'Validando campos obligatorios', 'Validando permisos del usuario ('+currentRole().nombre+')', `Creando el registro del caso ${id}`,
    `Creando el vínculo con el cliente ${data.cliente}`, 'Asignando responsables', 'Registrando fecha y usuario creador', 'Creando auditoría',
    'Llevando el caso a su estado inicial: Borrador', 'Preparando el espacio para documentos, evidencias, actuaciones, tareas y análisis'
  ], 190);
  const nuevo = {id, nombre:data.cliente, tipo:`${data.area} · ${data.titulo}`, estado:'Borrador', responsableRole:'director', fecha:isoDate(CP_HOY), ultimaActividad:'Hoy', progreso:0, matriz:[]};
  CASES.unshift(nuevo);
  cpBaseCase(nuevo, {cliente:data.cliente, titulo:data.titulo, tipoCaso:data.tipoCaso, area:data.area, etapa:data.etapa, riesgo:data.riesgo, prioridad:data.prioridad, wf:'borrador',
    resp:data.resp, fechas:{creacion:isoDate(CP_HOY), inicio:data.inicio, proximoHito:data.hito, vencimientos:data.vencimientos, relevantes:data.relevantes},
    descripcion:data.descripcion, contexto:data.contexto, observaciones:data.observaciones, infoSensible:data.infoSensible,
    config:{conf:data.conf, autorizados, visibleCliente:data.visibleCliente, reglas:data.reglas},
    situacion:{actual:'Caso recién creado: pendiente de cargar documentación inicial.', bloqueado:''},
    creadoPor:currentUser().id, creadoTs:nowIso(), ultimoEditor:currentUser().id});
  logAudit(nuevo, 'Creación del caso', 'Case', id, `Caso ${id} registrado en estado Borrador`, {cliente:data.cliente});
  logAudit(nuevo, 'Vinculación con cliente', 'Case', id, `Cliente: ${data.cliente}`);
  logAudit(nuevo, 'Asignación de responsables', 'Case', id, `Abogado: ${pName(data.resp.abogado)} · Director: ${pName(data.resp.director)} · Socio: ${pName(data.resp.socio)}`);
  logAudit(nuevo, 'Configuración de acceso', 'Case', id, `${data.conf} · ${autorizados.length} usuarios autorizados · Cliente: ${data.visibleCliente?'visible':'sin acceso'}`);
  B.insertAdjacentHTML('beforeend', `<div class="notice accent" style="margin-top:14px;">${I('check')}<span>Expediente <b>${id}</b> creado. Siguiente paso: cargar la documentación inicial en la pestaña <b>Documentos</b>.</span></div>`);
  document.getElementById('cfFoot').innerHTML = `<button class="btn primary" id="cfOpenBtn">Abrir caso</button>`;
  document.getElementById('cfOpenBtn').addEventListener('click', ()=>{ currentCaseId=id; renderCaseChip(); abrirCasoEn(id, 'documentos'); });
  updateBell();
}

/* ============================================================
   VISTA 03 · DETALLE DEL CASO
   ============================================================ */
const CP_TABS = [
  {id:'resumen', label:'Resumen'},
  {id:'expediente', label:'Expediente'},
  {id:'documentos', label:'Documentos', count:c=>c.documentos.length},
  {id:'evidencias', label:'Evidencias', count:c=>c.matriz.length},
  {id:'actuaciones', label:'Actuaciones', count:c=>c.actuaciones.length},
  {id:'tareas', label:'Tareas', count:c=>c.tareas.filter(t=>t.estado!=='Completada').length, alert:c=>c.tareas.some(t=>t.estado!=='Completada' && diasHasta(t.fecha)<0)},
  {id:'ia', label:'IA', count:c=>c.ia.filter(a=>a.estado==='pendiente').length, alert:c=>c.ia.some(a=>a.estado==='pendiente')},
  {id:'reportes', label:'Reportes'},
  {id:'auditoria', label:'Auditoría'},
];

function cpOnOpenCase(){
  const c = currentCase();
  const tabs = tabsParaRol();
  cpState.tab = cpState.pendingTab && tabs.includes(cpState.pendingTab) ? cpState.pendingTab : 'resumen';
  cpState.pendingTab = null;
  resetIAState(c);
  cpState.rep = {tipo:'ejecutivo', aud: currentRoleId==='administrativo' ? 'director' : currentRoleId, html:null, id:null};
  registrarAcceso(c);
  renderDetail();
}

function renderDetail(){
  const c = currentCase();
  document.getElementById('cdTitle').textContent = `${c.id} · ${c.nombre}`;
  document.getElementById('cdSub').textContent = c.tipo + ' · Responsable actual: ' + roleById(c.responsableRole).nombre;
  document.getElementById('cpBtnEditar').style.display = can('editarCaso', c) ? '' : 'none';
  document.getElementById('btnAddEvidencia').style.display = can('evidencias', c) ? '' : 'none';
  renderCaseMeta(c);
  renderTabs(c);
  renderActivePanel(c);
}

function refreshCase(){
  const c = currentCase();
  c.ultimaActividad = 'Hoy';
  if(currentRoleId!=='cliente') c.ultimoEditor = currentUser().id;
  buildStepper(); buildFlow(); buildMatriz();
  if(document.getElementById('casoDetailWrap').style.display!=='none') renderDetail();
  renderCaseChip(); updateBell();
}

function renderCaseMeta(c){
  const idx = WF.findIndex(w=>w.id===c.wf);
  const act = WF_ACTION[c.wf];
  let accion = '';
  if(act && act.roles.includes(currentRoleId)){
    accion = `<button class="btn ${c.wf==='aprobado'?'':'primary'}" id="cpBtnTransicion">${act.label} →</button>`;
  } else if(act){
    accion = `<span class="ro-note">Siguiente paso: <b>${act.label}</b> (${act.roles.map(r=>roleById(r).nombre).join(' / ')})</span>`;
  } else {
    accion = `<span class="ro-note">${I('lock').replace('class="icon"','class="icon" style="display:inline;width:11px;height:11px;vertical-align:-1px;"')} Caso archivado · solo lectura con trazabilidad completa</span>`;
  }
  if(c.wf==='cerrado') accion = `<span class="ro-note" style="margin-right:6px;">Caso cerrado · solo lectura</span>` + accion;
  document.getElementById('cpCaseMeta').innerHTML = `
    <div class="case-meta">
      <div class="case-meta-row">
        <div class="cm-item"><label>Cliente</label><span>${esc(c.cliente)}</span></div>
        <div class="cm-item"><label>Estado</label><span>${wfBadge(c.wf)}</span></div>
        <div class="cm-item"><label>Etapa</label><span>${esc(c.etapa)}</span></div>
        <div class="cm-item"><label>Riesgo</label><span>${riskPill(c.riesgo)}</span></div>
        <div class="cm-item"><label>Prioridad</label><span>${prioTag(c.prioridad)}</span></div>
        <div class="cm-item"><label>Abogado responsable</label><span>${esc(pName(c.resp.abogado))}</span></div>
        <div class="cm-item"><label>Director</label><span>${esc(pName(c.resp.director))}</span></div>
        <div class="cm-item"><label>Confidencialidad</label><span>${sensTag(c.config.conf)}</span></div>
        <div class="cm-item"><label>Último editor</label><span class="muted" style="font-weight:500;">${esc(pName(c.ultimoEditor))}</span></div>
      </div>
      <div class="wf-bar">
        <div class="wf-track">${WF.map((w,i)=>`${i?'<span class="wf-sep"></span>':''}<span class="wf-step ${i<idx?'done':i===idx?'current':''}"><span class="wf-dot">${i<idx?I('check').replace('class="icon"','class="icon" style="width:10px;height:10px;stroke:#fff;"'):i+1}</span>${w.label}</span>`).join('')}</div>
        <div class="wf-actions">${accion}</div>
      </div>
    </div>`;
  const b = document.getElementById('cpBtnTransicion');
  if(b) b.addEventListener('click', ()=> solicitarTransicion(c));
}

function renderTabs(c){
  const allowed = tabsParaRol();
  const el = document.getElementById('cpTabs'); el.innerHTML = '';
  CP_TABS.filter(t=>allowed.includes(t.id)).forEach(t=>{
    const b = document.createElement('button');
    b.className = 'tab' + (cpState.tab===t.id ? ' active' : '');
    const n = t.count ? t.count(c) : null;
    b.innerHTML = t.label + (n!==null && n!==undefined && (n>0 || t.id!=='ia') ? `<span class="tc ${t.alert && t.alert(c)?'alert':''}">${n}</span>` : '');
    b.addEventListener('click', ()=>{ cpState.tab = t.id; renderTabs(c); renderActivePanel(c); });
    el.appendChild(b);
  });
}
function renderActivePanel(c){
  document.querySelectorAll('#casoDetailWrap .tab-panel').forEach(p=> p.classList.toggle('active', p.dataset.panel===cpState.tab));
  ({resumen:renderResumen, expediente:renderExpediente, documentos:renderDocumentos, evidencias:renderEvidHead, actuaciones:renderActuaciones,
    tareas:renderTareas, ia:renderIA, reportes:renderReportes, auditoria:renderAuditoria}[cpState.tab] || (()=>{}))(c);
}
function irATab(tab){ const c=currentCase(); cpState.tab=tab; renderTabs(c); renderActivePanel(c); window.scrollTo({top:document.getElementById('cpTabs').offsetTop-20, behavior:'smooth'}); }
function bindAlertClicks(root){
  root.querySelectorAll('.alert-item[data-tab]').forEach(el=> el.addEventListener('click', ()=>{
    if(el.dataset.ref) cpState.ia.sel = el.dataset.ref;
    const enDetalle = currentView==='casos' && document.getElementById('casoDetailWrap').style.display!=='none';
    if(!enDetalle || (el.dataset.case && el.dataset.case!==currentCaseId)){ abrirCasoEn(el.dataset.case||currentCaseId, el.dataset.tab, el.dataset.ref); return; }
    irATab(el.dataset.tab);
  }));
}
function abrirCasoEn(caseId, tab, iaRef){
  goView('casos'); cpState.pendingTab = tab || 'resumen';
  openCaseDetail(caseId);
  if(iaRef){ cpState.ia.sel = iaRef; if(cpState.tab==='ia') renderIA(currentCase()); }
}

/* ---------- transiciones de estado controladas ---------- */
function validacionesTransicion(c){
  const next = WF_NEXT[c.wf]; const checks = [];
  if(c.wf==='borrador'){
    checks.push({ok:!!(c.titulo && c.cliente && c.etapa && c.riesgo && c.descripcion), txt:'Información general obligatoria completa', block:true});
    checks.push({ok:!!(c.resp.abogado && c.resp.director && c.resp.socio), txt:'Responsables asignados (Socio, Director y Abogado)', block:true});
    checks.push({ok:c.documentos.length>0, txt:`Documentación inicial cargada (${c.documentos.length} documento(s))`, block:true});
  }
  if(c.wf==='revision'){
    const iaP = c.ia.filter(a=>a.estado==='pendiente').length;
    checks.push({ok:c.actuaciones.length>0, txt:`Actuaciones registradas en el expediente (${c.actuaciones.length})`, block:false});
    checks.push({ok:iaP===0, txt: iaP ? `${iaP} análisis IA pendientes de revisión humana (no se incorporan hasta revisarse)` : 'Sin análisis IA pendientes de revisión', block:false});
    checks.push({ok:!c.matriz.some(m=>m.estado==='pendiente' && m.relev==='alta'), txt:'Evidencia de relevancia alta recaudada', block:false});
  }
  if(c.wf==='aprobado'){
    const crit = c.tareas.filter(t=>t.estado!=='Completada' && ['critica','alta'].includes(t.prioridad));
    const iaP = c.ia.filter(a=>a.estado==='pendiente');
    const actP = c.actuaciones.filter(a=>['Pendiente','Programada'].includes(a.estado));
    const noVer = c.matriz.filter(m=>m.estado!=='verificada');
    checks.push({ok:!crit.length, txt: crit.length ? `${crit.length} tarea(s) crítica(s) abiertas: ${crit.map(t=>t.titulo).join('; ')}` : 'Sin tareas críticas abiertas', block:true});
    checks.push({ok:!iaP.length, txt: iaP.length ? `${iaP.length} aprobación(es) pendiente(s) de análisis IA` : 'Sin aprobaciones pendientes', block:true});
    checks.push({ok:!actP.length, txt: actP.length ? `${actP.length} actuación(es) pendiente(s) o programada(s)` : 'Todas las actuaciones están realizadas o canceladas', block:true});
    checks.push({ok:!noVer.length, txt: noVer.length ? `${noVer.length} evidencia(s) sin verificar (advertencia)` : 'Toda la evidencia está verificada', block:false});
  }
  if(c.wf==='cerrado'){
    checks.push({ok:true, txt:'El caso está cerrado y sin pendientes críticos', block:true});
    checks.push({ok:true, txt:'Al archivar, el expediente queda en solo lectura con trazabilidad completa', block:false});
  }
  return {next, checks, bloqueado:checks.some(x=>x.block && !x.ok)};
}
function solicitarTransicion(c){
  const act = WF_ACTION[c.wf];
  if(!act || !act.roles.includes(currentRoleId)){ showToast('Tu rol no puede ejecutar esta transición.'); return; }
  const {next, checks, bloqueado} = validacionesTransicion(c);
  const body = `
    <p style="margin:0 0 12px;font-size:13.4px;">Cambio de estado: ${wfBadge(c.wf)} → ${wfBadge(next)}</p>
    <div class="alert-list" style="margin-bottom:14px;">${checks.map(x=>`<div class="alert-item"><span class="a-dot ${x.ok?'verde':x.block?'rojo':'amarillo'}"></span><div class="a-body"><div class="a-type">${x.ok?'Cumple':x.block?'Bloquea la transición':'Advertencia'}</div>${esc(x.txt)}</div></div>`).join('')}</div>
    ${bloqueado ? `<div class="notice danger">${I('alert')}<span>El sistema bloquea ${c.wf==='aprobado'?'el cierre':'la transición'} mientras existan pendientes críticos. Resuélvelos y vuelve a intentarlo.</span></div>` : ''}
    <div class="form-field"><label>Comentario de la decisión</label><textarea id="trComentario" placeholder="Queda registrado en la auditoría"></textarea></div>`;
  openModal({title:act.label, sub:`${c.id} · ${c.cliente}`, body, foot:[{label:'Cancelar'}, {label:act.label, cls:'primary', disabled:bloqueado, onClick:()=>{
    const com = document.getElementById('trComentario').value.trim();
    const de = c.wf; c.wf = next; c.estado = WF_ESTADO_TXT[next];
    if(['cerrado','archivado'].includes(next)){ c.progreso = 100; c.responsableRole = 'socio'; }
    if(next==='aprobado' && c.progreso<50) c.progreso = 50;
    logAudit(c, 'Cambio de estado', 'Case', c.id, `${wfLabel(de)} → ${wfLabel(next)}`, {comentario:com||'—'});
    closeModal(); refreshCase(); showToast(`Caso ${c.id}: ${wfLabel(next)}.`);
  }}]});
}

/* ---------- PESTAÑA · RESUMEN ---------- */
function renderResumen(c){
  const al = alertasCaso(c);
  const abiertas = c.tareas.filter(t=>t.estado!=='Completada');
  const bloq = c.tareas.filter(t=>t.estado==='Bloqueada');
  const pendEv = c.matriz.filter(m=>m.estado==='pendiente');
  const solP = c.solicitudes.filter(s=>s.estado==='pendiente');
  const h = c.fechas.proximoHito;
  const pendTxt = [abiertas.length ? `${abiertas.length} tarea(s) abiertas` : null, pendEv.length ? `${pendEv.length} evidencia(s) pendientes de recaudo` : null, solP.length ? `${solP.length} documento(s) solicitados al cliente` : null, c.ia.filter(a=>a.estado==='pendiente').length ? `${c.ia.filter(a=>a.estado==='pendiente').length} análisis IA por revisar` : null].filter(Boolean).join(' · ') || 'Sin pendientes.';
  const bloqTxt = [c.situacion.bloqueado, ...bloq.map(t=>`${t.titulo}${t.comentarios.length?' — '+t.comentarios[t.comentarios.length-1].texto:''}`)].filter(Boolean);
  document.getElementById('cpResumen').innerHTML = `
    <div class="grid-21">
      <div class="stack">
        <div class="panel"><div class="panel-head"><h3>Información principal</h3><span class="muted small">Creado ${fmtFecha(c.fechas.creacion)} por ${esc(pName(c.creadoPor))}</span></div>
          <div class="info-grid">
            <div><label>Cliente</label><span>${esc(c.cliente)}</span></div>
            <div><label>Responsable</label><span>${esc(pName(c.resp.abogado))}</span></div>
            <div><label>Director</label><span>${esc(pName(c.resp.director))}</span></div>
            <div><label>Socio</label><span>${esc(pName(c.resp.socio))}</span></div>
            <div><label>Estado</label><span>${wfBadge(c.wf)}</span></div>
            <div><label>Prioridad</label><span>${prioTag(c.prioridad)}</span></div>
            <div><label>Etapa procesal</label><span>${esc(c.etapa)}</span></div>
            <div><label>Nivel de riesgo</label><span>${riskPill(c.riesgo)}</span></div>
          </div>
          <p style="font-size:13.2px;line-height:1.6;margin:16px 0 0;">${esc(c.descripcion)}</p>
          ${c.infoSensible ? (can('verSensible') ? `<div class="notice warn" style="margin:12px 0 0;">${I('lock')}<span><b>Información sensible:</b> ${esc(c.infoSensible)}</span></div>` : `<p class="lock" style="margin-top:10px;">${I('lock')} Información sensible restringida para tu rol</p>`) : ''}
        </div>
        <div class="panel"><div class="panel-head"><h3>Situación actual</h3></div>
          <ul class="sit-list">
            <li><b>Qué está pasando</b><span>${esc(c.situacion.actual||'—')}</span></li>
            <li><b>Qué está pendiente</b><span>${esc(pendTxt)}</span></li>
            <li><b>Qué está bloqueado</b><span>${bloqTxt.length ? bloqTxt.map(esc).join('<br>') : 'Nada bloqueado.'}</span></li>
            <li><b>Próximo hito</b><span>${h && h.label ? `${esc(h.label)} · <b>${fmtFecha(h.fecha)}</b> ${diasHasta(h.fecha)>=0?`(en ${diasHasta(h.fecha)} días)`:''}` : '—'}</span></li>
          </ul>
        </div>
      </div>
      <div class="stack">
        <div class="panel"><div class="panel-head"><h3>Indicadores</h3></div>
          <div class="ind-grid">
            ${[['documentos','Documentos',c.documentos.length],['evidencias','Evidencias',c.matriz.length],['tareas','Tareas abiertas',abiertas.length],['resumen','Alertas',al.filter(a=>a.nivel!=='verde').length],['actuaciones','Actuaciones',c.actuaciones.length],['ia','Análisis IA',c.ia.length]]
              .filter(([t])=> tabsParaRol().includes(t)).map(([t,l,n])=>`<button class="ind" data-go="${t}"><b>${n}</b><span>${l}</span></button>`).join('')}
          </div>
        </div>
        <div class="panel"><div class="panel-head"><h3>Alertas</h3><span class="muted small">${al.length}</span></div>
          <div class="alert-list">${al.slice(0,8).map(a=>alertItemHtml(a)).join('') || '<div class="empty">Sin alertas activas.</div>'}</div>
          ${al.length>8?`<button class="link-btn" style="margin-top:10px;" id="cpVerAlertas">Ver todas las alertas (${al.length})</button>`:''}
        </div>
      </div>
    </div>`;
  const R = document.getElementById('cpResumen');
  R.querySelectorAll('[data-go]').forEach(b=> b.addEventListener('click', ()=>{ if(b.dataset.go!=='resumen') irATab(b.dataset.go); }));
  bindAlertClicks(R);
  R.querySelector('#cpVerAlertas')?.addEventListener('click', ()=> goView('alertas'));
}

/* ---------- PESTAÑA · EXPEDIENTE ---------- */
function renderExpediente(c){
  const ei = ETAPAS.indexOf(c.etapa);
  const al = alertasCaso(c).filter(a=>a.nivel!=='verde');
  const versiones = c.documentos.reduce((s,d)=>s+d.versiones.length,0);
  const node = (tab, label, sub) => `<li><div class="t-node" data-go="${tab}"><span>${label}</span><small>${sub}</small></div></li>`;
  const hechos = Object.keys(HECHOS).map(h=>{ const evs=c.matriz.filter(m=>m.hecho===h); return {h, evs}; });
  document.getElementById('cpExpediente').innerHTML = `
    <div class="grid-21">
      <div class="stack">
        <div class="panel"><div class="panel-head"><div><h3>Estructura del expediente</h3><p class="ph-sub">Todo lo relacionado con el caso en una sola estructura. Haz clic en un nodo para ir a su pestaña.</p></div></div>
          <div class="tree">
            <div class="t-root">${I('folder')} CASO ${c.id} · ${esc(c.cliente)}</div>
            <ul>
              ${node('expediente','Información procesal', `${esc(c.tipoCaso)} · ${esc(c.area)}`)}
              ${node('expediente','Etapas', `${ei+1} de ${ETAPAS.length} · ${esc(c.etapa)}`)}
              ${node('actuaciones','Actuaciones', `${c.actuaciones.filter(a=>a.estado==='Realizada').length} realizadas / ${c.actuaciones.length}`)}
              ${node('documentos','Documentos', `${c.documentos.length} documentos · ${versiones} versiones`)}
              ${node('evidencias','Evidencias', `${c.matriz.filter(m=>m.estado==='verificada').length} verificadas / ${c.matriz.length}`)}
              ${node('tareas','Tareas', `${c.tareas.filter(t=>t.estado!=='Completada').length} abiertas / ${c.tareas.length}`)}
              ${node('resumen','Alertas', `${al.length} activas`)}
              ${node('ia','Análisis', `${c.ia.length} análisis IA · ${c.ia.filter(a=>a.estado==='pendiente').length} por revisar`)}
            </ul>
          </div>
        </div>
        <div class="panel"><div class="panel-head"><div><h3>Hechos investigados y soporte probatorio</h3><p class="ph-sub">Relación entre hechos, evidencias y su estado de revisión.</p></div></div>
          <div class="grid-2">${hechos.map(x=>`<div class="hecho-card"><h5>${x.h} · ${HECHOS[x.h]}</h5>${x.evs.length ? `<ul>${x.evs.map(e=>`<li>${esc(e.ev)} — <span class="pill-state ${e.estado}" style="font-size:9.8px;">${stateLabel(e.estado)}</span></li>`).join('')}</ul>` : '<p class="muted small" style="margin:0;">Sin evidencia registrada.</p>'}</div>`).join('')}</div>
        </div>
      </div>
      <div class="stack">
        <div class="panel"><div class="panel-head"><h3>Información procesal</h3></div>
          <dl class="kv">
            <dt>Tipo de caso</dt><dd>${esc(c.tipoCaso)}</dd>
            <dt>Área penal</dt><dd>${esc(c.area)}</dd>
            <dt>Etapa</dt><dd>${esc(c.etapa)}</dd>
            <dt>Fecha de inicio</dt><dd>${fmtFecha(c.fechas.inicio)}</dd>
            <dt>Creado por</dt><dd>${esc(pName(c.creadoPor))} · ${fmtFecha(c.fechas.creacion)}</dd>
            <dt>Contexto</dt><dd>${esc(c.contexto||'—')}</dd>
            <dt>Observaciones</dt><dd>${esc(c.observaciones||'—')}</dd>
            <dt>Autorizados</dt><dd>${c.config.autorizados.map(id=>esc(pName(id))).join(', ')}</dd>
            <dt>Cliente</dt><dd>${c.config.visibleCliente?'Ve reportes y documentos autorizados':'Sin acceso al portal'}</dd>
            <dt>Reglas de acceso</dt><dd>${esc(c.config.reglas||'—')}</dd>
          </dl>
        </div>
        <div class="panel"><div class="panel-head"><h3>Etapas procesales</h3></div>
          <div class="etapas">${ETAPAS.map((e,i)=>`<div class="etapa ${i<ei?'done':i===ei?'current':''}"><span class="e-dot"></span><div><b>${e}</b>${i===ei?'<span>Etapa actual</span>':''}</div></div>`).join('')}</div>
        </div>
        <div class="panel"><div class="panel-head"><h3>Fechas y vencimientos</h3></div>
          <div class="alert-list">
            ${c.fechas.proximoHito && c.fechas.proximoHito.label ? `<div class="alert-item"><span class="a-dot naranja"></span><div class="a-body"><div class="a-type">Próximo hito</div>${esc(c.fechas.proximoHito.label)}</div><span class="a-date">${fmtFecha(c.fechas.proximoHito.fecha)}</span></div>` : ''}
            ${(c.fechas.vencimientos||[]).map(v=>{ const d=diasHasta(v.fecha); return `<div class="alert-item"><span class="a-dot ${d<0||d<=3?'rojo':d<=10?'naranja':'verde'}"></span><div class="a-body"><div class="a-type">Vencimiento</div>${esc(v.label)}</div><span class="a-date">${fmtFecha(v.fecha)}</span></div>`; }).join('') || '<p class="muted small" style="margin:0;">Sin vencimientos registrados.</p>'}
          </div>
          ${c.fechas.relevantes ? `<p class="small muted" style="margin:12px 0 0;"><b>Fechas relevantes:</b> ${esc(c.fechas.relevantes)}</p>` : ''}
        </div>
      </div>
    </div>`;
  document.querySelectorAll('#cpExpediente [data-go]').forEach(n=> n.addEventListener('click', ()=> irATab(n.dataset.go)));
}

/* ---------- PESTAÑA · DOCUMENTOS ---------- */
function renderDocumentos(c){
  const docs = docsVisibles(c).filter(d=> !cpState.docFiltro || d.categoria===cpState.docFiltro);
  const P = document.getElementById('cpDocumentos');
  P.innerHTML = `
    <div class="section-sub"><div><h3>Documentos del expediente</h3><p class="muted small" style="margin:2px 0 0;">Versionados, con metadatos, checksum, sensibilidad y control de acceso.</p></div>
      ${can('docs', c) ? `<button class="btn primary" id="cpBtnSubirDoc">+ Subir documento</button>` : ''}</div>
    <div class="filter-row"><select id="cpDocCat">${opts(DOC_CATEGORIAS, cpState.docFiltro, 'Todas las categorías')}</select><span class="muted small">${docs.length} documento(s)</span></div>
    <div class="matriz-wrap table-scroll"><table class="matriz" style="min-width:1050px;">
      <thead><tr><th>Documento</th><th>Categoría</th><th>Tipo</th><th>Versión</th><th>Fecha</th><th>Sensibilidad</th><th>OCR / IA</th><th>Cargado por</th><th>Cliente</th><th>Acciones</th></tr></thead>
      <tbody>${docs.map(d=>`<tr class="clickable" data-doc="${d.id}">
        <td style="max-width:260px;"><b>${esc(d.nombre)}</b><span class="sub">${esc(d.descripcion||'')}</span></td>
        <td>${esc(d.categoria)}</td><td>${esc(d.tipo)}</td><td><span class="tag accent">v${d.version}</span></td>
        <td>${fmtFecha(d.fecha)}</td><td>${sensTag(d.sensibilidad)}</td>
        <td><span class="tag ${d.estadoIA==='Analizado'?'ok':d.estadoIA==='En cola OCR/IA'?'accent':''}">${esc(d.estadoIA)}</span></td>
        <td>${esc(pName(d.cargadoPor))}<span class="sub">${fmtFechaHora(d.versiones[d.versiones.length-1].ts)}</span></td>
        <td>${d.compartidoCliente?'<span class="tag ok">Compartido</span>':'<span class="muted small">Interno</span>'}</td>
        <td>${d._locked ? `<span class="lock">${I('lock')} Acceso restringido</span>` : `<div class="row-actions">
          <button class="link-btn" data-act="ver" data-id="${d.id}">Ver</button>
          <button class="link-btn" data-act="desc" data-id="${d.id}">Descargar</button>
          ${can('docs',c)?`<button class="link-btn" data-act="ver2" data-id="${d.id}">Nueva versión</button>`:''}
          ${can('docs',c) && d.estadoIA!=='En cola OCR/IA'?`<button class="link-btn" data-act="ocr" data-id="${d.id}">Enviar a OCR/IA</button>`:''}
        </div>`}</td></tr>`).join('') || `<tr><td colspan="10"><div class="empty">Aún no hay documentos. ${can('docs',c)?'Usa “Subir documento” para cargar la documentación inicial.':''}</div></td></tr>`}</tbody></table></div>`;
  P.querySelector('#cpBtnSubirDoc')?.addEventListener('click', ()=> openDocUpload(c));
  P.querySelector('#cpDocCat').addEventListener('change', e=>{ cpState.docFiltro = e.target.value; renderDocumentos(c); });
  P.querySelectorAll('tr[data-doc]').forEach(tr=> tr.addEventListener('click', e=>{
    const b = e.target.closest('[data-act]');
    const d = c.documentos.find(x=>x.id===tr.dataset.doc);
    const locked = d.sensibilidad==='Reservada' && !can('verSensible');
    if(locked){ showToast('Documento reservado: tu rol no tiene acceso.'); return; }
    if(!b || b.dataset.act==='ver') return openDocDetail(c, d);
    if(b.dataset.act==='desc') return descargarDoc(c, d);
    if(b.dataset.act==='ver2') return openDocUpload(c, d);
    if(b.dataset.act==='ocr') return enviarOCR(c, d);
  }));
}
function descargarDoc(c, d){
  logAudit(c, 'Descarga de documento', 'Document', d.id, `${d.nombre} · v${d.version}`, {checksum:d.checksum.slice(0,16)+'…'});
  showToast('Descarga registrada en la auditoría (el archivo reside en el repositorio documental).');
  if(currentRoleId!=='cliente' && cpState.tab==='auditoria') renderAuditoria(c);
}
function enviarOCR(c, d){
  d.estadoIA = 'En cola OCR/IA';
  logAudit(c, 'Envío a OCR / IA', 'Document', d.id, `${d.nombre} · v${d.version}`);
  refreshCase(); showToast('Documento enviado a OCR / IA.');
  programarOCR(c, d);
}
function programarOCR(c, d){
  setTimeout(()=>{
    if(d.estadoIA!=='En cola OCR/IA') return;
    d.estadoIA = 'Analizado';
    logAudit(c, 'Procesamiento OCR / IA completado', 'Document', d.id, `${d.nombre} · texto extraído y disponible para análisis`, {}, {nombre:'Sistema OCR / IA', rol:'Sistema'});
    if(currentCaseId===c.id && document.getElementById('casoDetailWrap').style.display!=='none' && ['documentos','auditoria'].includes(cpState.tab)) renderActivePanel(c);
  }, 4000);
}
function openDocDetail(c, d){
  const evs = c.matriz.filter(m=>m.docId===d.id);
  const tareas = c.tareas.filter(t=>t.docId===d.id);
  const acts = c.actuaciones.filter(a=>a.docIds.includes(d.id));
  const traza = c.auditoria.filter(a=>a.entidadId===d.id).slice().reverse();
  const html = `
    <h4>Metadatos</h4>
    <dl class="kv">
      <dt>ID</dt><dd>${d.id}</dd><dt>Tipo</dt><dd>${esc(d.tipo)}</dd><dt>Categoría</dt><dd>${esc(d.categoria)}</dd>
      <dt>Fecha</dt><dd>${fmtFecha(d.fecha)}</dd><dt>Versión</dt><dd>v${d.version}</dd><dt>Sensibilidad</dt><dd>${sensTag(d.sensibilidad)}</dd>
      <dt>Tamaño</dt><dd>${fmtSize(d.size)}</dd><dt>Storage URL</dt><dd style="word-break:break-all;font-size:12px;">${esc(d.storage_url)}</dd>
      <dt>Checksum SHA-256</dt><dd style="word-break:break-all;font-family:monospace;font-size:11.5px;">${d.checksum}</dd>
      <dt>OCR / IA</dt><dd>${esc(d.estadoIA)}</dd><dt>Descripción</dt><dd>${esc(d.descripcion||'—')}</dd>
    </dl>
    ${can('autorizarCliente') && c.config.visibleCliente ? `<div class="setting-row" style="margin-top:10px;"><div class="sr-label"><b>Compartir con el cliente</b><span>El cliente podrá consultarlo en su portal.</span></div><button class="switch ${d.compartidoCliente?'on':''}" id="cpDocShare"><span class="knob"></span></button></div>` : ''}
    <h4>Versiones</h4>
    <ul>${d.versiones.slice().reverse().map(v=>`<li><b>v${v.v}</b> · ${fmtFechaHora(v.ts)} · ${esc(pName(v.por))} · <span style="font-family:monospace;font-size:11px;">${v.checksum.slice(0,12)}…</span></li>`).join('')}</ul>
    <h4>Relaciones</h4>
    <ul>${evs.map(e=>`<li>Evidencia: ${esc(e.ev)}</li>`).join('')}${acts.map(a=>`<li>Actuación: ${esc(a.titulo)}</li>`).join('')}${tareas.map(t=>`<li>Tarea: ${esc(t.titulo)}</li>`).join('') || (evs.length||acts.length?'':'<li class="muted">Sin relaciones registradas</li>')}</ul>
    <h4>Trazabilidad</h4>
    <ul>${traza.map(a=>`<li>${fmtFechaHora(a.ts)} · <b>${esc(a.accion)}</b> · ${esc(a.usuario)}</li>`).join('')}</ul>
    <div class="fi-actions"><button class="btn sm" id="cpDocDesc">Descargar</button>${can('docs',c)?'<button class="btn sm" id="cpDocV2">Subir nueva versión</button>':''}</div>`;
  const b = openCpDrawer('Documento · '+c.id, d.nombre, html);
  b.querySelector('#cpDocDesc').addEventListener('click', ()=> descargarDoc(c, d));
  b.querySelector('#cpDocV2')?.addEventListener('click', ()=>{ closeCpDrawer(); openDocUpload(c, d); });
  b.querySelector('#cpDocShare')?.addEventListener('click', ()=>{
    d.compartidoCliente = !d.compartidoCliente;
    logAudit(c, d.compartidoCliente?'Documento compartido con cliente':'Documento retirado del portal cliente', 'Document', d.id, d.nombre);
    refreshCase(); openDocDetail(c, d);
  });
}
async function sha256(file){
  try{
    if(!window.crypto || !crypto.subtle) throw 0;
    const buf = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
    return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join('');
  }catch(e){ return fakeHash(file.name+file.size+Date.now()); }
}
function openDocUpload(c, base){
  if(!can('docs', c)){ showToast('Tu rol no puede cargar documentos en este caso.'); return; }
  const body = `
    ${base ? `<div class="notice accent">${I('file')}<span>Se generará la <b>versión v${base.version+1}</b> de <b>${esc(base.nombre)}</b>. Las versiones anteriores se conservan.</span></div>` : ''}
    <div class="form-grid">
      ${ff('Archivo', `<input type="file" id="fdFile">`, {full:1, req:1, id:'fdFile'})}
      ${ff('Nombre', `<input id="fdNombre" value="${esc(base?base.nombre:'')}" ${base?'readonly':''} placeholder="Se toma del archivo si lo dejas vacío">`, {req:1, id:'fdNombre'})}
      ${ff('Tipo', `<select id="fdTipo">${opts(DOC_TIPOS, base?base.tipo:'PDF')}</select>`)}
      ${ff('Fecha del documento', `<input type="date" id="fdFecha" value="${base?base.fecha:isoDate(CP_HOY)}">`, {req:1, id:'fdFecha'})}
      ${ff('Categoría', `<select id="fdCat">${opts(DOC_CATEGORIAS, base?base.categoria:'', 'Seleccionar...')}</select>`, {req:1, id:'fdCat'})}
      ${ff('Sensibilidad', `<select id="fdSens">${opts(SENSIBILIDAD, base?base.sensibilidad:'Confidencial')}</select>`, {req:1})}
      ${ff('Descripción', `<textarea id="fdDesc">${esc(base?base.descripcion:'')}</textarea>`, {full:1})}
      <div class="full" id="fdVersionNote"></div>
      <label class="check full"><input type="checkbox" id="fdOCR" checked>Enviar a OCR / IA al guardar (queda disponible para análisis)</label>
      ${can('autorizarCliente') && c.config.visibleCliente ? `<label class="check full"><input type="checkbox" id="fdShare" ${base&&base.compartidoCliente?'checked':''}>Compartir con el cliente (portal restringido)</label>` : ''}
    </div>`;
  const B = openModal({title: base ? 'Nueva versión de documento' : 'Subir documento', sub:`${c.id} · ${c.cliente}`, body,
    foot:[{label:'Cancelar'}, {label: base ? 'Guardar versión' : 'Subir documento', cls:'primary', onClick:()=> submitDoc(c, base)}]});
  const f = B.querySelector('#fdFile'), n = B.querySelector('#fdNombre');
  const note = ()=>{ const ex = !base && c.documentos.find(d=>d.nombre.toLowerCase()===n.value.trim().toLowerCase()); B.querySelector('#fdVersionNote').innerHTML = ex ? `<div class="notice accent" style="margin:0;">Ya existe <b>${esc(ex.nombre)}</b> en el expediente: se registrará como versión v${ex.version+1}.</div>` : ''; };
  f.addEventListener('change', ()=>{ const file=f.files[0]; if(!file) return; if(!base && !n.value.trim()) n.value = file.name; B.querySelector('#fdTipo').value = tipoDesdeNombre(file.name); note(); });
  n.addEventListener('input', note);
}
async function submitDoc(c, base){
  const B = document.getElementById('cpModalBody');
  const file = B.querySelector('#fdFile').files[0];
  const g = id => B.querySelector('#'+id);
  const nombre = g('fdNombre').value.trim(), fecha = g('fdFecha').value, cat = g('fdCat').value, sens = g('fdSens').value;
  B.querySelectorAll('.invalid').forEach(x=>x.classList.remove('invalid'));
  const miss = []; if(!file) miss.push('fdFile'); if(!nombre) miss.push('fdNombre'); if(!fecha) miss.push('fdFecha'); if(!cat) miss.push('fdCat');
  if(miss.length){ miss.forEach(k=> B.querySelector(`[data-f="${k}"]`)?.classList.add('invalid')); showToast('Completa los campos obligatorios.'); return; }
  const ocr = g('fdOCR').checked, share = g('fdShare') ? g('fdShare').checked : (base ? base.compartidoCliente : false);
  const tipo = g('fdTipo').value, desc = g('fdDesc').value.trim();
  const existente = base || c.documentos.find(d=>d.nombre.toLowerCase()===nombre.toLowerCase());
  const ver = existente ? existente.version+1 : 1;
  setModalFoot([]);
  const checksum = await sha256(file);
  await runProcess(B, ['Guardando el archivo en el repositorio documental', `Vinculando el documento al caso ${c.id}`, `Generando versión v${ver}`,
    'Registrando metadatos (tipo, categoría, fecha, checksum SHA-256)', `Aplicando permisos por sensibilidad: ${sens}`, 'Registrando auditoría',
    ocr ? 'Enviando a OCR / IA' : 'OCR / IA omitido por el usuario', 'Documento disponible para análisis'], 200);
  const v = {v:ver, ts:nowIso(), por:currentUser().id, checksum, size:file.size};
  let d;
  if(existente){
    d = existente; d.versiones.push(v);
    Object.assign(d, {version:ver, checksum, size:file.size, cargadoPor:v.por, fecha, categoria:cat, sensibilidad:sens, tipo, descripcion:desc||d.descripcion, compartidoCliente:share,
      storage_url:`repositorio://expedientes/${c.id}/${d.id}/v${ver}/${d.nombre}`, estadoIA: ocr ? 'En cola OCR/IA' : 'Sin procesar'});
    logAudit(c, 'Nueva versión de documento', 'Document', d.id, `${d.nombre} · v${ver}`, {checksum:checksum.slice(0,16)+'…', sensibilidad:sens});
  } else {
    const id = `DOC-${c.id.slice(-4)}-${String(c.documentos.length+1).padStart(2,'0')}${Math.random().toString(36).slice(2,4).toUpperCase()}`;
    d = {id, nombre, tipo, categoria:cat, fecha, version:1, versiones:[v], sensibilidad:sens, descripcion:desc, storage_url:`repositorio://expedientes/${c.id}/${id}/v1/${nombre}`,
      checksum, size:file.size, cargadoPor:v.por, estadoIA: ocr ? 'En cola OCR/IA' : 'Sin procesar', compartidoCliente:share};
    c.documentos.push(d);
    logAudit(c, 'Carga de documento', 'Document', d.id, `${d.nombre} · v1`, {checksum:checksum.slice(0,16)+'…', sensibilidad:sens});
  }
  if(share) logAudit(c, 'Documento compartido con cliente', 'Document', d.id, d.nombre);
  if(ocr){ logAudit(c, 'Envío a OCR / IA', 'Document', d.id, `${d.nombre} · v${d.version}`); programarOCR(c, d); }
  setModalFoot([{label:'Listo', cls:'primary', onClick:()=>{ closeModal(); }}], `Checksum: ${checksum.slice(0,20)}…`);
  refreshCase();
}

/* ---------- PESTAÑA · EVIDENCIAS (encabezado sobre la matriz existente) ---------- */
function renderEvidHead(c){
  const st = matrizStats(c);
  const sinDoc = c.matriz.filter(m=>!m.docId).length;
  document.getElementById('cpEvidHead').innerHTML = `
    <div class="kpi-grid">
      <div class="kpi"><b>${st.total}</b><span>Evidencias registradas</span></div>
      <div class="kpi ok"><b>${st.ver}</b><span>Verificadas</span></div>
      <div class="kpi accent"><b>${st.rev}</b><span>En revisión</span></div>
      <div class="kpi warn"><b>${st.pend}</b><span>Pendientes de recaudo</span></div>
      <div class="kpi ${sinDoc?'danger':''}"><b>${sinDoc}</b><span>Sin documento asociado</span></div>
    </div>
    <div class="notice">${I('shield')}<span>Cada evidencia se relaciona con hechos, documentos, actuaciones y el caso, con trazabilidad de sus cambios. La <b>custodia forense avanzada</b> está fuera del alcance de este MVP.</span>
      ${can('evidencias',c)?'<button class="btn sm primary" id="cpEvidAdd" style="margin-left:auto;flex-shrink:0;">+ Agregar evidencia</button>':''}</div>`;
  document.getElementById('cpEvidAdd')?.addEventListener('click', ()=> document.getElementById('btnAddEvidencia').click());
}
function prepararModalEvidencia(){
  const c = currentCase();
  document.getElementById('fDocumento').innerHTML = `<option value="">Sin documento asociado</option>` + docsVisibles(c).filter(d=>!d._locked).map(d=>`<option value="${d.id}">${esc(d.nombre)} (v${d.version})</option>`).join('');
  document.getElementById('fFecha').value = isoDate(CP_HOY);
  const rolResp = currentRoleId==='cliente' ? 'abogado' : currentRoleId;
  document.getElementById('fResponsable').value = rolResp;
}
function cpOnEvidenceSaved(row){
  const c = currentCase();
  logAudit(c, 'Registro de evidencia', 'Evidence', row.id, row.ev, {estado:stateLabel(row.estado), hecho:row.hecho, documento:docName(c,row.docId)||'—', sensibilidad:row.sens});
  refreshCase();
}
function openEvidenceDetail(row){
  const c = currentCase();
  const acts = c.actuaciones.filter(a=>a.evIds.includes(row.id));
  const traza = c.auditoria.filter(a=>a.entidadId===row.id).slice().reverse();
  const d = c.documentos.find(x=>x.id===row.docId);
  const puedeClasificar = can('evidencias', c), puedeVerificar = can('verificarEvid', c);
  const html = `
    <h4>Identificación</h4>
    <dl class="kv">
      <dt>ID</dt><dd>${row.id}</dd><dt>Tipo</dt><dd>${esc(row.tipo)}</dd><dt>Fuente</dt><dd>${esc(row.fuente)}</dd>
      <dt>Fecha</dt><dd>${fmtFecha(row.fecha)}</dd><dt>Hecho</dt><dd>${row.hecho} · ${HECHOS[row.hecho]}</dd>
      <dt>Pretende demostrar</dt><dd>${esc(row.pretende)}</dd>
      <dt>Documento asociado</dt><dd>${d ? `<button class="link-btn" id="cpEvDoc">${esc(d.nombre)} (v${d.version})</button>` : '<span class="muted">Sin documento</span>'}</dd>
      <dt>Estado de revisión</dt><dd><span class="pill-state ${row.estado}">${stateLabel(row.estado)}</span></dd>
      <dt>Relevancia</dt><dd><span class="pill-relev ${row.relev}">${relevLabel(row.relev)}</span></dd>
      <dt>Sensibilidad</dt><dd>${sensTag(row.sens||'Confidencial')}</dd>
      <dt>Responsable</dt><dd>${roleById(row.resp).nombre}</dd>
      <dt>Observaciones</dt><dd>${esc(row.obs)}</dd>
    </dl>
    ${puedeClasificar || puedeVerificar ? `<h4>Actualizar</h4>
      <div class="form-grid">
        ${puedeVerificar ? ff('Estado de revisión', `<select id="evEstado">${opts([{id:'verificada',label:'Verificada'},{id:'revision',label:'En revisión'},{id:'pendiente',label:'Pendiente de recaudo'}], row.estado)}</select>`) : ''}
        ${puedeClasificar ? ff('Documento asociado', `<select id="evDocSel"><option value="">Sin documento</option>${docsVisibles(c).filter(x=>!x._locked).map(x=>`<option value="${x.id}" ${x.id===row.docId?'selected':''}>${esc(x.nombre)}</option>`).join('')}</select>`) : ''}
        ${puedeClasificar ? ff('Sensibilidad', `<select id="evSens">${opts(SENSIBILIDAD, row.sens||'Confidencial')}</select>`) : ''}
      </div>
      <button class="btn sm primary" id="evGuardar" style="margin-top:10px;">Guardar cambios</button>` : ''}
    <h4>Actuaciones relacionadas</h4>
    <ul>${acts.map(a=>`<li>${esc(a.titulo)} · ${a.estado}</li>`).join('') || '<li class="muted">Ninguna</li>'}</ul>
    <h4>Trazabilidad</h4>
    <ul>${traza.map(a=>`<li>${fmtFechaHora(a.ts)} · <b>${esc(a.accion)}</b> · ${esc(a.usuario)}${a.detalle?` — ${esc(a.detalle)}`:''}</li>`).join('') || '<li class="muted">Registrada antes de la migración al módulo (sin eventos posteriores).</li>'}</ul>`;
  const b = openCpDrawer('Evidencia · ' + c.id, row.ev, html);
  b.querySelector('#cpEvDoc')?.addEventListener('click', ()=> openDocDetail(c, d));
  b.querySelector('#evGuardar')?.addEventListener('click', ()=>{
    const cambios = [];
    const e = b.querySelector('#evEstado'); if(e && e.value!==row.estado){ cambios.push(`Estado: ${stateLabel(row.estado)} → ${stateLabel(e.value)}`); row.estado = e.value; }
    const ds = b.querySelector('#evDocSel'); if(ds && ds.value!==row.docId){ cambios.push(`Documento: ${docName(c,row.docId)||'—'} → ${docName(c,ds.value)||'—'}`); row.docId = ds.value; }
    const s = b.querySelector('#evSens'); if(s && s.value!==row.sens){ cambios.push(`Sensibilidad: ${row.sens} → ${s.value}`); row.sens = s.value; }
    if(!cambios.length){ showToast('Sin cambios.'); return; }
    logAudit(c, 'Actualización de evidencia', 'Evidence', row.id, cambios.join(' · '));
    refreshCase(); openEvidenceDetail(row); showToast('Evidencia actualizada.');
  });
}

/* ---------- PESTAÑA · ACTUACIONES ---------- */
function renderActuaciones(c){
  const list = c.actuaciones.filter(a=> !cpState.actFiltro || a.estado===cpState.actFiltro).slice().sort((a,b)=> b.fecha.localeCompare(a.fecha));
  const P = document.getElementById('cpActuaciones');
  P.innerHTML = `
    <div class="section-sub"><div><h3>Actuaciones del caso</h3><p class="muted small" style="margin:2px 0 0;">Qué se hizo → quién lo hizo → cuándo → con qué soporte → qué resultado produjo.</p></div>
      ${can('actuaciones',c)?'<button class="btn primary" id="cpBtnAct">+ Registrar actuación</button>':''}</div>
    <div class="notice">${I('scale')}<span>Registro interno de gestión. El módulo <b>no automatiza actuaciones judiciales oficiales</b>: toda radicación o audiencia la ejecuta el equipo jurídico.</span></div>
    <div class="filter-row"><select id="cpActEst">${opts(ACT_ESTADOS, cpState.actFiltro, 'Todos los estados')}</select><span class="muted small">${list.length} actuación(es)</span></div>
    <div class="matriz-wrap table-scroll"><table class="matriz" style="min-width:1000px;">
      <thead><tr><th>Actuación</th><th>Tipo</th><th>Fecha</th><th>Responsable</th><th>Estado</th><th>Soportes</th><th>Resultado</th><th>Cliente</th><th></th></tr></thead>
      <tbody>${list.map(a=>`<tr>
        <td style="max-width:240px;"><b>${esc(a.titulo)}</b><span class="sub">${esc(a.desc)}</span></td>
        <td>${esc(a.tipo)}</td><td>${fmtFecha(a.fecha)}</td><td>${esc(pName(a.resp))}</td><td>${estadoActTag(a.estado)}</td>
        <td class="small">${a.docIds.map(id=>`<div>${I('file').replace('class="icon"','class="icon" style="display:inline;width:11px;height:11px;vertical-align:-1px;"')} ${esc(docName(c,id))}</div>`).join('')}${a.evIds.length?`<div class="muted">${a.evIds.length} evidencia(s)</div>`:''}${!a.docIds.length&&!a.evIds.length?'<span class="muted">—</span>':''}</td>
        <td style="max-width:220px;" class="small">${esc(a.resultado||'—')}</td>
        <td>${a.compartirCliente?'<span class="tag ok">Visible</span>':'<span class="muted small">Interna</span>'}</td>
        <td>${can('actuaciones',c)?`<button class="link-btn" data-edit="${a.id}">Editar</button>`:''}</td></tr>`).join('') || '<tr><td colspan="9"><div class="empty">Sin actuaciones registradas.</div></td></tr>'}</tbody></table></div>`;
  P.querySelector('#cpBtnAct')?.addEventListener('click', ()=> openActForm(c));
  P.querySelector('#cpActEst').addEventListener('change', e=>{ cpState.actFiltro=e.target.value; renderActuaciones(c); });
  P.querySelectorAll('[data-edit]').forEach(b=> b.addEventListener('click', ()=> openActForm(c, c.actuaciones.find(a=>a.id===b.dataset.edit))));
}
function openActForm(c, a){
  const v = a || {tipo:'', titulo:'', fecha:isoDate(CP_HOY), resp:c.resp.abogado, estado:'Programada', desc:'', docIds:[], evIds:[], resultado:'', compartirCliente:false};
  const equipo = INTERNOS.filter(p=> c.config.autorizados.includes(p.id));
  const body = `<div class="form-grid">
    ${ff('Tipo', `<select id="faTipo">${opts(ACT_TIPOS, v.tipo, 'Seleccionar...')}</select>`, {req:1, id:'faTipo'})}
    ${ff('Fecha', `<input type="date" id="faFecha" value="${v.fecha}">`, {req:1, id:'faFecha'})}
    ${ff('Actuación', `<input id="faTitulo" value="${esc(v.titulo)}" placeholder="Ej. Radicar memorial de solicitud probatoria">`, {full:1, req:1, id:'faTitulo'})}
    ${ff('Responsable', `<select id="faResp">${opts(equipo.map(p=>({id:p.id,label:p.nombre})), v.resp)}</select>`, {req:1})}
    ${ff('Estado', `<select id="faEstado">${opts(ACT_ESTADOS, v.estado)}</select>`, {req:1})}
    ${ff('Descripción', `<textarea id="faDesc">${esc(v.desc)}</textarea>`, {full:1})}
    ${ff('Documentos relacionados', `<div class="chk-list">${docsVisibles(c).filter(d=>!d._locked).map(d=>`<label class="check"><input type="checkbox" class="faDoc" value="${d.id}" ${v.docIds.includes(d.id)?'checked':''}>${esc(d.nombre)}</label>`).join('') || '<span class="muted small">Sin documentos</span>'}</div>`)}
    ${ff('Evidencias relacionadas', `<div class="chk-list">${c.matriz.map(m=>`<label class="check"><input type="checkbox" class="faEv" value="${m.id}" ${v.evIds.includes(m.id)?'checked':''}>${esc(m.ev)}</label>`).join('') || '<span class="muted small">Sin evidencias</span>'}</div>`)}
    ${ff('Resultado', `<textarea id="faRes" placeholder="Obligatorio si la actuación está realizada">${esc(v.resultado)}</textarea>`, {full:1, id:'faRes'})}
    ${can('autorizarCliente') ? `<label class="check full"><input type="checkbox" id="faShare" ${v.compartirCliente?'checked':''}>Mostrar este avance al cliente (avance autorizado)</label>` : `<p class="muted small full" style="margin:0;">La visibilidad para el cliente la autoriza el Director o el Socio.</p>`}
  </div>`;
  openModal({title: a ? 'Editar actuación' : 'Registrar actuación', sub:`${c.id} · ${c.cliente}`, body, foot:[{label:'Cancelar'}, {label:'Guardar actuación', cls:'primary', onClick:()=>{
    const B = document.getElementById('cpModalBody'); const g = id=>B.querySelector('#'+id);
    const data = {tipo:g('faTipo').value, fecha:g('faFecha').value, titulo:g('faTitulo').value.trim(), resp:g('faResp').value, estado:g('faEstado').value, desc:g('faDesc').value.trim(),
      docIds:[...B.querySelectorAll('.faDoc:checked')].map(x=>x.value), evIds:[...B.querySelectorAll('.faEv:checked')].map(x=>x.value), resultado:g('faRes').value.trim(),
      compartirCliente: g('faShare') ? g('faShare').checked : v.compartirCliente};
    B.querySelectorAll('.invalid').forEach(x=>x.classList.remove('invalid'));
    const miss = []; if(!data.tipo) miss.push('faTipo'); if(!data.fecha) miss.push('faFecha'); if(!data.titulo) miss.push('faTitulo'); if(data.estado==='Realizada' && !data.resultado) miss.push('faRes');
    if(miss.length){ miss.forEach(k=>B.querySelector(`[data-f="${k}"]`)?.classList.add('invalid')); showToast(miss.includes('faRes')&&miss.length===1?'Registra el resultado de la actuación realizada.':'Completa los campos obligatorios.'); return; }
    if(a){ const antes=a.estado; Object.assign(a, data); logAudit(c, 'Edición de actuación', 'Action', a.id, `${a.titulo}${antes!==a.estado?` · Estado: ${antes} → ${a.estado}`:''}`); }
    else { const n = {id:uid('ACT'), ...data, ts:nowIso(), creadoPor:currentUser().id}; c.actuaciones.push(n); logAudit(c, 'Registro de actuación', 'Action', n.id, `${n.tipo}: ${n.titulo}`, {estado:n.estado, soportes:n.docIds.length+n.evIds.length}); }
    closeModal(); refreshCase(); showToast('Actuación guardada.');
  }}]});
}

/* ---------- PESTAÑA · TAREAS ---------- */
function puedeCambiarTarea(c, t){
  if(!can('estadoTareas', c)) return false;
  if(currentRoleId==='administrativo') return t.resp===currentUser().id;
  return true;
}
function renderTareas(c){
  const F = cpState.tareaFiltro, me = currentUser().id;
  const list = c.tareas.filter(t=> (!F.estado || t.estado===F.estado) && (!F.resp || t.resp===F.resp) && (!F.mias || t.resp===me))
    .slice().sort((a,b)=> (a.estado==='Completada')-(b.estado==='Completada') || a.fecha.localeCompare(b.fecha));
  const P = document.getElementById('cpTareas');
  P.innerHTML = `
    <div class="section-sub"><div><h3>Tareas del caso</h3><p class="muted small" style="margin:2px 0 0;">Conecta el caso con la operación diaria: responsables, fechas, prioridad, comentarios y adjuntos.</p></div>
      ${can('tareas',c)?'<button class="btn primary" id="cpBtnTarea">+ Nueva tarea</button>':''}</div>
    <div class="filter-row">
      <select id="tfEstado">${opts(TAREA_ESTADOS, F.estado, 'Todos los estados')}</select>
      <select id="tfResp">${opts(INTERNOS.filter(p=>c.config.autorizados.includes(p.id)).map(p=>({id:p.id,label:p.nombre})), F.resp, 'Todos los responsables')}</select>
      <label class="check"><input type="checkbox" id="tfMias" ${F.mias?'checked':''}>Solo mis tareas</label>
      <span class="muted small">${list.length} tarea(s)</span>
    </div>
    <div class="matriz-wrap table-scroll"><table class="matriz" style="min-width:980px;">
      <thead><tr><th>Tarea</th><th>Responsable</th><th>Fecha límite</th><th>Prioridad</th><th>Estado</th><th>Relacionado con</th><th>Seguimiento</th></tr></thead>
      <tbody>${list.map(t=>{ const d=diasHasta(t.fecha); const done=t.estado==='Completada'; const act=c.actuaciones.find(a=>a.id===t.actId);
        return `<tr class="clickable ${done?'done-row':''}" data-t="${t.id}">
        <td style="max-width:260px;"><b>${esc(t.titulo)}</b>${t.desc?`<span class="sub">${esc(t.desc)}</span>`:''}</td>
        <td>${esc(pName(t.resp))}</td>
        <td><span class="due ${!done&&d<0?'over':!done&&d<=3?'soon':''}">${fmtFecha(t.fecha)}${!done&&d<0?'<small>Vencida</small>':''}</span></td>
        <td>${prioTag(t.prioridad)}</td>
        <td>${puedeCambiarTarea(c,t)?`<select class="mini-select" data-est="${t.id}">${opts(TAREA_ESTADOS, t.estado)}</select>`:estadoTareaTag(t.estado)}</td>
        <td class="small">${t.docId?`<div>${I('file').replace('class="icon"','class="icon" style="display:inline;width:11px;height:11px;vertical-align:-1px;"')} ${esc(docName(c,t.docId))}</div>`:''}${act?`<div class="muted">Actuación: ${esc(act.titulo)}</div>`:''}${!t.docId&&!act?'<span class="muted">—</span>':''}</td>
        <td class="small muted">${t.comentarios.length} coment. · ${t.adjuntos.length} adj.</td></tr>`; }).join('') || '<tr><td colspan="7"><div class="empty">Sin tareas para los filtros seleccionados.</div></td></tr>'}</tbody></table></div>`;
  P.querySelector('#cpBtnTarea')?.addEventListener('click', ()=> openTareaForm(c));
  P.querySelector('#tfEstado').addEventListener('change', e=>{ F.estado=e.target.value; renderTareas(c); });
  P.querySelector('#tfResp').addEventListener('change', e=>{ F.resp=e.target.value; renderTareas(c); });
  P.querySelector('#tfMias').addEventListener('change', e=>{ F.mias=e.target.checked; renderTareas(c); });
  P.querySelectorAll('[data-est]').forEach(s=>{
    s.addEventListener('click', e=> e.stopPropagation());
    s.addEventListener('change', ()=> cambiarEstadoTarea(c, c.tareas.find(t=>t.id===s.dataset.est), s.value));
  });
  P.querySelectorAll('tr[data-t]').forEach(tr=> tr.addEventListener('click', ()=> openTareaDetail(c, c.tareas.find(t=>t.id===tr.dataset.t))));
}
function cambiarEstadoTarea(c, t, estado){
  const antes = t.estado; t.estado = estado;
  logAudit(c, 'Cambio de estado de tarea', 'Task', t.id, `${t.titulo} · ${antes} → ${estado}`);
  refreshCase(); showToast(`Tarea: ${estado}.`);
}
function openTareaForm(c){
  const equipo = INTERNOS.filter(p=> c.config.autorizados.includes(p.id));
  const body = `<div class="form-grid">
    ${ff('Tarea', `<input id="ftTitulo" placeholder="Ej. Revisar declaración del testigo X">`, {full:1, req:1, id:'ftTitulo'})}
    ${ff('Responsable', `<select id="ftResp">${opts(equipo.map(p=>({id:p.id,label:`${p.nombre} · ${roleById(p.rol).nombre}`})), '', 'Seleccionar...')}</select>`, {req:1, id:'ftResp'})}
    ${ff('Fecha límite', `<input type="date" id="ftFecha" value="${dOff(7)}">`, {req:1, id:'ftFecha'})}
    ${ff('Prioridad', `<select id="ftPrio">${opts(PRIORIDADES, 'media')}</select>`, {req:1})}
    ${ff('Estado', `<select id="ftEstado">${opts(TAREA_ESTADOS, 'Pendiente')}</select>`)}
    ${ff('Documento relacionado', `<select id="ftDoc">${opts(docsVisibles(c).filter(d=>!d._locked).map(d=>({id:d.id,label:d.nombre})), '', 'Ninguno')}</select>`)}
    ${ff('Actuación relacionada', `<select id="ftAct">${opts(c.actuaciones.map(a=>({id:a.id,label:a.titulo})), '', 'Ninguna')}</select>`)}
    ${ff('Descripción / comentario inicial', `<textarea id="ftDesc"></textarea>`, {full:1})}
    ${ff('Adjuntos', `<input type="file" id="ftAdj" multiple>`, {full:1})}
  </div>`;
  openModal({title:'Nueva tarea', sub:`${c.id} · ${c.cliente}`, body, foot:[{label:'Cancelar'}, {label:'Crear tarea', cls:'primary', onClick:()=>{
    const B = document.getElementById('cpModalBody'); const g=id=>B.querySelector('#'+id);
    const t = {id:uid('T'), titulo:g('ftTitulo').value.trim(), resp:g('ftResp').value, fecha:g('ftFecha').value, prioridad:g('ftPrio').value, estado:g('ftEstado').value,
      docId:g('ftDoc').value, actId:g('ftAct').value, desc:g('ftDesc').value.trim(), comentarios:[], adjuntos:[...g('ftAdj').files].map(f=>({nombre:f.name, size:f.size})), ts:nowIso(), creadoPor:currentUser().id};
    B.querySelectorAll('.invalid').forEach(x=>x.classList.remove('invalid'));
    const miss=[]; if(!t.titulo) miss.push('ftTitulo'); if(!t.resp) miss.push('ftResp'); if(!t.fecha) miss.push('ftFecha');
    if(miss.length){ miss.forEach(k=>B.querySelector(`[data-f="${k}"]`)?.classList.add('invalid')); showToast('Completa los campos obligatorios.'); return; }
    c.tareas.push(t);
    logAudit(c, 'Creación de tarea', 'Task', t.id, `${t.titulo} → ${pName(t.resp)}`, {prioridad:prioLabel(t.prioridad), fecha:t.fecha, adjuntos:t.adjuntos.length});
    closeModal(); refreshCase(); showToast('Tarea creada y asignada.');
  }}]});
}
function openTareaDetail(c, t){
  const act = c.actuaciones.find(a=>a.id===t.actId);
  const puedeComentar = currentRoleId!=='cliente' && editable(c);
  const puedeAdjuntar = puedeComentar && (can('tareas',c) || t.resp===currentUser().id);
  const traza = c.auditoria.filter(a=>a.entidadId===t.id).slice().reverse();
  const html = `
    <dl class="kv">
      <dt>Responsable</dt><dd>${esc(pName(t.resp))}</dd><dt>Fecha límite</dt><dd>${fmtFecha(t.fecha)}</dd>
      <dt>Prioridad</dt><dd>${prioTag(t.prioridad)}</dd><dt>Estado</dt><dd>${estadoTareaTag(t.estado)}</dd>
      <dt>Documento</dt><dd>${esc(docName(c,t.docId)||'—')}</dd><dt>Actuación</dt><dd>${esc(act?act.titulo:'—')}</dd>
      <dt>Creada por</dt><dd>${esc(pName(t.creadoPor))} · ${fmtFechaHora(t.ts)}</dd><dt>Descripción</dt><dd>${esc(t.desc||'—')}</dd>
    </dl>
    ${puedeCambiarTarea(c,t)?`<h4>Estado</h4><div class="row-actions">${TAREA_ESTADOS.map(e=>`<button class="btn sm ${e===t.estado?'primary':''}" data-e="${e}">${e}</button>`).join('')}</div>`:''}
    <h4>Comentarios</h4>
    ${t.comentarios.map(cm=>`<div class="comment"><b>${esc(pName(cm.por))}</b><span>${fmtFechaHora(cm.ts)}</span><div>${esc(cm.texto)}</div></div>`).join('') || '<p class="muted small">Sin comentarios.</p>'}
    ${puedeComentar?`<div class="form-field" style="margin-top:8px;"><textarea id="tdCom" placeholder="Escribe un comentario..."></textarea></div><button class="btn sm" id="tdComBtn" style="margin-top:6px;">Comentar</button>`:''}
    <h4>Adjuntos</h4>
    <ul>${t.adjuntos.map(a=>`<li>${esc(a.nombre)} <span class="muted">· ${fmtSize(a.size)}</span></li>`).join('') || '<li class="muted">Sin adjuntos</li>'}</ul>
    ${puedeAdjuntar?`<input type="file" id="tdAdj" multiple style="margin-top:6px;font-size:12px;">`:''}
    <h4>Trazabilidad</h4>
    <ul>${traza.map(a=>`<li>${fmtFechaHora(a.ts)} · <b>${esc(a.accion)}</b> · ${esc(a.usuario)}</li>`).join('')}</ul>`;
  const b = openCpDrawer('Tarea · ' + c.id, t.titulo, html);
  b.querySelectorAll('[data-e]').forEach(x=> x.addEventListener('click', ()=>{ if(x.dataset.e!==t.estado){ cambiarEstadoTarea(c, t, x.dataset.e); openTareaDetail(c, t); } }));
  b.querySelector('#tdComBtn')?.addEventListener('click', ()=>{
    const txt = b.querySelector('#tdCom').value.trim(); if(!txt) return;
    t.comentarios.push({por:currentUser().id, ts:nowIso(), texto:txt});
    logAudit(c, 'Comentario en tarea', 'Task', t.id, `${t.titulo}: ${txt.slice(0,80)}`);
    refreshCase(); openTareaDetail(c, t);
  });
  b.querySelector('#tdAdj')?.addEventListener('change', e=>{
    const files=[...e.target.files]; if(!files.length) return;
    files.forEach(f=> t.adjuntos.push({nombre:f.name, size:f.size}));
    logAudit(c, 'Adjunto en tarea', 'Task', t.id, `${t.titulo}: ${files.map(f=>f.name).join(', ')}`);
    refreshCase(); openTareaDetail(c, t);
  });
}

/* ============================================================
   PESTAÑA · IA — análisis estructurado + revisión humana obligatoria
   ============================================================ */
function agentesDelRol(){ return (currentRole().agentes||[]).map(a=>a.id); }
function resetIAState(c){
  const ag = agentesDelRol();
  cpState.ia.agent = ag[0] || null;
  cpState.ia.docs = new Set(docsVisibles(c).filter(d=>!d._locked).map(d=>d.id));
  cpState.ia.evs = new Set(c.matriz.map(m=>m.id));
  cpState.ia.sel = c.ia[0] ? c.ia[0].id : null;
  cpState.ia.running = false;
}

function generarAnalisis(c, agentId, docIds, evIds, solicitante, ts){
  const docs = c.documentos.filter(d=>docIds.includes(d.id));
  const evs = c.matriz.filter(m=>evIds.includes(m.id));
  const ver = evs.filter(e=>e.estado==='verificada'), rev = evs.filter(e=>e.estado==='revision'), pen = evs.filter(e=>e.estado==='pendiente');
  const hechos = Object.keys(HECHOS).map(h=>({h, total:evs.filter(e=>e.hecho===h).length, ver:evs.filter(e=>e.hecho===h && e.estado==='verificada').length})).filter(x=>x.total);
  const tVenc = c.tareas.filter(t=>t.estado!=='Completada' && diasHasta(t.fecha)<0);
  const venc = proximoVencimiento(c);

  const hallazgos = [];
  rev.filter(e=>e.relev==='alta').forEach(e=> hallazgos.push(`«${e.ev}» (relevancia alta) sigue en revisión y sostiene el hecho ${e.hecho} · ${HECHOS[e.hecho]}.`));
  pen.forEach(e=> hallazgos.push(`«${e.ev}» está pendiente de recaudo: ${e.obs}`));
  hechos.filter(x=>x.ver===0).forEach(x=> hallazgos.push(`El hecho ${x.h} · ${HECHOS[x.h]} no cuenta con evidencia verificada entre los elementos analizados.`));
  docs.filter(d=>d.versiones.length>1).forEach(d=> hallazgos.push(`«${d.nombre}» tiene ${d.versiones.length} versiones; el análisis usó la versión v${d.version}.`));
  if(ver.length) hallazgos.push(`${ver.length} de ${evs.length} evidencias analizadas están verificadas y pueden soportar la posición del caso.`);
  if(!hallazgos.length) hallazgos.push('No se identifican vacíos probatorios en los elementos seleccionados.');

  const inconsistencias = [];
  const fin = evs.find(e=>/financ/i.test(e.tipo)), per = evs.find(e=>/pericial/i.test(e.tipo));
  if(fin && per && fin.estado!==per.estado) inconsistencias.push(`Estado divergente entre «${fin.ev}» (${stateLabel(fin.estado)}) y «${per.ev}» (${stateLabel(per.estado)}): conciliar montos antes de usarlos en conjunto.`);
  hechos.filter(x=>x.ver>0 && x.ver<x.total).forEach(x=> inconsistencias.push(`El hecho ${x.h} combina evidencia verificada y no verificada; validar consistencia antes de argumentar sobre él.`));
  evs.filter(e=>!e.docId && e.estado!=='pendiente').forEach(e=> inconsistencias.push(`«${e.ev}» no tiene documento soporte asociado en el expediente.`));

  const riesgos = [];
  pen.forEach(e=> riesgos.push({riesgo:`Vacío probatorio si no se obtiene «${e.ev}»`, prioridad:e.relev==='alta'?'Alta':'Media', evidencia:e.ev}));
  rev.filter(e=>e.relev==='alta').forEach(e=> riesgos.push({riesgo:`Evidencia clave sin validar para el hecho ${e.hecho}`, prioridad:'Alta', evidencia:e.ev}));
  tVenc.forEach(t=> riesgos.push({riesgo:`Tarea vencida: ${t.titulo}`, prioridad:'Alta', evidencia:docName(c,t.docId)||'—'}));
  if(venc && venc.dias<=5) riesgos.push({riesgo:`Vencimiento cercano: ${venc.label} (${fmtFecha(venc.fecha)})`, prioridad:venc.dias<=2?'Crítica':'Alta', evidencia:'Calendario procesal'});
  docs.filter(d=>d.sensibilidad==='Reservada').forEach(d=> riesgos.push({riesgo:'Uso de información reservada: limitar su circulación y excluirla de reportes al cliente', prioridad:'Media', evidencia:d.nombre}));
  if(!riesgos.length) riesgos.push({riesgo:'Sin riesgos significativos en los elementos analizados', prioridad:'Baja', evidencia:'—'});

  const acciones = [];
  pen.forEach(e=> acciones.push(`Solicitar / recaudar «${e.ev}» (responsable actual: ${roleById(e.resp).nombre}).`));
  rev.forEach(e=> acciones.push(`Validar y conciliar «${e.ev}» antes de incorporarla a la teoría del caso.`));
  tVenc.forEach(t=> acciones.push(`Reprogramar o escalar la tarea vencida «${t.titulo}».`));
  if(venc && venc.dias>=0) acciones.push(`Preparar «${venc.label}» antes del ${fmtFecha(venc.fecha)}.`);
  if(!acciones.length) acciones.push('Mantener el seguimiento ordinario del caso.');

  const ratio = evs.length ? ver.length/evs.length : 0;
  const score = Math.min(96, Math.round(42 + ratio*40 + Math.min(docs.length,5)*3));
  const nivel = score>=75 ? 'Alta' : score>=58 ? 'Media' : 'Baja';
  const respId = agentId==='recomendacion' ? c.resp.director : (agentId==='probatorio' && pen.length && c.resp.admin) ? c.resp.admin : c.resp.abogado;
  const hVer = hechos.filter(x=>x.ver>0).map(x=>x.h), hNo = hechos.filter(x=>x.ver===0).map(x=>x.h);

  let resumen = '', extra = {};
  if(agentId==='gestion'){
    resumen = `Expediente ${c.id} (${c.cliente}) en etapa de ${c.etapa}, estado ${wfLabel(c.wf)}. Se analizaron ${docs.length} documentos y ${evs.length} evidencias: ${ver.length} verificadas, ${rev.length} en revisión y ${pen.length} pendientes.${venc?` Próximo vencimiento: ${venc.label} (${fmtFecha(venc.fecha)}).`:''}`;
    extra = {
      teoria:`Línea preliminar: los hechos ${hVer.join(', ')||'—'} cuentan con soporte verificado y permiten sostener la posición de ${c.tipoCaso==='Representación de víctima'?'la víctima':'la defensa'}; los hechos ${hNo.join(', ')||'—'} requieren completar el recaudo antes de fijar la teoría definitiva del caso.`,
      actuaciones:[...c.actuaciones.filter(a=>['Pendiente','Programada'].includes(a.estado)).map(a=>`${a.titulo} (${fmtFecha(a.fecha)})`), ...(pen.length?['Solicitud probatoria para obtener la evidencia pendiente']:[])],
      argumentos: ver.slice(0,3).map(e=>`«${e.ev}» permite ${e.pretende.charAt(0).toLowerCase()+e.pretende.slice(1)}`),
      documentos:[...pen.map(e=>e.ev), ...c.solicitudes.filter(s=>s.estado==='pendiente').map(s=>s.doc)],
    };
  } else if(agentId==='probatorio'){
    resumen = `Revisión documental de ${docs.length} documentos y ${evs.length} evidencias de ${c.id}: ${ver.length} verificadas, ${rev.length} en revisión y ${pen.length} pendientes de recaudo. ${inconsistencias.length} posible(s) inconsistencia(s) detectada(s).`;
    extra = {
      checklist: evs.map(e=>({item:e.ev, ok:e.estado==='verificada', nota:stateLabel(e.estado)})),
      matrizDoc: evs.map(e=>({evidencia:e.ev, doc:docName(c,e.docId)||'Sin documento', hecho:e.hecho, estado:stateLabel(e.estado)})),
      hechosExtraidos: evs.filter(e=>e.estado!=='pendiente').slice(0,5).map(e=>`${e.hecho} · ${e.pretende}`),
      dudas:[...pen.filter(e=>/autoriz/i.test(e.obs)).map(e=>`Confirmar con el Abogado: ${e.obs}`), ...inconsistencias.slice(0,2).map(i=>`Escalar: ${i}`), ...(docs.some(d=>d.sensibilidad==='Reservada')?['Confirmar si la información reservada puede incorporarse al análisis formal.']:[])],
    };
  } else {
    resumen = `Lectura ejecutiva de ${c.id}: riesgo ${riskLabel(c.riesgo).toLowerCase()}, avance ${c.progreso}%, estado ${wfLabel(c.wf)}. ${ver.length} de ${evs.length} evidencias verificadas; ${riesgos.filter(r=>['Alta','Crítica'].includes(r.prioridad)).length} riesgo(s) de prioridad alta o crítica.`;
    extra = {
      decisiones:[c.wf==='revision'?'Aprobar la estrategia procesal del caso (estado En revisión).':null, pen.length?'Autorizar continuar con evidencia pendiente o solicitar una nueva revisión al Director.':null, venc&&venc.dias<=5?`Definir la respuesta a «${venc.label}» antes del ${fmtFecha(venc.fecha)}.`:null].filter(Boolean),
      rutas:[
        {ruta:'Mantener la estrategia y completar el recaudo probatorio', pros:'Aprovecha la evidencia ya verificada', contras:pen.length?`Depende de ${pen.length} elemento(s) pendiente(s)`:'Sin contras relevantes'},
        {ruta:'Solicitud probatoria o actuación anticipada', pros:'Asegura la práctica de pruebas clave', contras:'Anticipa la línea de defensa'},
        {ruta:'Explorar mecanismos de terminación anticipada', pros:'Reduce exposición y tiempo del proceso', contras:'Requiere decisión del cliente y aprobación del Socio'},
      ],
      recomendacion: ratio>=0.6 ? 'Ruta 1: mantener la estrategia actual y completar el recaudo; aprobar las actuaciones programadas.' : 'Ruta 1 condicionada: no aprobar nuevas actuaciones de alto impacto hasta verificar la evidencia crítica pendiente.',
    };
  }
  return {id:uid('IA'), agentId, ts:ts||nowIso(), solicitadoPor:solicitante, docIds:[...docIds], evIds:[...evIds], estado:'pendiente', revision:null,
    result:{resumen, hallazgos, inconsistencias, riesgos, acciones:acciones.slice(0,6), fuentes:fuentesLegales(c), fuentesInternas:docs.map(d=>`${d.nombre} (v${d.version})`), confianza:{nivel, score}, responsable:respId, extra}};
}

function renderIA(c){
  const P = document.getElementById('cpIA');
  const S = cpState.ia, mine = agentesDelRol();
  const puede = can('ia', c) && mine.length;
  const docs = docsVisibles(c);
  P.innerHTML = `
    <div class="notice accent">${I('shield')}<span><b>La IA no aprueba ni cierra el caso.</b> Todo resultado queda <b>pendiente de revisión humana</b> y solo se incorpora formalmente cuando un Abogado, Director o Socio lo aprueba. Cada paso queda en la auditoría.</span></div>
    <div class="panel" style="margin-bottom:16px;">
      <div class="panel-head"><div><h3>Nuevo análisis</h3><p class="ph-sub">1. Selecciona el agente · 2. Selecciona documentos y evidencias · 3. Analizar con IA</p></div></div>
      <div class="ai-agents">${['gestion','probatorio','recomendacion'].map(id=>{ const ok=mine.includes(id); return `<button class="ai-agent ${S.agent===id?'on':''} ${ok?'':'locked'}" data-ag="${id}" ${ok?'':'disabled'}>
        <b>${AGENTS[id].nombre}</b><span>${AGENTS[id].especialidad}</span><span style="color:var(--accent);font-weight:600;">${AI_SALIDA[id]}</span>${ok?'':'<span class="lock">'+I('lock')+' No disponible para tu rol</span>'}</button>`; }).join('')}</div>
      ${puede ? `
      <div class="grid-2">
        <div><div class="section-sub" style="margin-bottom:6px;"><b class="small">Documentos (${S.docs.size}/${docs.filter(d=>!d._locked).length})</b><button class="link-btn" data-all="docs">Seleccionar todo</button></div>
          <div class="chk-list">${docs.map(d=> d._locked ? `<label class="check lock">${I('lock')} ${esc(d.nombre)} · reservado</label>` : `<label class="check"><input type="checkbox" data-d="${d.id}" ${S.docs.has(d.id)?'checked':''}>${esc(d.nombre)} <small>· v${d.version}${d.estadoIA!=='Analizado'?' · '+esc(d.estadoIA):''}</small></label>`).join('') || '<span class="muted small">Sin documentos</span>'}</div></div>
        <div><div class="section-sub" style="margin-bottom:6px;"><b class="small">Evidencias (${S.evs.size}/${c.matriz.length})</b><button class="link-btn" data-all="evs">Seleccionar todo</button></div>
          <div class="chk-list">${c.matriz.map(m=>`<label class="check"><input type="checkbox" data-e="${m.id}" ${S.evs.has(m.id)?'checked':''}>${esc(m.ev)} <small>· ${stateLabel(m.estado)}</small></label>`).join('') || '<span class="muted small">Sin evidencias</span>'}</div></div>
      </div>
      <div class="fi-actions"><button class="btn primary" id="cpIARun" ${S.running?'disabled':''}>${I('wand')} Analizar con IA</button><button class="btn" id="cpIAChat">Abrir chat del agente</button></div>
      <div id="cpIAPipeline" style="margin-top:12px;"></div>` : `<p class="muted small" style="margin:0;">${editable(c)?'Tu rol no puede solicitar análisis en este caso.':'El caso está '+wfLabel(c.wf).toLowerCase()+': no admite nuevos análisis.'}</p>`}
    </div>
    <div class="grid-21" style="align-items:start;">
      <div id="cpIAResult"></div>
      <div class="panel"><div class="panel-head"><h3>Historial de análisis</h3><span class="muted small">${c.ia.length}</span></div>
        <div class="stack" style="gap:8px;">${c.ia.map(a=>`<div class="hist-item ${S.sel===a.id?'on':''}" data-h="${a.id}"><div><b class="small">${AGENTS[a.agentId].nombre}</b><div class="muted small">${fmtFechaHora(a.ts)} · ${esc(pName(a.solicitadoPor))}</div></div><span class="ai-status ${a.estado}">${a.estado==='pendiente'?'Pendiente':AI_STATUS[a.estado]}</span></div>`).join('') || '<div class="empty">Sin análisis todavía.</div>'}</div>
      </div>
    </div>`;
  P.querySelectorAll('[data-ag]:not([disabled])').forEach(b=> b.addEventListener('click', ()=>{ S.agent=b.dataset.ag; renderIA(c); }));
  P.querySelectorAll('[data-d]').forEach(x=> x.addEventListener('change', ()=>{ x.checked ? S.docs.add(x.dataset.d) : S.docs.delete(x.dataset.d); renderIA(c); }));
  P.querySelectorAll('[data-e]').forEach(x=> x.addEventListener('change', ()=>{ x.checked ? S.evs.add(x.dataset.e) : S.evs.delete(x.dataset.e); renderIA(c); }));
  P.querySelectorAll('[data-all]').forEach(b=> b.addEventListener('click', ()=>{
    if(b.dataset.all==='docs') S.docs = new Set(docs.filter(d=>!d._locked).map(d=>d.id)); else S.evs = new Set(c.matriz.map(m=>m.id));
    renderIA(c);
  }));
  P.querySelector('#cpIARun')?.addEventListener('click', ()=> runIA(c));
  P.querySelector('#cpIAChat')?.addEventListener('click', ()=>{ if(S.agent) activateAgent(S.agent); });
  P.querySelectorAll('[data-h]').forEach(h=> h.addEventListener('click', ()=>{ S.sel=h.dataset.h; renderIA(c); }));
  renderIAResult(c);
}

async function runIA(c){
  const S = cpState.ia;
  if(!S.agent || !agentesDelRol().includes(S.agent)){ showToast('Selecciona un agente disponible para tu rol.'); return; }
  if(!S.docs.size && !S.evs.size){ showToast('Selecciona al menos un documento o evidencia.'); return; }
  S.running = true;
  document.getElementById('cpIARun').disabled = true;
  const pipe = document.getElementById('cpIAPipeline');
  await runProcess(pipe, [
    `Verificando permisos de ${currentRole().nombre} y sensibilidad de la información`, `Preparando ${S.docs.size} documento(s) y ${S.evs.size} evidencia(s)`,
    'Clasificando información', 'Extrayendo hechos', 'Comparando documentos', 'Detectando inconsistencias', 'Buscando fuentes aplicables',
    'Generando hallazgos', 'Generando recomendaciones', 'Calculando nivel de confianza', 'Validando consistencia y trazabilidad de fuentes'
  ], 210);
  const a = generarAnalisis(c, S.agent, [...S.docs], [...S.evs], currentUser().id);
  c.ia.unshift(a);
  logAudit(c, 'Solicitud de análisis IA', 'AIAnalysis', a.id, `${AGENTS[a.agentId].nombre} · ${a.docIds.length} documentos, ${a.evIds.length} evidencias`, {confianza:a.result.confianza.nivel});
  S.sel = a.id; S.running = false;
  refreshCase();
  showToast('Análisis generado · Pendiente de revisión humana.');
}

function puedeRevisarIA(c, a){
  if(!can('revisarIA', c)) return false;
  if(a.agentId==='recomendacion') return ['socio','director'].includes(currentRoleId);
  return true;
}
function renderIAResult(c){
  const box = document.getElementById('cpIAResult');
  const a = c.ia.find(x=>x.id===cpState.ia.sel);
  if(!a){ box.innerHTML = '<div class="empty">Selecciona un análisis del historial o ejecuta uno nuevo.</div>'; return; }
  const r = a.result, x = r.extra || {};
  const lista = arr => arr && arr.length ? `<ul>${arr.map(i=>`<li>${esc(i)}</li>`).join('')}</ul>` : '<p class="muted small">—</p>';
  let extraHtml = '';
  if(a.agentId==='gestion') extraHtml = `
    <div class="ai-sec"><h4>Teoría del caso (propuesta)</h4><p>${esc(x.teoria)}</p></div>
    <div class="ai-cols"><div class="ai-sec"><h4>Actuaciones propuestas</h4>${lista(x.actuaciones)}</div><div class="ai-sec"><h4>Argumentos</h4>${lista(x.argumentos)}</div></div>
    <div class="ai-sec"><h4>Documentos necesarios</h4>${lista(x.documentos)}</div>`;
  if(a.agentId==='probatorio') extraHtml = `
    <div class="ai-cols"><div class="ai-sec"><h4>Checklist probatorio</h4><ul style="list-style:none;padding:0;">${(x.checklist||[]).map(i=>`<li>${i.ok?'✅':'⬜'} ${esc(i.item)} <span class="muted small">· ${i.nota}</span></li>`).join('')}</ul></div>
      <div class="ai-sec"><h4>Hechos extraídos</h4>${lista(x.hechosExtraidos)}</div></div>
    <div class="ai-sec"><h4>Matriz documental</h4><table class="matriz"><thead><tr><th>Evidencia</th><th>Documento</th><th>Hecho</th><th>Estado</th></tr></thead><tbody>${(x.matrizDoc||[]).map(m=>`<tr><td>${esc(m.evidencia)}</td><td>${esc(m.doc)}</td><td>${m.hecho}</td><td>${m.estado}</td></tr>`).join('')}</tbody></table></div>
    <div class="ai-sec"><h4>Inconsistencias detectadas</h4>${lista(r.inconsistencias)}</div>
    <div class="ai-sec"><h4>Dudas para escalar</h4>${lista(x.dudas)}</div>`;
  if(a.agentId==='recomendacion') extraHtml = `
    <div class="ai-sec"><h4>Decisiones pendientes</h4>${lista(x.decisiones)}</div>
    <div class="ai-sec"><h4>Rutas procesales comparadas</h4><table class="matriz"><thead><tr><th>Ruta</th><th>A favor</th><th>En contra</th></tr></thead><tbody>${(x.rutas||[]).map(m=>`<tr><td><b>${esc(m.ruta)}</b></td><td>${esc(m.pros)}</td><td>${esc(m.contras)}</td></tr>`).join('')}</tbody></table></div>
    <div class="ai-sec"><h4>Recomendación procesal</h4><p><b>${esc(x.recomendacion)}</b></p></div>`;
  const rev = a.revision;
  let review = '';
  if(a.estado==='pendiente'){
    review = puedeRevisarIA(c, a) ? `<div class="review-bar"><div style="width:100%;"><b class="small">Revisión humana</b> <span class="muted small">— ${currentRole().nombre}: aprueba, modifica, rechaza o solicita más información.</span></div>
        <textarea id="iaCom" placeholder="Comentario de la revisión (obligatorio para rechazar o pedir más información)"></textarea>
        <button class="btn ok sm" data-rv="aprobado">Aprobar</button><button class="btn sm" data-rv="modificar">Modificar y aprobar</button>
        <button class="btn danger sm" data-rv="rechazado">Rechazar</button><button class="btn sm" data-rv="info">Solicitar más información</button></div>`
      : `<div class="review-bar"><span class="muted small">${I('lock').replace('class="icon"','class="icon" style="display:inline;width:11px;height:11px;"')} La revisión de este análisis corresponde a ${a.agentId==='recomendacion'?'Socio o Director':'Abogado, Director o Socio'}.</span></div>`;
  } else {
    review = `<div class="review-bar"><div style="width:100%;font-size:12.6px;"><b>${AI_STATUS[a.estado]}</b> por ${esc(pName(rev.por))} · ${fmtFechaHora(rev.ts)}${rev.comentario?` — “${esc(rev.comentario)}”`:''}</div>
      ${['aprobado','modificado'].includes(a.estado) && can('tareas', c) && !a.tareasCreadas ? `<button class="btn sm primary" id="iaTareas">Crear tareas desde las acciones sugeridas</button>` : ''}
      ${a.tareasCreadas ? '<span class="tag ok">Acciones convertidas en tareas</span>' : ''}
      ${a.estado==='info' && can('ia', c) ? '<button class="btn sm" id="iaRerun">Ejecutar nuevo análisis</button>' : ''}</div>`;
  }
  box.innerHTML = `<div class="ai-result">
    <div class="ai-result-head"><div><h3>${AGENTS[a.agentId].nombre}</h3><span class="muted small">${a.id} · ${fmtFechaHora(a.ts)} · solicitado por ${esc(pName(a.solicitadoPor))}</span></div>
      <div style="display:flex;gap:6px;align-items:center;"><span class="conf ${r.confianza.nivel}">Confianza ${r.confianza.nivel} · ${r.confianza.score}%</span><span class="ai-status ${a.estado}">${AI_STATUS[a.estado]}</span></div></div>
    <div class="ai-sec"><h4>Resumen</h4><p>${esc(r.resumen)}</p></div>
    <div class="ai-sec"><h4>Hallazgos</h4>${lista(r.hallazgos)}</div>
    <div class="ai-sec"><h4>Riesgos</h4><table class="matriz"><thead><tr><th>Riesgo</th><th>Prioridad</th><th>Evidencia</th></tr></thead><tbody>${r.riesgos.map(x=>`<tr><td>${esc(x.riesgo)}</td><td><span class="tag ${['Alta','Crítica'].includes(x.prioridad)?'danger':x.prioridad==='Media'?'warn':''}">${x.prioridad}</span></td><td>${esc(x.evidencia)}</td></tr>`).join('')}</tbody></table></div>
    ${extraHtml}
    <div class="ai-cols"><div class="ai-sec"><h4>Documentos analizados</h4>${lista(r.fuentesInternas)}</div><div class="ai-sec"><h4>Fuentes</h4>${lista(r.fuentes)}<p class="muted small" style="margin-top:6px;">Fuentes sugeridas por IA: verificar vigencia y aplicabilidad.</p></div></div>
    <div class="ai-sec"><h4>Acciones sugeridas</h4>${lista(r.acciones)}</div>
    <div class="ai-cols"><div class="ai-sec"><h4>Responsable sugerido</h4><p>${esc(pName(r.responsable))}</p></div><div class="ai-sec"><h4>Estado</h4><p><b>${AI_STATUS[a.estado]}</b></p></div></div>
    ${review}
  </div>`;
  box.querySelectorAll('[data-rv]').forEach(b=> b.addEventListener('click', ()=>{
    const com = (box.querySelector('#iaCom').value||'').trim();
    const d = b.dataset.rv;
    if(['rechazado','info'].includes(d) && !com){ showToast('Agrega un comentario para esta decisión.'); box.querySelector('#iaCom').focus(); return; }
    if(d==='modificar') return openIAModificar(c, a, com);
    decidirIA(c, a, d, com);
  }));
  box.querySelector('#iaTareas')?.addEventListener('click', ()=>{
    r.acciones.forEach(t=> c.tareas.push({id:uid('T'), titulo:t.replace(/\.$/,''), desc:`Generada desde el análisis ${a.id} (${AI_STATUS[a.estado]} por ${pName(a.revision.por)}).`, resp:r.responsable, fecha:dOff(5), prioridad:'alta', estado:'Pendiente', docId:'', actId:'', comentarios:[], adjuntos:[], ts:nowIso(), creadoPor:currentUser().id}));
    a.tareasCreadas = true;
    logAudit(c, 'Tareas creadas desde análisis IA', 'AIAnalysis', a.id, `${r.acciones.length} tarea(s) asignadas a ${pName(r.responsable)}`);
    refreshCase(); showToast(`${r.acciones.length} tareas creadas para seguimiento.`);
  });
  box.querySelector('#iaRerun')?.addEventListener('click', ()=>{ cpState.ia.agent = agentesDelRol().includes(a.agentId) ? a.agentId : cpState.ia.agent; window.scrollTo({top:document.getElementById('cpTabs').offsetTop, behavior:'smooth'}); runIA(c); });
}
function decidirIA(c, a, decision, comentario){
  a.estado = decision;
  a.revision = {por:currentUser().id, ts:nowIso(), comentario, decision};
  logAudit(c, 'Revisión de análisis IA', 'AIAnalysis', a.id, `${AI_STATUS[decision]} · ${AGENTS[a.agentId].nombre}`, {comentario:comentario||'—'});
  refreshCase(); showToast(`Análisis: ${AI_STATUS[decision]}.`);
}
function openIAModificar(c, a, com){
  const body = `<div class="form-grid">
    ${ff('Resumen', `<textarea id="imRes" style="min-height:90px;">${esc(a.result.resumen)}</textarea>`, {full:1})}
    ${ff('Acciones sugeridas (una por línea)', `<textarea id="imAcc" style="min-height:120px;">${esc(a.result.acciones.join('\n'))}</textarea>`, {full:1})}
    ${ff('Comentario de la revisión', `<textarea id="imCom">${esc(com)}</textarea>`, {full:1})}
  </div>`;
  openModal({title:'Modificar resultado de IA', sub:'La versión modificada queda como aprobada con modificaciones', body, foot:[{label:'Cancelar'}, {label:'Guardar y aprobar', cls:'primary', onClick:()=>{
    const B = document.getElementById('cpModalBody');
    a.result.resumen = B.querySelector('#imRes').value.trim() || a.result.resumen;
    a.result.acciones = B.querySelector('#imAcc').value.split('\n').map(s=>s.trim()).filter(Boolean);
    closeModal(); decidirIA(c, a, 'modificado', B.querySelector('#imCom').value.trim() || 'Resultado ajustado por el revisor.');
  }}]});
}

/* ============================================================
   PESTAÑA · REPORTES
   ============================================================ */
const REPORT_TIPOS = [
  {id:'ejecutivo', label:'Reporte ejecutivo del caso', desc:'Estado, avance, riesgos, evidencias, actuaciones, pendientes y próximos pasos.'},
  {id:'probatorio', label:'Reporte probatorio', desc:'Evidencias, documentos, clasificaciones, hallazgos e inconsistencias.'},
  {id:'gestion', label:'Reporte de gestión', desc:'Tareas, responsables, vencimientos y alertas.'},
];
const REPORT_AUD = [{id:'socio',label:'Socio'},{id:'director',label:'Director'},{id:'abogado',label:'Abogado'},{id:'cliente',label:'Cliente autorizado'}];
const REPORT_CSS = 'body{font-family:Segoe UI,Arial,sans-serif;color:#1b1b19;font-size:13px;line-height:1.55;margin:32px;}h1{font-size:20px;margin:0 0 4px;}h2{font-size:13px;text-transform:uppercase;letter-spacing:.05em;color:#2f5fe0;margin:22px 0 8px;border-bottom:1px solid #ddd;padding-bottom:4px;}table{width:100%;border-collapse:collapse;font-size:12px;}th,td{border:1px solid #ddd;padding:6px 8px;text-align:left;vertical-align:top;}th{background:#f4f4f2;font-size:11px;text-transform:uppercase;}.rp-meta{color:#6f6f6a;font-size:12px;}ul{padding-left:18px;}';

function iaAprobados(c, agentes){ return c.ia.filter(a=>['aprobado','modificado'].includes(a.estado) && (!agentes || agentes.includes(a.agentId))); }
function buildReportHtml(c, tipo, aud, porId){
  const por = pName(porId || (currentRoleId && USER_BY_ROLE[currentRoleId]));
  const tipoL = REPORT_TIPOS.find(t=>t.id===tipo).label, audL = REPORT_AUD.find(a=>a.id===aud).label;
  const head = `<h1>${tipoL}</h1><div class="rp-meta">${c.id} · ${esc(c.cliente)} · ${esc(c.titulo)}<br>Generado el ${fmtFechaHora(nowIso())} por ${esc(por)} · Destinatario: ${audL} · Confidencialidad: ${aud==='cliente'?'Información autorizada para el cliente':esc(c.config.conf)}</div>`;
  const li = arr => arr.length ? `<ul>${arr.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>` : '<p>—</p>';
  const st = matrizStats(c);
  const abiertas = c.tareas.filter(t=>t.estado!=='Completada');
  if(aud==='cliente'){
    const avances = c.actuaciones.filter(a=>a.compartirCliente).sort((a,b)=>a.fecha.localeCompare(b.fecha));
    const sol = c.solicitudes.filter(s=>s.estado==='pendiente');
    const h = c.fechas.proximoHito;
    return `${head}
      <h2>Estado del caso</h2><p>${WF_CLIENTE_TXT[c.wf] || 'El caso se encuentra en preparación.'} Etapa procesal: <b>${esc(c.etapa)}</b>. Avance general: <b>${c.progreso}%</b>.</p>
      <h2>Avances autorizados</h2>${avances.length ? `<table><tr><th>Fecha</th><th>Actuación</th><th>Resultado</th></tr>${avances.map(a=>`<tr><td>${fmtFecha(a.fecha)}</td><td>${esc(a.titulo)}</td><td>${esc(a.estado==='Realizada'?a.resultado:a.estado)}</td></tr>`).join('')}</table>` : '<p>—</p>'}
      <h2>Documentos pendientes de tu parte</h2>${li(sol.map(s=>`${s.doc} · plazo ${fmtFecha(s.limite)}`))}
      <h2>Próximos pasos</h2><p>${h && h.label ? `${esc(h.label)} · ${fmtFecha(h.fecha)}` : 'El equipo jurídico te informará los próximos pasos.'}</p>
      <p class="rp-meta" style="margin-top:22px;">Este reporte contiene únicamente información autorizada por el equipo jurídico. No incluye estrategia interna, análisis de IA ni información reservada.</p>`;
  }
  if(tipo==='ejecutivo'){
    const ia = iaAprobados(c);
    const riesgosIA = ia.flatMap(a=>a.result.riesgos.filter(r=>['Alta','Crítica'].includes(r.prioridad)).map(r=>`${r.riesgo} (${r.prioridad})`));
    const rojo = alertasCaso(c).filter(a=>a.nivel==='rojo').map(a=>`${a.tipo}: ${a.texto}`);
    const pasos = ia.length ? ia[0].result.acciones : c.actuaciones.filter(a=>['Pendiente','Programada'].includes(a.estado)).map(a=>`${a.titulo} (${fmtFecha(a.fecha)})`);
    return `${head}
      <h2>Estado</h2><table><tr><th>Estado</th><th>Etapa</th><th>Riesgo</th><th>Prioridad</th><th>Responsable</th></tr><tr><td>${wfLabel(c.wf)}</td><td>${esc(c.etapa)}</td><td>${riskLabel(c.riesgo)}</td><td>${prioLabel(c.prioridad)}</td><td>${esc(pName(c.resp.abogado))}</td></tr></table>
      <h2>Avance</h2><p>Avance general: <b>${c.progreso}%</b> · Tareas completadas: ${c.tareas.length-abiertas.length} de ${c.tareas.length} · Actuaciones realizadas: ${c.actuaciones.filter(a=>a.estado==='Realizada').length} de ${c.actuaciones.length}.</p>
      <h2>Riesgos</h2>${li([...new Set([...riesgosIA, ...rojo])])}
      <h2>Evidencias</h2><p>${st.total} registradas · ${st.ver} verificadas · ${st.rev} en revisión · ${st.pend} pendientes de recaudo.</p>
      <h2>Actuaciones</h2>${c.actuaciones.length?`<table><tr><th>Fecha</th><th>Actuación</th><th>Estado</th><th>Responsable</th></tr>${c.actuaciones.slice().sort((a,b)=>b.fecha.localeCompare(a.fecha)).slice(0,6).map(a=>`<tr><td>${fmtFecha(a.fecha)}</td><td>${esc(a.titulo)}</td><td>${a.estado}</td><td>${esc(pName(a.resp))}</td></tr>`).join('')}</table>`:'<p>—</p>'}
      <h2>Pendientes</h2>${li([...abiertas.map(t=>`${t.titulo} · ${pName(t.resp)} · ${fmtFecha(t.fecha)}`), ...c.solicitudes.filter(s=>s.estado==='pendiente').map(s=>`Cliente: ${s.doc}`)])}
      ${aud==='socio' ? `<h2>Decisiones pendientes</h2>${li([c.wf==='revision'?'Aprobación de la estrategia del caso':null, ...c.ia.filter(a=>a.estado==='pendiente').map(a=>`Revisión de ${AGENTS[a.agentId].nombre} (${fmtFechaHora(a.ts)})`)].filter(Boolean))}` : ''}
      <h2>Próximos pasos</h2>${li(pasos)}
      <p class="rp-meta" style="margin-top:22px;">Solo se incluyen resultados de IA aprobados por revisión humana (${ia.length}). Análisis pendientes excluidos: ${c.ia.filter(a=>a.estado==='pendiente').length}.</p>`;
  }
  if(tipo==='probatorio'){
    const ia = iaAprobados(c, ['probatorio','gestion']);
    const clasif = {}; c.matriz.forEach(m=> clasif[m.tipo]=(clasif[m.tipo]||0)+1);
    return `${head}
      <h2>Evidencias</h2><table><tr><th>Evidencia</th><th>Tipo</th><th>Hecho</th><th>Estado</th><th>Relevancia</th><th>Documento</th></tr>${c.matriz.map(m=>`<tr><td>${esc(m.ev)}</td><td>${esc(m.tipo)}</td><td>${m.hecho} · ${HECHOS[m.hecho]}</td><td>${stateLabel(m.estado)}</td><td>${relevLabel(m.relev)}</td><td>${esc(docName(c,m.docId)||'—')}</td></tr>`).join('')}</table>
      <h2>Documentos</h2><table><tr><th>Documento</th><th>Categoría</th><th>Versión</th><th>Sensibilidad</th></tr>${c.documentos.map(d=>`<tr><td>${esc(d.nombre)}</td><td>${esc(d.categoria)}</td><td>v${d.version}</td><td>${esc(d.sensibilidad)}</td></tr>`).join('')}</table>
      <h2>Clasificaciones</h2>${li(Object.entries(clasif).map(([k,v])=>`${k}: ${v}`))}
      <h2>Hallazgos</h2>${li([...new Set(ia.flatMap(a=>a.result.hallazgos))])}
      <h2>Inconsistencias</h2>${li([...new Set(ia.flatMap(a=>a.result.inconsistencias||[]))])}
      <p class="rp-meta" style="margin-top:22px;">Hallazgos e inconsistencias provienen únicamente de análisis IA aprobados (${ia.length}).</p>`;
  }
  const porResp = {}; c.tareas.forEach(t=>{ porResp[t.resp] = porResp[t.resp] || {a:0,c:0,v:0}; if(t.estado==='Completada') porResp[t.resp].c++; else { porResp[t.resp].a++; if(diasHasta(t.fecha)<0) porResp[t.resp].v++; } });
  const vencs = [...c.tareas.filter(t=>t.estado!=='Completada').map(t=>({l:`Tarea: ${t.titulo}`, f:t.fecha})), ...(c.fechas.vencimientos||[]).map(v=>({l:v.label, f:v.fecha}))].sort((a,b)=>a.f.localeCompare(b.f));
  return `${head}
    <h2>Tareas</h2><table><tr><th>Tarea</th><th>Responsable</th><th>Fecha límite</th><th>Prioridad</th><th>Estado</th></tr>${c.tareas.map(t=>`<tr><td>${esc(t.titulo)}</td><td>${esc(pName(t.resp))}</td><td>${fmtFecha(t.fecha)}</td><td>${prioLabel(t.prioridad)}</td><td>${t.estado}</td></tr>`).join('')}</table>
    <h2>Responsables</h2><table><tr><th>Responsable</th><th>Abiertas</th><th>Completadas</th><th>Vencidas</th></tr>${Object.entries(porResp).map(([id,v])=>`<tr><td>${esc(pName(id))}</td><td>${v.a}</td><td>${v.c}</td><td>${v.v}</td></tr>`).join('')}</table>
    <h2>Vencimientos</h2>${li(vencs.map(v=>`${fmtFecha(v.f)} · ${v.l}`))}
    <h2>Alertas</h2>${li(alertasCaso(c).filter(a=>a.nivel!=='verde').map(a=>`${a.tipo}: ${a.texto}`))}`;
}
function exportWord(html, name){
  const doc = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><style>${REPORT_CSS}</style></head><body>${html}</body></html>`;
  cpDownload(new Blob(['﻿', doc], {type:'application/msword'}), name + '.doc');
}
function exportPdf(html, title){
  const w = window.open('', '_blank');
  if(!w){ showToast('Permite ventanas emergentes para exportar a PDF.'); return false; }
  w.document.write(`<html><head><meta charset="utf-8"><title>${esc(title)}</title><style>${REPORT_CSS}</style></head><body>${html}<script>window.onload=function(){window.print();}<\/script></body></html>`);
  w.document.close(); return true;
}
function renderReportes(c){
  const R = cpState.rep, P = document.getElementById('cpReportes');
  if(!can('reportes')){ P.innerHTML = '<div class="empty">Tu rol no tiene acceso a reportes.</div>'; return; }
  const clienteInvalido = R.aud==='cliente' && R.tipo!=='ejecutivo';
  P.innerHTML = `
    <div class="report-types">${REPORT_TIPOS.map(t=>`<button class="ai-agent ${R.tipo===t.id?'on':''}" data-rt="${t.id}"><b>${t.label}</b><span>${t.desc}</span></button>`).join('')}</div>
    <div class="filter-row">
      <label class="small muted">Destinatario</label><select id="rpAud">${opts(REPORT_AUD, R.aud)}</select>
      <button class="btn primary" id="rpGen" ${clienteInvalido?'disabled':''}>Generar reporte</button>
      ${clienteInvalido?'<span class="small" style="color:var(--danger);">Al cliente solo se le entrega el reporte ejecutivo en versión autorizada.</span>':''}
    </div>
    <div class="grid-21" style="align-items:start;">
      <div id="rpPreview">${R.html ? `<div class="fi-actions" style="margin:0 0 12px;">
          <button class="btn" id="rpWord">Exportar a Word</button><button class="btn" id="rpPdf">Exportar a PDF</button>
          ${R.aud==='cliente' ? (can('autorizarCliente') ? (c.config.visibleCliente ? '<button class="btn primary" id="rpAut">Autorizar para el cliente</button>' : '<span class="small muted">El caso no tiene habilitada la visibilidad para el cliente (Editar caso → Configuración).</span>') : '<span class="small muted">La autorización para el cliente la otorga el Director o el Socio.</span>') : ''}
        </div><div class="report-paper">${R.html}</div>` : '<div class="empty">Selecciona el tipo de reporte y el destinatario, y pulsa “Generar reporte”. Solo se incluyen resultados de IA aprobados.</div>'}</div>
      <div class="panel"><div class="panel-head"><h3>Historial</h3></div>
        <div class="stack" style="gap:8px;">
          ${c.reportesCliente.map(r=>`<div class="hist-item" data-rc="${r.id}"><div><b class="small">${esc(r.titulo)}</b><div class="muted small">${fmtFechaHora(r.ts)} · ${esc(pName(r.por))}</div></div><span class="tag ok">Autorizado cliente</span></div>`).join('')}
          ${c.reportes.slice().reverse().map(r=>`<div class="hist-item" style="cursor:default;"><div><b class="small">${REPORT_TIPOS.find(t=>t.id===r.tipo).label}</b><div class="muted small">${fmtFechaHora(r.ts)} · ${esc(pName(r.por))} · ${REPORT_AUD.find(a=>a.id===r.aud).label}</div></div><span class="tag">${r.exportado?'Exportado':'Generado'}</span></div>`).join('')}
          ${!c.reportesCliente.length && !c.reportes.length ? '<div class="empty">Sin reportes.</div>' : ''}
        </div></div>
    </div>`;
  P.querySelectorAll('[data-rt]').forEach(b=> b.addEventListener('click', ()=>{ R.tipo=b.dataset.rt; R.html=null; renderReportes(c); }));
  P.querySelector('#rpAud').addEventListener('change', e=>{ R.aud=e.target.value; R.html=null; renderReportes(c); });
  P.querySelector('#rpGen').addEventListener('click', ()=>{
    R.html = buildReportHtml(c, R.tipo, R.aud);
    const rep = {id:uid('REP'), tipo:R.tipo, aud:R.aud, ts:nowIso(), por:currentUser().id, exportado:false};
    c.reportes.push(rep); R.id = rep.id;
    logAudit(c, 'Generación de reporte', 'Report', rep.id, `${REPORT_TIPOS.find(t=>t.id===R.tipo).label} · ${REPORT_AUD.find(a=>a.id===R.aud).label}`);
    renderReportes(c);
  });
  const nombre = `${c.id}_${R.tipo}_${R.aud}_${isoDate(CP_HOY)}`;
  const marcar = fmt => { const r=c.reportes.find(x=>x.id===R.id); if(r) r.exportado=true; logAudit(c, 'Exportación de reporte', 'Report', R.id||'—', `${REPORT_TIPOS.find(t=>t.id===R.tipo).label} · ${fmt}`); renderReportes(c); };
  P.querySelector('#rpWord')?.addEventListener('click', ()=>{ exportWord(R.html, nombre); marcar('Word'); });
  P.querySelector('#rpPdf')?.addEventListener('click', ()=>{ if(exportPdf(R.html, nombre)) marcar('PDF'); });
  P.querySelector('#rpAut')?.addEventListener('click', ()=>{
    const r = {id:uid('REP'), tipo:'ejecutivo', titulo:`Reporte de avance · ${fmtFecha(isoDate(CP_HOY))}`, ts:nowIso(), por:currentUser().id, html:R.html};
    c.reportesCliente.unshift(r);
    logAudit(c, 'Reporte autorizado para cliente', 'Report', r.id, r.titulo);
    refreshCase(); showToast('Reporte publicado en el portal del cliente.');
  });
  P.querySelectorAll('[data-rc]').forEach(el=> el.addEventListener('click', ()=>{ const r=c.reportesCliente.find(x=>x.id===el.dataset.rc); openCpDrawer('Reporte autorizado · '+c.id, r.titulo, `<div class="report-paper" style="padding:18px;">${r.html}</div>`); }));
}

/* ---------- PESTAÑA · AUDITORÍA ---------- */
function renderAuditoria(c){
  const A = cpState.audit, P = document.getElementById('cpAuditoria');
  if(!can('auditoria')){ P.innerHTML = '<div class="empty">Tu rol no tiene acceso a la auditoría.</div>'; return; }
  const acciones = [...new Set(c.auditoria.map(a=>a.accion))].sort();
  const q = A.q.toLowerCase();
  const list = c.auditoria.filter(a=> (!A.accion || a.accion===A.accion) && (!A.entidad || a.entidad===A.entidad) && (!q || [a.usuario,a.accion,a.detalle,a.entidadId].join(' ').toLowerCase().includes(q))).slice().sort((a,b)=>b.ts.localeCompare(a.ts));
  P.innerHTML = `
    <div class="section-sub"><div><h3>Auditoría del caso</h3><p class="muted small" style="margin:2px 0 0;">¿Quién hizo qué, cuándo y sobre qué información? Registro inmutable de creación, ediciones, estados, accesos, descargas, documentos, IA, aprobaciones y exportaciones.</p></div>
      <button class="btn" id="auExport">Exportar auditoría (CSV)</button></div>
    <div class="filter-row">
      <select id="auAcc">${opts(acciones, A.accion, 'Todas las acciones')}</select>
      <select id="auEnt">${opts(Object.entries(ENT_LABEL).map(([id,label])=>({id,label})), A.entidad, 'Todas las entidades')}</select>
      <input id="auQ" placeholder="Buscar usuario, detalle o registro..." value="${esc(A.q)}" style="min-width:260px;">
      <span class="muted small">${list.length} evento(s)</span>
    </div>
    <div class="matriz-wrap table-scroll"><table class="matriz" style="min-width:980px;">
      <thead><tr><th>Fecha y hora</th><th>Usuario</th><th>Acción</th><th>Entidad</th><th>Registro afectado</th><th>Detalle / metadata</th></tr></thead>
      <tbody>${list.map(a=>`<tr><td style="white-space:nowrap;">${fmtFechaHora(a.ts)}</td><td><b>${esc(a.usuario)}</b><span class="sub">${esc(a.rol)}</span></td><td>${esc(a.accion)}</td><td>${ENT_LABEL[a.entidad]||a.entidad}</td><td style="font-family:monospace;font-size:11.5px;">${esc(a.entidadId)}</td>
        <td class="small" style="max-width:320px;">${esc(a.detalle)}${Object.keys(a.meta||{}).length?`<span class="sub">${Object.entries(a.meta).map(([k,v])=>`${esc(k)}: ${esc(v)}`).join(' · ')}</span>`:''}</td></tr>`).join('') || '<tr><td colspan="6"><div class="empty">Sin eventos.</div></td></tr>'}</tbody></table></div>`;
  P.querySelector('#auAcc').addEventListener('change', e=>{ A.accion=e.target.value; renderAuditoria(c); });
  P.querySelector('#auEnt').addEventListener('change', e=>{ A.entidad=e.target.value; renderAuditoria(c); });
  P.querySelector('#auQ').addEventListener('change', e=>{ A.q=e.target.value; renderAuditoria(c); });
  P.querySelector('#auExport').addEventListener('click', ()=>{
    const rows = [['Fecha','Usuario','Rol','Acción','Entidad','Registro','Detalle'], ...list.map(a=>[a.ts, a.usuario, a.rol, a.accion, ENT_LABEL[a.entidad]||a.entidad, a.entidadId, a.detalle])];
    cpDownload(new Blob(['﻿'+rows.map(r=>r.map(csvCell).join(';')).join('\n')], {type:'text/csv;charset=utf-8'}), `auditoria_${c.id}_${isoDate(CP_HOY)}.csv`);
    logAudit(c, 'Exportación de auditoría', 'Case', c.id, `${list.length} eventos exportados (CSV)`);
    renderAuditoria(c);
  });
}

/* ============================================================
   VISTA · ALERTAS (próximas / vencidas / críticas)
   ============================================================ */
function renderAlertasView(){
  if(currentRoleId==='cliente'){ renderAlertasCliente(); return; }
  const all = casosVisibles().flatMap(c=> alertasCaso(c).map(a=>({...a, c})));
  const grupos = {
    criticas:{label:'Críticas', list:all.filter(a=>a.nivel==='rojo'), cls:'danger'},
    vencidas:{label:'Vencidas', list:all.filter(a=>a.fecha && diasHasta(a.fecha)<0 && a.nivel!=='verde'), cls:'danger'},
    proximas:{label:'Próximas (15 días)', list:all.filter(a=>a.fecha && diasHasta(a.fecha)>=0 && diasHasta(a.fecha)<=15 && a.nivel!=='verde'), cls:'warn'},
    todas:{label:'Todas', list:all, cls:''},
  };
  document.getElementById('alKpis').innerHTML = Object.entries(grupos).map(([k,g])=>`<button class="kpi ${g.cls} ${cpState.alertTab===k?'on':''}" data-al="${k}"><b>${g.list.length}</b><span>${g.label}</span></button>`).join('');
  document.getElementById('alTabs').innerHTML = Object.entries(grupos).map(([k,g])=>`<button class="tab ${cpState.alertTab===k?'active':''}" data-al="${k}">${g.label}<span class="tc ${k!=='todas'&&g.list.length?'alert':''}">${g.list.length}</span></button>`).join('');
  const g = grupos[cpState.alertTab];
  const L = document.getElementById('alList');
  L.innerHTML = `<div class="alert-list">${g.list.map(a=>alertItemHtml(a, true)).join('') || '<div class="empty">No hay alertas en esta categoría.</div>'}</div>
    <p class="muted small" style="margin-top:14px;">🔴 Crítico · 🟠 Pendiente / próximo · 🟡 Sin clasificar o por revisar · 🟢 Completado. Haz clic en una alerta para abrir el caso en la pestaña correspondiente.</p>`;
  document.querySelectorAll('#view-alertas [data-al]').forEach(b=> b.addEventListener('click', ()=>{ cpState.alertTab=b.dataset.al; renderAlertasView(); }));
  bindAlertClicks(L);
}
/* Vista de alertas para el rol Cliente: solo sus documentos/solicitudes pendientes */
function renderAlertasCliente(){
  const casos = casosVisibles();
  const items = casos.flatMap(c=> c.solicitudes.filter(s=>s.estado==='pendiente').map(s=>{
    const d = diasHasta(s.limite);
    return {nivel: d<0 ? 'rojo' : 'naranja', tipo:'Documento pendiente', texto:`${s.doc} · ${d<0?'Plazo vencido':'Plazo: '+fmtFecha(s.limite)}`, fecha:s.limite, c};
  }));
  document.getElementById('alKpis').innerHTML = `<div class="kpi ${items.length?'danger':''}"><b>${items.length}</b><span>Documentos pendientes</span></div>`;
  document.getElementById('alTabs').innerHTML = '';
  const L = document.getElementById('alList');
  L.innerHTML = `<div class="alert-list">${items.map(a=>alertItemHtml(a, casos.length>1)).join('') || '<div class="empty">No tienes documentos ni solicitudes pendientes.</div>'}</div>
    ${items.length?'<p class="muted small" style="margin-top:14px;">Haz clic en una solicitud para ir a tu caso y cargar el documento.</p>':''}`;
  L.querySelectorAll('.alert-item').forEach(el=> el.addEventListener('click', ()=>{
    if(el.dataset.case && el.dataset.case!==currentCaseId){ currentCaseId = el.dataset.case; renderCaseChip(); }
    goView('casos');
  }));
}

/* ============================================================
   VISTA EJECUTIVA (Socio / Director)
   ============================================================ */
function decisionesPendientes(){
  const out = [];
  casosVisibles().forEach(c=>{
    if(c.wf==='revision') out.push({c, txt:'Aprobar la estrategia del caso', tab:'resumen', btn: WF_ACTION.revision.roles.includes(currentRoleId) ? 'Revisar y aprobar' : 'Ver'});
    c.ia.filter(a=>a.estado==='pendiente').forEach(a=> out.push({c, txt:`Revisar ${AGENTS[a.agentId].nombre}`, tab:'ia', ref:a.id, btn:'Revisar análisis'}));
    if(c.wf==='aprobado' && !validacionesTransicion(c).bloqueado) out.push({c, txt:'Listo para cierre (sin pendientes críticos)', tab:'resumen', btn:'Cerrar caso'});
  });
  return out;
}
function renderEjecutiva(){
  const B = document.getElementById('exBody');
  if(!can('ejecutiva')){ B.innerHTML = '<div class="empty">La vista ejecutiva está disponible para Socio y Director.</div>'; return; }
  const vis = casosVisibles(), act = vis.filter(esActivo);
  const avg = act.length ? Math.round(act.reduce((s,c)=>s+c.progreso,0)/act.length) : 0;
  const crit = act.filter(esCritico);
  const dec = decisionesPendientes();
  const tVenc = act.flatMap(c=>c.tareas.filter(t=>t.estado!=='Completada' && diasHasta(t.fecha)<0));
  const iaP = vis.reduce((s,c)=>s+c.ia.filter(a=>a.estado==='pendiente').length,0);
  const prod = {}; vis.forEach(c=> c.tareas.forEach(t=>{ prod[t.resp]=prod[t.resp]||{c:0,a:0,v:0}; if(t.estado==='Completada') prod[t.resp].c++; else { prod[t.resp].a++; if(diasHasta(t.fecha)<0) prod[t.resp].v++; } }));
  B.innerHTML = `
    <div class="ex-dashboard">
    <div class="kpi-grid">
      <div class="kpi"><b>${act.length}</b><span>Casos activos</span></div>
      <div class="kpi accent"><b>${avg}%</b><span>Avance promedio</span></div>
      <div class="kpi danger"><b>${crit.length}</b><span>Casos críticos</span></div>
      <div class="kpi warn"><b>${dec.length}</b><span>Decisiones pendientes</span></div>
      <div class="kpi danger"><b>${tVenc.length}</b><span>Tareas vencidas</span></div>
      <div class="kpi accent"><b>${iaP}</b><span>IA pendiente de revisión</span></div>
    </div>
    <div class="ex-row">
      <div class="panel"><div class="panel-head"><h3>Avance por caso</h3></div>
        <div class="ex-panel-body">${vis.map(c=>`<div class="bar-row" data-open="${c.id}"><span class="bar-name">${c.id} · ${esc(c.cliente)}</span><span class="bar-track"><i class="${c.progreso>=100?'ok':c.riesgo==='critico'?'danger':''}" style="width:${c.progreso}%"></i></span><span class="small muted">${c.progreso}%</span></div>`).join('')}</div>
      </div>
      <div class="panel"><div class="panel-head"><h3>Riesgos (casos activos)</h3></div>
        <div class="ex-panel-body">
          <div class="risk-matrix">${RIESGOS.map(r=>`<div class="risk-cell ${r.id}"><b>${act.filter(c=>c.riesgo===r.id).length}</b><span>${r.label}</span></div>`).join('')}</div>
          <div style="margin-top:12px;">${act.map(c=>`<div class="decision"><span>${c.id} · ${esc(c.cliente)}</span>${riskPill(c.riesgo)}</div>`).join('')}</div>
        </div>
      </div>
    </div>
    <div class="ex-row ex-row-3">
      <div class="panel"><div class="panel-head"><h3>Casos críticos</h3><span class="muted small">${crit.length}</span></div>
        <div class="ex-panel-body">${crit.map(c=>`<div style="margin-bottom:12px;"><div class="decision" style="border:none;padding-bottom:4px;"><b>${c.id} · ${esc(c.cliente)}</b><button class="btn sm" data-open="${c.id}">Abrir</button></div>
          <div class="alert-list">${alertasCaso(c).filter(a=>a.nivel==='rojo').slice(0,3).map(a=>alertItemHtml({...a,c})).join('') || `<div class="alert-item"><span class="a-dot rojo"></span><div class="a-body">Riesgo ${riskLabel(c.riesgo)}</div></div>`}</div></div>`).join('') || '<div class="empty">Sin casos críticos.</div>'}</div>
      </div>
      <div class="panel"><div class="panel-head"><h3>Decisiones pendientes</h3><span class="muted small">${dec.length}</span></div>
        <div class="ex-panel-body">${dec.map((d,i)=>`<div class="decision"><div><b class="small">${d.c.id} · ${esc(d.c.cliente)}</b><div class="small">${esc(d.txt)}</div></div><button class="btn sm primary" data-dec="${i}">${d.btn}</button></div>`).join('') || '<div class="empty">Sin decisiones pendientes.</div>'}</div>
      </div>
      <div class="panel"><div class="panel-head"><h3>Productividad</h3><span class="muted small">Tareas por responsable</span></div>
        <div class="ex-panel-body">${Object.entries(prod).map(([id,v])=>{ const tot=v.a+v.c; return `<div class="bar-row" style="cursor:default;"><span class="bar-name">${esc(pName(id))}</span><span class="bar-track"><i class="ok" style="width:${tot?Math.round(v.c/tot*100):0}%"></i></span><span class="small muted">${v.c}/${tot}</span></div>${v.v?`<div class="small" style="color:var(--danger);margin:-4px 0 6px;">${v.v} vencida(s)</div>`:''}`; }).join('')}</div>
      </div>
    </div>
    </div>`;
  B.querySelectorAll('[data-open]').forEach(el=> el.addEventListener('click', ()=> abrirCasoEn(el.dataset.open, 'resumen')));
  B.querySelectorAll('[data-dec]').forEach(el=> el.addEventListener('click', ()=>{ const d=dec[+el.dataset.dec]; abrirCasoEn(d.c.id, d.tab, d.ref); }));
  bindAlertClicks(B);
}
function exportEjecutiva(){
  const vis = casosVisibles(), act = vis.filter(esActivo), dec = decisionesPendientes();
  const html = `<h1>Resumen ejecutivo · Módulo 02 Casos Penales</h1><div class="rp-meta">Generado el ${fmtFechaHora(nowIso())} por ${esc(currentUser().nombre)} (${currentRole().nombre})</div>
    <h2>Indicadores</h2><p>Casos activos: ${act.length} · Casos críticos: ${act.filter(esCritico).length} · Decisiones pendientes: ${dec.length}</p>
    <h2>Casos</h2><table><tr><th>Caso</th><th>Cliente</th><th>Estado</th><th>Etapa</th><th>Riesgo</th><th>Avance</th></tr>${vis.map(c=>`<tr><td>${c.id}</td><td>${esc(c.cliente)}</td><td>${wfLabel(c.wf)}</td><td>${esc(c.etapa)}</td><td>${riskLabel(c.riesgo)}</td><td>${c.progreso}%</td></tr>`).join('')}</table>
    <h2>Decisiones pendientes</h2><ul>${dec.map(d=>`<li>${d.c.id} · ${esc(d.txt)}</li>`).join('')||'<li>—</li>'}</ul>`;
  exportWord(html, `resumen_ejecutivo_${isoDate(CP_HOY)}`);
  showToast('Resumen ejecutivo exportado.');
}

/* ============================================================
   VISTA RESTRINGIDA · CLIENTE EXTERNO
   ============================================================ */
function renderClientePortal(){
  document.getElementById('casosListWrap').style.display='none';
  document.getElementById('casoDetailWrap').style.display='none';
  const W = document.getElementById('clientePortalWrap'); W.style.display='block';
  const casos = casosVisibles();
  if(!casos.length){ W.innerHTML = '<div class="empty">No tienes casos con información autorizada.</div>'; return; }
  if(!casos.includes(currentCase())){ currentCaseId = casos[0].id; renderCaseChip(); }
  const c = currentCase();
  registrarAcceso(c);
  const avances = c.actuaciones.filter(a=>a.compartirCliente).sort((a,b)=>b.fecha.localeCompare(a.fecha));
  const docs = c.documentos.filter(d=>d.compartidoCliente);
  const h = c.fechas.proximoHito;
  W.innerHTML = `
    <div class="portal-hero"><div><span class="ph-k">Portal del cliente · Mi caso</span><h2>${esc(c.cliente)}</h2><p>${c.id} · ${esc(c.tipo)}</p></div>
      ${casos.length>1?`<select id="pcCase">${casos.map(x=>`<option value="${x.id}" ${x.id===c.id?'selected':''}>${x.id} · ${esc(x.cliente)}</option>`).join('')}</select>`:''}</div>
    <div class="notice">${I('shield')}<span>Solo ves información <b>autorizada</b> por el equipo jurídico. La estrategia interna, los análisis de IA, la auditoría y los documentos reservados no están disponibles en este portal.</span></div>
    <div class="grid-3" style="margin-bottom:16px;">
      <div class="panel"><div class="panel-head"><h3>Estado</h3>${wfBadge(c.wf)}</div>
        <p style="font-size:13.2px;line-height:1.55;margin:0 0 10px;">${WF_CLIENTE_TXT[c.wf]||''}</p>
        <dl class="kv" style="grid-template-columns:110px 1fr;"><dt>Etapa</dt><dd>${esc(c.etapa)}</dd><dt>Abogado</dt><dd>${esc(pName(c.resp.abogado))}</dd>${h&&h.label?`<dt>Próximo paso</dt><dd>${esc(h.label)} · ${fmtFecha(h.fecha)}</dd>`:''}</dl>
        <div class="portal-progress"><i style="width:${c.progreso}%"></i></div><span class="small muted">Avance general ${c.progreso}%</span>
      </div>
      <div class="panel"><div class="panel-head"><h3>Documentos solicitados</h3></div>
        ${c.solicitudes.map(s=>`<div class="file-row"><div><b class="small">${esc(s.doc)}</b><div class="small muted">${s.estado==='pendiente'?`Plazo: ${fmtFecha(s.limite)}`:'Entregado'}</div></div>
          ${s.estado==='pendiente' && editable(c) ? `<label class="btn sm primary" style="cursor:pointer;">Cargar<input type="file" data-sol="${s.id}" style="display:none;"></label>` : `<span class="tag ok">Entregado</span>`}</div>`).join('') || '<p class="muted small" style="margin:0;">No hay solicitudes de documentos.</p>'}
      </div>
      <div class="panel"><div class="panel-head"><h3>Asistente</h3></div>
        <p class="small" style="margin:0 0 12px;line-height:1.55;">Pregunta en lenguaje claro qué documentos ya se incorporaron y cuáles faltan. El asistente solo usa información autorizada.</p>
        <button class="btn primary sm" id="pcChat">Preguntar al Agente Probatorio</button>
      </div>
    </div>
    <div class="grid-2" style="margin-bottom:16px;">
      <div class="panel"><div class="panel-head"><h3>Avances autorizados</h3></div>
        <ul class="timeline">${avances.map(a=>`<li><time>${fmtFecha(a.fecha)}</time><div><b>${esc(a.titulo)}</b><div class="small muted">${a.estado==='Realizada'?esc(a.resultado):a.estado}</div></div></li>`).join('') || '<li><span class="muted small">Sin avances publicados todavía.</span></li>'}</ul>
      </div>
      <div class="panel"><div class="panel-head"><h3>Reportes autorizados</h3></div>
        ${c.reportesCliente.map(r=>`<div class="file-row"><div class="fr-name">${I('file')}<span>${esc(r.titulo)}</span></div><div class="row-actions"><span class="small muted">${fmtFecha(r.ts)}</span><button class="link-btn" data-rv="${r.id}">Ver</button><button class="link-btn" data-rw="${r.id}">Word</button><button class="link-btn" data-rp="${r.id}">PDF</button></div></div>`).join('') || '<p class="muted small" style="margin:0;">Aún no hay reportes autorizados.</p>'}
      </div>
    </div>
    <div class="panel"><div class="panel-head"><h3>Documentos compartidos</h3></div>
      ${docs.map(d=>`<div class="file-row"><div class="fr-name">${I('file')}<span>${esc(d.nombre)}</span></div><div class="row-actions"><span class="small muted">v${d.version} · ${fmtFecha(d.fecha)}</span><button class="link-btn" data-dd="${d.id}">Descargar</button></div></div>`).join('') || '<p class="muted small" style="margin:0;">No hay documentos compartidos.</p>'}
    </div>`;
  W.querySelector('#pcCase')?.addEventListener('change', e=>{ currentCaseId=e.target.value; renderCaseChip(); renderClientePortal(); });
  W.querySelector('#pcChat').addEventListener('click', ()=> activateAgent('probatorio'));
  W.querySelectorAll('[data-rv]').forEach(b=> b.addEventListener('click', ()=>{ const r=c.reportesCliente.find(x=>x.id===b.dataset.rv); logAudit(c,'Consulta de reporte (cliente)','Report',r.id,r.titulo); openCpDrawer('Reporte autorizado', r.titulo, `<div class="report-paper" style="padding:18px;">${r.html}</div>`); }));
  W.querySelectorAll('[data-rw]').forEach(b=> b.addEventListener('click', ()=>{ const r=c.reportesCliente.find(x=>x.id===b.dataset.rw); exportWord(r.html, `${c.id}_reporte_cliente`); logAudit(c,'Descarga de reporte (cliente)','Report',r.id,`${r.titulo} · Word`); }));
  W.querySelectorAll('[data-rp]').forEach(b=> b.addEventListener('click', ()=>{ const r=c.reportesCliente.find(x=>x.id===b.dataset.rp); if(exportPdf(r.html, r.titulo)) logAudit(c,'Descarga de reporte (cliente)','Report',r.id,`${r.titulo} · PDF`); }));
  W.querySelectorAll('[data-dd]').forEach(b=> b.addEventListener('click', ()=> descargarDoc(c, c.documentos.find(d=>d.id===b.dataset.dd))));
  W.querySelectorAll('[data-sol]').forEach(inp=> inp.addEventListener('change', async ()=>{
    const file = inp.files[0]; if(!file) return;
    const s = c.solicitudes.find(x=>x.id===inp.dataset.sol);
    const checksum = await sha256(file);
    const id = `DOC-${c.id.slice(-4)}-C${Math.random().toString(36).slice(2,5).toUpperCase()}`;
    const d = {id, nombre:file.name, tipo:tipoDesdeNombre(file.name), categoria:'Aportado por el cliente', fecha:isoDate(CP_HOY), version:1,
      versiones:[{v:1, ts:nowIso(), por:'u-cli', checksum, size:file.size}], sensibilidad:'Confidencial', descripcion:`Aportado por el cliente para: ${s.doc}`,
      storage_url:`repositorio://expedientes/${c.id}/${id}/v1/${file.name}`, checksum, size:file.size, cargadoPor:'u-cli', estadoIA:'En cola OCR/IA', compartidoCliente:false};
    c.documentos.push(d);
    s.estado = 'entregado'; s.docId = id;
    logAudit(c, 'Carga de documento (cliente)', 'Document', id, `${file.name} · respuesta a: ${s.doc}`, {checksum:checksum.slice(0,16)+'…'});
    const ev = c.matriz.find(m=>m.id===s.evId);
    if(ev && ev.estado==='pendiente'){ ev.estado='revision'; ev.docId=id; ev.obs = `Cargado por el cliente el ${fmtFecha(isoDate(CP_HOY))}; pendiente de validación.`; logAudit(c,'Actualización de evidencia','Evidence',ev.id,'Pendiente de recaudo → En revisión (documento aportado por el cliente)'); }
    const t = c.tareas.find(x=>x.id===s.taskId);
    if(t && t.estado==='Bloqueada'){ t.estado='Pendiente'; t.comentarios.push({por:'u-cli', ts:nowIso(), texto:`El cliente cargó «${file.name}».`}); }
    programarOCR(c, d);
    c.ultimaActividad = 'Hoy';
    updateBell(); renderClientePortal(); renderCaseChip();
    showToast('Documento enviado al equipo jurídico.');
  }));
}

/* ============================================================
   CAMBIO DE ROL (invocado desde setRole en modulo02.js)
   ============================================================ */
function onRoleChangeCP(){
  const esCliente = currentRoleId==='cliente';
  setSlot('icon-slot-casos', I('folder') + `<span>${esCliente ? 'Mi caso' : 'Casos Penales'}</span>`);
  document.getElementById('icon-slot-ejecutiva').classList.toggle('hidden-by-role', !can('ejecutiva'));
  updateBell();
  if(currentView==='ejecutiva' && !can('ejecutiva')){ goView('casos'); return; }
  if(currentView==='casos'){
    const detalle = document.getElementById('casoDetailWrap').style.display!=='none';
    if(detalle && !esCliente && casosVisibles().includes(currentCase())){
      if(!tabsParaRol().includes(cpState.tab)) cpState.tab='resumen';
      resetIAState(currentCase()); renderDetail();
    } else backToCasosList();
  }
  if(currentView==='alertas') renderAlertasView();
  if(currentView==='ejecutiva') renderEjecutiva();
}

/* ============================================================
   INICIALIZACIÓN (invocada desde main.js antes de init())
   ============================================================ */
function initCasosPenales(){
  cpSeedData();
  setSlot('icon-slot-ejecutiva', I('chart') + '<span>Vista ejecutiva</span>');
  setSlot('icon-slot-cpsearch', I('search'));
  setSlot('btnSalir', I('logout') + '<span>Salir</span>');
  document.getElementById('btnSalir').addEventListener('click', ()=>{
    try{ sessionStorage.removeItem('pc_rol'); }catch(e){}
    location.href = '../index.html';
  });
  buildFiltersUI();

  document.getElementById('cpBtnNuevo').addEventListener('click', ()=> openCaseForm());
  document.getElementById('cpBtnEditar').addEventListener('click', ()=> openCaseForm(currentCase()));
  document.getElementById('cpBtnExport').addEventListener('click', exportCasosCsv);
  document.getElementById('exBtnExport').addEventListener('click', exportEjecutiva);
  document.getElementById('cpBtnFiltros').addEventListener('click', ()=>{ const f=document.getElementById('cpFilters'); f.style.display = f.style.display==='none' ? 'grid' : 'none'; });
  document.getElementById('cpBtnLimpiar').addEventListener('click', ()=>{
    cpState.search=''; cpState.quick=''; Object.keys(cpState.filtros).forEach(k=>cpState.filtros[k]='');
    document.getElementById('cpSearch').value=''; document.querySelectorAll('#cpFilters select').forEach(s=>s.value='');
    buildCasosList();
  });
  document.getElementById('cpSearch').addEventListener('input', e=>{ cpState.search=e.target.value; buildCasosList(); });
  document.querySelectorAll('#cpViewMode button').forEach(b=> b.addEventListener('click', ()=>{ cpState.mode=b.dataset.mode; buildCasosList(); }));
  document.getElementById('btnAddEvidencia').addEventListener('click', prepararModalEvidencia);

  const focoBusqueda = ()=>{ goView('casos'); setTimeout(()=> document.getElementById('cpSearch')?.focus(), 50); };
  document.getElementById('icon-slot-search').addEventListener('click', focoBusqueda);
  document.getElementById('icon-slot-tbsearch').addEventListener('click', focoBusqueda);
  document.getElementById('icon-slot-tbbell').addEventListener('click', ()=> goView('alertas'));
  document.addEventListener('keydown', e=>{ if(e.key==='Escape'){ closeModal(); closeCpDrawer(); } });
}
