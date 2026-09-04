import "dotenv/config";
import { db } from "../db/index.js";
import {
  exercises,
} from "../db/schema.js";

async function seed() {
  await db.insert(exercises).values([
    // RESPIRACIÓN
    {
      name: "Respiración diafragmática",
      description:
        "Inhala profundo por la nariz llevando el aire al abdomen y exhala lento por la boca. Activa el sistema nervioso parasimpático.",
    },
    {
      name: "Respiración 4-7-8",
      description:
        "Inhala en 4 segundos, sostén el aire 7 segundos y exhala en 8 segundos. Ideal para calmar la ansiedad antes de dormir.",
    },
    {
      name: "Respiración en caja",
      description:
        "Inhala, sostén, exhala y sostén nuevamente en ciclos de 4 segundos cada uno para regular el sistema nervioso.",
    },

    // MEDITACIÓN
    {
      name: "Meditación de atención plena",
      description:
        "Enfoca tu atención en la respiración y regresa suavemente a ella cada vez que la mente divague.",
    },
    {
      name: "Escaneo corporal (Body scan)",
      description:
        "Recorre mentalmente cada parte de tu cuerpo, de pies a cabeza, liberando la tensión que encuentres.",
    },
    {
      name: "Meditación de gratitud",
      description:
        "Dedica unos minutos a reconocer 3 cosas por las que te sientes agradecido hoy.",
    },

    // JOURNALING
    {
      name: "Escritura libre de emociones",
      description:
        "Escribe sin filtro lo que sientes durante unos minutos, sin juzgar ni corregir lo que sale.",
    },
    {
      name: "Diario de gratitud",
      description:
        "Anota 3 cosas positivas que ocurrieron durante tu día, por pequeñas que parezcan.",
    },
    {
      name: "Carta sin enviar",
      description:
        "Escribe una carta expresando lo que necesitas decir, sin la intención de enviarla a nadie.",
    },

    // GROUNDING
    {
      name: "Técnica 5-4-3-2-1",
      description:
        "Identifica 5 cosas que ves, 4 que puedes tocar, 3 que escuchas, 2 que hueles y 1 que saboreas.",
    },
    {
      name: "Contacto con el suelo",
      description:
        "Siente tus pies firmes contra el piso y respira mientras notas esa sensación de estabilidad.",
    },
    {
      name: "Objeto de anclaje",
      description:
        "Sostén un objeto cercano y describe mentalmente su textura, peso y temperatura con detalle.",
    },
  ]);
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
