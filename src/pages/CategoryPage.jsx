import { useState, useEffect, useMemo } from 'react'
import { useParams, useSearchParams, Navigate, Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { CATEGORIES } from '../data/categories'
import { supabase } from '../lib/supabase'
import FilterPills from '../components/ui/FilterPills'
import ProductCard from '../components/ui/ProductCard'
import Pagination from '../components/ui/Pagination'

const ITEMS_PER_PAGE = 12

function ComingSoonView({ config }) {
  return (
    <main className="min-h-screen bg-cream flex flex-col" style={{ paddingTop: '72px' }}>
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">

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

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-5xl md:text-7xl text-charcoal font-light mb-6 leading-none"
        >
          {config.title}
        </motion.h1>

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

  const [products,     setProducts]     = useState([])
  const [loading,      setLoading]      = useState(true)
  const [activeFilter, setActiveFilter] = useState(null)
  const [page,         setPage]         = useState(1)

  useEffect(() => {
    if (!category || !config) return
    setLoading(true)
    setProducts([])
    setActiveFilter(null)
    setPage(1)

    supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .then(({ data, error }) => {
        if (error) console.error(error)
        const loaded = (data ?? []).map(p => ({ ...p, image: p.image_url }))
        setProducts(loaded)

        const subcats = new Set(loaded.map(p => p.subcategory).filter(Boolean))
        const ordered = (config.filters ?? []).filter(f => subcats.has(f))
        const fromUrl = searchParams.get('filter')
        setActiveFilter((fromUrl && ordered.includes(fromUrl)) ? fromUrl : (ordered[0] ?? null))
      })
      .finally(() => setLoading(false))
  }, [category])

  // Reset page when filter changes
  useEffect(() => { setPage(1) }, [activeFilter])

  const availableFilters = useMemo(() => {
    const subcats = new Set(products.map(p => p.subcategory).filter(Boolean))
    return (config?.filters ?? []).filter(f => subcats.has(f))
  }, [products, config])

  const filtered = useMemo(() =>
    activeFilter ? products.filter(p => p.subcategory === activeFilter) : products
  , [products, activeFilter])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  function handlePageChange(p) {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!config) return <Navigate to="/" replace />
  if (!loading && products.length === 0) return <ComingSoonView config={config} />

  return (
    <main className="min-h-screen bg-cream pt-[54px] md:pt-[72px]">
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
        {availableFilters.length > 1 && (
          <div className="mb-8">
            <FilterPills
              filters={availableFilters}
              active={activeFilter}
              onChange={setActiveFilter}
            />
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square rounded-xl bg-border mb-3" />
                <div className="h-3 bg-border rounded w-2/3 mb-2" />
                <div className="h-3 bg-border rounded w-1/3" />
              </div>
            ))}
          </div>
        )}

        {/* Grid */}
        {!loading && paginated.length > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6">
              {paginated.map((product, i) => (
                <ProductCard key={product.id} {...product} index={i} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />

            {totalPages > 1 && (
              <p className="text-center text-[10px] text-warm-gray tracking-widest mt-2">
                Página {page} de {totalPages} · {filtered.length} productos
              </p>
            )}
          </>
        )}

        {/* Empty state */}
        {!loading && products.length > 0 && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <p className="text-warm-gray text-sm font-light">
              No hay productos en esta subcategoría todavía.
            </p>
          </motion.div>
        )}

      </section>
    </main>
  )
}
