import { useEffect, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";

import avatar1 from "../assets/avatars/avatar1.jpeg";
import avatar2 from "../assets/avatars/avatar2.jpeg";
import avatar3 from "../assets/avatars/avatar3.jpeg";
import avatar4 from "../assets/avatars/avatar4.jpeg";
import avatar5 from "../assets/avatars/avatar5.jpeg";
import avatar6 from "../assets/avatars/avatar6.jpeg";
import avatar7 from "../assets/avatars/avatar7.jpeg";
import avatar8 from "../assets/avatars/avatar8.jpeg";

import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useAuth } from "../context/authContext";

import "../styles/perfil.css";

type ProfessionalInfo = {
  id: number;
  profession: string;
  verified: boolean;
  acceptingClients: boolean;
};

type Profile = {
  nombre: string;
  apellido: string;
  username: string;
  fotoPerfil: number;
  biografia: string;
  professional: ProfessionalInfo | null;
};

type Post = {
  id: number;
  title: string;
  category: string;
  content: string;
  createdAt: string;
  // Estos tres campos son opcionales: si tu backend todavía no los
  // devuelve, la interfaz simplemente muestra 0 en vez de romperse.
  upvotes?: number;
  downvotes?: number;
  commentsCount?: number;
};

// Categorías fijas de publicación. Deben coincidir con los valores
// que tu backend espera guardar en el campo "category" del post.
const POST_CATEGORIES = [
  "Nutrición",
  "Físico",
  "Psicoemocional",
] as const;

export default function Profile() {
  const { username } = useParams();
    const { user } = useAuth();
  

  const esMiPerfil =
  !username ||
  username === user?.username;


  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const avatars = [
    avatar1,
    avatar2,
    avatar3,
    avatar4,
    avatar5,
    avatar6,
    avatar7,
    avatar8,
  ];



  interface ProfessionalContact {
      type: string;
      value: string;
    }

    interface ProfessionalProfile {
      id: number;
      profession: string;
      description: string;
      pricePerHour: number;
      verified: boolean;
      contacts: ProfessionalContact[];
    }

  const [purchased, setPurchased] =
  useState(false);

  const [professional, setProfessional] =
  useState<ProfessionalProfile | null>(null);

  // Pestaña activa del filtro de publicaciones ("Todos" o una categoría)
  const [selectedTab, setSelectedTab] =
    useState<string>("Todos");

  // Modal para crear una publicación nueva (solo visible en tu propio perfil)
  const [createPostOpen, setCreatePostOpen] =
    useState(false);

  const [newPost, setNewPost] =
    useState({
      title: "",
      category: POST_CATEGORIES[0] as string,
      content: "",
    });

  const filteredPosts =
    selectedTab === "Todos"
    ? posts
    : posts.filter(
        (post) => post.category === selectedTab
      );

  useEffect(() => {
    cargarPerfil();
  }, [username]);

  async function cargarPerfil() {
    try {

      const token = localStorage.getItem("token");

      const endpoint = esMiPerfil
        ? "/api/users/me"
        : `/api/users/${username}`;

      const response = await fetch(endpoint, {
        headers: {
          Authorization: token
            ? `Bearer ${token}`
            : "",
        },
      });

      if (!response.ok) throw new Error();
      const data = await response.json();
      setPerfil(data);
      await cargarPosts(data.username);
      const professionalResponse = await fetch(
        `/api/profile/professional/${data.username}`
      );
      if (professionalResponse.ok) {
        const professionalData =
          await professionalResponse.json();
        setProfessional(professionalData);
        if (token) {
          const purchaseResponse =
            await fetch(
              `/api/professionals/${professionalData.id}/purchased`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          if (purchaseResponse.ok) {
            const purchaseData =
              await purchaseResponse.json();
            setPurchased(
              purchaseData.purchased
            );
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function contratarProfesional(professionalId: number) {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        `/api/professionals/${professionalId}/hire`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({})
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error("ERROR PAYPAL:", error);
        return;
      }

      const data = await response.json();

      console.log("PAYPAL ORDER:", data);

      const approveLink = data.links?.find(
        (link: any) => link.rel === "approve"
      );

      if (!approveLink) {
        console.error("No se encontró link de aprobación.");
        return;
      }

      window.location.href = approveLink.href;

    } catch (error) {
      console.error("Error creando orden:", error);
    }

  }

  async function cargarPosts(username: string) {
    console.log("Buscando publicaciones de:", username);

    try {
        const response = await fetch(
        `/api/community/user/${username}`
        );

        console.log(response.status);

        const data = await response.json();

        console.log(data);

        setPosts(data);
    } catch (err) {
        console.error(err);
    }
    }

  // Envía la publicación nueva al backend.
  // NOTA: se asume el endpoint POST /api/community con body
  // { title, category, content }. Ajusta la ruta/campos si tu
  // backend usa otro contrato.
  async function crearPublicacion() {

    if (!newPost.title.trim() || !newPost.content.trim()) {
      alert("Completa el título y el contenido antes de publicar.");
      return;
    }

    try {

      const token = localStorage.getItem("token");

      const response = await fetch("/api/community", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPost),
      });

      if (!response.ok) {
        alert("No se pudo publicar. Intenta de nuevo.");
        return;
      }

      setCreatePostOpen(false);

      setNewPost({
        title: "",
        category: POST_CATEGORIES[0],
        content: "",
      });

      if (perfil) {
        await cargarPosts(perfil.username);
      }

    } catch (err) {
      console.error(err);
      alert("Error del servidor al publicar.");
    }

  }

  
  if (loading) {
    return (
      <>
        <main className="main profile-page">
          <p>Cargando perfil...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!perfil) {
    return (
      <>
        <main className="main profile-page">
          <p>Usuario no encontrado.</p>
        </main>
        <Footer />
      </>
    );
  }

  if (user?.username === username){
    return <Navigate to="/perfil" replace />;
  }

  return (
    <>

      <main className="main">

        <section className="pf-header">

          <div className="avatar-wrap">

            <div className="avatar-circle">
            <img
                src= {avatars[perfil.fotoPerfil - 1]}
                alt={perfil.username}
              />       
            </div>

          </div>

          <div className="pf-info">

            <h1 className="pf-name">
              {perfil.nombre} {perfil.apellido}
            </h1>

            <p className="pf-sub">
              @{perfil.username}
            </p>

            {perfil.professional && (
              <span className="badge-profesional">
                Profesional verificado
              </span>
            )}

          </div>
            {
              professional &&
              !esMiPerfil && (

                purchased ? (

                  <button
                    className="btn-guardar"
                  >
                    Chatear con profesional
                  </button>

                ) : (

                  <button
                    className="btn-guardar"
                    onClick={() =>
                      contratarProfesional(
                        professional.id
                      )
                    }
                  >
                    Contratar profesional
                  </button>

                )

              )
            }

          {esMiPerfil && (
            <Link
              to="/profile/configuration"
              className="btn-guardar"
            >
              Configuración
            </Link>
          )}

        </section>

        <div className="card">

          <h3>
            Sobre <span className="verde"> mí</span>
          </h3>
          <p>
            {perfil.biografia?.trim()
              ? perfil.biografia
              : "Este usuario todavía no ha escrito una biografía."}
          </p>

        </div>


        {
          professional && (

          <div className="card">

            <h3>
              Profesional
            </h3>

            <p>
              {professional.profession}
            </p>

            <p>
              {professional.description}
            </p>

            <p>
              ${professional.pricePerHour}/hora
            </p>

            {professional.verified && (
              <span className="verified">
                ✔ Verificado
              </span>
              
            )}
            <h4>
              Contacto
            </h4>

            {
              professional.contacts.map(
                (contact, index) => (

                <p key={index}>
                  <strong>
                    {contact.type}:
                  </strong>{" "}
                  {contact.value}
                </p>

              ))
            }

          </div>

          )
          }


        <div className="card">

        <div className="post-toolbar">

          <div className="post-tabs">

            <button
              type="button"
              className={
                `post-tab ${
                  selectedTab === "Todos" ? "active" : ""
                }`
              }
              onClick={() => setSelectedTab("Todos")}
            >
              Todos
            </button>

            {
              POST_CATEGORIES.map((cat) => (

                <button
                  key={cat}
                  type="button"
                  className={
                    `post-tab ${
                      selectedTab === cat ? "active" : ""
                    }`
                  }
                  onClick={() => setSelectedTab(cat)}
                >
                  {cat}
                </button>

              ))
            }

          </div>

          {
            esMiPerfil && (

              <button
                type="button"
                className="btn-publicar"
                onClick={() => setCreatePostOpen(true)}
              >
                + Publicar
              </button>

            )
          }

        </div>

        {filteredPosts.length === 0 ? (

            <div className="post-empty">
              <h3>Sin publicaciones</h3>
              <p>
                {
                  selectedTab === "Todos"
                  ? "Este usuario todavía no ha publicado nada."
                  : `No hay publicaciones en "${selectedTab}" todavía.`
                }
              </p>
            </div>

        ) : (

            <div className="posts-container">

            {filteredPosts.map((post) => (

                <article
                key={post.id}
                className="post-card"
                >

                  <div className="post-meta">

                    <span className="post-category">
                        {post.category}
                    </span>

                    <span className="post-date">
                        {
                          `${new Date(post.createdAt).toLocaleDateString()}, ${new Date(post.createdAt).toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit",
                          })}`
                        }
                    </span>

                  </div>

                  <h3 className="post-title">
                    {post.title}
                  </h3>

                  <p className="post-content">
                    {post.content}
                  </p>

                  <div className="post-footer">

                    <div className="post-votes">

                      <button
                        type="button"
                        className="post-vote-btn"
                      >
                        {`↑ ${post.upvotes ?? 0}`}
                      </button>

                      <button
                        type="button"
                        className="post-vote-btn"
                      >
                        {`↓ ${post.downvotes ?? 0}`}
                      </button>

                      <span className="post-comments-count">
                        {`${post.commentsCount ?? 0} comentarios`}
                      </span>

                    </div>

                    <button
                      type="button"
                      className="post-reply-btn"
                    >
                      Responder
                    </button>

                  </div>

                </article>

            ))}

            </div>

        )}
        </div>
      </main>

      {
        createPostOpen && (

          <div className="av-overlay open">

            <div className="av-modal">

              <div className="av-modal-header">

                <span className="av-modal-title">
                  Nueva publicación
                </span>

                <button
                  className="av-modal-close"
                  onClick={() => setCreatePostOpen(false)}
                >
                  ✕
                </button>

              </div>

              <p className="av-modal-sub">
                Comparte algo con la comunidad.
              </p>

              <div className="campo-post">

                <label>
                  Categoría
                </label>

                <select
                  value={newPost.category}
                  onChange={(e) =>
                    setNewPost({
                      ...newPost,
                      category: e.target.value,
                    })
                  }
                >

                  {
                    POST_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))
                  }

                </select>

              </div>

              <div className="campo-post">

                <label>
                  Título
                </label>

                <input
                  value={newPost.title}
                  onChange={(e) =>
                    setNewPost({
                      ...newPost,
                      title: e.target.value,
                    })
                  }
                  placeholder="Título de tu publicación"
                />

              </div>

              <div className="campo-post">

                <label>
                  Contenido
                </label>

                <textarea
                  rows={5}
                  value={newPost.content}
                  onChange={(e) =>
                    setNewPost({
                      ...newPost,
                      content: e.target.value,
                    })
                  }
                  placeholder="Escribe tu publicación..."
                />

              </div>

              <button
                className="av-select-btn"
                onClick={crearPublicacion}
              >
                Publicar
              </button>

            </div>

          </div>

        )
      }

      <Footer />
    </>
  );
}