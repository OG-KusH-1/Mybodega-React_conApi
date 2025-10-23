import React, { useEffect, useState } from "react";
import DataService from "../services/DataService";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Reports() {
  const [inventario, setInventario] = useState([]);
  const [consumidos, setConsumidos] = useState({});
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    setInventario(DataService.loadInventario());
    setConsumidos(DataService.loadConsumidos());
    setLogs(DataService.loadLogs());

    const actualizar = () => {
      setInventario(DataService.loadInventario());
      setConsumidos(DataService.loadConsumidos());
      setLogs(DataService.loadLogs());
    };
    window.addEventListener("storage", actualizar);
    return () => window.removeEventListener("storage", actualizar);
  }, []);

  const consumidosData = Object.entries(consumidos).map(([nombre, cantidad]) => ({ nombre, cantidad }));
  const categoriasData = Object.entries(
    inventario.reduce((acc, p) => {
      acc[p.categoria] = (acc[p.categoria] || 0) + p.cantidad;
      return acc;
    }, {})
  ).map(([categoria, cantidad]) => ({ categoria, cantidad }));

  const stockBajo = inventario.filter((p) => p.cantidad <= 2);

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f7f", "#00bcd4"];

  return (
    <div className="container">
      <h2 className="mb-4">📊 Reportes</h2>

      {/* Productos más consumidos */}
      <div className="card mb-4">
        <div className="card-header bg-dark text-white">Productos más consumidos</div>
        <div className="card-body">
          {consumidosData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={consumidosData}>
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cantidad" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No hay productos consumidos aún.</p>
          )}
        </div>
      </div>

      {/* Distribución por categoría */}
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">Distribución por categoría</div>
        <div className="card-body d-flex justify-content-center">
          {categoriasData.length > 0 ? (
            <ResponsiveContainer width="80%" height={300}>
              <PieChart>
                <Pie
                  data={categoriasData}
                  dataKey="cantidad"
                  nameKey="categoria"
                  outerRadius={120}
                  label
                >
                  {categoriasData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>No hay productos registrados.</p>
          )}
        </div>
      </div>

      {/* Stock bajo */}
      <div className="card mb-4">
        <div className="card-header bg-warning text-dark">Productos con bajo stock</div>
        <div className="card-body">
          {stockBajo.length > 0 ? (
            <ul className="list-group">
              {stockBajo.map((p, index) => (
                <li
                  key={index}
                  className={`list-group-item d-flex justify-content-between ${
                    p.cantidad === 0 ? "list-group-item-danger fw-bold" : ""
                  }`}
                >
                  <span>{p.nombre}</span>
                  <span>{p.cantidad} unidades</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>Todos los productos tienen stock suficiente.</p>
          )}
        </div>
      </div>
    </div>
  );
}
