import { useEffect, useState } from "react";
import "../styles/moderacion.css";

type Post = {
  id: number;
  title: string;
  category: string;
  content: string;
  createdAt: string;
  authorId: number;
  authorUsername: string;
  reportCount: number;
};

export default function Moderacion() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [onlyReported, setOnlyReported] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error();
      setPosts(await response.json());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function deletePost(id: number) {
    if (!confirm("¿Eliminar esta publicación?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        alert("No se pudo eliminar.");
        return;
      }

      loadPosts();
    } catch (error) {
      console.error(error);
    }
  }

  const visiblePosts = onlyReported
    ? posts.filter((p) => p.reportCount > 0)
    : posts;

  if (loading) {
    return (
      <div className="moderacion-page">
        <div className="dashboard-loading">
          <div className="spinner"></div>
          <p>Cargando publicaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="moderacion-page">
      <header className="moderacion-header">
        <div>
          <h1>Moderación de Publicaciones</h1>
          <p className="subtitle">Revisa y elimina publicaciones de la comunidad</p>
        </div>
        <button
          className={`filter-btn ${onlyReported ? "active" : ""}`}
          onClick={() => setOnlyReported((v) => !v)}
        >
          Solo reportadas
        </button>
      </header>

      {visiblePosts.length === 0 ? (
        <div className="empty-state">
          <h3>No hay publicaciones</h3>
          <p>No hay nada que revisar en este momento.</p>
        </div>
      ) : (
        <div className="moderacion-list">
          {visiblePosts.map((post) => (
            <div key={post.id} className="card moderacion-card">
              <div className="moderacion-card-header">
                <span className="profession-tag">{post.category}</span>
                {post.reportCount > 0 && (
                  <span className="badge badge-danger">
                    {post.reportCount} reporte{post.reportCount > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              <h3>{post.title}</h3>
              <p className="moderacion-content">{post.content}</p>

              <div className="moderacion-meta">
                <span>@{post.authorUsername}</span>
                <span>
                  {new Date(post.createdAt).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className="moderacion-actions">
                <button className="btn btn-danger btn-sm" onClick={() => deletePost(post.id)}>
                  Eliminar publicación
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}