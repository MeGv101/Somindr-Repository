import "dotenv/config";
import { db } from "../db/index.js";
import { exerciseRoutines, exerciseCategories } from "../db/schema.js";

async function seed() {
  const categories = await db.select().from(exerciseCategories);
  const categoryMap = Object.fromEntries(
    categories.map((category) => [category.name, category.id])
  );

  await db.insert(exerciseRoutines).values([
    // FÍSICO
    {
      categoryId: categoryMap["Físico"],
      name: "Físico - Principiante",
      description: "Rutina base para desarrollar fuerza, estabilidad y coordinación.",
      difficulty: "Principiante",
      estimatedMinutes: 20,
    },
    {
      categoryId: categoryMap["Físico"],
      name: "Físico - Intermedio",
      description: "Entrenamiento con mayor volumen para seguir desarrollando condición física.",
      difficulty: "Intermedio",
      estimatedMinutes: 30,
    },
    {
      categoryId: categoryMap["Físico"],
      name: "Físico - Avanzado",
      description: "Rutina de mayor demanda que combina fuerza, core y acondicionamiento.",
      difficulty: "Avanzado",
      estimatedMinutes: 35,
    },

    // CALISTENIA
    {
      categoryId: categoryMap["Calistenia"],
      name: "Calistenia - Principiante",
      description: "Fundamentos de calistenia para aprender patrones básicos de movimiento.",
      difficulty: "Principiante",
      estimatedMinutes: 20,
    },
    {
      categoryId: categoryMap["Calistenia"],
      name: "Calistenia - Intermedio",
      description: "Progresiones de peso corporal con mayor control y dificultad.",
      difficulty: "Intermedio",
      estimatedMinutes: 30,
    },
    {
      categoryId: categoryMap["Calistenia"],
      name: "Calistenia - Avanzado",
      description: "Progresiones avanzadas centradas en fuerza, equilibrio y control corporal.",
      difficulty: "Avanzado",
      estimatedMinutes: 35,
    },
  ]);

  console.log("Rutinas de fitness insertadas");
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
