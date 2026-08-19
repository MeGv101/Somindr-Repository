import { useEffect, useState } from "react";
import "../styles/usuarios.css";

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
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error();
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function suspendUser(id: number) {
    const token = localStorage.getItem("token");
    await fetch(`/api/admin/users/${id}/suspend`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadUsers();
  }

  async function unsuspendUser(id: number) {
    const token = localStorage.getItem("token");
    await fetch(`/api/admin/users/${id}/unsuspend`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadUsers();
  }

  async function deactivateProfessional(id: number) {
    const token = localStorage.getItem("token");
    await fetch(`/api/admin/users/${id}/deactivate-professional`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadUsers();
  }

  async function reactivateProfessional(id: number) {
    const token = localStorage.getItem("token");
    await fetch(`/api/admin/users/${id}/reactivate-professional`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadUsers();
  }

  const getRoleBadge = (role: string) => {
    const roleMap: Record<string, string> = {
      admin: "admin",
      user: "user",
      professional: "professional",
    };
    return roleMap[role.toLowerCase()] || "user";
  };

  const getStatusClass = (user: User) => {
    if (user.suspended) return "suspended";
    return "active";
  };

  const filteredUsers = users.filter(
    (user) =>
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="usuarios-page">
        <div className="dashboard-loading">
          <div className="spinner"></div>
          <p>Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="usuarios-page">
      {/* HEADER */}
      <header className="usuarios-header">
        <div>
          <h1>Gestión de Usuarios</h1>
          <p className="subtitle">Administra los usuarios del sistema</p>
        </div>
        <div className="header-actions">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-primary btn-sm">
            <span>+</span> Nuevo usuario
          </button>
        </div>
      </header>

      {/* STATS BAR */}
      <div className="usuarios-stats-bar">
        <div className="stat-item">
          <span className="stat-label">Total</span>
          <span className="stat-number">{users.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Activos</span>
          <span className="stat-number">{users.filter((u) => !u.suspended).length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Suspendidos</span>
          <span className="stat-number">{users.filter((u) => u.suspended).length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Profesionales</span>
          <span className="stat-number">
            {users.filter((u) => u.professionalId !== null).length}
          </span>
        </div>
      </div>

      {/* TABLE */}
      {filteredUsers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No se encontraron usuarios</h3>
          <p>Intenta con otro término de búsqueda</p>
        </div>
      ) : (
        <div className="usuarios-table-wrapper">
          <table className="usuarios-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Profesional</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {user.nombre.charAt(0)}
                        {user.apellido.charAt(0)}
                      </div>
                      <div>
                        <div className="user-name">
                          {user.nombre} {user.apellido}
                        </div>
                        <div className="user-username">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="user-email">{user.email}</span>
                  </td>
                  <td>
                    <span className={`role-badge ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    {!user.professionalId ? (
                      <span className="badge badge-info">No</span>
                    ) : user.active ? (
                      <span className="badge badge-success">Activo</span>
                    ) : (
                      <span className="badge badge-warning">Inactivo</span>
                    )}
                  </td>
                  <td>
                    <span className={`status-text ${getStatusClass(user)}`}>
                      <span className="dot"></span>
                      {user.suspended ? "Suspendido" : "Activo"}
                    </span>
                  </td>
                  <td>
                    <div className="usuarios-actions">
                      {user.suspended ? (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => unsuspendUser(user.id)}
                        >
                          🔓 Reactivar
                        </button>
                      ) : (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => suspendUser(user.id)}
                        >
                          🔒 Suspender
                        </button>
                      )}

                      {user.professionalId && user.active && (
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => deactivateProfessional(user.id)}
                        >
                          ⏸ Desactivar
                        </button>
                      )}

                      {user.professionalId && !user.active && (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => reactivateProfessional(user.id)}
                        >
                          ▶ Reactivar
                        </button>
                      )}

                      <button className="btn btn-outline btn-sm">
                        👁 Ver
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}