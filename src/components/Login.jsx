import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    const usuarioEncontrado = usuarios.find(
      u => u.usuario === usuario && u.password === password
    );

    // Mantén el login de admin
    if (usuario === "admin" && password === "admin") {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currentUser", "admin");
      onLogin();
      navigate("/");
    } else if (usuarioEncontrado) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currentUser", usuarioEncontrado.nombre);
      onLogin();
      navigate("/");
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ width: "22rem" }}>
        <h3 className="text-center mb-3">Iniciar sesión</h3>
        
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Usuario</label>
            <input
              type="text"
              className="form-control"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mb-3">
            Entrar
          </button>

          <div className="text-center">
            <span>¿No tienes cuenta? </span>
            <a href="/register" className="text-decoration-none">
              Regístrate aquí
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}