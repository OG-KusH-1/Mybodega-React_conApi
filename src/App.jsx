import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // ← Solo importar estos
import Header from './components/Header';
import ProductForm from './components/ProductForm';
import InventoryTable from './components/InventoryTable';
import Reports from './components/Reports';
import Login from './components/Login';
import DataService from './services/DataService';
import AuthService from './services/AuthService';
import ShoppingList from './components/ShoppingList';
import Logs from './components/Logs';
import Register from './components/Registro.jsx';

export default function App() {
  const [inventario, setInventario] = useState(DataService.loadInventario());
  const [consumidos, setConsumidos] = useState(DataService.loadConsumidos());
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());

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

  function handleEdit(index, datosActualizados) {
    const nuevoInventario = [...inventario];
    nuevoInventario[index] = datosActualizados;
    setInventario(nuevoInventario);
    localStorage.setItem("inventario", JSON.stringify(nuevoInventario));
  }

  function handleLogin() {
    setIsAuthenticated(true);
  }

  function handleLogout() {
    AuthService.logout();
    setIsAuthenticated(false);
  }

  return (
  <>
    {isAuthenticated && <Header onLogout={handleLogout} />}
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <div className="container">
              <div className="row">
                <div className="col-md-4"><ProductForm onAdd={handleAdd} /></div>
                <div className="col-md-8">
                  <h2>Inventario</h2>
                  <InventoryTable
                    inventario={inventario}
                    onConsume={handleConsume}
                    onDelete={handleDelete}
                    onReabastecer={handleReabastecer}
                    onEdit={handleEdit}
                  />
                </div>
              </div>
            </div>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      
      <Route
        path="/reportes"
        element={isAuthenticated ? <Reports /> : <Navigate to="/login" />}
      />
      
      <Route
        path="/compras"
        element={isAuthenticated ? <ShoppingList /> : <Navigate to="/login" />}
      />
      
      <Route
        path="/logs"
        element={isAuthenticated ? <Logs /> : <Navigate to="/login" />}
      />
      
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  </>
);
}