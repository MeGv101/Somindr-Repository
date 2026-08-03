import '../styles/aboutus.css'

interface Pilar {
  icono: string;
  nombre: string;
  color: string;
  descripcion: string;
}

interface Integrante {
  nombre: string;
  rol: string;
  bio: string;
  foto?: string;
  anchor: string; // ruta de la imagen, ej: "/imagenes/equipo/nombre.jpg"
}

const PILARES: Pilar[] = [
  {
    icono: "",
    nombre: "Psicoemocional",
    color: "#13f666",
    descripcion: "Espacio para hablar de motivación, ansiedad y bienestar mental.",
  },
  {
    icono: "",
    nombre: "Físico",
    color: "#e22e2e",
    descripcion: "Rutinas y hábitos de movimiento pensados para el día a día.",
  },
  {
    icono: "",
    nombre: "Comunidad",
    color: "#b272f1",
    descripcion: "Espacio para compartir experiencias, resolver dudas y motivarse junto a otras personas.",
  },
];

// Reemplaza "foto" por la ruta real de cada imagen cuando la tengan lista.
const EQUIPO: Integrante[] = [
  { nombre: "Adán Bonilla", rol: "Desarrollo Frontend", bio: "Encargado de la experiencia visual e interfaz de Somindr.", foto: "../media/SRC/New Adan.png", anchor: "https://github.com/adansho" },
  { nombre: "Mario Guzmán", rol: "Desarrollo Fullstack",  bio: "Encargado de la lógica, datos y funcionamiento de la plataforma.", foto: "../media/SRC/New Mario.png", anchor: "https://github.com/MeGv101"},
  { nombre: "Gabriel Marroquín", rol: "Desarrollo Backend",  bio: "Encargado del contenido en nutrición, físico y salud emocional.", foto: "../media/SRC/New Gabriel.png", anchor: "https://github.com/coquinhio"},
  { nombre: "Emily Flores", rol: "Desarrollo Frontend",        bio: "Encargado de que la plataforma sea clara, cómoda y accesible.", foto: "../media/SRC/New Me.png", anchor: "https://github.com/EmilyFLores09"},
];

function iniciales(nombre: string) {
  return nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0]?.toUpperCase())
    .join("");
}

export default function sobreNosotros(): import("react/jsx-runtime").JSX.Element {
  return (
    <div className="sobrenosotros-page">

     
      <div className="titulo-hero">
        <div className="aurora">
          <span className="blob b1"></span>
          <span className="blob b2"></span>
          <span className="blob b3"></span>
          <span className="blob b4"></span>
          <span className="blob b5"></span>
        </div>
        <h1>Somindr</h1>
        <h2>Sobre nosotros</h2>
        <p>Un espacio pensado para que nadie atraviese solo su proceso físico y emocional.</p>
      </div>

    
      <section className="sn-section">
        <h2>¿Qué es Somindr?</h2>

        <div className="proyecto-grid">
          <div className="proyecto-texto">
            <p>
              <strong>Somindr</strong> nació de una idea simple: la salud no se trata solo del
              cuerpo. La actividad física y bienestar emocional están conectados, y muchas
              veces se abordan por separado o no se abordan del todo.
            </p>
            <p>
              Creamos una plataforma donde adolescentes y jóvenes pueden encontrar rutinas,
              información confiable y, sobre todo, una comunidad donde preguntar sin pena y
              compartir sin miedo a ser juzgados.
            </p>
            <p>
              Este proyecto está en constante construcción, y cada función que agregamos parte de
              una misma pregunta: <strong>¿esto realmente ayuda a alguien hoy?</strong>
            </p>
          </div>

          <div className="mision-card">
            <h3>Nuestra misión</h3>
            <p>
              Acompañar a quienes están construyendo hábitos más sanos, con información clara y
              una comunidad que escucha antes de opinar.
            </p>
          </div>
        </div>
      </section>

    
      <section className="sn-section">
        <h2>Nuestros pilares</h2>
        <p className="sn-lead">
          Todo dentro de Somindr —rutinas, foro y contenido— se organiza alrededor de tres áreas.
        </p>

        <div className="pilares-grid">
          {PILARES.map(p => (
            <div className="pilar-card" key={p.nombre} style={{ ["--sn-color" as any]: p.color }}>
              <span className="pilar-icono">{p.icono}</span>
              <h3>{p.nombre}</h3>
              <p>{p.descripcion}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Equipo — fotos de los 4 integrantes */}
      <section className="sn-section">
        <h2>El equipo</h2>
        <p className="sn-lead">
          Cuatro personas detrás de Somindr, cada una aportando desde su área.
        </p>

        <div className="equipo-grid">
          {EQUIPO.map(m => (
            <a href={m.anchor} target="_blank">
            <div className="integrante-card" key={m.nombre}>
              <div className="integrante-foto">
                {m.foto
                  ? <img src={m.foto} alt={m.nombre} />
                  : <span className="placeholder-iniciales">{iniciales(m.nombre)}</span>}
              </div>
              <h3>{m.nombre}</h3>
              <span className="integrante-rol">{m.rol}</span>
              <p className="integrante-bio">{m.bio}</p>
            </div>
            </a>
          ))}
        </div>
      </section>

    </div>
  );
}