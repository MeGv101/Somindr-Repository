import {
  useState,
  useEffect,
} from "react";

import "../styles/psicoemocional.css";
import Footer from "../components/footer";

interface CategoriaBienestar {
  id: number;
  name: string;
  description: string;
}

interface RutinaBienestar {
  id: number;
  name: string;
  estimatedMinutes: number;
  difficulty: string;
}

interface EjercicioBienestar {
  exerciseId: number;
  exerciseName: string;
  description?: string;
  recommendedReps?: number;
  recommendedMinutes?: number;
}

interface RutinaBienestarDetalle {
  id: number;
  name: string;
  description: string;
  estimatedMinutes: number;
  exercises: EjercicioBienestar[];
}

interface SesionBienestar {
  id: number;
  routineName: string;
  categoryName: string;
  startedAt: string;
  completedAt: string | null;
  completionPercentage: number;
}

const WELLNESS_CATEGORY = "Psico-Emocional";

const wellnessImages: Record<string, string> = {
  "Respiración": "/media/SRC/pexels-betulbatmaz-18061406.jpg",
  "Meditación": "/media/SRC/pexels-arthousestudio-7363328.jpg",
  "Journaling": "/media/SRC/pexels-phamthe-24251921.jpg",
  "Grounding": "/media/SRC/pexels-timoarrr-4434592.jpg",
};

const defaultWellnessImage =
  "/media/SRC/pexels-arthousestudio-7363328.jpg";

export default function PsicoEmocional() {

  const [ansiedad, setAnsiedad] = useState(5);
  const [estres, setEstres] = useState(5);
  const [energia, setEnergia] = useState(5);
  const [sueno, setSueno] = useState(5);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<any[]>([]);

  const [wellnessRoutines, setWellnessRoutines] = useState<RutinaBienestar[]>([]);
  const [activeRoutine, setActiveRoutine] = useState<RutinaBienestarDetalle | null>(null);
  const [wellnessChecks, setWellnessChecks] = useState<Record<number, boolean>>({});
  const [wellnessSaving, setWellnessSaving] = useState(false);
  const [wellnessMessage, setWellnessMessage] = useState("");
  const [wellnessError, setWellnessError] = useState("");
  const [wellnessHistory, setWellnessHistory] = useState<SesionBienestar[]>([]);

  const loadMood = async () => {
    try {
      const token =
        localStorage.getItem("token");
      const response =
        await fetch(
          "/api/mood/current",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );
      const data =
        await response.json();
      if (!data) return;
      setAnsiedad(data.anxiety);
      setEstres(data.stress);
      setEnergia(data.energy);
      setSueno(data.sleepQuality);
      setNotes(data.notes);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadMood();
  }, []);

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {

    const token =
      localStorage.getItem("token");

    const response =
      await fetch(
        "/api/mood/history",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    const data =
      await response.json();

    setHistory(data);
  }

  useEffect(() => {
    cargarEjerciciosBienestar();
    fetchWellnessHistory();
  }, []);

  async function cargarEjerciciosBienestar() {
    try {
      const res = await fetch("/api/fitness/categories");
      const categorias: CategoriaBienestar[] = await res.json();

      const categoria = categorias.find(
        (c) => c.name === WELLNESS_CATEGORY
      );

      if (!categoria) return;

      const resRutinas = await fetch(
        `/api/fitness/category/${categoria.id}/routines`
      );
      const rutinas = await resRutinas.json();
      setWellnessRoutines(rutinas);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchWellnessHistory() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `/api/fitness/history?category=${encodeURIComponent(WELLNESS_CATEGORY)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setWellnessHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  }

  async function abrirRutinaBienestar(routineId: number) {
    try {
      setWellnessError("");
      setWellnessMessage("");
      const res = await fetch(`/api/fitness/routine/${routineId}`);
      const data = await res.json();
      setActiveRoutine(data);
      setWellnessChecks({});
    } catch (error) {
      console.error(error);
      setWellnessError("No se pudo cargar el ejercicio.");
    }
  }

  function cerrarRutinaBienestar() {
    setActiveRoutine(null);
    setWellnessChecks({});
    setWellnessMessage("");
  }

  function toggleWellnessCheck(exerciseId: number) {
    setWellnessChecks((prev) => ({
      ...prev,
      [exerciseId]: !prev[exerciseId],
    }));
  }

  async function guardarRutinaBienestar() {
    if (!activeRoutine || wellnessSaving) return;

    try {
      setWellnessSaving(true);
      setWellnessError("");
      setWellnessMessage("");

      const token = localStorage.getItem("token");

      const exercisesPayload = activeRoutine.exercises.map((ejercicio) => ({
        exerciseId: ejercicio.exerciseId,
        completed: wellnessChecks[ejercicio.exerciseId] || false,
      }));

      const response = await fetch("/api/fitness/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          routineId: activeRoutine.id,
          exercises: exercisesPayload,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al guardar.");
      }

      setWellnessMessage(
        `Registrado: completaste ${data.completionPercentage}% de "${activeRoutine.name}". La IA ya tiene este dato disponible.`
      );

      await fetchWellnessHistory();
    } catch (error) {
      setWellnessError(
        error instanceof Error ? error.message : "Error al guardar"
      );
    } finally {
      setWellnessSaving(false);
    }
  }

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setMessage("");
      const token =
        localStorage.getItem("token");
      const response =
        await fetch(
          "/api/mood",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
              Authorization:
                `Bearer ${token}`,
            },
            body: JSON.stringify({
              stress: estres,
              sleepQuality: sueno,
              energy: energia,
              anxiety: ansiedad,
              notes,
            }),
          }
        );
      const data = await response.json();
      setMessage(data.message);
      await fetchHistory();
    } catch (error) {
      console.error(error);
      setMessage("Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  const metrics = [
    { label: "Ansiedad", value: ansiedad, set: setAnsiedad },
    { label: "Estrés", value: estres, set: setEstres },
    { label: "Energía", value: energia, set: setEnergia },
    { label: "Calidad del sueño", value: sueno, set: setSueno },
  ];

  return (
    <main className="mood-page">

      <section className="hero-section">

        <div className="hero-content">

          <h1>
            Comprende tus emociones 
          </h1>

          <p>
            Registra tu estado emocional cada semana, encuentra
            patrones y construye un historial que te ayude a
            entender mejor tu bienestar.
          </p>

          <p>
            La IA de Somindr usa esta información para
            conversaciones y reflexiones más personalizadas.
          </p>

        </div>

      </section>

      <section className="mood-section">

        <div className="section-header">
          <h2>Mood semanal</h2>
          <p>Evalúa cómo te sentiste durante la semana anterior.</p>
        </div>

        <div className="mood-grid">

          <div className="mood-form">

            {metrics.map((metric, i) => (
              <div
                className="metric-card"
                key={metric.label}
                style={{ "--i": i } as React.CSSProperties}
              >
                <div className="metric-header">
                  <span>{metric.label}</span>
                  <span>{metric.value}/10</span>
                </div>

                <input
                  type="range"
                  min={1}
                  max={10}
                  value={metric.value}
                  onChange={(e) => metric.set(Number(e.target.value))}
                  style={{ "--val": metric.value } as React.CSSProperties}
                />
              </div>
            ))}

            <p>¿Quieres darnos detalles de tus resultados? (opcional)</p>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. Mis exámenes fueron díficiles..."
            />

            <button
              className="save-button"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar mood"}
            </button>

            {message && (
              <div className="pe-message">
                {message}
              </div>
            )}

          </div>

          <div className="mood-visual">
            <img src="https://images.pexels.com/photos/38263125/pexels-photo-38263125.jpeg" alt="Persona meditando" />
          </div>

        </div>

      </section>

      <section className="history-section">

        <div className="section-header">
          <h2>Historial emocional</h2>
        </div>

        {history.length === 0 ? (
          <div className="history-empty">

            <img
              className="grillo-illustration"
              src="https://cdn-icons-png.flaticon.com/512/616/616564.png"
              alt="Grillo"
            />

            <h3>Aquí solo se escuchan los grillos</h3>

            <div className="grillo-chirp" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>

            <p>
              Todavía no registras ningún mood. Sube y guarda el
              de esta semana para empezar tu historial.
            </p>

          </div>
        ) : (
          <div className="history-list">
            {history.map((entry, i) => (
              <div
                key={entry.id}
                className="history-item"
                style={{ "--i": i } as React.CSSProperties}
              >
                <h3>Semana: {entry.weekStart}</h3>
                <p>Ansiedad: {entry.anxiety}/10</p>
                <p>Estrés: {entry.stress}/10</p>
                <p>Energía: {entry.energy}/10</p>
                <p>Sueño: {entry.sleepQuality}/10</p>
                <p>Detalles: {entry.notes}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="wellness-section">

        <div className="section-header">
          <h2>Ejercicios de bienestar</h2>
          <p>
            Elige una técnica, marca los ejercicios que realizaste y
            guárdalos. Esta información también alimenta las respuestas
            de la IA.
          </p>
        </div>

        {!activeRoutine ? (
          <div className="wellness-grid">
            {wellnessRoutines.map((rutina, i) => (
              <button
                key={rutina.id}
                className="wellness-card"
                style={{ "--i": i } as React.CSSProperties}
                onClick={() => abrirRutinaBienestar(rutina.id)}
              >
                <img
                  src={wellnessImages[rutina.name] || defaultWellnessImage}
                  alt={rutina.name}
                />
                <div className="wellness-card-overlay">
                  <h3>{rutina.name.toUpperCase()}</h3>
                  <span className="wellness-view-btn">VER MÁS →</span>
                </div>
              </button>
            ))}

            {wellnessRoutines.length === 0 && (
              <p className="wellness-loading">
                Cargando ejercicios disponibles...
              </p>
            )}
          </div>
        ) : (
          <div className="wellness-detail-grid">

            <div className="wellness-detail-card">
              <h3>{activeRoutine.name.toUpperCase()}</h3>
              <p>{activeRoutine.description}</p>

              <ul className="wellness-checklist">
                {activeRoutine.exercises.map((ejercicio) => (
                  <li
                    key={ejercicio.exerciseId}
                    className="wellness-checklist-item"
                  >
                    <label>
                      <input
                        type="checkbox"
                        checked={wellnessChecks[ejercicio.exerciseId] || false}
                        onChange={() =>
                          toggleWellnessCheck(ejercicio.exerciseId)
                        }
                      />
                      <span className="wellness-check-icon">✓</span>
                      <span className="wellness-check-text">
                        <strong>{ejercicio.exerciseName}</strong>
                        {ejercicio.description && (
                          <> — {ejercicio.description}</>
                        )}
                        {ejercicio.recommendedMinutes && (
                          <> ({ejercicio.recommendedMinutes} min)</>
                        )}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>

              <div className="wellness-actions">
                <button
                  className="wellness-back-button"
                  onClick={cerrarRutinaBienestar}
                >
                  VOLVER
                </button>

                <button
                  className="save-button"
                  onClick={guardarRutinaBienestar}
                  disabled={wellnessSaving}
                >
                  {wellnessSaving ? "Guardando..." : "Guardar progreso"}
                </button>
              </div>

              {wellnessMessage && (
                <div className="pe-message">{wellnessMessage}</div>
              )}

              {wellnessError && (
                <div className="pe-message pe-message-error">
                  {wellnessError}
                </div>
              )}
            </div>

            <div className="wellness-visual">
              <img
                src={wellnessImages[activeRoutine.name] || defaultWellnessImage}
                alt={activeRoutine.name}
              />
              <div className="wellness-visual-caption">
                <h3>{activeRoutine.name.toUpperCase()}</h3>
              </div>
            </div>

          </div>
        )}

      </section>

      <section className="history-section">

        <div className="section-header">
          <h2>Registro de ejercicios</h2>
          <p>Aquí queda guardado cada ejercicio psicoemocional que completes.</p>
        </div>

        {wellnessHistory.length === 0 ? (
          <div className="history-empty">

            <img
              className="grillo-illustration"
              src="https://cdn-icons-png.flaticon.com/512/616/616564.png"
              alt="Grillo"
            />

            <h3>Aquí solo se escuchan los grillos</h3>

            <div className="grillo-chirp" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>

            <p>
              Todavía no registras ningún ejercicio. Elige una técnica
              arriba y guarda tu progreso para empezar tu registro.
            </p>

          </div>
        ) : (
          <div className="history-list">
            {wellnessHistory.map((entry, i) => (
              <div
                key={entry.id}
                className="history-item"
                style={{ "--i": i } as React.CSSProperties}
              >
                <h3>{entry.routineName}</h3>
                <p>
                  Fecha:{" "}
                  {new Date(entry.startedAt).toLocaleDateString("es-ES")}
                </p>
                <p>Completado: {entry.completionPercentage}%</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="ai-section">

        <div className="section-header">
          <h2>Asistente emocional</h2>
          <p>Conversa con la IA de Somindr para reflexionar sobre tu bienestar.</p>
        </div>

        <a href="ai">
          <button className="trav-ai-button">
            Hablar con la IA
          </button>
        </a>

      </section>
      <Footer />

    </main>
  );

}