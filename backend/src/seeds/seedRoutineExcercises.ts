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
    routines.map(r => [
        r.name,
        r.id
    ])
    );

    const exerciseMap = Object.fromEntries(
    exerciseList.map(e => [
        e.name,
        e.id
    ])
    );

    await db.insert(routineExercises).values([
    // FUERZA PRINCIPIANTE
    {
        routineId: routineMap["Fuerza Principiante"],
        exerciseId: exerciseMap["Flexiones"],
        orderIndex: 1,
        recommendedReps: 10,
    },
    {
        routineId: routineMap["Fuerza Principiante"],
        exerciseId: exerciseMap["Sentadillas"],
        orderIndex: 2,
        recommendedReps: 15,
    },
    {
        routineId: routineMap["Fuerza Principiante"],
        exerciseId: exerciseMap["Plancha"],
        orderIndex: 3,
        recommendedMinutes: 1,
    },
    {
        routineId: routineMap["Fuerza Principiante"],
        exerciseId: exerciseMap["Fondos en Silla"],
        orderIndex: 4,
        recommendedReps: 10,
    },

    // FUERZA INTERMEDIO
    {
        routineId: routineMap["Fuerza Intermedio"],
        exerciseId: exerciseMap["Flexiones Diamante"],
        orderIndex: 1,
        recommendedReps: 12,
    },
    {
        routineId: routineMap["Fuerza Intermedio"],
        exerciseId: exerciseMap["Sentadillas"],
        orderIndex: 2,
        recommendedReps: 20,
    },
    {
        routineId: routineMap["Fuerza Intermedio"],
        exerciseId: exerciseMap["Fondos en Silla"],
        orderIndex: 3,
        recommendedReps: 15,
    },
    {
        routineId: routineMap["Fuerza Intermedio"],
        exerciseId: exerciseMap["Plancha"],
        orderIndex: 4,
        recommendedMinutes: 2,
    },
    {
        routineId: routineMap["Fuerza Intermedio"],
        exerciseId: exerciseMap["Superman"],
        orderIndex: 5,
        recommendedReps: 15,
    },

    // RESISTENCIA PRINCIPIANTE
    {
        routineId: routineMap["Resistencia Principiante"],
        exerciseId: exerciseMap["Plancha"],
        orderIndex: 1,
        recommendedMinutes: 1,
    },
    {
        routineId: routineMap["Resistencia Principiante"],
        exerciseId: exerciseMap["Plancha Lateral"],
        orderIndex: 2,
        recommendedMinutes: 1,
    },
    {
        routineId: routineMap["Resistencia Principiante"],
        exerciseId: exerciseMap["Sentadilla Isométrica"],
        orderIndex: 3,
        recommendedMinutes: 1,
    },
    {
        routineId: routineMap["Resistencia Principiante"],
        exerciseId: exerciseMap["Puente de Glúteos"],
        orderIndex: 4,
        recommendedReps: 15,
    },

    // RESISTENCIA INTERMEDIO
    {
        routineId: routineMap["Resistencia Intermedio"],
        exerciseId: exerciseMap["Plancha"],
        orderIndex: 1,
        recommendedMinutes: 2,
    },
    {
        routineId: routineMap["Resistencia Intermedio"],
        exerciseId: exerciseMap["Plancha Lateral"],
        orderIndex: 2,
        recommendedMinutes: 2,
    },
    {
        routineId: routineMap["Resistencia Intermedio"],
        exerciseId: exerciseMap["Sentadilla Isométrica"],
        orderIndex: 3,
        recommendedMinutes: 2,
    },
    {
        routineId: routineMap["Resistencia Intermedio"],
        exerciseId: exerciseMap["Puente de Glúteos"],
        orderIndex: 4,
        recommendedReps: 25,
    },
    {
        routineId: routineMap["Resistencia Intermedio"],
        exerciseId: exerciseMap["Superman"],
        orderIndex: 5,
        recommendedReps: 20,
    },

    // BAJA INTENSIDAD PRINCIPIANTE
    {
        routineId: routineMap["Baja Intensidad Principiante"],
        exerciseId: exerciseMap["Caminata"],
        orderIndex: 1,
        recommendedMinutes: 10,
    },
    {
        routineId: routineMap["Baja Intensidad Principiante"],
        exerciseId: exerciseMap["Elevación de Rodillas"],
        orderIndex: 2,
        recommendedMinutes: 2,
    },
    {
        routineId: routineMap["Baja Intensidad Principiante"],
        exerciseId: exerciseMap["Step Ups"],
        orderIndex: 3,
        recommendedReps: 20,
    },
    {
        routineId: routineMap["Baja Intensidad Principiante"],
        exerciseId: exerciseMap["Puente de Glúteos"],
        orderIndex: 4,
        recommendedReps: 15,
    },

    // BAJA INTENSIDAD INTERMEDIO
    {
        routineId: routineMap["Baja Intensidad Intermedio"],
        exerciseId: exerciseMap["Caminata"],
        orderIndex: 1,
        recommendedMinutes: 20,
    },
    {
        routineId: routineMap["Baja Intensidad Intermedio"],
        exerciseId: exerciseMap["Step Ups"],
        orderIndex: 2,
        recommendedReps: 40,
    },
    {
        routineId: routineMap["Baja Intensidad Intermedio"],
        exerciseId: exerciseMap["Elevación de Rodillas"],
        orderIndex: 3,
        recommendedMinutes: 5,
    },
    {
        routineId: routineMap["Baja Intensidad Intermedio"],
        exerciseId: exerciseMap["Plancha"],
        orderIndex: 4,
        recommendedMinutes: 1,
    },

    // MEDIA INTENSIDAD PRINCIPIANTE
    {
        routineId: routineMap["Media Intensidad Principiante"],
        exerciseId: exerciseMap["Trote en el Lugar"],
        orderIndex: 1,
        recommendedMinutes: 5,
    },
    {
        routineId: routineMap["Media Intensidad Principiante"],
        exerciseId: exerciseMap["Jumping Jacks"],
        orderIndex: 2,
        recommendedReps: 30,
    },
    {
        routineId: routineMap["Media Intensidad Principiante"],
        exerciseId: exerciseMap["Zancadas"],
        orderIndex: 3,
        recommendedReps: 20,
    },
    {
        routineId: routineMap["Media Intensidad Principiante"],
        exerciseId: exerciseMap["Plancha"],
        orderIndex: 4,
        recommendedMinutes: 1,
    },

    // MEDIA INTENSIDAD INTERMEDIO
    {
        routineId: routineMap["Media Intensidad Intermedio"],
        exerciseId: exerciseMap["Trote en el Lugar"],
        orderIndex: 1,
        recommendedMinutes: 10,
    },
    {
        routineId: routineMap["Media Intensidad Intermedio"],
        exerciseId: exerciseMap["Jumping Jacks"],
        orderIndex: 2,
        recommendedReps: 50,
    },
    {
        routineId: routineMap["Media Intensidad Intermedio"],
        exerciseId: exerciseMap["Zancadas"],
        orderIndex: 3,
        recommendedReps: 30,
    },
    {
        routineId: routineMap["Media Intensidad Intermedio"],
        exerciseId: exerciseMap["Mountain Climbers"],
        orderIndex: 4,
        recommendedReps: 30,
    },
    {
        routineId: routineMap["Media Intensidad Intermedio"],
        exerciseId: exerciseMap["Plancha"],
        orderIndex: 5,
        recommendedMinutes: 2,
    },

    // ALTA INTENSIDAD INTERMEDIO
    {
        routineId: routineMap["Alta Intensidad Intermedio"],
        exerciseId: exerciseMap["Burpees"],
        orderIndex: 1,
        recommendedReps: 15,
    },
    {
        routineId: routineMap["Alta Intensidad Intermedio"],
        exerciseId: exerciseMap["Mountain Climbers"],
        orderIndex: 2,
        recommendedReps: 40,
    },
    {
        routineId: routineMap["Alta Intensidad Intermedio"],
        exerciseId: exerciseMap["Skipping"],
        orderIndex: 3,
        recommendedMinutes: 3,
    },
    {
        routineId: routineMap["Alta Intensidad Intermedio"],
        exerciseId: exerciseMap["Jumping Jacks"],
        orderIndex: 4,
        recommendedReps: 50,
    },

    // ALTA INTENSIDAD AVANZADO
    {
        routineId: routineMap["Alta Intensidad Avanzado"],
        exerciseId: exerciseMap["Burpees"],
        orderIndex: 1,
        recommendedReps: 30,
    },
    {
        routineId: routineMap["Alta Intensidad Avanzado"],
        exerciseId: exerciseMap["Mountain Climbers"],
        orderIndex: 2,
        recommendedReps: 60,
    },
    {
        routineId: routineMap["Alta Intensidad Avanzado"],
        exerciseId: exerciseMap["Skipping"],
        orderIndex: 3,
        recommendedMinutes: 5,
    },
    {
        routineId: routineMap["Alta Intensidad Avanzado"],
        exerciseId: exerciseMap["Jumping Jacks"],
        orderIndex: 4,
        recommendedReps: 100,
    },
    {
        routineId: routineMap["Alta Intensidad Avanzado"],
        exerciseId: exerciseMap["Trote en el Lugar"],
        orderIndex: 5,
        recommendedMinutes: 10,
    },

    // GANANCIA MUSCULAR PRINCIPIANTE
    {
        routineId: routineMap["Ganancia Muscular Principiante"],
        exerciseId: exerciseMap["Flexiones"],
        orderIndex: 1,
        recommendedReps: 15,
    },
    {
        routineId: routineMap["Ganancia Muscular Principiante"],
        exerciseId: exerciseMap["Sentadillas"],
        orderIndex: 2,
        recommendedReps: 20,
    },
    {
        routineId: routineMap["Ganancia Muscular Principiante"],
        exerciseId: exerciseMap["Fondos en Silla"],
        orderIndex: 3,
        recommendedReps: 15,
    },
    {
        routineId: routineMap["Ganancia Muscular Principiante"],
        exerciseId: exerciseMap["Puente de Glúteos"],
        orderIndex: 4,
        recommendedReps: 20,
    },

    // GANANCIA MUSCULAR NTERMEDIO
    {
        routineId: routineMap["Ganancia Muscular Intermedio"],
        exerciseId: exerciseMap["Flexiones Diamante"],
        orderIndex: 1,
        recommendedReps: 20,
    },
    {
        routineId: routineMap["Ganancia Muscular Intermedio"],
        exerciseId: exerciseMap["Sentadillas"],
        orderIndex: 2,
        recommendedReps: 30,
    },
    {
        routineId: routineMap["Ganancia Muscular Intermedio"],
        exerciseId: exerciseMap["Fondos en Silla"],
        orderIndex: 3,
        recommendedReps: 20,
    },
    {
        routineId: routineMap["Ganancia Muscular Intermedio"],
        exerciseId: exerciseMap["Puente de Glúteos"],
        orderIndex: 4,
        recommendedReps: 30,
    },
    {
        routineId: routineMap["Ganancia Muscular Intermedio"],
        exerciseId: exerciseMap["Superman"],
        orderIndex: 5,
        recommendedReps: 20,
    },

    // PÉRDIDA DE GRASA PRINCIPIANTE
    {
        routineId: routineMap["Pérdida de Grasa Principiante"],
        exerciseId: exerciseMap["Jumping Jacks"],
        orderIndex: 1,
        recommendedReps: 30,
    },
    {
        routineId: routineMap["Pérdida de Grasa Principiante"],
        exerciseId: exerciseMap["Mountain Climbers"],
        orderIndex: 2,
        recommendedReps: 20,
    },
    {
        routineId: routineMap["Pérdida de Grasa Principiante"],
        exerciseId: exerciseMap["Trote en el Lugar"],
        orderIndex: 3,
        recommendedMinutes: 5,
    },
    {
        routineId: routineMap["Pérdida de Grasa Principiante"],
        exerciseId: exerciseMap["Burpees"],
        orderIndex: 4,
        recommendedReps: 10,
    },

    // PÉRDIDA DE GRASA INTERMEDIO
    {
        routineId: routineMap["Pérdida de Grasa Intermedio"],
        exerciseId: exerciseMap["Jumping Jacks"],
        orderIndex: 1,
        recommendedReps: 60,
    },
    {
        routineId: routineMap["Pérdida de Grasa Intermedio"],
        exerciseId: exerciseMap["Mountain Climbers"],
        orderIndex: 2,
        recommendedReps: 40,
    },
    {
        routineId: routineMap["Pérdida de Grasa Intermedio"],
        exerciseId: exerciseMap["Trote en el Lugar"],
        orderIndex: 3,
        recommendedMinutes: 10,
    },
    {
        routineId: routineMap["Pérdida de Grasa Intermedio"],
        exerciseId: exerciseMap["Burpees"],
        orderIndex: 4,
        recommendedReps: 20,
    },
    {
        routineId: routineMap["Pérdida de Grasa Intermedio"],
        exerciseId: exerciseMap["Skipping"],
        orderIndex: 5,
        recommendedMinutes: 5,
    },

    ]);

}
seed().then(() => process.exit(0)).catch((error) => {
    console.error(error);
    process.exit(1);
});