import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getAllProducts } from '../lib/admin'
import AdminProductCard from '../components/admin/AdminProductCard'
import CreateProductModal from '../components/admin/CreateProductModal'

const CAT_FILTERS = [
  { value: 'todos',      label: 'Todos' },
  { value: 'hombre',     label: 'Hombre' },
  { value: 'mujer',      label: 'Mujer' },
  { value: 'accesorios', label: 'Accesorios' },
  { value: 'zapatos',    label: 'Zapatos' },
]

export default function AdminPage() {
  const [products,   setProducts]   = useState([])
  const [loading,    setLoading]    = useState(true)
  const [catFilter,  setCatFilter]  = useState('todos')
  const [subFilter,  setSubFilter]  = useState('Todos')
  const [showCreate, setShowCreate] = useState(false)

  useEffect(() => {
    getAllProducts()
      .then(data => setProducts(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // Reset subcategory filter when category changes
  useEffect(() => { setSubFilter('Todos') }, [catFilter])

  // Unique subcategories for the selected category
  const subcategories = useMemo(() => {
    const source = catFilter === 'todos' ? products : products.filter(p => p.category === catFilter)
    const unique = [...new Set(source.map(p => p.subcategory))].sort()
    return ['Todos', ...unique]
  }, [products, catFilter])

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (catFilter !== 'todos' && p.category !== catFilter) return false
      if (subFilter !== 'Todos' && p.subcategory !== subFilter) return false
      return true
    })
  }, [products, catFilter, subFilter])

  const counts = useMemo(() =>
    CAT_FILTERS.reduce((acc, f) => {
      acc[f.value] = f.value === 'todos'
        ? products.length
        : products.filter(p => p.category === f.value).length
      return acc
    }, {})
  , [products])

  function handleUpdated(updated) {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p))
  }

  function handleDeleted(id) {
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  function handleCreated(product) {
    setProducts(prev => [product, ...prev])
    setShowCreate(false)
  }

  return (
    <div className="min-h-screen bg-cream">

      {/* Header */}
      <header className="bg-charcoal sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-[60px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-serif text-lg tracking-[0.22em] text-surface">LINARA</span>
            <span className="text-surface/25 text-sm">|</span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-surface/50">Admin</span>
          </div>
          <Link to="/" className="text-[10px] tracking-[0.12em] uppercase text-surface/40 hover:text-surface/70 transition-colors">
            ← Tienda
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-serif text-3xl text-charcoal font-light">Productos</h1>
            <p className="text-xs text-warm-gray mt-0.5">{products.length} en total · {filtered.length} mostrando</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="bg-charcoal text-surface text-[10px] tracking-[0.15em] uppercase font-medium px-5 py-2.5 rounded-full hover:bg-charcoal-soft transition-colors cursor-pointer"
          >
            + Nuevo
          </button>
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-3" style={{ scrollbarWidth: 'none' }}>
          {CAT_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setCatFilter(f.value)}
              className={[
                'flex-shrink-0 px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap',
                catFilter === f.value ? 'bg-charcoal text-surface' : 'bg-pill text-charcoal-soft hover:bg-pill-hover',
              ].join(' ')}
            >
              {f.label}
              <span className={`ml-1.5 text-[9px] ${catFilter === f.value ? 'text-surface/60' : 'text-warm-gray-light'}`}>
                {counts[f.value]}
              </span>
            </button>
          ))}
        </div>

        {/* Subcategory filter — solo si hay más de 1 */}
        {subcategories.length > 2 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-8" style={{ scrollbarWidth: 'none' }}>
            {subcategories.map(s => (
              <button
                key={s}
                onClick={() => setSubFilter(s)}
                className={[
                  'flex-shrink-0 px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap',
                  subFilter === s
                    ? 'bg-accent-pale text-accent border border-accent-light'
                    : 'text-warm-gray hover:text-charcoal',
                ].join(' ')}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square rounded-xl bg-border mb-3" />
                <div className="h-3 bg-border rounded w-2/3 mb-2" />
                <div className="h-3 bg-border rounded w-1/3" />
              </div>
            ))}
          </div>
        )}

        {/* Grid — máximo 3 columnas */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {filtered.map(product => (
              <AdminProductCard
                key={product.id}
                product={product}
                onUpdated={handleUpdated}
                onDeleted={handleDeleted}
              />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-24">
            <p className="text-sm text-warm-gray font-light">No hay productos en esta categoría.</p>
          </div>
        )}
      </main>

      {showCreate && (
        <CreateProductModal
          onCreated={handleCreated}
          onClose={() => setShowCreate(false)}
        />
      )}
    </div>
  )
}
