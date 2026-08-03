import {
  useState,
  useEffect,
} from "react";

import "../styles/psicoemocional.css";
import Footer from "../components/footer";

export default function PsicoEmocional() {

  const [ansiedad, setAnsiedad] = useState(5);
  const [estres, setEstres] = useState(5);
  const [energia, setEnergia] = useState(5);
  const [sueno, setSueno] = useState(5);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<any[]>([]);

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