import { useState, useMemo, useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { CATEGORIES } from '../data/categories'
import { PRODUCTS } from '../data/products'
import FilterPills from '../components/ui/FilterPills'
import ProductCard from '../components/ui/ProductCard'

export default function CategoryPage() {
  const { category } = useParams()
  const config = CATEGORIES[category]
  const [activeFilter, setActiveFilter] = useState('Todos')

  // Reset filter when switching categories
  useEffect(() => {
    setActiveFilter('Todos')
  }, [category])

  if (!config) return <Navigate to="/" replace />

  const filtered = PRODUCTS.filter((p) => {
    if (p.category !== category) return false
    if (activeFilter === 'Todos') return true
    return p.subcategory === activeFilter
  })

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

        {/* Product grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} {...product} index={i} />
            ))}
          </div>
        ) : (
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
