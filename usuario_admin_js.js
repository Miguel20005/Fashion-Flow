// ====== Bootstrap y util ======
ff_bootstrapDemoData();
const $ = s => document.querySelector(s);

let usuarios = ff_getUsers();
let filtroTexto = "";

// ====== Regiones y Comunas ======
const REGIONES_COMUNAS = {
  "Región Metropolitana de Santiago": ["Santiago","La Florida","Puente Alto","Maipú","Providencia","Ñuñoa","Las Condes"],
  "Valparaíso": ["Valparaíso","Viña del Mar","Quilpué","Villa Alemana","Quillota"],
  "Biobío": ["Concepción","Talcahuano","Hualpén","San Pedro de la Paz","Coronel"],
  "Maule": ["Talca","Curicó","Linares","Cauquenes"],
  "La Araucanía": ["Temuco","Padre Las Casas","Angol","Villarrica","Pucón"]
};

// ====== RUN (Chile) ======
function cleanRun(run){ return (run||"").toUpperCase().replace(/[.\-]/g,""); }

function dvFromNumber(numStr){
  let mul = 2, sum = 0;
  for(let i=numStr.length-1; i>=0; i--){
    sum += parseInt(numStr[i],10) * mul;
    mul = (mul === 7) ? 2 : (mul + 1);
  }
  const res = 11 - (sum % 11);
  if(res === 11) return "0";
  if(res === 10) return "K";
  return String(res);
}

// devuelve {ok:boolean, esperado:string}
function validarRUN(run){
  const r = cleanRun(run);
  if(r.length < 7 || r.length > 9) return { ok:false, esperado:"?" };
  const cuerpo = r.slice(0,-1);
  const dv = r.slice(-1);
  if(!/^\d+$/.test(cuerpo)) return { ok:false, esperado:"?" };
  const esperado = dvFromNumber(cuerpo);
  return { ok: dv === esperado, esperado };
}

// ====== Email dominio ======
const dominiosPermitidos = ["@duoc.cl","@profesor.duoc.cl","@gmail.com"];
function emailPermitido(correo){
  if(!correo) return false;
  const c = correo.toLowerCase();
  return dominiosPermitidos.some(d => c.endsWith(d));
}

// ====== Regiones/comunas (UI) ======
function cargarRegiones(){
  const selRegion = $("#region");
  selRegion.innerHTML = '<option value="">Seleccione…</option>' +
    Object.keys(REGIONES_COMUNAS).map(r=>`<option value="${r}">${r}</option>`).join("");
}
function cargarComunas(regionSeleccionada){
  const selComuna = $("#comuna");
  const comunas = REGIONES_COMUNAS[regionSeleccionada] || [];
  selComuna.innerHTML = '<option value="">Seleccione…</option>' +
    comunas.map(c=>`<option value="${c}">${c}</option>`).join("");
}

// ====== Render ======
function renderBadge(){ $("#badgeTotal").textContent = `${usuarios.length} usuarios`; }

function renderTabla(){
  const tbody = $("#tbodyUsuarios");
  tbody.innerHTML = "";
  const lista = usuarios.filter(u=>{
    const txt = (u.run + " " + u.nombre + " " + u.apellidos + " " + u.correo).toLowerCase();
    return txt.includes(filtroTexto.toLowerCase());
  });

  lista.forEach((u, i)=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${u.run}</td>
      <td>${u.nombre}</td>
      <td>${u.apellidos}</td>
      <td>${u.correo}</td>
      <td>${u.fechaNac || "-"}</td>
      <td>${u.region || "-"}</td>
      <td>${u.comuna || "-"}</td>
      <td>${u.direccion || "-"}</td>
      <td>
        <div class="row-actions">
          <button class="btn-light" data-edit="${i}">Editar</button>
          <button class="btn-light" data-del="${i}">Eliminar</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll("[data-edit]").forEach(btn=>{
    btn.addEventListener("click", (e)=>{
      const idx = Number(e.currentTarget.getAttribute("data-edit"));
      abrirEdicion(idx);
    });
  });
  tbody.querySelectorAll("[data-del]").forEach(btn=>{
    btn.addEventListener("click", (e)=>{
      const idx = Number(e.currentTarget.getAttribute("data-del"));
      eliminar(idx);
    });
  });
}

// ====== Form ======
function abrirForm(nuevo=true){
  $("#formWrapper").style.display = "block";
  $("#formTitulo").textContent = nuevo ? "Nuevo usuario" : "Editar usuario";
  if(nuevo){
    $("#formUsuario").reset();
    $("#idxEdicion").value = "";
    $("#errRun").style.display = "none";
    $("#errCorreo").style.display = "none";
    $("#comuna").innerHTML = '<option value="">Seleccione…</option>';
  }
  window.scrollTo({ top: document.body.scrollHeight, behavior:"smooth" });
}

function cerrarForm(){
  $("#formWrapper").style.display = "none";
  $("#formUsuario").reset();
  $("#idxEdicion").value = "";
  $("#errRun").style.display = "none";
  $("#errCorreo").style.display = "none";
  $("#comuna").innerHTML = '<option value="">Seleccione…</option>';
}

function abrirEdicion(idx){
  const u = usuarios[idx];
  abrirForm(false);
  $("#idxEdicion").value = idx;
  $("#run").value = u.run;
  $("#nombre").value = u.nombre || "";
  "#apellidos" in u; $("#apellidos").value = u.apellidos || "";
  $("#correo").value = u.correo || "";
  $("#fechaNac").value = u.fechaNac || "";
  $("#region").value = u.region || "";
  cargarComunas(u.region || "");
  $("#comuna").value = u.comuna || "";
  $("#direccion").value = u.direccion || "";
}

function guardar(e){
  e.preventDefault();

  const run = cleanRun($("#run").value.trim());
  const nombre = $("#nombre").value.trim();
  const apellidos = $("#apellidos").value.trim();
  const correo = $("#correo").value.trim();
  const fechaNac = $("#fechaNac").value || "";
  const region = $("#region").value;
  const comuna = $("#comuna").value;
  const direccion = $("#direccion").value.trim();

  // Validaciones
  const errs = [];

  const vr = validarRUN(run);
  if(!vr.ok){
    $("#errRun").textContent = `RUN inválido${vr.esperado ? ` (DV esperado: ${vr.esperado})` : ""}.`;
    $("#errRun").style.display = "block";
    errs.push("RUN inválido.");
  } else {
    $("#errRun").style.display = "none";
  }

  if(!nombre) errs.push("Nombre es requerido.");
  if(nombre.length > 50) errs.push("Nombre: máximo 50 caracteres.");
  if(!apellidos) errs.push("Apellidos son requeridos.");
  if(apellidos.length > 100) errs.push("Apellidos: máximo 100 caracteres.");

  if(!correo){ errs.push("Correo es requerido."); $("#errCorreo").style.display = "block"; }
  else if(correo.length > 100){ errs.push("Correo: máximo 100 caracteres."); $("#errCorreo").style.display = "block"; }
  else if(!emailPermitido(correo)){ errs.push("Correo: dominio no permitido."); $("#errCorreo").style.display = "block"; }
  else $("#errCorreo").style.display = "none";

  if(!region) errs.push("Región es requerida.");
  if(!comuna) errs.push("Comuna es requerida.");
  if(!direccion) errs.push("Dirección es requerida.");
  if(direccion.length > 300) errs.push("Dirección: máximo 300 caracteres.");

  // unicidad RUN
  const idxEdit = $("#idxEdicion").value === "" ? -1 : Number($("#idxEdicion").value);
  const repetido = usuarios.some((u,i)=> u.run === run && i !== idxEdit);
  if(repetido) errs.push("Ya existe un usuario con ese RUN.");

  if(errs.length){
    alert("Corrige lo siguiente:\n\n• " + errs.join("\n• "));
    return;
  }

  const data = { run, nombre, apellidos, correo, fechaNac, region, comuna, direccion };

  if(idxEdit >= 0){
    usuarios[idxEdit] = data;
  } else {
    usuarios.push(data);
  }

  localStorage.setItem(FF_KEYS.USERS, JSON.stringify(usuarios));
  renderBadge();
  renderTabla();
  cerrarForm();
  alert("✅ Usuario guardado.");
}

function eliminar(idx){
  const u = usuarios[idx];
  if(confirm(`¿Eliminar al usuario "${u.nombre} ${u.apellidos}" (${u.run})?`)){
    usuarios.splice(idx,1);
    localStorage.setItem(FF_KEYS.USERS, JSON.stringify(usuarios));
    renderBadge();
    renderTabla();
  }
}

// ====== Boot ======
function boot(){
  cargarRegiones();
  renderBadge();
  renderTabla();

  $("#txtBuscar").addEventListener("input", e=>{ filtroTexto = e.target.value; renderTabla(); });
  $("#btnReset").addEventListener("click", ()=>{ $("#txtBuscar").value=""; filtroTexto=""; renderTabla(); });
  $("#btnRefrescar").addEventListener("click", ()=> location.reload());
  $("#btnNuevo").addEventListener("click", ()=> abrirForm(true));
  $("#btnCancelar").addEventListener("click", cerrarForm);

  $("#region").addEventListener("change", e=>{ cargarComunas(e.target.value); });
  $("#formUsuario").addEventListener("submit", guardar);
}
boot();
