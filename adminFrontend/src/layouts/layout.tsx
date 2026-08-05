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

        <h2>
          Panel de Administración
        </h2>

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

      </header>

      <main>

        <Outlet />

      </main>

    </div>

  );

}