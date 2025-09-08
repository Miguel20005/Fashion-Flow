// ====== Datos base / helpers ======
ff_bootstrapDemoData();

const $ = (s)=>document.querySelector(s);
const $$ = (s)=>document.querySelectorAll(s);

const CATEGORIAS = ["Polerones","Poleras","Pantalones","Chaquetas","Accesorios"];

// Rellena selects de categorías (filtro + form)
function cargarCategorias() {
  const selCat = $("#categoria");
  selCat.innerHTML = '<option value="">Seleccione…</option>' + 
    CATEGORIAS.map(c=>`<option value="${c}">${c}</option>`).join("");

  const filtro = $("#selCategoriaFiltro");
  filtro.innerHTML = '<option value="">Todas las categorías</option>' + 
    CATEGORIAS.map(c=>`<option value="${c}">${c}</option>`).join("");
}

// ====== Estado ======
let productos = ff_getProducts();
let filtroTexto = "";
let filtroCat = "";

// ====== UI ======
function renderBadge() {
  $("#badgeTotal").textContent = `${productos.length} items`;
}

function placeholderImg() {
  return "https://via.placeholder.com/80x80.png?text=IMG";
}

function renderTabla() {
  const tbody = $("#tbodyProductos");
  tbody.innerHTML = "";

  // filtros simples
  const lista = productos.filter(p=>{
    const matchTxt = (p.code + " " + p.name).toLowerCase().includes(filtroTexto.toLowerCase());
    const matchCat = !filtroCat || p.category === filtroCat;
    return matchTxt && matchCat;
  });

  lista.forEach((p, i)=>{
    const critico = Number.isInteger(p.critical) ? p.critical : null;
    const enCritico = (typeof critico === "number") && (p.stock <= critico);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><img class="thumb" src="${p.imageUrl || placeholderImg()}" alt=""></td>
      <td>${p.code}</td>
      <td>${p.name}</td>
      <td>${ff_formatCLP(p.price)}</td>
      <td class="${enCritico ? 'danger' : ''}">${p.stock}</td>
      <td class="small">${critico ?? "-"}</td>
      <td class="small">${p.category || "-"}</td>
      <td>
        <div class="row-actions">
          <button class="btn-light" data-edit="${i}">Editar</button>
          <button class="btn-light" data-del="${i}">Eliminar</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // eventos fila
  tbody.querySelectorAll("[data-edit]").forEach(btn=>{
    btn.addEventListener("click", e=>{
      const idx = Number(e.currentTarget.getAttribute("data-edit"));
      abrirEdicion(idx);
    });
  });
  tbody.querySelectorAll("[data-del]").forEach(btn=>{
    btn.addEventListener("click", e=>{
      const idx = Number(e.currentTarget.getAttribute("data-del"));
      eliminar(idx);
    });
  });
}

function abrirForm(nuevo=true){
  $("#formWrapper").style.display = "block";
  $("#formTitulo").textContent = nuevo ? "Nuevo producto" : "Editar producto";
  if(nuevo){
    $("#formProducto").reset();
    $("#idxEdicion").value = "";
    $("#msgStock").style.display = "none";
  }
  window.scrollTo({top: document.body.scrollHeight, behavior:"smooth"});
}

function cerrarForm(){
  $("#formWrapper").style.display = "none";
  $("#formProducto").reset();
  $("#idxEdicion").value = "";
  $("#msgStock").style.display = "none";
}

// ====== CRUD ======
function guardar(e){
  e.preventDefault();

  // Lectura de campos
  const code = $("#codigo").value.trim();
  const name = $("#nombre").value.trim();
  const description = $("#descripcion").value.trim();
  const price = Number($("#precio").value);
  const stock = parseInt($("#stock").value,10);
  const criticalStr = $("#stockCritico").value;
  const critical = criticalStr === "" ? null : parseInt(criticalStr,10);
  const category = $("#categoria").value;
  const imageUrl = $("#imagenUrl").value.trim();

  // Validaciones (requisitos)
  const errores = [];

  if(code.length < 3) errores.push("Código: mínimo 3 caracteres.");
  if(!name) errores.push("Nombre: obligatorio.");
  if(name.length > 100) errores.push("Nombre: máximo 100 caracteres.");
  if(description.length > 500) errores.push("Descripción: máximo 500 caracteres.");
  if(isNaN(price) || price < 0) errores.push("Precio: debe ser un número >= 0.");
  if(!Number.isInteger(stock) || stock < 0) errores.push("Stock: entero >= 0.");
  if(critical !== null && (!Number.isInteger(critical) || critical < 0)) errores.push("Stock crítico: entero >= 0.");
  if(!category) errores.push("Categoría: obligatoria.");

  // unicidad de código (simple)
  const idxEdit = $("#idxEdicion").value === "" ? -1 : Number($("#idxEdicion").value);
  const existe = productos.some((p, i)=> p.code.toLowerCase() === code.toLowerCase() && i !== idxEdit);
  if(existe) errores.push("Ya existe un producto con ese código.");

  if(errores.length){
    alert("Corrige lo siguiente:\n\n• " + errores.join("\n• "));
    return;
  }

  const data = { code, name, description, price, stock, critical, category, imageUrl };

  if(idxEdit >= 0){
    productos[idxEdit] = data;
  } else {
    productos.push(data);
  }

  localStorage.setItem(FF_KEYS.PRODUCTS, JSON.stringify(productos));
  renderBadge();
  renderTabla();
  cerrarForm();
  alert("✅ Producto guardado.");
}

function abrirEdicion(idx){
  const p = productos[idx];
  abrirForm(false);
  $("#idxEdicion").value = idx;
  $("#codigo").value = p.code;
  $("#nombre").value = p.name;
  $("#descripcion").value = p.description || "";
  $("#precio").value = p.price;
  $("#stock").value = p.stock;
  $("#stockCritico").value = (p.critical ?? "");
  $("#categoria").value = p.category || "";
  $("#imagenUrl").value = p.imageUrl || "";
  mostrarAdvertenciaStock();
}

function eliminar(idx){
  const p = productos[idx];
  if(confirm(`¿Eliminar el producto "${p.name}" (${p.code})?`)){
    productos.splice(idx,1);
    localStorage.setItem(FF_KEYS.PRODUCTS, JSON.stringify(productos));
    renderBadge();
    renderTabla();
  }
}

// ====== Util UI ======
function mostrarAdvertenciaStock(){
  const stock = parseInt($("#stock").value || "0",10);
  const crit = $("#stockCritico").value === "" ? null : parseInt($("#stockCritico").value,10);
  const msg = $("#msgStock");
  if(crit !== null && Number.isInteger(crit) && stock <= crit){
    msg.style.display = "block";
  } else {
    msg.style.display = "none";
  }
}

// ====== Eventos iniciales ======
function boot(){
  cargarCategorias();
  renderBadge();
  renderTabla();

  // botones top
  $("#btnNuevo").addEventListener("click", ()=> abrirForm(true));
  $("#btnRefrescar").addEventListener("click", ()=> location.reload());
  $("#btnCancelar").addEventListener("click", cerrarForm);

  // submit
  $("#formProducto").addEventListener("submit", guardar);

  // búsqueda / filtro
  $("#txtBuscar").addEventListener("input", e=>{ filtroTexto = e.target.value; renderTabla(); });
  $("#selCategoriaFiltro").addEventListener("change", e=>{ filtroCat = e.target.value; renderTabla(); });
  $("#btnReset").addEventListener("click", ()=>{
    $("#txtBuscar").value = ""; filtroTexto = "";
    $("#selCategoriaFiltro").value = ""; filtroCat = "";
    renderTabla();
  });

  // advertencia stock crítico
  $("#stock").addEventListener("input", mostrarAdvertenciaStock);
  $("#stockCritico").addEventListener("input", mostrarAdvertenciaStock);
}

boot();
