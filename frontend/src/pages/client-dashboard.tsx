import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/navbar";
import Footer from "../components/footer";

import avatar1 from "../assets/avatars/avatar1.jpeg";
import avatar2 from "../assets/avatars/avatar2.jpeg";
import avatar3 from "../assets/avatars/avatar3.jpeg";
import avatar4 from "../assets/avatars/avatar4.jpeg";
import avatar5 from "../assets/avatars/avatar5.jpeg";
import avatar6 from "../assets/avatars/avatar6.jpeg";
import avatar7 from "../assets/avatars/avatar7.jpeg";
import avatar8 from "../assets/avatars/avatar8.jpeg";

import "../styles/client-dashboard.css";

interface Profile {
  id: number;
  nombre: string;
  apellido: string;
  username: string;
  fotoPerfil: number;
  genero: string;
  fechaNacimiento: string;
  pesoKg: number;
  estaturaCm: number;
  nivelActividad: string;
  biografia: string | null;
}

interface Mood {
  id: number;
  weekStart: string;
  stress: number;
  sleepQuality: number;
  energy: number;
  anxiety: number;
  notes: string | null;
}

interface Routine {
  id: number;
  completionPercentage: number;
  startedAt: string;
  completedAt: string | null;
}

interface Insight {
  id: number;
  summary: string;
  createdAt: string;
}

interface Dashboard {
  profile: Profile;
  startedAt: string;
  expiresAt: string;
  active: boolean;
  moods: Mood[];
  routines: Routine[];
  insights: Insight[];
}

export default function ClientDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] =
    useState<Dashboard | null>(null);

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

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `/api/client/${id}/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

    console.log("Response:", response.status);
    console.log("Data:", data);

      if (!response.ok) {
        navigate("/clients/me");
        return;
      }

      setDashboard(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function calculateAge(date: string) {
    const birth = new Date(date);
    const today = new Date();

    let age =
      today.getFullYear() - birth.getFullYear();

    const month =
      today.getMonth() - birth.getMonth();

    if (
      month < 0 ||
      (month === 0 &&
        today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  }

  function calculateBMI() {
    if (!dashboard) return "0";

    const meters =
      dashboard.profile.estaturaCm / 100;

    return (
      dashboard.profile.pesoKg /
      (meters * meters)
    ).toFixed(1);
  }

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="client-dashboard-page">
          <h2>Cargando información...</h2>
        </main>

        <Footer />
      </>
    );
  }

  if (!dashboard) {
    return (
      <>
        <Navbar />

        <main className="client-dashboard-page">
          <h2>Cliente no encontrado.</h2>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <main className="client-dashboard-page">

        <section className="client-dashboard-header">

          <img
            className="client-dashboard-avatar"
            src={
              avatars[
                dashboard.profile.fotoPerfil - 1
              ]
            }
            alt={dashboard.profile.username}
          />

          <div>

            <h1>
              {dashboard.profile.nombre}{" "}
              {dashboard.profile.apellido}
            </h1>

            <p>@{dashboard.profile.username}</p>

            <span className="client-dashboard-status">
              Cliente activo
            </span>

            {dashboard.profile.biografia && (
              <p className="client-dashboard-biography">
                {dashboard.profile.biografia}
              </p>
            )}

          </div>

        </section>

        <section className="client-dashboard-grid">

          <div className="client-dashboard-card">

            <h2>Información física</h2>

            <p>
              <strong>Edad:</strong>{" "}
              {calculateAge(
                dashboard.profile.fechaNacimiento
              )}{" "}
              años
            </p>

            <p>
              <strong>Género:</strong>{" "}
              {dashboard.profile.genero}
            </p>

            <p>
              <strong>Peso:</strong>{" "}
              {dashboard.profile.pesoKg} kg
            </p>

            <p>
              <strong>Estatura:</strong>{" "}
              {dashboard.profile.estaturaCm} cm
            </p>

            <p>
              <strong>IMC:</strong>{" "}
              {calculateBMI()}
            </p>

            <p>
              <strong>Nivel de actividad:</strong>{" "}
              {dashboard.profile.nivelActividad}
            </p>

          </div>

          <div className="client-dashboard-card">

            <h2>Suscripción</h2>

            <p>
              <strong>Inicio:</strong>{" "}
              {new Date(
                dashboard.startedAt
              ).toLocaleDateString()}
            </p>

            <p>
              <strong>Vence:</strong>{" "}
              {new Date(
                dashboard.expiresAt
              ).toLocaleDateString()}
            </p>

            <p>
              <strong>Estado:</strong>{" "}
              {dashboard.active
                ? "Activa"
                : "Finalizada"}
            </p>

          </div>

        </section>

        <section className="client-dashboard-section">

          <h2>Historial de Mood</h2>

          {dashboard.moods.length === 0 ? (
            <div className="client-dashboard-empty">
              No existen registros.
            </div>
          ) : (
            <div className="client-dashboard-mood-grid">
              {dashboard.moods.map((mood) => (
                <div
                  key={mood.id}
                  className="client-dashboard-card"
                >
                  <p>
                    <strong>Semana:</strong>{" "}
                    {new Date(
                      mood.weekStart
                    ).toLocaleDateString()}
                  </p>

                  <p>Estrés: {mood.stress}/10</p>

                  <p>
                    Ansiedad: {mood.anxiety}/10
                  </p>

                  <p>
                    Energía: {mood.energy}/10
                  </p>

                  <p>
                    Sueño:{" "}
                    {mood.sleepQuality}/10
                  </p>

                  {mood.notes && (
                    <>
                      <div className="client-dashboard-divider" />
                      <p>{mood.notes}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

        </section>

        <section className="client-dashboard-section">

          <h2>Rutinas</h2>

          {dashboard.routines.length === 0 ? (
            <div className="client-dashboard-empty">
              Sin rutinas registradas.
            </div>
          ) : (
            <div className="client-dashboard-routine-grid">
              {dashboard.routines.map(
                (routine) => (
                  <div
                    key={routine.id}
                    className="client-dashboard-card"
                  >
                    <p>
                      <strong>
                        Progreso
                      </strong>
                    </p>

                    <div className="client-dashboard-progress">
                      <div
                        className="client-dashboard-progress-fill"
                        style={{
                          width: `${routine.completionPercentage}%`,
                        }}
                      />
                    </div>

                    <p>
                      {
                        routine.completionPercentage
                      }
                      %
                    </p>

                    <p>
                      Inicio:{" "}
                      {new Date(
                        routine.startedAt
                      ).toLocaleDateString()}
                    </p>

                    {routine.completedAt && (
                      <p>
                        Finalizada:{" "}
                        {new Date(
                          routine.completedAt
                        ).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )
              )}
            </div>
          )}

        </section>

        <section className="client-dashboard-section">

          <h2>Insights IA</h2>

          {dashboard.insights.length === 0 ? (
            <div className="client-dashboard-empty">
              No existen insights.
            </div>
          ) : (
            dashboard.insights.map(
              (insight) => (
                <div
                  key={insight.id}
                  className="client-dashboard-card client-dashboard-insight"
                >
                  <p>{insight.summary}</p>

                  <small>
                    {new Date(
                      insight.createdAt
                    ).toLocaleDateString()}
                  </small>
                </div>
              )
            )
          )}

        </section>

      </main>

      <Footer />
    </>
  );
}