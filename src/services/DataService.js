const INVENTARIO_KEY = "inventario";
const CONSUMIDOS_KEY = "consumidos";
const LOGS_KEY = "logs";

const DataService = {
  loadInventario() {
    return JSON.parse(localStorage.getItem(INVENTARIO_KEY)) || [];
  },

  saveInventario(inventario) {
    localStorage.setItem(INVENTARIO_KEY, JSON.stringify(inventario));
  },

  loadConsumidos() {
    return JSON.parse(localStorage.getItem(CONSUMIDOS_KEY)) || {};
  },

  saveConsumidos(consumidos) {
    localStorage.setItem(CONSUMIDOS_KEY, JSON.stringify(consumidos));
  },

  addOrUpdateProduct(inventario, producto) {
    const idx = inventario.findIndex(
      (p) =>
        p.nombre.toLowerCase() === producto.nombre.toLowerCase() &&
        p.categoria === producto.categoria
    );
    if (idx >= 0) {
      inventario[idx].cantidad += producto.cantidad;
      this.addLog(`Se actualizó el producto "${producto.nombre}" (+${producto.cantidad})`);
    } else {
      inventario.push(producto);
      this.addLog(`Se agregó el producto "${producto.nombre}" (${producto.categoria})`);
    }
    this.saveInventario(inventario);
    return inventario;
  },

  consumeProduct(inventario, consumidos, index) {
    const producto = inventario[index];
    consumidos[producto.nombre] = (consumidos[producto.nombre] || 0) + 1;

    if (producto.cantidad > 0) producto.cantidad--;

    this.addLog(`Se consumió una unidad de "${producto.nombre}"`);

    this.saveInventario(inventario);
    this.saveConsumidos(consumidos);
    return { inventario, consumidos };
  },

  reabastecer(inventario, index, cantidad = 1) {
    const producto = inventario[index];
    producto.cantidad += cantidad;
    this.addLog(`Se reabasteció "${producto.nombre}" (+${cantidad})`);
    this.saveInventario(inventario);
    return inventario;
  },

  deleteProduct(inventario, index) {
    const producto = inventario[index];
    this.addLog(`Se eliminó el producto "${producto.nombre}"`);
    inventario.splice(index, 1);
    this.saveInventario(inventario);
    return inventario;
  },

  loadLogs() {
    return JSON.parse(localStorage.getItem(LOGS_KEY)) || [];
  },

  saveLogs(logs) {
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  },

  addLog(mensaje) {
    try {
      const logs = this.loadLogs();
      const fecha = new Date().toLocaleString();
      logs.push(`[${fecha}] ${mensaje}`);
      this.saveLogs(logs);

      // 🔹 Notifica a los componentes que usan useEffect
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error("Error al guardar log:", error);
    }
  },
};

export default DataService;



