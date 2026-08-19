import { useEffect, useState } from "react";
import "../styles/solicitudes.css";

interface ProfessionalRequest {
  id: number;
  userId: number;
  profession: string;
  message: string;
  status: string;
  createdAt: string;
}

interface RequestDetails {
  id: number;
  userId: number;
  profession: string;
  message: string;
  status: string;
  createdAt: string;
  adminComment: string | null;
}

export default function Solicitudes() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<ProfessionalRequest[]>([]);
  const [selected, setSelected] = useState<RequestDetails | null>(null);
  const [rejectModal, setRejectModal] = useState(false);
  const [comment, setComment] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/professional-requests", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error();
      setRequests(await response.json());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function viewRequest(id: number) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/admin/professional-requests/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) return;
      setSelected(await response.json());
    } catch (error) {
      console.error(error);
    }
  }

  async function approve() {
    if (!selected) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `/api/admin/professional-requests/${selected.id}/approve`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        alert("No se pudo aprobar.");
        return;
      }

      alert("Solicitud aprobada.");
      setSelected(null);
      loadRequests();
    } catch (error) {
      console.error(error);
    }
  }

  async function reject() {
    if (!selected) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `/api/admin/professional-requests/${selected.id}/reject`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ adminComment: comment }),
        }
      );

      if (!response.ok) {
        alert("No se pudo rechazar.");
        return;
      }

      alert("Solicitud rechazada.");
      setRejectModal(false);
      setSelected(null);
      setComment("");
      loadRequests();
    } catch (error) {
      console.error(error);
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "pending",
      approved: "approved",
      rejected: "rejected",
    };
    return statusMap[status.toLowerCase()] || "pending";
  };

  const filteredRequests =
    filter === "all"
      ? requests
      : requests.filter((r) => r.status.toLowerCase() === filter);

  return (
    <div className="solicitudes-page">
      {/* HEADER */}
      <header className="solicitudes-header">
        <div>
          <h1>Solicitudes de Profesionales</h1>
          <p className="subtitle">Gestiona las peticiones de verificación</p>
        </div>
        <div className="header-stats">
          <span>
            Total: <strong className="count">{requests.length}</strong>
          </span>
          <span>
            Pendientes:{" "}
            <strong className="count">
              {requests.filter((r) => r.status === "pending").length}
            </strong>
          </span>
        </div>
      </header>

      {/* FILTERS */}
      <div className="solicitudes-filters">
        <button
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          Todas
        </button>
        <button
          className={`filter-btn ${filter === "pending" ? "active" : ""}`}
          onClick={() => setFilter("pending")}
        >
          ⏳ Pendientes
        </button>
        <button
          className={`filter-btn ${filter === "approved" ? "active" : ""}`}
          onClick={() => setFilter("approved")}
        >
          ✅ Aprobadas
        </button>
        <button
          className={`filter-btn ${filter === "rejected" ? "active" : ""}`}
          onClick={() => setFilter("rejected")}
        >
          ❌ Rechazadas
        </button>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="solicitudes-loading">
          <div className="spinner"></div>
          <p>Cargando solicitudes...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No hay solicitudes</h3>
          <p>
            {filter === "all"
              ? "No hay solicitudes pendientes en este momento."
              : `No hay solicitudes con estado "${filter}"`}
          </p>
        </div>
      ) : (
        <div className="solicitudes-table-wrapper">
          <table className="solicitudes-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Profesión</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request.id}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {request.userId.toString().slice(0, 2)}
                      </div>
                      <div>
                        <div className="user-name">Usuario #{request.userId}</div>
                        <div className="user-id">ID: {request.userId}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="profession-tag">{request.profession}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusBadge(request.status)}`}>
                      <span className="dot"></span>
                      {request.status}
                    </span>
                  </td>
                  <td>
                    <span className="date-text">
                      {new Date(request.createdAt).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </td>
                  <td>
                    <div className="col-actions">
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => viewRequest(request.id)}
                      >
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

      {/* DETAIL MODAL */}
      {selected && (
        <div className="solicitudes-modal-overlay" onClick={() => setSelected(null)}>
          <div className="solicitudes-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}>
              ✕
            </button>

            <h2>Detalle de Solicitud</h2>

            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Usuario</span>
                <span className="detail-value">#{selected.userId}</span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Profesión</span>
                <span className="detail-value">
                  <span className="profession-tag">{selected.profession}</span>
                </span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Estado</span>
                <span className="detail-value">
                  <span className={`status-badge ${getStatusBadge(selected.status)}`}>
                    <span className="dot"></span>
                    {selected.status}
                  </span>
                </span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Fecha</span>
                <span className="detail-value">
                  {new Date(selected.createdAt).toLocaleString("es-ES", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div className="detail-row full-width">
                <span className="detail-label">Descripción</span>
                <div className="detail-value message">{selected.message}</div>
              </div>

              {selected.adminComment && (
                <div className="detail-row full-width">
                  <span className="detail-label">Comentario</span>
                  <div className="detail-value message reject-comment">
                    {selected.adminComment}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button className="btn btn-success" onClick={approve}>
                ✅ Aprobar
              </button>
              <button className="btn btn-danger" onClick={() => setRejectModal(true)}>
                ❌ Rechazar
              </button>
              <button className="btn btn-outline" onClick={() => setSelected(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {rejectModal && (
        <div
          className="solicitudes-modal-overlay"
          onClick={() => setRejectModal(false)}
        >
          <div className="solicitudes-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setRejectModal(false)}>
              ✕
            </button>

            <h2>Motivo del Rechazo</h2>

            <div className="modal-body">
              <p className="reject-instruction">
                Por favor, proporciona un motivo para el rechazo de esta solicitud.
              </p>
              <textarea
                className="input-field"
                rows={5}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Escribe el motivo del rechazo..."
              />
            </div>

            <div className="modal-actions">
              <button className="btn btn-danger" onClick={reject}>
                ✅ Confirmar rechazo
              </button>
              <button className="btn btn-outline" onClick={() => setRejectModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}