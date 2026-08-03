import "dotenv/config";
import { db } from "../db/index.js";
import {
  exercises,
} from "../db/schema.js";

async function seed() {
  await db.insert(exercises).values([
  {
    name: "Flexiones",
    description: "Ejercicio de empuje para pecho, hombros y tríceps."
  },
  {
    name: "Sentadillas",
    description: "Fortalece piernas y glúteos."
  },
  {
    name: "Plancha",
    description: "Ejercicio isométrico para abdomen y core."
  },
  {
    name: "Burpees",
    description: "Ejercicio cardiovascular de cuerpo completo."
  },
  {
    name: "Jumping Jacks",
    description: "Cardio ligero para aumentar la frecuencia cardíaca."
  },
  {
    name: "Zancadas",
    description: "Trabajo unilateral para piernas y equilibrio."
  },
  {
    name: "Mountain Climbers",
    description: "Cardio y fortalecimiento del core."
  },
  {
    name: "Elevación de Rodillas",
    description: "Cardio de bajo impacto."
  },
  {
    name: "Plancha Lateral",
    description: "Fortalece los oblicuos y la estabilidad corporal."
  },
  {
    name: "Puente de Glúteos",
    description: "Fortalece glúteos y zona lumbar."
  },
  {
    name: "Fondos en Silla",
    description: "Ejercicio para tríceps usando una silla."
  },
  {
    name: "Abdominales Crunch",
    description: "Trabajo abdominal básico."
  },
  {
    name: "Superman",
    description: "Fortalece espalda baja y postura."
  },
  {
    name: "Skipping",
    description: "Correr en el lugar elevando las rodillas."
  },
  {
    name: "Saltos de Tijera",
    description: "Cardio dinámico para todo el cuerpo."
  },
  {
    name: "Sentadilla Isométrica",
    description: "Mantener posición de sentadilla contra una pared."
  },
  {
    name: "Flexiones Diamante",
    description: "Variación enfocada en tríceps."
  },
  {
    name: "Step Ups",
    description: "Subir y bajar de un escalón o banco."
  },
  {
    name: "Trote en el Lugar",
    description: "Actividad cardiovascular moderada."
  },
  {
    name: "Caminata",
    description: "Actividad aeróbica de baja intensidad."
  }
]);
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });