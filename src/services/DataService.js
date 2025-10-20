const INVENTARIO_KEY = "inventario";
const CONSUMIDOS_KEY = "consumidos";

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
    } else {
      inventario.push(producto);
    }
    this.saveInventario(inventario);
    return inventario;
  },

  consumeProduct(inventario, consumidos, index) {
    const nombre = inventario[index].nombre;
    consumidos[nombre] = (consumidos[nombre] || 0) + 1;
    if (inventario[index].cantidad > 0) inventario[index].cantidad--;
    this.saveInventario(inventario);
    this.saveConsumidos(consumidos);
    return { inventario, consumidos };
  },

  reabastecer(inventario, index, cantidad = 1) {
    inventario[index].cantidad += cantidad;
    this.saveInventario(inventario);
    return inventario;
  },

  deleteProduct(inventario, index) {
    inventario.splice(index, 1);
    this.saveInventario(inventario);
    return inventario;
  }
};

export default DataService;
