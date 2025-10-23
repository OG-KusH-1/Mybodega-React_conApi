import { Link } from 'react-router-dom';

export default function Header({ onLogout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">📦 Mi Bodega</Link>
        <div className="d-flex gap-3">
          <Link className="btn btn-outline-light" to="/">Inventario</Link>
          <Link className="btn btn-outline-light" to="/reportes">Reportes</Link>
          <a className="btn btn-outline-light" href="/compras">Lista de Compras</a>
          <a className="btn btn-outline-light" href="/logs">Movimientos</a>
          <button className="btn btn-danger" onClick={onLogout}>Cerrar sesión</button>
        </div>
      </div>
    </nav>
  );
}
