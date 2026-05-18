const LINKS = ['carta', 'experiencia', 'nosotros', 'contacto']

export default function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-3 px-4 pt-8 md:gap-10 md:px-16 md:pt-12">
      {/* Left pill: logo + marca */}
      <a
        href="#"
        className="flex items-center gap-2.5 rounded-full bg-neutral-900/90 px-5 py-3 backdrop-blur-md"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <span className="text-sm font-normal tracking-tight text-white">
          lumière
        </span>
      </a>

      {/* Center pill: links (oculto en móvil) */}
      <div className="hidden items-center gap-1 rounded-full bg-neutral-900/90 px-4 py-2.5 backdrop-blur-md md:flex">
        {LINKS.map((label) => (
          <a
            key={label}
            href="#"
            className="rounded-full px-5 py-2 text-sm text-neutral-300 transition-colors hover:text-white"
          >
            {label}
          </a>
        ))}
      </div>

      {/* Right CTA */}
      <a
        href="#"
        className="rounded-full bg-white px-6 py-3 text-sm font-normal text-black transition-colors hover:bg-neutral-200"
      >
        reservar
      </a>
    </nav>
  )
}
