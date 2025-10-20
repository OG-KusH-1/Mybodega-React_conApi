import React from 'react';

export default function InventoryTable({ inventario, onConsume, onDelete, onReabastecer }) {
  return (
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
          {inventario.length === 0 && (
            <tr><td colSpan="4" className="text-center">No hay productos en el inventario</td></tr>
          )}
          {inventario.map((item, idx) => (
            <tr key={idx} style={{ background: item.cantidad === 0 ? '#ffebee' : 'transparent' }}>
              <td>{item.nombre}</td>
              <td>{item.cantidad}</td>
              <td>{item.categoria}</td>
              <td>
                <button className="btn btn-warning btn-sm me-1" onClick={() => onConsume(idx)} title="Consumir">➖</button>
                <button className="btn btn-success btn-sm me-1" onClick={() => onReabastecer(idx)} title="Reabastecer">➕</button>
                <button className="btn btn-danger btn-sm" onClick={() => onDelete(idx)} title="Eliminar">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
