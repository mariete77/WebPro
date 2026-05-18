import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Secuencia de frames generada con ffmpeg desde el vídeo openart-enhanced.
// Dos juegos compuestos para cada formato:
//   · Escritorio (apaisado): public/images/frame_001.webp …
//   · Móvil    (vertical)  : public/images/mobile/frame_001.webp …
const FRAME_COUNT = 147

// true cuando el viewport es de móvil (se fija al montar; cambiar de tamaño
// no recarga los 147 frames a mitad de sesión).
const isMobileViewport = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(max-width: 767px)').matches

const framePath = (i: number, mobile: boolean) =>
  `/images/${mobile ? 'mobile/' : ''}frame_${String(i + 1).padStart(3, '0')}.webp`

// Beats narrativos estilo hero: palabras gigantes escalonadas que aparecen
// en `at` (progreso 0..1) y se desvanecen al alejarse.
// Dirección desde la que entra el beat (y hacia la opuesta sale).
type Dir = 'bottom' | 'top' | 'left' | 'right'

type Contact = {
  tel: string
  email: string
  address: string
  hours: string
}

type MenuItem = { name: string; price: string }
// Cada sección de la carta entra/sale de forma independiente: `from` define
// la dirección y `atOffset` desfasa su aparición respecto al beat.
type MenuSection = {
  title: string
  from: Dir
  atOffset: number
  items: MenuItem[]
}

// Cada plato de la galería entra/sale solo: `from` dirección, `atOffset` desfase.
type GalleryItem = {
  src: string
  label: string
  from: Dir
  atOffset: number
}

// Cada reseña entra/sale sola: `from` dirección, `atOffset` desfase.
type Review = {
  quote: string
  author: string
  rating: number
  from: Dir
  atOffset: number
}

type Beat = {
  at: number
  from: Dir
  words?: string[] // 2–4 palabras gigantes escalonadas
  subtitle?: string
  // Si está presente, el beat son reseñas de clientes escalonadas.
  reviews?: Review[]
  // Si está presente, el beat es una galería visual de platos.
  gallery?: GalleryItem[]
  // Si está presente, el beat se renderiza como bloque de contacto/reserva
  // (tipografía intermedia) en vez de palabras gigantes.
  contact?: Contact
  // Si está presente, el beat es una carta con secciones escalonadas.
  menu?: MenuSection[]
}

const BEATS: Beat[] = [
  {
    at: 0.07,
    words: ['sabor', 'que', 'seduce'],
    subtitle: 'desliza para descubrir la experiencia',
    from: 'bottom',
  },
  {
    at: 0.3,
    from: 'right',
    reviews: [
      {
        quote:
          'una experiencia que recordaré toda la vida. cada plato, una obra de arte.',
        author: 'laura m.',
        rating: 5,
        from: 'left',
        atOffset: -0.045,
      },
      {
        quote:
          'servicio impecable y sabores que sorprenden. volveremos sin duda.',
        author: 'carlos r.',
        rating: 5,
        from: 'bottom',
        atOffset: 0,
      },
      {
        quote:
          'el mejor restaurante en el que he estado. atención al detalle absoluta.',
        author: 'marta g.',
        rating: 5,
        from: 'right',
        atOffset: 0.045,
      },
    ],
  },
  {
    at: 0.52,
    from: 'top',
    gallery: [
      {
        src: '/images/dishes/Atun.png',
        label: 'tartar de atún rojo',
        from: 'left',
        atOffset: -0.045,
      },
      {
        src: '/images/dishes/Carne.png',
        label: 'solomillo a la brasa',
        from: 'bottom',
        atOffset: 0,
      },
      {
        src: '/images/dishes/Coulan.png',
        label: 'coulant de chocolate',
        from: 'right',
        atOffset: 0.045,
      },
    ],
  },
  {
    at: 0.74,
    from: 'bottom',
    menu: [
      {
        title: 'primeros',
        from: 'left',
        atOffset: -0.045,
        items: [
          { name: 'ensalada de bogavante y cítricos', price: '24 €' },
          { name: 'crema de calabaza trufada', price: '16 €' },
          { name: 'carpaccio de vieiras', price: '22 €' },
        ],
      },
      {
        title: 'segundos',
        from: 'bottom',
        atOffset: 0,
        items: [
          { name: 'solomillo de ternera, jugo de vino tinto', price: '32 €' },
          { name: 'lubina salvaje a la brasa', price: '29 €' },
          { name: 'risotto de setas y parmesano', price: '21 €' },
        ],
      },
      {
        title: 'postres',
        from: 'right',
        atOffset: 0.045,
        items: [
          { name: 'coulant de chocolate 70%', price: '12 €' },
          { name: 'tarta fina de manzana', price: '11 €' },
          { name: 'sorbete de mango y maracuyá', price: '9 €' },
        ],
      },
    ],
  },
  {
    at: 0.93,
    from: 'bottom',
    contact: {
      tel: '+34 600 123 456',
      email: 'reservas@lumiere.com',
      address: 'calle del gourmet 12, madrid',
      hours: 'martes a domingo · 13:00 – 23:30',
    },
  },
]

// Posiciones escalonadas (estilo hero): se recorren por índice de palabra.
const SLOTS = [
  'left-4 top-[15%] md:left-10',
  'right-4 top-[34%] md:right-10',
  'left-[16%] top-[55%] md:left-[26%]',
  'right-6 top-[70%] md:right-24',
  'left-8 top-[80%] md:left-20',
]

// Ventana de visibilidad de cada beat (mitad del ancho en unidades de progreso).
const BEAT_RANGE = 0.12

// Fracción de la ventana (|d| <= HOLD) en la que el beat se ve nítido y
// quieto: zona de lectura. Fuera de ella anima entrada/salida.
const HOLD = 0.42

// smootherstep: 6t^5 - 15t^4 + 10t^3 → aceleración/desaceleración suave
const smoother = (t: number) => t * t * t * (t * (t * 6 - 15) + 10)

// Distancia de desplazamiento en entrada/salida (px)
const TRAVEL = 90

function beatStyle(progress: number, at: number, from: Dir) {
  const d = (progress - at) / BEAT_RANGE // -1 .. 1 dentro de la ventana
  const ad = Math.abs(d)

  // Fuera de la ventana: oculto
  if (ad >= 1) return { opacity: 0, x: 0, y: 0, scale: 0.96, blur: 8 }

  // Dentro de la meseta: estado de reposo, totalmente legible
  if (ad <= HOLD) return { opacity: 1, x: 0, y: 0, scale: 1, blur: 0 }

  // Tramos de entrada/salida: progreso 0→1 desde la meseta hasta el borde
  const t = (ad - HOLD) / (1 - HOLD)
  const e = smoother(t)
  const mag = e * TRAVEL
  // d<0 → entra desde `from`; d>0 → sale hacia el lado opuesto
  const sign = d < 0 ? 1 : -1
  let x = 0
  let y = 0
  if (from === 'bottom') y = sign * mag
  else if (from === 'top') y = -sign * mag
  else if (from === 'right') x = sign * mag
  else x = -sign * mag // left
  return { opacity: 1 - e, x, y, scale: 1 - e * 0.04, blur: e * 6 }
}

// Imagen de plato: si el archivo no existe aún, se oculta y queda el
// placeholder elegante (fondo + etiqueta) en vez de un icono roto.
function DishImg({ src, alt }: { src: string; alt: string }) {
  const [ok, setOk] = useState(true)
  if (!ok) return null
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setOk(false)}
      className="absolute inset-0 h-full w-full object-contain drop-shadow-[0_12px_30px_rgba(0,0,0,0.7)]"
    />
  )
}

type Props = {
  /** Duración del scroll en vh. Más alto = animación más lenta y textos más espaciados. */
  scrollHeightVh?: number
}

export default function VideoScrollSequence({
  scrollHeightVh = 760,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const frameRef = useRef({ i: 0 })
  const [loaded, setLoaded] = useState(0)
  const [progress, setProgress] = useState(0)
  // Juego de frames según el dispositivo, fijado al montar.
  const [isMobile] = useState(isMobileViewport)

  // Precarga de todos los frames
  useEffect(() => {
    let cancelled = false
    let count = 0
    const imgs: HTMLImageElement[] = new Array(FRAME_COUNT)

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image()
      img.decoding = 'async'
      img.src = framePath(i, isMobile)
      img.onload = img.onerror = () => {
        if (cancelled) return
        count += 1
        setLoaded(count)
      }
      imgs[i] = img
    }
    imagesRef.current = imgs

    return () => {
      cancelled = true
    }
  }, [isMobile])

  // "cover": cada juego de frames ya está compuesto para su formato
  // (apaisado / vertical), así que llena la pantalla sin recortes raros.
  const draw = (index: number) => {
    const canvas = canvasRef.current
    const img = imagesRef.current[index]
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const cw = canvas.clientWidth
    const ch = canvas.clientHeight

    if (canvas.width !== cw * dpr || canvas.height !== ch * dpr) {
      canvas.width = cw * dpr
      canvas.height = ch * dpr
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
    const dw = img.naturalWidth * scale
    const dh = img.naturalHeight * scale
    const dx = (cw - dw) / 2
    const dy = (ch - dh) / 2

    ctx.clearRect(0, 0, cw, ch)
    ctx.drawImage(img, dx, dy, dw, dh)
  }

  // Scroll → frame + progreso, con GSAP ScrollTrigger (scrub)
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const ctx = gsap.context(() => {
      const state = frameRef.current

      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress
          const i = Math.min(
            FRAME_COUNT - 1,
            Math.round(p * (FRAME_COUNT - 1))
          )
          if (i !== state.i) {
            state.i = i
            draw(i)
          }
          setProgress(Math.round(p * 1000) / 1000)
        },
      })
    }, container)

    const onResize = () => draw(frameRef.current.i)
    window.addEventListener('resize', onResize)

    return () => {
      ctx.revert()
      window.removeEventListener('resize', onResize)
    }
  }, [])

  // Pinta el primer frame en cuanto cargue
  useEffect(() => {
    if (loaded > 0) draw(frameRef.current.i)
  }, [loaded])

  const pct = Math.round((loaded / FRAME_COUNT) * 100)
  const ready = loaded >= FRAME_COUNT

  return (
    <section
      ref={containerRef}
      className="relative bg-black"
      style={{ height: `${scrollHeightVh}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block h-full w-full"
        />

        {/* Sin overlays: los frames se ven a plena luz/color.
           La legibilidad del texto se resuelve con text-shadow. */}

        {/* Beats estilo hero: palabras gigantes escalonadas que aparecen
           y desaparecen con el scroll */}
        <div className="absolute inset-0">
          {BEATS.map((beat, idx) => {
            const s = beatStyle(progress, beat.at, beat.from)
            // Carta y galería animan cada elemento solo → contenedor neutro
            const selfAnimated =
              !!beat.menu || !!beat.gallery || !!beat.reviews
            return (
              <div
                key={idx}
                className="absolute inset-0 text-white will-change-transform"
                style={
                  selfAnimated
                    ? {
                        pointerEvents: 'none',
                        textShadow: '0 2px 12px rgba(0,0,0,0.85)',
                      }
                    : {
                        opacity: s.opacity,
                        transform: `scale(${s.scale})`,
                        filter: s.blur ? `blur(${s.blur}px)` : 'none',
                        pointerEvents: s.opacity > 0.5 ? 'auto' : 'none',
                        textShadow: '0 2px 12px rgba(0,0,0,0.85)',
                      }
                }
              >
                {beat.reviews ? (
                  <div className="absolute inset-0 flex items-center justify-center px-6">
                    <div className="flex flex-col items-stretch gap-8 md:flex-row md:gap-10">
                      {beat.reviews.map((r, ri) => {
                        const rs = beatStyle(
                          progress,
                          beat.at + r.atOffset,
                          r.from
                        )
                        return (
                          <figure
                            key={ri}
                            className="flex w-full max-w-xs flex-col items-center gap-5 text-center lowercase will-change-transform"
                            style={{
                              opacity: rs.opacity,
                              transform: `translate(${rs.x}px, ${rs.y}px) scale(${rs.scale})`,
                              filter: rs.blur ? `blur(${rs.blur}px)` : 'none',
                            }}
                          >
                            <span className="text-sm tracking-[0.3em] text-white">
                              {'★'.repeat(r.rating)}
                            </span>
                            <blockquote className="text-base leading-relaxed text-white/90 md:text-lg">
                              «{r.quote}»
                            </blockquote>
                            <figcaption className="text-xs text-white/55">
                              — {r.author}
                            </figcaption>
                          </figure>
                        )
                      })}
                    </div>
                  </div>
                ) : beat.gallery ? (
                  <div className="absolute inset-0 flex items-center justify-center px-6">
                    <div className="flex flex-col items-center gap-8 md:flex-row md:items-end md:gap-10">
                      {beat.gallery.map((item, gi) => {
                        const gs = beatStyle(
                          progress,
                          beat.at + item.atOffset,
                          item.from
                        )
                        return (
                          <figure
                            key={gi}
                            className="will-change-transform"
                            style={{
                              opacity: gs.opacity,
                              transform: `translate(${gs.x}px, ${gs.y}px) scale(${gs.scale})`,
                              filter: gs.blur ? `blur(${gs.blur}px)` : 'none',
                            }}
                          >
                            {/* PNG sin fondo: el plato flota sobre el frame */}
                            <div className="relative flex h-56 w-48 items-center justify-center md:h-72 md:w-64">
                              <DishImg src={item.src} alt={item.label} />
                            </div>
                            <figcaption className="mt-4 text-center text-sm lowercase text-white/85">
                              {item.label}
                            </figcaption>
                          </figure>
                        )
                      })}
                    </div>
                  </div>
                ) : beat.menu ? (
                  <div className="absolute inset-0 flex items-center justify-center px-6">
                    <div className="flex flex-col gap-10 md:flex-row md:items-start md:gap-16">
                      {beat.menu.map((section, si) => {
                        const ms = beatStyle(
                          progress,
                          beat.at + section.atOffset,
                          section.from
                        )
                        return (
                          <div
                            key={si}
                            className="w-full max-w-xs lowercase will-change-transform"
                            style={{
                              opacity: ms.opacity,
                              transform: `translate(${ms.x}px, ${ms.y}px) scale(${ms.scale})`,
                              filter: ms.blur ? `blur(${ms.blur}px)` : 'none',
                            }}
                          >
                            <h3 className="hero-title text-2xl font-medium md:text-3xl">
                              {section.title}
                            </h3>
                            <span className="mt-3 mb-5 block h-px w-12 bg-white/40" />
                            <ul className="flex flex-col gap-4">
                              {section.items.map((it, ii) => (
                                <li
                                  key={ii}
                                  className="flex items-baseline justify-between gap-5"
                                >
                                  <span className="text-sm leading-snug text-white/85 md:text-base">
                                    {it.name}
                                  </span>
                                  <span className="shrink-0 text-sm font-medium text-white md:text-base">
                                    {it.price}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : beat.contact ? (
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center gap-7 px-6 text-center lowercase"
                    style={{ transform: `translate(${s.x}px, ${s.y}px)` }}
                  >
                    <h2 className="hero-title text-4xl font-medium md:text-6xl">
                      reserva tu mesa
                    </h2>
                    <span className="h-px w-16 bg-white/40" />
                    <div className="flex flex-col gap-2 text-base text-white/85 md:text-lg">
                      <a
                        href={`tel:${beat.contact.tel.replace(/\s/g, '')}`}
                        className="transition-opacity hover:opacity-70"
                      >
                        {beat.contact.tel}
                      </a>
                      <a
                        href={`mailto:${beat.contact.email}`}
                        className="transition-opacity hover:opacity-70"
                      >
                        {beat.contact.email}
                      </a>
                      <span className="text-white/65">
                        {beat.contact.address}
                      </span>
                      <span className="text-white/65">
                        {beat.contact.hours}
                      </span>
                    </div>
                    <a
                      href="#"
                      className="mt-1 rounded-full border border-white/30 px-9 py-4 text-sm font-medium text-white transition-colors hover:border-white hover:bg-white hover:text-black"
                    >
                      reservar ahora
                    </a>
                  </div>
                ) : (
                  <>
                    {beat.words?.map((word, i) => (
                      <h2
                        key={i}
                        className={`hero-title absolute font-medium lowercase text-[14vw] md:text-[13vw] ${
                          SLOTS[i % SLOTS.length]
                        }`}
                        style={{
                          // micro-desfase por palabra: entran/salen escalonadas
                          transform: `translate(${s.x * (1 + i * 0.35)}px, ${
                            s.y * (1 + i * 0.35)
                          }px)`,
                        }}
                      >
                        {word}
                      </h2>
                    ))}
                    {beat.subtitle && (
                      <p
                        className="absolute left-6 top-[46%] max-w-[260px] text-[15px] font-normal lowercase leading-snug text-white/90 md:left-10"
                        style={{ transform: `translate(${s.x}px, ${s.y}px)` }}
                      >
                        {beat.subtitle}
                      </p>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>

        {/* Indicador de scroll (solo al inicio) */}
        <div
          className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-3 text-white/60 transition-opacity duration-500"
          style={{ opacity: progress < 0.04 ? 1 : 0 }}
        >
          <span className="text-[11px] tracking-[0.3em] uppercase">Scroll</span>
          <span className="h-12 w-px animate-pulse bg-gradient-to-b from-white/70 to-transparent" />
        </div>

        {/* Barra de progreso */}
        <div className="absolute bottom-0 left-0 z-20 h-[3px] w-full bg-white/10">
          <div
            className="h-full bg-white transition-[width] duration-150 ease-out"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        {/* Loader */}
        {!ready && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-5 bg-black text-white">
            <span className="text-2xl font-medium tracking-tight">
              Lumière
            </span>
            <div className="h-px w-48 overflow-hidden bg-white/15">
              <div
                className="h-full bg-white transition-[width] duration-200"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs font-normal tracking-[0.25em] text-white/50">
              CARGANDO {pct}%
            </span>
          </div>
        )}
      </div>
    </section>
  )
}
