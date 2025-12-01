import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import EditProductModal from "./EditProductModal";

export default function InventoryTable({ inventario, onConsume, onDelete, onReabastecer, onEdit }) {
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [inventarioFiltrado, setInventarioFiltrado] = useState([]);
  const [productoEditando, setProductoEditando] = useState(null);

  const categorias = ["Todos", "Alimentos", "Bebidas", "Limpieza", "Otros"];

  // 🔄 Filtrar inventario cada vez que cambian inventario, búsqueda o categoría
  useEffect(() => {
    const filtrado = inventario.filter((p) => {
      const coincideCategoria = categoriaFiltro === "Todos" || p.categoria === categoriaFiltro;
      const coincideNombre = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
      return coincideCategoria && coincideNombre;
    });
    setInventarioFiltrado(filtrado);
  }, [inventario, categoriaFiltro, busqueda]);

  const exportarExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(inventarioFiltrado);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario");
    XLSX.writeFile(workbook, `inventario_${new Date().toLocaleDateString()}.xlsx`);
  };

  // ✅ Función para abrir el modal de edición
  const handleEditClick = (producto) => {
    setProductoEditando(producto);
  };

  // ✅ Función para guardar los cambios
  const handleSaveEdit = (datosActualizados) => {
    onEdit(productoEditando.id, datosActualizados);
    setProductoEditando(null);
  };

  // ✅ Función para cerrar el modal
  const handleCloseModal = () => {
    setProductoEditando(null);
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
            inventarioFiltrado.map((producto) => (
              <tr
                key={producto.id}
                className={producto.cantidad === 0 ? "table-danger fw-bold" : ""}
              >
                <td>{producto.nombre}</td>
                <td>{producto.cantidad}</td>
                <td>{producto.categoria}</td>
                <td>
                  <div className="d-flex gap-2 justify-content-center flex-wrap">
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => onConsume(producto.id)}
                    >
                      Consumir
                    </button>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => onReabastecer(producto.id)}
                    >
                      +1
                    </button>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleEditClick(producto)}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => onDelete(producto.id)}
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

      {/* ✅ Modal de edición */}
      {productoEditando && (
        <EditProductModal
          producto={productoEditando}
          onSave={handleSaveEdit}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}