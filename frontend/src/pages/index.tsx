import '../styles/index.css'
import { useEffect } from 'react'
import type { AuthTab } from '../types/auth'
import { useLocation } from "react-router-dom";
import { useModal } from "../context/modelContext";
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'


gsap.registerPlugin(ScrollTrigger)

type Review = {
  name: string
  role: string
  date: string
  rating: number
  text: string
  initials: string
  hue: string
}

const REVIEWS: Review[] = [
  {
    name: 'Laura Méndez',
    role: 'Diseñadora UX',
    date: 'marzo 2025',
    rating: 5,
    text: 'Increíble experiencia. El equipo estuvo atento en cada paso y el resultado superó todas mis expectativas.',
    initials: 'LM',
    hue: '195',
  },
  {
    name: 'Carlos Ruiz',
    role: 'Emprendedor',
    date: 'febrero 2025',
    rating: 4,
    text: 'Muy buen servicio. Rápido y confiable. Solo algunos pequeños detalles que mejorar, pero en general quedé muy satisfecho.',
    initials: 'CR',
    hue: '32',
  },
  {
    name: 'Sofía Torres',
    role: 'Directora de Marketing',
    date: 'enero 2025',
    rating: 5,
    text: 'Simplemente perfecto. La calidad del trabajo habla por sí sola. Los recomendaría sin dudarlo a cualquier colega.',
    initials: 'ST',
    hue: '285',
  },
  {
    name: 'Andrés Vega',
    role: 'Gerente de Proyectos',
    date: 'diciembre 2024',
    rating: 5,
    text: 'Cumplieron con todos los plazos y la comunicación fue excelente. Definitivamente volveré a trabajar con ellos.',
    initials: 'AV',
    hue: '152',
  },
  {
    name: 'María Castillo',
    role: 'Consultora',
    date: 'noviembre 2024',
    rating: 4,
    text: 'Profesionales, creativos y muy detallistas. El proceso fue fluido y el entregable final fue de alta calidad.',
    initials: 'MC',
    hue: '350',
  },
  {
    name: 'Diego Morales',
    role: 'CEO, Startup Tech',
    date: 'octubre 2024',
    rating: 5,
    text: 'El mejor equipo con el que he trabajado. Entienden perfectamente las necesidades del cliente y entregan resultados de primer nivel.',
    initials: 'DM',
    hue: '220',
  },
  {
    name: 'Mario Ernesto',
    role: 'Miembro Somindr',
    date: 'abril 2026',
    rating: 4,
    text: 'Me ha ayudado a cumplir todas mis metas y ambiciones. Una plataforma sólida y bien pensada.',
    initials: 'ME',
    hue: '330',
  },
]

type InfoCard = {

  title: string
  desc: string
}

const INFO_CARDS: InfoCard[] = [
  {

    title: 'Objetivo personalizado',
    desc: 'Definimos metas claras y adaptadas a tu ritmo y punto de partida.',
  },
  {

    title: 'Acompañamiento emocional',
    desc: 'Sesiones guiadas para trabajar el bienestar mental junto al físico.',
  },
  {

    title: 'Progreso medible',
    desc: 'Visualiza tu evolución semana a semana con datos reales.',
  },
  {

    title: 'Comunidad activa',
    desc: 'Conecta con personas que comparten tu mismo proceso de cambio.',
  },
]


const animateStatValue = (el: HTMLElement) => {
  const raw = el.dataset.value ?? el.textContent ?? ''
  const match = raw.match(/^([\d.]+)(.*)$/)
  if (!match) return
  const end = parseFloat(match[1])
  const suffix = match[2]
  const counter = { val: 0 }
  gsap.to(counter, {
    val: end,
    duration: 1.3,
    ease: 'power2.out',
    onUpdate: () => {
      el.textContent = `${Math.round(counter.val)}${suffix}`
    },
  })
}

type IndexProps = {
  onOpenAuth?: (tab: AuthTab) => void
}

export default function Index({ onOpenAuth }: IndexProps) {
  const location = useLocation();
  const { setAuthMessage } = useModal();

  useEffect(() => {
    const track = document.getElementById('track')
    const dotsEl = document.getElementById('review-dots')
    const btnPrev = document.getElementById('btnPrev')
    const btnNext = document.getElementById('btnNext')

    if (!track || !dotsEl || !btnPrev || !btnNext) return

    const trackGap = 24
    let current = 0
    let autoTimer: ReturnType<typeof setInterval> | null = null
    const fadeTimeouts: ReturnType<typeof setTimeout>[] = []

    const getVisible = () => (window.innerWidth <= 520 ? 1 : 2)

    const renderCards = () => {
      fadeTimeouts.forEach(clearTimeout)
      fadeTimeouts.length = 0
      track.innerHTML = ''

      REVIEWS.forEach((r, i) => {
        const card = document.createElement('div')
        card.className = 'review-card' + (i === current ? ' active' : '')

        const stars = Array.from({ length: 5 }, (_, s) =>
          `<span class="star ${s < r.rating ? 'filled' : 'empty'}">${s < r.rating ? '★' : '☆'}</span>`,
        ).join('')

        const bgColor = `hsl(${r.hue}, 55%, 90%)`
        const textColor = `hsl(${r.hue}, 50%, 30%)`

        card.innerHTML = `
          <div class="card-top">
            <div class="avatar" style="background:${bgColor};color:${textColor}">${r.initials}</div>
            <div class="stars">${stars}</div>
          </div>
          <p class="card-quote">${r.text}</p>
          <p class="card-author">${r.name}</p>
          <p class="card-role">${r.role}</p>
          <p class="card-date">${r.date}</p>
        `

        card.style.opacity = '0'
        card.style.transform = 'translateY(8px)'
        track.appendChild(card)

        fadeTimeouts.push(
          setTimeout(() => {
            card.style.transition =
              'opacity 0.45s ease, transform 0.45s ease, border-color 0.25s, box-shadow 0.25s'
            card.style.opacity = '1'
            card.style.transform = 'translateY(0)'
          }, i * 70),
        )
      })
    }

    const goTo = (idx: number) => {
      const vis = getVisible()
      const max = REVIEWS.length - vis
      current = Math.max(0, Math.min(idx, max))

      const firstCard = track.children[0] as HTMLElement | undefined
      const cardWidth = firstCard?.offsetWidth ?? 0
      track.style.transform = `translateX(-${current * (cardWidth + trackGap)}px)`

      track.querySelectorAll('.review-card').forEach((c, i) => {
        const isActive = i === current || (vis === 2 && i === current + 1)
        c.classList.toggle('active', isActive)
      })

      dotsEl.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === current)
      })

      resetAuto()
    }

    const renderDots = () => {
      const vis = getVisible()
      const steps = REVIEWS.length - vis + 1
      dotsEl.innerHTML = ''
      for (let i = 0; i < steps; i++) {
        const d = document.createElement('button')
        d.type = 'button'
        d.className = 'dot' + (i === current ? ' active' : '')
        d.setAttribute('aria-label', `Ir a opinión ${i + 1}`)
        d.addEventListener('click', () => goTo(i))
        dotsEl.appendChild(d)
      }
    }

    const next = () => {
      const max = REVIEWS.length - getVisible()
      goTo(current >= max ? 0 : current + 1)
    }

    const prev = () => {
      const max = REVIEWS.length - getVisible()
      goTo(current <= 0 ? max : current - 1)
    }

    const resetAuto = () => {
      if (autoTimer) clearInterval(autoTimer)
      autoTimer = setInterval(next, 4000)
    }

    const onResize = () => {
      renderDots()
      goTo(current)
    }

    let startX = 0
    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX
    }
    const onTouchEnd = (e: TouchEvent) => {
      const diff = startX - e.changedTouches[0].clientX
      if (Math.abs(diff) > 40) {
        if (diff > 0) next()
        else prev()
      }
    }

    btnPrev.addEventListener('click', prev)
    btnNext.addEventListener('click', next)
    track.addEventListener('touchstart', onTouchStart)
    track.addEventListener('touchend', onTouchEnd)
    window.addEventListener('resize', onResize)

    renderCards()
    renderDots()
    goTo(0)
    resetAuto()

    return () => {
      if (autoTimer) clearInterval(autoTimer)
      fadeTimeouts.forEach(clearTimeout)
      btnPrev.removeEventListener('click', prev)
      btnNext.removeEventListener('click', next)
      track.removeEventListener('touchstart', onTouchStart)
      track.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('resize', onResize)
      track.innerHTML = ''
      dotsEl.innerHTML = ''
    }
  }, [])

  useEffect(() => {

    if (
      location.state?.authMessage
    ) {

      setAuthMessage(
        location.state.authMessage
      );

    }

  }, [location, setAuthMessage]);

  useEffect(() => {
    const slides = document.querySelectorAll('.hero .slide')
    const dotsContainer = document.getElementById('dots')
    const progress = document.getElementById('progress')
    const prevBtn = document.getElementById('prev')
    const nextBtn = document.getElementById('next')

    if (!slides.length) return

    let currentSlide = 0
    let autoplayInterval: ReturnType<typeof setInterval> | null = null
    const dotElements: HTMLDivElement[] = []
    const dotHandlers: Array<() => void> = []

    const showSlide = (index: number) => {
      slides.forEach((slide, i) => {
        slide.classList.toggle('activo', i === index)
      })
      dotElements.forEach((dot, i) => {
        dot.classList.toggle('activo', i === index)
      })
      if (progress) {
        progress.style.width = `${((index + 1) / slides.length) * 100}%`
      }
    }

    const nextSlide = () => {
      currentSlide = (currentSlide + 1) % slides.length
      showSlide(currentSlide)
      resetAutoplay()
    }

    const prevSlide = () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length
      showSlide(currentSlide)
      resetAutoplay()
    }

    const startAutoplay = () => {
      autoplayInterval = setInterval(nextSlide, 5000)
    }

    const resetAutoplay = () => {
      if (autoplayInterval) clearInterval(autoplayInterval)
      startAutoplay()
    }

    if (dotsContainer) {
      slides.forEach((_, i) => {
        const dot = document.createElement('div')
        dot.className = `dot${i === 0 ? ' activo' : ''}`
        const goTo = () => {
          currentSlide = i
          showSlide(i)
          resetAutoplay()
        }
        dot.addEventListener('click', goTo)
        dotsContainer.appendChild(dot)
        dotElements.push(dot)
        dotHandlers.push(goTo)
      })
    }

    prevBtn?.addEventListener('click', prevSlide)
    nextBtn?.addEventListener('click', nextSlide)
    startAutoplay()

    return () => {
      if (autoplayInterval) clearInterval(autoplayInterval)
      prevBtn?.removeEventListener('click', prevSlide)
      nextBtn?.removeEventListener('click', nextSlide)
      dotElements.forEach((dot, i) => {
        dot.removeEventListener('click', dotHandlers[i])
      })
      if (dotsContainer) dotsContainer.innerHTML = ''
    }
  }, [])


  useEffect(() => {
    const ctx = gsap.context(() => {
     
      gsap.set('.stat-item', { opacity: 0, y: 24 })
      ScrollTrigger.batch('.stat-item', {
        start: 'top 88%',
        once: true,
        onEnter: (batch: Element[]) => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            stagger: 0.12,
          })
          batch.forEach((item: Element) => {
            item.querySelectorAll<HTMLElement>('.stat-num').forEach((el) => animateStatValue(el))
          })
        },
      })


      gsap.utils.toArray<HTMLElement>('.modulo-split').forEach((el: any, i: number) => {
        gsap.fromTo(
          el,
          { opacity: 0, x: i % 2 === 0 ? -70 : 70 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 82%', once: true },
          },
        )
      })

      gsap.fromTo(
        '.carousel-header',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.carousel-wrap', start: 'top 82%', once: true },
        },
      )
      gsap.fromTo(
        '.track-outer',
        { opacity: 0, scale: 0.94 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.track-outer', start: 'top 88%', once: true },
        },
      )

  
      gsap.utils.toArray<HTMLElement>('.info-card').forEach((el: any, i: number) => {
        gsap.fromTo(
          el,
          { opacity: 0, scale: 0.35, x: i % 2 === 0 ? -55 : 55 },
          {
            opacity: 1,
            scale: 1,
            x: 0,
            duration: 0.9,
            delay: i * 0.08,
            ease: 'back.out(1.6)',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          },
        )
      })

  
      gsap.fromTo(
        '.sobre-texto',
        { opacity: 0, x: -60 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.sobre-inner', start: 'top 78%', once: true },
        },
      )
      gsap.fromTo(
        '.sobre-visual',
        { opacity: 0, x: 60, scale: 0.92 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.sobre-inner', start: 'top 78%', once: true },
        },
      )

     
      gsap.fromTo(
        ['.cta h2', '.cta p', '.cta-btns'],
        { opacity: 0, scale: 0.85, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'back.out(1.7)',
          scrollTrigger: { trigger: '.cta', start: 'top 85%', once: true },
        },
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <>
      <section className="hero">
        <div className="slide activo">
          <div className="slide-1-bg">
            <div className="slide-deco">
              <div className="slide-deco-circle"></div>
              <div className="slide-deco-circle"></div>
            </div>
          </div>
          <div className="slide-overlay">
            <img src="/media/SRC/pexels-alexander-suarez-327516789-34523833.jpg" alt="slide1" />
          </div>
          <div className="slide-content">
            <div className="slide-badge">Nuevas experiencias</div>
            <h2 className="slide-titulo">
              Siente el
              <br />
              Movimiento
            </h2>
            <p className="slide-sub">
              Entrena con propósito. Cada repetición es un paso hacia tu mejor versión.
            </p>
            <div>
              <a href="#modulos" className="slide-btn">
                Explorar →
              </a>
            </div>
          </div>
          <div className="slide-numero">01</div>
        </div>
        <div className="slide">
          <div className="slide-2-bg">
            <div className="slide-deco">
              <div className="slide-deco-circle"></div>
              <div className="slide-deco-circle"></div>
            </div>
          </div>
          <div className="slide-overlay">
            <img src="/media/SRC/pexels-phamthe-24251921.jpg" alt="slide2" />
          </div>
          <div className="slide-content">
            <div className="slide-badge">Psico-Emocional</div>
            <h2 className="slide-titulo">
              Cuerpo
              <br />y Mente
            </h2>
            <p className="slide-sub">
              El bienestar emocional es el pilar invisible de tu transformación física.
            </p>
            <a href="#modulos" className="slide-btn">
                Explorar →
              </a>
          </div>
          <div className="slide-numero">02</div>
        </div>
        <div className="slide">
          <div className="slide-3-bg">
            <div className="slide-deco">
              <div className="slide-deco-circle"></div>
              <div className="slide-deco-circle"></div>
            </div>
          </div>
          <div className="slide-overlay">
            <img src="/media/SRC/pexels-chente8888-35006998.jpg" alt="slide3" />
          </div>
          <div className="slide-content">
            <div className="slide-badge">Evolución diaria</div>
            <h2 className="slide-titulo">
              Evoluciona
              <br />
              Cada Día
            </h2>
            <p className="slide-sub">
              Tu mejor versión empieza hoy. En Somindr integras salud física y mental para mostrarla.
            </p>
            <button
              type="button"
              className="slide-btn"
              onClick={() => onOpenAuth?.('registro')}
            >
              Comenzar Gratis →
            </button>
          </div>
          <div className="slide-numero">03</div>
        </div>
        <button className="slider-arrow arrow-prev" id="prev" type="button">
          ←
        </button>
        <button className="slider-arrow arrow-next" id="next" type="button">
          →
        </button>
        <div className="slider-dots" id="dots"></div>
        <div className="slider-progress" id="progress"></div>
      </section>

      <div className="stats-band">

      </div>
      <section id="modulos">
        <a href="psicoemocional" className="modulo-split" id="split-psico">
          <img src="/media/SRC/pexels-arthousestudio-7363328.jpg" alt="Psico-Emocional" />
          <div className="split-overlay"></div>
          <div className="split-content">
            <span className="split-tag">Bienestar mental</span>
            <h2 className="split-titulo">Psico Emocional</h2>
            <p className="split-desc">
              Conecta con tu estado de ánimo y trabaja desde la raíz de tus bloqueos emocionales.
            </p>
            <span className="split-cta">Explorar →</span>
          </div>
        </a>
        <div className="split-divider">
          <span></span>
        </div>
        <a href="fitness" className="modulo-split" id="split-fit">
          <img
            src="/media/SRC/pexels-cristian-camilo-estrada-2152272341-36451470.jpg"
            alt="Fitness"
          />
          <div className="split-overlay split-overlay-fit"></div>
          <div className="split-content">
            <span className="split-tagFit">Fitness</span>
            <h2 className="split-titulo">Fitness Adaptativo</h2>
            <p className="split-desc">
              Entrena con propósito, mejora tu energía y transforma tu cuerpo con rutinas que
              tu mismo puedes personalizar.
            </p>

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
          <button className="btn-nav" id="btnPrev" type="button" aria-label="Anterior">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M9 2L4 7L9 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className="dots" id="review-dots"></div>
          <button className="btn-nav" id="btnNext" type="button" aria-label="Siguiente">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M5 2L10 7L5 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </section>

      <section className="info-band" id="info-band">
        <div className="info-band-glow info-band-glow-a"></div>
        <div className="info-band-glow info-band-glow-b"></div>
        <div className="info-band-header">
          <p>por qué somindr</p>
          <h2>Todo lo que necesitas, en un solo lugar</h2>
        </div>
        <div className="info-grid" id="infoGrid">
          {INFO_CARDS.map((card) => (
            <div className="info-card" key={card.title}>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="seccion sobre">
        <div className="sobre-inner">
          
          <div className="sobre-texto">
            <div className="tag">Nuestra Misión</div>
            <h2>
              Sobre
              <br />
              Somindr
            </h2>
            <p>
              Fit Emotional nació de la comprensión de que salud y bienestar van más profundamente
              conectados de lo que muchos creen. Somos una plataforma única que entiende que cada
              persona es diferente.
            </p>
            <p>
              Integramos el bienestar emocional al proceso de transformación física. De esta forma
              nadie queda atrás sin importar su punto de partida.
            </p>
            <p>
              Nuestra misión: llevarte a una vida más plena a través del bienestar físico y
              emocional, con equilibrio, ciencia y dedicación especial por tu salud.
            </p>
            <button
              type="button"
              className="btn-verde"
              onClick={() => onOpenAuth?.('registro')}
            >
              Conoce tu transformación →
            </button>
          </div>
          <div className="sobre-visual">
            <div className="sobre-visual-main"><img src="https://images.pexels.com/photos/33632576/pexels-photo-33632576.jpeg" alt="Imagen sobre Somindr" className="img-sobre"/>
            </div>
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
        <p>
          Comienza hoy y descubre el potencial que tienes. Únete a miles de personas transformando
          su vida con Fit Emotional.
        </p>
        <div className="cta-btns">
          <button
            type="button"
            className="btn-blanco"
            onClick={() => onOpenAuth?.('registro')}
          >
            Comenzar Gratis →
          </button>
          <button
            type="button"
            className="btn-outline-blanco"
            onClick={() => onOpenAuth?.('login')}
          >
            Iniciar sesión
          </button>
        </div>
      </section>

      <footer>
        <div>
          <div className="footer-logo">
            SOMINDR <span></span>
          </div>
          <p>© 2025 Fit Emotional. Todos los derechos reservados.</p>
        </div>
        <div className="footer-links">
          <a href="/">Inicio</a>
          <a href="#modulos">Psico-Emocional</a>
          <a href="#modulos">Nutrición</a>
          <a href="#modulos">Fitness</a>
          <a href="/perfil">Perfil</a>
        </div>
      </footer>
    </>
  )
}