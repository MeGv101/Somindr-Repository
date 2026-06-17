import {
  useState,
  useEffect,
} from "react";

import "../styles/psicoemocional.css";

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
          "http://localhost:3000/mood/current",
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
        "http://localhost:3000/mood/history",
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
          "http://localhost:3000/mood",
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

  return  (
    <main className="mood-page">

      <section className="hero-section">

        <div className="hero-content">

          <h1>
            Comprende Tus Motivaciones
          </h1>

          <p>
            Cada semana podrás registrar tu estado emocional,
            identificar patrones y construir un historial que
            te ayude a comprender mejor tu bienestar.
          </p>

          <p>
            La IA de Somindr utilizará esta información para
            ofrecer conversaciones y reflexiones más
            personalizadas, para ayudarte a nunca rendirte.
          </p>

        </div>

      </section>

      <section className="mood-section">

        <div className="section-header">
          <h2>Mood semanal</h2>

          <p>
            Evalúa cómo te sentiste durante la semana anterior.
          </p>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span>Ansiedad</span>
            <span>{ansiedad}/10</span>
          </div>

          <input
            type="range"
            min={1}
            max={10}
            value={ansiedad}
            onChange={(e) =>
              setAnsiedad(
                Number(e.target.value)
              )
            }
          />
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span>Estrés</span>
            <span>{estres}/10</span>
          </div>

          <input
            type="range"
            min={1}
            max={10}
            value={estres}
            onChange={(e) =>
              setEstres(
                Number(e.target.value)
              )
            }
          />
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span>Energía</span>
            <span>{energia}/10</span>
          </div>

          <input
            type="range"
            min={1}
            max={10}
            value={energia}
            onChange={(e) =>
              setEnergia(
                Number(e.target.value)
              )
            }
          />
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span>Calidad del sueño</span>
            <span>{sueno}/10</span>
          </div>

          <input
            type="range"
            min={1}
            max={10}
            value={sueno}
            onChange={(e) =>
              setSueno(
                Number(e.target.value)
              )
            }
          />
        </div>
          <p>
            ¿Quieres darnos detalles de tus resultados? (opcional)
          </p>
        <textarea
          value={notes}
          onChange={(e) =>
            setNotes(
              e.target.value
            )
          }
          placeholder="Ej. Mis exámenes fueron díficiles..."
        />

        <button
          className="save-button"
          onClick={handleSubmit}
          disabled={loading}
        >
          {
            loading
              ? "Guardando..."
              : "Guardar mood"
          }
        </button>
        {message && (
          <div className="pe-message">
            {message}
          </div>
        )}

      </section>

      <section className="history-section">

        <div className="section-header">
          <h2>Historial emocional</h2>

        </div>
        {history.length === 0 ? (
          <div className="history-empty">
            <h3>Aún no hay registros</h3>

            <p>
              Completa tu primer mood semanal para
              comenzar a construir tu historial.
            </p>
          </div>
        ) : (
        <div className="history-list">
          {history.map((entry) => (
            
            <div
              key={entry.id}
              className="history-item"
            >
              <br />
              
              <h3>
                Semana:
                {" "}
                {entry.weekStart}
              </h3>

              <p>
                Ansiedad:
                {entry.anxiety}/10
              </p>

              <p>
                Estrés:
                {entry.stress}/10
              </p>

              <p>
                Energía:
                {entry.energy}/10
              </p>

              <p>
                Sueño:
                {entry.sleepQuality}/10
              </p>
              <p>
                Detalles:  
                {entry.notes}
              </p>

            </div>
            
          ))}

        </div>
        )}
      </section>

      <section className="ai-section">

        <div className="section-header">
          <h2>Asistente emocional</h2>

          <p>
            Conversa con la IA de Somindr para
            reflexionar sobre tu bienestar.
          </p>
        </div>

        <button className="ai-button">
          Hablar con la IA
        </button>

      </section>

    </main>
);

}
