import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Menu, X, ShoppingBag } from 'lucide-react'
import { useCart } from '../../context/CartContext'

const NAV_LINKS = [
  { label: 'HOMBRE',     to: '/hombre' },
  { label: 'MUJER',      to: '/mujer' },
  { label: 'ACCESORIOS', to: '/accesorios' },
  { label: 'ZAPATOS',    to: '/zapatos' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { count: cartCount } = useCart()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-[72px] grid grid-cols-3 items-center">

        {/* Brand — izquierda */}
        <Link
          to="/"
          className="font-serif text-[1.65rem] tracking-[0.22em] text-charcoal font-medium select-none"
        >
          LINARA
        </Link>

        {/* Nav — centro */}
        <nav className="hidden md:flex items-center justify-center gap-10" aria-label="Navegación principal">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) => [
                'text-xs tracking-[0.18em] font-medium cursor-pointer relative group transition-colors duration-200',
                isActive ? 'text-charcoal' : 'text-warm-gray hover:text-charcoal',
              ].join(' ')}
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  <span
                    className={[
                      'absolute -bottom-0.5 left-0 h-px bg-charcoal transition-all duration-300',
                      isActive ? 'w-full' : 'w-0 group-hover:w-full',
                    ].join(' ')}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Derecha — carrito + toggle móvil */}
        <div className="flex items-center justify-end gap-4">
          <button
            className="relative p-1.5 text-charcoal hover:text-accent transition-colors duration-200 cursor-pointer"
            aria-label="Carrito de compras"
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-charcoal text-surface text-[9px] rounded-full flex items-center justify-center font-medium">
                {cartCount}
              </span>
            )}
          </button>

          <button
            className="md:hidden p-1.5 text-charcoal cursor-pointer"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
          >
            {open
              ? <X size={20} strokeWidth={1.5} />
              : <Menu size={20} strokeWidth={1.5} />
            }
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.nav
            key="mobile-menu"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="md:hidden bg-cream border-t border-border px-6 pb-6 pt-4 flex flex-col gap-5"
          >
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `text-xs tracking-[0.18em] font-medium transition-colors duration-200 cursor-pointer ${
                    isActive ? 'text-charcoal' : 'text-warm-gray hover:text-charcoal'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
