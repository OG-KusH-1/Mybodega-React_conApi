import React from 'react';
import { Link } from 'react-router-dom';

export default function Header(){
  return (
    <header className="bg-dark text-white p-3 mb-3">
      <div className="container d-flex justify-content-between align-items-center">
        <h1 className="h4 m-0">📦 Mi Bodega</h1>
        <nav>
          <Link to="/" className="text-white me-3">Inventario</Link>
          <Link to="/reportes" className="text-white">Reportes</Link>
        </nav>
      </div>
    </header>
  );
}
