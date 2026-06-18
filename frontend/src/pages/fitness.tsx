import { useState , useEffect } from 'react'
import '../styles/fitness.css'
import Navbar from '../components/navbar'
export default function fitness() {

  const [saving, setSaving] = useState(false);

  const [success, setSuccess] =
  useState("");

  const [error, setError] =
  useState("");

  const [loading, setLoading] = useState(false)

  const [categories, setCategories] =
  useState<any[]>([]);

  const [routines, setRoutines] =
  useState<any[]>([]);

  const [routineDetail, setRoutineDetail] =
  useState<any | null>(null);

  const [completedExercises,
  setCompletedExercises] =
  useState<Record<number, boolean>>({});

  const toggleCheckbox = (
    exerciseId: number
  ) => {
    setCompletedExercises(
      prev => ({
        ...prev,
        [exerciseId]:
          !prev[exerciseId]
      })
    )

  }
  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {

    const res = await fetch(
      "http://localhost:3000/fitness/categories"
    );

    const data = await res.json();

    setCategories(data);
  }

  async function loadRoutines(
    categoryId: number
  ) {
    const res = await fetch(
      `http://localhost:3000/fitness/category/${categoryId}/routines`
    )
    const data = await res.json()
    setRoutines(data)
    setRoutineDetail(null)
  }


  async function loadRoutine(
    routineId: number
  ) {

    const res = await fetch(
      `http://localhost:3000/fitness/routine/${routineId}`
    )

    const data = await res.json()

    setRoutineDetail(data)
  }

  async function finishRoutine() {

    if (saving) return;

    try {

      setSaving(true);

      setError("");
      setSuccess("");

      if (!routineDetail) {
        return;
      }

      const exercises =
        routineDetail.exercises.map(
          (exercise: any) => ({
            exerciseId:
              exercise.exerciseId,

            completed:
              completedExercises[
                exercise.exerciseId
              ] || false,
          })
        );

      const token =
        localStorage.getItem(
          "token"
        );

      const response =
        await fetch(
          "http://localhost:3000/fitness/session",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              routineId:
                routineDetail.id,

              exercises,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Error al guardar."
        );
      }

      setSuccess(
        `¡Felicidades! Completaste la rutina de: ${
          routineDetail.name
        }.`
      );

      setRoutineDetail(null);

      setCompletedExercises({});

    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : "Error desconocido"
      );

    } finally {

      setSaving(false);

    }

  }
  

  return (
  <main className="fitness-page">

    <section className="fitness-hero">

      <h1>Fitness</h1>

      <p>
        Bienvenido al módulo fitness de Somindr!
        aqui podras revisar nuestras diversas rutinas
        especialmente diseñadas para los entusiastas que gustan de ejercicios de calistenia.
      </p>
      <br />

      <p>
        Solo elije una categoría de hoy, elije tu rutina y comienza tus ejercicios!
      </p>

    </section>

    <section className="fitness-section">

      <h2>Categorías</h2>

      <div className="categories-grid">

        {categories.map((category: any) => (

          <button
            key={category.id}
            className="category-card"
            onClick={() => loadRoutines(category.id)}
          >
            <h3>{category.name}</h3>

            <p>{category.description}</p>

          </button>

        ))}

      </div>

    </section>

    {routines.length > 0 && (

      <section className="fitness-section">

        

        <h2>Rutinas</h2>

        <div className="routines-grid">

          {routines.map((routine: any) => (

            <button
              key={routine.id}
              className="routine-card"
              onClick={() => loadRoutine(routine.id)}
            >

              <h3>{routine.name}</h3>

              <p>
                {routine.estimatedMinutes} min
              </p>

              <span>
                {routine.difficulty}
              </span>

            </button>

          ))}

        </div>
        {success && (
          <div className="fitness-success">
            {success}
          </div>
        )}

      </section>

    )}

    {routineDetail && (

      <section className="fitness-section">

        <div className="routine-header">

          <h2>
            {routineDetail.name}
          </h2>

          <p>
            {routineDetail.description}
          </p>

          <p>
            Duración estimada:
            {" "}
            {routineDetail.estimatedMinutes}
            {" "}
            minutos
          </p>

        </div>

        <div className="exercises-list">

          {routineDetail.exercises.map(
            (exercise: any) => (

              <div
                key={exercise.exerciseId}
                className="exercise-card"
              >

                <div className="exercise-top">

                  <input
                    type="checkbox"
                    checked={
                      completedExercises[
                        exercise.exerciseId
                      ] || false
                    }
                    onChange={() =>
                      toggleCheckbox(
                        exercise.exerciseId
                      )
                    }
                  />

                  <h3>
                    {exercise.exerciseName}
                  </h3>

                </div>

                {exercise.description && (
                  <p>
                    {exercise.description}
                  </p>
                )}

                {exercise.recommendedReps && (
                  <p>
                    {exercise.recommendedReps}
                    {" "}
                    repeticiones
                  </p>
                )}

                {exercise.recommendedMinutes && (
                  <p>
                    {exercise.recommendedMinutes}
                    {" "}
                    minutos
                  </p>
                )}

              </div>

            )
          )}

        </div>
        {error && (
          <div className="fitness-error">
            {error}
          </div>
        )}

        <button
          className="finish-btn"
          onClick={finishRoutine}
        >
          Finalizar rutina
        </button>

      </section>

    )}

  </main>
)
}
