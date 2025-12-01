import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import ProductForm from "./components/ProductForm";
import InventoryTable from "./components/InventoryTable";
import Reports from "./components/Reports";
import Login from "./components/Login";
import ShoppingList from "./components/ShoppingList";
import Logs from "./components/Logs";
import Register from "./components/Registro";
import ProtectedRoute from "./components/ProtectedRoute";

import ProductService from "./services/ProductService";
import AuthService from "./services/AuthService";

export default function App() {
  const [inventario, setInventario] = useState([]);

  // Cargar inventario al iniciar si hay token
  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      fetchInventario();
    }
  }, []);

  const fetchInventario = async () => {
    try {
      const data = await ProductService.getAll();
      setInventario(data);
    } catch (err) {
      console.error("Error cargando inventario:", err);
    }
  };

  const handleLogin = () => {
    fetchInventario();
  };

  const handleLogout = () => {
    AuthService.logout();
    setInventario([]);
  };

  // CRUD usando IDs, asegurando que React re-renderice
  const handleAdd = async (producto) => {
    try {
      const res = await ProductService.create(producto);
      setInventario(prev => [...prev, res]);
    } catch (err) {
      console.error("Error al agregar:", err);
      // Si hay error 403 pero se agregó, recargar inventario
      await fetchInventario();
    }
  };

  const handleEdit = async (id, datos) => {
    try {
      const res = await ProductService.update(id, datos);
      setInventario(prev => prev.map(p => p.id === id ? res : p));
    } catch (err) {
      console.error("Error al editar:", err);
      // Si falla, recargar el inventario completo
      await fetchInventario();
    }
  };

  const handleDelete = async (id) => {
    try {
      await ProductService.delete(id);
      setInventario(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error("Error al eliminar:", err);
      // Si falla, recargar el inventario completo
      await fetchInventario();
    }
  };

  const handleConsume = async (id) => {
    const producto = inventario.find(p => p.id === id);
    if (!producto || producto.cantidad <= 0) return;
    
    // Actualizar localmente primero (optimistic update)
    setInventario(prev => prev.map(p => 
      p.id === id ? { ...p, cantidad: p.cantidad - 1 } : p
    ));
    
    // Luego hacer la petición al backend
    try {
      await handleEdit(id, { ...producto, cantidad: producto.cantidad - 1 });
    } catch (err) {
      // Si falla, revertir
      setInventario(prev => prev.map(p => 
        p.id === id ? { ...p, cantidad: p.cantidad + 1 } : p
      ));
    }
  };

  const handleReabastecer = async (id) => {
    const producto = inventario.find(p => p.id === id);
    if (!producto) return;
    
    // Actualizar localmente primero (optimistic update)
    setInventario(prev => prev.map(p => 
      p.id === id ? { ...p, cantidad: p.cantidad + 1 } : p
    ));
    
    // Luego hacer la petición al backend
    try {
      await handleEdit(id, { ...producto, cantidad: producto.cantidad + 1 });
    } catch (err) {
      // Si falla, revertir
      setInventario(prev => prev.map(p => 
        p.id === id ? { ...p, cantidad: p.cantidad - 1 } : p
      ));
    }
  };

  return (
    <>
      {AuthService.isAuthenticated() && <Header onLogout={handleLogout} />}

      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <div className="container">
              <div className="row">
                <div className="col-md-4">
                  <ProductForm onAdd={handleAdd} />
                </div>
                <div className="col-md-8">
                  <h2>Inventario</h2>
                  <InventoryTable
                    inventario={inventario}
                    onConsume={handleConsume}
                    onReabastecer={handleReabastecer}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                </div>
              </div>
            </div>
          </ProtectedRoute>
        }/>

        <Route path="/reportes" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        <Route path="/compras" element={<ProtectedRoute><ShoppingList /></ProtectedRoute>} />
        <Route path="/logs" element={<ProtectedRoute><Logs /></ProtectedRoute>} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}