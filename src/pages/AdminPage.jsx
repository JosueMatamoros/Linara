import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getAllProducts } from '../lib/admin'
import AdminProductCard from '../components/admin/AdminProductCard'
import CreateProductForm from '../components/admin/CreateProductForm'
import Pagination from '../components/ui/Pagination'

const ITEMS_PER_PAGE = 12

const CAT_FILTERS = [
  { value: 'accesorios', label: 'Accesorios' },
  { value: 'zapatos',    label: 'Zapatos' },
  { value: 'hombre',     label: 'Hombre' },
  { value: 'mujer',      label: 'Mujer' },
]

export default function AdminPage() {
  const [products,   setProducts]   = useState([])
  const [loading,    setLoading]    = useState(true)
  const [catFilter,  setCatFilter]  = useState('accesorios')
  const [subFilter,  setSubFilter]  = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [page,       setPage]       = useState(1)

  useEffect(() => {
    getAllProducts()
      .then(data => setProducts(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { setSubFilter(null); setPage(1) }, [catFilter])
  useEffect(() => { setPage(1) }, [subFilter])

  const subcategories = useMemo(() => {
    return [...new Set(
      products
        .filter(p => p.category === catFilter)
        .map(p => p.subcategory)
        .filter(Boolean)
    )].sort()
  }, [products, catFilter])

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (p.category !== catFilter) return false
      if (subFilter && p.subcategory !== subFilter) return false
      return true
    })
  }, [products, catFilter, subFilter])

  const counts = useMemo(() =>
    CAT_FILTERS.reduce((acc, f) => {
      acc[f.value] = products.filter(p => p.category === f.value).length
      return acc
    }, {})
  , [products])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

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

  function handlePageChange(p) {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-cream">

      {/* Header */}
      <header className="bg-charcoal sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-[56px] flex items-center justify-between">
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

        {showCreate ? (
          <CreateProductForm
            onCreated={handleCreated}
            onClose={() => setShowCreate(false)}
          />
        ) : (
          <>
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

            {/* Subcategory filter */}
            {subcategories.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-8" style={{ scrollbarWidth: 'none' }}>
                {subcategories.map(s => (
                  <button
                    key={s}
                    onClick={() => setSubFilter(prev => prev === s ? null : s)}
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
                  {paginated.map(product => (
                    <AdminProductCard
                      key={product.id}
                      product={product}
                      onUpdated={handleUpdated}
                      onDeleted={handleDeleted}
                    />
                  ))}
                </div>

                <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />

                {totalPages > 1 && (
                  <p className="text-center text-[10px] text-warm-gray tracking-widest mt-2">
                    Página {page} de {totalPages} · {filtered.length} productos
                  </p>
                )}
              </>
            )}

            {!loading && filtered.length === 0 && (
              <div className="text-center py-24">
                <p className="text-sm text-warm-gray font-light">No hay productos en esta categoría.</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
