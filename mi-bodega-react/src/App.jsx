import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ProductForm from './components/ProductForm';
import InventoryTable from './components/InventoryTable';
import Reports from './components/Reports';
import DataService from './services/DataService';

export default function Home() {
  const [inventario, setInventario] = useState(DataService.loadInventario());
  const [consumidos, setConsumidos] = useState(DataService.loadConsumidos());

  useEffect(() => {
    function onStorage() {
      setInventario(DataService.loadInventario());
      setConsumidos(DataService.loadConsumidos());
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  function handleAdd(producto) {
    const nuevo = [...inventario];
    DataService.addOrUpdateProduct(nuevo, producto);
    setInventario(DataService.loadInventario());
  }

  function handleConsume(index) {
    const result = DataService.consumeProduct([...inventario], {...consumidos}, index);
    setInventario(result.inventario);
    setConsumidos(result.consumidos);
  }

  function handleReabastecer(index) {
    DataService.reabastecer(inventario, index, 1);
    setInventario(DataService.loadInventario());
  }

  function handleDelete(index) {
    DataService.deleteProduct(inventario, index);
    setInventario(DataService.loadInventario());
  }

  return (
    <Router>
      <Header />
      <Routes>
        <Route path='/' element={
          <div className="container">
            <div className="row">
              <div className="col-md-4"><ProductForm onAdd={handleAdd} /></div>
              <div className="col-md-8">
                <h2>Inventario</h2>
                <InventoryTable inventario={inventario} onConsume={handleConsume} onDelete={handleDelete} onReabastecer={handleReabastecer} />
              </div>
            </div>
          </div>
        } />
        <Route path='/reportes' element={<Reports />} />
      </Routes>
    </Router>
  )
}
