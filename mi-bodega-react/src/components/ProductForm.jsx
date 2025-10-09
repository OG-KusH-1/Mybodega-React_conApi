import React, { useState } from 'react';

export default function ProductForm({ onAdd }) {
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [categoria, setCategoria] = useState('');

  function reset() {
    setNombre('');
    setCantidad('');
    setCategoria('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!nombre.trim()) return alert('Ingresa nombre');
    const cantidadNum = parseInt(cantidad, 10);
    if (isNaN(cantidadNum) || cantidadNum <= 0) return alert('Cantidad inválida');
    if (!categoria) return alert('Selecciona categoría');

    const producto = {
      nombre: nombre.trim().charAt(0).toUpperCase() + nombre.trim().slice(1).toLowerCase(),
      cantidad: cantidadNum,
      categoria
    };
    onAdd(producto);
    reset();
  }

  return (
    <form onSubmit={handleSubmit} className="card p-3 mb-3">
      <div className="mb-2">
        <label className="form-label">Producto</label>
        <input className="form-control" value={nombre} onChange={e => setNombre(e.target.value)} />
      </div>
      <div className="mb-2">
        <label className="form-label">Cantidad</label>
        <input type="number" className="form-control" value={cantidad} onChange={e => setCantidad(e.target.value)} />
      </div>
      <div className="mb-2">
        <label className="form-label">Categoría</label>
        <select className="form-select" value={categoria} onChange={e => setCategoria(e.target.value)}>
          <option value="">-- Selecciona --</option>
          <option value="Alimentos">Alimentos</option>
          <option value="Bebidas">Bebidas</option>
          <option value="Limpieza">Limpieza</option>
          <option value="Otros">Otros</option>
        </select>
      </div>
      <button className="btn btn-success" type="submit">Agregar</button>
    </form>
  );
}
