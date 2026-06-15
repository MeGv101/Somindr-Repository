import { useState, type FormEvent } from 'react'
import '../styles/psicoemocional.css'

const EMOCIONES = [
  'Neutral',
  'Feliz',
  'Triste',
  'Ansioso',
  'Estresado',
  'Enérgico',
  'Cansado',
  'Motivado',
] as const

type Emocion = (typeof EMOCIONES)[number]

export default function PsicoEmocional() {
  const [emocion, setEmocion] = useState<Emocion>('Neutral')
  const [ansiedad, setAnsiedad] = useState(5)
  const [estres, setEstres] = useState(7)
  const [energia, setEnergia] = useState(4)
  const [sueno, setSueno] = useState(5)
  const [desencadenantes, setDesencadenantes] = useState('')
  const [situaciones, setSituaciones] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/guardar_registro.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estado: emocion,
          ansiedad,
          estres,
          energia,
          sueno,
          desencadenantes,
          situaciones,
        }),
      })
      const data = await res.json()
      if (data.ok) alert('Registro semanal guardado exitosamente')
      else alert('Error: ' + data.error)
    } catch {
      alert('No se pudo conectar con el servidor. Revisa que el backend esté activo.')
    }
  }

  return (
    <main className="pe-main">
      <div className="pe-card">
        <header className="pe-header">
          <h1>Métricas de bienestar</h1>
          <p>Ajusta los indicadores y registra cómo te sientes hoy.</p>
        </header>

        <form id="formPsico" className="pe-form" onSubmit={handleSubmit}>
          <section className="pe-section">
            <h2>¿Cómo te sientes hoy?</h2>
            <div className="pe-emociones">
              {EMOCIONES.map((emo) => (
                <button
                  key={emo}
                  type="button"
                  className={`pe-emo${emocion === emo ? ' seleccionado' : ''}`}
                  data-emo={emo}
                  onClick={() => setEmocion(emo)}
                >
                  <span />
                  {emo}
                </button>
              ))}
            </div>
          </section>

          <section className="pe-section">
            <h2>Métricas</h2>
            <p className="pe-sub">
              Ajusta los sliders según cómo te sientes en este momento
            </p>

            <div className="pe-slider-card">
              <div className="pe-slider-head">
                <span>Nivel de Ansiedad</span>
                <span className="pe-val">{ansiedad}</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={ansiedad}
                onChange={(e) => setAnsiedad(Number(e.target.value))}
              />
            </div>

            <div className="pe-slider-card">
              <div className="pe-slider-head">
                <span>Nivel de Estrés</span>
                <span className="pe-val">{estres}</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={estres}
                onChange={(e) => setEstres(Number(e.target.value))}
              />
            </div>

            <div className="pe-slider-card">
              <div className="pe-slider-head">
                <span>Nivel de Energía</span>
                <span className="pe-val">{energia}</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={energia}
                onChange={(e) => setEnergia(Number(e.target.value))}
              />
            </div>

            <div className="pe-slider-card">
              <div className="pe-slider-head">
                <span>Calidad del Sueño</span>
                <span className="pe-val">{sueno}</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={sueno}
                onChange={(e) => setSueno(Number(e.target.value))}
              />
            </div>
          </section>

          <section className="pe-section">
            <h2>Notas adicionales</h2>

            <div className="pe-field">
              <label htmlFor="desencadenantes">Desencadenantes</label>
              <input
                id="desencadenantes"
                type="text"
                placeholder="Ej: trabajo, familia, ejercicio, falta de sueño…"
                value={desencadenantes}
                onChange={(e) => setDesencadenantes(e.target.value)}
              />
            </div>

            <div className="pe-field">
              <label htmlFor="situaciones">Situaciones del día</label>
              <textarea
                id="situaciones"
                rows={4}
                placeholder="Describe brevemente lo que influyó más en tu estado emocional hoy…"
                value={situaciones}
                onChange={(e) => setSituaciones(e.target.value)}
              />
            </div>
          </section>

          <button type="submit" className="pe-btn">
            Guardar Registro Emocional
          </button>
        </form>
      </div>
    </main>
  )
}
