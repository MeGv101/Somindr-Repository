import { useEffect, useState } from "react";
import "../styles/moderacion.css";

type Report = {
  id: number;
  postId: number;
  postTitle: string;
  reason: string;
  description: string | null;
  status: string;
  createdAt: string;
  reporterUsername: string;
  authorUsername: string;
};

const REASON_LABELS: Record<string, string> = {
  spam: "Spam",
  harassment: "Acoso",
  inappropriate: "Contenido inapropiado",
  dangerous: "Contenido peligroso",
  impersonation: "Suplantación",
  other: "Otro",
};

export default function Reportes() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/reports", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error();
      setReports(await response.json());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function resolveReport(id: number, status: "resolved" | "dismissed") {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/admin/reports/${id}/resolve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        alert("No se pudo actualizar el reporte.");
        return;
      }

      loadReports();
    } catch (error) {
      console.error(error);
    }
  }

  async function deletePost(postId: number, reportId: number) {
    if (!confirm("¿Eliminar la publicación reportada?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        alert("No se pudo eliminar la publicación.");
        return;
      }

      await resolveReport(reportId, "resolved");
    } catch (error) {
      console.error(error);
    }
  }

  const filteredReports =
    filter === "all"
      ? reports
      : reports.filter((r) => r.status === filter);

  if (loading) {
    return (
      <div className="moderacion-page">
        <div className="dashboard-loading">
          <div className="spinner"></div>
          <p>Cargando reportes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="moderacion-page">
      <header className="moderacion-header">
        <div>
          <h1>Reportes de Publicaciones</h1>
          <p className="subtitle">Publicaciones reportadas por la comunidad</p>
        </div>
      </header>

      <div className="solicitudes-filters">
        <button
          className={`filter-btn ${filter === "pending" ? "active" : ""}`}
          onClick={() => setFilter("pending")}
        >
          Pendientes
        </button>
        <button
          className={`filter-btn ${filter === "resolved" ? "active" : ""}`}
          onClick={() => setFilter("resolved")}
        >
          Resueltos
        </button>
        <button
          className={`filter-btn ${filter === "dismissed" ? "active" : ""}`}
          onClick={() => setFilter("dismissed")}
        >
          Descartados
        </button>
        <button
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          Todos
        </button>
      </div>

      {filteredReports.length === 0 ? (
        <div className="empty-state">
          <h3>No hay reportes</h3>
          <p>No hay reportes con este estado.</p>
        </div>
      ) : (
        <div className="moderacion-list">
          {filteredReports.map((report) => (
            <div key={report.id} className="card moderacion-card">
              <div className="moderacion-card-header">
                <span className="badge badge-warning">
                  {REASON_LABELS[report.reason] ?? report.reason}
                </span>
                <span className={`badge ${report.status === "pending" ? "badge-danger" : "badge-success"}`}>
                  {report.status}
                </span>
              </div>

              <h3>{report.postTitle}</h3>

              {report.description && (
                <p className="moderacion-content">{report.description}</p>
              )}

              <div className="moderacion-meta">
                <span>Autor: @{report.authorUsername}</span>
                <span>Reportado por: @{report.reporterUsername}</span>
                <span>
                  {new Date(report.createdAt).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              {report.status === "pending" && (
                <div className="moderacion-actions">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deletePost(report.postId, report.id)}
                  >
                    Eliminar publicación
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => resolveReport(report.id, "dismissed")}
                  >
                    Descartar reporte
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}