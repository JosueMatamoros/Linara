import { useState, useEffect } from 'react'
import { useParams, useSearchParams, Navigate, Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { CATEGORIES } from '../data/categories'
import { PRODUCTS as MOCK_PRODUCTS } from '../data/products'
import { supabase } from '../lib/supabase'
import FilterPills from '../components/ui/FilterPills'
import ProductCard from '../components/ui/ProductCard'

// Categorías que ya tienen datos reales en Supabase
const LIVE_CATEGORIES = new Set(['accesorios', 'zapatos', 'medias'])

// Categorías en construcción
const COMING_SOON = new Set(['hombre', 'mujer'])

function ComingSoonView({ config }) {
  return (
    <main className="min-h-screen bg-cream flex flex-col" style={{ paddingTop: '72px' }}>
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">

        {/* Línea decorativa + eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-4 mb-8"
        >
          <span className="h-px w-12 bg-accent/50" />
          <span className="text-[9px] tracking-[0.38em] text-warm-gray uppercase font-medium">
            Colección {config.title}
          </span>
          <span className="h-px w-12 bg-accent/50" />
        </motion.div>

        {/* Título */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-5xl md:text-7xl text-charcoal font-light mb-6 leading-none"
        >
          {config.title}
        </motion.h1>

        {/* Mensaje */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="text-base text-charcoal-soft font-light leading-relaxed max-w-xs mb-2"
        >
          Estamos seleccionando las mejores piezas para esta colección.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.28 }}
          className="text-sm text-warm-gray font-light mb-12"
        >
          Pronto tendremos novedades para vos.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.38 }}
        >
          <Link
            to="/accesorios"
            className="inline-flex items-center gap-2 bg-charcoal text-surface text-[10px] tracking-[0.22em] uppercase font-medium px-8 py-4 rounded-full hover:bg-charcoal-soft transition-colors duration-300 group"
          >
            Ver Accesorios
            <ArrowRight size={12} strokeWidth={1.5} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Decorativo inferior */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-20 flex items-center gap-3"
        >
          <span className="h-px w-6 bg-border" />
          <span className="text-[8px] tracking-[0.3em] text-warm-gray/40 uppercase">Linara · Originales</span>
          <span className="h-px w-6 bg-border" />
        </motion.div>
      </div>
    </main>
  )
}

export default function CategoryPage() {
  const { category } = useParams()
  const [searchParams] = useSearchParams()
  const config = CATEGORIES[category]

  const [activeFilter, setActiveFilter] = useState(() => {
    const fromUrl = searchParams.get('filter')
    const filters = config?.filters ?? []
    return (fromUrl && filters.includes(fromUrl)) ? fromUrl : (filters[0] ?? 'Todos')
  })
  const [products, setProducts]         = useState([])
  const [loading, setLoading]           = useState(false)

  // Reset filtro al cambiar de categoría respetando el param de URL
  useEffect(() => {
    if (config) {
      const fromUrl = searchParams.get('filter')
      const filters = config.filters ?? []
      setActiveFilter((fromUrl && filters.includes(fromUrl)) ? fromUrl : filters[0])
    }
  }, [category, searchParams])

  // Fetch desde Supabase si la categoría tiene datos reales, si no usa mock
  useEffect(() => {
    if (!category) return

    if (LIVE_CATEGORIES.has(category)) {
      setLoading(true)
      supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .then(({ data, error }) => {
          if (error) console.error(error)
          // Normaliza image_url → image para que ProductCard lo reciba bien
          setProducts((data ?? []).map((p) => ({ ...p, image: p.image_url })))
          setLoading(false)
        })
    } else {
      setProducts(MOCK_PRODUCTS.filter((p) => p.category === category))
    }
  }, [category])

  if (!config) return <Navigate to="/" replace />
  if (COMING_SOON.has(category)) return <ComingSoonView config={config} />

  const filtered = products.filter((p) =>
    activeFilter === 'Todos' ? true : p.subcategory === activeFilter
  )

  return (
    <main className="min-h-screen bg-cream" style={{ paddingTop: '72px' }}>
      <section className="max-w-7xl mx-auto px-6 py-12">

        {/* Header */}
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-6"
        >
          <h1 className="font-serif text-4xl md:text-5xl text-charcoal font-light mb-1.5">
            {config.title}
          </h1>
          <p className="text-sm text-warm-gray font-light">{config.description}</p>
        </motion.div>

        {/* Filters */}
        <div className="mb-8">
          <FilterPills
            filters={config.filters}
            active={activeFilter}
            onChange={setActiveFilter}
          />
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square rounded-xl bg-border mb-3" />
                <div className="h-3 bg-border rounded w-2/3 mb-2" />
                <div className="h-3 bg-border rounded w-1/3" />
              </div>
            ))}
          </div>
        )}

        {/* Grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} {...product} index={i} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <p className="text-warm-gray text-sm font-light">
              No hay productos en esta categoría todavía.
            </p>
          </motion.div>
        )}

      </section>
    </main>
  )
}
