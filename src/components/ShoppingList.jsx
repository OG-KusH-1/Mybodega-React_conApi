import React, { useState, useEffect } from "react";
import DataService from "../services/DataService";

export default function ShoppingList() {
  const [listaCompras, setListaCompras] = useState([]);
  const [productoComprando, setProductoComprando] = useState(null);
  const [cantidadComprada, setCantidadComprada] = useState("");

  useEffect(() => {
    actualizarLista();

    // ✅ Escuchar cambios en el localStorage
    function onStorageChange() {
      actualizarLista();
    }

    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  function actualizarLista() {
    const inventario = DataService.loadInventario();
    const productosParaComprar = inventario.filter(p => p.cantidad < 3);
    setListaCompras(productosParaComprar);
  }

  function handleMarcarComprado(producto) {
    setProductoComprando(producto);
    setCantidadComprada("");
  }

  function handleConfirmarCompra(e) {
    e.preventDefault();
    
    if (!cantidadComprada || cantidadComprada <= 0) {
      alert("Por favor ingresa una cantidad válida");
      return;
    }

    // Actualizar el inventario
    const inventario = DataService.loadInventario();
    const index = inventario.findIndex(
      p => p.nombre === productoComprando.nombre && p.categoria === productoComprando.categoria
    );

    if (index !== -1) {
      DataService.reabastecer(inventario, index, parseInt(cantidadComprada));
      alert(`Se agregaron ${cantidadComprada} unidades de ${productoComprando.nombre}`);
    }

    // Cerrar modal y actualizar lista inmediatamente
    setProductoComprando(null);
    setCantidadComprada("");
    
    // ✅ Forzar actualización inmediata
    setTimeout(() => actualizarLista(), 100);
  }

  function handleCancelar() {
    setProductoComprando(null);
    setCantidadComprada("");
  }

  return (
    <div className="container">
      <h2>🛒 Lista de Compras</h2>
      {listaCompras.length === 0 ? (
        <p>No hay productos con bajo stock 🎉</p>
      ) : (
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Cantidad actual</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {listaCompras.map((prod, index) => (
              <tr key={index}>
                <td>{prod.nombre}</td>
                <td>{prod.categoria}</td>
                <td>{prod.cantidad}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleMarcarComprado(prod)}
                  >
                    ✅ Marcar como comprado
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal de confirmación de compra */}
      {productoComprando && (
        <div 
          className="modal fade show d-block" 
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={handleCancelar}
        >
          <div 
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Registrar Compra</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={handleCancelar}
                ></button>
              </div>
              
              <form onSubmit={handleConfirmarCompra}>
                <div className="modal-body">
                  <p><strong>Producto:</strong> {productoComprando.nombre}</p>
                  <p><strong>Cantidad actual:</strong> {productoComprando.cantidad}</p>
                  
                  <div className="mb-3">
                    <label className="form-label">¿Cuántas unidades compraste?</label>
                    <input
                      type="number"
                      className="form-control"
                      value={cantidadComprada}
                      onChange={(e) => setCantidadComprada(e.target.value)}
                      min="1"
                      placeholder="Ej: 5"
                      required
                      autoFocus
                    />
                  </div>

                  <div className="alert alert-info">
                    <small>
                      Nueva cantidad: {productoComprando.cantidad + (parseInt(cantidadComprada) || 0)}
                    </small>
                  </div>
                </div>

                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={handleCancelar}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Confirmar Compra
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}