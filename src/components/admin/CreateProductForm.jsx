import { useState, useRef } from 'react'
import { X, Upload, ArrowLeft } from 'lucide-react'
import { motion } from 'motion/react'
import { createProduct } from '../../lib/admin'
import { CATEGORIES } from '../../data/categories'

const CATEGORY_OPTIONS = Object.entries(CATEGORIES).map(([key, val]) => ({
  value: key,
  label: val.title,
  subcategories: val.filters.filter(f => f !== 'Todos'),
}))

export default function CreateProductForm({ onCreated, onClose }) {
  const [category,    setCategory]    = useState('accesorios')
  const [subcategory, setSubcategory] = useState('')
  const [price,       setPrice]       = useState('')
  const [sizes,       setSizes]       = useState([])
  const [sizeInput,   setSizeInput]   = useState('')
  const [imageFile,   setImageFile]   = useState(null)
  const [preview,     setPreview]     = useState(null)
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState(null)
  const fileRef = useRef()

  const currentSubs = CATEGORY_OPTIONS.find(c => c.value === category)?.subcategories ?? []

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  function addSize() {
    const t = sizeInput.trim()
    if (!t || sizes.includes(t)) { setSizeInput(''); return }
    setSizes(prev => [...prev, t])
    setSizeInput('')
  }

  function removeSize(s) {
    setSizes(prev => prev.filter(x => x !== s))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!subcategory) { setError('Selecciona una subcategoría'); return }
    if (!price || isNaN(parseFloat(price))) { setError('Ingresa un precio válido'); return }
    setError(null)
    setLoading(true)
    try {
      const product = await createProduct({ category, subcategory, price, sizes, imageFile })
      onCreated({ ...product, image: product.image_url })
    } catch (e) {
      setError(e.message)
    }
    setLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      {/* Back header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-warm-gray hover:text-charcoal transition-colors cursor-pointer group"
        >
          <ArrowLeft size={16} strokeWidth={1.5} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
          <span className="text-xs tracking-[0.15em] uppercase font-medium">Volver</span>
        </button>
        <span className="h-px flex-1 bg-border" />
      </div>

      <div className="max-w-2xl">
        <h2 className="font-serif text-3xl text-charcoal font-light mb-1">Nuevo Producto</h2>
        <p className="text-xs text-warm-gray mb-8">Completa los datos del producto</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* Image + Category row */}
          <div className="flex flex-col sm:flex-row gap-6">

            {/* Image upload */}
            <div className="flex-shrink-0">
              <label className="text-[10px] uppercase tracking-widest text-warm-gray block mb-2">Imagen</label>
              <div
                onClick={() => fileRef.current.click()}
                className="w-[180px] h-[180px] rounded-2xl overflow-hidden bg-cream-subtle border-2 border-dashed border-border hover:border-charcoal transition-colors cursor-pointer flex items-center justify-center"
              >
                {preview
                  ? <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  : (
                    <div className="flex flex-col items-center gap-2 text-warm-gray-light">
                      <Upload size={22} strokeWidth={1.5} />
                      <span className="text-[10px] tracking-widest uppercase">Subir imagen</span>
                    </div>
                  )
                }
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
              {imageFile && (
                <p className="text-[9px] text-warm-gray mt-1.5 text-center max-w-[180px] truncate">
                  {imageFile.name}
                </p>
              )}
            </div>

            {/* Category + Subcategory */}
            <div className="flex-1 flex flex-col gap-5">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-warm-gray block mb-1.5">Categoría</label>
                <select
                  value={category}
                  onChange={e => { setCategory(e.target.value); setSubcategory('') }}
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-charcoal bg-surface outline-none focus:border-charcoal transition-colors cursor-pointer"
                >
                  {CATEGORY_OPTIONS.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-warm-gray block mb-1.5">Subcategoría</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {currentSubs.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSubcategory(s)}
                      className={`px-3 py-1 text-xs rounded-full transition-colors cursor-pointer ${
                        subcategory === s ? 'bg-charcoal text-surface' : 'bg-pill text-charcoal-soft hover:bg-pill-hover'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={subcategory}
                  onChange={e => setSubcategory(e.target.value)}
                  placeholder="O escribe una nueva..."
                  className="w-full border-b border-border bg-transparent outline-none py-1.5 text-sm text-charcoal placeholder:text-warm-gray-light"
                />
              </div>
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-warm-gray block mb-1.5">Precio</label>
            <div className="flex items-center gap-2 border border-border rounded-xl px-4 py-2.5 focus-within:border-charcoal transition-colors">
              <span className="text-sm text-warm-gray font-light">₡</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="0.00"
                className="flex-1 bg-transparent outline-none text-sm text-charcoal placeholder:text-warm-gray-light"
              />
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-warm-gray block mb-1.5">Tallas</label>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {sizes.map(s => (
                <span key={s} className="inline-flex items-center gap-1 text-xs border border-border px-3 py-1 rounded-full text-charcoal-soft">
                  {s}
                  <button
                    type="button"
                    onClick={() => removeSize(s)}
                    className="text-warm-gray-light hover:text-red-400 cursor-pointer ml-0.5"
                  >
                    <X size={10} strokeWidth={2.5} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-3 border border-border rounded-xl px-4 py-2.5 focus-within:border-charcoal transition-colors">
              <input
                type="text"
                value={sizeInput}
                onChange={e => setSizeInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSize())}
                placeholder="Ej: S, M, L, 40, Único..."
                className="flex-1 bg-transparent outline-none text-sm text-charcoal placeholder:text-warm-gray-light"
              />
              <button
                type="button"
                onClick={addSize}
                className="text-[10px] tracking-widest uppercase text-warm-gray hover:text-charcoal cursor-pointer flex-shrink-0"
              >
                + Agregar
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-50 px-4 py-2.5 rounded-xl">{error}</p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 sm:flex-none sm:min-w-[160px] bg-charcoal text-surface text-xs tracking-[0.15em] uppercase font-medium py-3.5 rounded-full hover:bg-charcoal-soft transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Creando...' : 'Crear Producto'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none sm:min-w-[120px] border border-border text-charcoal-soft text-xs tracking-[0.15em] uppercase font-medium py-3.5 rounded-full hover:border-charcoal hover:text-charcoal transition-colors cursor-pointer"
            >
              Cancelar
            </button>
          </div>

        </form>
      </div>
    </motion.div>
  )
}
