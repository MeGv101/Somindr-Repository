import { Outlet, useNavigate, Link } from "react-router-dom";

import { useAuth } from "../context/authContext";

export default function AdminLayout() {

  const navigate = useNavigate();

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

  return (

    <div className="admin-layout">

      <header className="admin-header">

        <a href="/">
        <h2>
          Panel de Administración
        </h2>
        </a>

        <div>

          <span>
            {user?.nombre}
          </span>

          <button
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>

        </div>

        <Link to="/users">
          Usuarios
        </Link>

        <Link to="/solicitudes">
          Solicitudes
        </Link>

      </header>

      <main>

        <Outlet />

      </main>

    </div>

  );

}