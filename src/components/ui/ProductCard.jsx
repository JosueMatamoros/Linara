import { useState } from 'react'
import { ShoppingCart, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useCart } from '../../context/CartContext'

export default function ProductCard({ id, price, subcategory, sizes = [], image, in_stock = true, index = 0 }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  function handleAddToCart(e) {
    e.stopPropagation()
    if (added || !in_stock) return
    addItem({ id, price, subcategory, sizes, image })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: '-40px' }}
      className={`group ${in_stock ? 'cursor-pointer' : 'cursor-default'}`}
    >
      {/* Image */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-cream-subtle mb-3">
        <img
          src={image}
          alt={subcategory}
          className={`w-full h-full object-cover scale-105 transition-transform duration-500 ease-out ${
            in_stock ? 'group-hover:scale-110' : 'opacity-60'
          }`}
          loading="lazy"
          width={500}
          height={500}
        />

        {/* Agotado badge — reemplaza el botón del carrito */}
        {!in_stock ? (
          <span className="absolute top-3 right-3 bg-charcoal/80 text-surface text-[9px] tracking-[0.15em] uppercase font-medium px-2.5 py-1.5 rounded-full backdrop-blur-sm">
            Agotado
          </span>
        ) : (
          <button
            onClick={handleAddToCart}
            className="absolute top-3 right-3 w-8 h-8 bg-surface rounded-full flex items-center justify-center shadow-sm cursor-pointer transition-transform duration-150 hover:scale-110 focus-visible:outline-2 focus-visible:outline-accent"
            aria-label="Agregar al carrito"
          >
            <AnimatePresence mode="wait" initial={false}>
              {added ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Check size={13} strokeWidth={2.2} className="text-accent" />
                </motion.span>
              ) : (
                <motion.span
                  key="cart"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <ShoppingCart size={13} strokeWidth={1.8} className="text-charcoal" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        )}
      </div>

      {/* Info */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <p className="text-[10px] tracking-[0.14em] text-warm-gray uppercase font-medium">
            {subcategory}
          </p>
          <p className={`text-sm font-semibold ${in_stock ? 'text-charcoal' : 'text-warm-gray-light'}`}>
            ₡{Math.round(price).toLocaleString('es-CR')}
          </p>
        </div>

        {/* Tallas */}
        {sizes.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {sizes.map((size) => (
              <span
                key={size}
                className={`text-[9px] border px-1.5 py-0.5 rounded leading-none ${
                  in_stock
                    ? 'text-warm-gray border-border'
                    : 'text-warm-gray-light border-border/50 line-through'
                }`}
              >
                {size}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
