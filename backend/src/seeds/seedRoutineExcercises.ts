import "dotenv/config";
import { db } from "../db/index.js";
import { exerciseRoutines, exercises, routineExercises } from "../db/schema.js";

async function seed() {
  const routines = await db.select().from(exerciseRoutines);
  const exerciseList = await db.select().from(exercises);

  const routineMap = Object.fromEntries(routines.map((r) => [r.name, r.id]));
  const exerciseMap = Object.fromEntries(exerciseList.map((e) => [e.name, e.id]));

  await db.insert(routineExercises).values([
    // FÍSICO - PRINCIPIANTE
    { routineId: routineMap["Físico - Principiante"], exerciseId: exerciseMap["Sentadillas"], orderIndex: 1, recommendedReps: 12 },
    { routineId: routineMap["Físico - Principiante"], exerciseId: exerciseMap["Zancadas"], orderIndex: 2, recommendedReps: 8 },
    { routineId: routineMap["Físico - Principiante"], exerciseId: exerciseMap["Puente de Glúteos"], orderIndex: 3, recommendedReps: 15 },
    { routineId: routineMap["Físico - Principiante"], exerciseId: exerciseMap["Plancha"], orderIndex: 4, recommendedMinutes: 1 },
    { routineId: routineMap["Físico - Principiante"], exerciseId: exerciseMap["Jumping Jacks"], orderIndex: 5, recommendedReps: 20 },

    // FÍSICO - INTERMEDIO
    { routineId: routineMap["Físico - Intermedio"], exerciseId: exerciseMap["Sentadillas"], orderIndex: 1, recommendedReps: 18 },
    { routineId: routineMap["Físico - Intermedio"], exerciseId: exerciseMap["Zancadas"], orderIndex: 2, recommendedReps: 12 },
    { routineId: routineMap["Físico - Intermedio"], exerciseId: exerciseMap["Plancha Lateral"], orderIndex: 3, recommendedMinutes: 1 },
    { routineId: routineMap["Físico - Intermedio"], exerciseId: exerciseMap["Mountain Climbers"], orderIndex: 4, recommendedReps: 20 },
    { routineId: routineMap["Físico - Intermedio"], exerciseId: exerciseMap["Superman"], orderIndex: 5, recommendedReps: 12 },

    // FÍSICO - AVANZADO
    { routineId: routineMap["Físico - Avanzado"], exerciseId: exerciseMap["Burpees"], orderIndex: 1, recommendedReps: 10 },
    { routineId: routineMap["Físico - Avanzado"], exerciseId: exerciseMap["Mountain Climbers"], orderIndex: 2, recommendedReps: 30 },
    { routineId: routineMap["Físico - Avanzado"], exerciseId: exerciseMap["Sentadilla Búlgara"], orderIndex: 3, recommendedReps: 10 },
    { routineId: routineMap["Físico - Avanzado"], exerciseId: exerciseMap["Plancha Lateral"], orderIndex: 4, recommendedMinutes: 1 },
    { routineId: routineMap["Físico - Avanzado"], exerciseId: exerciseMap["Superman"], orderIndex: 5, recommendedReps: 15 },

    // CALISTENIA - PRINCIPIANTE
    { routineId: routineMap["Calistenia - Principiante"], exerciseId: exerciseMap["Flexiones"], orderIndex: 1, recommendedReps: 8 },
    { routineId: routineMap["Calistenia - Principiante"], exerciseId: exerciseMap["Sentadillas"], orderIndex: 2, recommendedReps: 12 },
    { routineId: routineMap["Calistenia - Principiante"], exerciseId: exerciseMap["Plancha"], orderIndex: 3, recommendedMinutes: 1 },
    { routineId: routineMap["Calistenia - Principiante"], exerciseId: exerciseMap["Fondos en Paralelas"], orderIndex: 4, recommendedReps: 6 },

    // CALISTENIA - INTERMEDIO
    { routineId: routineMap["Calistenia - Intermedio"], exerciseId: exerciseMap["Flexiones Diamante"], orderIndex: 1, recommendedReps: 8 },
    { routineId: routineMap["Calistenia - Intermedio"], exerciseId: exerciseMap["Flexiones Declinadas"], orderIndex: 2, recommendedReps: 8 },
    { routineId: routineMap["Calistenia - Intermedio"], exerciseId: exerciseMap["Sentadilla Búlgara"], orderIndex: 3, recommendedReps: 8 },
    { routineId: routineMap["Calistenia - Intermedio"], exerciseId: exerciseMap["Dominadas"], orderIndex: 4, recommendedReps: 5 },
    { routineId: routineMap["Calistenia - Intermedio"], exerciseId: exerciseMap["Plancha Lateral"], orderIndex: 5, recommendedMinutes: 1 },

    // CALISTENIA - AVANZADO
    { routineId: routineMap["Calistenia - Avanzado"], exerciseId: exerciseMap["Pike Push-Ups"], orderIndex: 1, recommendedReps: 8 },
    { routineId: routineMap["Calistenia - Avanzado"], exerciseId: exerciseMap["Dominadas"], orderIndex: 2, recommendedReps: 6 },
    { routineId: routineMap["Calistenia - Avanzado"], exerciseId: exerciseMap["Flexiones Declinadas"], orderIndex: 3, recommendedReps: 12 },
    { routineId: routineMap["Calistenia - Avanzado"], exerciseId: exerciseMap["Pistol Squat - Progresión"], orderIndex: 4, recommendedReps: 5 },
    { routineId: routineMap["Calistenia - Avanzado"], exerciseId: exerciseMap["L-Sit - Progresión"], orderIndex: 5, recommendedMinutes: 1 },
  ]);

  console.log("Ejercicios asignados a las rutinas");
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
