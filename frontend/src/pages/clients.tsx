import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { openChat } from "../services/chat";

import Footer from "../components/footer";

import "../styles/clients.css";

interface Client {

  id: number;

  userId:number;

  nombre: string;

  apellido: string;

  username: string;

  fotoPerfil: number;

  startedAt: string;

  expiresAt: string;

  active: boolean;

}

export default function Clients() {

  const [clients, setClients] =
    useState<Client[]>([]);

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {

    const token =
      localStorage.getItem("token");

    const response = await fetch(
      "/api/professionals/clients",
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) return;

    setClients(
      await response.json()
    );

  }


  const navigate =
  useNavigate();

    async function handleOpenChat(
      clientUserId:number
    ){

      try{

        const channelId =
          await openChat(
            clientUserId
          );

        navigate(
          `/messages/${channelId}`
        );

      }

      catch(error){

        console.error(error);

      }

    }

  return (

    <>
      <main className="main clients-page">

        <section className="clients-header">

          <h1>
            Tus clientes
          </h1>

          <p>
            Personas que actualmente
            reciben tus servicios.
          </p>

        </section>

        {

          clients.length === 0 ? (

            <div className="card empty-card">

              <h3>
                Sin clientes
              </h3>

              <p>
                Aún nadie ha contratado
                tus servicios.
              </p>

            </div>

          ) : (

            <div className="clients-grid">

              {

                clients.map(client => (

                  <article
                    key={client.id}
                    className="client-card"
                  >

                    <h3>

                      {client.nombre}{" "}

                      {client.apellido}

                    </h3>

                    <p>

                      @{client.username}

                    </p>

                    <p>

                      Cliente desde

                      {" "}

                      {

                        new Date(
                          client.startedAt
                        ).toLocaleDateString()

                      }

                    </p>

                    <p>

                      Expira

                      {" "}

                      {

                        new Date(
                          client.expiresAt
                        ).toLocaleDateString()

                      }

                    </p>

                    <span
                      className={
                        client.active
                          ? "status active-sub"
                          : "status inactive-sub"
                      }
                    >

                      {

                        client.active
                          ? "Activo"
                          : "Inactivo"

                      }

                    </span>

                    <Link
                      to={`/perfil/${client.username}`}
                      className="btn-profile"
                    >
                      Ver perfil
                    </Link>

                    <Link
                      to={`/clients/${client.id}`}
                      className="btn-profile"
                    >
                      Ver historiales
                    </Link>

                    <button
                      className="btn-profile"
                      onClick={() =>
                        handleOpenChat(
                          client.userId
                        )
                      }
                    >
                      Abrir chat
                    </button>

                  </article>

                ))

              }

            </div>

          )

        }

      </main>

      <Footer />

    </>

  );

}