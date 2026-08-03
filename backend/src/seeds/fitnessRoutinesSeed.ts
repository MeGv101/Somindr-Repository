import "dotenv/config";
import { db } from "../db/index.js";
import { exerciseRoutines, exerciseCategories, } from "../db/schema.js";

async function seed() {

    const categories = await db
    .select()
    .from(exerciseCategories);

    const categoryMap = Object.fromEntries(
    categories.map(category => [
        category.name,
        category.id,
    ])
    );

    await db.insert(exerciseRoutines).values([
        
    // BAJA INTENSIDAD
    {
        categoryId: categoryMap["Baja intensidad"],
        name: "Baja Intensidad Principiante",
        description: "Movimiento suave para días de poca energía.",
        difficulty: "Principiante",
        estimatedMinutes: 15,
    },
    {
        categoryId: categoryMap["Baja intensidad"],
        name: "Baja Intensidad Intermedio",
        description: "Actividad ligera con mayor duración.",
        difficulty: "Intermedio",
        estimatedMinutes: 25,
    },

    // MEDIA INTENSIDAD
    {
        categoryId: categoryMap["Media intensidad"],
        name: "Media Intensidad Principiante",
        description: "Actividad cardiovascular moderada.",
        difficulty: "Principiante",
        estimatedMinutes: 20,
    },
    {
        categoryId: categoryMap["Media intensidad"],
        name: "Media Intensidad Intermedio",
        description: "Mayor volumen de trabajo aeróbico.",
        difficulty: "Intermedio",
        estimatedMinutes: 30,
    },

    // ALTA INTENSIDAD
    {
        categoryId: categoryMap["Alta intensidad"],
        name: "Alta Intensidad Intermedio",
        description: "Entrenamiento exigente de cuerpo completo.",
        difficulty: "Intermedio",
        estimatedMinutes: 20,
    },
    {
        categoryId: categoryMap["Alta intensidad"],
        name: "Alta Intensidad Avanzado",
        description: "Entrenamiento cardiovascular intenso.",
        difficulty: "Avanzado",
        estimatedMinutes: 30,
    },

    // FUERZA
    {
        categoryId: categoryMap["Fuerza"],
        name: "Fuerza Principiante",
        description: "Desarrollo inicial de fuerza.",
        difficulty: "Principiante",
        estimatedMinutes: 20,
    },
    {
        categoryId: categoryMap["Fuerza"],
        name: "Fuerza Intermedio",
        description: "Mayor volumen y dificultad.",
        difficulty: "Intermedio",
        estimatedMinutes: 30,
    },

    // RESISTENCIA
    {
        categoryId: categoryMap["Resistencia"],
        name: "Resistencia Principiante",
        description: "Mejora de la resistencia muscular.",
        difficulty: "Principiante",
        estimatedMinutes: 20,
    },
    {
        categoryId: categoryMap["Resistencia"],
        name: "Resistencia Intermedio",
        description: "Trabajo prolongado de resistencia.",
        difficulty: "Intermedio",
        estimatedMinutes: 35,
    },

    // GANANCIA MUSCULAR
    {
        categoryId: categoryMap["Ganancia muscular"],
        name: "Ganancia Muscular Principiante",
        description: "Base para hipertrofia.",
        difficulty: "Principiante",
        estimatedMinutes: 25,
    },
    {
        categoryId: categoryMap["Ganancia muscular"],
        name: "Ganancia Muscular Intermedio",
        description: "Mayor volumen para crecimiento muscular.",
        difficulty: "Intermedio",
        estimatedMinutes: 40,
    },

    // PERDIDA DE GRASA
    {
        categoryId: categoryMap["Pérdida de grasa"],
        name: "Pérdida de Grasa Principiante",
        description: "Incrementa el gasto energético.",
        difficulty: "Principiante",
        estimatedMinutes: 20,
    },
    {
        categoryId: categoryMap["Pérdida de grasa"],
        name: "Pérdida de Grasa Intermedio",
        description: "Rutina cardiovascular más demandante.",
        difficulty: "Intermedio",
        estimatedMinutes: 35,
    },
    ]);
}
seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });