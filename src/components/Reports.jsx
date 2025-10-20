import React, { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import DataService from '../services/DataService';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement);

export default function Reports(){
  const [inventario, setInventario] = useState([]);
  const [consumidos, setConsumidos] = useState({});

  useEffect(()=> {
    setInventario(DataService.loadInventario());
    setConsumidos(DataService.loadConsumidos());
  }, []);

  const counts = { Alimentos:0, Bebidas:0, Limpieza:0, Otros:0 };
  inventario.forEach(i => counts[i.categoria] += i.cantidad);
  const pieData = {
    labels: Object.keys(counts),
    datasets: [{ data: Object.values(counts), backgroundColor: ['#4caf50','#2196f3','#ff9800','#f44336'] }]
  };

  const barData = {
    labels: Object.keys(consumidos),
    datasets: [{ label: 'Consumidos', data: Object.values(consumidos), backgroundColor: '#2196f3' }]
  };

  const bajos = inventario.filter(i => i.cantidad <= 3);
  const bajosData = {
    labels: bajos.map(b=>b.nombre),
    datasets: [{ label: 'Stock', data: bajos.map(b=>b.cantidad), backgroundColor: '#f44336' }]
  };

  return (
    <div className="container">
      <h2 className="mb-3">Reportes</h2>
      <div className="row">
        <div className="col-md-4"><h5>Por Categoría</h5><Pie data={pieData} /></div>
        <div className="col-md-4"><h5>Más Consumidos</h5><Bar data={barData} /></div>
        <div className="col-md-4"><h5>Bajo Stock</h5><Bar data={bajosData} /></div>
      </div>
    </div>
  );
}
