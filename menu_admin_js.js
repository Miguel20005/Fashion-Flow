// Carga KPIs y últimos pedidos
ff_bootstrapDemoData();

const $ = (sel) => document.querySelector(sel);
const products = ff_getProducts();
const users    = ff_getUsers();
const orders   = ff_getOrders();

const todayISO = new Date().toISOString().slice(0,10);
const pedidosHoy = orders.filter(o => o.fecha === todayISO).length;
const ym = new Date().toISOString().slice(0,7);
const ventasMes = ff_getSalesMonth(ym);

// Pintar KPI
$("#kpiProductos").textContent = products.length;
$("#kpiPedidosHoy").textContent = pedidosHoy;
$("#kpiUsuarios").textContent = users.length;
$("#kpiVentasMes").textContent = ff_formatCLP(ventasMes);

// Tabla: últimos pedidos (máx 10, orden desc por id)
const tbody = $("#tbodyPedidos");
orders
  .slice()                 // copia
  .sort((a,b) => b.id - a.id)
  .slice(0,10)
  .forEach((o, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${o.id}</td>
      <td>${o.fecha}</td>
      <td>${o.cliente}</td>
      <td>${o.estado}</td>
      <td>${ff_formatCLP(o.monto)}</td>
    `;
    tbody.appendChild(tr);
  });

