import { useState } from 'react'
import { ShoppingCart, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

export default function ProductCard({ name, price, subcategory, image, index = 0 }) {
  const [added, setAdded] = useState(false)

  function handleAddToCart(e) {
    e.stopPropagation()
    if (added) return
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: '-40px' }}
      className="group cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-cream-subtle mb-3">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
          width={500}
          height={500}
        />

        {/* Cart button */}
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
      </div>

      {/* Info */}
      <div className="space-y-0.5">
        <p className="text-[10px] tracking-[0.14em] text-warm-gray-light uppercase font-medium">
          {subcategory}
        </p>
        <h3 className="text-sm font-medium text-charcoal leading-snug">{name}</h3>
        <p className="text-sm font-semibold text-charcoal">${price.toFixed(2)}</p>
      </div>
    </motion.div>
  )
}
