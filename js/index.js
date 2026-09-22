/* ============================================================
   PRÍAS CADAVID · LEGALTECH — ENTRADA DE LA PLATAFORMA
   Login → Autorización → entra directo al Módulo 02
   ============================================================ */
const PERFILES = [
  {rol:'socio', nombre:'Juliana Restrepo', ini:'JR', rolNombre:'Socio', email:'juliana.restrepo@priascadavid.com', desc:'Supervisa, consulta indicadores y riesgos, y aprueba decisiones estratégicas.',
   permisos:['Lectura global','Reportes','Aprobaciones'], casos:'Todos los casos', vista:'ejecutiva'},
  {rol:'director', nombre:'Martín Gaviria', ini:'MG', rolNombre:'Director', email:'martin.gaviria@priascadavid.com', desc:'Coordina el caso, asigna responsables, revisa y aprueba.',
   permisos:['Crear','Editar','Asignar','Revisar','Aprobar'], casos:'Todos los casos', vista:'casos'},
  {rol:'abogado', nombre:'Laura Ospina', ini:'LO', rolNombre:'Abogado', email:'laura.ospina@priascadavid.com', desc:'Ejecuta el trabajo jurídico: documentos, pruebas, actuaciones e IA.',
   permisos:['Crear/editar asignados','Cargar documentos','Revisar IA'], casos:'Casos asignados a su equipo', vista:'casos'},
  {rol:'administrativo', nombre:'Andrés Molina', ini:'AM', rolNombre:'Administrativo', email:'andres.molina@priascadavid.com', desc:'Carga documentos y presta soporte operativo.',
   permisos:['Carga documental','Consulta limitada'], casos:'Casos autorizados', vista:'casos'},
  {rol:'cliente', nombre:'Constructora Andina S.A.S.', ini:'CL', rolNombre:'Cliente externo', email:'contacto@constructoraandina.com', desc:'Consulta únicamente información autorizada por el equipo jurídico.',
   permisos:['Lectura restringida','Descarga controlada'], casos:'Solo su caso (información autorizada)', vista:'casos'},
];
const SENSIBILIDAD = {socio:'Interna · Confidencial · Reservada', director:'Interna · Confidencial · Reservada', abogado:'Interna · Confidencial · Reservada (casos asignados)', administrativo:'Interna · Confidencial', cliente:'Solo información autorizada'};

const $ = id => document.getElementById(id);
let perfil = null;

function show(step){ document.querySelectorAll('.step').forEach(s=>s.classList.toggle('active', s.id===step)); window.scrollTo({top:0}); }

function renderDemoAccounts(){
  $('demoGrid').innerHTML = PERFILES.map(p=>`
    <button type="button" class="demo-chip" data-email="${p.email}"><b>${p.rolNombre}</b>· ${p.email}</button>`).join('');
  document.querySelectorAll('.demo-chip').forEach(b=> b.addEventListener('click', ()=>{
    $('loginEmail').value = b.dataset.email;
    $('loginPassword').value = 'demo123';
    $('loginEmail').classList.remove('invalid'); $('loginPassword').classList.remove('invalid');
    $('loginError').hidden = true;
  }));
}

function mostrarErrorLogin(msg){
  $('loginError').textContent = msg; $('loginError').hidden = false;
}

$('loginForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  const email = $('loginEmail').value.trim().toLowerCase();
  const password = $('loginPassword').value;
  $('loginEmail').classList.remove('invalid'); $('loginPassword').classList.remove('invalid');
  if(!email){ $('loginEmail').classList.add('invalid'); mostrarErrorLogin('Ingresa tu correo corporativo.'); return; }
  if(!password){ $('loginPassword').classList.add('invalid'); mostrarErrorLogin('Ingresa tu contraseña.'); return; }
  const p = PERFILES.find(x=> x.email.toLowerCase()===email);
  if(!p){ $('loginEmail').classList.add('invalid'); mostrarErrorLogin('Credenciales no válidas. Verifica el correo e intenta de nuevo.'); return; }
  $('loginError').hidden = true;
  login(p.rol);
});

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

renderDemoAccounts();
(function restaurarSesion(){
  let rol = null;
  try{ rol = sessionStorage.getItem('pc_rol'); }catch(e){}
  if(rol && PERFILES.some(p=>p.rol===rol)){ perfil = PERFILES.find(p=>p.rol===rol); entrarAlModulo(); }
})();
