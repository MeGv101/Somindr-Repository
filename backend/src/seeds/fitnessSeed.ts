import "dotenv/config";
import { db } from "../db/index.js";
import { exerciseCategories } from "../db/schema.js";

async function seed() {
  await db.insert(exerciseCategories).values([
    {
      name: "Físico",
      description: "Entrenamientos para fuerza, resistencia, movilidad y acondicionamiento físico.",
    },
    {
      name: "Calistenia",
      description: "Ejercicios con el peso corporal organizados por progresión y dificultad.",
    },
  ]);

  console.log("Categorías de fitness insertadas");
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
