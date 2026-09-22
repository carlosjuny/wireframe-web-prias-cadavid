/* ============================================================
   PRÍAS CADAVID · LEGALTECH — ENTRADA DE LA PLATAFORMA
   Login → Autorización → entra directo al Módulo 02
   ============================================================ */
const PERFILES = [
  {rol:'socio', nombre:'Juliana Restrepo', ini:'JR', rolNombre:'Socio', desc:'Supervisa, consulta indicadores y riesgos, y aprueba decisiones estratégicas.',
   permisos:['Lectura global','Reportes','Aprobaciones'], casos:'Todos los casos', vista:'ejecutiva'},
  {rol:'director', nombre:'Martín Gaviria', ini:'MG', rolNombre:'Director', desc:'Coordina el caso, asigna responsables, revisa y aprueba.',
   permisos:['Crear','Editar','Asignar','Revisar','Aprobar'], casos:'Todos los casos', vista:'casos'},
  {rol:'abogado', nombre:'Laura Ospina', ini:'LO', rolNombre:'Abogado', desc:'Ejecuta el trabajo jurídico: documentos, pruebas, actuaciones e IA.',
   permisos:['Crear/editar asignados','Cargar documentos','Revisar IA'], casos:'Casos asignados a su equipo', vista:'casos'},
  {rol:'administrativo', nombre:'Andrés Molina', ini:'AM', rolNombre:'Administrativo', desc:'Carga documentos y presta soporte operativo.',
   permisos:['Carga documental','Consulta limitada'], casos:'Casos autorizados', vista:'casos'},
  {rol:'cliente', nombre:'Constructora Andina S.A.S.', ini:'CL', rolNombre:'Cliente externo', desc:'Consulta únicamente información autorizada por el equipo jurídico.',
   permisos:['Lectura restringida','Descarga controlada'], casos:'Solo su caso (información autorizada)', vista:'casos'},
];
const SENSIBILIDAD = {socio:'Interna · Confidencial · Reservada', director:'Interna · Confidencial · Reservada', abogado:'Interna · Confidencial · Reservada (casos asignados)', administrativo:'Interna · Confidencial', cliente:'Solo información autorizada'};

const $ = id => document.getElementById(id);
let perfil = null;

function show(step){ document.querySelectorAll('.step').forEach(s=>s.classList.toggle('active', s.id===step)); window.scrollTo({top:0}); }

function renderPerfiles(){
  $('profileGrid').innerHTML = PERFILES.map(p=>`
    <button class="profile" data-rol="${p.rol}">
      <span class="avatar">${p.ini}</span>
      <span class="role">${p.rolNombre}</span>
      <b>${p.nombre}</b>
      <p>${p.desc}</p>
    </button>`).join('');
  document.querySelectorAll('.profile').forEach(b=> b.addEventListener('click', ()=> login(b.dataset.rol)));
}

async function login(rol){
  perfil = PERFILES.find(p=>p.rol===rol);
  try{ sessionStorage.setItem('pc_rol', rol); }catch(e){}
  $('authTitle').textContent = `Verificando permisos de ${perfil.nombre}`;
  show('stepAuth');
  const pasos = ['Identificando rol: '+perfil.rolNombre, 'Cargando permisos del rol', 'Validando cliente y equipo asignado', 'Aplicando niveles de sensibilidad', 'Determinando casos disponibles'];
  $('authProc').innerHTML = pasos.map((p,i)=>`<div class="proc-step" data-i="${i}"><i></i><span>${p}</span></div>`).join('');
  for(let i=0;i<pasos.length;i++){
    const el = document.querySelector(`#authProc [data-i="${i}"]`);
    el.classList.add('run'); await new Promise(r=>setTimeout(r, 260));
    el.classList.remove('run'); el.classList.add('done'); el.querySelector('i').textContent = '✓';
  }
  entrarAlModulo();
}

function entrarAlModulo(){
  location.href = `modulo-02/index.html?rol=${perfil.rol}&vista=${perfil.vista}`;
}

renderPerfiles();
(function restaurarSesion(){
  let rol = null;
  try{ rol = sessionStorage.getItem('pc_rol'); }catch(e){}
  if(rol && PERFILES.some(p=>p.rol===rol)){ perfil = PERFILES.find(p=>p.rol===rol); entrarAlModulo(); }
})();
