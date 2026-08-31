import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";

import { useAuth } from "../context/authContext";

import "../styles/layout.css";

export default function AdminLayout() {

  const navigate = useNavigate();
  const location = useLocation();

  const {
    logout,
    user,
  } = useAuth();

  function handleLogout() {

    logout();

    navigate(
      "/login",
      {
        replace: true,
      }
    );

  }

  const isActive = (path: string) =>
    location.pathname === path;

  return (

    <div className="admin-layout">

      <aside className="admin-sidebar">

        <Link to="/" className="admin-brand">
          Somindr <span>Admin</span>
        </Link>

        <nav className="admin-nav">

          <Link
            to="/"
            className={isActive("/") ? "active" : ""}
          >
            Panel
          </Link>

          <Link
            to="/users"
            className={isActive("/users") ? "active" : ""}
          >
            Usuarios
          </Link>

          <Link
            to="/solicitudes"
            className={isActive("/solicitudes") ? "active" : ""}
          >
            Solicitudes
          </Link>

          <Link
            to="/moderacion"
            className={isActive("/moderacion") ? "active" : ""}
          >
            Moderación
          </Link>

          <Link
            to="/reportes"
            className={isActive("/reportes") ? "active" : ""}
          >
            Reportes
          </Link>

        </nav>

        <div className="admin-user">
          <div className="admin-user-name">{user?.nombre}</div>
          <button onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>

      </aside>

      <main className="admin-main">
        <Outlet />
      </main>

    </div>

  );

}