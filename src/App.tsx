import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import WordsPullUp from './components/WordsPullUp'
import WordsPullUpMultiStyle from './components/WordsPullUpMultiStyle'
import AnimatedLetter from './components/AnimatedLetter'

// ─── HERO ───────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative h-screen p-4 md:p-6">
      <div className="relative h-full overflow-hidden rounded-2xl md:rounded-[2rem]">

        {/* Background video */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        {/* Noise overlay */}
        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.7] mix-blend-overlay" />
        {/* Gradient overlay */}
        <div className="bg-gradient-to-b absolute inset-0 from-black/30 via-transparent to-black/60" />

        {/* Navbar pill */}
        <nav className="bg-black absolute left-1/2 -translate-x-1/2 top-0 rounded-b-2xl md:rounded-b-3xl px-4 py-2 md:px-8 z-20">
          <div className="flex items-center gap-3 sm:gap-6 md:gap-12 lg:gap-14">
            {['carta', 'experiencia', 'nosotros', 'contacto', 'reservar'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-[10px] sm:text-xs md:text-sm transition-colors"
                style={{ color: 'rgba(225, 224, 204, 0.8)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#E1E0CC')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(225, 224, 204, 0.8)')}
              >
                {item}
              </a>
            ))}
          </div>
        </nav>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="grid grid-cols-12 gap-4 items-end">
            <div className="col-span-8">
              <h1
                className="text-[26vw] sm:text-[24vw] md:text-[22vw] lg:text-[20vw] xl:text-[19vw] 2xl:text-[18vw] font-medium leading-[0.85] tracking-[-0.07em] relative"
                style={{ color: '#E1E0CC' }}
              >
                <WordsPullUp text="lumière" className="inline-block" />
              </h1>
            </div>
            <div className="col-span-4 flex flex-col items-end gap-4">
              <p className="text-primary/70 text-xs sm:text-sm md:text-base leading-tight max-w-[220px] text-right">
                restoranamingunar a la excelencia · madrid
              </p>
              <motion.a
                href="#"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="group flex items-center gap-2 bg-primary rounded-full px-5 py-2.5 text-black font-medium text-sm sm:text-base"
              >
                reservar
                <span className="bg-black rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ArrowRight className="w-4 h-4 text-primary" />
                </span>
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── ABOUT / PHILOSOPHY ─────────────────────────────────────────────────────
function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const bodyText = 'Over the last seven years, we have crafted experiences that honor tradition while embracing innovation. Each dish tells a story, each evening becomes a memory.'
  const chars = bodyText.split('')

  return (
    <section className="bg-black px-4 py-16 md:py-24">
      <div className="max-w-6xl mx-auto bg-[#101010] rounded-3xl p-8 md:p-16 text-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="text-primary text-[10px] sm:text-xs tracking-widest uppercase mb-8 block"
        >
          filosofía
        </motion.span>

        <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl max-w-3xl mx-auto leading-[0.95] sm:leading-[0.9] mb-12">
          <WordsPullUpMultiStyle
            segments={[
              { text: 'sabor', className: '' },
              { text: 'que', className: '' },
              { text: 'seduce,', className: '' },
            ]}
          />
        </div>

        <div className="text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto" style={{ color: '#DEDBC8' }}>
          {chars.map((char, i) => (
            <AnimatedLetter key={i} char={char} index={i} totalChars={chars.length} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── REVIEWS ───────────────────────────────────────────────────────────────
function Reviews() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const reviews = [
    { quote: 'una experiencia que recordaré toda la vida. cada plato, una obra de arte.', author: 'laura m.', rating: 5 },
    { quote: 'servicio impecable y sabores que sorprenden. volveremos sin duda.', author: 'carlos r.', rating: 5 },
    { quote: 'el mejor restaurante en el que he estado. atención al detalle absoluta.', author: 'marta g.', rating: 5 },
  ]

  return (
    <section className="bg-black px-4 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          className="text-primary text-[10px] sm:text-xs tracking-widest uppercase mb-12 block text-center"
        >
          testimonios
        </motion.span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {reviews.map((r, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="bg-[#101010] rounded-2xl p-6 md:p-8 text-center"
            >
              <div className="text-primary text-sm tracking-[0.3em] mb-6">{'★'.repeat(r.rating)}</div>
              <blockquote className="text-base md:text-lg leading-relaxed mb-6" style={{ color: '#E1E0CC' }}>
                «{r.quote}»
              </blockquote>
              <figcaption className="text-gray-500 text-xs">— {r.author}</figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── GALLERY / DISHES ───────────────────────────────────────────────────────
function Gallery() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const dishes = [
    { src: '/images/dishes/Atun.png', label: 'tartar de atún rojo', name: 'atún' },
    { src: '/images/dishes/Carne.png', label: 'solomillo a la brasa', name: 'carne' },
    { src: '/images/dishes/Coulan.png', label: 'coulant de chocolate', name: 'coulant' },
  ]

  return (
    <section className="bg-black px-4 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          className="text-primary text-[10px] sm:text-xs tracking-widest uppercase mb-12 block text-center"
        >
          propuestas
        </motion.span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {dishes.map((dish, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#101010]"
            >
              <img
                src={dish.src}
                alt={dish.label}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-contain p-6"
                onError={(e) => {
                  const t = e.target as HTMLImageElement
                  t.style.display = 'none'
                  t.parentElement!.style.background = '#101010'
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-primary text-xs sm:text-sm tracking-wider">{dish.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── MENU ──────────────────────────────────────────────────────────────────
function Menu() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const sections = [
    {
      title: 'primeros',
      items: [
        { name: 'ensalada de bogavante y cítricos', price: '24 €' },
        { name: 'crema de calabaza trufada', price: '16 €' },
        { name: 'carpaccio de vieiras', price: '22 €' },
      ],
    },
    {
      title: 'segundos',
      items: [
        { name: 'solomillo de ternera, jugo de vino tinto', price: '32 €' },
        { name: 'lubina salvaje a la brasa', price: '29 €' },
        { name: 'risotto de setas y parmesano', price: '21 €' },
      ],
    },
    {
      title: 'postres',
      items: [
        { name: 'coulant de chocolate 70%', price: '12 €' },
        { name: 'tarta fina de manzana', price: '11 €' },
        { name: 'sorbete de mango y maracuyá', price: '9 €' },
      ],
    },
  ]

  return (
    <section className="bg-black px-4 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          className="text-primary text-[10px] sm:text-xs tracking-widest uppercase mb-12 block text-center"
        >
          carta
        </motion.span>

        <div className="bg-[#101010] rounded-3xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {sections.map((section, si) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: si * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3 className="text-primary text-sm sm:text-base tracking-widest uppercase mb-6 pb-2 border-b border-primary/20">
                  {section.title}
                </h3>
                <ul className="space-y-4">
                  {section.items.map((item) => (
                    <li key={item.name} className="flex justify-between items-start gap-4">
                      <span className="text-gray-400 text-xs sm:text-sm leading-tight">{item.name}</span>
                      <span className="text-primary font-medium text-xs sm:text-sm whitespace-nowrap">{item.price}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-10 text-center"
        >
          <a
            href="#"
            className="group inline-flex items-center gap-3 bg-primary rounded-full px-8 py-4 text-black font-medium"
          >
            reservar mesa
            <span className="bg-black rounded-full w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ArrowRight className="w-4 h-4 text-primary" />
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}

// ─── CONTACT ────────────────────────────────────────────────────────────────
function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const info = {
    tel: '+34 600 123 456',
    email: 'reservas@lumiere.com',
    address: 'calle del gourmet 12, madrid',
    hours: 'martes a domingo · 13:00 – 23:30',
  }

  return (
    <section className="bg-black px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto text-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          className="text-primary text-[10px] sm:text-xs tracking-widest uppercase mb-12 block"
        >
          contacto
        </motion.span>

        <div className="bg-[#101010] rounded-3xl p-8 md:p-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
            {[
              { label: 'teléfono', value: info.tel },
              { label: 'email', value: info.email },
              { label: 'dirección', value: info.address },
              { label: 'horario', value: info.hours },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-gray-500 text-[10px] sm:text-xs tracking-widest uppercase mb-2">{item.label}</p>
                <p className="text-primary text-sm sm:text-base">{item.value}</p>
              </motion.div>
            ))}
          </div>

          <a
            href="#"
            className="group inline-flex items-center gap-3 bg-primary rounded-full px-8 py-4 text-black font-medium"
          >
            hacer reserva
            <span className="bg-black rounded-full w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ArrowRight className="w-4 h-4 text-primary" />
            </span>
          </a>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-8 text-gray-500 text-xs"
        >
          lumière · calle del gourmet 12, madrid
        </motion.p>
      </div>
    </section>
  )
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <main>
      <Hero />
      <About />
      <Reviews />
      <Gallery />
      <Menu />
      <Contact />
    </main>
  )
}