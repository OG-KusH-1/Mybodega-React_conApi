import React, { useState } from "react";
import * as XLSX from "xlsx";

export default function InventoryTable({ inventario, onConsume, onDelete, onReabastecer }) {
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");

  const categorias = ["Todos", "Alimentos", "Bebidas", "Limpieza", "Otros"];

  const inventarioFiltrado = inventario.filter((p) => {
    const coincideCategoria =
      categoriaFiltro === "Todos" || p.categoria === categoriaFiltro;
    const coincideNombre = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCategoria && coincideNombre;
  });

  // ✅ Función para exportar a Excel
  const exportarExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(inventarioFiltrado);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario");
    XLSX.writeFile(workbook, `inventario_${new Date().toLocaleDateString()}.xlsx`);
  };

  return (
    <div className="table-responsive">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <h4 className="mb-0">Inventario</h4>

        <input
          type="text"
          className="form-control w-auto"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <select
          className="form-select w-auto"
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
        >
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* ✅ Botón de exportación a Excel */}
        <button className="btn btn-success" onClick={exportarExcel}>
          📊 Exportar a Excel
        </button>
      </div>

      <table className="table table-striped table-bordered align-middle">
        <thead className="table-dark">
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {inventarioFiltrado.length > 0 ? (
            inventarioFiltrado.map((producto, index) => (
              <tr
                key={index}
                className={producto.cantidad === 0 ? "table-danger fw-bold" : ""}
              >
                <td>{producto.nombre}</td>
                <td>{producto.cantidad}</td>
                <td>{producto.categoria}</td>
                <td>
                  <div className="d-flex gap-2 justify-content-center">
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => onConsume(index)}
                    >
                      Consumir
                    </button>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => onReabastecer(index)}
                    >
                      +1
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => onDelete(index)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No hay productos que coincidan con la búsqueda o categoría seleccionada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}