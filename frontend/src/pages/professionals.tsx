import { useEffect, useState, } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { openChat } from "../services/chat";

import Footer from "../components/footer";

import "../styles/professionals.css";

interface Professional {
  id: number;
  nombre: string;
  apellido: string;
  username: string;
  profession: string;
  description: string;
  pricePerHour: number;
  verified: boolean;
  fotoPerfil: number;
  userId: number;
}

interface PurchasedProfessional{

  id:number;

  userId:number;

  nombre:string;

  apellido:string;

  username:string;

  profession:string;

  description:string;

  pricePerHour:number;

  verified:boolean;

  fotoPerfil:number;

  startedAt:string;

  expiresAt:string;

  active:boolean;

}
export default function Professionals() {
  const { user } = useAuth();
  const [available, setAvailable] =
    useState<Professional[]>([]);

  const [purchased, setPurchased] =
    useState<PurchasedProfessional[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const navigate = useNavigate();

  async function handleOpenChat(
    professionalUserId:number
  ){

    try{

      const channelId =
        await openChat(
          professionalUserId
        );

      navigate(
        `/messages/${channelId}`
      );

    }

    catch(error){

      console.error(error);

    }

  }

  async function loadData(){
    const token =
      localStorage.getItem(
        "token"
      );

    const headers={

      Authorization:
        `Bearer ${token}`

    };

    const[

      availableResponse,

      purchasedResponse,

    ]=

    await Promise.all([

      fetch(
        "/api/professionals",
        {
          headers
        }
      ),

      fetch(
        "/api/professionals/my",
        {
          headers
        }
      ),

    ]);

    if(

      availableResponse.ok

    ){

      setAvailable(

        await availableResponse.json()

      );

    }

    if(

      purchasedResponse.ok

    ){

      setPurchased(

        await purchasedResponse.json()

      );

    }

  }

  const purchasedIds =
    new Set(
      purchased.map(
        p => p.id
      )
    );

  const availableProfessionals =
    available.filter(
      professional =>
        !purchasedIds.has(
          professional.id
        )
    );

  const myProfessionals =
  purchased;

  return (
    <>
      <main className="main professionals-page">
        <section className="professionals-header">
          <h1>
            Profesionales
          </h1>
          <p>
            Encuentra especialistas para ayudarte
            en tu bienestar físico y emocional.
          </p>
        </section>
        <section className="professionals-section">
          <h2>
            Mis<span className="verde">&nbsp;profesionales</span>
          </h2>
          {
            myProfessionals.length === 0 ? (
              <div className="card empty-card">
                <p>
                  Todavía no has contratado
                  ningún profesional.
                </p>
              </div>
            ) : (
              <div className="professionals-grid">
                {
                  myProfessionals.map(
                    professional => (
                      <article
                        key={professional.id}
                        className="professional-card"
                      >
                        <h3>
                          {professional.nombre}{" "}
                          {professional.apellido}
                        </h3>
                        <p className="profession">
                          {professional.profession}
                        </p>
                        <p>
                          {professional.description}
                        </p>
                        <Link
                          className="btn-profile"
                          to={`/perfil/${professional.username}`}
                        >
                          Ver perfil
                        </Link>
                        <button
  className="btn-profile"
  onClick={() => {
    console.log("BOTÓN FUNCIONA");

    handleOpenChat(
      professional.userId
    );
  }}
>
  Abrir chat
</button>
                                                
                      </article>
                    )
                  )
                }
              </div>
            )
          }
        </section>
        <section className="professionals-section">
          <h2>
            Profesionales <span className="verde">&nbsp;disponibles</span>
          </h2>
          {
            availableProfessionals.length === 0 ? (
              <div className="card empty-card">
                <p>
                  No hay profesionales disponibles.
                </p>
              </div>
            ) : (
              <div className="professionals-grid">
                {
                  availableProfessionals.map(
                    professional => (
                      <article
                        key={professional.id}
                        className="professional-card"
                      >
                        <h3>
                          {professional.nombre}{" "}
                          {professional.apellido}
                        </h3>
                        <p className="profession">
                          {professional.profession}
                        </p>
                        <p>
                          {professional.description}
                        </p>
                        <p className="price">
                          ${professional.pricePerHour}/hora
                        </p>
                        {
                          professional.verified && (
                            <span className="verified">
                              ✔ Verificado
                            </span>
                          )
                        }
                        <Link
                          className="btn-profile"
                          to={`/perfil/${professional.username}`}
                        >
                          Ver perfil
                        </Link>
                      </article>
                    )
                  )
                }
              </div>
            )
          }
        </section>
      </main>
      <Footer />
    </>
  );
}