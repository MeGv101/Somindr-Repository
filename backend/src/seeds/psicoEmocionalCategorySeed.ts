import "dotenv/config";
import { db } from "../db/index.js";
import {
  exerciseCategories,
} from "../db/schema.js";

async function seed() {
  await db.insert(
    exerciseCategories
  ).values([
    {
      name: "Psico-Emocional",
      description:
        "Ejercicios enfocados en calmar la mente, procesar emociones y recuperar energía mental.",
    },
  ]);

  console.log(
    "Categoría Psico-Emocional insertada"
  );
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
