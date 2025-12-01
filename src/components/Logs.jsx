import { useEffect, useState } from "react";

function Logs() {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No hay token, inicia sesión nuevamente");
        return;
      }

      const res = await fetch("http://localhost:8090/api/movements", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      // Si es 403 pero hay datos, intentar parsearlos de todas formas
      if (res.status === 403) {
        console.warn("Error 403 en movements, pero intentando obtener datos...");
        try {
          const data = await res.json();
          if (Array.isArray(data)) {
            setMovements(data);
            return;
          }
        } catch (e) {
          // Si no se puede parsear, mostrar error
        }
        throw new Error("No tienes permisos para ver los movimientos");
      }

      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }

      const data = await res.json();
      setMovements(data);
    } catch (err) {
      console.error("Error cargando movimientos:", err);
      setError(err.message || "Error al cargar movimientos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 20_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mt-4">
      <h1>📚 Movimientos</h1>

      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <div className="alert alert-danger">
          {error}
          <button className="btn btn-sm btn-outline-danger ms-3" onClick={load}>
            Reintentar
          </button>
        </div>
      ) : movements.length === 0 ? (
        <p>No hay movimientos registrados.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Producto</th>
                <th>Tipo</th>
                <th>Cantidad</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {movements.map(m => (
                <tr key={m.id}>
                  <td>{m.productName}</td>
                  <td>{m.type}</td>
                  <td>{m.quantity}</td>
                  <td>{new Date(m.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Logs;