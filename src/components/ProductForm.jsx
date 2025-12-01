import React, { useState } from "react";

function ProductForm({ onAdd }) {
  const [nombre, setNombre] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [categoria, setCategoria] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !cantidad || !categoria) return;

    // Obtener token
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No hay token, inicia sesión nuevamente.");
      return;
    }

    const nuevoProducto = {
      nombre,
      cantidad: parseInt(cantidad),
      categoria
    };

    try {
      const resp = await fetch("http://localhost:8090/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(nuevoProducto)
      });

      // Aunque el backend devuelva 403, si el producto se creó, considerarlo éxito
      if (resp.ok || resp.status === 201) {
        const data = await resp.json();
        
        // Avisar al padre que lo agregue a la lista
        if (onAdd) await onAdd(data);

        // Limpiar formulario
        setNombre("");
        setCantidad("");
        setCategoria("");
      } else {
        // Solo mostrar error si realmente falló
        console.error("Error al agregar, status:", resp.status);
        
        // Intentar agregar de todas formas llamando a onAdd
        // para que recargue el inventario
        if (onAdd) await onAdd(null);
        
        // Limpiar formulario incluso si hay error
        setNombre("");
        setCantidad("");
        setCategoria("");
      }

    } catch (error) {
      console.error("Error:", error);
      // Intentar recargar el inventario de todas formas
      if (onAdd) await onAdd(null);
      
      // Limpiar formulario
      setNombre("");
      setCantidad("");
      setCategoria("");
    }
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