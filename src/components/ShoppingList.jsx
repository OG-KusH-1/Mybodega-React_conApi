import { useEffect, useState } from "react";
import api from "../services/api";

function ShoppingList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("🛒 Cargando lista de compras...");
      
      // Cambiar ruta para que coincida con tu API
      const res = await api.get("/shopping");
      
      console.log("✅ Lista de compras cargada:", res.data.length, "items");
      setItems(res.data);
    } catch (err) {
      console.error("❌ Error cargando lista de compras:", err);
      setError(err.response?.data?.message || "Error al cargar la lista de compras");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();

    // Refrescar cada 30 segundos
    const interval = setInterval(load, 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">🛒 Lista de Compras</h1>
        <button 
          className="btn btn-outline-primary" 
          onClick={load}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Actualizando...
            </>
          ) : (
            <>
              🔄 Actualizar
            </>
          )}
        </button>
      </div>

      <div className="alert alert-info">
        <strong>ℹ️ Nota:</strong> Esta lista muestra productos con 3 unidades o menos.
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          <strong>Error:</strong> {error}
        </div>
      )}

      {loading && !error ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : !error && items.length === 0 ? (
        <div className="alert alert-success">
          ✅ ¡Excelente! No hay productos en bajo stock.
        </div>
      ) : !error && (
        <div className="row">
          {items.map(p => (
            <div key={p.id} className="col-md-6 col-lg-4 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{p.nombre}</h5>
                  <p className="card-text">
                    <span className="badge bg-secondary">{p.categoria}</span>
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">Cantidad:</span>
                    <span className={`badge ${p.cantidad === 0 ? 'bg-danger' : 'bg-warning text-dark'} fs-6`}>
                      {p.cantidad} {p.cantidad === 1 ? 'unidad' : 'unidades'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ShoppingList;