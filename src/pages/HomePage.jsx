import AuthService from "../services/AuthService";

export default function HomePage({ onLogout }) {
  const user = AuthService.getUser();

  return (
    <div className="container py-5">
      <h2>Bienvenido, {user?.username}</h2>
      <button className="btn btn-danger mt-3" onClick={onLogout}>
        Cerrar sesión
      </button>

      <hr />
      <p>Aquí puedes acceder a las funciones de tu inventario 📦.</p>
      {/* Aquí puedes renderizar tus componentes del inventario */}
    </div>
  );
}
