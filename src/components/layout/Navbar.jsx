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
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between md:grid md:grid-cols-3">

        {/* Brand */}
        <Link to="/" className="select-none">
          <img src="/logo.webp" alt="Linara" width={280} height={177} className="h-9 w-auto object-contain" />
        </Link>

        {/* Nav desktop — centro */}
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
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden fixed inset-0 z-40 bg-charcoal/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="md:hidden fixed top-0 right-0 bottom-0 z-50 w-72 bg-cream flex flex-col shadow-2xl"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-7 h-[72px] border-b border-border">
                <img src="/logo.webp" alt="Linara" width={280} height={177} className="h-8 w-auto object-contain" />
                <button

                  onClick={() => setOpen(false)}
                  className="p-1.5 text-warm-gray hover:text-charcoal transition-colors cursor-pointer"
                  aria-label="Cerrar menú"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              {/* Links */}
              <nav className="flex flex-col px-7 pt-8 gap-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.07, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <NavLink
                      to={link.to}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `block py-3.5 text-sm tracking-[0.2em] font-medium border-b border-border/50 transition-colors duration-200 cursor-pointer ${
                          isActive ? 'text-charcoal' : 'text-warm-gray hover:text-charcoal'
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  </motion.div>
                ))}
              </nav>

              {/* Footer del drawer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.4 }}
                className="mt-auto px-7 pb-10"
              >
                <p className="text-[9px] tracking-[0.25em] text-warm-gray/50 uppercase">
                  Moda · Estilo · Calidad
                </p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
