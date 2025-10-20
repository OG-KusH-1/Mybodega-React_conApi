import React, { useState } from "react";

function ProductForm({ onAdd }) {
  const [nombre, setNombre] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [categoria, setCategoria] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !cantidad || !categoria) return;
    onAdd({ nombre, cantidad: parseInt(cantidad), categoria });
    setNombre("");
    setCantidad("");
    setCategoria("");
  };

  return (
    <form className="card p-3 mb-3" onSubmit={handleSubmit}>
      <div className="mb-2">
        <label htmlFor="nombre" className="form-label">
          Producto
        </label>
        <input
          id="nombre"
          className="form-control"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>

      <div className="mb-2">
        <label htmlFor="cantidad" className="form-label">
          Cantidad
        </label>
        <input
          id="cantidad"
          type="number"
          className="form-control"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
        />
      </div>

      <div className="mb-2">
        <label htmlFor="categoria" className="form-label">
          Categoría
        </label>
        <select
          id="categoria"
          className="form-select"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          <option value="">-- Selecciona --</option>
          <option value="Alimentos">Alimentos</option>
          <option value="Bebidas">Bebidas</option>
          <option value="Limpieza">Limpieza</option>
          <option value="Otros">Otros</option>
        </select>
      </div>

      <button className="btn btn-success" type="submit">
        Agregar
      </button>
    </form>
  );
}

export default ProductForm;

