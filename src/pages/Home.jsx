import { motion } from 'motion/react'
import CategoryCard from '../components/ui/CategoryCard'

const PH = '/images/placeholder.jpg'

const MAIN_CATEGORIES = [
  {
    id: 'hombre',
    title: 'Ropa Hombre',
    description: 'Camisas, pantalones, abrigos y más',
    image: PH,
    to: '/hombre',
  },
  {
    id: 'mujer',
    title: 'Ropa Mujer',
    description: 'Vestidos, blusas, pantalones y más',
    image: PH,
    to: '/mujer',
  },
  {
    id: 'zapatos',
    title: 'Zapatos',
    description: 'Sandalias, botines y calzado casual',
    image: PH,
    to: '/zapatos',
  },
]

const ACCESSORIES = [
  {
    id: 'gorras',
    title: 'Gorras',
    description: 'Estilos para cada temporada',
    image: PH,
    to: '/accesorios',
  },
  {
    id: 'billeteras',
    title: 'Billeteras',
    description: 'Cuero genuino y artesanal',
    image: PH,
    to: '/accesorios',
  },
  {
    id: 'bolsos',
    title: 'Bolsos',
    description: 'Diseño y funcionalidad',
    image: PH,
    to: '/accesorios',
  },
]

function SectionHeader({ eyebrow, title, delay = 0 }) {
  return (
    <div className="text-center mb-6">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, delay }}
        className="text-[9px] tracking-[0.35em] text-warm-gray uppercase mb-1.5 font-medium"
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: delay + 0.07 }}
        className="font-serif text-4xl md:text-5xl text-charcoal font-light"
      >
        {title}
      </motion.h2>
    </div>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen bg-cream" style={{ paddingTop: '72px' }}>
      <section className="max-w-7xl mx-auto px-4 md:px-6 pt-8 md:pt-12 pb-16 md:pb-20 space-y-12 md:space-y-16">

        {/* ── Ropa ──────────────────────────────────── */}
        <div>
          <SectionHeader eyebrow="EXPLORA" title="Nuestras Categorías" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5">
            {MAIN_CATEGORIES.map((cat, i) => (
              <CategoryCard key={cat.id} {...cat} index={i} />
            ))}
          </div>
        </div>

        {/* ── Accesorios ────────────────────────────── */}
        <div>
          <SectionHeader eyebrow="COLECCIÓN" title="Accesorios" delay={0.05} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5">
            {ACCESSORIES.map((cat, i) => (
              <CategoryCard key={cat.id} {...cat} index={i} />
            ))}
          </div>
        </div>

      </section>
    </main>
  )
}
