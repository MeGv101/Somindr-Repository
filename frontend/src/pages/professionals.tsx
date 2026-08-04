import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

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
}

interface PurchasedProfessional {

  professionalId: number;

  startedAt: string;

  expiresAt: string;

  active: boolean;

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

  async function loadData() {

    const token =
      localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const [
      availableResponse,
      purchasedResponse,
    ] = await Promise.all([

      fetch("/api/professionals", {
        headers,
      }),

      fetch("/api/professionals/my", {
        headers,
      }),

    ]);

    if (availableResponse.ok) {
      setAvailable(
        await availableResponse.json()
      );
    }

    if (purchasedResponse.ok) {
      setPurchased(
        await purchasedResponse.json()
      );
    }

  }

  const purchasedIds =
    new Set(
      purchased.map(
        p => p.professionalId
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
    available.filter(
      professional =>
        purchasedIds.has(
          professional.id
        )
    );

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