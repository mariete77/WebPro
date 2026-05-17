import { useEffect, useState } from 'react'

const NAV = [
  { label: 'Carta', href: '#' },
  { label: 'Experiencia', href: '#' },
  { label: 'Contacto', href: '#' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled
          ? 'bg-black border-b border-white/10'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-5">
        <a
          href="#"
          className="text-lg font-medium tracking-tight text-white transition-opacity hover:opacity-70"
        >
          Lumière
        </a>

        <nav className="hidden items-center gap-10 md:flex">
          {NAV.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-white/80 transition-opacity hover:opacity-100"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA: blanco sólido / texto negro — alto contraste, 0px radius */}
        <a
          href="#"
          className="bg-white px-5 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-80"
        >
          Reservar
        </a>
      </div>
    </header>
  )
}
