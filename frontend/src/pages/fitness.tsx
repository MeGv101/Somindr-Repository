import { useState, useRef } from 'react'
import '../styles/fitness.css'
import Navbar from '../components/navbar'

interface Ejercicio {
  nombre: string
  id: number
  video: string
}

export default function Fitness() {
  const rutinas = {
    1: "Rutina de baja intensidad",
    2: "Rutina de Media intensidad", 
    3: "Rutina de media intensidad",
    4: "Rutina de alta intensidad",
    5: "Rutina de fuerza",
    6: "Rutina de resistencia",
    7: "Rutina de ganancia muscular",
    8: "Rutina de perdida de grasa"
  }

  const ejerciciosPorRutina = {
    1: [
      {
        id: 0,
        nombre: "Caminata ligera",
        video: "/media/SRC/perrito bailando.mp4"
      },
      {
        id: 1,
        nombre: "Marcha en sitio",
        video: "/media/SRC/Heated Rivalry.mp4"
      },
      {
        id: 2,
        nombre: "Estiramientos",
        video: "/media/SRC/tum tum zorro.mp4"
      }
      
    ],

    2: [
      {
        id: 0,
        nombre: "Sentadillas",
        video: "/media/SRC/.mp4"
      },
      {
        id: 1,
        nombre: "Flexiones",
        video: "/media/SRC/.mp4"
      }
    ],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: []
  }

  const [rutinaSeleccionada, setRutinaSeleccionada] = useState<number | null>(null)
  const [ejerciciosFlipped, setEjerciciosFlipped] = useState<Record<number, boolean>>({})
  const [ejerciciosCompletados, setEjerciciosCompletados] = useState<Record<number, boolean>>({})
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({})

  const seleccionarRutina = (num: number) => {
    setRutinaSeleccionada(num)
    setEjerciciosFlipped({})
    setEjerciciosCompletados({})
  }

  const toggleFlip = (index: number) => {
    setEjerciciosFlipped(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const toggleCheckbox = (index: number) => {
    setEjerciciosCompletados(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const guardarRutina = () => {
    if (!rutinaSeleccionada) {
      alert(" Selecciona una rutina primero")
      return
    }

    const completados = Object.values(ejerciciosCompletados).filter(Boolean).length
    alert(` Entrenamiento guardado!\nRutina: ${rutinas[rutinaSeleccionada as keyof typeof rutinas]}\nEjercicios completados: ${completados}/6`)
  }

  const cerrarVideo = (id: number) => {
  const video = videoRefs.current[id]

    if (video) {
      video.pause()
      video.currentTime = 0
    }

    toggleFlip(id)
  }

  return (
    <>
      <main className="pe-main">
          <header className="pe-header">
             <div className="pe-hero-banner">
                <img src="/media/SRC/red Fitness.png" alt="Fitness Banner"/>

                <div className="pe-hero-overlay">
                  <h1>Nuevo Entrenamiento</h1>
                  <p>Elige una rutina y marca los ejercicios completados</p>
                </div>
              </div>
          </header>

          <section className="pe-section">
            <h2>Selecciona tu rutina</h2>
            <div className="rutinas-grid">
              {Object.entries(rutinas).map(([id, nombre]) => (
                <button
                  key={id}
                  className={`rutina-btn ${rutinaSeleccionada === Number(id) ? 'activo' : ''}`}
                  onClick={() => seleccionarRutina(Number(id))}
                >
                  {nombre}
                </button>
              ))}
            </div>
          </section>

                  {rutinaSeleccionada && (<section className="pe-section">

            <h2>
              {rutinas[rutinaSeleccionada as keyof typeof rutinas]}
            </h2>

            <div className="ejercicios-container">

              {ejerciciosPorRutina[rutinaSeleccionada as keyof typeof ejerciciosPorRutina]?.map((ejercicio) => (

                <div
                  key={ejercicio.id}
                  className={`video-card ${
                    ejerciciosFlipped[ejercicio.id] ? "active" : ""
                  }`}
                >

                  <div className="card-content">

                    <div className="check-container">
                      <input
                        type="checkbox"
                        className="ejercicio-check"
                        checked={ejerciciosCompletados[ejercicio.id] || false}
                        onChange={() => toggleCheckbox(ejercicio.id)}
                      />
                    </div>

                    <h3>{ejercicio.nombre}</h3>

                    <button
                      className="btn-flip"
                      onClick={() => toggleFlip(ejercicio.id)}
                    >
                      Ver cómo se hace →
                    </button>

                  </div>

                  <div className="video-content">

                    <video
                      ref={(el) => {
                        videoRefs.current[ejercicio.id] = el
                      }}
                      controls
                      preload="metadata"
                      className="exercise-video"
                    >
                      <source
                        src={ejercicio.video}
                        type="video/mp4"
                      />
                    </video>

                    <button
                      className="btn-flip btn-back"
                      onClick={() => cerrarVideo(ejercicio.id)}
                    >
                      Volver
                    </button>

                  </div>

                </div>

              ))}

            </div>

            <button
              onClick={guardarRutina}
              className="pe-btn"
              style={{ marginTop: "30px", width: "100%" }}
            >
              Guardar Entrenamiento
            </button>

          </section>
        )}
      </main>
    </>
  )
}