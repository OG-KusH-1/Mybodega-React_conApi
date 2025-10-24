import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    usuario: "",
    password: "",
    confirmarPassword: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Validaciones
    if (formData.password !== formData.confirmarPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    // Aquí guardarías el usuario (localStorage, API, etc.)
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    
    // Verificar si el usuario ya existe
    if (usuarios.find(u => u.usuario === formData.usuario)) {
      setError("El usuario ya existe");
      return;
    }

    usuarios.push({
      nombre: formData.nombre,
      email: formData.email,
      usuario: formData.usuario,
      password: formData.password
    });

    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    alert("Usuario registrado exitosamente");
    navigate("/login");
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ width: "28rem" }}>
        <h3 className="text-center mb-3">Crear cuenta</h3>
        
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombre completo</label>
            <input
              type="text"
              className="form-control"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Usuario</label>
            <input
              type="text"
              className="form-control"
              name="usuario"
              value={formData.usuario}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Confirmar contraseña</label>
            <input
              type="password"
              className="form-control"
              name="confirmarPassword"
              value={formData.confirmarPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mb-3">
            Registrarse
          </button>

          <div className="text-center">
            <span>¿Ya tienes cuenta? </span>
            <a href="/login" className="text-decoration-none">
              Inicia sesión aquí
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}