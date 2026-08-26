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
};

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
              ${professional.pricePerHour}
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
        <h3>
            Publicaciones
        </h3>
        <hr />

        {posts.length === 0 ? (

            <div className="post-empty">
              <h3>Sin publicaciones</h3>
              <p>Este usuario todavía no ha publicado nada.</p>
            </div>

        ) : (

            <div className="posts-container">

            {posts.map((post) => (

                <article
                key={post.id}
                className="post-card"
                >

                  <div className="post-header">

                    <span className="post-category">
                        {post.category}
                    </span>

                  </div>

                  <h3 className="post-title">
                    {post.title}
                  </h3>

                  <p className="post-content">
                    {post.content}
                  </p>

                  <div className="post-footer">

                    <span className="post-date">
                        {new Date(
                        post.createdAt
                        ).toLocaleDateString()}
                    </span>

                  </div>
                  <hr></hr>

                </article>

            ))}

            </div>

        )}
        </div>
      </main>

      <Footer />
    </>
  );
}