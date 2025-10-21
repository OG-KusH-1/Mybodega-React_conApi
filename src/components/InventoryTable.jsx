import React, { useState } from 'react';

export default function InventoryTable({ inventario, onConsume, onDelete, onReabastecer }) {
  const [busqueda, setBusqueda] = useState('');

  // Filtrar productos según el término de búsqueda
  const productosFiltrados = inventario.filter(item =>
    item.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      {/* Barra de búsqueda */}
      <div className="mb-3">
        <div className="input-group">
          <span className="input-group-text">🔍</span>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar producto por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          {busqueda && (
            <button 
              className="btn btn-outline-secondary" 
              onClick={() => setBusqueda('')}
              title="Limpiar búsqueda"
            >
              ✖️
            </button>
          )}
        </div>
      </div>

      {/* Tabla de inventario */}
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center">
                  {busqueda ? 'No se encontraron productos que coincidan con la búsqueda' : 'No hay productos en el inventario'}
                </td>
              </tr>
            )}
            {productosFiltrados.map((item, idx) => {
              // Obtener el índice original del item en el inventario completo
              const indiceOriginal = inventario.indexOf(item);
              return (
                <tr key={idx} style={{ background: item.cantidad === 0 ? '#ffebee' : 'transparent' }}>
                  <td>{item.nombre}</td>
                  <td>{item.cantidad}</td>
                  <td>{item.categoria}</td>
                  <td>
                    <button className="btn btn-warning btn-sm me-1" onClick={() => onConsume(indiceOriginal)} title="Consumir">➖</button>
                    <button className="btn btn-success btn-sm me-1" onClick={() => onReabastecer(indiceOriginal)} title="Reabastecer">➕</button>
                    <button className="btn btn-danger btn-sm" onClick={() => onDelete(indiceOriginal)} title="Eliminar">🗑️</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}