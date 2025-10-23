import React, { useState, useEffect } from "react";
import DataService from "../services/DataService";

export default function ShoppingList() {
  const [listaCompras, setListaCompras] = useState([]);

  useEffect(() => {
    const inventario = DataService.loadInventario();
    const productosParaComprar = inventario.filter(p => p.cantidad < 3); // Umbral configurable
    setListaCompras(productosParaComprar);
  }, []);

  function handleMarcarComprado(index) {
    const nuevaLista = [...listaCompras];
    nuevaLista.splice(index, 1);
    setListaCompras(nuevaLista);
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
                    onClick={() => handleMarcarComprado(index)}
                  >
                    ✅ Marcar como comprado
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
