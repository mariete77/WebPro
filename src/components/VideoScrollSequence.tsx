import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Secuencia de frames generada con ffmpeg desde el vídeo openart-enhanced.
// 147 imágenes webp servidas desde public/images/ → /images/frame_001.webp …
const FRAME_COUNT = 147
const framePath = (i: number) =>
  `/images/frame_${String(i + 1).padStart(3, '0')}.webp`

// Beats narrativos: cada texto aparece centrado en `at` (progreso 0..1)
// y se desvanece al alejarse. Ajusta libremente textos y posiciones.
type Beat = {
  at: number
  eyebrow?: string
  title: string
  subtitle?: string
}

const BEATS: Beat[] = [
  {
    at: 0.07,
    eyebrow: 'Lumière',
    title: 'Donde cada plato\nse convierte en deseo',
    subtitle: 'Desliza para descubrir la experiencia',
  },
  {
    at: 0.3,
    eyebrow: 'Producto',
    title: 'Ingredientes que\nhablan por sí solos',
    subtitle: 'Seleccionados cada mañana, tratados con respeto',
  },
  {
    at: 0.52,
    eyebrow: 'Cocina',
    title: 'El fuego como\nlenguaje',
    subtitle: 'Técnica precisa al servicio del sabor',
  },
  {
    at: 0.74,
    eyebrow: 'Mesa',
    title: 'Una experiencia\nque se recuerda',
    subtitle: 'Cada detalle pensado para ti',
  },
  {
    at: 0.93,
    eyebrow: 'Reserva',
    title: 'Tu mesa te\nestá esperando',
    subtitle: 'Vive Lumière esta misma semana',
  },
]

// Ventana de visibilidad de cada beat (mitad del ancho en unidades de progreso).
const BEAT_RANGE = 0.12

function beatStyle(progress: number, at: number) {
  const d = (progress - at) / BEAT_RANGE // -1 .. 1 dentro de la ventana
  const ad = Math.abs(d)
  if (ad >= 1) return { opacity: 0, y: d < 0 ? 48 : -48 }
  const eased = 1 - ad * ad // curva suave (entra y sale)
  return { opacity: eased, y: d * 44 }
}

/**
 * Título de una sola línea horizontal que se reescala para caber siempre
 * en el ancho disponible, sin desbordar ni partirse en vertical.
 */
function FitTitle({ text }: { text: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLSpanElement>(null)
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    const fit = () => {
      const wrap = wrapRef.current
      const inner = innerRef.current
      if (!wrap || !inner) return
      const avail = wrap.clientWidth
      const natural = inner.scrollWidth
      if (natural > 0) setScale(Math.min(1, avail / natural))
    }
    fit()
    const ro = new ResizeObserver(fit)
    if (wrapRef.current) ro.observe(wrapRef.current)
    window.addEventListener('resize', fit)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', fit)
    }
  }, [text])

  return (
    <div ref={wrapRef} className="w-full">
      <span
        ref={innerRef}
        className="inline-block whitespace-nowrap font-medium leading-[1.05] tracking-[-0.5px] md:tracking-[-1px]"
        style={{
          fontSize: 'clamp(1.5rem, 6vw, 4.5rem)',
          transform: `scale(${scale})`,
          transformOrigin: 'center',
        }}
      >
        {text}
      </span>
    </div>
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

  // Precarga de todos los frames
  useEffect(() => {
    let cancelled = false
    let count = 0
    const imgs: HTMLImageElement[] = new Array(FRAME_COUNT)

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image()
      img.decoding = 'async'
      img.src = framePath(i)
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
  }, [])

  // Dibujo "contain" con soporte retina: el frame se ve completo,
  // sin recortes ni zoom; el fondo negro rellena el resto.
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

    // "contain": escala para que el frame entero quepa en el canvas
    const scale = Math.min(cw / img.naturalWidth, ch / img.naturalHeight)
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

        {/* Beats narrativos: aparecen y desaparecen con el scroll */}
        <div className="absolute inset-0 flex items-center justify-center px-6">
          {BEATS.map((beat, idx) => {
            const s = beatStyle(progress, beat.at)
            return (
              <div
                key={idx}
                className="absolute w-[90vw] max-w-3xl text-center text-white will-change-transform"
                style={{
                  opacity: s.opacity,
                  transform: `translateY(${s.y}px)`,
                  pointerEvents: s.opacity > 0.5 ? 'auto' : 'none',
                  textShadow: '0 2px 12px rgba(0,0,0,0.85)',
                }}
              >
                {beat.eyebrow && (
                  <span className="mb-4 inline-block text-[11px] font-medium uppercase tracking-[0.32em] text-white/60">
                    {beat.eyebrow}
                  </span>
                )}
                {/* Display: una sola línea horizontal, reescalada para
                   caber siempre en el ancho disponible (design.md §3). */}
                <FitTitle text={beat.title.replace(/\n/g, ' ')} />
                {beat.subtitle && (
                  <p className="mx-auto mt-4 max-w-xl text-sm font-normal text-white/70 md:mt-6 md:text-base">
                    {beat.subtitle}
                  </p>
                )}
                {/* Separador monocromo */}
                <span className="mx-auto mt-8 block h-px w-16 bg-white/40" />
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
