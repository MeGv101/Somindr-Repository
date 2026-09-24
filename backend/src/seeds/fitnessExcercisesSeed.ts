import "dotenv/config";
import { db } from "../db/index.js";
import { exercises } from "../db/schema.js";

async function seed() {
  await db.insert(exercises).values([
    // FÍSICO
    { name: "Sentadillas", description: "Fortalecen piernas y glúteos y mejoran el control del movimiento." },
    { name: "Zancadas", description: "Ejercicio unilateral para piernas, estabilidad y coordinación." },
    { name: "Puente de Glúteos", description: "Fortalece glúteos y trabaja la estabilidad de la cadera." },
    { name: "Plancha", description: "Ejercicio isométrico para fortalecer el core y mejorar la estabilidad." },
    { name: "Plancha Lateral", description: "Trabaja el core lateral y la estabilidad del tronco." },
    { name: "Mountain Climbers", description: "Movimiento dinámico que combina acondicionamiento y trabajo de core." },
    { name: "Jumping Jacks", description: "Ejercicio dinámico para coordinación y acondicionamiento cardiovascular." },
    { name: "Burpees", description: "Movimiento de cuerpo completo que combina sentadilla, apoyo y salto." },
    { name: "Superman", description: "Fortalece la espalda y ayuda a desarrollar control del tronco." },

    // CALISTENIA
    { name: "Flexiones", description: "Ejercicio básico de empuje para pecho, hombros, brazos y core." },
    { name: "Flexiones Diamante", description: "Variación de flexión con mayor énfasis en tríceps y control corporal." },
    { name: "Flexiones Declinadas", description: "Progresión de flexiones que aumenta la demanda sobre hombros y pecho." },
    { name: "Pike Push-Ups", description: "Progresión de empuje vertical para desarrollar fuerza de hombros." },
    { name: "Fondos en Paralelas", description: "Ejercicio de empuje para pecho y tríceps usando barras paralelas." },
    { name: "Dominadas", description: "Ejercicio de tracción para espalda y brazos usando una barra." },
    { name: "Sentadilla Búlgara", description: "Ejercicio unilateral de piernas que exige equilibrio y control." },
    { name: "Pistol Squat - Progresión", description: "Progresión unilateral de sentadilla para trabajar fuerza, equilibrio y control." },
    { name: "L-Sit - Progresión", description: "Ejercicio isométrico de core y tren superior mediante progresiones controladas." },
  ]);

  console.log("Ejercicios de fitness insertados");
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
