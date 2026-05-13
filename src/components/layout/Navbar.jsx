import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Menu, X, ShoppingBag } from 'lucide-react'
import { useCart } from '../../context/CartContext'

const NAV_LINKS = [
  { label: 'INICIO',     to: '/' },
  { label: 'HOMBRE',     to: '/hombre' },
  { label: 'MUJER',      to: '/mujer' },
  { label: 'ACCESORIOS', to: '/accesorios' },
  { label: 'ZAPATOS',    to: '/zapatos' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { count: cartCount } = useCart()

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-5 h-[54px] md:h-[72px] flex items-center justify-between md:grid md:grid-cols-3">

          {/* Brand */}
          <Link to="/" className="select-none" onClick={() => setOpen(false)}>
            <img src="/logo.webp" alt="Linara" width={280} height={177} className="h-7 md:h-9 w-auto object-contain" />
          </Link>

          {/* Nav desktop — centro */}
          <nav className="hidden md:flex items-center justify-center gap-10" aria-label="Navegación principal">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => [
                  'text-xs tracking-[0.18em] font-medium cursor-pointer relative group transition-colors duration-200',
                  isActive ? 'text-charcoal' : 'text-warm-gray hover:text-charcoal',
                ].join(' ')}
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    <span className={[
                      'absolute -bottom-0.5 left-0 h-px bg-charcoal transition-all duration-300',
                      isActive ? 'w-full' : 'w-0 group-hover:w-full',
                    ].join(' ')} />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Derecha — carrito + toggle móvil */}
          <div className="flex items-center justify-end gap-3">
            <button
              className="relative p-1.5 text-charcoal hover:text-accent transition-colors duration-200 cursor-pointer"
              aria-label="Carrito de compras"
            >
              <ShoppingBag size={19} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-charcoal text-surface text-[9px] rounded-full flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              className="md:hidden p-1.5 text-charcoal cursor-pointer"
              onClick={() => setOpen(v => !v)}
              aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            >
              <AnimatePresence mode="wait" initial={false}>
                {open
                  ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
                      <X size={20} strokeWidth={1.5} />
                    </motion.span>
                  : <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
                      <Menu size={20} strokeWidth={1.5} />
                    </motion.span>
                }
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav overlay */}
      <AnimatePresence>
        {open && (
          <>
            {/* Blurred page backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden fixed inset-0 z-40 bg-cream/60 backdrop-blur-lg"
              style={{ top: '54px' }}
              onClick={() => setOpen(false)}
            />

            {/* Nav panel — drops from below header */}
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden fixed left-0 right-0 z-50 bg-cream border-b border-border shadow-lg"
              style={{ top: '54px' }}
            >
              <nav className="flex flex-col px-5 py-3">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <NavLink
                      to={link.to}
                      end={link.to === '/'}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between py-3.5 text-[11px] tracking-[0.22em] font-medium border-b border-border/40 last:border-0 transition-colors duration-200 cursor-pointer ${
                          isActive ? 'text-charcoal' : 'text-warm-gray hover:text-charcoal'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {link.label}
                          {isActive && (
                            <span className="w-1 h-1 rounded-full bg-charcoal" />
                          )}
                        </>
                      )}
                    </NavLink>
                  </motion.div>
                ))}
              </nav>

              <div className="px-5 pb-4 pt-1">
                <p className="text-[8px] tracking-[0.28em] text-warm-gray/40 uppercase">
                  Moda · Estilo · Calidad
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
