/* Pequeña capa sobre localStorage para este proyecto demo */

const FF_KEYS = {
  PRODUCTS: "ff_products",
  USERS: "ff_users",
  ORDERS: "ff_orders",
  SALES_BY_MONTH: "ff_sales_by_month" // { "2025-09": 12450, ... }
};

// Inicializa datos de ejemplo si no existen
function ff_bootstrapDemoData() {
  if (!localStorage.getItem(FF_KEYS.PRODUCTS)) {
    const demoProducts = [
      { code: "P001", name: "Hoodie Classic", price: 24990, stock: 15, category: "Hoodies" },
      { code: "P002", name: "Polera Oversize", price: 13990, stock: 40, category: "Poleras" },
      { code: "P003", name: "Gorro Beanie",  price: 9990,  stock: 25, category: "Accesorios" }
    ];
    localStorage.setItem(FF_KEYS.PRODUCTS, JSON.stringify(demoProducts));
  }

  if (!localStorage.getItem(FF_KEYS.USERS)) {
    // RUNs de ejemplo válidos:
    // 19011022 → DV 2  => 190110222
    // 20123456 → DV 5  => 201234565
    const demoUsers = [
      { run: "190110222", nombre: "Javiera", apellidos: "Pérez Soto", correo: "javiera@gmail.com", region:"Región Metropolitana de Santiago", comuna:"Ñuñoa", direccion:"Av. Demo 123" },
      { run: "201234565", nombre: "Matías",  apellidos: "Rojas",      correo: "matias@duoc.cl",     region:"Valparaíso", comuna:"Viña del Mar", direccion:"Calle Prueba 456" }
    ];
    localStorage.setItem(FF_KEYS.USERS, JSON.stringify(demoUsers));
  }

  if (!localStorage.getItem(FF_KEYS.ORDERS)) {
    const today = new Date().toISOString().slice(0,10);
    const yDay  = new Date(Date.now()-86400000).toISOString().slice(0,10);
    const demoOrders = [
      { id: 1001, fecha: today,   cliente: "Acme S.A.",     estado: "Pendiente",  monto: 25980 },
      { id: 1002, fecha: today,   cliente: "Bravo Ltda.",   estado: "Enviado",    monto: 13990 },
      { id: 1000, fecha: yDay,    cliente: "Foxtrot Inc.",  estado: "Cancelado",  monto: 0 }
    ];
    localStorage.setItem(FF_KEYS.ORDERS, JSON.stringify(demoOrders));
  }

  if (!localStorage.getItem(FF_KEYS.SALES_BY_MONTH)) {
    const ym = new Date().toISOString().slice(0,7);
    localStorage.setItem(FF_KEYS.SALES_BY_MONTH, JSON.stringify({ [ym]: 12450 }));
  }
}

// Getters
function ff_getProducts() { return JSON.parse(localStorage.getItem(FF_KEYS.PRODUCTS) || "[]"); }
function ff_getUsers()    { return JSON.parse(localStorage.getItem(FF_KEYS.USERS) || "[]"); }
function ff_getOrders()   { return JSON.parse(localStorage.getItem(FF_KEYS.ORDERS) || "[]"); }
function ff_getSalesMonth(isoYYYYMM) {
  const map = JSON.parse(localStorage.getItem(FF_KEYS.SALES_BY_MONTH) || "{}");
  return map[isoYYYYMM] || 0;
}

// Util
function ff_formatCLP(num){
  return new Intl.NumberFormat("es-CL", { style:"currency", currency:"CLP", maximumFractionDigits:0 }).format(num||0);
}
