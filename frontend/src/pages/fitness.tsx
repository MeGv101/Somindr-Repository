import { useState, useEffect } from 'react'
import '../styles/fitness.css'
import Footer from '../components/footer'


interface Categoria {
  id: number
  name: string
  description: string
}

interface Rutina {
  id: number
  name: string
  estimatedMinutes: number
  difficulty: string
}

interface Ejercicio {
  exerciseId: number
  exerciseName: string
  description?: string
  recommendedReps?: number
  recommendedMinutes?: number
  video?: string
  image?: string
}

interface RutinaDetalle {
  id: number
  name: string
  description: string
  estimatedMinutes: number
  exercises: Ejercicio[]
}

const exerciseImages: Record<string, string> = {
  "Flexiones": "https://images.pexels.com/photos/4162494/pexels-photo-4162494.jpeg?auto=compress&cs=tinysrgb&w=900",
  "Flexiones Diamante": "https://images.pexels.com/photos/8038637/pexels-photo-8038637.jpeg?auto=compress&cs=tinysrgb&w=900",
  "Flexiones Declinadas": "https://images.pexels.com/photos/8401198/pexels-photo-8401198.jpeg?auto=compress&cs=tinysrgb&w=900",
  "Pike Push-Ups": "https://images.pexels.com/photos/14623628/pexels-photo-14623628.jpeg?auto=compress&cs=tinysrgb&w=900",
  "Sentadillas": "https://images.pexels.com/photos/7900681/pexels-photo-7900681.jpeg?auto=compress&cs=tinysrgb&w=900",
  "Sentadilla Búlgara": "https://images.pexels.com/photos/14085371/pexels-photo-14085371.jpeg?auto=compress&cs=tinysrgb&w=900",
  "Pistol Squat - Progresión": "https://images.pexels.com/photos/14085371/pexels-photo-14085371.jpeg?auto=compress&cs=tinysrgb&w=900",
  "Zancadas": "https://images.pexels.com/photos/4803713/pexels-photo-4803713.jpeg?auto=compress&cs=tinysrgb&w=900",
  "Puente de Glúteos": "https://images.pexels.com/photos/6516221/pexels-photo-6516221.jpeg?auto=compress&cs=tinysrgb&w=900",
  "Plancha": "https://images.pexels.com/photos/13629685/pexels-photo-13629685.jpeg?auto=compress&cs=tinysrgb&w=900",
  "Plancha Lateral": "https://images.pexels.com/photos/6516162/pexels-photo-6516162.jpeg?auto=compress&cs=tinysrgb&w=900",
  "Mountain Climbers": "https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg?auto=compress&cs=tinysrgb&w=900",
  "Jumping Jacks": "https://images.pexels.com/photos/7298411/pexels-photo-7298411.jpeg?auto=compress&cs=tinysrgb&w=900",
  "Burpees": "https://images.pexels.com/photos/30246184/pexels-photo-30246184.jpeg?auto=compress&cs=tinysrgb&w=900",
  "Superman": "https://images.pexels.com/photos/4920466/pexels-photo-4920466.jpeg?auto=compress&cs=tinysrgb&w=900",
  "Fondos en Paralelas": "https://images.pexels.com/photos/4803702/pexels-photo-4803702.jpeg?auto=compress&cs=tinysrgb&w=900",
  "Dominadas": "https://images.pexels.com/photos/4803696/pexels-photo-4803696.jpeg?auto=compress&cs=tinysrgb&w=900",
  "L-Sit - Progresión": "https://images.pexels.com/photos/4920466/pexels-photo-4920466.jpeg?auto=compress&cs=tinysrgb&w=900",
}

export default function Fitness() {
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [rutinas, setRutinas] = useState<Rutina[]>([])
  const [rutinaDetalle, setRutinaDetalle] = useState<RutinaDetalle | null>(null)

  const [ejerciciosFlipped, setEjerciciosFlipped] = useState<Record<number, boolean>>({})
  const [ejerciciosCompletados, setEjerciciosCompletados] = useState<Record<number, boolean>>({})

  useEffect(() => {
    cargarCategorias()
  }, [])

  async function cargarCategorias() {
    try {
      const res = await fetch('/api/fitness/categories')
      const data = await res.json()
      setCategorias(data)
    } catch (err) {
      setError('No se pudieron cargar las categorías.')
    }
  }

  async function cargarRutinas(categoryId: number) {
    try {
      const res = await fetch(`/api/fitness/category/${categoryId}/routines`)
      const data = await res.json()
      setRutinas(data)
      setRutinaDetalle(null)
      setEjerciciosFlipped({})
      setEjerciciosCompletados({})
    } catch (err) {
      setError('No se pudieron cargar las rutinas.')
    }
  }

  async function cargarRutina(routineId: number) {
    try {
      const res = await fetch(`/api/fitness/routine/${routineId}`)
      const data = await res.json()
      data.exercises = data.exercises.map((exercise: Ejercicio) => ({
        ...exercise,
        image: exerciseImages[exercise.exerciseName],
      }))
      setRutinaDetalle(data)
      setEjerciciosFlipped({})
      setEjerciciosCompletados({})
      setSuccess('')
      setError('')
    } catch (err) {
      setError('No se pudo cargar la rutina.')
    }
  }

  const toggleFlip = (exerciseId: number) => {
    setEjerciciosFlipped(prev => ({
      ...prev,
      [exerciseId]: !prev[exerciseId],
    }))
  }

  const toggleCheckbox = (exerciseId: number) => {
    setEjerciciosCompletados(prev => ({
      ...prev,
      [exerciseId]: !prev[exerciseId],
    }))
  }

  async function finalizarRutina() {
    if (saving) return

    try {
      setSaving(true)
      setError('')
      setSuccess('')

      if (!rutinaDetalle) {
        return
      }

      const exercises = rutinaDetalle.exercises.map((exercise) => ({
        exerciseId: exercise.exerciseId,
        completed: ejerciciosCompletados[exercise.exerciseId] || false,
      }))

      const token = localStorage.getItem('token')

      const response = await fetch('/api/fitness/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          routineId: rutinaDetalle.id,
          exercises,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al guardar.')
      }

      setSuccess(`¡Felicidades! Completaste la rutina de: ${rutinaDetalle.name}.`)
      setRutinaDetalle(null)
      setEjerciciosFlipped({})
      setEjerciciosCompletados({})
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <main className="fitness-page">
        <section className="fitness-hero">
          <h1>Fitness</h1>
          <p>
            Bienvenido al módulo fitness de Somindr! aqui podras revisar nuestras
            diversas rutinas de entrenamiento físico y calistenia, organizadas por nivel
            para que puedas progresar paso a paso.
          </p>
          <br />
          <p>
            Solo elije una categoría de hoy, elije tu rutina y comienza tus ejercicios!
          </p>
        </section>

        {/* Cards decorativas — solo diseño, sin lógica ni datos dinámicos */}
        <section className="fitness-section">
          <div className="fitness-glass-grid">
            <div className="fitness-glass-card"> 
              <h3>Constancia</h3>
              <p>Pequeños avances diarios construyen resultados que perduran.</p>
            </div>
            <div className="fitness-glass-card">
              <h3>Fuerza real</h3>
              <p>Rutinas de calistenia pensadas para progresar a tu propio ritmo.</p>
            </div>
            <div className="fitness-glass-card">
              <h3>Escucha tu cuerpo</h3>
              <p>El descanso también es parte del entrenamiento.</p>
            </div>
          </div>
        </section>

        <section className="fitness-section">
          <h2>Categorías</h2>
          <div className="categories-grid">
            {categorias.map((categoria) => (
              <button
                key={categoria.id}
                className="category-card"
                onClick={() => cargarRutinas(categoria.id)}
              >
                <h3>{categoria.name}</h3>
                <p>{categoria.description}</p>
              </button>
            ))}
          </div>
        </section>

        {rutinas.length > 0 && (
          <section className="fitness-section">
            <h2>Rutinas</h2>
            <div className="routines-grid">
              {rutinas.map((rutina) => (
                <button
                  key={rutina.id}
                  className={`routine-card ${rutinaDetalle?.id === rutina.id ? 'activo' : ''}`}
                  onClick={() => cargarRutina(rutina.id)}
                >
                  <h3>{rutina.name}</h3>
                  <p>{rutina.estimatedMinutes} min</p>
                  <span>{rutina.difficulty}</span>
                </button>
              ))}
            </div>

            {success && <div className="fitness-success-banner">{success}</div>}
          </section>
        )}

        {rutinaDetalle && (
          <section className="fitness-section">
            <div className="routine-header">
              <h2>{rutinaDetalle.name}</h2>
              <p>{rutinaDetalle.description}</p>
              <p>Duración estimada: {rutinaDetalle.estimatedMinutes} minutos</p>
            </div>

            <div className="ejercicios-container">
              {rutinaDetalle.exercises.map((ejercicio) => (
                <div
                  key={ejercicio.exerciseId}
                  className={`video-card ${
                    ejerciciosFlipped[ejercicio.exerciseId] ? 'active' : ''
                  }`}
                >
                  <div className="card-content">
                    <div className="check-container">
                      <input
                        type="checkbox"
                        className="ejercicio-check"
                        checked={ejerciciosCompletados[ejercicio.exerciseId] || false}
                        onChange={() => toggleCheckbox(ejercicio.exerciseId)}
                      />
                    </div>

                    {ejercicio.image && (
                      <img
                        src={ejercicio.image}
                        alt={ejercicio.exerciseName}
                        className="exercise-image"
                        loading="lazy"
                      />
                    )}

                    <div className="exercise-card-info">
                      <h3>{ejercicio.exerciseName}</h3>

                      {ejercicio.description && <p>{ejercicio.description}</p>}
                    {ejercicio.recommendedReps && (
                      <p>{ejercicio.recommendedReps} repeticiones</p>
                    )}
                    {ejercicio.recommendedMinutes && (
                      <p>{ejercicio.recommendedMinutes} minutos</p>
                    )}

                      <button
                        className="btn-flip"
                        onClick={() => toggleFlip(ejercicio.exerciseId)}
                      >
                        Ver referencia →
                      </button>
                    </div>
                  </div>

                  <div className="video-content">
                    {ejercicio.video ? (
                      <video controls preload="metadata" className="exercise-video">
                        <source src={ejercicio.video} type="video/mp4" />
                      </video>
                    ) : ejercicio.image ? (
                      <>
                        <img
                          src={ejercicio.image}
                          alt={`Referencia de ${ejercicio.exerciseName}`}
                          className="exercise-image-back"
                        />
                        <p className="reference-label">Referencia visual del ejercicio</p>
                      </>
                    ) : (
                      <p>Referencia no disponible</p>
                    )}

                    <button
                      className="btn-flip btn-back"
                      onClick={() => toggleFlip(ejercicio.exerciseId)}
                    >
                      Volver
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {error && <div className="fitness-error-banner">{error}</div>}

            <button
              onClick={finalizarRutina}
              className="finish-btn"
              disabled={saving}
            >
              {saving ? 'Guardando...' : 'Guardar Entrenamiento'}
            </button>

          </section>
        )}
        <Footer />
      </main>
    </>
  )
}