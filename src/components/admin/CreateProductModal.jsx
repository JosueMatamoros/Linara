import { useState, useRef } from 'react'
import { X, Upload } from 'lucide-react'
import { motion } from 'motion/react'
import { createProduct } from '../../lib/admin'
import { CATEGORIES } from '../../data/categories'

const CATEGORY_OPTIONS = Object.entries(CATEGORIES).map(([key, val]) => ({
  value: key,
  label: val.title,
  subcategories: val.filters.filter(f => f !== 'Todos'),
}))

export default function CreateProductModal({ onCreated, onClose }) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="relative bg-surface rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-serif text-xl text-charcoal font-light">Nuevo Producto</h2>
          <button onClick={onClose} className="text-warm-gray hover:text-charcoal transition-colors cursor-pointer">
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-5">

          {/* Image upload */}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-warm-gray block mb-2">Imagen</label>
            <div
              onClick={() => fileRef.current.click()}
              className="aspect-square w-full max-w-[160px] mx-auto rounded-xl overflow-hidden bg-cream-subtle border-2 border-dashed border-border hover:border-charcoal transition-colors cursor-pointer flex items-center justify-center"
            >
              {preview
                ? <img src={preview} alt="preview" className="w-full h-full object-cover scale-105" />
                : <div className="flex flex-col items-center gap-1 text-warm-gray-light">
                    <Upload size={20} strokeWidth={1.5} />
                    <span className="text-[10px]">Subir imagen</span>
                  </div>
              }
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            {imageFile && <p className="text-[9px] text-warm-gray text-center mt-1">{imageFile.name} · Se convertirá a WebP</p>}
          </div>

          {/* Category */}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-warm-gray block mb-1.5">Categoría</label>
            <select
              value={category}
              onChange={e => { setCategory(e.target.value); setSubcategory('') }}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm text-charcoal bg-surface outline-none focus:border-charcoal transition-colors cursor-pointer"
            >
              {CATEGORY_OPTIONS.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Subcategory */}
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
              className="w-full border-b border-border bg-transparent outline-none py-1 text-sm text-charcoal placeholder:text-warm-gray-light"
            />
          </div>

          {/* Price */}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-warm-gray block mb-1.5">Precio</label>
            <div className="flex items-center gap-1 border-b border-border pb-1">
              <span className="text-sm text-warm-gray">$</span>
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
            <div className="flex flex-wrap gap-1 mb-2">
              {sizes.map(s => (
                <span key={s} className="inline-flex items-center gap-0.5 text-[10px] border border-border px-2 py-0.5 rounded text-warm-gray">
                  {s}
                  <button type="button" onClick={() => removeSize(s)} className="text-warm-gray-light hover:text-red-400 cursor-pointer ml-0.5">
                    <X size={9} strokeWidth={2.5} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={sizeInput}
                onChange={e => setSizeInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSize())}
                placeholder="Ej: S, M, L, 40, Único..."
                className="flex-1 border-b border-border bg-transparent outline-none py-0.5 text-xs text-charcoal placeholder:text-warm-gray-light"
              />
              <button type="button" onClick={addSize} className="text-[10px] text-warm-gray hover:text-charcoal cursor-pointer">
                + Agregar
              </button>
            </div>
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-charcoal text-surface text-xs tracking-[0.15em] uppercase font-medium py-3 rounded-full hover:bg-charcoal-soft transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Creando...' : 'Crear Producto'}
          </button>

        </form>
      </motion.div>
    </div>
  )
}
