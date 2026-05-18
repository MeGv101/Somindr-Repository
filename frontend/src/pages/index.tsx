import '../styles/index.css'
import Navbar from '../components/navbar'

export default function Index() {
  return (
    <>
    <Navbar />
    <section className="hero">
        <div className="slide activo">
            <div className="slide-1-bg">
                <div className="slide-deco">
                    <div className="slide-deco-circle" ></div>
                    <div className="slide-deco-circle" ></div>
                </div>
            </div>
            <div className="slide-overlay">
                <img src="../MEDIA/SRC/pexels-alexander-suarez-327516789-34523833.jpg" alt="slide1" />
            </div>
            <div className="slide-content">
                <div className="slide-badge">Nuevas experiencias</div>
                <h2 className="slide-titulo">Siente el<br/>Movimiento</h2>
                <p className="slide-sub">Entrena con propósito. Cada repetición es un paso hacia tu mejor versión.</p>
                <div>
                    <a href="psicoemocional.php" className="slide-btn">Explorar →</a>
                    <a href="#modulos" className="slide-btn slide-btn-outline">Ver módulos</a>
                </div>
            </div>
            <div className="slide-numero">01</div>
        </div>
        <div className="slide">
            <div className="slide-2-bg">
                <div className="slide-deco">
                    <div className="slide-deco-circle" ></div>
                    <div className="slide-deco-circle" ></div>
                </div>
            </div>
            <div className="slide-overlay">
                <img src="../MEDIA/SRC/pexels-phamthe-24251921.jpg" alt="slide2" />
            </div>
            <div className="slide-content">
                <div className="slide-badge">Psico-Emocional</div>
                <h2 className="slide-titulo">Cuerpo<br/>y Mente</h2>
                <p className="slide-sub">El bienestar emocional es el pilar invisible de tu transformación física.</p>
                <a href="psicoemocional.php" className="slide-btn">Comenzar →</a>
            </div>
            <div className="slide-numero">02</div>
        </div>
        <div className="slide">
            <div className="slide-3-bg">
                <div className="slide-deco">
                    <div className="slide-deco-circle" ></div>
                    <div className="slide-deco-circle" ></div>
                </div>
            </div>
            <div className="slide-overlay">
                <img src="../MEDIA/SRC/pexels-chente8888-35006998.jpg" alt="slide3" />
            </div>
            <div className="slide-content">
                <div className="slide-badge">⚡ Evolución diaria</div>
                <h2 className="slide-titulo">Evoluciona<br/>Cada Día</h2>
                <p className="slide-sub">Tu mejor versión empieza hoy. Integra salud física, mental y nutricional.</p>
                <a href="inicioSesion.html" className="slide-btn">Comenzar Gratis →</a>
            </div>
            <div className="slide-numero">03</div>
        </div>
        <script src="../JS/index.js"></script>
        <button className="slider-arrow arrow-prev" id="prev">←</button>
        <button className="slider-arrow arrow-next" id="next">→</button>
        <div className="slider-dots" id="dots"></div>
        <div className="slider-progress" id="progress"></div>
    </section>
        <div className="stats-band">
        <div className="stat-item">
            <div className="stat-num">12K+</div>
            <div className="stat-label">Usuarios activos</div>
        </div>
        <div className="stat-sep"></div>
        <div className="stat-item">
            <div className="stat-num">98%</div>
            <div className="stat-label">Satisfacción de usuarios</div>
        </div>
        <div className="stat-sep"></div>
        <div className="stat-item">
            <div className="stat-num">2</div>
            <div className="stat-label">Módulos salva vidas</div>
        </div>
        <div className="stat-sep"></div>
        <div className="stat-item">
            <div className="stat-num">360°</div>
            <div className="stat-label">Cambio total en tu vida</div>
        </div>
        </div>
        <section id="modulos" >
        <a href="psicoemocional.html" className="modulo-split" id="split-psico">
            <img src="../MEDIA/SRC/pexels-arthousestudio-7363328.jpg" alt="Psico-Emocional" />
            <div className="split-overlay"></div>
            <div className="split-content">
            <span className="split-tag">Bienestar mental</span>
            <h2 className="split-titulo">Psico Emocional</h2>
            <p className="split-desc">Conecta con tu estado de ánimo y trabaja desde la raíz de tus bloqueos emocionales.</p>
            <span className="split-cta">Explorar →</span>
            </div>
        </a>
        <div className="split-divider"><span></span></div>
        <a href="fitness.html" className="modulo-split" id="split-fit">
            <img src="../MEDIA/SRC/pexels-cristian-camilo-estrada-2152272341-36451470.jpg" alt="Fitness" />
            <div className="split-overlay split-overlay-fit"></div>
            <div className="split-content">
            <span className="split-tag">Fitness</span>
            <h2 className="split-titulo">Fitness Adaptativo</h2>
            <p className="split-desc">Entrena con propósito, mejora tu energía y transforma tu cuerpo con rutinas que evolucionan contigo.</p>
            <span className="split-cta">Explorar →</span>
            </div>
        </a>
        </section>

    <section className="carousel-wrap">
        <div className="carousel-header">
            <p>opiniones verificadas</p>
            <h2>Lo que dicen nuestros clientes</h2>
        </div>
        <div className="track-outer" id="trackOuter">
            <div className="track" id="track"></div>
        </div>
        <div className="controls">
            <button className="btn-nav" id="btnPrev" aria-label="Anterior">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M9 2L4 7L9 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <div className="dots" id="review-dots"></div>
            <button className="btn-nav" id="btnNext" aria-label="Siguiente">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 2L10 7L5 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
        <script src="../JS/carrusel.js"></script>
    </section>
    <section className="seccion sobre">
        <div className="sobre-inner">
            <div className="sobre-texto">
                <div className="tag">Nuestra Misión</div>
                <h2>Sobre<br/>Somindr</h2>
                <p>Fit Emotional nació de la comprensión de que salud y bienestar van más profundamente conectados de lo que muchos creen. Somos una plataforma única que entiende que cada persona es diferente.</p>
                <p>Integramos el bienestar emocional al proceso de transformación física. De esta forma nadie queda atrás sin importar su punto de partida.</p>
                <p>Nuestra misión: llevarte a una vida más plena a través del bienestar físico y emocional, con equilibrio, ciencia y dedicación especial por tu salud.</p>
                <a href="#" className="btn-verde">Conoce tu transformación →</a>
            </div>
            <div className="sobre-visual">
                <div className="sobre-visual-main"></div>
                <div className="sobre-visual-badge">
                    <div className="sobre-visual-badge-icon"></div>
                    <div className="sobre-visual-badge-texto">
                        <strong>Bienestar 360°</strong>
                        <span>Física, mental y nutrición</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section className="cta">
        <h2>¿Listo para transformar tu vida?</h2>
        <p>Comienza hoy y descubre el potencial que tienes. Únete a miles de personas transformando su vida con Fit Emotional.</p>
        <div className="cta-btns">
            <a href="inicioSesion.html" className="btn-blanco">Comenzar Gratis →</a>
            <a href="#modulos" className="btn-outline-blanco">Ver módulos</a>
        </div>
    </section>
    <footer>
        <div>
            <div className="footer-logo">SOMINDR <span></span></div>
            <p>© 2025 Fit Emotional. Todos los derechos reservados.</p>
        </div>
        <div className="footer-links">
            <a href="#">Inicio</a>
            <a href="#">Psico-Emocional</a>
            <a href="#">Nutrición</a>
            <a href="#">Fitness</a>
            <a href="#">Perfil</a>
        </div>
    </footer>
    </>
  )
}