import { useEffect, useState } from "react";
import api from "../services/api";

function Reports() {
  const [byCategory, setByCategory] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("📊 Cargando reportes...");
      
      // Cambiar rutas para que coincidan con tu API
      const resCategory = await api.get("/reports/by-category");
      const resLowStock = await api.get("/reports/low-stock");

      console.log("✅ Reportes cargados:", {
        categorias: resCategory.data.length,
        bajoStock: resLowStock.data.length
      });

      setByCategory(resCategory.data);
      setLowStock(resLowStock.data);
    } catch (err) {
      console.error("❌ Error cargando reportes:", err);
      setError(err.response?.data?.message || "No se pudieron cargar los reportes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando reportes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <strong>Error:</strong> {error}
          <button className="btn btn-sm btn-outline-danger ms-3" onClick={loadReports}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">📊 Reportes</h1>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Productos por Categoría</h5>
            </div>
            <div className="card-body">
              {byCategory.length === 0 ? (
                <p className="text-muted">No hay datos disponibles</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Categoría</th>
                        <th className="text-end">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {byCategory.map((c, idx) => (
                        <tr key={idx}>
                          <td>{c.category}</td>
                          <td className="text-end">
                            <span className="badge bg-primary">{c.count}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header bg-warning text-dark">
              <h5 className="mb-0">Productos con Bajo Stock (≤ 3)</h5>
            </div>
            <div className="card-body">
              {lowStock.length === 0 ? (
                <div className="alert alert-success mb-0">
                  ✅ No hay productos con bajo stock
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th className="text-end">Cantidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lowStock.map((p) => (
                        <tr key={p.id}>
                          <td>{p.nombre}</td>
                          <td className="text-end">
                            <span className="badge bg-danger">{p.cantidad}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;