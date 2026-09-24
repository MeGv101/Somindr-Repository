import "dotenv/config";
import { db } from "../db/index.js";
import { exerciseRoutines, exerciseCategories } from "../db/schema.js";

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
        {
            categoryId: categoryMap["Psico-Emocional"],
            name: "Respiración",
            description:
                "Técnicas como la respiración diafragmática o 4-7-8 ayudan a activar el sistema nervioso parasimpático, reduciendo la sensación de alerta y ansiedad en pocos minutos.",
            difficulty: "Todos los niveles",
            estimatedMinutes: 10,
        },
        {
            categoryId: categoryMap["Psico-Emocional"],
            name: "Meditación",
            description:
                "Espacios breves de meditación guiada para calmar la mente, soltar pensamientos acumulados y recuperar claridad y energía mental.",
            difficulty: "Todos los niveles",
            estimatedMinutes: 15,
        },
        {
            categoryId: categoryMap["Psico-Emocional"],
            name: "Journaling",
            description:
                "Ejercicios de escritura reflexiva para procesar emociones, identificar patrones de pensamiento y liberar tensión mental.",
            difficulty: "Todos los niveles",
            estimatedMinutes: 10,
        },
        {
            categoryId: categoryMap["Psico-Emocional"],
            name: "Grounding",
            description:
                "Técnicas de anclaje sensorial para volver al presente y reducir la sensación de desconexión o sobrecarga emocional.",
            difficulty: "Todos los niveles",
            estimatedMinutes: 8,
        },
    ]);
}

seed()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
