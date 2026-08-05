import { useEffect, useState } from "react";

type User = {
  id: number;
  nombre: string;
  apellido: string;
  username: string;
  email: string;
  role: string;
  suspended: boolean;

  professionalId: number | null;
  verified: boolean | null;
  active: boolean | null;
};

export default function Users() {

  const [users, setUsers] =
    useState<User[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    loadUsers();

  }, []);

  async function loadUsers() {

    try {

      const token =
        localStorage.getItem("token");

      const response =
        await fetch(
          "/api/admin/users",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      if (!response.ok) {
        throw new Error();
      }

      const data =
        await response.json();

      setUsers(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  }

  async function suspendUser(
    id: number
  ) {

    const token =
      localStorage.getItem("token");

    await fetch(
      `/api/admin/users/${id}/suspend`,
      {
        method: "PATCH",
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    loadUsers();

  }

  async function unsuspendUser(
    id: number
  ) {

    const token =
      localStorage.getItem("token");

    await fetch(
      `/api/admin/users/${id}/unsuspend`,
      {
        method: "PATCH",
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    loadUsers();

  }

  async function deactivateProfessional(
    id: number
  ) {

    const token =
      localStorage.getItem("token");

    await fetch(
      `/api/admin/users/${id}/deactivate-professional`,
      {
        method: "PATCH",
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    loadUsers();

  }

  async function reactivateProfessional(
    id: number
  ) {

    const token =
      localStorage.getItem("token");

    await fetch(
      `/api/admin/users/${id}/reactivate-professional`,
      {
        method: "PATCH",
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    loadUsers();

  }

  if (loading) {
    return <p>Cargando usuarios...</p>;
  }
  return (
  <main>
    <h1>Usuarios</h1>

    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Usuario</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Profesional</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.nombre} {user.apellido}</td>

            <td>@{user.username}</td>

            <td>{user.email}</td>

            <td>{user.role}</td>

            <td>
              {!user.professionalId
                ? "No"
                : user.active
                  ? "Activo"
                  : "Inactivo"}
            </td>

            <td>
              {user.suspended
                ? "Suspendido"
                : "Activo"}
            </td>

            <td style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {user.suspended ? (
                <button
                  onClick={() =>
                    unsuspendUser(user.id)
                  }
                >
                  Reactivar usuario
                </button>
              ) : (
                <button
                  onClick={() =>
                    suspendUser(user.id)
                  }
                >
                  Suspender
                </button>
              )}

              {user.professionalId &&
                user.active && (
                  <button
                    onClick={() =>
                      deactivateProfessional(user.id)
                    }
                  >
                    Desactivar profesional
                  </button>
                )}

              {user.professionalId &&
                !user.active && (
                  <button
                    onClick={() =>
                      reactivateProfessional(user.id)
                    }
                  >
                    Reactivar profesional
                  </button>
                )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </main>
);

}