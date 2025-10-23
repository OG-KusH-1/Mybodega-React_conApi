import { useState, useEffect } from "react";
import DataService from "../services/DataService";

export default function Logs() {
  const [logs, setLogs] = useState(DataService.loadLogs());

  useEffect(() => {
    function actualizarLogs() {
      setLogs(DataService.loadLogs());
    }

    window.addEventListener("storage", actualizarLogs);
    return () => window.removeEventListener("storage", actualizarLogs);
  }, []);

  return (
    <div className="container mt-4">
      <h2>Historial de movimientos</h2>
      <ul className="list-group">
        {logs.length === 0 ? (
          <li className="list-group-item text-muted">No hay registros</li>
        ) : (
          logs.map((log, i) => (
            <li key={i} className="list-group-item">{log}</li>
          ))
        )}
      </ul>
    </div>
  );
}
