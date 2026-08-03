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
      name: "Baja intensidad",
      description:
        "Actividad ligera para días de poca energía.",
    },
    {
      name: "Media intensidad",
      description:
        "Actividad moderada.",
    },
    {
      name: "Alta intensidad",
      description:
        "Entrenamiento exigente.",
    },
    {
      name: "Fuerza",
      description:
        "Desarrollo de fuerza muscular.",
    },
    {
      name: "Resistencia",
      description:
        "Mejora de resistencia física.",
    },
    {
      name: "Ganancia muscular",
      description:
        "Enfocada en hipertrofia.",
    },
    {
      name: "Pérdida de grasa",
      description:
        "Mayor gasto energético.",
    },
  ]);

  console.log(
    "Categorías insertadas"
  );
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });