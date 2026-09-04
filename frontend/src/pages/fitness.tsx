import { useState } from 'react'
import '../styles/fitness.css'
import Footer from '../components/footer'

interface InfoItem {
  id: string
  title: string
  image: string
  short: string
  details: string
  benefits: string[]
}

const psicoEmocional: InfoItem[] = [
  {
    id: 'respiracion',
    title: 'Respiración',
    image:
      'https://images.pexels.com/photos/8795388/pexels-photo-8795388.jpeg?auto=compress&cs=tinysrgb&w=800',
    short:
      'Ejercicios de respiración consciente para regular el sistema nervioso.',
    details:
      'Técnicas como la respiración diafragmática o 4-7-8 ayudan a activar el sistema nervioso parasimpático, reduciendo la sensación de alerta y ansiedad en pocos minutos.',
    benefits: [
      'Reduce el ritmo cardíaco y la tensión',
      'Mejora la concentración',
      'Se puede practicar en cualquier lugar',
    ],
  },
  {
    id: 'meditacion',
    title: 'Meditación',
    image:
      'https://images.pexels.com/photos/4498364/pexels-photo-4498364.jpeg?auto=compress&cs=tinysrgb&w=800',
    short:
      'Espacios breves de quietud para observar la mente sin juzgarla.',
    details:
      'Sesiones guiadas o en silencio, de 5 a 20 minutos, enfocadas en la respiración, un mantra o las sensaciones corporales, para entrenar la atención y bajar el ritmo mental.',
    benefits: [
      'Disminuye el estrés acumulado',
      'Favorece el descanso y el sueño',
      'Aumenta la claridad mental',
    ],
  },
  {
    id: 'mindfulness',
    title: 'Mindfulness',
    image:
      'https://images.pexels.com/photos/3094215/pexels-photo-3094215.jpeg?auto=compress&cs=tinysrgb&w=800',
    short:
      'Atención plena al momento presente durante actividades cotidianas.',
    details:
      'Consiste en observar pensamientos, emociones y sensaciones sin reaccionar de forma automática, aplicando la atención plena incluso mientras caminas, comes o trabajas.',
    benefits: [
      'Reduce pensamientos repetitivos',
      'Mejora la relación con las emociones',
      'Aumenta el disfrute de lo cotidiano',
    ],
  },
  {
    id: 'relajacion-mental',
    title: 'Relajación mental',
    image:
      'https://images.pexels.com/photos/6940880/pexels-photo-6940880.jpeg?auto=compress&cs=tinysrgb&w=800',
    short:
      'Pausas activas para soltar la sobrecarga de pensamientos.',
    details:
      'Ejercicios breves de visualización o desconexión digital que permiten a la mente descansar entre tareas, evitando la fatiga mental acumulada durante el día.',
    benefits: [
      'Previene el agotamiento mental',
      'Mejora la productividad al retomar tareas',
      'Baja los niveles de irritabilidad',
    ],
  },
  {
    id: 'escritura-emocional',
    title: 'Escritura emocional',
    image:
      'https://images.pexels.com/photos/7622876/pexels-photo-7622876.jpeg?auto=compress&cs=tinysrgb&w=800',
    short:
      'Escribir libremente sobre lo que sientes para procesarlo mejor.',
    details:
      'Dedicar unos minutos a escribir sin filtros sobre emociones, preocupaciones o logros del día ayuda a ordenar ideas y a reconocer patrones emocionales con el tiempo.',
    benefits: [
      'Ayuda a liberar tensión emocional',
      'Facilita el autoconocimiento',
      'Sirve como registro de tu progreso',
    ],
  },
  {
    id: 'relajacion-guiada',
    title: 'Relajación guiada',
    image:
      'https://images.pexels.com/photos/6864497/pexels-photo-6864497.jpeg?auto=compress&cs=tinysrgb&w=800',
    short:
      'Audios o rutinas guiadas paso a paso para soltar el cuerpo y la mente.',
    details:
      'Una voz guía te acompaña a relajar cada zona del cuerpo y a calmar la mente, ideal antes de dormir o después de una jornada intensa.',
    benefits: [
      'Facilita conciliar el sueño',
      'Reduce la tensión muscular',
      'No requiere experiencia previa',
    ],
  },
]

const fisico: InfoItem[] = [
  {
    id: 'estiramientos',
    title: 'Estiramientos',
    image:
      'https://images.pexels.com/photos/5132103/pexels-photo-5132103.jpeg?auto=compress&cs=tinysrgb&w=800',
    short:
      'Elongación muscular suave para liberar tensión acumulada.',
    details:
      'Movimientos lentos y sostenidos que trabajan los principales grupos musculares, ideales al despertar o después de estar mucho tiempo sentado.',
    benefits: [
      'Alivia la rigidez muscular',
      'Mejora la circulación',
      'Reduce el riesgo de lesiones',
    ],
  },
  {
    id: 'movilidad',
    title: 'Movilidad',
    image:
      'https://images.pexels.com/photos/6339393/pexels-photo-6339393.jpeg?auto=compress&cs=tinysrgb&w=800',
    short:
      'Ejercicios articulares para mantener un rango de movimiento saludable.',
    details:
      'Rutinas enfocadas en hombros, cadera, columna y tobillos que mejoran la amplitud de movimiento y previenen molestias por sedentarismo.',
    benefits: [
      'Mejora la postura',
      'Facilita el movimiento diario',
      'Previene dolores articulares',
    ],
  },
  {
    id: 'ejercicio-suave',
    title: 'Ejercicio suave',
    image:
      'https://images.pexels.com/photos/7500321/pexels-photo-7500321.jpeg?auto=compress&cs=tinysrgb&w=800',
    short:
      'Actividad física de baja intensidad, ideal para todos los niveles.',
    details:
      'Series cortas de movimientos accesibles, sin impacto fuerte, pensadas para mantenerte activo sin generar fatiga excesiva ni sobrecarga.',
    benefits: [
      'Apto para principiantes',
      'Favorece la constancia',
      'Cuida las articulaciones',
    ],
  },
  {
    id: 'yoga',
    title: 'Yoga',
    image:
      'https://images.pexels.com/photos/7880078/pexels-photo-7880078.jpeg?auto=compress&cs=tinysrgb&w=800',
    short:
      'Posturas y respiración combinadas para el cuerpo y la mente.',
    details:
      'Secuencias de posturas (asanas) coordinadas con la respiración que trabajan fuerza, flexibilidad y equilibrio, además de calmar el sistema nervioso.',
    benefits: [
      'Mejora fuerza y flexibilidad',
      'Reduce el estrés físico y mental',
      'Favorece el equilibrio y la postura',
    ],
  },
  {
    id: 'caminata',
    title: 'Caminata',
    image:
      'https://images.pexels.com/photos/13861031/pexels-photo-13861031.jpeg?auto=compress&cs=tinysrgb&w=800',
    short:
      'Caminar a ritmo cómodo, una de las formas más simples de moverte.',
    details:
      'Salir a caminar entre 15 y 30 minutos, al aire libre o en interiores, es una actividad accesible que combina beneficios físicos y mentales.',
    benefits: [
      'Mejora la salud cardiovascular',
      'Despeja la mente',
      'Fácil de incorporar a la rutina diaria',
    ],
  },
  {
    id: 'relajacion-corporal',
    title: 'Relajación corporal',
    image:
      'https://images.pexels.com/photos/9146364/pexels-photo-9146364.jpeg?auto=compress&cs=tinysrgb&w=800',
    short:
      'Técnicas para soltar la tensión física acumulada en el cuerpo.',
    details:
      'Ejercicios de relajación progresiva que consisten en tensar y soltar distintos grupos musculares, ayudando a liberar la tensión física del día.',
    benefits: [
      'Disminuye la tensión muscular',
      'Mejora la calidad del descanso',
      'Complementa otras rutinas físicas',
    ],
  },
]

function InfoCard({
  item,
  flipped,
  onFlip,
  variant,
}: {
  item: InfoItem
  flipped: boolean
  onFlip: () => void
  variant: 'green' | 'red'
}) {
  return (
    <div
      className={`info-card info-card--${variant} ${
        flipped ? 'active' : ''
      }`}
    >
      <div className="info-card-face info-card-front">
        <img
          className="info-card-image"
          src={item.image}
          alt={item.title}
          loading="lazy"
        />

        <div className="info-card-overlay" />

        <div className="info-card-front-content">
          <h3>{item.title}</h3>

          <button className="btn-flip" onClick={onFlip}>
            Ver más →
          </button>
        </div>
      </div>

      <div className="info-card-face info-card-back">
        <h3>{item.title}</h3>

        <p>{item.details}</p>

        <ul className="info-benefits">
          {item.benefits.map((benefit) => (
            <li key={benefit}>{benefit}</li>
          ))}
        </ul>

        <button className="btn-flip btn-back" onClick={onFlip}>
          Volver
        </button>
      </div>
    </div>
  )
}

export default function Fitness() {
  const [flipped, setFlipped] = useState<Record<string, boolean>>({})

  const toggleFlip = (id: string) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <>
      <main className="fitness-page">
        <section className="fitness-hero">
          <h1>Fitness</h1>

          <p>
            Bienvenido al módulo fitness de Somindr! Aquí encontrarás
            información práctica sobre ejercicios que cuidan tanto tu cuerpo
            como tu mente.
          </p>

          <br />

          <p>
            Explora cada categoría, conoce sus beneficios y elige los
            ejercicios que mejor se adapten a cómo te sientes hoy.
          </p>
        </section>

        <section className="fitness-section">
          <div className="fitness-glass-grid">
            <div className="fitness-glass-card">
              <h3>Constancia</h3>
              <p>
                Pequeños avances diarios construyen resultados que perduran.
              </p>
            </div>

            <div className="fitness-glass-card">
              <h3>Cuerpo y mente</h3>
              <p>
                El bienestar físico y emocional avanzan mejor juntos.
              </p>
            </div>

            <div className="fitness-glass-card">
              <h3>Escucha tu cuerpo</h3>
              <p>
                El descanso también es parte del entrenamiento.
              </p>
            </div>
          </div>
        </section>

        <section className="fitness-section info-section">
          <div className="info-section-header info-section-header--green">
            <h2>Psico-Emocional</h2>

            <p>
              Ejercicios enfocados en calmar la mente, procesar emociones y
              recuperar energía mental.
            </p>
          </div>

          <div className="info-grid">
            {psicoEmocional.map((item) => (
              <InfoCard
                key={item.id}
                item={item}
                variant="green"
                flipped={!!flipped[item.id]}
                onFlip={() => toggleFlip(item.id)}
              />
            ))}
          </div>
        </section>

        <section className="fitness-section info-section">
          <div className="info-section-header info-section-header--red">
            <h2>Físico</h2>

            <p>
              Ejercicios de bajo impacto para cuidar el cuerpo, mejorar la
              movilidad y mantenerte activo sin sobrecargarte.
            </p>
          </div>

          <div className="info-grid">
            {fisico.map((item) => (
              <InfoCard
                key={item.id}
                item={item}
                variant="red"
                flipped={!!flipped[item.id]}
                onFlip={() => toggleFlip(item.id)}
              />
            ))}
          </div>
        </section>

        <Footer />
      </main>
    </>
  )
}