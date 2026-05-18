const LINKS = ['carta', 'experiencia', 'nosotros', 'contacto']

export default function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-3 px-4 pt-8 md:gap-10 md:px-16 md:pt-12">
      {/* Left pill: logo + marca con gradiente */}
      <a
        href="#"
        className="flex items-center gap-2.5 rounded-full px-5 py-3 backdrop-blur-md hover-lift border-gradient"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current text-gradient">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <span className="text-sm font-medium tracking-tight text-white hero-subtitle">
          lumière
        </span>
      </a>

      {/* Center pill: links con hover dramático (oculto en móvil) */}
      <div className="hidden items-center gap-1 rounded-full bg-black/80 px-4 py-2.5 backdrop-blur-md md:flex border border-white/10">
        {LINKS.map((label, index) => (
          <a
            key={label}
            href="#"
            className="rounded-full px-5 py-2 text-sm text-white/60 font-light transition-all duration-300 hover:text-white hover:bg-white/10 hover:scale-105"
            style={{ 
              transitionDelay: `${index * 50}ms`,
              fontFamily: 'var(--font-sans)'
            }}
          >
            {label}
          </a>
        ))}
      </div>

      {/* Right CTA con gradiente dramático */}
      <a
        href="#"
        className="group relative rounded-full px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:scale-105 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #ff6b35 0%, #ffd166 100%)',
          fontFamily: 'var(--font-sans)'
        }}
      >
        <span className="relative z-10">reservar</span>
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
      </a>
    </nav>
  )
}
