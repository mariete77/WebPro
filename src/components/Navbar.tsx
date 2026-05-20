import { useEffect, useState } from 'react'

const LINKS = ['carta', 'experiencia', 'nosotros', 'contacto']

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? 'border-b border-white/10 bg-black/90 backdrop-blur'
          : 'border-b border-transparent bg-transparent'
      }`}
      style={{
        textShadow: scrolled ? 'none' : '0 2px 10px rgba(0,0,0,0.6)',
      }}
    >
      <div className="flex items-center justify-between px-6 py-4 md:px-10 md:py-5">
        {/* Brand */}
        <a
          href="#"
          className="flex items-center gap-2 text-white transition-opacity hover:opacity-70"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className="text-base font-medium lowercase tracking-tight">
            lumière
          </span>
        </a>

        {/* Desktop links */}
        <nav className="hidden items-center gap-10 md:flex">
          {LINKS.map((label) => (
            <a
              key={label}
              href="#"
              className="text-sm font-medium lowercase text-white transition-opacity hover:opacity-70"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Right cluster: CTA + hamburger */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="hidden bg-white px-5 py-2.5 text-sm font-medium lowercase text-black transition-opacity hover:opacity-80 sm:inline-block"
          >
            reservar
          </a>
          <button
            type="button"
            aria-label={open ? 'cerrar menú' : 'abrir menú'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center text-white transition-opacity hover:opacity-70 md:hidden"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="square"
            >
              {open ? (
                <>
                  <path d="M6 6l12 12" />
                  <path d="M18 6L6 18" />
                </>
              ) : (
                <>
                  <path d="M4 8h16" />
                  <path d="M4 16h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`overflow-hidden border-t border-white/10 bg-black/95 backdrop-blur transition-[max-height,opacity] duration-300 md:hidden ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{ textShadow: 'none' }}
      >
        <ul className="flex flex-col">
          {LINKS.map((label) => (
            <li key={label} className="border-b border-white/5">
              <a
                href="#"
                onClick={() => setOpen(false)}
                className="block px-6 py-4 text-base font-medium lowercase text-white transition-opacity hover:opacity-70"
              >
                {label}
              </a>
            </li>
          ))}
          <li className="px-6 py-5 sm:hidden">
            <a
              href="#"
              onClick={() => setOpen(false)}
              className="block bg-white px-5 py-3 text-center text-sm font-medium lowercase text-black transition-opacity hover:opacity-80"
            >
              reservar
            </a>
          </li>
        </ul>
      </div>
    </header>
  )
}
