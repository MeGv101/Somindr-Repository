import { useState, useEffect } from 'react'
import '../styles/fitness.css'
import Navbar from '../components/navbar'

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
}

interface RutinaDetalle {
  id: number
  name: string
  description: string
  estimatedMinutes: number
  exercises: Ejercicio[]
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
      const res = await fetch('http://localhost:3000/fitness/categories')
      const data = await res.json()
      setCategorias(data)
    } catch (err) {
      setError('No se pudieron cargar las categorías.')
    }
  }

  async function cargarRutinas(categoryId: number) {
    try {
      const res = await fetch(`http://localhost:3000/fitness/category/${categoryId}/routines`)
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
      const res = await fetch(`http://localhost:3000/fitness/routine/${routineId}`)
      const data = await res.json()
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

      const response = await fetch('http://localhost:3000/fitness/session', {
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
            diversas rutinas especialmente diseñadas para los entusiastas que gustan
            de ejercicios de calistenia.
          </p>
          <br />
          <p>
            Solo elije una categoría de hoy, elije tu rutina y comienza tus ejercicios!
          </p>
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
                      Ver cómo se hace →
                    </button>
                  </div>

                  <div className="video-content">
                    {ejercicio.video ? (
                      <video controls preload="metadata" className="exercise-video">
                        <source src={ejercicio.video} type="video/mp4" />
                      </video>
                    ) : (
                      <p>Video no disponible</p>
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
      </main>
    </>
  )
}