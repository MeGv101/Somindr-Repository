import { useEffect, useRef, useState } from "react";
import "/src/styles/comunidad.css";
import Footer from "../components/footer";
import { SearchBar } from "../components/searchBar";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

interface Reply {
  id: number;
  content: string;
  createdAt: string;
  likes: number;
  dislikes: number;
  userReaction: "LIKE" | "DISLIKE" | null;
  authorId: number;
  username: string;
  nombre: string;
  role: string;
}
interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  dislikes: number;
  userReaction: "LIKE" | "DISLIKE" | null;
  comments: Reply[];
  edited: boolean;
  authorId: number;
  username: string;
  nombre: string;
  role: string;
  expandido: boolean;
}

const CAT = {
  Nutrición: {
    background: "#3b3b3b",
    color: "#a0c90c",
  },
  Físico: {
    background: "#3b3b3b",
    color: "#f2322c",
  },
  Emociones: {
    background: "#3b3b3b",
    color: "#63e686",
  },
} as Record<string, React.CSSProperties>;

// ==========================================================
// Dropdown de categoría, todo en este mismo archivo.
// Reemplaza al <select> nativo porque los navegadores no
// dejan tematizar bien las <option> del popup nativo.
// ==========================================================
interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  getStyle: (category: string) => React.CSSProperties;
}

function CategorySelect({ value, onChange, getStyle }: CategorySelectProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const categorias = ["Nutrición", "Físico", "Emociones"];

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onClickOutside);

    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="custom-select" ref={wrapRef}>
      <button
        type="button"
        className="custom-select-trigger"
        style={getStyle(value)}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{value}</span>

        <svg
          className={`custom-select-arrow ${open ? "open" : ""}`}
          viewBox="0 0 12 8"
          width="12"
          height="8"
        >
          <path
            d="M1 1l5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open && (
        <div className="custom-select-menu">
          {categorias.map((categoria) => (
            <div
              key={categoria}
              className={`custom-select-option ${
                categoria === value ? "selected" : ""
              }`}
              style={getStyle(categoria)}
              onClick={() => {
                onChange(categoria);
                setOpen(false);
              }}
            >
              {categoria}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Comunidad() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [titulo, setTitulo] = useState("");
  const [texto, setTexto] = useState("");
  const [cat, setCat] = useState("Nutrición");
  const [filtro, setFiltro] = useState("Todos");
  const [form, setForm] = useState(false);
  const [rActivo, setRActivo] = useState<number | null>(null);
  const [rTexto, setRTexto] = useState<Record<number, string>>({});
  const tituloRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    loadPosts();
  }, []);
  const [reportandoPost, setReportandoPost] = useState<number | null>(null);

  const [motivoReporte, setMotivoReporte] = useState("");

  const [enviandoReporte, setEnviandoReporte] = useState(false);
  const formatDate = (date: string) =>
    new Date(date).toLocaleString("es-SV", {
      dateStyle: "short",
      timeStyle: "short",
    });
  const getCategoryStyle = (category: string) =>
    CAT[category] ?? {
      bg: "#444",
      color: "#fff",
    };

  const toggle = (id: number) => {
    setPosts((posts) =>
      posts.map((post) =>
        post.id === id
          ? {
              ...post,
              expandido: !post.expandido,
            }
          : post,
      ),
    );
  };

  async function reportar() {
    if (reportandoPost === null || !motivoReporte) {
      return;
    }

    const token = localStorage.getItem("token");

    setEnviandoReporte(true);

    try {
      const response = await fetch(
        `/api/community/posts/${reportandoPost}/report`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            reason: motivoReporte,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "No se pudo enviar el reporte.");

        return;
      }

      alert("Reporte enviado correctamente.");

      setReportandoPost(null);
      setMotivoReporte("");
    } catch {
      alert("No se pudo conectar con el servidor.");
    } finally {
      setEnviandoReporte(false);
    }
  }

  async function loadPosts() {
    const token = localStorage.getItem("token");
    const response = await fetch(
      "/api/community/posts",

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      alert("No se pudieron cargar las publicaciones.");
      return;
    }

    const data = await response.json();
    setPosts(
      data.map((post: Post) => ({
        ...post,
        expandido: false,
      })),
    );
  }

  async function publicar() {
    if (!titulo.trim()) {
      alert("Escribe un título.");
      return;
    }

    if (!texto.trim()) {
      alert("Escribe el contenido.");
      return;
    }

    const token = localStorage.getItem("token");

    const response = await fetch("/api/community/posts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        title: titulo,
        content: texto,
        category: cat,
      }),
    });

    if (!response.ok) {
      alert("No se pudo crear la publicación.");
      return;
    }
    setTitulo("");
    setTexto("");
    setForm(false);
    await loadPosts();
  }

  async function react(id: number, type: "LIKE" | "DISLIKE") {
    const token = localStorage.getItem("token");
    const response = await fetch(`/api/community/posts/${id}/reaction`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type,
      }),
    });

    if (!response.ok) {
      alert("No se pudo registrar la reacción.");
      return;
    }

    await loadPosts();
  }
  async function responder(postId: number) {
    const contenido = rTexto[postId]?.trim();

    if (!contenido) {
      return;
    }

    const token = localStorage.getItem("token");

    const response = await fetch(`/api/community/posts/${postId}/comments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,

        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        content: contenido,
      }),
    });

    if (!response.ok) {
      alert("No se pudo responder.");
      return;
    }

    setRTexto((p) => ({
      ...p,
      [postId]: "",
    }));
    setRActivo(null);
    await loadPosts();
  }

  const visible =
    filtro === "Todos"
      ? posts
      : posts.filter((post) => post.category === filtro);
  return (
    <div className="foro">
      <div className="titulo-hero">
        <div className="aurora">
          <span className="blob b1"></span>
          <span className="blob b2"></span>
          <span className="blob b3"></span>
          <span className="blob b4"></span>
          <span className="blob b5"></span>
        </div>

        <h1 ref={tituloRef}>Somindr</h1>
        <h2>En este proceso no estás solo</h2>
        <p>Comparte tu experiencia y aprende junto a otros usuarios.</p>
      </div>

      <div className="foro-header">
        <SearchBar />
        <p>Comunidad</p>
        <h1>Foro Somindr</h1>
        <small>Comparte, pregunta y aprende con otros.</small>
      </div>

      <div className="foro-body">
        <div className="foro-filtros">
          {["Todos", "Nutrición", "Físico", "Emociones"].map((c) => (
            <button
              key={c}
              className={filtro === c ? "foro-on" : ""}
              onClick={() => setFiltro(c)}
            >
              {c}
            </button>
          ))}

          <button className="foro-btn-nuevo" onClick={() => setForm(!form)}>
            + Publicar
          </button>
        </div>

        {form && (
          <div className="foro-form">
            <input
              type="text"
              className="tit"
              placeholder="Título"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />

            <textarea
              autoFocus
              placeholder="¿Qué quieres compartir o preguntar?"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
            />

            <div className="foro-form-acciones">
              <CategorySelect
                value={cat}
                onChange={setCat}
                getStyle={getCategoryStyle}
              />

              <button className="foro-btn-ok" onClick={publicar}>
                Publicar
              </button>

              <button
                className="foro-btn-cancel"
                onClick={() => setForm(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {visible.length === 0 && (
          <p className="foro-vacio">No hay publicaciones todavía.</p>
        )}

        {visible.map((post, i) => (
          <div
            key={post.id}
            className="foro-post"
            style={{
              animationDelay: `${i * 70}ms`,
            }}
          >
            <div className="foro-post-body">
              <div className="foro-post-meta">
                <span
                  className="foro-tag"
                  style={getCategoryStyle(post.category)}
                >
                  {post.category}
                </span>

                <span className="foro-tiempo">
                  {formatDate(post.createdAt)}
                </span>
              </div>

              <h3>{post.title}</h3>

              <p>{post.content}</p>

              <div className="foro-acciones">
                <button
                  className={`foro-btn-voto ${
                    post.userReaction === "LIKE" ? "on" : ""
                  }`}
                  onClick={() => react(post.id, "LIKE")}
                >
                  ↑ {post.likes}
                </button>

                <button
                  className={`foro-btn-voto ${
                    post.userReaction === "DISLIKE" ? "on" : ""
                  }`}
                  onClick={() => react(post.id, "DISLIKE")}
                >
                  ↓ {post.dislikes}
                </button>

                <button
                  className="foro-btn-ghost"
                  onClick={() => toggle(post.id)}
                >
                  {post.comments.length}{" "}
                  {post.comments.length === 1 ? "comentario" : "comentarios"}
                </button>

                <button
                  className="foro-btn-responder"
                  onClick={() => {
                    setRActivo(rActivo === post.id ? null : post.id);

                    if (!post.expandido) toggle(post.id);
                  }}
                >
                  Responder
                </button>

                <button
                  className="foro-btn-ghost"
                  onClick={() => {
                    setReportandoPost(post.id);
                    setMotivoReporte("");
                  }}
                >
                  Reportar
                </button>
              </div>
            </div>
            {post.expandido && (
              <div className="foro-replies">
                {post.comments.length === 0 && (
                  <p className="foro-vacio">Sé el primero en responder.</p>
                )}

                {post.comments.map((comment, i) => (
                  <div
                    key={comment.id}
                    className="foro-reply"
                    style={{
                      animationDelay: `${i * 60}ms`,
                    }}
                  >
                    <div className="foro-post-meta">
                      <strong>{comment.nombre}</strong>

                      <span className="foro-tiempo">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>

                    <p>{comment.content}</p>
                  </div>
                ))}

                {rActivo === post.id ? (
                  <div className="foro-reply-form">
                    <textarea
                      autoFocus
                      placeholder="Tu respuesta..."
                      value={rTexto[post.id] ?? ""}
                      onChange={(e) =>
                        setRTexto((prev) => ({
                          ...prev,
                          [post.id]: e.target.value,
                        }))
                      }
                    />

                    <div className="foro-reply-btns">
                      <button
                        className="foro-btn-ok-sm"
                        onClick={() => responder(post.id)}
                      >
                        Publicar
                      </button>

                      <button
                        className="foro-btn-cancel-sm"
                        onClick={() => setRActivo(null)}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="foro-btn-add"
                    onClick={() => setRActivo(post.id)}
                  >
                    Añadir respuesta
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {reportandoPost !== null && (
        <div className="reporte-overlay">
          <div className="reporte-modal">
            <h2>Reportar publicación</h2>

            <p>Selecciona el motivo del reporte.</p>

            <select
              value={motivoReporte}
              onChange={(e) => setMotivoReporte(e.target.value)}
            >
              <option value="">Selecciona un motivo</option>

              <option value="spam">Spam</option>

              <option value="harassment">Acoso o insultos</option>

              <option value="inappropriate">Contenido inapropiado</option>

              <option value="dangerous">Contenido peligroso</option>

              <option value="impersonation">Suplantación de identidad</option>

              <option value="other">Otro</option>
            </select>

            <div className="reporte-acciones">
              <button
                className="foro-btn-cancel"
                disabled={enviandoReporte}
                onClick={() => {
                  setReportandoPost(null);
                  setMotivoReporte("");
                }}
              >
                Cancelar
              </button>

              <button
                className="foro-btn-ok"
                disabled={!motivoReporte || enviandoReporte}
                onClick={reportar}
              >
                {enviandoReporte ? "Enviando..." : "Enviar reporte"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
