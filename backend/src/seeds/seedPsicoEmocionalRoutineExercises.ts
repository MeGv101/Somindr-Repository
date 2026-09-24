import "dotenv/config";

import { db } from "../db/index.js";
import {
    exerciseRoutines,
    exercises,
    routineExercises,
} from "../db/schema.js";

async function seed() {

    const routines = await db.select().from(exerciseRoutines);
    const exerciseList = await db.select().from(exercises);

    const routineMap = Object.fromEntries(
        routines.map(r => [r.name, r.id])
    );

    const exerciseMap = Object.fromEntries(
        exerciseList.map(e => [e.name, e.id])
    );

    await db.insert(routineExercises).values([

        // RESPIRACIÓN
        {
            routineId: routineMap["Respiración"],
            exerciseId: exerciseMap["Respiración diafragmática"],
            orderIndex: 1,
            recommendedMinutes: 5,
        },
        {
            routineId: routineMap["Respiración"],
            exerciseId: exerciseMap["Respiración 4-7-8"],
            orderIndex: 2,
            recommendedMinutes: 4,
        },
        {
            routineId: routineMap["Respiración"],
            exerciseId: exerciseMap["Respiración en caja"],
            orderIndex: 3,
            recommendedMinutes: 5,
        },

        // MEDITACIÓN
        {
            routineId: routineMap["Meditación"],
            exerciseId: exerciseMap["Meditación de atención plena"],
            orderIndex: 1,
            recommendedMinutes: 10,
        },
        {
            routineId: routineMap["Meditación"],
            exerciseId: exerciseMap["Escaneo corporal (Body scan)"],
            orderIndex: 2,
            recommendedMinutes: 8,
        },
        {
            routineId: routineMap["Meditación"],
            exerciseId: exerciseMap["Meditación de gratitud"],
            orderIndex: 3,
            recommendedMinutes: 5,
        },

        // JOURNALING
        {
            routineId: routineMap["Journaling"],
            exerciseId: exerciseMap["Escritura libre de emociones"],
            orderIndex: 1,
            recommendedMinutes: 5,
        },
        {
            routineId: routineMap["Journaling"],
            exerciseId: exerciseMap["Diario de gratitud"],
            orderIndex: 2,
            recommendedMinutes: 5,
        },
        {
            routineId: routineMap["Journaling"],
            exerciseId: exerciseMap["Carta sin enviar"],
            orderIndex: 3,
            recommendedMinutes: 10,
        },

        // GROUNDING
        {
            routineId: routineMap["Grounding"],
            exerciseId: exerciseMap["Técnica 5-4-3-2-1"],
            orderIndex: 1,
            recommendedMinutes: 5,
        },
        {
            routineId: routineMap["Grounding"],
            exerciseId: exerciseMap["Contacto con el suelo"],
            orderIndex: 2,
            recommendedMinutes: 3,
        },
        {
            routineId: routineMap["Grounding"],
            exerciseId: exerciseMap["Objeto de anclaje"],
            orderIndex: 3,
            recommendedMinutes: 3,
        },

    ]);
}

seed().then(() => process.exit(0)).catch((error) => {
    console.error(error);
    process.exit(1);
});
