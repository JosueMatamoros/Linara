import { useState } from 'react'
import { Trash2, X, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import {
  updatePrice, updateSubcategory, updateSizes, toggleStock, deleteProduct, updateCategory,
} from '../../lib/admin'
const CAT_LABELS = { hombre: 'Hombre', mujer: 'Mujer', accesorios: 'Accesorios', zapatos: 'Zapatos' }

export default function AdminProductCard({ product, subcategoriesMap = {}, onUpdated, onDeleted }) {
  const [p, setP]                       = useState(product)
  const [editingPrice,  setEditingPrice] = useState(false)
  const [editingSub,    setEditingSub]   = useState(false)
  const [editingCat,    setEditingCat]   = useState(false)
  const [priceInput,    setPriceInput]   = useState('')
  const [sizeInput,     setSizeInput]    = useState('')
  const [confirmDel,    setConfirmDel]   = useState(false)
  const [error,         setError]        = useState(null)

  function patch(fields) {
    const next = { ...p, ...fields }
    setP(next)
    onUpdated(next)
    return next
  }

  async function savePrice() {
    const val = parseFloat(priceInput)
    if (isNaN(val) || val < 0) { setEditingPrice(false); return }
    const prev = p.price
    patch({ price: val })
    setEditingPrice(false)
    try { await updatePrice(p.id, val) }
    catch (e) { patch({ price: prev }); setError(e.message) }
  }

  async function saveSub(val) {
    if (!val || val === p.subcategory) { setEditingSub(false); return }
    setEditingSub(false)
    const prev = p.subcategory
    patch({ subcategory: val })
    try { await updateSubcategory(p.id, val) }
    catch (e) { patch({ subcategory: prev }); setError(e.message) }
  }

  async function saveCat(newCat) {
    if (!newCat || newCat === p.category) { setEditingCat(false); return }
    setEditingCat(false)
    const firstSub = (subcategoriesMap[newCat] ?? [])[0] ?? ''
    const prevCat  = p.category
    const prevSub  = p.subcategory
    patch({ category: newCat, subcategory: firstSub })
    try { await updateCategory(p.id, newCat, firstSub) }
    catch (e) { patch({ category: prevCat, subcategory: prevSub }); setError(e.message) }
  }

  async function removeSize(size) {
    const prev = p.sizes
    const next = p.sizes.filter(s => s !== size)
    patch({ sizes: next })
    try { await updateSizes(p.id, next) }
    catch (e) { patch({ sizes: prev }); setError(e.message) }
  }

  async function addSize() {
    const val = sizeInput.trim()
    if (!val || p.sizes.includes(val)) { setSizeInput(''); return }
    const prev = p.sizes
    const next = [...p.sizes, val]
    patch({ sizes: next })
    setSizeInput('')
    try { await updateSizes(p.id, next) }
    catch (e) { patch({ sizes: prev }); setError(e.message) }
  }

  async function handleToggleStock() {
    const prev = p.in_stock
    patch({ in_stock: !prev })
    try { await toggleStock(p.id, !prev) }
    catch (e) { patch({ in_stock: prev }); setError(e.message) }
  }

  async function handleDelete() {
    try {
      await deleteProduct(p.id, p.image_url)
      onDeleted(p.id)
    } catch (e) { setError(e.message); setConfirmDel(false) }
  }

  const subcatOptions = subcategoriesMap[p.category] ?? []

  return (
    <>
      <motion.div layout className="cursor-default h-full flex flex-col">

        {/* Imagen */}
        <div className="relative aspect-square rounded-xl overflow-hidden bg-cream-subtle">
          {p.image_url
            ? <img
                src={p.image_url}
                alt={p.subcategory}
                className={`w-full h-full object-cover scale-105 transition-opacity duration-300 ${!p.in_stock ? 'opacity-50' : ''}`}
                loading="lazy"
              />
            : <div className="w-full h-full flex items-center justify-center text-warm-gray-light text-xs">Sin imagen</div>
          }

          {/* Categoría — top-left pegado a esquina */}
          {editingCat ? (
            <select
              autoFocus
              value={p.category}
              onChange={e => saveCat(e.target.value)}
              onBlur={() => setEditingCat(false)}
              className="absolute top-1.5 left-1.5 z-10 text-[9px] tracking-[0.12em] uppercase font-medium bg-surface/95 text-charcoal border border-border rounded-full px-2 py-0.5 outline-none cursor-pointer shadow-sm"
            >
              {Object.entries(CAT_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          ) : (
            <button
              onClick={() => setEditingCat(true)}
              title="Click para cambiar categoría"
              className="absolute top-1.5 left-1.5 z-10 inline-flex items-center gap-1 text-[9px] tracking-[0.12em] uppercase font-medium bg-surface/90 backdrop-blur-sm text-charcoal rounded-full px-2 py-0.5 shadow-sm hover:bg-accent-pale hover:text-accent transition-colors cursor-pointer"
            >
              {CAT_LABELS[p.category] ?? p.category}
              <ChevronDown size={9} strokeWidth={2} />
            </button>
          )}

          {/* Botón eliminar — top-right pegado a esquina */}
          <button
            onClick={() => setConfirmDel(true)}
            className="absolute top-1.5 right-1.5 w-7 h-7 bg-surface/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:scale-110 transition-all duration-150 group/del"
            aria-label="Eliminar producto"
          >
            <Trash2 size={12} strokeWidth={1.8} className="text-charcoal group-hover/del:text-red-500 transition-colors" />
          </button>

          {/* Toggle stock — pegado al borde inferior */}
          <button
            onClick={handleToggleStock}
            className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 w-[calc(100%-12px)] flex items-center justify-center gap-1.5 py-1 rounded-full text-[9px] tracking-[0.12em] uppercase font-medium backdrop-blur-sm transition-all duration-200 cursor-pointer border ${
              p.in_stock
                ? 'bg-emerald-50/90 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100/90'
                : 'bg-charcoal/75 text-surface border-transparent hover:bg-charcoal/90'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${p.in_stock ? 'bg-emerald-500' : 'bg-red-400'}`} />
            {p.in_stock ? 'Disponible' : 'Agotado'}
          </button>
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 gap-1.5 pt-3">

          {/* Subcategoría | Precio */}
          <div className="flex items-center justify-between gap-2">

            {editingSub ? (
              <select
                autoFocus
                value={p.subcategory}
                onChange={e => saveSub(e.target.value)}
                onBlur={() => setEditingSub(false)}
                className="text-[10px] tracking-[0.14em] uppercase font-medium text-warm-gray border-b border-warm-gray bg-transparent outline-none flex-1 min-w-0 cursor-pointer"
              >
                {subcatOptions.length > 0
                  ? subcatOptions.map(s => <option key={s} value={s}>{s}</option>)
                  : <option value={p.subcategory}>{p.subcategory}</option>
                }
              </select>
            ) : (
              <button
                onClick={() => setEditingSub(true)}
                className="text-[10px] tracking-[0.14em] uppercase font-medium text-warm-gray hover:text-accent transition-colors cursor-pointer text-left truncate"
                title="Click para cambiar subcategoría"
              >
                {p.subcategory}
              </button>
            )}

            {editingPrice ? (
              <div className="flex items-center gap-0.5 flex-shrink-0">
                <span className="text-sm font-semibold text-charcoal">₡</span>
                <input
                  autoFocus
                  type="number"
                  min="0"
                  step="0.01"
                  value={priceInput}
                  onChange={e => setPriceInput(e.target.value)}
                  onBlur={savePrice}
                  onKeyDown={e => { if (e.key === 'Enter') savePrice(); if (e.key === 'Escape') setEditingPrice(false) }}
                  className="text-sm font-semibold text-charcoal bg-accent-pale outline-none w-16 text-right rounded px-1"
                />
              </div>
            ) : (
              <button
                onClick={() => { setPriceInput(String(p.price)); setEditingPrice(true) }}
                className={`text-sm font-semibold flex-shrink-0 hover:text-accent transition-colors cursor-pointer ${
                  p.in_stock ? 'text-charcoal' : 'text-warm-gray-light line-through'
                }`}
                title="Click para editar precio"
              >
                ₡{Math.round(p.price).toLocaleString('es-CR')}
              </button>
            )}
          </div>

          {/* Tallas — mismas pills que ProductCard + X para quitar + input para agregar */}
          <div className="flex flex-wrap gap-1 items-center">
            {p.sizes.map(size => (
              <span
                key={size}
                className={`inline-flex items-center gap-1 text-[9px] border px-2 py-1 rounded leading-none ${
                  p.in_stock ? 'text-warm-gray border-border' : 'text-warm-gray-light border-border/50 line-through'
                }`}
              >
                {size}
                <button
                  onClick={() => removeSize(size)}
                  className="min-w-[20px] min-h-[20px] flex items-center justify-center text-warm-gray-light hover:text-red-400 transition-colors cursor-pointer"
                  aria-label={`Quitar talla ${size}`}
                >
                  <X size={10} strokeWidth={2.5} />
                </button>
              </span>
            ))}
            <input
              value={sizeInput}
              onChange={e => setSizeInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addSize()}
              placeholder="+ talla"
              className="text-xs border border-dashed border-border rounded-lg px-3 py-2 bg-transparent outline-none text-warm-gray placeholder:text-warm-gray-light w-20 focus:border-charcoal transition-colors"
            />
          </div>

          {error && <p className="text-[9px] text-red-400 leading-tight">{error}</p>}
        </div>
      </motion.div>

      {/* Modal confirmación eliminar */}
      <AnimatePresence>
        {confirmDel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 backdrop-blur-sm px-4"
            onClick={() => setConfirmDel(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 12 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              onClick={e => e.stopPropagation()}
              className="bg-surface rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center"
            >
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <Trash2 size={22} className="text-red-400" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-2xl text-charcoal font-light mb-2">¿Eliminar producto?</h3>
              <p className="text-sm text-warm-gray leading-relaxed mb-7">
                Esta acción no se puede deshacer. El producto y su imagen serán eliminados permanentemente.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDel(false)}
                  className="flex-1 py-3 rounded-full border border-border text-sm text-warm-gray hover:border-charcoal hover:text-charcoal transition-colors cursor-pointer font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-3 rounded-full bg-charcoal text-surface text-sm font-medium hover:bg-charcoal-soft transition-colors cursor-pointer"
                >
                  Eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
