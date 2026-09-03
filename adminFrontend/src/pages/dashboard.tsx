import { useEffect, useState } from "react";
import "../styles/dashboard.css";

type DashboardData = {
  totalUsers: number;
  totalProfessionals: number;
};

export default function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("No autorizado.");
      }

      const data = await response.json();
      setDashboard(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <div className="spinner"></div>
          <p>Cargando panel de control...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* HEADER */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="header-icon"></div>
          <div>
            <h1>Panel de Administración</h1>
            <p className="subtitle">Visión general del sistema</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn btn-sm btn-outline">
            <span>⟳</span> Actualizar
          </button>
          <button className="btn btn-sm btn-primary">
            <span>+</span> Nuevo
          </button>
        </div>
      </header>

      {/* STATS GRID */}
      <div className="dashboard-stats">
        <div className="stat-card accent-green">
          <div className="stat-icon"></div>
          <div className="stat-label">Total Usuarios</div>
          <div className="stat-number">{dashboard?.totalUsers ?? 0}</div>
          <div className="stat-change positive">
            <span>↑</span> 12% este mes
          </div>
        </div>

        <div className="stat-card accent-gold">
          <div className="stat-icon"></div>
          <div className="stat-label">Profesionales</div>
          <div className="stat-number">{dashboard?.totalProfessionals ?? 0}</div>
          <div className="stat-change positive">
            <span>↑</span> 8% este mes
          </div>
        </div>


      </div>

      {}
      <div className="dashboard-activity">
        <div className="section-header">
          <h2>Actividad Reciente</h2>

        </div>
        <div className="activity-empty">
          <div className="empty-icon"></div>
          <p>No hay actividad reciente para mostrar</p>
          <span className="empty-sub">Los movimientos aparecerán aquí</span>
        </div>
      </div>
    </div>
  );
}