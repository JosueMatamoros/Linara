import { Link } from 'react-router-dom'

const FOOTER_LINKS = [
  { label: 'Hombre',     to: '/hombre' },
  { label: 'Mujer',      to: '/mujer' },
  { label: 'Accesorios', to: '/accesorios' },
  { label: 'Zapatos',    to: '/zapatos' },
]

function IconInstagram() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconFacebook() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

const SOCIAL = [
  { icon: IconInstagram, label: 'Instagram', href: '#' },
  { icon: IconFacebook,  label: 'Facebook',  href: '#' },
]

export default function Footer() {
  return (
    <footer className="bg-charcoal">
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between gap-6">

        {/* Brand */}
        <Link to="/" className="select-none shrink-0">
          <img src="/logo.webp" alt="Linara" width={280} height={177} className="h-8 w-auto object-contain brightness-0 invert opacity-90" />
        </Link>

        {/* Nav — centro */}
        <nav className="hidden md:flex items-center gap-8">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-xs tracking-[0.08em] text-surface/45 hover:text-surface/80 transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Social */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {SOCIAL.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="w-9 h-9 bg-charcoal-soft rounded-full flex items-center justify-center text-surface/55 hover:text-surface/90 transition-colors duration-200 cursor-pointer"
            >
              <Icon />
            </a>
          ))}
        </div>

      </div>
    </footer>
  )
}
