import { useState, useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { CATEGORIES } from '../data/categories'
import { PRODUCTS as MOCK_PRODUCTS } from '../data/products'
import { supabase } from '../lib/supabase'
import FilterPills from '../components/ui/FilterPills'
import ProductCard from '../components/ui/ProductCard'

// Categorías que ya tienen datos reales en Supabase
const LIVE_CATEGORIES = new Set(['accesorios', 'zapatos', 'medias'])

export default function CategoryPage() {
  const { category } = useParams()
  const config = CATEGORIES[category]

  const [activeFilter, setActiveFilter] = useState(() => config?.filters[0] ?? 'Todos')
  const [products, setProducts]         = useState([])
  const [loading, setLoading]           = useState(false)

  // Reset filtro al cambiar de categoría — usa el primer filtro de esa categoría
  useEffect(() => {
    if (config) setActiveFilter(config.filters[0])
  }, [category])

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
